const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////////////////////
//MIDDLEWARES
////////////////////////////////////////

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

////////////////////////////////////////
//ROUTES/APIS
////////////////////////////////////////

// Mount Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Error Handling middleware for any routes not found
app.all('*', (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

// Simple error handling middleware
app.use(globalErrorHandler);

module.exports = app;
