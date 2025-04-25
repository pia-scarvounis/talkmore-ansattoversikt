import { application, json, Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";
import axios from "axios";

dotenv.config();

const router = Router();


// Denne ruterene skal hente total oversikt på antall ansatte samt fte
//Den skal droppe ansatte som har permisjon eller har sluttet i visningen og fte
//selv om en ansatt er 30% skal den vises her og beregnes
//Vi har en annen ruter som skal vise faktiske ansatte som innlogget/på jobb

router.get('/dayOverviewEmployees', async (req, res) =>{

    try{

        const selectedDate = req.query.date ? new Date(req.query.date) : new date();
        const dateString = selectedDate.toISOString().split('T')[0];

        const [rows] = await pool.query(`
            SELECT
                e.employee_id,
                e.employee_name,
                e.epost,
                e.birthdate,
                e.form_of_employeement,
                e.employee_percentage,
                e.employeeNr_Talkmore,
                e.employeeNr_Telenor,
                e.end_date,
                wp.posistion_title AS workPosistion_title,
                t.team_name,
                l.leave_start_date,
                l.leave_end_date,
            FROM employee e
            LEFT JOIN workPosistion wp ON e.workPosistion_id = wp.workPosistion_id
            LEFT JOIN team t ON e.team_id = t.team_id
            LEFT JOIN employeeLeave l ON e.employee_id = l.employee_id
        `);

    }catch{

    }
})
