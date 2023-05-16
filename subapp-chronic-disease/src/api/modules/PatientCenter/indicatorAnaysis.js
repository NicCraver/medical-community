import http from '../../index'

// 获取统计图&患者日期范围
export const getPatBloodDateRange = (params) => http.get({
  url: `/ygt-richdiseases/tbMbPatBloodSugar/getPatBloodDateRange`,
  params,
})
// 获取患者数据
export const onQueryPatBloodAnalysis = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatBloodSugar/onQueryPatBloodAnalysis`,
  data,
})
// 糖化血红蛋白趋势图
export const cruorinChartData = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatGlycation/createLineChartForDate`,
  data,
})
// 血糖趋势图
export const bloodSugarChartData = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatBloodSugar/createLineChartForDate`,
  data,
})
// 血压趋势图
export const bloodPressureChartData = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatBloodPressure/createLineChartForDate`,
  data,
})
// 血糖值统计表
export const listPatBloodSugarForPage = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatBloodSugar/listPatBloodSugarForPage`,
  data,
})
// 血压值统计表
export const listPatBloodPressuresForPage = (data) => http.post({
  url: `/ygt-richdiseases/tbMbPatBloodPressure/listPatBloodPressuresForPage`,
  data,
})
// 患阅-周血糖
export const onQueryBSDateForChart = (params) => http.get({
  url: `/ygt-richdiseases/tbMbPatBloodSugar/onQueryBSDateForChart`,
  params,
})
// 患阅-糖化血红蛋白趋势图
export const onQueryGlyDateForChart = (params) => http.get({
  url: `/ygt-richdiseases/tbMbPatGlycation/onQueryGlyDateForChart`,
  params,
});
// 患阅-血糖测量结果
export const onQueryBSDate = (params) => http.get({
  url: `/ygt-richdiseases/tbMbPatBloodSugar/onQueryBSDate`,
  params,
})
// 患阅-血压趋势图
export const getBPDateForChart = (params) => http.get({
  url: `/ygt-richdiseases/tbMbPatBloodPressure/getBPDateForChart`,
  params,
});
// 患阅-血压测量结果
export const onQueryBPDate = (params) => http.get({
  url: `/ygt-richdiseases/tbMbPatBloodPressure/onQueryBPDate`,
  params,
})
// 患者触达
// 入参 patId:患者id
export const queryPatReach = (data) => http.post({
  url: `/ygt-richdiseases/tbMbRemindSet/queryPatReach`,
  data,
})

// /ygt-richdiseases/tbMbRemindSet/queryPatReachDetails post 入参 id：主键  
// 回参
// {
// 	planSendDate：消息发送/计划发送时间
//     systemMsg：系统消息
//     weChatMsg：公众号消息
//     smsMsg：短信消息
//     reachResult：触达结果
//     reachSource：触达来源
// }
export const queryPatReachDetails = (data) => http.post({
  url: `/ygt-richdiseases/tbMbRemindSet/queryPatReachDetails`,
  data,
})