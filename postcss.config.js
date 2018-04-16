const autoprefixer = require('autoprefixer');
const browserslist = require('browserslist');

module.exports = {
    plugins: [autoprefixer({browsers: browserslist('last 2 version, > 0.1%')})]
};