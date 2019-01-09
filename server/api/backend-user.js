const md5 = require('md5');
const fs = require('fs');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const mongoose = require('../mongoose');
const Admin = mongoose.model('Admin');
const fsExistsSync = require('../utils').fsExistsSync;
const config = require('../config');
const md5Pre = config.md5Pre;
const secret = config.secretServer;
const general = require('./general');

const list = general.list;

/**
 * 获取管理员列表
 * @method getList
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getList = (req, res) => {
    list(req, res, Admin);
};

/**
 * 获取单个管理员
 * @method getItem
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getItem = (req, res) => {
    let username = req.query.username;
    if (!username) {
        res.json({
            code: -200,
            message: '参数错误'
        });
    }
    Admin.findOne({ username: username }).then(result => {
        res.json({
            code: 200,
            data: result
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理员登录
 * @method loginAdmin
 * @param  {[type]}   req [description]
 * @param  {[type]}   res [description]
 * @return {[type]}       [description]
 */
exports.login = (req, res) => {
    let json = {};
    let password = req.body.password;
    let username = req.body.username;
    if (username === '' || password === '') {
        json = {
            code: -200,
            message: '请输入用户名和密码'
        };
        return res.json(json);
    }
    console.log(username, password);
    Admin.findOneAndUpdate({
        username,
        password: md5(md5Pre + password),
        is_delete: 0,
        is_confirm: 0
    }, { is_login: 0 }).then(result => {
        if (result) {
            let id = result._id;
            username = encodeURI(username);
            let token = jwt.sign({ id, username }, secret, { expiresIn: 60 * 60 * 24 * 1 });
            return res.json({
                code: 200,
                message: '登录成功',
                data: {
                    token: token,
                    name: username,
                    id: id
                }
            });
        }
        return res.json({
            code: -200,
            message: '用户名或者密码错误'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 初始化时添加管理员
 * @method insertAdmin
 * @param  {Object}    req  [description]
 * @param  {Object}    res  [description]
 * @param  {Function}  next [description]
 * @return {json}         [description]
 */
exports.insert = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    if (!username || !password || !email) {
        return res.json({
            code: -200,
            message: '请将表单填写完整!'
        });
    }
    Admin.findOne({ username }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '该用户已经存在!'
            });
        }
        if (fsExistsSync('./admin.lock')) {
            return Admin.create({
                username,
                password: md5(md5Pre + password),
                email,
                access: 'normal',
                avator: '',
                create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                is_delete: 0,
                is_confirm: 1,
                timestamp: moment().format('X')
            }).then(() => {
                return res.json({
                    code: 200,
                    message: '已添加到申请列表，管理员审核后将发送邮件通知!',
                });
            });
        } else {
            return Admin.create({
                username,
                password: md5(md5Pre + password),
                email,
                access: 'super_admin',
                avator: '/dist/static/images/me.png',
                create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                is_delete: 0,
                is_confirm: 0,
                timestamp: moment().format('X')
            }).then(() => {
                fs.writeFile('./admin.lock', username, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        return res.json({
                            code: 200,
                            message: '添加用户成功!',
                            data: username
                        });
                    }
                });
            });
        }
    }).catch(err => console.log(err));
};

/**
 * 管理员编辑
 * @method modifyAdmin
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.modify = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    let data = {
        email, username, update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    if (password) data.password = md5(md5Pre + password);
    Admin.findOneAndUpdate({ username: username }, data, { new: true }).then(result => {
        res.json({
            code: 200,
            message: '更新成功',
            data: result
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理员删除
 * @method deletes
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.deletes = (req, res) => {
    let username = req.query.username;
    Admin.update({ username: username }, { is_delete: 1 }).then(() => {
        res.json({
            code: 200,
            message: '更新成功',
            data: 'success'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理员恢复
 * @method recover
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.recover = (req, res) => {
    let username = req.query.username;
    Admin.update({ username: username }, { is_delete: 0 }).then(() => {
        res.json({
            code: 200,
            message: '更新成功',
            data: 'success'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 取得用户详细信息
 * @method getInfo
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.getInfo = (req, res) => {
    let userid = req.cookies.f_userId;
    Admin.findOne({ _id: userid }).then(result => {
        if (result) {
            return res.json({
                code: 200,
                message: '拉取信息成功',
                data: {
                    avator: result.avator,
                    access: result.access
                }
            });
        }
        return res.json({
            code: -200,
            message: '拉取信息失败'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 取得用户详细信息
 * @method logout
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.logout = (req, res) => {
    let userid = req.cookies.f_userId;
    Admin.findOneAndUpdate({ _id: userid }, { is_login: 1 }).then(result => {
        if (result) {
            return res.json({
                code: 200,
                message: '登出成功'
            });
        }
        return res.json({
            code: -200,
            message: '登出失败'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};