const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const LogErrorSchema = new Schema({
    errorStack: String,
    create_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number
});

const LogError = mongoose.model('LogError', LogErrorSchema);
Promise.promisifyAll(LogError);
Promise.promisifyAll(LogError.prototype);

module.exports = LogError;