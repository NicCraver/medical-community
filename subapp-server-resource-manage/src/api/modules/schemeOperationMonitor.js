/* 
  @description 方案运行监控
  @date 2022/5/11
*/
import http from '../index'
let commonUrl = "/ygt-data-dock";

/* 方案运行监控 */
// 方案运行监控查询
export const getListRulePlan = data => http.get({
  url: commonUrl + '/dockRulePlanRunLog/listRulePlan',
  params: data
});

// 方案运行监控记录查询
export const getRulePlanRunLogList = data => http.get({
  url: commonUrl + '/dockRulePlanRunLog/list',
  params: data
});

// 方案运行监控手动执行、重跑
export const rulePlanRun = data => http.get({
  url: commonUrl + '/DockRulePlan/run',
  params: data
});