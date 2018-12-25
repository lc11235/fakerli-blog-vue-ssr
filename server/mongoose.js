const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:9000/fakerliblog');
mongoose.Promise = global.Promise;
module.exports = mongoose;