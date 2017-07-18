const mongoose = require('../mongoose');
const Schema = mongosse.Schema;
const Promise = require('bluebird');

const AdminSchema = new Schema({
    username: String,
    email: String,
    password: String,
    create_date: String,
    update_date: String,
    is_delete: Number,
    timestamp: Number
});

const Admin = mongoose.model('Admin', AdminSchema);
Promise.promisifyAll(Admin);
Promise.promisifyAll(Admin.prototype);

module.exports = Admin;