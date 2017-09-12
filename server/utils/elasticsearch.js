const elastic = require('elasticsearch');

const client = new elastic.Client({
    host: '127.0.0.1:9200',
    log: 'trace'
});

client.indices.exists({
    index: 'blog'
}).then(value => {
    console.log(value + 'test11');
}, reason => {
    client.indices.create({ index: 'blog' });
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

module.exports = client;
