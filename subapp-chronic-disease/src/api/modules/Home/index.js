import http from '../../index'

/**
startDate=&endDate=&dateType=&diseaseType=&type=
GET
startDate：开始时间(yyyy-MM-dd)
endDate：结束时间(yyyy-MM-dd)
dateType：时间类型-week：本周；month：本月；year：本年
diseaseType：慢病种类
type：视图类型-A,B,C,D,E,F,G,H 
*/
// 统计及图表数据
export const getHomePageData = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbJoinDetail/getHomePageData`,
    params,
  })

// 病种查询
export const onQueryAllDiseaseTypes = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbSysDiseaseType/onQueryAllDiseaseTypes`,
    params,
  })
export const getActivityStatistics = (params) =>
  http.get({
    url: `/ygt-marketing/tbAActivity/getActivityStatistics`,
    params,
  })
