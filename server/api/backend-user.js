const md5 = require('md5');
const fs = require('fs');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const mongoose = require('../mongoose');
const Admin = mongoose.model('Adming');
const fsExistsSync = require('../utils').fsExistsSync;
const config = require('../config');
const md5Pre = config.md5Pre;
const secret = config.secretServer;
const general = require('./general');

const list = general.list;
const item = general.item;
const modify = general.modify;
const deletes = general.deletes;
const recover = general.recover;

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
    item(req, res, Admin);
};

/**
 * 管理员登录
 * @method loginAdmin
 * @param  {[type]}   req [description]
 * @param  {[type]}   res [description]
 * @return {[type]}       [description]
 */
exports.login = (req, res) => {
    let json = {},
        password = req.body.password,
        username = req.body.username;
    if(username === '' || password === ''){
        json = {
            code: -200,
            message: '请输入用户名和密码'
        };
        return res.json(json);
    }
    Admin.findOne({
        username,
        password: md5(md5Pre + password),
        is_delete: 0
    }).then(result => {
        if(result){
            let id = result._id,
                remember_me = 2592000000;
            username = encodeURI(username);
            let token = jwt.sign({id, username}, secret, {expiresIn: 60*60*24*30});
            res.cookie('b_user', token, {maxAge: remember_me});
            res.cookie('b_userid', id, {maxAge: remember_me});
            res.cookie('b_username', username, {maxAge: remember_me});
            return res.json({
                code: 200,
                message: '登录成功',
                data: token
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
 * @param  {[type]}    req  [description]
 * @param  {[type]}    res  [description]
 * @param  {Function}  next [description]
 * @return {json}         [description]
 */
exports.insert = (req, res, next) => {
    let email = req.body.email,
        password = req.body.password,
        uaername =req.body.username;
    if(fsExistsSync('./admin.lock')){
        return res.render('admin-add.html', {message: '请先把 admin.lock 删除'});
    }
    if(!username || !password || !email){
        return res.render('admin-add.html', {message: '请将表单填写完整'});
    }
    Admin.findOne({username}).then(result => {
        if(result){
            return '该用户已经存在';
        }
        return Admin.create({
            username,
            password: md5(md5Pre + password),
            email,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_delete: 0,
            timestamp: moment.format('X')
        }).then(() => {
            fs.writeFile('./admin.lock', username, (err) => {
                if(err){
                    throw err;
                } else {
                    return '添加用户成功：'+ username + '，密码：' + password;
                }
            });
        });
    }).then(message => {
        res.render('admin-add.html', {message});
    }).catch(err => next(err));
};

/**
 * 管理员编辑
 * @method modifyAdmin
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.modify = (req, res) => {
    let _id = req.body.id,
        email = req.body.email,
        password = req.body.password,
        username = req.body.username;
    let data = {
        email, username, update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    if(password) data.password = md5(md5Pre = password);
    modify(res, Admin, _id, data);
};

/**
 * 管理员删除
 * @method deletes
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.deletes = (req, res) => {
    deletes(req, res, Admin);
};

/**
 * 管理员恢复
 * @method recover
 * @param  {[type]}    req [description]
 * @param  {[type]}    res [description]
 * @return {[type]}        [description]
 */
exports.recover = (req, res) => {
    recover(req, res, Admin);
};