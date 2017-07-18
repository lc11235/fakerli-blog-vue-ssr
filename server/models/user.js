const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    create_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number
});

const User = mongoose.model('User', UserSchema);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;