const moment = require('moment');
const mongoose = require('../mongoose');
const Article = mongoose.model('Article');
const Category = mongoose.model('Category');
const general = require('./general');

const list = general.list;
const item = general.item;

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
    item(req, res, Article);
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
    let category = arr_category[0];
    let category_name = arr_category[1];
    let data = {
        title,
        category,
        category_name,
        content,
        html,
        visit: 0,
        like: 0,
        comment_count: 0,
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X')
    };
    Article.create(data).then(result => {
        return Category.update({ _id: category }, { '$inc': { 'cate_num': 1 } }).then(() => {
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
    let id = req.query.id;
    Article.update({ _id: id }, { is_delete: 1 }).then(() => {
        return Category.update({ _id: id }, { '$inc': { 'cate_num': 1 } }).then(result => {
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
    let id = req.query.id;
    Article.update({ _id: id }, { is_delete: 0 }).then(() => {
        return Category.update({ _id: id }, { '$inc': { 'cate_num': 1 } }).then(() => {
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
    let category = req.body.category,
        category_old = req.body.category_old,
        content = req.body.content,
        html = marked(content),
        id = req.body.id;
    let data = {
        title: req.body.title,
        category: req.body.category,
        category_name: req.body.category_name,
        content,
        html,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Article.findOneAndUpdate({ _id: id }, data, { new: true }).then(result => {
        if (category !== category_old) {
            Promise.all([
                Category.update({ _id: category }, { '$inc': { 'cate_num': 1 } }),
                Category.update({ _id: category_old }, { '$inc': { 'cate_num': -1 } })
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
                })
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