const moment = require('moment');
const mongoose = require('../mongoose');
const Article = mongoose.model('Article');
const Tag = mongoose.model('Tag');

const marked = require('marked');
const hightlight = require('highlight.js');
marked.setOptions({
    highlight(code) {
        return hightlight.highlightAuto(code).value;
    },
    breaks: true
});

const elastic = require('../utils/searchIndex.js');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: '/home/fakerli-blog-vue-ssr/article/md',
    filename: (req, file, cb) => {
        let fileFormat = file.originalname.split('.');
        cb(null, file.fieldname + '-' + moment().format('YYYY-MM-DD HH:mm:ss') + '.' + fileFormat[fileFormat.length - 1]);
    }
});

const uploadMulter = multer({
    storage: storage
});

const uploadFile = uploadMulter.single('file');

/**
 * 管理时，获取文章列表
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getArticleList = (req, res) => {
    let sortlist = '-update_date';
    let limit = req.body.limit || req.query.limit;
    let page = req.body.page || req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let skip = (page - 1) * limit;
    Promise.all([
        Article.find().sort(sortlist).skip(skip).limit(limit).exec(),
        Article.countDocuments()
    ]).then(result => {
        let total = result[1];
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
 * 发布文章
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.insertArticleSingle = (req, res) => {
    let tagString = req.body.tagString;
    let content = req.body.content;
    // html = marked(content)
    let html = req.body.html;
    let title = req.body.title;
    let toc = req.body.tocHTML;
    let arr_tag = tagString.split('|');
    let data = {
        title,
        content,
        html,
        toc,
        tags: arr_tag,
        visit: 0,
        create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        is_delete: 0,
        timestamp: moment().format('X')
    };
    Article.create(data).then(result => {
        return Tag.update({ tag_name: { '$in': arr_tag }},
            { '$inc': { 'tag_num': 1 }},
            { upsert: true, multi: true }).then(() => {
            Article.findOne({ title: title }, 'title content html tags update_date').then(resultArticle => {
                elastic.addArticleIndex(resultArticle);
                return res.json({
                    code: 200,
                    message: '发布成功',
                    data: result
                });
            }).catch(err => {
                return res.json({
                    code: -200,
                    message: err.toString()
                });
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
 * 管理时，标记删除文章，文章在数据库中只是标记删除，未消失
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteArticleSingle = (req, res) => {
    console.log(req.query);
    let articleId = req.query.articleId;
    let tagList = req.query.tagList;
    let arr_tag = tagList.split('|');
    Article.update({ _id: articleId }, { is_delete: 1 }).then(() => {
        return Tag.update({ tag_name: { '$in': arr_tag }, tag_num: { '$gt': 0 }}, { '$inc': { 'tag_num': -1 }}, { upsert: false, multi: true }).then(result => {
            res.json({
                code: 200,
                message: '更新成功',
                data: articleId
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
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.modifyArticleSingle = (req, res) => {
    let tagListNew = req.body.tagListNew;
    let tagListOld = req.body.tagListOld;
    let content = req.body.content;
    let html = req.body.html;
    let toc = req.body.tocHTML;
    let title = req.body.title;
    let articleId = req.body.articleId;
    if (!tagListNew || !tagListOld || !content || !title || !articleId || !html) {
        res.json({
            code: -200,
            message: '参数错误'
        });
        return;
    }

    // let html = marked(content);
    let arr_tags = tagListNew.split('|');
    let arr_tags_old = tagListOld.split('|');
    let data = {
        title: title,
        $set: { tags: arr_tags },
        content,
        html,
        toc,
        update_date: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    Article.findOneAndUpdate({ _id: articleId }, data, { new: true }).then(result => {
        if (tagListNew !== tagListOld) {
            Promise.all([
                Tag.update({ tag_name: { '$in': arr_tags }}, { '$inc': { 'tag_num': 1 }}, { upsert: false, multi: true }),
                Tag.update({ tag_name: { '$in': arr_tags_old }}, { '$inc': { 'tag_num': -1 }}, { upsert: false, multi: true })
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
        });
    });
};

/**
 * 管理时，获取单篇文章
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.getArticleSingle = (req, res) => {
    let articleId = req.query.articleId;
    if (!articleId) {
        res.json({
            code: -200,
            message: '参数错误'
        });
    }
    Article.findOne({ _id: articleId }).then(result => {
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
 * 管理时，完全删除文章，即从数据库中删除
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.deleteCompletelyArticleSingle = (req, res) => {
    let articleId = req.query.articleId;
    let tagList = req.query.tagList;
    let arr_tag = tagList.split('|');
    Article.remove({ _id: articleId }).then(() => {
        return Tag.update({ tag_name: { '$in': arr_tag }, tag_num: { '$gt': 0 }}, { '$inc': { 'tag_num': -1 }}, { upsert: false, multi: true }).then(result => {
            res.json({
                code: 200,
                message: '更新成功',
                data: articleId
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
 * 管理时，恢复文章，这是文章被标记删除的时候才能提供的功能
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.recoverArticleSingle = (req, res) => {
    let articleId = req.query.articleId;
    let tagList = req.query.tagList;
    let arr_tag = tagList.split('|');
    Tag.find({ tag_name: { '$in': arr_tag }, is_delete: 1 }).then(reason => {
        if (reason.length > 0) {
            return res.json({
                code: -200,
                message: '有标签被删除，不可恢复文章！'
            });
        }
        Article.update({ _id: articleId }, { is_delete: 0 }).then(() => {
            return Tag.update({ tag_name: { '$in': arr_tag }}, { '$inc': { 'tag_num': 1 }}, { upsert: false, multi: true }).then(() => {
                res.json({
                    code: 200,
                    message: '更新成功',
                    data: articleId
                });
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
 * 管理时，上传已经写好的markdown格式的文章
 * @method
 * @param  {[type]} req [请求体]
 * @param  {[type]} res [返回体]
 */
exports.uploadArticleSingle = (req, res) => {
    uploadFile(req, res, err => {
        if (err) {
            res.json({
                code: -200,
                message: err.toString()
            });
        } else {
            res.json({
                code: 200,
                message: '更新成功'
            });
        }
    });
};