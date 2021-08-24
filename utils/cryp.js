/*
 * @Author: 胡晨明
 * @Date: 2021-08-24 21:06:11
 * @LastEditTime: 2021-08-24 21:13:37
 * @LastEditors: Please set LastEditors
 * @Description: 加密工具函数
 * @FilePath: \manager-server\utils\cryp.js
 */
const crypto = require('crypto');

// 密钥
const SECRET_KEY = 'HMCCMH_**_&^_7##'

// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex');
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`;
    return md5(str);
}


module.exports = {
    genPassword
}