const { Get, CreateUser, UpdateUser, RemoveUser, ReplaceUser, UploadFile, } = require('../service/systems/user');
const { ErrorHandler, ResponseApi } = require('../../middleware/error-handled');
const { STATUS } = require('../../extensions/constants-manager');
const { CreateCache, GetCache } = require('../../extensions/redis-cache');
const { getPagination, filterGrid } = require('../../extensions/function-extension');
const User = require('../models/systems/user');
const { dataNotice } = require('../../extensions/data-mock');

exports.getNotice = async (req, res, next) => {
  return res.json(dataNotice);
}
/**
 * Pagination User.
 * @public
 */
exports.getPagination = async (req, res, next) => {
  try {
    const { page, size, ...searchParams } = req.query;
    let condition = filterGrid(searchParams);
    let { limit, offset } = getPagination(page, size);
    const data = await User.paginate(condition, { offset, limit });
    return res.json(data);
  }
  catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await GetCache(req.path, req.params);
    let user = new User();
    if (data) user = new User(data);
    else {
      user = await Get(req.params.userId);
      await CreateCache(user, req.path, req.params);
    }
    return res.json(ResponseApi(0, null, user.transform()));
  }
  catch (error) {
    return next(error);
  }
};

/**
 * Get logged in user info from req payload token
 * @public
 */
exports.profile = (req, res) => {
  const userDocument = new User(req.user);
  return res.json(ResponseApi(0, null, userDocument.transform()));
}

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const response = await CreateUser(req.body);
    return res.status(STATUS.CREATED).json(ResponseApi(0, null, response));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const { user } = req;
    const { userId } = req.params;
    const response = await UpdateUser(user, userId, req.body);
    return res.json(ResponseApi(0, null, response));
  } catch (error) {
    return next(error);
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req;
    const response = await ReplaceUser(user, req.body);
    return res.json({ data: response, success: 'SUCCESS' });
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await RemoveUser(userId);
    res.status(200).json(ResponseApi(0, null, null)).end();
  } catch (error) {
    next(error);
  }
};

exports.upload = async (req, res, next) => {
  try {
    const data = await UploadFile(req.file);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
