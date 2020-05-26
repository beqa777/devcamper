import express, { Express } from 'express';
import dotenv from 'dotenv';
import bootcamps from './router/bootcamps';
import { api } from './globals';
import morgan from 'morgan';

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;
const app: Express = express();

//dev log middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//routes
app.use(`${api}/bootcamps`, bootcamps);


//start server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});
