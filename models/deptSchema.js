/*
 * @Author: your name
 * @Date: 2021-08-31 15:15:24
 * @LastEditTime: 2021-08-31 15:21:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manager-server\models\deptSchema.js
 */
const mongoose = require('mongoose')

const DeptSchema = mongoose.Schema({
    "deptName": String,
    "userId": String,
    "userName": String,
    "userEmail": String,
    "parentId": [mongoose.Types.ObjectId],
    "createTime": {
        type: Date,
        default: Date.now()
    }, //创建时间
    "updateTime": {
        type: Date,
        default: Date.now()
    }, //更新时间
})

module.exports = mongoose.model('dept', DeptSchema)