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

// 退出登录
export const logout = (data) =>
  http.post({
    url: `/ygt-user/user/logout`,
    data,
  })
