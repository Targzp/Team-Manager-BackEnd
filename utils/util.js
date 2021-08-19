/*
 * @Author: 胡晨明
 * @Date: 2021-08-18 15:05:31
 * @LastEditTime: 2021-08-19 14:24:11
 * @LastEditors: Please set LastEditors
 * @Description: 通用工具函数
 * @FilePath: \bloge:\Vue_store\manager-server\utils\util.js
 */
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
  pager ({pageNum=1,pageSize=10}) {
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
  success (data='',msg='',code=CODE.SUCCESS) {
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
  fail (msg='',code=CODE.BUSINESS_ERROR, data='') {
    return {
      code,
      data,
      msg
    }
  }
}