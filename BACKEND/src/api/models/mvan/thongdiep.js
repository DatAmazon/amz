const { Schema, model, Types, Number } = require('mongoose');
const mongoose = require('mongoose');
const { APIError } = require('../../../extensions/response-pattern');
const { STATUS, VALIDATION_ERROR, NO_RECORD_FOUND } = require('../../../extensions/constants-manager');
const { getDbName } = require('../../../extensions/function-extension');

const ThongDiep = new Schema({
  PBan: { type: String, trim: true },
  MNGui: { type: String },
  MNNhan: { type: String },
  MLTDiep: { type: String },
  MTDiep: { type: String },
  MTDTChieu: { type: String, trim: true },
  Mst: { type: String, trim: true },
  MGDDTu: { type: String, trim: true },
  DateNew: { type: Date, default: Date.now },
  Xml: { type: String, trim: true },
  FileId: { type: String, trim: true },
  Type: { type: String, trim: true },
  TTTNhan: { type: String, trim: true },
  MsgTimeStamp: { type: Date },
  Offset: { type: Number },
  LTBao: { type: String, trim: true },
  THop: { type: String, trim: true },
  TTXNCQT: { type: String, trim: true },
  MTDiep999: { type: String, trim: true },
  MstTcgp: { type: String, trim: true },
  TransId: { type: String, trim: true },
  MLTDiepTChieu: { type: String, trim: true },
  BucketName: { type: String, trim: true },
  FileName: { type: String, trim: true },
  UrlShare: { type: String, trim: true }
}, { timestamps: true, collection: 'ThongDiep' });

/**
 * Statics
 */
ThongDiep.statics = {
  /**
   * Get menu
   *
   * @param {ObjectId} id - The objectId of menu.
   * @returns {Promise<Menu, APIError>}
   */
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [{ field: 'id', location: 'params', messages: 'Please enter valid ID' }],
        status: STATUS.NOT_FOUND,
      });
    }
    const data = await this.findById(id).exec();
    if (!data) throw new APIError({ message: NO_RECORD_FOUND, status: STATUS.NOT_FOUND });
    return data;
  },
  /**
 * Return Validation Error
 *
 * @param {Error} error
 * @returns { Error | APIError }
 */
  handleError(error) {
    if (error.code === 11000 && (error.name === 'BulkWriteError' || error.name === 'MongoError')) {
      const keys = Object.keys(error.keyPattern);
      return new APIError({
        message: "Có lỗi xảy ra",
        status: STATUS.BAD_REQUEST,
        errors: [{ field: keys[0], location: 'body', messages: error.errmsg, }],
      });
    }
    return error;
  },

  async searchThongDiepByDate(fromDate, toDate) {
    const data = await this.aggregate([
      {
        $match: {
          MstTcgp: { $nin: ['0106026495', '0106026495-001', '', null] },
          $or: [
            { Type: "IN", DateNew: { $gte: new Date(fromDate), $lt: new Date(toDate) }, MLTDiep: { $in: ['-1', '102', '103', '202', '204', '301'] } },
            { Type: "TCGPOUT", DateNew: { $gte: new Date(fromDate), $lt: new Date(toDate) }, MLTDiep: { $in: ['100', '200', '203', '206', '300', '303', '400'] } }
          ]
        }
      },
      { $group: { _id: "$MstTcgp", totalSentUp: { $sum: { $cond: [{ $eq: ["$Type", "TCGPOUT"] }, 1, 0] } }, totalReturn: { $sum: { $cond: [{ $eq: ["$Type", "IN"] }, 1, 0] } } } },
      { $project: { _id: 0, MstTcgp: "$_id", totalSentUp: 1, totalReturn: 1, total: { $add: ["$totalSentUp", "$totalReturn"] } } }
    ]);
    return data;
  },

  async searchDetailSent(fromDate, toDate) {
    const data = await this.aggregate([
      {
        "$match": {
          "$and": [
            { "MstTcgp": { "$not": { "$in": ["0106026495", "0106026495-001", "", null] } } },
            { "MLTDiep": { "$in": ["100", "200", "203", "300", "400"] } },
            { "DateNew": { "$gte": new Date(fromDate) } },
            { "DateNew": { "$lt": new Date(toDate) } },
            { "Type": "TCGPOUT" }
          ]
        }
      },
      { "$group": { "_id": { "MstTcgp": "$MstTcgp", "MLTDiep": "$MLTDiep" }, "total": { "$sum": 1 } } },
      { "$project": { "MstTcgp": "$_id.MstTcgp", "MLTDiep": "$_id.MLTDiep", "total": "$total", "_id": 0 } },
      { "$sort": { "MstTcgp": 1 } }
    ]);
    return data;
  },

  async searchDetailReceived(fromDate, toDate) {
    const data = await this.aggregate([
      {
        "$match": {
          "$and": [
            { "MstTcgp": { "$not": { "$in": ["0106026495", "0106026495-001", "", null] } } },
            { "MLTDiep": { "$in": ["-1", "102", "103", "202", "204", "301"] } },
            { "DateNew": { "$gte": new Date(fromDate) } },
            { "DateNew": { "$lt": new Date(toDate) } },
            { "Type": "IN" }
          ]
        }
      },
      { "$group": { "_id": { "MstTcgp": "$MstTcgp", "MLTDiep": "$MLTDiep" }, "total": { "$sum": 1 } } },
      { "$project": { "MstTcgp": "$_id.MstTcgp", "MLTDiep": "$_id.MLTDiep", "total": "$total", "_id": 0 } },
      { "$sort": { "MstTcgp": 1 } }
    ]);
    return data;
  },
};

const dbName = getDbName();
// const myDB = mongoose.connection.useDb('mtvan_01102023_31102023');
const myDB = mongoose.connection.useDb('mtvan_01112023_30112023');

module.exports = myDB.model('ThongDiep', ThongDiep);

















