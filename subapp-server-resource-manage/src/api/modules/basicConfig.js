/* 
  @description 基础配置
  @date 2022/04/18
*/
import http from '../index'

/* 规则配置 */
// 获取规则配置列表
export const getRuleConfigList = (params) => http.get({
  url: '/ygt-data-dock/DockRuleConfig/list',
  params
});
// 获取规则配置详情
export const getRuleConfigDetail = (params) => http.get({
  url: '/ygt-data-dock/DockRuleConfig/getRuleConfig',
  params
});
// 新增
export const addRuleConfig = data => http.post({
  url: '/ygt-data-dock/DockRuleConfig/add', data
})
// 编辑
export const editRuleConfig = data => http.post({
  url: '/ygt-data-dock/DockRuleConfig/update', data
})
// 删除
export const deleteRuleConfig = data => http.post({
  url: '/ygt-data-dock/DockRuleConfig/delete', data
})
// 获取规则分级下拉
export const getDictList = (params) => http.get({
  url: '/ygt-api/dictionary/dictSimpleByCodes',
  params
});
// 获取数据库的表和字段
export const getTableField = () => http.get({
  url: '/ygt-data-dock/DockRuleConfig/getTableInfo'
});
// 获取规则配置编辑sql
export const getConfigEditSql = data => http.post({
  url: '/ygt-data-dock/DockRuleConfig/generateSql', data
});
// 获取预览sql
export const getPreviewSql = data => http.post({
  url: '/ygt-data-dock/DockRuleConfig/reviewSql', data
});
// 获取字典表下拉
export const getDictTables = () => http.get({
  url: '/ygt-data-dock/DockRuleConfig/getDictConfigOption'
});
// 获取字典名称下拉
export const getDictTableSelect = () => http.get({
  url: '/ygt-data-dock/DockRuleConfig/getDictInfoForConfig'
});
// 获取业务目录下拉(编辑)
export const getCatalogSelect = () => http.get({
  url: '/ygt-data-dock/dockRoleBiz/getRoleBizOption'
});
// 获取角色&业务目录下拉(列表) { typeList: "biz,role" } 目前没用到
export const getRuleSelect = params => http.get({
  url: '/ygt-data-dock/dockRoleBiz/getRoleBizByType', params
});
// 配置自定义sql校验
export const validSql = data => http.post({
  url: '/ygt-data-dock/DockRuleConfig/verifySql', data
});

/* 质控方案 */
// 获取质控方案列表
export const getQualityControlList = (params) => http.post({
  url: '/ygt-data-dock/DockRulePlan/list',
  data: params
});
// 获取质控方案详情
export const getQualityControlDetail = (params) => http.get({
  url: '/ygt-data-dock/DockRulePlan/getRulePlanDetail',
  params
});
// 获取机构名称树形
export const getOrgNames = () => http.get({
  url: '/ygt-user/org/getOrgTree'
  // url: '/ygt-user/org/getOrgNames' 20230215废除
});
// 引用
export const quote = (params) => http.get({
  url: '/ygt-data-dock/DockRulePlan/quote',
  params
});
// 新增
export const addQualityControl = data => http.post({
  url: '/ygt-data-dock/DockRulePlan/add', data
})
// 编辑
export const editQualityControl = data => http.post({
  url: '/ygt-data-dock/DockRulePlan/update', data
})
// 发布
export const publishQualityControl = data => http.post({
  url: '/ygt-data-dock/DockRulePlan/publish', data
})
// 方案&发布状态改变
export const statusChange = data => http.post({
  url: '/ygt-data-dock/DockRulePlan/batch', data
})