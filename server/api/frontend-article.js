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
    let by = req.query.by,
        category = req.query.category,
        limit = req.query.limit,
        page = req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let data = {
        is_delete: 0
    },
        skip = (page - 1) * limit;
    if (category) {
        data.category = category;
    }
    let sort = '-update_date';
    if (by) {
        sort = '-' + by;
    }

    let filds = 'title content category category_name visit like comment_count create_date update_date is_delete timestamp';

    Promise.all([
        Article.find(data, filds).sort(sort).skip(skip).limit(limit).exec(),
        Article.count(data)
    ]).then(([data, total]) => {
        let totalPage = Math.ceil(total / limit),
            data = data.map(item => {
                item.content = item.content.substring(0, 150);
                return item;
            });
        let json = {
            code: 200,
            data: {
                list: data,
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
    Promise.all([
        Article.findOne({ title: title }, { is_delete: 0 }),
        Article.update({ title: title }, { '$inc': { 'visit': 1 } })
    ]).then(value => {
        let json;
        if (!value[0]) {
            json = {
                code: -200,
                message: '没有找到该文章'
            };
        } else {
            json = {
                code: 200,
                data: value[0]
            }
        }
        res.json(json);
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};