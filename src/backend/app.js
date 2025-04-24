import express from 'express';
import cookieParser from 'cookie-parser';
import employeeRoutes from './db_routes/UsersRoutes/getEmployees_routes.js';
import noteRoutes from './db_routes/UsersRoutes/notes_routes.js';
import availableEmployees from './db_routes/UsersRoutes/availableEmp_router.js';
import employeeHistory from './db_routes/UsersRoutes/getEmpHistory_router';
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
//ruter for notes CRUDS
app.use('/api/note', noteRoutes );
//rute for å hente tilgjengelige ansatte for dagen(dato)
app.use('/api/availableemployees', availableEmployees);
//hente og vise historikken per ansatt
app.use('/api/employee/history', employeeHistory);

//rutere kun for admin


//starte serveren
app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});