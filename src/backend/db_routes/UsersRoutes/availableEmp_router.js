import { application, json, Router } from "express";
import dBpool from "../../config/db.js";
import dotenv from "dotenv";
import pool from "../../config/db.js";
import axios from "axios";

dotenv.config();

const router = Router();

//GPT uke dato til å sette inn ansatte som er tilgjengelig/ på jobb
const getWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  };
  

//hjelpefunksjoner til random innlogging fra Mandag-Lørdag 
const shouldWorkToday = (employeeId, percentage, date) => {
    //0= søndag, 1= mandag og 6= lørdag
    const weekday = date.getDay();
    if(weekday === 0) return false;

    // Hvor mange dager i uka som kan jobbes, 
    //100% stillinger = fast hver dag man-fre
    //under 100% stillinger, eks 50% = 3 dager random plassert mellom man-fre
    // kilde GPT
    const daysPerWeek = percentage === 100 ? 5 : Math.round((percentage / 100) * 6)

   // Generer "stabile" pseudo-random dager basert på uke og ansatt-ID
    const hash = (employeeId + '-' + week).replace(/\D/g, '').slice(0, 8);
    const seed = parseInt(hash, 10);

    // Lag en liste over dagene 1–6 (man–lør)
    const allDays = [1, 2, 3, 4, 5, 6];

    // Bland dagene "tilfeldig" men konsistent for samme uke og ID
    const shuffled = [...allDays].sort((a, b) => {
    const valA = (seed + a * 31) % 100;
    const valB = (seed + b * 31) % 100;
    return valA - valB;
    });

    const workDays = shuffled.slice(0, daysPerWeek); // Velg f.eks. 3 av 6 dager

    return workDays.includes(weekday);
}

//Simulert pålogging, if true betyr ansatt er tilgjengelig for den datoen
const isLoggedInToday = (employeeId, date) => {
    const hash = (employeeId + date.toISOString()).replace(/\D/g, '').slice(0, 6);
    const rand = parseInt(hash) % 100;
    return rand < 85; // 85% sjanse hvis man skulle jobbet
}


//Denne sjekker hvilken database navn vi bruker
const [dbResult] = await pool.query("SELECT DATABASE() AS db");
console.log("Koden kjører mot databasen:", dbResult[0].db);

//Denne ruteren henter tilgjengelige ansatte for å vise i de gønne boksene på dashbordet
router.get('/', async (req, res) => {
    try{
        //henter valgt dato i request eller ny valgt dato
        const selectedDate = req.query.date ? new Date (req.query.date) : new Date ();
        //Gjør om dato til iso string
        const dateString = selectedDate.toISOString().split('T')[0];

        const [rows] = await pool.query(`
        SELECT 
            e.employee_id,
            e.name,
            e.form_of_employeement,
            e.employee_percentages,
            e.workPosistion_id,
            wp.posistion_title AS workPosistion_title,
            e.team_id,
            t.team_name,
            l.leave_start_date,
            l.leave_end_date
        FROM employee e
        LEFT JOIN workPosistion wp ON e.workPosistion_id = wp.workPosistion_id
        LEFT JOIN team t ON e.team_id = t.team_id
        LEFT JOIN employeeLeave l ON e.employee_id = l.employee_id
    `);

        const result = rows.map(row => {
        const isOnLeave = row.leave_start_date && row.leave_end_date &&
            new Date(dateString) >= new Date(row.leave_start_date) &&
            new Date(dateString) <= new Date(row.leave_end_date);

        const shouldWork = !isOnLeave && shouldWorkToday(row.employee_id, row.employee_percentages, selectedDate);
        const isLoggedIn = shouldWork ? isLoggedInToday(row.employee_id, selectedDate) : false;

        return {
            employee_id: row.employee_id,
            name: row.name,
            form_of_employeement: row.form_of_employeement,
            employee_percentages: row.employee_percentages,
            workPosistion_title: row.workPosistion_title,
            team_name: row.team_name,
            is_on_leave: isOnLeave,
            is_working_today: shouldWork,
            is_logged_in: isLoggedIn
      };
    });

        res.status(200).json(result);
        console.log(`Employee ${employeeId} jobber disse dagene denne uka:`, workDays);


    }catch(err){
        console.error('Feil ved henting av tlgjengelige ansatte i dashbord ansatte', err);
        res.status(500).json({message: 'Noe gikk galt', error: err.message});
    }
})
export default router;