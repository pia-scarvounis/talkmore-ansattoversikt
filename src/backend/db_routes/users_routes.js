import { Router } from "express";
import db from "../config/db";
import dotenv from "dotenv";
//vi skal importere en autentisering middleware for alle brukere av vårt verktøy

//Disse rutene skal gjelde for begge brukere av vårt verktøy (admin + teamleder)

dotenv.config();

const router = Router();

 //funksjon random id fra tabell (fk)
async function getRandomId(table, idField){
    const[rows] =  db.query(`SELECT ${idField} FROM ${table}`);
    if(rows.length === 0) throw new Error(`Ingen rader i ${table}`);
    const randomRow = rows[Math.floor(Math.random()* rows.length)];
    return randomRow[idField];
}
const formOptions = ['Fast', 'Innleid'];

//funksjon sjekk om employee er Admin,Teamleder eller KA, Admin+Teamledere skal ha deafult 100% stilling
async function getRandomWorkPosistionTitle(){
    const [rows] = db.query(`SELECT workPosistion_id, posistion_title FROM workPosistion `);
    if(rows.length === 0) throw new Error('Ingen stillinger i databasen');
    const randomRow = rows[Math.floor(Math.random()*rows.length)];
    return randomRow;
}
const workPos = getRandomWorkPosistionTitle();
const workPosistion_id = workPos.workPosistion_id;
const title = workPos.posistion_title;

let employee_percentages = 100;

if(title === 'kundeAgent'){
    employee_percentages = Math.floor(Math.random() * 51) + 50;
}

//Hente ut alle brukere fra API genesys og vår database
router.get('/', async (req, res) => {
   
    try{
        //hente brukere fra ekstern API Genesys med api nøkkel
    const {data: genesysApiEmployees} = await axios.get('https://api.mypurecloud.de/api/v2/users', {
        headers: {
            Authorization: 'Bearer ${process.env.API_KEY}'
          }
    });
    //Sjekk om ansatt finnes i databasen
    const employees = await Promise.all(
        genesysApiEmployees.map(async (employee) => {
            const[rows] =  db.query(
                `SELECT id, name FROM employee WHERE epost = ?`, [employee.email]
            );
            //Hvis epost finnes returnerer den fra databasen

            if(rows.length > 0){
                return{
                    ...employee,
                    ...rows[0]
                };
            }
            //Hvis ikke bruker matcher /finnes i databasen opprett tillegssinformasjon
            const randomPhone = `+45${Math.floor(10000000 + Math.random() * 8999999)}`;
            const randomBirthday = () => new Date(1980 + Math.random() * 21, Math.random() * 12, Math.random() * 28 | 0)
                    .toISOString().split('T')[0];
            const randomFormOfEmployement = formOptions[Math.floor(Math.random()*formOptions.length)];
            const randomStartDate = () => new Date(2010, 0, 1 + Math.random() * ((Date.now() - new Date(2010, 0, 1)) / 86400000) | 0).toISOString().split('T')[0];
            const randomEndDate = null;
            const employeNr_TM = Math.floor(Math.random()* 9000) + 1000;
            const employeNr_TN = Math.floor(Math.random()* 9000) + 1000;

            //gyldig id fra tabeller FK foreign key (parametere til getRandomId(idField, table))
            const team_id = getRandomId('team','team_id');
           
            //dette skal settes inn i tabell Employee (databasen)
            const[result] = db.query(

                `INSERT INTO employee(
                    employee_name, epost, phoneNr, birthdate, image_url, start_date, end_date,
                    form_of_employeement, employeeNr_Talkmore, employeeNr_Telenor, 
                    employee_percentages, is_test, team_id, workPosistion_id
                ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[
    
                    employee.name,
                    employee.email,
                    randomPhone,
                    randomBirthday,
                    null,
                    randomStartDate,
                    randomEndDate,
                    randomFormOfEmployement,
                    employeNr_TM,
                    employeNr_TN,
                    employee_percentages,
                    true,
                    team_id,
                    workPosistion_id
                ]
            );

            return{
                ...employee,
                dbId: result.id,
                phoneNr: randomPhone,
                birthdate: randomBirthday,
                image_url: null,
                start_date: randomStartDate,
                end_date: randomEndDate,
                form_of_employeement: randomFormOfEmployement,
                employeeNr_Talkmore: employeNr_TM,
                employeeNr_Telenor: employeNr_TN,
                employee_percentages:employee_percentages,
                is_test: true,
                team_id: team_id,
                workPosistion_id: workPosistion_id

            };
        })
    );

    }catch(err){
        console.error('Feil i synkroniseringen:',err);
        res.status(500).json({error: 'Noe gikk galt'});
    }
});


//Legge til random tileggsinformasjon til ansatte for test
module.exports = router;