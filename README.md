
# EmployeeMore – Administrasjonssystem for Talkmore Kundeservice

Dette prosjektet er et fullstack HR-system utviklet som eksamens-/prosjektoppgave. Applikasjonen håndterer ansatte, tilganger, stillinger, permisjoner og historikk, og er bygget med:

| Teknologi         | Bruksområde                 |
|-------------------|-----------------------------|
| React             | Brukergrensesnitt           |
| Redux Toolkit     | Tilstandshåndtering         |
| MySQL             | Databaselagring             |
| Express / Node.js | Backend API                 |
| Axios             | API-kall og datainnhenting  |
| Genesys Cloud API | (valgfritt) Synk ansatte fra ekstern tjeneste |

# installer avhengiheter 
npm install

# Type 
: module i package.json

# opprett miljøfil i env
# Legg inn dine egene testverdier 
DB_USER= 
DB_PASSWORD= 
DB_DATABASE_NAME= 
 

JWT_SECRET= 
DEFAULT_TEST_PASSWORD= 
 

CLIENT_ID= x -- 
CLIENT_SECRET= x --

 # sette opp databaseskjema 
 mysql -u root -p < schema.sql

 # Starte servere 
 npm start - > server 3000 (backend)
 npm run dev -> server 5173 (frontend)

 # Cron Job 

 - Henter mockdata av navn og epost istedenfor Genesys brukere (hvis ingen genesys nøkler i env)
        --- Cron Job synkronisering (hente ansatte) kjører hvert 2 minutt
        (Vent til cron job henter ansatte)

 - Fjerner ansatte + lisens tilganger ,på ansatte som har slutt dato fra       ansattlisten
        --- Cron Job synkronisering (dekativerer ansatt) kjører hvert 5 minutt

 # Innlogging 
 Systemet har to roller :

    - Admin (Adminstrator full tilgang)
    - Teamleder (Leserolle inkludert tilgang på crud (notater))

 Du kan logge inn med et av testbrukerene i "userOfTool", helt nederst i sql-scriptet kjør 1 gang: 
 SELECT * FROM userOfTool;


 # Vedlegg 
 MYSQL SCRIPT