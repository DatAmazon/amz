const { Get } = require('../service/mvan/thongdiep');
const { ErrorHandler, ResponseApi } = require('../../middleware/error-handled');
const { STATUS } = require('../../extensions/constants-manager');
const { CreateCache, GetCache } = require('../../extensions/redis-cache');
const ThongDiep = require('../models/mvan/thongdiep');

/**
 * Get thongdiep
 * @public
 */
exports.getThongDiepById = async (req, res, next) => {
  try {
    const data = await GetCache(req.path, req.params);
    let response = new ThongDiep();
    if (data) response = new ThongDiep(data);
    else {
        response = await Get(req.params.thongdiepId);
      await CreateCache(response, req.path, req.params);
    }
    return res.json(ResponseApi(0, null, response));
  }
  catch (error) {
    return next(error);
  }
};
