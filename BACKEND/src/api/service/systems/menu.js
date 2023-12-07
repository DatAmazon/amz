const { omit } = require('lodash');
const Menus = require('../../models/systems/menu');
const { listToTree } = require('../../../extensions/function-extension');
const ObjectId = require('mongoose').Types.ObjectId;

exports.GetAllMenu = async () => await Menus.getAllMenu();

exports.GetMenuByUser = async () => await Menus.getMenuByUser();

/**
 * Get Menu By ID
 * @public
 *
 * @param {ObjectId} id mongoose Object id of user
 * @returns {Promise<Menus>} menu data
 */
exports.Get = async (id) => Menus.get(id);

/**
 * Create Menu
 * @public
 *
 * @param {Object} menuData userData
 * @param {String} menuData.menuName Name Menu
 * @param {String} menuData.path Menu's path
 * @param {String} menuData.menuId Menu's id
 * @param {String} menuData.order Menu's order
 *
 * @returns {Menus} Created Menu Object
 */
exports.CreateMenu = async (menuData) => {
    try {
        const menu = new Menus(menuData);
        return data = await menu.save();
    } catch (err) {
        throw Menus.handleError(err);
    }
};

/**
 * Update existing menu
 * @public
 *
 * @param {Object} menuId Menu id
 * @param {Object} newMenuData Menu Data (New)
 *
 * @returns {User} Updated menu data
 */
exports.UpdateMenu = async (menuId, newMenuData) => {
    try {
        const newMenu = new User(newMenuData);
        const menuObject = omit(newMenu.toObject(), '_id');
        const filter = { _id: new ObjectId(menuId) };
        const options = { override: true, upsert: true };
        return await Menus.updateOne(filter, menuObject, options);
    } catch (error) {
        throw error;
    }
};

/**
 * Remove Menu
 * @public
 *
 * @param {Object} menuId Menu to be Removed
 */
exports.RemoveMenu = async (menuId) => Menus.deleteOne({ _id: new ObjectId(menuId) });