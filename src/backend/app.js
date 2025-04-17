import express from 'express';
import cookieParser from 'cookie-parser';

//importere rutere for admin og begge(teamleder og admin)

const app = express();

app.use(express.json());
app.use(cookieParser());

//rutere crud og autentisering


//starte serveren
app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
});