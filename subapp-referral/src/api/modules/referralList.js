//标准管理接口
import http from '../index'
// 获取转诊列表
export const getReferralListInfo = (data) =>
  http.post({
    url: '/ygt-referral/tbRApplyRecord/getReferralListInfo',
    data,
  })

// 转诊撤回或者批量撤回
export const batchGoBackReferralInfo = (data) =>
  http.post({
    url: '/ygt-referral/tbRApplyRecord/batchGoBackReferralInfo',
    data,
  })

// 转诊关闭或者批量关闭
export const batchAbortRefInfo = (data) =>
  http.post({
    url: '/ygt-referral/tbRApplyRecord/batchAbortRefInfo',
    data,
  })

// 批量关闭恢复
export const batchRecoverRefInfo = (data) =>
  http.post({
    url: '/ygt-referral/tbRApplyRecord/batchRecoverRefInfo',
    data,
  })


// 转诊列表查询条件下拉框
export const getReferralListDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRApplyRecord/getDataDownBox',
    params,
  })
