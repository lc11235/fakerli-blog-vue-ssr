const moment = require('moment');
const mongoose = require('../mongoose');
const Category = mongoose.model('Category');
const general = require('./general');

const item = general.item;
const modify = general.modify;
const recover = general.recover;
const deletes = general.deletes;

/**
 * 管理时, 获取分类列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getList = (req, res) => {
    Category.find().sort('-cate_order').exec().then(result => {
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
    item(req, res, Category);
};

exports.insert = (req, res) => {
    let cate_name = req.body.cate_name;
    cate_order = req.body.cate_order;

    if (!cate_name || !cate_order) {
        res.json({
            code: -200,
            message: '请填写分类名称和排序'
        });
    } else {
        return Category.create({
            cate_name,
            cate_order,
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
    deletes(req, res, Category);
};

exports.recover = (req, res) => {
    recover(req, res, Category);
};

exports.modify = (req, res) => {
    let _id = req.body.id,
        cate_name = req.body.cate_name,
        cate_order = req.body.cate_order;

    modify(res, Category, _id, {
        cate_name, cate_order, update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    });
};