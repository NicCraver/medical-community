/* 
  @description 数据资产
  @date 
*/
import http from '../index'
let commonUrl = "/ygt-data-dock";
let commonUrl2 = "/ygt-health-archive";

// 资产查询
export const getAsset = data => http.get({
    url: commonUrl + '/dockDataRes/getAsset',
    params: data
});

// 医疗机构数据统计
export const listOrgDataStatistics = data => http.get({
    url: commonUrl2 + '/ehrBalanceAccounts/listOrgDataStatistics',
    params: data
});

// 医疗机构数据统计导出
export const ehrBalanceExportExcel = data => http.post({
    url: commonUrl2 + '/ehrBalanceAccounts/exportExcel',
    params: data,
    responseType: 'blob'
});

// 医疗机构排名
export const createPieChartForRanking = data => http.get({
    url: commonUrl2 + '/ehrBalanceAccounts/createPieChartForRanking',
    params: data
});

// 电子病历数据统计查询
export const createLineChartForEmr = data => http.get({
    url: commonUrl2 + '/ehrBalanceAccounts/createLineChartForEmr',
    params: data
});

// 人口数、电子病历、健康档案查询
export const getCollectData = data => http.post({
    url: commonUrl2 + '/ehrBalanceAccounts/getCollectData',
    data
});