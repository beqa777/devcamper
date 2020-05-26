import express, { Express } from 'express';
import dotenv from 'dotenv';
import bootcamps from './router/bootcamps';


dotenv.config({ path: './config/config.env' });
const app: Express = express();

const PORT = process.env.PORT || 5000;

export const api = '/api/v1';

app.use(`${api}/bootcamps`, bootcamps);


app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});
;