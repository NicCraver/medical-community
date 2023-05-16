import http from '../index.js'

/* 医院配置管理 */
// 查询医院配置列表
export const onQueryOrgConfigs = (data) =>
  http.post({
    url: '/ygt-user/tbOrgConfig/onQueryOrgConfigs',
    data,
  })

// 保存机构配置
export const onSaveOrgConfig = (data) =>
  http.post({
    url: '/ygt-user/tbOrgConfig/onSaveOrgConfig',
    data,
  })

