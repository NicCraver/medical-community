/* 
  @description 数据资源
  @date 2022/2/18
*/
import http from '../index'

/* 概览 */
// 数据资源概览
export const getDatabases = (params) => http.get({
  url: '/ygt-data-dock/dockDataRes/getDatabases',
  params
});
// 获取数据库详情信息
export const getDatabaseDetail = params => http.get({
  url: '/ygt-data-dock/dockDataRes/getDetailById', params
})
// 获取数据库表信息
export const getDatabaseTable = params => http.get({
  url: '/ygt-data-dock/dockDataRes/getTableByDb', params
})
// 获取数据库表详情
export const getDatabaseTableDetail = params => http.get({
  url: '/ygt-data-dock/dockDataRes/listTableFieldByDb', params
})

/* 资源目录 */
// 获取目录列表
export const getResourceCatalog = () => http.get({
  url: '/ygt-data-dock/dockDataRes/getChildNodes'
});
// 获取目录详情
export const getResourceCatalogInfo = params => http.get({
  url: '/ygt-data-dock/dockDataRes/getNodeInfo', params
});
// 目录新增
export const addResourceCatalog = data => http.post({
  url: '/ygt-data-dock/dockDataRes/addDirectory', data
})
// 目录修改
export const updateResourceCatalog = data => http.post({
  url: '/ygt-data-dock/dockDataRes/updateDirectory', data
})
// 目录删除
export const deleteResourceCatalog = data => http.post({
  url: '/ygt-data-dock/dockDataRes/delDirectory', data
})
