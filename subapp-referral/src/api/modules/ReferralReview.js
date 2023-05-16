import http from '../index.js'

/* 审核 */
// 获取审核列表
export const getAuditListInfo = (data) =>
  http.post({
    url: '/ygt-referral/tbRAudit/getAuditListInfo',
    data,
  })

// 审核通过/拒绝
export const auditPassOrRefuse = (data) =>
  http.post({
    url: '/ygt-referral/tbRAudit/auditPassOrRefuse',
    data,
  })

// 获取审核信息
export const getAuditInfoById = (params) =>
  http.get({
    url: '/ygt-referral/tbRAudit/getAuditInfoById',
    params,
  })

// 审核列表下拉框
export const getReviewDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRAudit/getDataDownBox',
    params,
  })

// 待接诊 
export const getRAdmissionsDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRAdmissions/getDataDownBox',
    params,
  })
