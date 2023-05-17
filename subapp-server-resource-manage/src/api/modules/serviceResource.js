/* 
  @description 服务资源
  @date 2022/2/7
*/
import http from '../index'

/* 概览 */
export const getOverviewService = params => http.get({ url: '/ygt-data-dock/dockInterfaceManage/getServiceRes', params })

/* 资源目录 */
// 获取目录列表
export const getCatalog = () => http.get({
  url: '/ygt-data-dock/dockResource/getChildNodes'
});
// 获取目录详情
export const getCatalogInfo = params => http.get({
  url: '/ygt-data-dock/dockResource/getNodeInfo', params
});
// 目录新增
export const addCatalog = data => http.post({
  url: '/ygt-data-dock/dockResource/addDirectory', data
})
// 目录修改
export const updateCatalog = data => http.post({
  url: '/ygt-data-dock/dockResource/updateDirectory', data
})
// 目录删除
export const deleteCatalog = data => http.post({
  url: '/ygt-data-dock/dockResource/delDirectory', data
})

/* 服务管理 */
// 获取服务列表
export const getServiceList = params => http.get({ url: '/ygt-data-dock/dockInterfaceManage/list', params })
// 新增服务
export const addService = data => http.post({ url: '/ygt-data-dock/dockInterfaceManage/savePublish', data })
// 删除
export const deleteService = data => http.post({ url: '/ygt-data-dock/dockInterfaceManage/delInterfaceInfo', data })
// 发布
export const publishService = data => http.post({ url: '/ygt-data-dock/dockInterfaceManage/publish', data })
// 停用
export const stopService = data => http.post({ url: '/ygt-data-dock/dockInterfaceManage/stop', data })
// 获取服务详情
export const getServiceDetail = params => http.get({ url: '/ygt-data-dock/dockInterfaceManage/detail', params })
// 获取发布服务下拉
export const getPublishService = () => http.get({ url: '/ygt-data-dock/dockInterfaceManage/getPublishService' })
// 获取发布地址下拉
export const getPublishAddress = params => http.get({ url: '/ygt-data-dock/dockInterfaceManage/getInterfaceOptionByService', params })
// 获取发布地址详情
export const getPublishAddressDetail = params => http.get({ url: '/ygt-data-dock/dockInterfaceManage/getInterfaceInfoByPath', params })
// 获取返回格式下拉
export const getResponseTypes = () => http.get({ url: '/ygt-data-dock/dockInterfaceManage/getResponseTypes' })
// 获取请求方式下拉
export const getRequestMethods = params => http.get({ url: '/ygt-data-dock/dockInterfaceManage/getAgreementSubTypes', params })
// 获取请求参数下拉
export const getParamTypes = () => http.get({ url: '/ygt-data-dock/dockInterfaceManage/getDataTypes' })

/* 访问日志 */
// 获取日志列表
export const getLogList = params => http.get({ url: '/ygt-data-dock/dockLog/list', params })
// 查看详细日志
export const getLogDetail = params => http.get({ url: '/ygt-data-dock/dockLog/detail', params })
// 日志下载
export const exportExcel = data => http.post({ url: '/ygt-data-dock/dockLog/exportExcel', data, responseType: 'blob' })