/*
 * @Author: 胡晨明
 * @Date: 2021-08-19 12:26:35
 * @LastEditTime: 2021-09-10 22:15:12
 * @LastEditors: Please set LastEditors
 * @Description: 配置文件
 * @FilePath: \bloge:\Vue_store\manager-server\config\index.js
 */
module.exports = {
    URL: 'mongodb://127.0.0.1:27017/manager',
    SERVER_PORT: process.env.NODE_ENV === 'dev' ? '3000' : '80'
}