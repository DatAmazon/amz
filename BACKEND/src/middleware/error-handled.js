const { ValidationError } = require('express-validation');
const { APIError, ResposeApiModel } = require('../extensions/response-pattern');
const { env } = require('../config/configuration-env');
const { STATUS } = require('../extensions/constants-manager');

/**
 * Error Handler Sends Stack Trace only during Development Environment
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
const Handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message,
    data: err.data | null,
    errors: err.errors,
    stack: err.stack,
  };
  if (env === 'production') delete response.stack;
  res.status(response.code).json(response);
  res.end();
};

exports.ErrorHandler = Handler;
exports.Handler = Handler;

exports.ResponseApi = (code, message, data) => {
  const response = new ResposeApiModel(code, message, data);
  return response;
};
/**
 * Convert Error Thrown By Express Validator OR Not an Instance of API Error
 * @public
 */
exports.ConvertError = (err, req, res, next) => {
  let ConvertedError = err;
  if (err instanceof ValidationError) {
    const errors = err.errors.map((e) => ({
      location: e.location,
      messages: e.messages[0].replace(/[^\w\s]/gi, ''),
      field: e.field[0],
    }));
    ConvertedError = new APIError({
      message: 'Validation Error',
      status: err.status || 400,
      errors,
    });
  } else if (!(err instanceof APIError)) {
    ConvertedError = new APIError({
      message: err.message,
      status: err.status ?? STATUS.BAD_REQUEST,
      stack: err.stack,
    });
  }
  return Handler(ConvertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.NotFound = (req, res, next) => {
  const err = new APIError({
    message: 'Resource Not Found',
    status: 404,
  });
  return Handler(err, req, res, next);
};

/**
 * Catch 429 ratelimit exceeded
 * @public
 */
exports.RateLimitHandler = (req, res, next) => {
  const err = new APIError({
    message: 'Rate limt exceeded, please try again later some time.',
    status: 429,
  });
  return Handler(err, req, res, next);
};
