const moment = require('moment');
const mongoose = require('../mongoose');
const Tag = mongoose.model('Tag');
const Article = mongoose.model('Article');

/**
 * 管理时, 获取标签列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getList = (req, res) => {
    Tag.find().sort('-tag_num').exec().then(result => {
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

exports.getItem = (req, res) => {
    let tag_name = req.query.tag_name;
    Tag.findOne({ tag_name: tag_name }).then(result => {
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

exports.getClassifyList = (req, res) => {
    Tag.find({ tag_classify: 'classify' }).sort('-tag_num').exec().then(result => {
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

exports.getClassifyItem = (req, res) => {
    let tag_name = req.query.tag_name;
    Tag.findOne({ tag_name: tag_name }).then(result => {
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

exports.insert = (req, res) => {
    let tag_name = req.body.tag_name;
    let tag_desc = req.body.tag_desc;
    let tag_classify = req.body.tag_classify;
    if (!tag_name) {
        return res.json({
            code: -200,
            message: '请填写标签名称'
        });
    }
    Tag.findOne({ tag_name }).then(result => {
        if (result) {
            return res.json({
                code: -200,
                message: '这个标签已经存在'
            });
        }
        return Tag.create({
            tag_name,
            tag_num: 0,
            tag_desc: tag_desc,
            tag_classify: tag_classify,
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

exports.deletes = (req, res) => {
    let tag_name = req.query.tag_name;
    Article.find({ tags: tag_name, is_delete: 0 }).then(reason => {
        if (reason.length === 0) {
            return Tag.update({ tag_name: tag_name }, { is_delete: 1 }).then(() => {
                res.json({
                    code: 200,
                    message: '失效成功！',
                    data: tag_name
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

exports.deleteCompletely = (req, res) => {
    let tag_name = req.query.tag_name;
    Article.find({ tags: tag_name, is_delete: 0 }).then(reason => {
        if (reason.length === 0) {
            return Tag.remove({ tag_name: tag_name }).then(() => {
                res.json({
                    code: 200,
                    message: '彻底删除成功！',
                    data: tag_name
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

exports.recover = (req, res) => {
    let tag_name = req.query.tag_name;
    Tag.update({ tag_name: tag_name }, { is_delete: 0 }).then(() => {
        res.json({
            code: 200,
            message: '恢复成功',
            data: tag_name
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

exports.modify = (req, res) => {
    let tag_name = req.body.tag_name;
    let tag_name_old = req.body.tag_name_old;
    let data = {
        tag_name, update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Tag.findOneAndUpdate({ tag_name: tag_name_old }, data, { new: true }).then(result => {
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
