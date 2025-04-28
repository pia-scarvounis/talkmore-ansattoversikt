import {  Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";
import axios from "axios";
//API genesys
import platformClient from 'purecloud-platform-client-v2';
//Token for API genesys
import {getOAuthToken} from '../../apiGenesysAuth/authTokenGenesys.js'

const router = Router();
dotenv.config();

const apiInstance = platformClient.ApiClient.instance;
const usersApi = new platformClient.UsersApi();

//Ruter for å endre en ansatt og sette endringene og verdiene i historikken til den endrede ansatte
//Kilder til å endre ansatt i api genesys også er hentet fra GPT
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    //ny info fra body 
    const updatedData = req.body;
    const amdinId = req.user?.user_id || 10 //hente fra middleware senere men får nå henter admin id fra databasen employee_id 7 er admin
    
    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toISOString().split('T')[0];
      };
      
    try{

        const[existingResult] = await pool.query(`SELECT * FROM employee WHERE employee_id = ?`,[id]);
        if(existingResult.length === 0) {
            return res.status(404).json({error: 'Ansatt ikke funnet'});
        }
        //henter originale ansatte er de ansatte som finnes i employee tabellen /før endring 
        //Hvis ikke epost blir endret
        const original = existingResult[0];

        //fikse dynamisk oppdatering
        const fields = [];
        const values = [];

        if (updatedData.employee_name && updatedData.employee_name !== original.employee_name) {
            fields.push('employee_name = ?');
            values.push(updatedData.employee_name);
          }
        
        //Sjekk epost så man ikke får duplikat i endringen eller om epost ikke er endret
        const newEpost = (updatedData.epost || original.epost || '').toLowerCase();
        const originalEpost = (original.epost || '').trim().toLowerCase();

        if(newEpost !== originalEpost){
            const [emailCheck] = await pool.query(
                `SELECT employee_id FROM employee WHERE epost = ? AND employee_id != ?`,
                [newEpost, id]
            );

            if(emailCheck.length > 0){
                return res.status(400).json({error: 'Eposten er allerede i bruk av en annen ansatt'});
            }
            fields.push('epost = ?');
            values.push(newEpost);
        }
        if (updatedData.epost_Telenor !== original.epost_Telenor) {
            fields.push('epost_Telenor = ?');
            values.push(updatedData.epost_Telenor);
          }
      
          if (updatedData.phoneNr !== original.phoneNr) {
            fields.push('phoneNr = ?');
            values.push(updatedData.phoneNr);
          }
      
          if (updatedData.birthdate !== original.birthdate) {
            fields.push('birthdate = ?');
            values.push(formatDate(updatedData.birthdate));
          }
      
          if (updatedData.image_url !== original.image_url) {
            fields.push('image_url = ?');
            values.push(updatedData.image_url);
          }
      
          if (updatedData.start_date !== original.start_date) {
            fields.push('start_date = ?');
            values.push(formatDate(updatedData.start_date));
          }
      
          if (updatedData.end_date !== original.end_date) {
            fields.push('end_date = ?');
            values.push(updatedData.end_date ? formatDate(updatedData.end_date) : null);
          }
      
          if (updatedData.form_of_employeement !== original.form_of_employeement) {
            fields.push('form_of_employeement = ?');
            values.push(updatedData.form_of_employeement);
          }
      
          if (updatedData.employeeNr_Talkmore !== original.employeeNr_Talkmore) {
            fields.push('employeeNr_Talkmore = ?');
            values.push(updatedData.employeeNr_Talkmore);
          }
      
          if (updatedData.employeeNr_Telenor !== original.employeeNr_Telenor) {
            fields.push('employeeNr_Telenor = ?');
            values.push(updatedData.employeeNr_Telenor);
          }
      
          if (updatedData.employee_percentages !== original.employee_percentages) {
            fields.push('employee_percentages = ?');
            values.push(updatedData.employee_percentages);
          }
      
          if (updatedData.team_id !== original.team_id) {
            fields.push('team_id = ?');
            values.push(updatedData.team_id);
          }
      
          if (updatedData.workPosistion_id !== original.workPosistion_id) {
            fields.push('workPosistion_id = ?');
            values.push(updatedData.workPosistion_id);
          }
          
          if(fields.length > 0){
            const sql =
                `UPDATE employee
                SET ${fields.join(', ')}
                WHERE employee_id = ?`;

                values.push(id);
                await pool.query(sql, values);
                console.log('Ansatt oppdatert');
          }else{
            console.log('Ingen endringer i employee')
          }
        //Oppdater employee
        await pool.query(`
            UPDATE employee
            SET 
                employee_name = ?, epost = ?, epost_Telenor = ?, phoneNr = ?, birthdate = ?,
                image_url = ?, start_date = ?, end_date = ?, form_of_employeement = ?, 
                employeeNr_Talkmore = ?, employeeNr_Telenor = ?, 
                employee_percentages = ?, team_id = ? , workPosistion_id = ?
            WHERE employee_id = ?
        `, [
            //Setter || denne for hvis ikke ny info er lagt inn bruk originale info å sett inn databasen
            updatedData.employee_name || original.employee_name,
            updatedData.epost || original.epost,
            updatedData.epost_Telenor || original.epost_Telenor,
            updatedData.phoneNr ||original.phoneNr,
            formatDate(updatedData.birthdate) || formatDate(original.birthdate),
            updatedData.image_url || original.image_url,
            formatDate(updatedData.start_date) || formatDate(original.start_date),
            formatDate(updatedData.end_date) || formatDate(original.end_date),
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
        //Oppdater permisjon (employeeLeave) hvis finnes
        let leaveId = null;
        if(updatedData.leave){
            //Fjerner tidligere permisjon hvis endringer
            await pool.query(`DELETE FROM employeeLeave WHERE employee_id = ?`, [id]);


            const [leaveResult] = await pool.query(
                `INSERT INTO employeeLeave (employee_id, leave_percentage, leave_start_date, leave_end_date)
                VALUES (?, ?, ?, ?)`
                ,[
                    id, 
                    updatedData.leave.leave_percentage,
                    updatedData.leave.leave_start_date,
                    updatedData.leave.leave_end_date
                ]
            );
            leaveId = leaveResult.insertId; // får ny id
        }else{
            //hvis ikke ny hent eksisterende
            const [leaveResult] = await pool.query(`
                SELECT * FROM employeeLeave WHERE employee_id = ?`, [id]);
                if(leaveResult.length > 0){
                    leaveId = leaveResult[0].leave_id;
                }
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
                form_of_employeement, employee_percentages,
                start_date, end_date,
                leave_id, leave_percentage, leave_start_date, leave_end_date
                )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?)
        `,[
            id,
            amdinId,
            updatedData.employeeNr_Talkmore || original.employeeNr_Talkmore,
            updatedData.employeeNr_Telenor || original.employeeNr_Telenor,
            updatedData.department_id || original.department_id,
            updatedData.team_id || original.team_id,
            updatedData.workPosistion_id || original.workPosistion_id,
            updatedData.form_of_employeement || original.form_of_employeement,
            updatedData.employee_percentages || original.employee_percentages,
            formatDate(updatedData.start_date) || formatDate(original.start_date),
            formatDate(updatedData.end_date) || formatDate(original.end_date),
            updatedData.leave_id || original.leave_id,
            updatedData.leave_percentage || original.leave_percentage,
            formatDate(updatedData.leave_start_date) || null,
            formatDate(updatedData.leave_end_date) || null
        ]);

        //Oppdatere ansatt i api genesys hvis endring i navn eller epost
        //genesys_user_id link mellom api og databasen
        if(original.genesys_user_id){
            //henter inn token
            const accessTokenGen = await getOAuthToken();
            console.log('AccessToken hentet fra Genesys:', accessTokenGen); // 👈 Legg til denne linjen
            apiInstance.setAccessToken(accessTokenGen);

            try{

             //må hente bruker før vi setter den i update user
            const currentUser = await usersApi.getUser(original.genesys_user_id);
            console.log('Genesys User ID vi prøver å oppdatere', original.genesys_user_id);

            const updateUser = {
                name: updatedData.employee_name || currentUser.name,
                email: updatedData.epost || currentUser.email,
                version: currentUser.version
            };
            console.log('Oppdateringsdata som sendes til Genesys:', updateUser);

            //variabel som holder på den oppdaterte ansatte
            const updatedUser = await usersApi.patchUser(currentUser, updateUser);
            console.log(`Oppdatert i Genesys: ${currentUser}`);

            if(!updatedData.employee_name || !updatedData.epost){
                return res.status(400).json({
                    error: 'Både navn og epost må være satt i for å oppdatere i genesys'
                });
            }
        
            //oppdater genesys_verision id i databasen med den oppdaterte verdien i version
            await pool.query(`
                UPDATE employee
                SET genesys_version = ?
                WHERE employee_id = ?
            `,[updatedUser.version, id]);

        }catch(genesysError){
            console.error('Feil ved oppdatering i Genesys', genesysError);
        }
    }
        res.status(200).json({message:'Ansatt, pårørendende, permisjon og genesys oppdatert'});

    }catch(err){
        console.error('Feil ved oppdatering av ansatt:', err);
        res.status(500).json({error: 'Kunne ikke oppdatere ansatt'});
    }

});

export default router;