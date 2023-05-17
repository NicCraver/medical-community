//注册管理接口
import http from '../index.js'

// 机构/部门注册-请求左侧树数据
export const getOnQueryOrgsTree = data => http.post({
    url: '/ygt-basic-manage/org/onQueryOrgsTree',
    data
})
// 机构/部门注册-点击树表格内容查询
export const getOnQueryOrgs = data => http.post({
    url: '/ygt-basic-manage/org/onQueryOrgs',
    data
})
// 人员注册-查询人员数据
export const getOnQueryUsers = data => http.post({
    url: '/ygt-basic-manage/user/onQueryUsers',
    data
})
// 机构/部门注册-导出
export const setOutExportOrgExcel = data => http.post({
    url: '/ygt-basic-manage/org/exportOrgExcel',
    data,
    responseType: 'blob'
})
// 人员注册-导出
export const setOutExportUserExcel = data => http.post({
    url: '/ygt-basic-manage/user/exportUserExcel',
    data,
    responseType: 'blob'
})