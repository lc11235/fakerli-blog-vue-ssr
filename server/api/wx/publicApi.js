const crypto = require('crypto');


/**
 * 验证微信与服务器的连接
 * @method
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.checkServer = (req, res) =>{
    const signature = req.query.signature;
    const timestamp = req.query.timestamp;
    const nonce = req.query.nonce;
    const echostr = req.query.echostr;
    const token = 'weimengjiao11235';
    let paramArray = [timestamp, nonce, token].sort().join('');
    const sha1 = crypto.createHash('sha1');
    sha1.update(paramArray);
    const str = sha1.digest('hex');
    if (str === signature) {
        res.send(echostr);
    } else {
        res.send('test wxServer failure');
    }
};