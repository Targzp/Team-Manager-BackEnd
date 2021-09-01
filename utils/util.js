/*
 * @Author: 胡晨明
 * @Date: 2021-08-18 15:05:31
 * @LastEditTime: 2021-09-01 16:51:04
 * @LastEditors: Please set LastEditors
 * @Description: 通用工具函数
 * @FilePath: \bloge:\Vue_store\manager-server\utils\util.js
 */
const jwt = require('jsonwebtoken')
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001, // 参数错误
  USER_ACCOUNT_ERROR: 20001, // 账号或密码错误
  USER_LOGIN_ERROR: 30001, // 用户未登录
  BUSINESS_ERROR: 40001, // 业务请求失败
  AUTH_ERROR: 50001, // 认证失败或TOKEN过期
}

module.exports = {
  /**
   * @description: 分页结构封装
   * @param {number} pageNum
   * @param {number} pageSize
   */
  pager({
    pageNum = 1,
    pageSize = 10
  }) {
    pageNum *= 1
    pageSize *= 1
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: {
        pageNum,
        pageSize
      },
      skipIndex
    }
  },
  /**
   * @description: 成功结构体封装
   * @param {*} data
   * @param {string} msg
   * @param {number} code
   */
  success(data = '', msg = '', code = CODE.SUCCESS) {
    return {
      code,
      data,
      msg
    }
  },
  /**
   * @description: 失败结构体封装
   * @param {string} msg
   * @param {number} code
   */
  fail(msg = '', code = CODE.BUSINESS_ERROR, data = '') {
    return {
      code,
      data,
      msg
    }
  },
  /**
   * @description: 解密 token 数据
   * @param {String} auth
   */
  decoded(auth) {
    if (auth) {
      let token = auth.split(' ')[1]
      return jwt.verify(token, 'Targzp#32')
    }
    return ''
  },
  /**
   * @description: 递归拼接树形列表
   */
  getTreeMenu(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i]
      if (String(item.parentId.slice().pop()) == String(id)) { // 因为 id 在 moongodb 中是 buffer 类型，所以需要进行字符串的转换
        list.push(item._doc)
      }
    }
    list.map(item => {
      item.children = []
      this.getTreeMenu(rootList, item._id, item.children) // 再进行递归，提取下一级菜单
      if (item.children.length === 0) {
        delete item.children
      } else if (item.children[0].menuType == 2) {
        // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
        item.action = item.children
      }
    })
    return list
  },
  CODE
}