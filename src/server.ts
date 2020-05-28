import express, { Express } from 'express';
import dotenv from 'dotenv';
import bootcamps from './routers/bootcamps';
import { api, Color } from './globals';
import morgan from 'morgan';
import { connectDb } from '~/db';
import { errorHandler } from '~/middlewares/errorHandler';

// load env vars
dotenv.config({ path: './config/config.env' });


//connect to database
connectDb();

const PORT = process.env.PORT || 5000;
const app: Express = express();

//dev log middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//body parser
app.use(express.json());

//routes
app.use(`${api}/bootcamps`, bootcamps);

//error handler
app.use(errorHandler);

//start server
const server = app.listen(PORT, () => {
    console.log(Color.FgBlue, `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});


process.on('unhandledRejection', (err: Error | null, promise) => {
    console.log(Color.FgRed, `Error: ${err?.message}`);
    // Close server and exit process
    server.close(() => {
        process.exit(1);
    });
})