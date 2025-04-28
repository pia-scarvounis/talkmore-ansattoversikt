import express from 'express';
import cookieParser from 'cookie-parser';
import employeeRoutes from './db_routes/UsersRoutes/getEmployees_routes.js';
import noteRoutes from './db_routes/UsersRoutes/notes_routes.js';
import dayOverviewEmployees from './db_routes/UsersRoutes/dayOverviewEmp.js';
import availableEmployees from './db_routes/UsersRoutes/availableEmp_router.js';
import employeeHistory from './db_routes/UsersRoutes/getEmpHistory_router.js';
import adminEmployeeCruds from './db_routes/AdminRoutes/admin_employeeCruds.js';
import metaDataGet from './db_routes/UsersRoutes/getMetaData_routes';
import cors from 'cors';

//importere rutere for admin og begge(teamleder og admin)

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  // juster om frontend kjører annet sted
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

//rutere crud og autentisering
//rutere for alle brukere av verktøyet "admin" + "teamledere" skal se eller gjøre

//rutere for å hente og vise alle ansatte
app.use('/api/employees', employeeRoutes);

//rutere for admin: post, put, delete employees
app.use('/api/employee', adminEmployeeCruds);

//ruter for notes CRUDS
app.use('/api/note', noteRoutes );

//Rute for hente dagoversikt ansatte som ikke har permisjon eller har sluttet + tot FTE
app.use('/api', dayOverviewEmployees);

//rute for å hente tilgjengelige ansatte for dagen som er logget inn(ikke bruk nå)(dato)
app.use('/api/availableemployees', availableEmployees);

//hente og vise historikken per ansatt
app.use('/api/employee/history', employeeHistory);

//Hente (get) rutere for team, avdelinger, og stillinger fra databasen
app.use('api', metaDataGet)

//rutere kun for admin


//starte serveren
app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});