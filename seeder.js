const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Color = require('../globals').Color;

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('../models/Bootcamp').default;
const Course = require('../models/Course').default;
const User = require('../models/User').default;
const Review = require('../models/Review').default;

mongoose.connect(process.env.MONGO_URL || '', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);


// Import data into database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);
        console.log(Color.FgGreen, 'Bootcamps imported into database.');
        console.log(Color.FgGreen, 'Courses imported into database.');
        console.log(Color.FgGreen, 'Users imported into database.');
        console.log(Color.FgGreen, 'Reviews imported into database.');
    } catch (error) {
        console.log(Color.FgRed, error);
    } finally {
        process.exit();
    }
}

// delete data in database
const deleteData = async (fn) => {
    try {
        await Bootcamp.deleteMany({});
        await Course.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});
        console.log(Color.FgGreen, 'Bootcamps deleted.');
        console.log(Color.FgGreen, 'Courses deleted.');
        console.log(Color.FgGreen, 'Users deleted.');
        console.log(Color.FgGreen, 'Reviews deleted.');
        if(fn){
            await fn()
        }
    } catch (error) {
        console.log(Color.FgRed, error);
    } finally {
        process.exit();
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else if (process.argv[2] === '-r') {
    deleteData(importData);
}
else {
    console.log(Color.FgRed, 'Argument not passed');
    process.exit();
}

