const Joi = require('joi');
const { ROLES } = require('../../../extensions/constants-manager');

module.exports = {

  // GET /users
  listUsers: {
    query: {
      page: Joi.number().min(0),
      size: Joi.number().min(1).max(100),
    },
  },

  // POST /users
  createUser: {
    body: {
      username: Joi.string().required().min(6).max(128),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128).required(),
      group: {
        code: Joi.string().required(),
        name: Joi.string().required()
      },

    },
  },

  // PATCH /users/:userId
  updateUser: {
    body: {
      username: Joi.string().required().min(6).max(128),
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PUT /users/:userId
  replaceUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128).required(),
      role: Joi.string().valid(ROLES),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
