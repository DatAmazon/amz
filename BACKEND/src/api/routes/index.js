const express = require('express');
const app = express.Router();

/**
 * GET api/docs
 */
app.use('/docs', express.static('docs'));
app.use('/coverage', express.static('docs'));
app.use('/auth', require('./systems/auth'));
app.use('/users', require('./systems/user'));
app.use('/menus', require('./systems/menu'));
app.use('/thongdiep', require('./mvan/thongdiep'));
module.exports = app;
