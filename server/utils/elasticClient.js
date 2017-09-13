const elastic = require('elasticsearch');

const client = new elastic.Client({
    host: '127.0.0.1:9200',
    log: 'trace'
});

module.exports = client;