/*
 * @Author: 胡晨明
 * @Date: 2021-08-17 20:14:29
 * @LastEditTime: 2021-08-19 14:38:47
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理模块
 * @FilePath: \bloge:\Vue_store\manager-server\routes\users.js
 */
const router = require('koa-router')()
const Users = require('../models/userSchema')
const util = require('../utils/util')

router.prefix('/api/users')

router.post('/login', async (ctx, next) => {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await Users.findOne({ userName, userPwd })
    if (res) {
      ctx.body = util.success(res)
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})

module.exports = router
