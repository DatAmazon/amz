const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../api/models/systems/user');
const { jwtSecret } = require('./configuration-env');
const { GetCache, CreateCache } = require('../extensions/redis-cache');
const JwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

/**
 * Returns Callback function with user data if valid Token provided
 * Returns Callback function with Error if invalid data provided
 *
 * @param {Object} payload
 * @param {String} payload.sub _id of user
 * @param {Function} done Callback Functiom
 *
 * @returns {Function} done
 */
const JWT = async (payload, done) => {
  try {
    const data = await GetCache(payload.sub);
    if (data) return done(null, data);
    const user = await User.findById(payload.sub);
    if (user) {
      await CreateCache(user, payload.sub);
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};

exports.Jwt = new Strategy(JwtOptions, JWT);