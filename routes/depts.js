/*
 * @Author: your name
 * @Date: 2021-08-31 14:51:26
 * @LastEditTime: 2021-08-31 21:26:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manager-server\routes\depts.js
 */
const router = require('koa-router')()
const Dept = require('../models/deptSchema')
const util = require('../utils/util')

router.prefix('/api/dept')

/**
 * @description: 部门列表查询
 */
router.get('/list', async (ctx, next) => {
    const {
        deptName
    } = ctx.request.query
    const params = {}
    let rootList = null
    let permissionList = null
    if (deptName) {
        params.deptName = deptName
        permissionList = await Dept.find(params) || []
    } else {
        rootList = await Dept.find() || []
        permissionList = getTreeDept(rootList, null, [])
    }
    ctx.body = util.success(permissionList)
})

/**
 * @description: 递归拼接树形列表
 */
function getTreeDept(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
        let item = rootList[i]
        if (String(item.parentId.slice().pop()) == String(id)) { // 因为 id 在 moongodb 中是 buffer 类型，所以需要进行字符串的转换
            list.push(item._doc)
        }
    }
    list.map(item => {
        item.children = []
        getTreeDept(rootList, item._id, item.children) // 再进行递归，提取下一级菜单
        if (item.children.length === 0) {
            delete item.children
        }
    })
    return list
}

/**
 * @description: 部门编辑、删除、新增功能
 */
router.post('/operate', async (ctx, next) => {
    const {
        _id,
        action,
        ...params
    } = ctx.request.body
    let info
    try {
        if (action === 'create') {
            await Dept.create(params)
            info = '创建成功'
        } else if (action === 'edit') {
            params.updateTime = new Date()
            await Dept.findByIdAndUpdate({
                _id
            }, params, {
                new: true
            })
            info = '编辑成功'
        } else if (action === 'delete') {
            await Dept.findByIdAndRemove({
                _id
            })
            await Dept.deleteMany({
                parentId: {
                    $all: [_id]
                }
            })
            info = '删除成功'
        }
        ctx.body = util.success({}, info)
    } catch (error) {
        ctx.body = util.fail(error)
    }
})

module.exports = router