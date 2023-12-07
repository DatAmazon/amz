const app = require('express').Router();
const validate = require('express-validation');
const { Authorize } = require("../../../middleware/authorzie-attribute");
const controller = require("../../controller/groupPermission");
const { create, update, remove } = require('../../validations/systems/groupPermission');
app.route("/")
    .get(Authorize(), controller.get)
    .post(Authorize(), validate(create), controller.create)
app.route("/by-user")
    .get(Authorize(), controller.getByUser)
app.route("/:groupCode")
    .get(Authorize(), controller.getByCode)
    .put(Authorize(), validate(update), controller.update)
    .delete(Authorize(), validate(remove), controller.remove)
module.exports = app;