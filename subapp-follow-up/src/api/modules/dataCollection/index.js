import http from '../../index'

// 血压统计表查询
export const listPatBloodPressuresForPage = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatBloodPressure/listPatBloodPressuresForPage`,
    data,
  })

// 血糖统计表查询
export const listPatBloodSugarForPage = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatBloodSugar/listPatBloodSugarForPage`,
    data,
  })

// 高血压趋势图
export const bloodBloodChartData = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatBloodPressure/followupLineChartForDate`,
    data,
  })

// 数据采集-随访详情时间区间
export const queryPatBPDate = (data) =>
  http.post({
    url: `/ygt-richdiseases/patDataCollectionLevel/queryPatBPDate`,
    data,
  })

// 糖化血红蛋白趋势图
export const cruorinChartData = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatGlycation/createLineChartForDate`,
  data,
})
// 血糖趋势图
export const bloodSugarChartData = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatBloodSugar/followupLineChartForDate`,
  data,
})
// 查询模板
export const getMesTemplateByType = (data) =>
  http.post({
    url: `/ygt-user/tbOrgMesTemplate/getMesTemplateByType`,
    data,
  })

// 保存患者提醒设置
export const patRemindSetting = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbRemindSet/patRemindSetting`,
    data,
  })

// 字典接口
export const getDictionary = (params) =>
  http.get({
    url: `/ygt-user/tbDictionaryGroup/getDictionary`,
    params,
  })