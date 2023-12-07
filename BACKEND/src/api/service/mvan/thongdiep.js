const ObjectId = require('mongoose').Types.ObjectId;
const { log } = require('winston');
const ThongDiep = require('../../models/mvan/thongdiep');

/**
 * Get ThongDiep By ID
 * @public
 *
 * @param {ObjectId} id mongoose Object id of thongdiep
 * @returns {Promise<ThongDieps>} ThongDiep data
 */
exports.Get = async (id) => ThongDiep.get(id);


exports.SearchThongDiepByDate = async (fromDate, toDate) => {
    const a  = await ThongDiep.searchThongDiepByDate(fromDate, toDate);
    return a;
}

exports.SearchDetailSent = async (fromDate, toDate) => {
    return data = await ThongDiep.searchDetailSent(fromDate, toDate)
}

exports.SearchDetailReceived = async (fromDate, toDate) => {
    return data = await ThongDiep.searchDetailReceived(fromDate, toDate)
}

