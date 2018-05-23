const express = require('express');
const routerWX = express.Router();

const publicApi = require('../api/wx/publicApi');

// 检查微信是否连接
routerWX.get('/checkServer', publicApi.checkServer);

module.exports = routerWX;