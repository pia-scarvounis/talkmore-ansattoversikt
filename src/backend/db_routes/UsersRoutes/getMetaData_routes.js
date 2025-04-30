import {Router} from 'express';
import pool from '../../config/db.js';
import dotenv from 'dotenv';

const router = Router();
dotenv.config();

//Hente alle avdelinger
router.get('/departments', async (req, res) =>{
    try{
        const [departments] = await pool.query(`
            SELECT * FROM department
        `)
        res.json(departments);
    }catch(err){
        console.error('Feil ved henting av avdelinger', err);
        res.status(500).json({error:'Noe gikk galt'})
    }
})

//Hente alle Team og join med department tabellen
router.get('/teams', async (req, res) => {
    try{
        const [teams] = await pool.query(`
        SELECT team.*, department.department_name
        FROM team
        JOIN department ON team.department_id = department.department_id
        `);
        res.json(teams)

    }catch(err){
        console.error('Feil ved henting av team', err);
        res.status(500).json({error: 'noe gikk galt'})
    }
})

//Hente alle stillinger
router.get('/posistions', async (req, res) =>{
    try{
        const [posistions] = await pool.query(`
            SELECT * FROM workPosistion
        `);
        res.json(posistions);

    }catch(err){
        console.error('Feil ved henting av stillinger');
        res.status(500).json({error:'Noe gikk galt'})
    }
})

export default router;