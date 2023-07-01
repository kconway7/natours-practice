const fs = require('fs');
const cors = require('cors');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////
//MIDDLEWARE PACKAGES/ GLOBAL
////////////////////////////////////////

//SET SECURITY HTTP HEADERS
app.use(helmet());
app.use(cors());

// DEVELOPMENT LOGGING
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// LIMIT REQUESTS FROM SAME IP
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 + 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({ limit: '10kb' }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);
app.use(cookieParser());

// DATA SANITIZATION AGAINST NoSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'],
  })
);

// TEST MIDDLEWARE
// app.use((req, res, next) => {
//   // req.requestTime = new Date().toISOString();
//   // console.log(req.cookies);
//   next();
// });

app.use(compression());

////////////////////////////////////////
//ROUTES/APIS
////////////////////////////////////////

// Mount Routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Error Handling middleware for any routes not found
app.all('*', (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

// Simple error handling middleware
app.use(globalErrorHandler);

module.exports = app;
