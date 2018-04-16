const mongoose = require('../mongoose');
const Article = mongoose.model('Article');

/**
 * 前台浏览时, 获取文章列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getList = (req, res) => {
    let by = req.query.by;
    let tag = req.query.tag;
    let limit = req.query.limit;
    let page = req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let data = {
        is_delete: 0
    };
    let skip = (page - 1) * limit;
    if (tag) {
        data.tags = tag;
    }
    let sort = '-update_date';
    if (by) {
        sort = '-' + by;
    }

    let fields = 'title content tags create_date update_date is_delete timestamp';

    Promise.all([
        Article.find(data, fields).sort(sort).skip(skip).limit(limit).exec(),
        Article.count(data)
    ]).then(([result, total]) => {
        let totalPage = Math.ceil(total / limit);
        let resultData = result.map(item => {
            item.content = item.content.substring(0, 150);
            return item;
        });
        let json = {
            code: 200,
            data: {
                list: resultData,
                total,
                hasNext: totalPage > page ? 1 : 0,
                hasPrev: page > 1
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
 * 前台浏览时, 获取单篇文章
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
    Article.findOne({ title: title }, { is_delete: 0 }).then(value => {
        let json;
        if (!value) {
            json = {
                code: -200,
                message: '没有找到该文章'
            };
        } else {
            json = {
                code: 200,
                data: value
            };
        }
        res.json(json);
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};