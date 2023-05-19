const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

// READ json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data loaded successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA IN DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted succesfully');
    process.exit();
  } catch (err) {}
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') deleteData();
