const mongoose = require('../mongoose');
const Schema = mongosse.Schema;
const Promise = require('bluebird');

const CommentSchema = new Schema({
    article_id: String,
    userid: String,
    username: String,
    email: String,
    content: String,
    create_date: String,
    is_delete: Number,
    timestamp: Number
});

const Comment = mongoose.model('Comment', CommentSchema);
Promise.promisifyAll(Comment);
Promise.promisifyAll(Comment.prototype);

module.exports = Comment;