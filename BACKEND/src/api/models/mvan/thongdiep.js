const { Schema, model, Types, Number } = require('mongoose');
const { APIError } = require('../../../extensions/response-pattern');
const { STATUS, VALIDATION_ERROR, NO_RECORD_FOUND } = require('../../../extensions/constants-manager');

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
}, { timestamps: true });

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
};

/**
 * @typedef Menu
 */
module.exports = model('ThongDiep', ThongDiep);