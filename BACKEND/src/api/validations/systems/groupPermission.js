const Joi = require('joi');

module.exports = {
    create: {
        body: {
            code: Joi.string().required(),
            name: Joi.string().required(),
        },
    },
    update: {
        params: {
            groupCode: Joi.string().required()
        },
        body: {
            name: Joi.string().required()
        }
    },
    remove: {
        params: {
            groupCode: Joi.string().required()
        }
    },
    updateMenus: {
        params: {
            groupCode: Joi.string().required()
        },
        body: {
            menus: Joi.array().required()
        }
    }
};
