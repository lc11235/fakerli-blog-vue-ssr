const moment = require('moment');
const mongoose = require('../mongoose');
const Tag = mongoose.model('Tag');

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

exports.insert = (req, res) => {
    let tag_name = req.body.tag_name;
    if (!tag_name) {
        res.json({
            code: -200,
            message: '请填写标签名称'
        });
    } else {
        return Tag.create({
            tag_name,
            create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            is_delete: 0,
            timestamp: moment().format('X')
        }).then(result => {
            res.json({
                code: 200,
                message: '添加成功',
                data: result._id
            });
        });
    }
};

exports.deletes = (req, res) => {
    let tag_name = req.query.tag_name;
    Tag.update({ tag_name: tag_name }, { is_delete: 1 }).then(() => {
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

exports.recover = (req, res) => {
    let tag_name = req.query.tag_name;
    Tag.update({ tag_name: tag_name }, { is_delete: 0 }).then(() => {
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

exports.modify = (req, res) => {
    let tag_name = req.body.tag_name;
    let data = {
        tag_name, update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Tag.findOneAndUpdate({ tag_name: tag_name }, data, { new: true }).then(result => {
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
