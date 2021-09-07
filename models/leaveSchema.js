/*
 * @Author: 胡晨明
 * @Date: 2021-08-26 16:01:18
 * @LastEditTime: 2021-09-07 15:26:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manager-server\models\menuSchema.js
 */
const mongoose = require('mongoose')

const LeaveSchema = mongoose.Schema({
    "orderNo": String,
    "applyType": Number,
    "startTime": Date,
    "endTime": Date,
    "applyUser": {
        "userId": String,
        "userName": String,
        "userEmail": String
    },
    "leaveTime": String,
    "reasons": String,
    "auditUsers": String,
    "curAuditUserName": String,
    "auditFlows": [{
        "userId": String,
        "userName": String,
        "userEmail": String
    }],
    "auditLogs": [{
        "userId": String,
        "userName": String,
        "createTime": Date,
        "remark": String,
        "action": String
    }],
    "applyState": {
        type: Number,
        default: 1
    },
    "createTime": {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('leave', LeaveSchema)