/*
 * @Author: 胡晨明
 * @Date: 2021-08-17 20:14:29
 * @LastEditTime: 2021-09-02 22:49:24
 * @LastEditors: Please set LastEditors
 * @Description: 用户管理模块
 * @FilePath: \bloge:\Vue_store\manager-server\routes\users.js
 */
const router = require('koa-router')()
const Users = require('../models/userSchema')
const Menu = require('../models/menuSchema')
const Role = require('../models/roleSchema')
const Counter = require('../models/counterSchema')
const util = require('../utils/util')
const jwt = require('jsonwebtoken')
const {
  genPassword
} = require('../utils/cryp')

router.prefix('/api/users')

router.post('/login', async (ctx, next) => {
  try {
    let {
      userName,
      userPwd
    } = ctx.request.body
    /**
     * @description: 返回数据库指定的字段，有三种方式
     * 1.’userId userName userEmail state role deptId rolelIst'
     * 2.{userId: 1, _id: 0}
     * 3.select(userId)
     */
    userPwd = genPassword(userPwd)
    const res = await Users.findOne({
      userName,
      userPwd
    }, 'userId userName userEmail state role deptId roleList')
    if (!res) {
      ctx.body = util.fail('账号或密码不正确')
    } else if (res.state !== 2) {
      const doc = res._doc
      const token = jwt.sign({
        data: doc
      }, 'Targzp#32', {
        expiresIn: '3d'
      })
      doc.token = token
      ctx.body = util.success(doc)
    } else if (res.state === 2) {
      ctx.body = util.fail('账号不存在')
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    console.log(error)
    ctx.body = util.fail(error.msg)
  }
})

// 获取用户对应的权限菜单
router.get('/getPermissionList', async (ctx, next) => {
  let auth = ctx.request.headers.authorization
  let {
    data
  } = util.decoded(auth)
  let menuList = await getMenuList(data.role, data.roleList)
  let actionList = getActionList(menuList)
  ctx.body = util.success({
    menuList,
    actionList
  })
})

async function getMenuList(userRole, roleKeys) {
  let rootList = []
  let roleList = []
  let permissionList = []
  if (userRole === 0) {
    rootList = await Menu.find({
      menuState: 1
    }) || []
  } else {
    // 根据用户拥有的角色获取权限列表
    // first step：先查找用户对应的角色有哪些
    roleList = await Role.find({
      _id: {
        $in: roleKeys
      }
    })
    // second step: 收集所有角色所拥有的权限（即菜单和按钮）
    roleList.map(role => {
      let {
        checkedKeys,
        halfCheckedKeys
      } = role.permissionList
      permissionList = permissionList.concat([...checkedKeys, ...halfCheckedKeys])
    })
    // third step: 角色之间所拥有的权限大概率会重复，进行去重操作
    permissionList = [...new Set(permissionList)]
    // forth step: 使用 permissionList 对菜单表进行过滤，返回对应的菜单列表
    // fifth step: 使用 getTreeMenu 工具函数对过滤后的菜单进行递归，整理成树形结构再返回给客户端
    rootList = await Menu.find({
      _id: {
        $in: permissionList
      },
      menuState: 1
    })
  }
  return util.getTreeMenu(rootList, null, [])
}

function getActionList(list) {
  let actionList = []
  const deep = (arr) => {
    arr.map((item) => {
      if (item.action) {
        item.action.map(item => {
          actionList.push(item.menuCode) // 注意是按钮标识
        })
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    });
  };
  deep(list);
  return actionList
}

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

// 所有用户列表
router.get('/all/list', async (ctx, next) => {
  try {
    // 根据条件查询所有用户列表
    const list = await Users.find({
      state: 1
    }, "userId userName userEmail")
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail('查询异常 ${error}')
  }
})


// 用户删除和批量删除
router.post('/delete', async (ctx, next) => {
  // 待删除的用户 Id 数组
  const {
    userIds
  } = ctx.request.body
  const res = await Users.updateMany({
    userId: {
      $in: userIds
    }
  }, {
    state: 2 // 软删除
  })
  if (res) {
    ctx.body = util.success(res, `共删除数据${res.nModified}条`)
    return
  }
  ctx.body = util.fail(`删除失败`)
})

// 用户新增/编辑
router.post('/operate', async (ctx, next) => {
  const {
    userId,
    userName,
    userEmail,
    mobile,
    job,
    state,
    roleList,
    deptId,
    action
  } = ctx.request.body
  if (action == 'add') {
    if (!userName || !userEmail || !deptId) {
      ctx.body = util.fail('参数错误', util.CODE.PARAM_ERROR)
      return
    }
    const res = await Users.findOne({
      userEmail
    }, '_id userName userEmail')
    if (res) {
      ctx.body = util.fail('用户已存在')
    } else {
      const doc = await Counter.findOneAndUpdate({
        _id: 'userId'
      }, {
        $inc: {
          sequence_value: 1
        }
      }, {
        new: true
      })
      try {
        const user = new Users({
          userId: doc.sequence_value,
          userName,
          userPwd: genPassword('123456'),
          userEmail,
          role: 1, // 默认普通用户
          roleList,
          job,
          state,
          deptId,
          mobile
        })
        user.save()
        ctx.body = util.success({}, '用户创建成功')
      } catch (error) {
        console.log(error)
        ctx.body = util.fail(error, '用户创建失败')
      }
    }
  } else {
    if (!deptId) {
      ctx.body = util.fail('部门不能为空', util.CODE.PARAM_ERROR)
      return
    }
    const res = await Users.findOneAndUpdate({
      userId
    }, {
      mobile,
      job,
      state,
      roleList,
      deptId
    }, {
      new: true
    })
    if (res) {
      ctx.body = util.success({}, '更新成功')
      return
    }
    ctx.body = util.fail('更新失败')
  }
})
module.exports = router