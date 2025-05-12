//Denne ruteren er for når admin endrer noe i historikken på en ansatt
import { Router } from "express";
import dotenv from "dotenv";
import pool from "../../config/db.js";
//middleware admin
import { authenticateToken, requireAdmin } from "../../AuthenticateUsers/AuthMiddleware.js";

const router = Router();
dotenv.config();

//Post histotikk skjer i employee put rute når man endrer en ansatt- da legges det til i historikken

//Endre historikk med changeLog id
router.patch("/:changeLog_id",authenticateToken, requireAdmin, async (req, res) => {
  const { changeLog_id } = req.params;
  const fields = [];
  const values = [];

  //felter fra historikk loggen disse skal brukes ved endring av historikk fra gammel verdi til ny verdi
  const allowedFields = ["field_changed", "old_value", "new_value"];

  for (const field of allowedFields) {
    if (field in req.body) {
      //pusher inn field i fields
      fields.push(`${field} = ?`);
      //pusher verdiene fra body i values
      values.push(req.body[field]);
    }
    if(fields.length === 0){
        return res.status(400).json({error: 'ingen gyldige felter å oppdatere'});
    }
     try{

        await pool.query(
            `UPDATE changeLog SET ${(fields.join(', '))} WHERE changeLog_id = ?`,
            [...values, changeLog_id]
        );
        //Setter inn i de nye endringene i feltene i employee tabellen
        //henter changelog med changelog id og employee_id som skal brukes videre til å sette inn i emp tabellen
        const [[logRow]] = await pool.query(
            `SELECT employee_id, field_changed, new_value FROM changeLog WHERE changeLog_id = ?`,
            [changeLog_id]
        );
        
        const employeeId = logRow.employee_id;
        const field = logRow.field_changed;
        const value = logRow.new_value;

        const employeeFields = [
            'start_date', 'end_date', 'team_id', 'workPosistion_id',
            'form_of_employeement', 'employee_percentages'
        ];
        if(employeeFields.includes(field)) {
            await pool.query(
                `UPDATE employee SET ${field} = ? WHERE employee_id = ?`,
                [value, employeeId]
            );
        }
        
        //hvis permisjon er endret i historikken
        if (field === 'permisjon') {
            // trekk ut prosent og dato fra tekst, f.eks. "50% fra 2023-01-01 til 2023-06-01"
            const match = value.match(/(\d+)% fra (\d{4}-\d{2}-\d{2}) til (\d{4}-\d{2}-\d{2})/);
            if (match) {
              const [, percentage, start, end] = match;
              await pool.query(`
                UPDATE employeeLeave 
                SET leave_percentage = ?, leave_start_date = ?, leave_end_date = ?
                WHERE employee_id = ?
              `, [percentage, start, end, employeeId]);
            }
          }

        res.status(200).json({message: 'Historikk oppdatert'});

     }catch(err){
        console.error('Feil ved oppdatering av historikk', err);
        res.status(500).json({error:'Kunne ikke oppdatere historikk'});
    }
}
});

//Delete ruter for å slette felt i historikken??? man kan kun endre bør ikke slette felt i historikk

export default router;
