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

/**
 * 用户注册
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.register = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    if (!username || !password || !email) {
        return res.json({
            code: -200,
            message: '请将表单填写完整!'
        });
    }
    Admin.findOne({
        username: username
    }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '该用户名已经被使用!'
            });
        }
        if (fsExistsSync('./admin.lock')) {
            return Admin.create({
                username: username,
                password: md5(md5Pre + password),
                email: email,
                access: 'normal',
                avator: '',
                create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                is_delete: 0,
                is_confirm: 1,
                is_login: 1,
                user_level: 0,
                timestamp: moment().format('X')
            }).then(() => {
                return res.json({
                    code: 200,
                    message: '已添加到申请列表，管理员审核后将发送邮件通知!'
                });
            }).catch(err => {
                return res.json({
                    code: -200,
                    message: err.toString()
                });
            });
        } else {
            return Admin.create({
                username: username,
                password: md5(md5Pre + password),
                email: email,
                access: 'super_admin',
                avator: '/static/images/me.png',
                create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                is_delete: 0,
                is_confirm: 0,
                is_login: 1,
                user_level: 2,
                timestamp: moment().format('X')
            }).then(() => {
                fs.writeFile('./admin.lock', username, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        return res.json({
                            code: 200,
                            message: '添加用户成功!'
                        });
                    }
                });
            }).catch(err => {
                return res.json({
                    code: -200,
                    message: err.toString()
                });
            });
        }
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 用户登录
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.login = (req, res) => {
    let password = req.body.password;
    let username = req.body.username;
    if (!username || !password) {
        return res.json({
            code: -200,
            message: '请输入用户名和密码！'
        });
    }
    Admin.findOneAndUpdate({
        username: username,
        password: md5(md5Pre + password),
        is_delete: 0,
        is_confirm: 0
    }, { is_login: 0 }).then(result => {
        if (result) {
            let token = jwt.sign({ id: result._id, username: encodeURI(username) }, secret, { expiresIn: 60 * 60 * 24 * 1 });
            return res.json({
                code: 200,
                message: '登录成功',
                data: {
                    token: token,
                    name: encodeURI(username),
                    id: result._id
                }
            });
        }
        return res.json({
            code: -200,
            message: '用户名或者密码错误！'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 用户登出
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.logout = (req, res) => {
    let userId = req.cookies.f_userId;
    if (!userId) {
        res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.findOneAndUpdate({ _id: userId }, { is_login: 1 }).then(result => {
        if (result) {
            return res.json({
                code: 200,
                message: '登出成功！'
            });
        }
        return res.json({
            code: -200,
            message: '登出失败！'
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 用户信息
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getInfo = (req, res) => {
    let userId = req.cookies.f_userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.findOne({ _id: userId }).then(result => {
        if (result) {
            return res.json({
                code: 200,
                message: '拉取信息成功！',
                data: {
                    avator: result.avator,
                    access: result.access
                }
            });
        }
        return res.json({
            code: -200,
            message: '拉取信息失败！'
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

// ----普通账号---------

/**
 * 获取普通用户账号列表
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getUserList = (req, res) => {
    let sortlist = '-update_date';
    let limit = req.body.limit || req.query.limit;
    let page = req.body.page || req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let skip = (page - 1) * limit;
    Promise.all([
        Admin.find({ user_level: 0 }).sort(sortlist).skip(skip).limit(limit).exec(),
        Admin.countDocuments()
    ]).then(result => {
        if (result[1] === 0) {
            return res.json({
                code: -200,
                message: '无数据！'
            });
        }
        return res.json({
            code: 200,
            message: '取的普通用户账号列表成功！',
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

/**
 * 增加单个普通用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.insertUserSingle = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    if (!username || !password || !email) {
        return res.json({
            code: -200,
            message: '请将表单填写完整!'
        });
    }
    Admin.findOne({ username: username }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '该用户已经存在!'
            });
        }
        return Admin.create({
            username: username,
            password: md5(md5Pre + password),
            email: email,
            access: 'normal',
            avator: '',
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_delete: 0,
            is_confirm: 1,
            is_login: 1,
            user_level: 0,
            timestamp: moment().format('X')
        }).then(() => {
            return res.json({
                code: 200,
                message: '已添加到申请账号列表，管理员审核后将发送邮件通知!',
            });
        }).catch(err => {
            return res.json({
                code: -200,
                message: err.toString()
            });
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 删除单个普通用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteUserSingle = (req, res) => {
    let userId = req.query.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { is_delete: 1, is_login: 1 }).then(() => {
        return res.json({
            code: 200,
            message: '失效普通用户账号成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 编辑单个普通用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.modifyUserSingle = (req, res) => {
    let userId = req.body.userId;
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    let access = req.body.access;
    let avator = req.body.avator;
    if (!userId || !email || !password || !username || !access || !avator) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    let data = {
        email: email,
        username: username,
        password: md5(md5Pre + password),
        access: access,
        avator: avator,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Admin.find({ username: username }).then(result => {
        if (result) {
            return res.json({
                code: -2000,
                message: '用户名称已存在！'
            });
        }
        return Admin.findOneAndUpdate({ _id: userId }, data, { new: true }).then(result => {
            return res.json({
                code: 200,
                message: '更新普通用户账号成功！',
                data: result
            });
        }).catch(err => {
            return res.json({
                code: -200,
                message: err.toString()
            });
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 获取单个普通用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getUserSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.findOne({ _id: userId }).then(result => {
        return res.json({
            code: 200,
            message: '取的普通用户账号资料成功！',
            data: result
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 恢复单个普通用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.recoverUserSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { is_delete: 0 }).then(() => {
        return res.json({
            code: 200,
            message: '恢复普通用户账号成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 彻底删除单个普通用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */

