import cron from 'node-cron';
import { syncGenesysEmployees } from '../Funksj_støtte/syncGenesysEmployees';

//Denne skal kjøre hver kveld kl 23 og sjekke om det er nye ansatte fra api genesys som er lagt til
//synsGenesysEmployees filen som ligger i funkjs_støtte mappen
cron.schedule('0 23 * * *', async () => {
    console.log('[CRON] starter synskronisering av testbrukere fra api genesys');
    try{
        await syncGenesysEmployees();
        console.log('[CRON] Synkronisering fullført');
    }catch{
        console.error('[CRON] Feil under synkroniseringen:', err);
    }
});