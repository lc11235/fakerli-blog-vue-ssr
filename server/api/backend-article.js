const moment = require('moment');
const mongoose = require('../mongoose');
const Article = mongoose.model('Article');
const Category = mongoose.model('Category');
const general = require('./general');

const list = general.list;

const marked = require('marked');
const hljs = require('highlight.js');
marked.setOptions({
    highlight(code) {
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});

/**
 * 管理时，获取文章列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getList = (req, res) => {
    list(req, res, Article, '-update_date');
};

/**
 * 管理时，获取单篇文章
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getItem = (req, res) => {
    let title = req.query.title;
    if (!id) {
        res.json({
            code: -200,
            message: '参数错误'
        });
    }
    Article.findOne({ title: title }).then(result => {
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
 * 发布文章
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.insert = (req, res) => {
    let categorys = req.body.category,
        content = req.body.content,
        html = marked(content),
        title = req.body.title;
    let arr_category = categorys.split("|");
    let data = {
        title,
        content,
        html,
        category_name: arr_category,
        visit: 0,
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X')
    };
    Article.create(data).then(result => {
        return Category.update({ cate_name: { '$in': arr_category } }, { '$inc': { 'cate_num': 1 } }).then(() => {
            return res.json({
                code: 200,
                message: '发布成功',
                data: result
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
 * 管理时，删除文章
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.deletes = (req, res) => {
    let title = req.query.title;
    let categorys = req.query.categorys;
    let arr_category = categorys.split("|");
    Article.update({ title: title }, { is_delete: 1 }).then(() => {
        return Category.update({ cate_name: { '$in': arr_category } }, { '$inc': { 'cate_num': -1 } }).then(result => {
            res.json({
                code: 200,
                message: '更新成功',
                data: result
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
 * 管理时，恢复文章
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.recover = (req, res) => {
    let title = req.query.title;
    let categorys = req.query.categorys;
    let arr_category = categorys.split("|");
    Article.update({ title: title }, { is_delete: 0 }).then(() => {
        return Category.update({ cate_name: { '$in': arr_category } }, { '$inc': { 'cate_num': 1 } }).then(() => {
            res.json({
                code: 200,
                message: '更新成功',
                data: 'success'
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
 * 管理时，编辑文章
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.modify = (req, res) => {
    let categorys = req.query.categorys,
        categorys_old = req.body.categorys_old,
        content = req.body.content,
        html = marked(content),
        title = req.body.title;
    let arr_categorys = categorys.length > 0 ? categorys.split("|") : null;
    let arr_categorys_old = categorys_old.length > 0 ? categorys_old.split("|") : null;
    let data = {
        title: title,
        $push: { category_name: arr_category },
        content,
        html,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Article.findOneAndUpdate({ title: title }, data, { new: true }).then(result => {
        if (categorys.length > 0 && categorys_old.length > 0) {
            Promise.all([
                Category.update({ cate_name: { '$in': arr_categorys } }, { '$inc': { 'cate_num': 1 } }),
                Category.update({ cate_name: { '$in': arr_categorys_old } }, { '$inc': { 'cate_num': -1 } })
            ]).then(() => {
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
        } else if (categorys.length > 0 && categorys_old.length === 0) {
            Category.update({ cate_name: { '$in': arr_categorys } }, { '$inc': { 'cate_num': 1 } }).then(() => {
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
        } else if (categorys.length === 0 && categorys_old.length > 0) {
            Category.update({ cate_name: { '$in': arr_categorys_old } }, { '$inc': { 'cate_num': -1 } }).then(() => {
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
        } else {
            res.json({
                code: 200,
                message: '更新成功',
                data: result
            });
        }
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        })
    });
};