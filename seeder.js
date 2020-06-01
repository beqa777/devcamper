const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Color = require('~/globals').Color;

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('~/models/Bootcamp').default;
const Course = require('~/models/Course').default;

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


// Import data into database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log(Color.FgGreen, 'Bootcamps imported into database.');
        console.log(Color.FgGreen, 'Courses imported into database.');
    } catch (error) {
        console.log(Color.FgRed, error);
    } finally {
        process.exit();
    }
}

// delete data in database
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany({});
        await Course.deleteMany({});
        console.log(Color.FgGreen, 'Courses deleted.');
        console.log(Color.FgGreen, 'Bootcamps deleted.');
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
} else {
    console.log(Color.FgRed, 'Argument not passed');
    process.exit();
}

