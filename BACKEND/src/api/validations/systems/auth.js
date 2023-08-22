const Joi = require('joi');

module.exports = {

  // POST /auth/login
  Login: {
    body: {
      username: Joi.string().required().min(6).max(128),
      password: Joi.string().required().min(6).max(128),
    },
  },

  // POST /auth/register
  Register: {
    body: {
      username: Joi.string().required().min(6).max(128),
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(128),
    },
  },

};
