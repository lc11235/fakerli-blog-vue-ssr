const elasticClient = require('../utils/elasticsearch.js');

/**
 * 前台浏览时，搜索文章
 * @method
 * @param  {[object]} req [请求体]
 * @param  {[object]} res [回复体]
 * @return {[json]}       [回复json]
 */
exports.search = (req, res) => {
    let qString = req.query.search;
    if (!qString) {
        return res.json({
            code: -200,
            message: '查询条件为空！'
        });
    }
    elasticClient.search({
        index: 'blog',
        type: 'article',
        q: qString,
    }).then(value => {
        return res.json({
            code: 200,
            data: value,
        });
    }).catch(err => {
        res.json({
            code: -200,
            message: err.toString()
        });
    });
};

