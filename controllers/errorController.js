const AppError = require('../utils/appError');

const sendErrorDev = (err, response) => {
  // Send detailed error during development
  response.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, response) => {
  // operation error, send message to client
  if (err.isOperational) {
    response.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log error
    console.error('ERROR', err);
    // programming error, send generic message
    response.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

////////////////////////////////////////
//CUSTOM ERROR HANDLERS
////////////////////////////////////////

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: (${err.keyValue.name}). Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpired = () => new AppError('Token is expired. Please log in again!', 401);

// HANDLES OPERATIONAL ERRORS
module.exports = (err, request, response, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, response);
  } else if (process.env.NODE_ENV === 'production') {
    // Make copy of error object, bad practice to mutate original error argument
    let errorCopy = { name: err.name, message: err.message };
    errorCopy = Object.assign(errorCopy, err);

    // CastError
    if (errorCopy.name === 'CastError') errorCopy = handleCastErrorDB(errorCopy);

    // Error code 11000, do to unique name conflict
    if (errorCopy.code === 11000) errorCopy = handleDuplicateFieldsDB(errorCopy);

    // Validation error
    if (errorCopy.name === 'ValidationError') errorCopy = handleValidationErrorDB(errorCopy);

    // JSON web token error
    if (errorCopy.name === 'JsonWebTokenError') errorCopy = handleJWTError();

    // JWT Token is expired
    if (errorCopy.name === 'TokenExpiredError') errorCopy = handleJWTExpired();

    // Finally send error
    sendErrorProd(errorCopy, response);
  }

  next();
};
