const mongoose = require('../mongoose');
const moment = require('moment');
const LogError = mongoose.model('LogError');
const LogReqRes = mongoose.model('LogReqRes');

/**
 * 将程序运行过程中产生的错误log存入数据库
 * @method
 * @param {[string]} stack [错误的堆栈]
 */
exports.saveLogError = (stack) => {
    let data = {
        stack,
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X')
    };

    LogError.create(data).catch(err => {
        console.log(err);
    });
};

/**
 * 将网站的所有请求log存入到数据库
 * @method
 * @param {[object]} reqResData [包含请求和回应的对象]
 */
exports.saveLogReqRes = (reqResData) => {
    let timeData = {
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X')
    };

    let data = Object.assign(reqResData, timeData);

    LogReqRes.create(data).catch(err => {
        console.log(err);
    });
};