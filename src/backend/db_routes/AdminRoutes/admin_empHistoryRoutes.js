//Denne ruteren er for når admin endrer noe i historikken på en ansatt
import {  Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";

const router = Router();
dotenv.config();

//Post histotikk skjer i employee put rute når man endrer en ansatt- da legges det til i historikken

//Endre historikk med changeLog id
router.patch('/history/:changleLog_id', async (req, res) => {

    const {changeLog_id} = req.params;
    const fields = [];
    const values = [];

    const allowedFields = 
    ['department_id', 'team_id', 'workPosistion_id'
    , 'form_of_employeement', 'employee_percentages',  
    'start_date', 'end_date',
    'leave_percentage', 'leave_start_date', 'leave_end_date'
    ];

    for(const field of allowedFields){
        if(field in req.body){
            //setter inn feltene i []
            fields.push(`${field} = ?`);
            //henter inn verdien fra body og setter inn felt
            values.push(req.body[field]);
        }
    }
    if(fields.length === 0){
        return res.status(400).json({error: 'ingen gyldige felter å oppdatere'});
    }
     try{

        await pool.query(
            `UPDATE changeLog SET ${(fields.join(', '))} WHERE changeLog_id`,
            [...values, id]
        );
        res.status(200).json({message: 'Historikk oppdatert'});

     }catch(err){
        console.error('Feil ved oppdatering av historikk', err);
        res.status(500).json({error:'Kunne ikke oppdatere historikk'});
    }

});

//Delete ruter for å slette felt i historikken??? man kan kun endre bør ikke slette felt i historikk

export default router;