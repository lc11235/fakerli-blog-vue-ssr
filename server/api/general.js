/**
 * 通用列表
 * @method list
 * @param  {[type]} req     [description]
 * @param  {[type]} res     [description]
 * @param  {[type]} mongoDB [description]
 * @param  {[type]} sort    排序
 * @return {[type]}         [description]
 */
exports.list = (req, res, mongoDB, sort) => {
    let sortlist = sort || '-_id';
    let limit = req.body.limit || req.query.limit;
    let page = req.body.page || req.query.page;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!page) page = 1;
    if (!limit) limit = 10;
    let skip = (page - 1) * limit;
    Promise.all([
        mongoDB.find().sort(sortlist).skip(skip).limit(limit).exec(),
        mongoDB.countDocuments()
    ]).then(result => {
        let total = result[1];
        // let totalPage = Math.ceil(total / limit);
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

