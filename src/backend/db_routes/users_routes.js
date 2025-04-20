import { application, json, Router } from "express";
import dBpool from "../config/db.js";
import dotenv from "dotenv";
import pool from "../config/db.js";
import axios from "axios";
//Token for API genesys
import {getOAuthToken} from '../apiGenesysAuth/authTokenGenesys.js'
//vi skal importere en autentisering middleware for alle brukere av vårt verktøy

//Disse rutene skal gjelde for begge brukere av vårt verktøy (admin + teamleder)

dotenv.config();

const router = Router();

//Denne sjekker hvilken database navn vi bruker
const [dbResult] = await pool.query("SELECT DATABASE() AS db");
console.log("Koden kjører mot databasen:", dbResult[0].db);

 //funksjon random id fra en tabell (fk)
async function getRandomId(idField, table){
    const [rows] = await pool.query(`SELECT ${idField} FROM ${table}`);
    if(rows.length === 0) throw new Error(`Ingen rader i ${table}`);
    const randomRow = rows[Math.floor(Math.random()* rows.length)];
    return randomRow[idField];
}

const formOptions = ['Fast', 'Innleid'];
//funksjon sjekk om employee er Admin,Teamleder eller KA, Admin+Teamledere skal ha deafult 100% stilling
async function getRandomWorkPosistionTitle(){
    const [rows] = await pool.query(`SELECT workPosistion_id, posistion_title FROM workPosistion `);
    console.log('Rows from database:', rows);
    if(rows.length === 0) throw new Error('Ingen stillinger i databasen');
    const randomRow = rows[Math.floor(Math.random()*rows.length)];
    return randomRow;
}

async function fetchAllGenEmployees(token){
    let allGenEmployees = [];
    //Start uri, bruker next uri for å hente alle ansatte fra genesys uten å håndtere sidetelling
    let nextUri = '/api/v2/users?pageSize=25&pageNumber=1';

    while(nextUri){
        const response = await axios.get(`https://api.mypurecloud.de${nextUri}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }); 
        console.log('Genesys API respons:', response.data);
        //legger inn ansatte som er hentet til listen []
        allGenEmployees= allGenEmployees.concat(response.data.entities);
        // oppdaterer neste uri
        nextUri = response.data.nextUri;
    }
    return allGenEmployees;
}

//API Genesys implementasjon
//Hente ut alle brukere fra API genesys og hvis det ikke ligger i vår database, legg dem til. 
router.get('/', async (req, res) => {
    try{
        //hente brukere fra ekstern API Genesys med api nøkkel
        const accessTokenGen = await getOAuthToken();

        const genesysApiEmployees = await fetchAllGenEmployees(accessTokenGen);

   
        //Sjekk om ansatt finnes i databasen
        const employees = await Promise.all(
            genesysApiEmployees.map(async (employee) => {
                const[rows] = await pool.query(
                `SELECT employee_id, employee_name FROM employee WHERE epost = ?`, [employee.email]
            );
            //Hvis epost/ ansatte finnes returnerer den fra databasen
            if(rows.length > 0){
                //hente employee id fra ansatt hvis den finnes
                const employee_id = rows[0].employee_id;

                //hente employee id velge employee fra databasen
                const[relative] = await pool.query(
                    `SELECT*FROM relative WHERE employee_id = ?`,
                    [employee_id]
                );
                return{
                    ...employee,
                    ...rows[0],
                    relative: relative || []
                };  
            }
            //Hvis ikke ansatt matcher eller finnes i databasen opprett tillegssinformasjon
            const randomPhone = `+45${Math.floor(10000000 + Math.random() * 8999999)}`;
            const randomBirthday = () => new Date(1980 + Math.random() * 21, Math.random() * 12, Math.random() * 28 | 0)
                    .toISOString().split('T')[0];
            const birthdate = randomBirthday();
            /*const randomFormOfEmployement = formOptions[Math.floor(Math.random()*formOptions.length)];*/
            const randomStartDate = () => new Date(2010, 0, 1 + Math.random() * ((Date.now() - new Date(2010, 0, 1)) / 86400000) | 0).toISOString().split('T')[0];
            const start_date = randomStartDate();
            const randomEndDate = null;
            const end_date = randomEndDate;
            const employeNr_TM = Math.floor(Math.random()* 9000) + 1000;
            const employeNr_TN = Math.floor(Math.random()* 9000) + 1000;

            //gyldig id fra tabeller FK foreign key (parametere til getRandomId(idField, table))
            const team_id = await getRandomId('team_id','team');
            // Hent team_name basert på team_id
            const [teamRows] = await pool.query(
                'SELECT team_name FROM team WHERE team_id = ?',
                [team_id]
            );
            const team_name = teamRows[0]?.team_name || 'Ukjent team';
  
            const workPos =  await getRandomWorkPosistionTitle();
            const workPosistion_id = workPos.workPosistion_id;
            const workPos_title = workPos.posistion_title;

            let employee_percentages = 100;
            let form_of_employeement = 'Fast';
            //Logikk til å sette fast på Admin og Teamleder mens kundeagenter skal få random
            //form_of_employeement
            if (workPos_title.toLowerCase() === "kundeagent") {
                employee_percentages = Math.floor(Math.random() * 91) + 10; // 10–100
                form_of_employeement =
                  formOptions[Math.floor(Math.random() * formOptions.length)];
              } else if (
                workPos_title.toLowerCase() === "admin" ||
                workPos_title.toLowerCase() === "teamleder"
              ) {
                employee_percentages = 100;
                form_of_employeement = "Fast";
              }


            if(workPos_title === 'kundeAgent'){
                employee_percentages = Math.floor(Math.random() * 51) + 50;
            }

            //Legge til random tileggsinformasjon til ansatte i databasen for test
            //dette skal settes inn i tabell Employee (databasen)
            const[result] = await pool.query(
                `INSERT INTO employee(
                    employee_name, epost, phoneNr, birthdate, image_url, start_date, end_date,
                    form_of_employeement, employeeNr_Talkmore, employeeNr_Telenor, 
                    employee_percentages, is_test, team_id, workPosistion_id, 
                    team_name, workPosistion_title
                ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[
                    employee.name,
                    employee.email,
                    randomPhone,
                    birthdate,
                    null,
                    start_date,
                    end_date,
                    form_of_employeement,
                    employeNr_TM,
                    employeNr_TN,
                    employee_percentages,
                    true,
                    team_id,
                    workPosistion_id,
                    team_name,
                    workPos_title    
                ]
            );
            const employee_id = result.insertId;
            //hente relative for nye ansatte (tom liste)
            const [relative] = await pool.query(
                `SELECT * FROM relative WHERE employee_id = ?`,
                [employee_id]
              );

            return{
                ...employee,
                dbId: result.id,
                name:employee.name,
                epost: employee.email,
                phoneNr: randomPhone,
                birthdate: birthdate,
                image_url: null,
                start_date: start_date,
                end_date: end_date,
                form_of_employeement: form_of_employeement,
                employeeNr_Talkmore: employeNr_TM,
                employeeNr_Telenor: employeNr_TN,
                employee_percentages:employee_percentages,
                is_test: true,
                team_id: team_id,
                team_name: team_name,
                workPosistion_id: workPosistion_id,
                workPos_title: workPos_title,
                relative: relative || []
            };
        })
    );
        res.status(200).json(employees);

    }catch(err){
        console.error('Feil i synkroniseringen:',err);
        res.status(500).json({error: 'Noe gikk galt'});
    }
});

export default router;