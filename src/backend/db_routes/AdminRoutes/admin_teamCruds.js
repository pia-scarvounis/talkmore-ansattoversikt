// rutere for Admin cruds på team
import {Router} from 'express';
import pool from   '../../config/db.js'

const router = Router();


router.post('/team', async (req, res) => {
    const {team_name, department_id } = req.body;

    if(!team_name || !department_id){
        return res.status(400).json({message: 'team_name og department_id er påkrevd'});
    }
    try{
        const [result] = await pool.query(
            `INSERT INTO team (team_name, department_id) VALUES (?, ?)`,
            [team_name, department_id]
        );
        res.status(201).json({team_id: result.insertId, team_name, department_id});

    }catch(err){
        console.error('[POST/ team] Feil', err);
        res.status(500).json({message: 'Feil vd oppretting av team'});
    }
});