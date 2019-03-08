const moment = require('moment');
const mongoose = require('../mongoose');
const Tag = mongoose.model('Tag');
const Article = mongoose.model('Article');

// ------------------普通标签的操作-----------------

/**
 * 管理时, 获取普通标签列表
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getTagList = (req, res) => {
    let sortlist = '-tag_num';
    let limit = req.body.limit || req.query.limit;
    let page = req.body.page || req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let skip = (page - 1) * limit;
    Promise.all([
        Tag.find({ tag_classify: { $ne: 'classify' }}).sort(sortlist).skip(skip).limit(limit).exec(),
        Tag.countDocuments()
    ]).then(result => {
        let total = result[1];
        // let totalPage = Math.ceil(total / limit);
        let json = {
            code: 200,
            data: {
                list: result[0],
                total,
                page: page
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
 * 管理时, 插入单个普通标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.insertTagSingle = (req, res) => {
    let tagName = req.body.tagName;
    let tagDesc = req.body.tagDesc;
    let tagClassify = req.body.tagClassify;
    if (!tagName) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagDesc) {
        return res.json({
            code: -200,
            message: '请填写标签描述'
        });
    }
    if (!tagClassify) {
        return res.json({
            code: -200,
            message: '请选择标签类型'
        });
    }
    Tag.findOne({ tag_name: tagName }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '这个标签已经存在'
            });
        }
        return Tag.create({
            tag_name: tagName,
            tag_num: 0,
            tag_desc: tagDesc,
            tag_classify: tagClassify,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_delete: 0,
            timestamp: moment().format('X')
        }).then(resultTag => {
            res.json({
                code: 200,
                message: '添加成功',
                data: resultTag
            });
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理时, 删除单个普通标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteTagSingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Article.find({ _id: tagId, is_delete: 0 }).then(reason => {
        if (reason.length === 0) {
            return Tag.update({ _id: tagId }, { is_delete: 1 }).then(() => {
                res.json({
                    code: 200,
                    message: '失效成功！',
                    data: tagId
                });
            });
        }
        res.json({
            code: -200,
            message: '标签还在使用！'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理时, 修改单个普通标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.modifyTagSingle = (req, res) => {
    let tagId = req.body.tagId;
    let tagName = req.body.tagName;
    let tagDesc = req.body.tagDesc;
    let tagClassify = req.body.tagClassify;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagName) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagDesc) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagClassify) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    let data = {
        tag_name: tagName,
        tag_desc: tagDesc,
        tag_classify: tagClassify,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Tag.findOneAndUpdate({ _id: tagId }, data, { new: true }).then(result => {
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
 * 管理时, 查询单个普通标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getTagSingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Tag.findOne({ _id: tagId }).then(result => {
        if (result) {
            return res.json({
                code: 200,
                message: '查询成功！',
                data: result
            });
        } else {
            res.json({
                code: -200,
                message: '查询失败！'
            });
        }
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理时, 恢复单个普通标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.recoverTagSingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Tag.update({ _id: tagId }, { is_delete: 0 }).then(() => {
        res.json({
            code: 200,
            message: '恢复成功',
            data: tagId
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理时, 彻底删除单个普通标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteTagCompletelySingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Article.find({ _id: tagId, is_delete: 0 }).then(reason => {
        if (reason.length === 0) {
            return Tag.remove({ _id: tagId }).then(() => {
                res.json({
                    code: 200,
                    message: '彻底删除成功！',
                    data: tagId
                });
            });
        }
        res.json({
            code: -200,
            message: '标签还在使用！'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

// ------------------特征标签的操作-----------------

/**
 * 管理时, 获取特征标签列表
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getClassifyTagList = (req, res) => {
    let sortlist = '-tag_num';
    let limit = req.body.limit || req.query.limit;
    let page = req.body.page || req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let skip = (page - 1) * limit;
    Tag.find({ tag_classify: 'classify' }).sort(sortlist).skip(skip).limit(limit).exec().then(result => {
        let json = {
            code: 200,
            data: {
                list: result
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
 * 管理时, 插入单个特征标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.insertClassifyTagSingle = (req, res) => {
    let tagName = req.body.tagName;
    let tagDesc = req.body.tagDesc;
    let tagClassify = req.body.tagClassify;
    if (!tagName) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagDesc) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagClassify) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Tag.findOne({ tag_name: tagName }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '这个标签已经存在'
            });
        }
        return Tag.create({
            tag_name: tagName,
            tag_num: 0,
            tag_desc: tagDesc,
            tag_classify: tagClassify,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_delete: 0,
            timestamp: moment().format('X')
        }).then(resultTag => {
            res.json({
                code: 200,
                message: '添加成功',
                data: resultTag
            });
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理时, 删除单个特征标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteClassifyTagSingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Article.find({ _id: tagId, is_delete: 0 }).then(reason => {
        if (reason.length === 0) {
            return Tag.update({ _id: tagId }, { is_delete: 1 }).then(() => {
                res.json({
                    code: 200,
                    message: '失效成功！',
                    data: tagId
                });
            });
        }
        res.json({
            code: -200,
            message: '标签还在使用！'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理时, 修改单个特征标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.modifyClassifyTagSingle = (req, res) => {
    let tagId = req.body.tagId;
    let tagName = req.body.tagName;
    let tagDesc = req.body.tagDesc;
    let tagClassify = req.body.tagClassify;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagName) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagDesc) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    if (!tagClassify) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    let data = {
        tag_name: tagName,
        tag_desc: tagDesc,
        tag_classify: tagClassify,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Tag.findOneAndUpdate({ _id: tagId }, data, { new: true }).then(result => {
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
 * 管理时, 查询单个特征标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getClassifyTagSingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Tag.findOne({ _id: tagId }).then(result => {
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
 * 管理时, 恢复单个特征标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.recoverClassifyTagSingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Tag.update({ _id: tagId }, { is_delete: 0 }).then(() => {
        res.json({
            code: 200,
            message: '恢复成功',
            data: tagId
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

/**
 * 管理时, 彻底删除单个特征标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteClassifyTagCompletelySingle = (req, res) => {
    let tagId = req.query.tagId;
    if (!tagId) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Article.find({ _id: tagId, is_delete: 0 }).then(reason => {
        if (reason.length === 0) {
            return Tag.remove({ _id: tagId }).then(() => {
                res.json({
                    code: 200,
                    message: '彻底删除成功！',
                    data: tagId
                });
            });
        }
        res.json({
            code: -200,
            message: '标签还在使用！'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};
