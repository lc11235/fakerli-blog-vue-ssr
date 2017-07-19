require('../utils').createSecret();
const secret = require('./secret.js');

// MD5 加密前缀, 如用户的密码是 123456, 存到数据库将会变成 md5('weimengjiao' + '123456')
exports.md5Pre = "weimengjiao";
exports.secretServer = secret.secretServer;
exports.secretClient = secret.secretServer;