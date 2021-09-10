/*
 * @Author: your name
 * @Date: 2021-09-07 15:28:18
 * @LastEditTime: 2021-09-09 22:21:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manager-server\routes\leaves.js
 */
const router = require('koa-router')()
const Leave = require('../models/leaveSchema')
const Dept = require('../models/deptSchema')
const util = require('../utils/util')

router.prefix('/api/leave')

/**
 * @description: 获取用户需审批数目
 */
router.get('/count', async (ctx, next) => {
    let auth = ctx.request.headers.authorization
    let {
        data
    } = util.decoded(auth)
    try {
        let params = {}
        params.curAuditUserName = data.userName
        params.$or = [{
            applyState: 1
        }, {
            applyState: 2
        }]
        let total = await Leave.countDocuments(params)
        ctx.body = util.success(total)
    } catch (error) {
        ctx.body = util.fail(`操作失败: ${error}`)
    }
})


/**
 * @description: 获取申请/审批列表
 */
router.get("/list", async (ctx, next) => {
    // 获取想取得相应状态的申请单，type 说明是否是审批阶段
    const {
        applyState,
        type
    } = ctx.request.query
    // 分页相关逻辑
    const {
        page,
        skipIndex
    } = util.pager(ctx.request.query)
    // 获取当前请求用户的信息，通过 token 进行解密获取
    let auth = ctx.request.headers.authorization
    let {
        data
    } = util.decoded(auth)
    try {
        // 初始化作为查询条件的 params 对象
        let params = {}
        // 如果当前是审批阶段（相应负责人进行申请的审批）
        if (type === "approve") {
            // 生成待审批的查询条件
            if (applyState == 1 || applyState == 2) {
                params.curAuditUserName = data.userName // 审核人必须是当前请求用户
                params.$or = [{ // 依据审批流，一级审批人 applyState 为 待审核，二三级审批人为审批中，但是对于二三级审批人而言其实同样是得到待审批申请单
                    applyState: 1
                }, {
                    applyState: 2
                }]
                // 生成审批通过/拒绝/作废的查询条件
            } else if (applyState > 2) {
                params = {
                    "auditFlows.userId": data.userId, // 审批流中必需包含当前请求用户
                    applyState
                }
                // 生成全部申请单的查询条件
            } else {
                params = {
                    "auditFlows.userId": data.userId // 审批流中必需包含当前请求用户
                }
            }
            // 如果当前不是审批阶段，则判断为得到相应用户的相应状态申请列表
        } else {
            params = {
                "applyUser.userId": data.userId // 申请列表各申请单必须是当前用户申请的
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

/**
 * @description: 申请表的操作
 */
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

/**
 * @description: 申请审批操作以及审批流的实现
 */
router.post('/approve', async (ctx, next) => {
    // 获取已审批的申请单 id ，审批结果，备注
    const {
        _id,
        action,
        remark
    } = ctx.request.body

    // 获取当前请求用户信息，通过 token 进行解密获取
    let auth = ctx.request.headers.authorization
    let {
        data
    } = util.decoded(auth)
    try {
        // 通过 id 获取到当前审批的申请单，及其审批日志和审批流所有审批人
        let apply = await Leave.findById(_id)
        let auditLogs = apply.auditLogs || []
        let auditUsers = apply.auditUsers.split(',')
        let params = {}

        if (action === "refuse") {
            // 审批拒绝
            params.applyState = 3
        } else {
            // 审核通过
            // 获取当前审批日志的长度
            let logCounts = auditLogs.length
            // 如果日志长度为 0，说明申请为待审批状态，通过后为审批中状态
            if (logCounts === 0) {
                params.applyState = 2
                params.curAuditUserName = auditUsers[1] // 修改为下一级审批人姓名
                // 如果日志长度为 1，说明申请为审批中状态，通过后因为当前是二级审批人，还有下一级，所以状态不变
            } else if (logCounts === 1) {
                params.curAuditUserName = auditUsers[2]
                // 如果日志长度为 2，说明申请为审批中状态，到此说明已是最后一级审批人，通过后可将审批状态改为审批通过
            } else if (logCounts === 2) {
                params.applyState = 4
            }
        }

        // 申请单中添加当前审核人的审批日志
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