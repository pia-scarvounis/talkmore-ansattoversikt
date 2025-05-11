//Denne ruteren er for når admin endrer noe i historikken på en ansatt
import {  Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";
//middleware admin
import { authenticateToken, requireAdmin } from "../../AuthenticateUsers/AuthMiddleware.js";

const router = Router();
dotenv.config();

//Post histotikk skjer i employee put rute når man endrer en ansatt- da legges det til i historikken

//Endre historikk med changeLog id
router.patch('/:changleLog_id', authenticateToken, requireAdmin, async (req, res) => {

    const {changeLog_id} = req.params;
    const fields = [];
    const values = [];

    //felter fra historikk loggen disse skal brukes ved endring av historikk fra gammel verdi til ny verdi
    const allowedFields = 
    ['field_changed', 'old_value', 'new_value'];

    for(const field of allowedFields){
        if(field in req.body){
            //pusher inn field i fields
            fields.push(`${field} = ?`);
            //pusher verdiene fra body i values
            values.push(req.body[field]);
        }
      
    }
    if(fields.length === 0){
        return res.status(400).json({error: 'ingen gyldige felter å oppdatere'});
    }
     try{

        await pool.query(
            `UPDATE changeLog SET ${(fields.join(', '))} WHERE changeLog_id = ?`,
            [...values, changeLog_id]
        );
        res.status(200).json({message: 'Historikk oppdatert'});

     }catch(err){
        console.error('Feil ved oppdatering av historikk', err);
        res.status(500).json({error:'Kunne ikke oppdatere historikk'});
    }

});

//Delete ruter for å slette felt i historikken??? man kan kun endre bør ikke slette felt i historikk

export default router;