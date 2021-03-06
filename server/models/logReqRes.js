const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const LogReqResSchema = new Schema({
    reqTime: String,
    reqHttpVersion: String,
    reqMethod: String,
    reqUrl: String,
    reqReferrer: String,
    reqRemoteAddr: String,
    reqUserAgent: String,
    reqHeader: String,
    resStatus: Number,
    resHeader: String,
    resTime: String,
    resContentLength: String,
    create_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number
});

const LogReqRes = mongoose.model('LogReqRes', LogReqResSchema);
Promise.promisifyAll(LogReqRes);
Promise.promisifyAll(LogReqRes.prototype);

module.exports = LogReqRes;