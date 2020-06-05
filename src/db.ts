import mongoose from 'mongoose';
import { Color } from './globals';

export const connectDb = async () => {
    try {
        console.log(Color.FgYellow, 'Trying to connect database');

        const conn = await mongoose.connect(process.env.MONGO_URL || '', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log(Color.FgBlue, `MongoDb Connected: ${conn.connection.host}`);

    } catch (error) {
        console.log(Color.FgRed, error.message);
    }
}