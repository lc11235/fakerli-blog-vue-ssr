const Log = require('../api/log.js');

/**
 * 将程序运行过程中产生的错误log存入数据库
 * @method
 * @param {[object]} logData [错误的堆栈/请求回应的数据]
 * @param {[string]} logType [log的类型:1.ERROR, 2.REQRES]
 */
exports.saveLog = (logData, logType) => {
    if (logType === 'ERROR') {
        Log.saveLogError(logData);
    } else {
        Log.saveLogReqRes(logData);
    }
};