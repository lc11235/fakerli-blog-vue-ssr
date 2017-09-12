const elasticClient = require('./elasticsearch.js');

exports.addArticleIndex = (articleJSON) => {
    let tempArticleJSON = JSON.stringify(articleJSON);
    elasticClient.index({
        index: 'blog',
        type: 'article',
        id: tempArticleJSON._id,
        body: {
            title: tempArticleJSON.title,
            slug: '',
            tags: tempArticleJSON.tags,
            content: tempArticleJSON.content,
            update_date: tempArticleJSON.update_date,
        }
    }).then(value => {
        console.log(value);
    }).catch(err => {
        return err.toString();
    });
};