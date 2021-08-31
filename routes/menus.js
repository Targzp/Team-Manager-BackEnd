/*
 * @Author: 胡晨明
 * @Date: 2021-08-26 16:24:51
 * @LastEditTime: 2021-08-31 22:15:19
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
            permissionList = getTreeMenu(rootList, null, []) // 提取第一级菜单
        }
    }
    ctx.body = util.success(permissionList)
})

/**
 * @description: 递归拼接树形列表
 */
function getTreeMenu(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
        let item = rootList[i]
        if (String(item.parentId.slice().pop()) == String(id)) { // 因为 id 在 moongodb 中是 buffer 类型，所以需要进行字符串的转换
            list.push(item._doc)
        }
    }
    list.map(item => {
        item.children = []
        getTreeMenu(rootList, item._id, item.children) // 再进行递归，提取下一级菜单
        if (item.children.length === 0) {
            delete item.children
        } else if (item.children[0].menuType == 2) {
            // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
            item.action = item.children
        }
    })
    return list
}

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