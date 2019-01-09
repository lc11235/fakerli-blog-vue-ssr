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
            message: '取得未阅读数成功',
            data: {
                count: result
            }
        };
        res.json(json);
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 取得所有未读消息数量
 * @method
 * @param {[object]} req [请求体]
 * @param {[object]} res [回复体]
 */
exports.getAllMessage = (req, res) => {
    let userid = req.cookies.f_userId;
    Message.find({ id: userid }).then(result => {
        let unread = [];
        let readed = [];
        let trash = [];
        if (result) {
            for (let i = 0; i < result.length; i++) {
                if (result.is_readed === 0 && result.is_delete === 0) {
                    unread.push({
                        title: result.title,
                        content: result.content,
                        create_time: result.create_date
                    });
                } else if (result.is_readed === 1 && result.is_delete === 0) {
                    readed.push({
                        title: result.title,
                        content: result.content,
                        create_time: result.create_date
                    });
                } else {
                    trash.push({
                        title: result.title,
                        content: result.content,
                        create_time: result.create_date
                    });
                }
            }
            return res.json({
                code: 200,
                message: '取出消息成功',
                data: {
                    unread: unread,
                    readed: readed,
                    trash: trash
                }
            });
        }
        return res.json({
            code: -200,
            message: '取出消息失败'
        });

    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};