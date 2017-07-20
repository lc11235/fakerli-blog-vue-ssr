const moment = require('moment');
const mongoose = require('../mongoose');
const Article = mongoose.model('Article');
const Like = mongoose.model('Like');

exports.like = (req, res) => {
    let article_id = req.body.id,
        user_id = req.cookies.userid,
        data = {
            article_id,
            user_id,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            timestamp: moment().format('X')
        };
    Like.findOne({ article_id, user_id }).then(result => {
        if (result) {
            res.json({
                code: -200,
                message: '你已经赞过了!'
            });
        } else {
            Like.create(data).then(() => {
                return Article.update({ _id: article_id }, { '$inc': { 'like': 1 } }).then(() => {
                    return res.json({
                        code: 200,
                        message: '操作成功',
                        data: 'success'
                    });
                });
            }).catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                });
            });
        }
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

exports.unlike = (req, res) => {
    let article_id = req.query.id,
        user_id = req.cookies.userid;
    Like.remove({ article_id, user_id }).then(() => {
        return Article.update({ _id: article_id }, { '$inc': { 'like': -1 } }).then(() => {
            return res.json({
                code: 200,
                message: '操作成功',
                data: 'success'
            });
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};