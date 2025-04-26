import {  Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";
import axios from "axios";
//API genesys
import platformClient from 'purecloud-platform-client-v2';
//Token for API genesys
import {getOAuthToken} from '../../apiGenesysAuth/authTokenGenesys.js'

const router = Router();

const usersApi = new platformClient.UsersApi();
const apiInstance = platformClient.ApiClient.instance;

//Ruter for å endre en ansatt og sette endringene og verdiene i historikken til den endrede ansatte
//Kilder til å endre ansatt i api genesys også er hentet fra GPT
router.put('employee/:id', async (req, res) => {
    const { id } = req.params;
    //ny info fra body 
    const updatedData = req.body;
    const amdinId = req.user?.user_id || 7 //hente fra middleware senere men får nå henter admin id fra databasen employee_id 7 er admin

    try{

        const[existingResult] = await pool.query(`SELECT * FROM employee WHERE employee_id = ?`,[id]);
        if(existingResult.length === 0) {
            return res.status(404).json({error: 'Ansatt ikke funnet'});
        }
        //henter originale ansatte er de ansatte som finnes i employee tabellen /før endring
        const original = existingResult[0];
        //Oppdater employee
        await pool.query(`
            UPDATE employee
            SET 
                employee_name = ?, epost = ?, epost_Telenor = ?, phoneNr = ?, birthdate = ?,
                image_url = ?, start_date = ?, end_date = ?, form_of_employeement = ?, 
                employeeNr_Talkmore = ?, employeeNr_Telenor = ?, 
                employee_percentages = ?, team_id = ? , workPosistion_id
            WHERE employee_id = ?
        `, [
            //Setter || denne for hvis ikke ny info er lagt inn bruk originale info å sett inn databasen
            updatedData.employee_name || original.employee_name,
            updatedData.epost || original.epost,
            updatedData.epost_Telenor || original.epost_Telenor,
            updatedData.phoneNr ||original.phoneNr,
            updatedData.birthdate || original.birthdate,
            updatedData.image_url || original.image_url,
            updatedData.start_date || original.start_date,
            updatedData.end_date || original.end_date,
            updatedData.form_of_employeement || original.form_of_employeement,
            updatedData.employeeNr_Talkmore || original.employeeNr_Talkmore,
            updatedData.employeeNr_Telenor || original.employeeNr_Telenor,
            updatedData.employee_percentages || original.employee_percentages,
            updatedData.team_id || original.team_id,
            updatedData.workPosistion_id || original.workPosistion_id,
            id
        ]);
        //Oppdater pårørende (relative)
        if(Array.isArray(updatedData.relative)){
            //Fjerner tidligere relativ maks 1 pårørende per ansatt
            await pool.query(`DELETE FROM relative WHERE employee_id = ?`,[id]);
            for(const r of updatedData.relative){
                await pool.query(
                    `INSERT INTO relative (employee_id, relative_name)
                    VALUES (?, ?)`,[id, r.relative_name]
                );
            }
        }
        //Oppdater permisjon (employeeLeave)
        if(updatedData.leave){
            //Fjerner tidligere permisjon hvis endringer
            await pool.query(`DELETE FROM employeeLeave WHERE employee_id = ?`, [id]);

            await pool.query(
                `INSERT INTO employeeLeave (employee_id, leave_percentage, leave_start_date, leave_end_date)
                VALUES (?, ?, ?, ?)`
                ,[
                    id, 
                    updatedData.leave.leave_percentages,
                    updatedData.leave.leave_start_date,
                    updatedData.leave.leave_end_date
                ]
            );
        }
        //oppdatere lisenser for ansatt
        if(Array.isArray(updatedData.licenses)){
            //fjerner lisenser og setter inn nye
            await pool.query(`DELETE FROM employee_license WHERE employee_id = ?`,[id]);
            for(const license of updatedData.licenses){
                await pool.query(
                    `INSERT INTO employee_license (employee_id, license_id)
                    VALUES (?, ?)`,
                    [id, license.license_id]
                );
            }
        }
        //Denne skal insert inn i changelog tabellen /historikk for ansatt
        await pool.query(`
            INSERT INTO changeLog (
                employee_id, admin_id, 
                employeeNr_Talkmore, employeeNr_Telenor, 
                department_id, team_id, workPosistion_id,
                form_of_employement, employee_percentages,
                start_date, end_date,
                leave_id, leave_percentages, leave_start_date, leave_end_date
                )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?)
        `,[
            id,
            amdinId,
            updatedData.employeeNr_Talkmore || original.employeeNr_Talkmore,
            updatedData.employeeNr_Telenor || original.employeeNr_Telenor,
            updatedData.department_id || original.department_id,
            updatedData.team_id || original.team_id,
            updatedData.workPosistion_id || original.workPosistion_id,
            updatedData.employee_percentages || original.employee_percentages,
            updatedData.start_date || original.start_date,
            updatedData.end_date || original.end_date,
            updatedData.leave_id || original.leave_id,
            updatedData.leave_percentages || original.leave_percentages,
            updatedData.leave_start_date || original.leave_start_date,
            updatedData.leave_end_date || original.leave_end_date
        ]);

        //Oppdatere ansatt i api genesys hvis endring i navn eller epost
        //genesys_user_id link mellom api og databasen
        if(original.genesys_user_id){
            //henter inn token
            const accessTokenGen = await getOAuthToken();
            apiInstance.setAccessToken(accessTokenGen);

            const updateUser = {
                version: original.genesys_version,
                name: updatedData.employee_name || original.employee_name,
                email: updatedData.epost || original.epost
            };
            //variabel som holder på den oppdaterte ansatte
            const updatedUser = await usersApi.patchUser(original.genesys_user_id, updateUser);
            console.log(`Oppdatert i Genesys: ${original.genesys_user_id}`);

            //oppdater genesys_verision id i databasen med den oppdaterte verdien i version
            await pool.query(`
                UPDATE employee
                SET genesys_version = ?
                WHERE employee_id = ?
            `,[updatedUser.version, id]);
        }
        res.status(200).json({message:'Ansatt, pårørendende, permisjon og genesys oppdatert'});

    }catch(err){
        console.error('Feil ved oppdatering av ansatt:', err);
        res.status(500).json({error: 'Kunne ikke oppdatere ansatt'});
    }

});

export default router;