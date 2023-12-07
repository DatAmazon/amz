const app = require('express').Router();
const Validate = require('express-validation');
const { Authorize } = require('../../../middleware/authorzie-attribute');
const controller = require('../../controller/thongdiep');

  app.route('/message-by-date')
  .post(Authorize(), controller.searchThongDiepByDate)
app.route('/message-by-date/export-excel')
  .post(Authorize(), controller.exportExcelThongDiepByDate)  

app.route('/detail-message-sent')
  .post(Authorize(), controller.searchDetailSent)
app.route('/detail-message-sent/export-excel')
  .post(Authorize(), controller.exportExcelDetailSent)

app.route('/detail-message-received')
  .post(Authorize(), controller.searchDetailReceived)
app.route('/detail-message-received/export-excel')
  .post(Authorize(), controller.exportExcelDetailReceived)

app.route('/:thongdiepId')
  /**
   * @api {get} /:thongdiepId Get ThongDiep Information
   * @apiDescription Get Menus Information
   * @apiVersion 1.0.0
   * @apiName Get ThongDiep Information
   * @apiGroup ThongDiep
   * @apiPermission ThongDiep
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (Created 201) {String}  id         Id thông điệp
   * @apiSuccess (Created 201) {String}  MNGui       Mã nơi gửi
   * @apiSuccess (Created 201) {String}  MNNhan      Mã nơi nhận
   * @apiSuccess (Created 201) {String}  MLTDiep       Mã loại thông điệp
   * @apiSuccess (Created 201) {String}    MTDiep  Mã thông điệp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   * @apiError (Not Found 403)    Forbidden    Only admins or user with same id can access data
   */
  .get(Authorize(), controller.getThongDiepById);



module.exports = app;
