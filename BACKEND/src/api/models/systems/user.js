const { Schema, model, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const moment = require('moment');
const { APIError } = require('../../../extensions/response-pattern');
const {
  ROLES, DEFAULT_IMAGE,
  USER,
  LOGIN,
  STATUS,
  VALIDATION_ERROR
} = require('../../../extensions/constants-manager');
const { saltRound, jwtExpirationInterval, jwtSecret } = require('../../../config/configuration-env');

/**
 * User Schema
 * @private
 */
const UserModel = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    default: DEFAULT_IMAGE,
  },
  role: {
    type: String,
    enum: ROLES,
    default: 'user',
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  active: {
    type: Boolean,
    default: true,
  },
  group: {
    code: {
      type: String,
      require: true,
      trim: true,
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
  }
}, { timestamps: true });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserModel.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();
    const hash = await bcrypt.hash(this.password, Number(saltRound));
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * User Model Methods
 */
UserModel.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'username', 'email', 'photo', 'role', 'active'];
    fields.forEach((field) => {
      transformed[field] = this[field];
    });
    return transformed;
  },
  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
      groupPermission: this.group.code
    };
    return Jwt.sign(playload, jwtSecret);
  },
  async matchPassword(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
UserModel.statics = {
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    if (!Types.ObjectId.isValid(id)) {
      throw new APIError({
        message: VALIDATION_ERROR,
        errors: [{ field: 'id', location: 'params', messages: 'Please enter valid User ID', }],
        status: STATUS.NOT_FOUND,
      });
    }
    const user = await this.findById(id).exec();
    if (!user) throw new APIError({ message: NO_RECORD_FOUND, status: STATUS.NOT_FOUND });
    return user;
  },

  /**
   * Find user by username and tries to generate a JWT token
   *
   * @param {Object} options - User Object
   * @param options.username - User 
   * @param options.password - User password
   * @returns { Promise<User | APIError> }
   */
  async ValidateUserAndGenerateToken(options) {
    const { username, password } = options;
    const user = await this.findOne({ username }).exec();
    if (!user) throw new APIError({ message: LOGIN.INVALID_CREDENTIALS, status: STATUS.INTERNAL_SERVER_ERROR });
    if (!await user.matchPassword(password)) throw new APIError({ message: LOGIN.INVALID_CREDENTIALS, status: STATUS.INTERNAL_SERVER_ERROR });
    return { user: user.transform(), accessToken: user.token() };
  },

  /**
   * Return Validation Error
   * If error is a mongoose duplication key error
   *
   * @param {Error} error
   * @returns { Error | APIError }
   */
  checkDuplication(error) {
    if (error.code === 11000 && (error.name === 'BulkWriteError' || error.name === 'MongoError')) {
      const keys = Object.keys(error.keyPattern);
      if (keys.includes('name')) {
        return new APIError({ message: 'Name already exist', status: STATUS.NOT_FOUND });
      }
      if (keys.includes('username')) {
        return new APIError({
          message: USER.EXIST_USER,
          status: STATUS.BAD_REQUEST,
          errors: [{ field: 'username', location: 'body', messages: USER.EXIST_USER, }],
        });
      }
      if (keys.includes('email')) {
        return new APIError({
          message: USER.EXIST_EMAIL,
          status: STATUS.BAD_REQUEST,
          errors: [{ field: 'email', location: 'body', messages: USER.EXIST_EMAIL }],
        });
      }
    }
    return error;
  },
};

/**
 * Add plugin to a schema and then use model paginate method
 */
UserModel.plugin(mongoosePaginate);

/**
 * @typedef User
 */
module.exports = model('users', UserModel);
