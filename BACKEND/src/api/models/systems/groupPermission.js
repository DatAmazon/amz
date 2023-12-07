const { Schema, model, ObjectId } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const groupPermission = new Schema({
    code: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    menus: [
        {
            menuId: {
                type: String,
                require: true,
                lowercase: true,
                trim: true
            },
            menuOrder: {
                type: Number,
                required: true
            },
            menuName: {
                type: Object,
                required: true,
                trim: true,
            },
            menuIcon: {
                type: String,
                required: false
            },
            menuPath: {
                type: String,
                require: true,
                lowercase: true,
                trim: true
            },
            children: {
                type: []
            },
            parentId: {
                type: String
            },
            search: {
                type: Boolean,
                required: true,
                default: false,
            },
            exportExcel: {
                type: Boolean,
                required: true,
                default: false
            },
            getXml: {
                type: Boolean,
                required: true,
                default: false
            },
            viewXml: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    ]
}, { timestamps: true })

groupPermission.plugin(mongoosePaginate);
module.exports = model('groupPermission', groupPermission)