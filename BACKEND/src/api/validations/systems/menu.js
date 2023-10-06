const Joi = require('joi');

module.exports = {
    // POST /menus
    createMenu: {
        body: {
            menuOrder: Joi.number().required(),
            menuName: Joi.object().required(),
            menuPath: Joi.string().required(),
        },
    },
};
