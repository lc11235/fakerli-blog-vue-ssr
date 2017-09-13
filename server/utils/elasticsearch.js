const client = require('./elasticClient.js');

exports.init = () => client.indices.exists({
    index: 'blog'
}).then(value => {
    console.log(value);
}, reason => {
    client.indices.create({ index: 'blog' });
    client.indices.analyze({
        tokenizer: 'ik_max_word',
        filter: ['lowercase'],
        charFilter: ['html_strip'],
        index: 'blog',
    });
    client.indices.putMapping({
        index: 'blog',
        type: 'article',
        body: {
            article: {
                properties: {
                    title: {
                        type: 'text',
                        term_vector: 'with_positions_offsets',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                    },
                    content: {
                        type: 'text',
                        term_vector: 'with_positions_offsets',
                        analyzer: 'ik_max_word',
                        search_analyzer: 'ik_max_word',
                    },
                    slug: {
                        type: 'text',
                    },
                    tags: {
                        type: 'text',
                        index: 'not_analyzed',
                    },
                    update_date: {
                        type: 'text',
                        index: 'not_analyzed',
                    }
                }
            }
        }
    });
}).catch(err => {
    console.log(err);
});
