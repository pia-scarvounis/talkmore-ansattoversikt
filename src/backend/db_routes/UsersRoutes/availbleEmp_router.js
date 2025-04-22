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
const workToday = (employeeId, percentage, date) => {
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
    
}


//Denne sjekker hvilken database navn vi bruker
const [dbResult] = await pool.query("SELECT DATABASE() AS db");
console.log("Koden kjører mot databasen:", dbResult[0].db);


router.get('/', async (req, res) => {

})