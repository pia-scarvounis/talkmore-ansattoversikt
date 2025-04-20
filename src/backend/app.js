import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from '../backend/db_routes/users_routes.js';

//importere rutere for admin og begge(teamleder og admin)

const app = express();

app.use(express.json());
app.use(cookieParser());

//rutere crud og autentisering

//rutere for alle brukere av verktøyet "admin" + "teamledere"
app.use('/api/employees', userRoutes);

//rutere kun for admin

//starte serveren
app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});