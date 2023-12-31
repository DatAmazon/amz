const app = require('express').Router();
const Validate = require('express-validation');
const controller = require('../../controller/user');
const upload = require('../../../extensions/upload');
const { Authorize } = require('../../../middleware/authorzie-attribute');
const { listUsers, createUser, replaceUser, updateUser, } = require('../../validations/systems/user');

/**
 * Load User when API with userId params is Hit
 */
// app.param('userId', controller.load); Chạy trước các api có param userId
app.route('/notice')
  /**
   * @api {get} /notice List notice
   * @apiDescription Get List of notice
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup Users
   * @apiPermission ADMIN
   *
   * @apiHeader {String} Authorization  User's access token
   *
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
  .get(Authorize(), controller.getNotice);
app.route('/')
  /**
   * @api {get} /users List Users
   * @apiDescription Get List of Users
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup Users
   * @apiPermission ADMIN
   *
   * @apiHeader {String} Authorization  User's access token
   *
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
  .get(Authorize(), Validate(listUsers), controller.getPagination)
  /**
   * @api {post} /users Create Users
   * @apiDescription Create Users
   * @apiVersion 1.0.0
   * @apiName Create User
   * @apiGroup Users
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
  .post(Authorize(), Validate(createUser), controller.create);

app.route('/profile')
  /**
   * @api {get} /users/profile Get User profile
   * @apiDescription Get User's Profile
   * @apiVersion 1.0.0
   * @apiName User Profile
   * @apiGroup Users
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
   */
  .get(Authorize(), controller.profile);

app.route('/:userId')
  /**
   * @api {get} /:userId Get User Information
   * @apiDescription Get Users Information
   * @apiVersion 1.0.0
   * @apiName Get User Information
   * @apiGroup Users
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
   * @api {put} /users/:userId Update User
   * @apiDescription Update the whole user document with a new one
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup Users
   * @apiPermission USER
   *
   * @apiHeader {String} Authorization  User's access token
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
  .put(Authorize(), Validate(updateUser), controller.update)
  /**
   * @api {put} /users/userId Replace User
   * @apiDescription Replace some fields of a user document
   * @apiVersion 1.0.0
   * @apiName ReplaceUser
   * @apiGroup Users
   * @apiPermission USER
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}             [email]     User's email
   * @apiParam  {String{6..128}}     [password]  User's password
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
  .patch(Authorize(), Validate(replaceUser), controller.replace)
  /**
   * @api {patch} /users/userId Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup Users
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

app.route('/upload').post(upload.single('profile'), controller.upload);

module.exports = app;
