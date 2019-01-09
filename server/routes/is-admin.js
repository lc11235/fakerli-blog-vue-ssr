const jwt = require('jsonwebtoken');
const config = require('../config');
const secret = config.secretServer;

module.exports = (req, res, next) => {
    let token = req.cookies.f_token;
    let userid = req.cookies.f_userId;
    let username = req.cookies.f_userName;
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (!err && decoded.id === userid && decoded.username === username) {
                req.decoded = decoded;
                next();
            } else {
                res.cookie('b_user', '', { maxAge: 0 });
                res.cookie('b_userid', '', { maxAge: 0 });
                res.cookie('b_username', '', { maxAge: 0 });
                return res.json({
                    code: -500,
                    message: '登录失败',
                    data: ''
                });
            }
        });
    } else {
        return res.json({
            code: -500,
            message: '请先登录',
            data: ''
        });
    }
};