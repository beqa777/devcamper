const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Color = require('~/globals').Color;

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('~/models/Bootcamp').default;

mongoose.connect(process.env.MONGO_URL || '', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);


// Import data into database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        console.log(Color.FgGreen, 'Data imported into database.');
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
        console.log(Color.FgGreen, 'Data deleted.');
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

