/* 
  @description 对账指标 + 对账明细
  @date 
*/
import http from '../index'
let commonUrl = "/ygt-data-dock";
let commonUrl1 = "/ygt-user";
let commonUrl2 = "/ygt-health-archive";

/* 对账指标 */
// 对账指标查询
export const getDockBizIndicatorList = data => http.get({
    url: commonUrl + '/dockBizIndicator/list',
    params: data
});

// 业务表名查询
export const getTableInfo = data => http.get({
    url: commonUrl + '/dockBizIndicator/getTableInfo',
    params: data
});

// 新增对账指标
export const saveDockBizIndicator = data => http.post({
    url: commonUrl + '/dockBizIndicator/save',
    data
});

// 批量删除对账指标
export const deleteDockBizIndicator = data => http.patch({
    url: commonUrl + '/dockBizIndicator/delete',
    data
});

/* 对账明细 */
// 机构列表
export const getHosOptions = data => http.get({
    url: commonUrl1 + '/org/getHosOptions',
    params: data
});
// 对账明细查询
export const getDockBalanceAccounts = data => http.get({
    url: commonUrl + '/dockBalanceAccounts/list',
    params: data
});

/* 机构来源统计 */
export const getListOrgSourceStatistics = data => http.get({
    url: commonUrl + '/dockBalanceAccounts/listOrgSourceStatistics',
    params: data
});

/* 医疗机构、采集数据 */
export const getCollectData = data => http.get({
    url: commonUrl + '/dockBalanceAccounts/getCollectData',
    params: data
});

/* 健康档案 */
export const getCollectDataP = data => http.get({
    url: commonUrl2 + '/personalArchiveInfo/getCollectData',
    params: data
});

/* 采集数据统计 */
export const getCreateLineChartForDate = data => http.get({
    url: commonUrl + '/dockBalanceAccounts/createLineChartForDate',
    params: data
});