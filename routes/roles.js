/*
 * @Author: 胡晨明
 * @Date: 2021-08-29 15:18:36
 * @LastEditTime: 2021-08-29 21:04:09
 * @LastEditors: Please set LastEditors
 * @Description: 角色管理模块
 * @FilePath: \manager-server\routes\roles.js
 */
const router = require('koa-router')()
const Role = require('../models/roleSchema')
const util = require('../utils/util')

router.prefix('/api/roles')

/**
 * @description: 查找角色列表
 */
router.get('/alllist', async (ctx, next) => {
    try {
        const list = await Role.find({}, "_id roleName")
        ctx.body = util.success(list)
    } catch (error) {
        ctx.body = util.fail(`查询失败: ${error}`)
    }

})

/**
 * @description: 按页获取角色列表
 */
router.get('/list', async (ctx, next) => {
    const {
        roleName
    } = ctx.request.query
    const {
        page,
        skipIndex
    } = util.pager(ctx.request.query)
    let params = {}
    if (roleName) {
        params.roleName = roleName
    }
    try {
        const query = Role.find(params)
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await Role.countDocuments(params)
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


/**
 * @description: 角色编辑、删除、新增功能
 */
router.post('/operate', async (ctx, next) => {
    const {
        _id,
        action,
        ...params
    } = ctx.request.body
    let res, info
    try {
        if (action === 'create') {
            res = await Role.create(params)
            info = "创建成功"
        } else if (action === 'edit') {
            res = await Role.findByIdAndUpdate({
                _id
            }, params, {
                new: true
            })
            info = '编辑成功'
        } else {
            res = await Role.findByIdAndRemove({
                _id
            })
            info = "删除成功"
        }
        ctx.body = util.success(res, info)
    } catch (error) {
        ctx.body = util.fail(`操作失败${error}`)
    }
})

/**
 * @description: 角色权限设置
 */
router.post('/update/permission', async (ctx, body) => {
    const {
        _id,
        permissionList
    } = ctx.request.body
    try {
        await Role.findByIdAndUpdate({
            _id
        }, {
            permissionList
        })
        ctx.body = util.success({}, '角色权限更新成功')
    } catch (error) {
        ctx.body = util.fail(`权限设置失败${error}`)
    }
})


module.exports = router