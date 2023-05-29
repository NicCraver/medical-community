import http from '../index.js'
// 中部消息提示
export const followUpAlerts = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/followUpAlerts`,
    params,
  })

// 右上角消息提示
export const followUpAlertsList = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/followUpAlertsList`,
    params,
  })


// 查询用户登录记录
// /ygt-user/tbUserLoginLog/onQueryUserLoginLog
// POST
// 入参
// loginname: 登录名
// name: 姓名
// pageNum: 页码
// pageSize: 每页条数

// 回参
// seq: 序号
// loginname: 登录名
// name: 姓名
// loginIp: 登录ip
// loginTime: 登录时间
// logoutTime: 登出时间
// loginHours: 登录时长

export const onQueryUserLoginLog = (data) =>
  http.post({
    url: `/ygt-user/tbUserLoginLog/onQueryUserLoginLog`,
    data,
  })



