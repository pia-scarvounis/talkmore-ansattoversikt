
# EmployeeMore – Administrasjonssystem for Talkmore

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
 [Se full kildekode for cron-jobb](./src/cron/syncEmployeesCron.js)
        --- Cron Job synkronisering (hente ansatte) kjører hvert 2 minutt
        (Vent til cron job henter ansatte)

 - Fjerner ansatte + lisens tilganger ,på ansatte som har slutt dato fra       ansattlisten
        --- Cron Job synkronisering (dekativerer ansatt) kjører hvert 5 minutt

 # Innlogging i verktøyet
 Systemet har to roller :

    - Admin (Adminstrator full tilgang)
    - Teamleder (Leserolle inkludert tilgang på crud (notater))

 Du kan logge inn med et av testbrukerene i "userOfTool", helt nederst i sql-scriptet kjør 1 gang: 
 SELECT * FROM userOfTool; 
  1. Bruk "username" -> epost adresse 
  2. Testpassord setter du selv i env filen i (DEFAULT_TEST_PASSWORD= )- krypteres i    databasen
  3. Logg inn med username og passord 


 # Vedlegg 
 MYSQL SCRIPT
 [Last ned fullstendig rapport (PDF)](./employeeOverview_prosjekt.sql.zip)

 # Dashbord 
    -> Se oversikt over FTE eksludert ansatte som har permisjon eller sluttdato
    -> Total sum på alle ansatte fordelt på stilling og stilling%
    -> Klikkbare filtreringer (grønne bokser på dashbord)

 # Navigasjon
    -> Begrenset navigasjon for Teamleder (leserolle)

 # Alle ansatte 
    -> Liste over alle ansatte med klikkbare profilkort
    -> Søkefelt (søk etter navn, epost og stilling)

# Ansatt detaljer
    -> Full oversikt på ansatt med informasjon og historikktabell
    -> begrenset endringsvalg for Teamleder (leserolle)
    -> Endre ansatt, endre historikkfelter (Admin)

# Endre ansatt informasjon
    -> kun Admin
    -> endre valgte felter og oppdaterere

# Endre historikkfelter
    -> Kun Admin
    -> endre felter via popup og lagre den nye informasjonen. Lagres i historikk og i ansatt informasjonen

# Admin- Navigasjon
 -> vises Adminstrasjonspanel

# Adminstrasjonspanel
 -> Adminstrere Team
 -> Adminstrere Lisenser 
 -> Regisrere ny ansatt

