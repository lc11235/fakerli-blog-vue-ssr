const mongoose = require('../mongoose.js');
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const MessageSchema = new Schema({
    title: String,
    content: String,
    create_date: String,
    update_date: String,
    is_readed: Number,
    is_delete: Number,
    id: String,
    timestamp: Number
});

const Message = mongoose.model('Message', MessageSchema);
Promise.promisifyAll(Message);
Promise.promisifyAll(Message.prototype);

module.exports = Message;