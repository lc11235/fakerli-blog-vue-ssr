const elasticClient = require('./elasticsearch.js');

exports.addArticleIndex = (articleJSON) => {
    // let tempArticleJSON = JSON.stringify(articleJSON);
    console.log(articleJSON.content);
    elasticClient.index({
        index: 'blog',
        type: 'article',
        id: articleJSON._id,
        body: {
            title: articleJSON.title,
            slug: '',
            tags: articleJSON.tags,
            content: articleJSON.content,
            update_date: articleJSON.update_date,
        }
    }).then(value => {
        console.log(value);
    }).catch(err => {
        return err.toString();
    });
};