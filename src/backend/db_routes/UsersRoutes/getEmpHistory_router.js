import dotenv from "dotenv";
import pool from "../../config/db.js";

//hente historikken til den valgte ansatte
router.get('/:id', async (req, res) =>{
    const {id} = req.params;

    try{
        //Henter bruker sin historikk med admin navn og id som har endret sortert etter siste endring
        const [history] =await pool.query(`
            SELECT
                cl.*,
                u.username AS endret_av,
                e.employee_name AS endret_av_navn
            FROM changelog cl
            JOIN userOfTool u ON cl.admin_id = u.user_id
            JOIN employee e ON u.employee_id = e.employee_id
            WHERE cl.employee_id = ?
            ORDER BY cl.change_date DESC
        `,[id]);

        res.status(200).json(history);

    }catch(err){
        console.error('Feil ved henting av historikk:',err);
        res.status(500).json({error: 'kunne ikke hente historikk'});
    }
})