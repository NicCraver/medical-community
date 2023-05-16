import http from '../../index'
// 动态下拉框数据

// 查询申请医生列表
export const onQueryApplyDoctors = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbJoinDetail/onQueryApplyDoctors`,
    params,
  })

// 查询诊断列表
export const onQueryDiagnoses = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbDiagnose/onQueryDiagnoses`,
    params,
  })

// 查询诊断列表
export const getDiagnosesList = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatDiagnoseBase/onQueryDiagnosesWithPatId`,
    params,
  })

// 查询模板下载列表
export const getExcelTemplateDownloadPath = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbSystemConfig/getExcelTemplateDownloadPath`,
    params,
  })
