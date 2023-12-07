const app = require('express').Router();
const Validate = require('express-validation');
const { Authorize } = require('../../../middleware/authorzie-attribute');
const controller = require('../../controller/menu');
const { createMenu } = require('../../validations/systems/menu');

app.route('/')
  /**
   * @api {get} /menus List Menus
   * @apiDescription Get List of Menus
   * @apiVersion 1.0.0
   * @apiName ListMenus
   * @apiGroup Menus
   * @apiPermission ADMIN
   *
   * @apiHeader {String} Authorization  Menu's access token
   * @apiParam (Query Params) {String}            [email]             User Email
   * @apiParam (Query Params) {String}            [name]              User name
   * @apiParam (Query Params) {Number {1-100}}    [perPage=1]         User List limit per page
   * @apiParam (Query Params) {Number {1-}}       [page=1]            List Page
   * @apiParam (Query Params) {String=user,admin} [role]              User Role
   *
   * @apiSuccess {Object[]} list of users
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 401) Forbidden Only ADMINS can access the data
   */
  .get(Authorize(), controller.getMenuByUser)
  /**
   * @api {post} /menus Create Menus
   * @apiDescription Create Menus
   * @apiVersion 1.0.0
   * @apiName Create Menus
   * @apiGroup Menus
   * @apiPermission ADMIN
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam (Body Params) {String}            email             User Email
   * @apiParam (Body Params) {String{..128}}     name              User name
   * @apiParam (Body Params) {String{6..128}}    password          User password
   * @apiParam (Body Params) {String=user,admin} [role]            User Role
   * @apiParam (Body Params) {String=user,admin} [role]            User Role
   *
   * @apiSuccess (Created 201) {String}  id         User's id
   * @apiSuccess (Created 201) {String}  name       User's name
   * @apiSuccess (Created 201) {String}  email      User's email
   * @apiSuccess (Created 201) {String}  role       User's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 401) Forbidden Only ADMINS can access the data
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   */
  .post(Authorize(), Validate(createMenu), controller.create);
app.route('/get-all')
  /**
     * @api {get} /menus/get-all List Menus
     * @apiDescription Get List of Menus
     * @apiVersion 1.0.0
     * @apiName ListMenus
     * @apiGroup Menus
     * @apiPermission ADMIN
     *
     * @apiHeader {String} Authorization  Menu's access token
     * @apiParam (Query Params) {String}            [email]             User Email
     * @apiParam (Query Params) {String}            [name]              User name
     * @apiParam (Query Params) {Number {1-100}}    [perPage=1]         User List limit per page
     * @apiParam (Query Params) {Number {1-}}       [page=1]            List Page
     * @apiParam (Query Params) {String=user,admin} [role]              User Role
     *
     * @apiSuccess {Object[]} list of users
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
     * @apiError (Forbidden 401) Forbidden Only ADMINS can access the data
     */
  .get(Authorize(), controller.getAllMenu)
app.route('/:menuId')
  /**
   * @api {get} /:menuId Get Menus Information
   * @apiDescription Get Menus Information
   * @apiVersion 1.0.0
   * @apiName Get Menus Information
   * @apiGroup Menus
   * @apiPermission USER
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (Created 201) {String}  id         User's id
   * @apiSuccess (Created 201) {String}  name       User's name
   * @apiSuccess (Created 201) {String}  email      User's email
   * @apiSuccess (Created 201) {String}  role       User's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   * @apiError (Not Found 403)    Forbidden    Only admins or user with same id can access data
   */
  .get(Authorize(), controller.getById)
  /**
   * @api {put} /menus/:menuId Update Menus
   * @apiDescription Update the whole menu document with a new one
   * @apiVersion 1.0.0
   * @apiName UpdateMenus
   * @apiGroup Menus
   * @apiPermission USER
   *
   * @apiHeader {String} Authorization  Menu's access token
   *
   * @apiParam  {String}             email     User's email
   * @apiParam  {String{6..128}}     password  User's password
   * @apiParam  {String{..128}}      [name]    User's name
   * @apiParam  {String=user,admin}  [role]    User's role
   * (You must be an admin to change the user's role)
   *
   * @apiSuccess {String}  id         User's id
   * @apiSuccess {String}  name       User's name
   * @apiSuccess {String}  email      User's email
   * @apiSuccess {String}  role       User's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .put(Authorize(), controller.update)
  /**
   * @api {patch} /menus/menuId Delete Menus
   * @apiDescription Delete a menu
   * @apiVersion 1.0.0
   * @apiName DeleteMenus
   * @apiGroup Menus
   * @apiPermission USER
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(Authorize(), controller.remove);

module.exports = app;
