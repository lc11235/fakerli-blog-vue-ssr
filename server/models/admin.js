const mongoose = require('../mongoose');
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const AdminSchema = new Schema({
    username: String,
    email: String,
    password: String,
    access: String,
    avator: String,
    create_date: String,
    update_date: String,
    is_delete: Number,
    is_confirm: Number,
    is_login: Number,
    user_level: Number,
    timestamp: Number
});

const Admin = mongoose.model('Admin', AdminSchema);
Promise.promisifyAll(Admin);
Promise.promisifyAll(Admin.prototype);

module.exports = Admin;