const moment = require('moment');
const mongoose = require('../mongoose');
const Tag = mongoose.model('Tag');

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
    return Promise.all([
        Tag.find({ tag_classify: { $ne: 'classify' }}).sort(sortlist).skip(skip).limit(limit).exec(),
        Tag.countDocuments({ tag_classify: { $ne: 'classify' }})
    ]).then(result => {
        if (result[1] === 0) {
            return res.json({
                code: -200,
                message: '无数据！'
            });
        }
        return res.json({
            code: 200,
            message: '取得普通标签列表成功！',
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
 * 管理时, 插入单个普通标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.insertTagSingle = (req, res) => {
    let tagName = req.body.tagName;
    let tagDesc = req.body.tagDesc;
    let tagClassify = req.body.tagClassify;
    if (!tagName || !tagDesc || !tagClassify) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Tag.findOne({ tag_name: tagName }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '这个标签已经存在！'
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
            return res.json({
                code: 200,
                message: '添加普通标签成功！',
                data: resultTag
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
            message: '参数错误！'
        });
    }
    Tag.find({ _id: tagId, is_delete: 0, tag_num: { $gt: 0 }}).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '标签还在使用！'
            });
        }
        return Tag.update({ _id: tagId }, { is_delete: 1 }).then(() => {
            return res.json({
                code: 200,
                message: '失效普通标签成功！',
                data: tagId
            });
        }).catch(err => {
            return res.json({
                code: -200,
                message: err.toString()
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
    if (!tagId || !tagName || !tagDesc || !tagClassify) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    let data = {
        tag_name: tagName,
        tag_desc: tagDesc,
        tag_classify: tagClassify,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Tag.find({ tag_name: tagName }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '标签名已存在！'
            });
        }
        return Tag.findOneAndUpdate({ _id: tagId }, data, { new: true }).then(result => {
            return res.json({
                code: 200,
                message: '更新普通标签成功！',
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
            message: '参数错误！'
        });
    }
    Tag.findOne({ _id: tagId }).then(result => {
        if (result) {
            return res.json({
                code: 200,
                message: '查询普通标签成功！',
                data: result
            });
        } else {
            return res.json({
                code: -200,
                message: '查询失败！'
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
            message: '参数错误！'
        });
    }
    Tag.update({ _id: tagId }, { is_delete: 0 }).then(() => {
        return res.json({
            code: 200,
            message: '恢复普通标签成功！',
            data: tagId
        });
    }).catch(err => {
        return res.json({
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
            message: '参数错误！'
        });
    }
    Tag.find({ _id: tagId, tag_num: { $gt: 0 }}).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '标签还在使用！'
            });
        }
        return Tag.remove({ _id: tagId }).then(() => {
            return res.json({
                code: 200,
                message: '删除普通标签成功！',
                data: tagId
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
    return Promise.all([
        Tag.find({ tag_classify: 'classify' }).sort(sortlist).skip(skip).limit(limit).exec(),
        Tag.countDocuments({ tag_classify: 'classify' }).exec()
    ]).then(result => {
        if (result[1] === 0) {
            return res.json({
                code: -200,
                message: '无数据！'
            });
        }
        return res.json({
            code: 200,
            message: '取得特征标签列表成功！',
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
 * 管理时, 插入单个特征标签
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.insertClassifyTagSingle = (req, res) => {
    let tagName = req.body.tagName;
    let tagDesc = req.body.tagDesc;
    let tagClassify = req.body.tagClassify;
    if (!tagName || !tagDesc || !tagClassify) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    Tag.findOne({ tag_name: tagName }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '这个标签已经存在！'
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
            return res.json({
                code: 200,
                message: '添加特征标签成功！',
                data: resultTag
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
            message: '参数错误！'
        });
    }
    Tag.find({ _id: tagId, is_delete: 0 }).then(result => {
        if (result) {
            return Tag.find({ tag_classify: result.tag_name }).then(result1 => {
                if (result1) {
                    return res.json({
                        code: -200,
                        message: '有标签依赖此特征标签，不能删除！'
                    });
                }
                return Tag.update({ _id: tagId }, { is_delete: 1 }).then(() => {
                    res.json({
                        code: 200,
                        message: '失效特征标签成功！',
                        data: tagId
                    });
                }).catch(err => {
                    return res.json({
                        code: -200,
                        message: err.toString()
                    });
                });
            }).catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                });
            });
        }
        res.json({
            code: -200,
            message: '标签不存在！'
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
    if (!tagId || !tagName || !tagDesc || !tagClassify) {
        return res.json({
            code: -200,
            message: '参数错误！'
        });
    }
    let data = {
        tag_name: tagName,
        tag_desc: tagDesc,
        tag_classify: tagClassify,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Tag.find({ tag_name: tagName }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '标签名已经存在！'
            });
        }
        return Tag.find({ _id: tagId }).then(result1 => {
            if (result1) {
                return Promise.all([
                    Tag.update({ tag_classify: result1.tag_name }, { tag_classify: tagName }).exec(),
                    Tag.findOneAndUpdate({ _id: tagId }, data, { new: true }).exec()
                ]).then(result2 => {
                    if (result2[0] && result2[1]) {
                        return res.json({
                            code: 200,
                            message: '更新特征标签成功！',
                            data: result
                        });
                    }
                }).catch(err => {
                    return res.json({
                        code: -200,
                        message: err.toString()
                    });
                });
            }
            return res.json({
                code: -200,
                message: '未找到此标签！'
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
            message: '参数错误！'
        });
    }
    Tag.findOne({ _id: tagId }).then(result => {
        return res.json({
            code: 200,
            message: '取得特征标签成功！',
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
            message: '参数错误！'
        });
    }
    Tag.update({ _id: tagId }, { is_delete: 0 }).then(() => {
        res.json({
            code: 200,
            message: '恢复特征标签成功！',
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
            message: '参数错误！'
        });
    }
    Tag.find({ _id: tagId, is_delete: 0 }).then(result => {
        if (result) {
            return Tag.find({ tag_classify: result.tag_name }).then(result1 => {
                if (result1) {
                    return res.json({
                        code: -200,
                        message: '有标签依赖此特征标签，不能删除！'
                    });
                }
                return Tag.remove({ _id: tagId }).then(() => {
                    res.json({
                        code: 200,
                        message: '删除特征标签成功！',
                        data: tagId
                    });
                }).catch(err => {
                    return res.json({
                        code: -200,
                        message: err.toString()
                    });
                });
            }).catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                });
            });
        }
        res.json({
            code: -200,
            message: '标签不存在！'
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};
