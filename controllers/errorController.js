const AppError = require("../utils/appError");
// Global Error Handling

// Error Handling for CastError
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

// Handling Duplicate DB Fields
const handleDuplicateFieldsDB = errmsg => {
  const value = errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Handling Validation Errors
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;

  return new AppError(message, 400);
};

// Handling JWT Error Json Web Token Error :Invalid Signature
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again", 401);

// Handling JWT Error Token Expired Error : jwt expired

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again", 401);

// Error Handling for Devleopment
const sendErrorDev = (err, req, res) => {
  // API ERROR
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // Rendered WEBSITE
  return res.status(err.statusCode).render("error", {
    title: "Something wend wrong!",
    msg: err.message
  });
};

// Error Handling for production
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown erro: don't leak error details

    // 1) Log Error
    console.error(err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!"
    });
  }
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something wend wrong!",
      msg: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  // Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something wend wrong!",
    msg: "Please try again later."
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    // Handling CastError
    console.log(error);
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err.errmsg);
    }
    if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (err.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
