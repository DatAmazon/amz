
const { STATUS } = require("../../extensions/constants-manager");
const { ResponseApi } = require("../../middleware/error-handled");
const { get, create, update, remove } = require("../service/systems/groupPermission");
const constantsManager = require("../../extensions/constants-manager");
const jwt = require('jsonwebtoken');
const groupPermission = require("../models/systems/groupPermission");
const { getPagination, filterGrid } = require('../../extensions/function-extension');
/**
 * Pagination group permission.
 * @public
 */
exports.get = async (req, res, next) => {
    try {
        const { page, size, ...searchParams } = req.query;
        let condition = filterGrid(searchParams);
        let { limit, offset } = getPagination(page, size);
        const data = await groupPermission.paginate(condition, { offset, limit });
        return res.json(data);
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Get groupPermission by groupPermission code
 * @public
 */
exports.getByCode = async (req, res, next) => {
    try {
        const data = await get(req.params.groupCode);
        return res.json(ResponseApi(0, null, data));
    }
    catch (error) {
        return next(error);
    }
};
/**
 * 
 * Get groupPermission by user
 * 
 * 
 */
exports.getByUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace(constantsManager.TOKEN_TYPE, "").trim()
        const { groupPermission } = jwt.decode(token);
        const data = await get(groupPermission);
        return res.json(ResponseApi(0, null, data));
    } catch (error) {
        return next(error)
    }
}

/**
 * Create groupPermission
 * @public
 * 
 */
exports.create = async (req, res, next) => {
    try {
        const data = await create(req.body)
        return res.status(STATUS.CREATED).json(ResponseApi(0, null, data));
    } catch (error) {
        next(error)
    }
}
/**
 * 
 * Update groupPermission
 * @public
 * 
 * 
 */
exports.update = async (req, res, next) => {
    try {
        const data = await update(req.params.groupCode, req.body);
        return res.status(STATUS.OK).json(ResponseApi(0, null, data));
    } catch (error) {
        next(error);
    }
}
/**
 * 
 * Remove groupPermission
 * @public
 * 
 * 
 * 
 */
exports.remove = async (req, res, next) => {
    try {
        await remove(req.params.groupCode);
        return res.status(STATUS.OK).json();
    } catch (error) {
        next(error);
    }
}

