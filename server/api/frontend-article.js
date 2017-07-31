const mongoose = require('../mongoose');
const Article = mongoose.model('Article');
const Like = mongoose.model('Like');

/**
 * 前台浏览时, 获取文章列表
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getList = (req, res) => {
    let by = req.query.by,
        id = req.query.id,
        key = req.query.key,
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
    if (id) {
        data.category = id;
    }
    if (key) {
        let reg = new RegExp(key, 'i');
        data.title = { $regex: reg };
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
        let arr = [],
            totalPage = Math.ceil(total / limit),
            user_id = req.cookies.userid;
        data = data.map(item => {
            item.content = item.content.substring(0, 500) + '...';
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
        if (user_id) {
            data.forEach(item => {
                arr.push(Like.findOne({ article_id: item._id, user_id }));
            });
            Promise.all(arr).then(collection => {
                data = data.map((item, index) => {
                    item._doc.like_status = !!collection[index];
                    return item;
                });
                json.data.list = data;
                res.json(json);
            }).catch(err => {
                res.json({
                    code: -200,
                    message: err.toString()
                });
            })
        } else {
            data = data.map(item => {
                item._doc.like_status = false;
                return item;
            });
            json.data.list = data;
            res.json(json);
        }
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
    let _id = req.query.id,
        user_id = req.cookies.userid;
    if (!_id) {
        res.json({
            code: -200,
            message: '参数错误'
        });
    }
    Promise.all([
        Article.findOne({ _id, is_delete: 0 }),
        Like.findOne({ article_id: _id, user_id }),
        Article.update({ _id }, { '$inc': { 'visit': 1 } })
    ]).then(value => {
        let json;
        if(!value[0]) {
            json = {
                code: -200,
                message: '没有找到该文章'
            };
        } else {
            if(user_id) {
                value[0]._doc,like_status = !! value[1];
            } else {
                value[0]._doc.like_status = false;
            }
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

exports.getTrending = (req, res) => {
    let limit = 5,
        data = {is_delete: 0},
        filds = 'title visit like comment_count';
    Article.find(data, filds).sort('-visit').limit(limit).exec().then(result => {
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