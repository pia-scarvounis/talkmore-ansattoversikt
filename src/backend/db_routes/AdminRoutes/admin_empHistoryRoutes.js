//Denne ruteren er for når admin endrer noe i historikken på en ansatt
import {  Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";

const router = Router();
dotenv.config();

//Endre historikk med changeLog id
router.put('/history/:changleLog_id', async (req, res) => {

    const {changeLog_id} = req.params;

    const {
        department_id,
        team_id,
        workPosistion_id,
        form_of_employeement,
        employee_percentages,
        start_date,
        end_date,
        leave_percentage,
        leave_start_date,
        leave_end_date
    } = req.body;

    try{
        const [result] = await pool.query(`
            UPDATE changeLog
            SET
                department_id = ?,
                team_id = ?,
                workPosistion_id = ?,
                form_of_employeement = ?,
                employee_percentages = ?,
                start_date = ?,
                end_date = ?,
                leave_percentage = ?,
                leave_start_date = ?,
                leave_end_date = ?
            WHERE changeLog_id = ?
        `, [
            department_id,
            team_id,
            workPosistion_id,
            form_of_employeement,
            employee_percentages,
            start_date,
            end_date,
            leave_percentage,
            leave_start_date,
            leave_end_date,
            changeLog_id
        ]);

        if(result.affectedRows === 0){
            return res.status(404).json({error: 'Fant ikke historikk post med angitt changeLog id'});
        }
        res.status(200).json({message: 'Historikk oppdatert'});

    }catch(err){
        console.error('Feil ved oppdatering av historikk', err);
        res.status(500).json({error:'Kunne ikke oppdatere historikk'});
    }

});

//Delete ruter for å slette felt i historikken??? man kan kun endre bør ikke slette felt i historikk


export default router;