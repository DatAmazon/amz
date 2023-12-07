const { Login, Register } = require('../service/systems/auth');
const { STATUS } = require('../../extensions/constants-manager');
const { ErrorHandler, ResponseApi } = require('../../middleware/error-handled');
/**
 * Authenticate User
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
exports.login = async (req, res, next) => {
  try {
    const data = await Login(req.body);
    res.status(STATUS.OK).json(ResponseApi(0, null, data));
  } catch (err) {
    next(err);
  }
};

/**
 * Register a new User
 *
 * @public
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 */
exports.register = async (req, res, next) => {
  try {
    const data = await Register(req.body);
    res.status(STATUS.CREATED).json(ResponseApi(0, null, data));
  } catch (err) {
    next(err);
  }
};
