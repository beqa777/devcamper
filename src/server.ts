import express, { Express } from 'express';
import dotenv from 'dotenv';
import { api, Color } from './globals';
import morgan from 'morgan';
import { connectDb } from '~/db';
import { errorHandler } from '~/middlewares/errorHandler';
import fileupload from 'express-fileupload';
import path from 'path';
import cookieParser from 'cookie-parser';

// import routes
import bootcamps from './routers/bootcamps';
import courses from './routers/courses';
import auth from './routers/auth';

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

// File upload
app.use(fileupload());

// Cookie parser
app.use(cookieParser());

// Set static folder
app.use(express.static(path.resolve() + "/public"));


//body parser
app.use(express.json());

//routes
app.use(`${api}/bootcamps`, bootcamps);
app.use(`${api}/courses`, courses);
app.use(`${api}/auth`, auth);

//error handler
app.use(errorHandler);

//start server
const server = app.listen(PORT, () => {
    console.log(Color.FgBlue, `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});

// Handle unhandled errors
process.on('unhandledRejection', (err: Error | null, promise) => {
    console.log(Color.FgRed, `Error: ${err?.message}`);
    // Close server and exit process
    server.close(() => {
        process.exit(1);
    });
})