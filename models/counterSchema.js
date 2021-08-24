/*
 * @Author: your name
 * @Date: 2021-08-24 16:56:51
 * @LastEditTime: 2021-08-24 17:45:41
 * @LastEditors: Please set LastEditors
 * @Description: 维护用户ID自增长表
 * @FilePath: \manager-server\models\counterSchema.js
 */
const mongoose = require('mongoose')

const CounterSchema = mongoose.Schema({
    _id: String,
    sequence_value: Number
})

module.exports = mongoose.model('counters', CounterSchema, 'counters')