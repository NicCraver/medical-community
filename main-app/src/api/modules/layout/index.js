import http from "../../index";

// 中部消息提示
export const followUpAlerts = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/followUpAlerts`,
    params,
  });

// 右上角消息提示
export const followUpAlertsList = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/followUpAlertsList`,
    params,
  });
  
// 退出登录
export const logout = (data) =>
  http.post({
    url: `/ygt-user/user/logout`,
    data,
  });

// 今日不在提醒
export const forbiddenMsgTip = (params) =>
  http.post({
    url: `/ygt-followup/messageController/forbiddenMsgTip`,
    params,
  });  