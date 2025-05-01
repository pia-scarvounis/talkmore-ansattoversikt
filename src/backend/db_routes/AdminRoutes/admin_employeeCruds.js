import {  Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";
import axios from "axios";
//API genesys
import platformClient from 'purecloud-platform-client-v2';
//Token for API genesys
import {getOAuthToken} from '../../apiGenesysAuth/authTokenGenesys.js'
//henter full employe detaljer fra backend
import {getFullEmployeeById} from '../../Funksj_støtte/getFullEmpUpdatet.js'

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
    const amdinId = req.user?.user_id || 1 //hente fra middleware senere men får nå henter admin id fra databasen employee_id 7 er admin
    
    if (!updatedData || typeof updatedData !== 'object') {
        return res.status(400).json({ error: 'Ingen data å oppdatere' });
      }
      console.log("Request body:", req.body);

    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toISOString().split('T')[0];
      };
     
      //må legge inn transasksjon for å rullere tilbake om feil og ungå feil i duplikat av epost -gpt
      const conn = await pool.getConnection();
    try{

        await conn.beginTransaction();

        const[existingResult] = await conn.query(`SELECT * FROM employee WHERE employee_id = ?`,[id]);
        if(existingResult.length === 0) {
            await conn.rollback();
            return res.status(404).json({error: 'Ansatt ikke funnet'});
        }
        //henter originale ansatte er de ansatte som finnes i employee tabellen /før endring 
        //Hvis ikke epost blir endret
        const original = existingResult[0];
        //Sjekk epost så man ikke får duplikat i endringen eller om epost ikke er endret
        //fikse dynamisk oppdatering
        const fields = [];
        const values = [];

        const originalEpost = (original.epost || '').trim().toLowerCase();

        const newEpost = (updatedData.epost || original.epost || '').toLowerCase();

        console.log('🟨 Epost-sjekk:');
        console.log('Ny epost (trim/lower):', newEpost);
        console.log('Original epost (trim/lower):', originalEpost);
        console.log('Employee ID:', id);


        if(newEpost && newEpost !== (originalEpost || '').toLowerCase()){
            const [emailCheck] = await conn.query(
                `SELECT employee_id FROM employee WHERE epost = ? AND employee_id != ?`,
                [newEpost, Number(id)]
            );
            if(emailCheck.length > 0){
                await conn.rollback();
                return res.status(400).json({error: 'Eposten er allerede i bruk av en annen ansatt'});
                
            }else{
                fields.push('epost = ?');
                values.push(newEpost);
            }
        }
        // Sjekk og legg til navn
        if (updatedData.employee_name && updatedData.employee_name !== original.employee_name) {
        fields.push('employee_name = ?');
        values.push(updatedData.employee_name);
        }   

        // Legg til andre felter som har blitt endret
        const keysToCheck = [
        'epost_Telenor', 'phoneNr', 'birthdate', 'image_url',
        'start_date', 'end_date', 'form_of_employeement', 'employeeNr_Talkmore',
        'employeeNr_Telenor', 'employee_percentages', 'team_id', 'workPosistion_id'
        ];
        //for loop setter inn fields
        for(const key of keysToCheck){
            const newValue = updatedData[key];
            const originalValue = original[key];

            if(newValue !== undefined && String(newValue) !== String(originalValue)){
                fields.push(`${key} = ?`);
                values.push(['birthdate', 'start_date', 'end_date'].includes(key) ? formatDate(newValue): newValue);
            }
        }

          if(fields.length > 0){
            const sql =
                `UPDATE employee
                SET ${fields.join(', ')}
                WHERE employee_id = ?`;

                values.push(id);
                await conn.query(sql, values);
                console.log('Ansatt oppdatert');
          }else{
            console.log('Ingen endringer i employee')
          }
        
        //Oppdater pårørende (relative)
        if(Array.isArray(updatedData.relative)){
            //Fjerner tidligere relativ maks 1 pårørende per ansatt
            await conn.query(`DELETE FROM relative WHERE employee_id = ?`,[id]);
            for(const r of updatedData.relative){
                await conn.query(
                    `INSERT INTO relative (employee_id, relative_name, relative_phoneNr)
                    VALUES (?, ?,?)`,[id, r.relative_name, r.relative_phoneNr]
                );
            }
        }
        //Oppdater permisjon (employeeLeave) hvis finnes
        let leaveId = null;
        if(updatedData.leave){
            //Fjerner tidligere permisjon hvis endringer
            await conn.query(`DELETE FROM employeeLeave WHERE employee_id = ?`, [id]);


            const [leaveResult] = await conn.query(
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
            const [leaveResult] = await conn.query(`
                SELECT * FROM employeeLeave WHERE employee_id = ?`, [id]);
                if(leaveResult.length > 0){
                    leaveId = leaveResult[0].leave_id;
                }
        }
        //oppdatere lisenser for ansatt
        if(Array.isArray(updatedData.licenses)){
            //fjerner lisenser og setter inn nye
            await conn.query(`DELETE FROM employee_license WHERE employee_id = ?`,[id]);
            for(const license of updatedData.licenses){
                await conn.query(
                    `INSERT INTO employee_license (employee_id, license_id)
                    VALUES (?, ?)`,
                    [id, license.license_id]
                );
            }
        }
        //Denne skal insert inn i changelog tabellen /historikk for ansatt
        await conn.query(`
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
            updatedData.leave?.leave_percentage || original.leave_percentage,
            formatDate(updatedData.leave?.leave_start_date) || null,
            formatDate(updatedData.leave?.leave_end_date) || null
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
            //oppdater genesys_verision id i databasen med den oppdaterte verdien i version
            await conn.query(`
                UPDATE employee
                SET genesys_version = ?
                WHERE employee_id = ?
            `,[updatedUser.version, id]);

            console.log(`Oppdatert i Genesys: ${currentUser}`);
        }catch(genesysError){
            console.error('Feil ved oppdatering i Genesys', genesysError);
        }
        
    
    }
    //returnere oppdatert ansatt med hjelpefunksjonen getfullemployeebyid
    const updatedEmployee = await getFullEmployeeById(conn, id);

    await conn.commit();
    
    res.status(200).json({
        message:'Ansatt, pårørendende, permisjon og genesys oppdatert',
        employee: updatedEmployee  
     
    });

    }catch(err){
        await conn.rollback();
        console.error('Feil ved oppdatering av ansatt:', err);
        res.status(500).json({error: 'Kunne ikke oppdatere ansatt'});
    }finally{
        conn.release();
    }

});

export default router;