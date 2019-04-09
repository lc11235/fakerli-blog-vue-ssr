const moment = require('moment');
const mongoose = require('../mongoose');
const LogReqRes = mongoose.model('LogReqRes');

/**
 * 管理时, 获取请求日志列表
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getLogReqResList = (req, res) => {
    let sortlist = '-tag_num';
    let limit = req.body.limit || req.query.limit;
    let page = req.body.page || req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let skip = (page - 1) * limit;
    return Promise.all([
        LogReqRes.find().sort(sortlist).skip(skip).limit(limit).exec(),
        LogReqRes.countDocuments()
    ]).then(result => {
        if (result[1] === 0) {
            return res.json({
                code: -200,
                message: '无数据！'
            });
        }
        return res.json({
            code: 200,
            message: '取得请求日志列表成功！',
            data: {
                list: result[0],
                total: result[1],
                page: page
            }
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};