const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const TagSchema = new Schema({
    tag_name: String,
    tag_num: Number,
    tag_desc: String,
    tag_classify: String,
    create_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number
});

const Tag = mongoose.model('Tag', TagSchema);
Promise.promisifyAll(Tag);
Promise.promisifyAll(Tag.prototype);

module.exports = Tag;