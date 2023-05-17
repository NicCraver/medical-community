/* 
  @description 服务授权
  @date 
*/
import http from '../index'
let commonUrl = "/ygt-data-dock";
let commonUrl1 = "/ygt-user";
// 白名单查询
export const getDockIpWhiteList = data => http.get({
    url: commonUrl + '/dockIpWhiteList/listOrg',
    params: data
});

// 保存机构白名单
export const saveDockIpWhiteList = data => http.post({
    url: commonUrl + '/dockIpWhiteList/save',
    data
});

// 批量删除机构白名单
export const deleDockIpWhiteList = data => http.patch({
    url: commonUrl + '/dockIpWhiteList/delete',
    data
});

// 生成证书
export const getCertKey = data => http.get({
    url: commonUrl + '/dockIpWhiteList/getCertKey',
    params: data
});

// 机构白名单操作日志
export const getWhiteListLog = data => http.get({
    url: commonUrl + '/dockIpWhiteList/listLog',
    params: data
});

// 服务授权查询
export const getServiceEpmList = data => http.get({
    url: commonUrl + '/dockOrgCodeR/list',
    params: data
});

// 获得服务授权
export const getServiceEpm = data => http.get({
    url: commonUrl + '/dockOrgCodeR/get',
    params: data
});

// 保存服务授权
export const saveServiceEpm = data => http.post({
    url: commonUrl + '/dockOrgCodeR/save',
    data
});

// 批量保存服务授权
export const batchSaveServiceEpm = data => http.post({
    url: commonUrl + '/dockOrgCodeR/batchSave',
    data
});

// 批量删除授权
export const deleServiceEpm = data => http.patch({
    url: commonUrl + '/dockOrgCodeR/delete',
    data
});

// 获取机构列表
export const getOrgList = data => http.get({
    url: `${commonUrl1}/org/listByKeyword`,
    params: data
});
export const getNewOrgList = data => http.get({
    url: commonUrl + '/dockInterfaceManage/listByKeyword',
    params: data
});
