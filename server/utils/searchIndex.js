const elasticClient = require('./elasticClient.js');
const elastic = require('./elasticsearch.js');

exports.addArticleIndex = (articleJSON) => {
    elastic.init();
    elasticClient.index({
        index: 'blog',
        type: 'article',
        id: articleJSON._id.toString(),
        body: {
            title: articleJSON.title,
            slug: 'this',
            tags: articleJSON.tags,
            content: articleJSON.html,
            update_date: articleJSON.update_date,
        }
    }).then(value => {
        console.log(value);
    }, reason => {
        console.log(reason);
    }).catch(err => {
        console.log(err.toString());
    });
};