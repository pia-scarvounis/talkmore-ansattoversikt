import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

//definerer ruter i modulær undergruppe ikke bruke app.use men router.post i db.js
const router = express.Router();

//LOGIN RUTE 

router.post('/login', async (req, res) =>{
    const { username, password } = req.body;

    try{
        //hent bruker fra userOfTool tabellen
        const [rows] = await pool.query(
            `SELECT * FROM userOfTool WHERE username = ? AND active = true`,
            [username]
        );

        const user = rows[0];

        if(!user || !user.password_hash){
            return res.status(401).json({message:'Ugyldig brukernavn eller passord'});
        }

        //sjekk passord mot hashed passord at det er gyldig
        const isMatch = await bcrypt.compare(password, user.password_hash);
        //hvis ikke passord matcher
        if(!isMatch){
            return res.status(401).json({message:'Ugyldig brukernavn eller passord'});
        }

        const token = jwt.sign(
            {
                userId: user.user_id,
                username: user.username,
                role: user.roles.toLowerCase() //ADMIN / TEAMLEDER
            },
            
                JWT_SECRET,
                { expiresIn: '3h'}
        );
        res.json({token})

    }catch(err){
        console.err('Feil under innlogging:', err);
        res.status(500).json({message:'Serverfeil'});
    }
});

export default router;