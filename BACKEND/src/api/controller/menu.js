const { Get, CreateMenu, UpdateMenu, RemoveMenu, GetMenuByUser, GetMenuByUserGroup, GetAllMenu } = require('../service/systems/menu');
const { ErrorHandler, ResponseApi } = require('../../middleware/error-handled');
const { STATUS } = require('../../extensions/constants-manager');
const { CreateCache, GetCache } = require('../../extensions/redis-cache');
const Menu = require('../models/systems/menu');
const jwt = require('jsonwebtoken');

/**
 * Get all menu.
 * @public
 */
exports.getAllMenu = async (req, res, next) => {
  try {
    const data = await GetAllMenu();
    return res.json(ResponseApi(0, null, data));
  }
  catch (error) {
    return next(error);
  }
};

/**
 * Get menu by user.
 * @public
 */
exports.getMenuByUser = async (req, res, next) => {
  try {
    const data = await GetMenuByUser();
    return res.json(ResponseApi(0, null, data));
  }
  catch (error) {
    return next(error);
  }
};

/**
 * Get menu
 * @public
 */
exports.getById = async (req, res, next) => {
  try {
    const data = await GetCache(req.path, req.params);
    let menu = new Menu();
    if (data) menu = new Menu(data);
    else {
      menu = await Get(req.params.menuId);
      await CreateCache(menu, req.path, req.params);
    }
    return res.json(ResponseApi(0, null, menu));
  }
  catch (error) {
    return next(error);
  }
};

/**
 * Create new menu
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const response = await CreateMenu(req.body);
    return res.status(STATUS.CREATED).json(ResponseApi(0, null, response));
  } catch (error) {
    return next(error);
  }
};

/**
 * Update existing menu
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    const response = await UpdateMenu(menuId, req.body);
    return res.json(ResponseApi(0, null, response));
  } catch (error) {
    return next(error);
  }
};


/**
 * Delete menu
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const { menuId } = req.params;
    await RemoveMenu(menuId);
    res.status(200).json(ResponseApi(0, null, null)).end();
  } catch (error) {
    next(error);
  }
};