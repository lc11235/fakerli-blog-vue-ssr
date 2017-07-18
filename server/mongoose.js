var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fakerliblog');
mongoose.Promise = global.Promise;
module.exports = mongoose;