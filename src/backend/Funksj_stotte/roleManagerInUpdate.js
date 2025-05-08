import bcrypt from 'bcrypt';
import { DEFAULT_TEST_PASSWORD } from '../config/config.js';


//Denne filen inneholder logikk og sjekker for oppdatering av ansatt / støttefunksjon
//Når en admin endrer en ansatt fra Admin/Teamleder eller til Admin/Teamleder
//Eller hvis uhell skjer med at en ansatt har fått admin rolle og det skulle være Kundeagent

const privelegedRoles = ['Admin', 'Teamleder'];

export async function handleUserRoleChange (conn, employeeId, originalPosId, newPosId, epost){
    const [posData] = await conn.query(
        //Finner stillingstittel Admin og Teamleder fra employee_id (employeeId)
        `SELECT workPosistion_id, posistion_title
        FROM workPosistion
        WHERE workPosistion_id IN (?, ?)`,
        [originalPosId, newPosId]
    );

    //Eldre tittel før endring, setter data  
    const oldTitle = posData.find(p => p.workPosistion_id === originalPosId)?.posistion_title || "";
    //Ny tittel 
    const newTitle = posData.find(p => p.workPosistion_id === newPosId)?.posistion_title || "";

    //hvis rolle = har tilgang
    const isPrivileged = roles => privelegedRoles.includes(roles);
    
    //Sjekker rolle/stillingstittel

    //Hvis en ansatt får ny Admin/Teamleder stllingtittel i endringene etc.
    if(isPrivileged(newTitle) && !isPrivileged(oldTitle)){
        //Finner ansatt hvis den eksisterer
        const [existingUser] = await conn.query(
            `SELECT * FROM userOfTool 
            WHERE employee_id = ?`,
            [employeeId]
        );

        //krypterer passord
        const hashedPassword = await bcrypt.hash(DEFAULT_TEST_PASSWORD, 10);

        //Hvis ansatt eksisterer i userOfTool fra tidligere med aktivert false etc.
        //Eller oppdatert andre felter for admin/teameder som epost/brukernavn
        //oppdaterer passord hvis null ved endring til Teamleder/admin
        if(existingUser.length > 0) {
            await conn.query(
                `UPDATE userOfTool
                SET active = true, roles = ?, password_hash = COALESCE(password, ?)
                WHERE employee_id = ?`,
                [newTitle, hashedPassword, employeeId]
            );
            //hvis ikke bruker finnes fra før i userOfTool
        }else{
            await conn.query(
                `INSERT INTO userOfTool (roles, username, password_hash, active, is_test, employee_id)
                VALUES (?, ?, ?, true, true, ?)`,
                [newTitle, epost?.toLowerCase(),hashedPassword, employeeId]
            );
           
        }
        console.log(`${newTitle} bruker opprettet eller aktivert`);

    //hvis ansatt får ny stillingstittel som ikke er admin/teamleder
    }else{
        if(existingUser){
            //oppdater bruker og sette active til false = ingen admin/teamleder rettigheter
        await conn.query(
            `UPDATE userOfTool
            SET active = false
            WHERE employee_id`,
            [employeeId]
        );
        console.log('Bruker av verktøy deaktivert');
        }
    
       
    }
}