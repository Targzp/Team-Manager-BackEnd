/*
 * @Author: 胡晨明
 * @Date: 2021-08-17 20:14:29
 * @LastEditTime: 2021-09-01 17:12:28
 * @LastEditors: Please set LastEditors
 * @Description: 请求入口文件
 * @FilePath: \bloge:\Vue_store\manager-server\app.js
 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const util = require('./utils/util')
const koa_jwt = require('koa-jwt')

// 加载数据库
require('./config/db')

const users = require('./routes/users')
const menus = require('./routes/menus')
const roles = require('./routes/roles')
const depts = require('./routes/depts')
const leaves = require('./routes/leaves')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next().catch((err) => {
    console.log(err)
    if (err.status == '401') {
      ctx.status = 200
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw err
    }
  })
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(koa_jwt({
  secret: 'Targzp#32'
}).unless({
  path: [/^\/api\/users\/login/]
}))

// routes
app.use(users.routes(), users.allowedMethods())
app.use(menus.routes(), menus.allowedMethods())
app.use(roles.routes(), roles.allowedMethods())
app.use(depts.routes(), depts.allowedMethods())
app.use(leaves.routes(), leaves.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app