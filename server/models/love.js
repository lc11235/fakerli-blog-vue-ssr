const mongoose = require('../mongoose.js');
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const LoveSchema = new Schema({
    index: Number,
    title: String,
    content: String,
    imgPath: String,
    createDate: String,
    updateDate: String,
    timestamp: Number
});

const Love = mongoose.model('Love', LoveSchema);
Promise.promisifyAll(Love);
Promise.promisifyAll(Love.prototype);

module.exports = Love;