const { omit } = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../../models/systems/user');
/**
 * Get logged in user info
 * @public
 */
exports.LoginUser = (req, res) => res.json(req.user.transform());

/**
 * Create User
 * @public
 *
 * @param {Object} userData userData
 * @param {String} userData.username User's login
 * @param {String} userData.email User's Email
 * @param {String} userData.password User's Password
 * @param {String} userData.name User's Name
 *
 * @returns {User} Created User Object
 */
exports.CreateUser = async (userData) => {
  try {
    const user = new User(userData);
    const data = await user.save();
    return data.transform();
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

/**
 * Get User By ID
 * @public
 *
 * @param {ObjectId} id mongoose Object id of user
 * @returns {Promise<User>} user data
 */
exports.Get = async (id) => User.get(id);

/**
 * Replace Existing User
 * @public
 *
 * @param {Object} user User Data (Old)
 * @param {Object} newData User Data (new)
 *
 * @returns {User} Replaced user data
 */
exports.ReplaceUser = async (user, newData) => {
  try {
    const role = user.role !== 'admin' ? 'role' : '';
    const userToUpdate = omit(newData, role);
    const updateData = Object.assign(user, userToUpdate);
    const data = new User(updateData);
    const savedUser = await data.save();
    return savedUser.transform();
  } catch (err) {
    throw User.checkDuplication(err);
  }
};

/**
 * Update existing user
 * @public
 *
 * @param {Object} user User Data (Old)
 * @param {Object} newUserData User Data (New)
 *
 * @returns {User} Updated user data
 */
exports.UpdateUser = async (user, userId, newUserData) => {
  try {
    const newUser = new User(newUserData);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const userObject = omit(newUser.toObject(), '_id', ommitRole);
    const filter = { _id: new ObjectId(userId) };
    const options = { override: true, upsert: true };

    await User.updateOne(filter, userObject, options);
    return newUser.transform();
  } catch (error) {
    throw User.checkDuplication(error);
  }
};

/**
 * Remove User
 * @public
 *
 * @param {Object} userId User to be Removed
 */
exports.RemoveUser = async (userId) => User.deleteOne({_id: new ObjectId(userId)});

/**
 * Upload Image to System
 * @param {Req} file - File Object in Request
 */
exports.UploadFile = async (file) => {
  const { path } = file;
  return path;
};
