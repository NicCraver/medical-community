import http from '../../index'

// 转诊列表查询条件下拉框
export const getReferralListDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRApplyRecord/getDataDownBox',
    params,
  })

// 审核列表下拉框
export const getReviewDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRAudit/getDataDownBox',
    params,
  })

// 接诊列表下拉框
export const getAdmissionsDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRAdmissions/getDataDownBox',
    params,
  })

export const getPublicDataDownBox = (params) =>
  http.get({
    url: '/ygt-user/org/getPublicOrgAndHosOptions',
    params,
  })
