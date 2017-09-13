const elasticClient = require('../utils/elasticClient.js');

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
    let keyword = qString;
    elasticClient.search({
        index: 'blog',
        type: 'article',
        from: 0,
        body: {
            query: {
                dis_max: {
                    queries: [
                        {
                            match: {
                                title: {
                                    query: keyword,
                                    minimum_should_match: '50%',
                                    boost: 4,
                                }
                            }
                        }, 
                        {
                            match: {
                                content: {
                                    query: keyword,
                                    minimum_should_match: '75%',
                                    boost: 4,
                                }
                            }
                        }, 
                        {
                            match: {
                                tags: {
                                    query: keyword,
                                    minimum_should_match: '100%',
                                    boost: 2,
                                }
                            }
                        }, 
                        {
                            match: {
                                slug: {
                                    query: keyword,
                                    minimum_should_match: '100%',
                                    boost: 1,
                                }
                            }
                        }
                    ],
                    tie_breaker: 0.3
                }
            },
            highlight: {
                pre_tags: ['<b>'],
                post_tags: ['</b>'],
                fields: {
                    title: {},
                    content: {},
                }
            }
        }
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

