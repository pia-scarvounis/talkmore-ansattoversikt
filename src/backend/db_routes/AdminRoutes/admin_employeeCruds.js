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
        const original = existingResult[0];

        await pool.query(`
            UPDATE employee
            SET 
                employee_name = ?, epost = ?, epost_Telenor = ?, phoneNr = ?, birthdate = ?,
                image_url = ?, start_date = ?, end_date = ?, form_of_employeement = ?, 
                employeeNr_Talkmore = ?, employeeNr_Telenor = ?, 
                employee_percentages = ?, team_id = ? , workPosistion_id
            WHERE employee_id = ?
        `, [

        ])



    }catch{

    }

})