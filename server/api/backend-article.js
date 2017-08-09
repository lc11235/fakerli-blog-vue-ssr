const moment = require('moment');
const mongoose = require('../mongoose');
const Article = mongoose.model('Article');
const Tag = mongoose.model('Tag');
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
    if (!title) {
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
    let tagString = req.body.tagString,
        content = req.body.content,
        html = marked(content),
        title = req.body.title;
    let arr_tag = tagString.split("|");
    let data = {
        title,
        content,
        html,
        tags: arr_tag,
        visit: 0,
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X')
    };
    Article.create(data).then(result => {
        return Tag.update({ tag_name: { '$in': arr_tag } }, 
                          { '$inc': { 'tag_num': 1 } }, 
                          {upsert: true, multi:true}).then(() => {
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
    let tagList = req.query.tagList;
    let arr_tag = tagList.split("|");
    Article.update({ title: title }, { is_delete: 1 }).then(() => {
        return Tag.update({ tags: { '$in': arr_tag } }, { '$inc': { 'tag_num': -1 } }).then(result => {
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
    let tagList = req.query.tagList;
    let arr_tag = tagList.split("|");
    Article.update({ title: title }, { is_delete: 0 }).then(() => {
        return Tag.update({ tags: { '$in': arr_tag } }, { '$inc': { 'tag_num': 1 } }).then(() => {
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
    let tagList_new = req.body.tagList_new,
        tagList_old = req.body.tagList_old,
        content = req.body.content,
        title = req.body.title;
        title_old = req.body.title_old;
    if (!tagList_new || !tagList_old || !content || !title || !title_old) {
        res.json({
            code: -200,
            message: '参数错误'
        });
        return;
    }

    let html = marked(content);
    let arr_tags = tagList_new.split('|');
    let arr_tags_old = tagList_old.split('|');
    let data = {
        title: title,
        $set: { tags: arr_tags },
        content,
        html,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    Article.findOneAndUpdate({ title: title_old }, data, { new: true }).then(result => {
        if (tagList_new !== tagList_old) {
            Promise.all([
                Tag.update({ tag_name: { '$in': arr_tags } }, { '$inc': { 'tag_num': 1 } }, {upsert: false,multi: true}),
                Tag.update({ tag_name: { '$in': arr_tags_old } }, { '$inc': { 'tag_num': -1 } }, {upsert: false,multi: true})
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