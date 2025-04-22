import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './db_routes/UsersRoutes/getEmployees_routes.js';
import noteRoutes from './db_routes/UsersRoutes/notes_routes';
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

//rutere for alle brukere av verktøyet "admin" + "teamledere"
app.use('/api/employees', userRoutes);
app.use('/api/note', noteRoutes );
//rutere kun for admin

//starte serveren
app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});