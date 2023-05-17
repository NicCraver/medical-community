/* 
  @description 质控面板
  @date 2022/05/18
*/
import http from '../index'

/* 区域总览 */
// 获取发布方案
export const getProjects = (params) => http.post({
  url: '/ygt-data-dock/dockRulePlanResult/queryPlansList', 
  data: params
});
// 获取发布方案详情
export const getProjectDetail = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryPlanDetail',
  params
});
// 获取发布方案得分
export const getProjectScore = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryPlanScore',
  params
});
// 获取发布方案得分趋势
export const getProjectScoreTrend = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryScoreTrend',
  params
});
// 获取医疗机构数据统计
export const getOrgDataCount = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryOrgScore',
  params
});
// 获取机构质控排名
export const getOrgRank = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/orgPlanRank',
  params
});

/* 各个规则总览 */
// 获取区域总览-一致性总览
export const getOrgRuleData = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryConfigOverView',
  params
});
// 获取机构总览-一致性总览
export const getOrgRuleDetailData = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryOrgConfigResult',
  params
});
// 获取机构总览-得分趋势
export const getOrgScoreTrend = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryOrgResultTrend',
  params
});
// 获取机构总览-表名下拉
export const getTableSelectData = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryTableOptionsById',
  params
});
// 获取机构总览-不一致记录
export const getOrgLogData = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryCompareLog',
  params
});
// 机构总览-不一致记录-导出
export const orgLogExport = data => http.post({
  url: '/ygt-data-dock/dockRulePlanResult/exportCompareLog', data, responseType: 'blob'
})

/* 机构总览 */
// 获取机构得分
export const getOrgScore = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryUserOrgResult',
  params
});
// 质控未达标项目
export const getOrgUnstandard = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryOrgUnstandard',
  params
});
// 质控规则排名
export const getOrgConfigRank = (params) => http.get({
  url: '/ygt-data-dock/dockRulePlanResult/queryOrgConfigRank',
  params
});