const ObjectId = require('mongoose').Types.ObjectId;
const ThongDieps = require('../../models/mvan/thongdiep');

/**
 * Get ThongDiep By ID
 * @public
 *
 * @param {ObjectId} id mongoose Object id of thongdiep
 * @returns {Promise<ThongDieps>} ThongDiep data
 */
exports.Get = async (id) => ThongDieps.get(id);