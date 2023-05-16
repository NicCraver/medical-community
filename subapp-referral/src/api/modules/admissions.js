import http from '../index.js'


/* 接诊 */
// 获取接诊列表
export const getAdmissionsInfo = (data) =>
  http.post({
    url: '/ygt-referral/tbRAdmissions/getAdmissionsInfo',
    data,
  })

// 接诊提交
export const goAdmissions = (data) =>
  http.post({
    url: '/ygt-referral/tbRAdmissions/goAdmissions',
    data,
  })

// 接诊信息
export const getAdmissionsInfoById = (params) =>
  http.get({
    url: '/ygt-referral/tbRAdmissions/getAdmissionsInfoById',
    params,
  })

// 接诊列表下拉框
export const getAdmissionsDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRAdmissions/getDataDownBox',
    params,
  })
