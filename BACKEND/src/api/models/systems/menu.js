const { Schema, model, Types } = require('mongoose');
const { APIError } = require('../../../extensions/response-pattern');
const { STATUS, VALIDATION_ERROR, NO_RECORD_FOUND } = require('../../../extensions/constants-manager');
const { listToTree } = require('../../../extensions/function-extension');
const { uuid } = require('uuidv4');
const menus = new Schema({
    menuId: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        default: uuid,
    },
    menuOrder: {
        type: Number,
        required: true,
    },
    menuName: {
        type: Object,
        required: true,
        trim: true,
    },
    menuIcon: {
        type: String,
        required: false,
    },
    menuPath: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    children: {
        type: String,
    },
    parentId: {
        type: String,
    }
}, { timestamps: true });

/**
 * Statics
 */
menus.statics = {
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
                errors: [{ field: 'id', location: 'params', messages: 'Please enter valid Menu ID' }],
                status: STATUS.NOT_FOUND,
            });
        }
        const data = await this.findById(id).exec();
        if (!data) throw new APIError({ message: NO_RECORD_FOUND, status: STATUS.NOT_FOUND });
        return data;
    },
    async getAllMenu() {
        // const data = await this.find().lean().exec();
        const data = await this.find().limit(2).lean().exec();

        if (!data) throw new APIError({ message: NO_RECORD_FOUND, status: STATUS.NOT_FOUND });
        return listToTree(data, { idKey: "menuId", parentId: "parentId", childrenKey: "children" });
    },
    async getMenuByUser() {
        const data = await this.find().lean().exec();
        if (!data) throw new APIError({ message: NO_RECORD_FOUND, status: STATUS.NOT_FOUND });
        return listToTree(data, { idKey: "menuId", parentId: "parentId" });
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
                errors: [{ field: keys[0], location: 'body', messages: error.errmsg, }]
            });
        }
        return error;
    },
};

/**
 * @typedef Menu
 */
module.exports = model('menus', menus, 'menus');