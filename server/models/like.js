const mongoose = require('../mongoose');
const Schema = mongosse.Schema;
const Promise = require('bluebird');

const LikeSchema = new Schema({
    article_id: String,
    user_id: String,
    create_date: String,
    timestamp: Number
});

const Like = mongoose.model('Like', LikeSchema);
Promise.promisifyAll(Like);
Promise.promisifyAll(Like.prototype);

module.exports = Like;