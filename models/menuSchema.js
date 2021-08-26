/*
 * @Author: 胡晨明
 * @Date: 2021-08-26 16:01:18
 * @LastEditTime: 2021-08-26 21:24:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manager-server\models\menuSchema.js
 */
const mongoose = require('mongoose')

const MenuSchema = mongoose.Schema({
    "menuType": Number, // 菜单类型
    "menuName": String, // 菜单名称
    "menuCode": String, // 权限标识
    "path": String, // 路由地址
    "component": String, // 组件地址
    "menuState": Number, // 菜单状态
    "icon": String, // 图标
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

module.exports = mongoose.model('menu', MenuSchema)