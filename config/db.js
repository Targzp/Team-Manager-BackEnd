/*
 * @Author: 胡晨明
 * @Date: 2021-08-19 12:30:46
 * @LastEditTime: 2021-08-19 12:36:24
 * @LastEditors: Please set LastEditors
 * @Description: 数据库连接
 * @FilePath: \bloge:\Vue_store\manager-server\config\db.js
 */
const mongoose = require('mongoose')
const config = require('./index')
mongoose.connect(config.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', err => {
    console.log(err)
})

db.on('open', () => {
    console.log("**数据库连接成功**")
})