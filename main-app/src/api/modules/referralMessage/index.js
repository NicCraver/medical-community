import http from '../../index'

// 登录
export const userLogin = (data) =>
  http.post({
    url: `/ygt-user/user/login`,
    data,
  })
// 获取菜单权限
export const getLoginMenus = (params) =>
  http.get({
    url: `/ygt-user/role/getLoginMenus`,
    params,
  })

// 查询转诊消息列表
export const onQueryReferralMessage = (params) =>
  http.get({
    url: `/ygt-referral/tbRMessage/onQueryReferralMessage`,
    params,
  })

// 登录时获取消息
export const getLoginReferralMessage = (params) =>
  http.get({
    url: '/ygt-referral/tbRMessage/getLoginReferralMessage',
    params,
  })

// 处理信息
// POST
// {
// 	ids：[]消息id
// }
export const onReadReferralMessage = (data) =>
  http.post({
    url: '/ygt-referral/tbRMessage/onReadReferralMessage',
    data,
  })

// 获取推广登录消息
export const onQueryPromoteForPage = (data) =>
  http.post({
    url: '/ygt-marketing/tbMessage/onQueryPromoteForPage',
    data,
  })
