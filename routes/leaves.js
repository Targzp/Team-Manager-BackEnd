/*
 * @Author: your name
 * @Date: 2021-09-07 15:28:18
 * @LastEditTime: 2021-09-08 23:21:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manager-server\routes\leaves.js
 */
const router = require('koa-router')()
const Leave = require('../models/leaveSchema')
const Dept = require('../models/deptSchema')
const util = require('../utils/util')

router.prefix('/api/leave')

router.get("/list", async (ctx, next) => {
    const {
        applyState,
        type
    } = ctx.request.query
    const {
        page,
        skipIndex
    } = util.pager(ctx.request.query)
    let auth = ctx.request.headers.authorization
    let {
        data
    } = util.decoded(auth)
    try {
        let params = {}
        if (type === "approve") {
            if (applyState == 1) {
                params.curAuditUserName = data.userName
                params.applyState = applyState
            } else if (applyState > 1) {
                params = {
                    "auditFlows.userId": data.userId,
                    applyState
                }
            } else {
                params = {
                    "auditFlows.userId": data.userId
                }
            }
        } else {
            params = {
                "applyUser.userId": data.userId
            }
            if (applyState) {
                params.applyState = applyState
            }
        }
        const query = Leave.find(params)
        const list = await query.skip(skipIndex).limit(page.pageSize)
        const total = await Leave.countDocuments(params)
        ctx.body = util.success({
            page: {
                ...page,
                total
            },
            list
        })
    } catch (error) {
        ctx.body = util.fail(`查询异常 ${error}`)
    }
})

router.post('/operate', async (ctx, next) => {
    const {
        _id,
        action,
        ...params
    } = ctx.request.body
    let auth = ctx.request.headers.authorization
    let {
        data
    } = util.decoded(auth)

    if (action === "create") {
        try {
            // 生成申请单号
            let orderNo = "XJ"
            orderNo += util.formateDate(new Date(), "yyyyMMdd") // 实现 XJ2020525 形式字符串
            const total = await Leave.countDocuments() // 获取当前全部审批单的数量，实现累加
            params.orderNo = orderNo + total

            // 获取用户当前部门ID
            let id = data.deptId.pop()

            // 获取用户部门负责人信息
            let dept = await Dept.findById(id)

            // 获取上级人事部门和财务部门负责人信息
            let deptList = await Dept.find({
                deptName: {
                    $in: ['人事部门', '财务部门']
                }
            })

            // 生成审批人信息、审批流
            let auditUsers = dept.userName
            let auditFlows = [{
                userId: dept.userId,
                userName: dept.userName,
                userEmail: dept.userEmail
            }, ]
            deptList.map(item => {
                auditFlows.push({
                    userId: item.userId,
                    userName: item.userName,
                    userEmail: item.userEmail
                })
                auditUsers += "," + item.userName
            })

            // 生成创建条件
            params.auditUsers = auditUsers
            params.curAuditUserName = dept.userName // 设置当前审批人信息
            params.auditFlows = auditFlows
            params.auditUsers = auditUsers
            params.applyUser = {
                userId: data.userId,
                userName: data.userName,
                userEmail: data.userEmail
            }
            params.auditLogs = [] // 设置审批日志，依据审批流记录审批状态

            await Leave.create(params)
            ctx.body = util.success({})
        } catch (error) {
            console.log(error)
            ctx.body = util.fail(error)
        }
    } else if (action === "delete") {
        try {
            await Leave.findByIdAndUpdate(_id, {
                applyState: 5
            })
            ctx.body = util.success({})
        } catch (error) {
            console.log(error)
            ctx.body = util.fail(error)
        }
    }
})

router.post('/approve', async (ctx, next) => {
    const {
        _id,
        action,
        remark
    } = ctx.request.body

    let auth = ctx.request.headers.authorization
    let {
        data
    } = util.decoded(auth)
    try {
        let apply = await Leave.findById(_id)
        let auditLogs = apply.auditLogs || []
        let auditUsers = apply.auditUsers.split(',')
        let params = {}

        if (action === "refuse") {
            // 审批拒绝
            params.applyState = 3
        } else {
            // 审核通过
            let logCounts = auditLogs.length
            if (logCounts === 0) {
                params.applyState = 2
                params.curAuditUserName = auditUsers[1]
            } else if (logCounts === 1) {
                params.curAuditUserName = auditUsers[2]
            } else if (logCounts === 2) {
                params.applyState = 4
            }
        }

        auditLogs.push({
            userId: data.userId,
            userName: data.userName,
            createTime: util.formateDate(new Date()),
            remark,
            action: action === "refuse" ? "审核拒绝" : "审核通过"
        })

        params.auditLogs = auditLogs
        let res = await Leave.findByIdAndUpdate(_id, params)

        ctx.body = util.success({})
    } catch (error) {
        ctx.body = util.fail(`操作失败:${error}`)
    }
})

module.exports = router