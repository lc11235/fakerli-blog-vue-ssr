const jwt = require('jsonwebtoken');
const config = require('../config');
const secret = config.secretClient;

module.exports = (req, res, next) => {
    let token = req.cookies.user,
        userid = req.cookies.userid,
        username = req.cookies.username;
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (!err && decoded.id === userid && decoded.username === username) {
                req.decoded = decoded;
                next();
            } else {
                res.cookie('user', '', { maxAge: 0 });
                res.cookie('userid', '', { maxAge: 0 });
                res.cookie('username', '', { maxAge: 0 });
                return res.json({
                    code: -400,
                    message: '登录验证失败',
                    data: ''
                });
            }
        });
    } else {
        return res.json({
            code: -400,
            message: '请先登录',
            data: ''
        });
    }
};