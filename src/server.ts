import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import fileupload from 'express-fileupload';
import sanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { connectDb } from '~/db';
import { errorHandler } from '~/middlewares/errorHandler';
import { api, Color } from './globals';
import auth from './routers/auth';
import bootcamps from './routers/bootcamps';
import courses from './routers/courses';
import reviews from './routers/reviews';
import users from './routers/user';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const xss = require('xss-clean');
const hpp = require('hpp');

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


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// File upload
app.use(fileupload());


// Set security headers
app.use(helmet())

// Prevent XSS 
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minute
    max: 100, // request,
    handler: function (req, res, next) {
        // FoalTS Headers
        res.setHeader('Content-Type', 'application/json');
        // Send this response for rate limited requests
        res.status(this.statusCode!).send({
            success: false,
            msg: 'Too many requests, please try again later.'
        });
    }
})
app.use(limiter);

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors());

// Sanitize data
app.use(sanitize());

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
app.use(`${api}/users`, users);
app.use(`${api}/reviews`, reviews);

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