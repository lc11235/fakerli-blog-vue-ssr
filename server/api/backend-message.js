const moment = require('moment');
const mongoose = require('../mongoose');
const Message = mongoose.model('Message');

/**
 * 取得所有未读消息数量
 * @method
 * @param {[object]} req [请求体]
 * @param {[object]} res [回复体]
 */
exports.getUnreadMessageCount = (req, res) => {
    Message.countDocuments({ is_readed: 0, is_delete: 0 }).then(result => {
        let json = {
            code: 200,
            count: result
        };
        res.json(json);
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};