exports.deleteUserCompletelySingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.remove({ _id: userId }).then(() => {
        return res.json({
            code: 200,
            message: '删除普通用户账号成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 审核单个普通账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.confirmUserSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { is_confirm: 1 }).then(() => {
        return res.json({
            code: 200,
            message: '审核普通用户账号成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 提升普通账号权限
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.upgradeUserLevel = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { user_level: 1 }).then(() => {
        return res.json({
            code: 200,
            message: '升级普通用户账号权限成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 取消普通账号的登录
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.logoutUserSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { is_login: 1 }).then(() => {
        return res.json({
            code: 200,
            message: '取消普通用户账号登录成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

// ----管理账号---------------

/**
 * 获取管理用户账号列表
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getAdminList = (req, res) => {
    let sortlist = '-update_date';
    let limit = req.body.limit || req.query.limit;
    let page = req.body.page || req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let skip = (page - 1) * limit;
    Promise.all([
        Admin.find({ user_level: 1 }).sort(sortlist).skip(skip).limit(limit).exec(),
        Admin.countDocuments()
    ]).then(result => {
        if (result[1] === 0) {
            return res.json({
                code: -200,
                message: '无数据！'
            });
        }
        return res.json({
            code: 200,
            message: '查询管理用户账号列表成功！',
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

/**
 * 增加单个管理用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.insertAdminSingle = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    if (!username || !password || !email) {
        return res.json({
            code: -200,
            message: '请将表单填写完整!'
        });
    }
    Admin.findOne({ username: username }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '该用户账号已经存在!'
            });
        }
        return Admin.create({
            username,
            password: md5(md5Pre + password),
            email,
            access: 'normal',
            avator: '',
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_delete: 0,
            is_confirm: 0,
            user_level: 1,
            timestamp: moment().format('X')
        }).then(() => {
            return res.json({
                code: 200,
                message: '已添加到申请账号列表，管理员审核后将发送邮件通知!',
            });
        }).catch(err => {
            return res.json({
                code: -200,
                message: err.toString()
            });
        });

    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 删除单个管理用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteAdminSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { is_delete: 1 }).then(() => {
        return res.json({
            code: 200,
            message: '失效管理用户账号成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 编辑单个管理用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.modifyAdminSingle = (req, res) => {
    let userId = req.body.userId;
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    let access = req.body.access;
    let avator = req.body.avator;
    if (!userId || !email || !password || !username || !access || !avator) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    let data = {
        email: email,
        username: username,
        password: md5(md5Pre + password),
        access: access,
        avator: avator,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Admin.find({ username: username }).then(result => {
        if (result) {
            return res.json({
                code: -2000,
                message: '用户名称已存在！'
            });
        }
        return Admin.findOneAndUpdate({ _id: userId }, data, { new: true }).then(result => {
            return res.json({
                code: 200,
                message: '更新管理用户账号成功！',
                data: result
            });
        }).catch(err => {
            return res.json({
                code: -200,
                message: err.toString()
            });
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 获取单个管理用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getAdminSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.findOne({ _id: userId }).then(result => {
        return res.json({
            code: 200,
            message: '取得管理用户账号资料成功！',
            data: result
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 恢复单个管理用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.recoverAdminSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { is_delete: 0 }).then(() => {
        return res.json({
            code: 200,
            message: '恢复管理用户账号成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 彻底删除单个管理用户账号
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */

exports.deleteAdminCompletelySingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.remove({ _id: userId }).then(() => {
        return res.json({
            code: 200,
            message: '删除管理用户账号成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 降低管理账号权限
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.downgradeAdminLevel = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { user_level: 0 }).then(() => {
        return res.json({
            code: 200,
            message: '降低管理用户账号权限成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 取消管理账号的登录
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.logoutAdminSingle = (req, res) => {
    let userId = req.body.userId;
    if (!userId) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Admin.update({ _id: userId }, { is_login: 1 }).then(() => {
        return res.json({
            code: 200,
            message: '取消管理用户账号登录成功！',
            data: userId
        });
    }).catch(err => {
        return res.json({
            code: -200,
            message: err.toString()
        });
    });
};