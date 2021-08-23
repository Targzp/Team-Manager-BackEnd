/*
 * @Author: 胡晨明
 * @Date: 2021-08-17 20:14:29
 * @LastEditTime: 2021-08-23 23:05:00
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理模块
 * @FilePath: \bloge:\Vue_store\manager-server\routes\users.js
 */
const router = require('koa-router')()
const Users = require('../models/userSchema')
const util = require('../utils/util')
const jwt = require('jsonwebtoken')

router.prefix('/api/users')

router.post('/login', async (ctx, next) => {
  try {
    const {
      userName,
      userPwd
    } = ctx.request.body
    /**
     * @description: 返回数据库指定的字段，有三种方式
     * 1.’userId userName userEmail state role deptId rolelIst'
     * 2.{userId: 1, _id: 0}
     * 3.select(userId)
     */
    const res = await Users.findOne({
      userName,
      userPwd
    }, 'userId userName userEmail state role deptId rolelIst')
    if (res) {
      const doc = res._doc
      const token = jwt.sign({
        data: doc
      }, 'Targzp#32', {
        expiresIn: '1h'
      })
      doc.token = token
      ctx.body = util.success(doc)
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})

// 用户列表
router.get('/list', async (ctx, next) => {
  const {
    userId,
    userName,
    state
  } = ctx.request.query // 如果没有给，默认查询所有
  const {
    page,
    skipIndex
  } = util.pager(ctx.request.query)

  let params = {}
  if (userId) {
    params.userId = userId
  }
  if (userName) {
    params.userName = userName
  }
  if (state && state !== '0') {
    params.state = state
  }

  try {
    // 根据条件查询所有用户列表
    const query = Users.find(params, {
      _id: 0,
      userPwd: 0
    })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Users.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail('查询异常 ${error}')
  }
})

module.exports = router