/*
 * @Author: 胡晨明
 * @Date: 2021-08-26 16:24:51
 * @LastEditTime: 2021-09-01 16:00:36
 * @LastEditors: Please set LastEditors
 * @Description: 菜单管理模块
 * @FilePath: \manager-server\routes\menus.js
 */
const router = require('koa-router')()
const Menu = require('../models/menuSchema')
const util = require('../utils/util')

router.prefix('/api/menu')

/**
 * @description: 菜单列表查询
 */
router.get('/list', async (ctx, next) => {
    const {
        menuName,
        menuState
    } = ctx.request.query
    const params = {}
    let rootList = []
    let permissionList = []
    // 首先 menuState 是一定有值的
    if (menuName && menuState) { // 给了菜单名进行查询
        params.menuName = menuName
        params.menuState = menuState
        permissionList = await Menu.find(params)
    } else if (!menuName && menuState == 2) { // 没给菜单名，且搜索的是停用的菜单
        params.menuState = menuState
        permissionList = await Menu.find(params)
    } else { // 没给菜单名，默认搜索全部正常的菜单
        params.menuState = menuState
        rootList = await Menu.find(params) || [] // 先获取全部的菜单列表
        if (rootList.length > 0 && menuState == 1 && rootList[0].menuState === 1) {
            permissionList = util.getTreeMenu(rootList, null, []) // 提取第一级菜单
        }
    }
    ctx.body = util.success(permissionList)
})

/**
 * @description: 菜单编辑、删除、新增功能
 */
router.post('/operate', async (ctx, next) => {
    const {
        _id,
        action,
        ...params
    } = ctx.request.body
    let res, info
    try {
        if (action === 'add') {
            res = await Menu.create(params)
            info = '创建成功'
        } else if (action === 'edit') {
            params.updateTime = new Date()
            res = await Menu.findByIdAndUpdate({
                _id
            }, params, {
                new: true
            })
            info = '编辑成功'
        } else {
            res = await Menu.findByIdAndRemove({
                _id
            })
            await Menu.deleteMany({
                parentId: {
                    $all: [_id]
                }
            })
            info = '删除成功'
        }
        ctx.body = util.success(res, info)
    } catch (error) {
        ctx.body = util.fail(error)
    }
})

module.exports = router