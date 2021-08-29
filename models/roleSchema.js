/*
 * @Author: 胡晨明
 * @Date: 2021-08-26 16:01:18
 * @LastEditTime: 2021-08-29 17:26:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manager-server\models\menuSchema.js
 */
const mongoose = require('mongoose')

const RoleSchema = mongoose.Schema({
    "roleName": String,
    "remark": String,
    "permissionList": {
        checkedKeys: [],
        halfCheckedKeys: []
    },
    "createTime": {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('role', RoleSchema)