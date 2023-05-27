const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// Error handling uncaught exceptions throughout the application
// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! Shutting down...');
//   console.log(err.name, err.message);
// });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const port = process.env.PORT;
const server = app.listen(port, () => {
  // console.log(`App running on port ${port}...`);
});

// Error handling connecting to server
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
