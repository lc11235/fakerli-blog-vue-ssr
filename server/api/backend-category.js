const moment = require('moment');
const mongoose = require('../mongoose');
const Category = mongoose.model('Category');

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
    let cate_name = req.query.cate_name;
    if (!id) {
        res.json({
            code: -200,
            message: '参数错误'
        });
    }
    Category.findOne({ cate_name: cate_name }).then(result => {
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
    let cate_name = req.query.cate_name;
    Category.update({ cate_name: cate_name }, { is_delete: 1 }).then(() => {
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
    let cate_name = req.query.cate_name;
    Category.update({ cate_name: cate_name }, { is_delete: 0 }).then(() => {
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
    let cate_name = req.body.cate_name,
        cate_order = req.body.cate_order;
    let data = {
        cate_name, cate_order, update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Category.findOneAndUpdate({ cate_name: cate_name }, data, { new: true }).then(result => {
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
