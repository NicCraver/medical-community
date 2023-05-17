//标准管理接口
import http from '../index.js'

/* 值域标准 */
//查询值域标准树形
export const getAreaTree = () => http.get({
  url: '/ygt-basic-manage/valueDomain/getTree'
});
// 根据id查询值域表
export const getAreaTableById = params => http.get({
  url: '/ygt-basic-manage/valueDomain/getById',
  params
});
// 查询值域表标准类型
export const getAreaStandardType = () => http.get({
  url: '/ygt-basic-manage/valueDomain/listStandardType'
});
// 新增值域表
export const addAreaTable = data => http.post({
  url: '/ygt-basic-manage/valueDomain/add',
  data
})
// 修改值域表
export const updateAreaTable = data => http.post({
  url: '/ygt-basic-manage/valueDomain/update',
  data
})
// 删除值域表
export const deleteAreaTable = data => http.post({
  url: '/ygt-basic-manage/valueDomain/delete',
  data
})

// 查询值域项列表
export const getAreaOption = params => http.get({
  url: '/ygt-basic-manage/valueDomain/listOption',
  params
});
// 新增值域项列表
export const addAreaOption = data => http.post({
  url: '/ygt-basic-manage/valueDomain/addOption',
  data
})
// 编辑值域项列表
export const editAreaOption = data => http.post({
  url: '/ygt-basic-manage/valueDomain/updateOption',
  data
})
// 删除值域项列表
export const deleteAreaOption = data => http.post({
  url: '/ygt-basic-manage/valueDomain/deleteOption',
  data
})

// 获取数据元标准选项
export const getDataElementSelect = () => http.get({
  url: '/ygt-basic-manage/dataElement/listOption'
})
// 关联数据元
export const saveDataElementRelation = data => http.post({
  url: '/ygt-basic-manage/valueDomain/saveDataElementRelation',
  data
})
// 取消关联数据元
export const cancelDataElementRelation = data => http.post({
  url: '/ygt-basic-manage/valueDomain/cancelDataElementRelation',
  data
})

// 获取值域下拉选项
export const getDomainSelect = () => http.get({
  url: '/ygt-basic-manage/valueDomain/listSelectOption'
})

/* 数据元标准 */
// 获取数据元列表
export const getDataElement = params => http.get({
  url: '/ygt-basic-manage/dataElement/list',
  params
});
// 获取数据元标准类型
export const getDataElementStandardType = () => http.get({
  url: '/ygt-basic-manage/dataElement/listStandardType'
});
// 新增数据元
export const addDataElement = data => http.post({
  url: '/ygt-basic-manage/dataElement/add',
  data
})
// 编辑数据元
export const editDataElement = data => http.post({
  url: '/ygt-basic-manage/dataElement/update',
  data
})
// 删除数据元
export const deleteDataElement = data => http.post({
  url: '/ygt-basic-manage/dataElement/delete',
  data
})

/* 交换标准-基础配置 */
// 获取业务分类树、活动分类树
export const getBasicconfigTree = params => http.get({
  url: '/ygt-basic-manage/baseConfig/getChildNodes',
  params
})
// 获取业务、活动分类基本信息
export const getBasicconfigInfo = params => http.get({
  url: '/ygt-basic-manage/baseConfig/getNodeInfo',
  params
})
// 业务分类-新增 活动分类-新增
export const addBasicconfig = data => http.post({
  url: '/ygt-basic-manage/baseConfig/addNode',
  data
})
// 业务分类-编辑 活动分类-编辑
export const editBasicconfig = data => http.post({
  url: '/ygt-basic-manage/baseConfig/updateNode',
  data
})
// 业务分类-删除 活动分类-删除
export const deleteBasicconfig = data => http.post({
  url: '/ygt-basic-manage/baseConfig/deleteNode',
  data
})
// 字段配置-获取模板树
export const getTemplateTree = params => http.get({
  url: '/ygt-basic-manage/baseConfig/getTemplateChildNodes',
  params
})
// 字段配置-获取模板信息
export const getTemplateInfo = params => http.get({
  url: '/ygt-basic-manage/baseConfig/getTemplateNodeInfo',
  params
})
// 字段配置-获取字段列表
export const getFieldData = params => http.get({
  url: '/ygt-basic-manage/baseConfig/listTemplateFieldInfo',
  params
})
// 字段配置-模板-新增
export const addTemplate = data => http.post({
  url: '/ygt-basic-manage/baseConfig/addTemplateNode',
  data
})
// 字段配置-模板-编辑
export const editTemplate = data => http.post({
  url: '/ygt-basic-manage/baseConfig/updateTemplateNode',
  data
})
// 字段配置-模板-删除
export const deleteTemplate = data => http.post({
  url: '/ygt-basic-manage/baseConfig/deleteTemplateNode',
  data
})
// 字段配置-字段列表-新增
export const addField = data => http.post({
  url: '/ygt-basic-manage/baseConfig/addField',
  data
})
// 字段配置-字段列表-编辑
export const editField = data => http.post({
  url: '/ygt-basic-manage/baseConfig/updateField',
  data
})
// 字段配置-字段列表-删除
export const deleteField = data => http.post({
  url: '/ygt-basic-manage/baseConfig/deleteField',
  data
})
// 字段配置-模板字段列表-添加
export const addTemplateField = data => http.post({
  url: '/ygt-basic-manage/baseConfig/saveTemplateFieldRelation',
  data
})
// 字段配置-模板字段列表-删除
export const deleteTemplateField = data => http.post({
  url: '/ygt-basic-manage/baseConfig/deleteTemplateFieldRelation',
  data
})
// 字段配置-模板字段列表-排序
export const sortTemplateField = data => http.post({
  url: '/ygt-basic-manage/baseConfig/sortTemplateField',
  data
})

/* 交换标准-交换标准配置 */
// 获取标准列表
export const getExchangeStandardList = params => http.get({
  url: '/ygt-basic-manage/exchangeStandard/list',
  params
})
// 获取基本信息
export const getExchangeStandardInfo = params => http.get({
  url: '/ygt-basic-manage/exchangeStandard/getById',
  params
})
// 获取交换数据元列表
export const getExchangeDataelementList = params => http.get({
  url: '/ygt-basic-manage/exchangeStandard/listExchageDataElement',
  params
})
// 获取业务/活动分类下拉
export const getBasicconfigSelect = params => http.get({
  url: '/ygt-basic-manage/dataElement/listBusinessOption',
  params
})
// 新增交换标准
export const addExchangeStandard = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/add',
  data
})
// 修改交换标准
export const editExchangeStandard = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/update',
  data
})
// 删除交换标准
export const deleteExchangeStandard = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/delete',
  data
})
// 引用交换标准
export const quoteExchangeStandard = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/quoteExchangeStandard',
  data
})

// 交换数据元列表-添加
export const addExchangeField = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/saveExchangeStandardFieldRelation',
  data
})
// 交换数据元列表-删除
export const deleteExchangeField = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/deleteExchangeStandardFieldRelation',
  data
})
// 交换数据元列表-排序
export const sortExchangeField = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/sortFieldList',
  data
})
// 交换数据元列表-获取模板
export const getTemplate = params => http.get({
  url: '/ygt-basic-manage/baseConfig/getTemplateFieldChildNodes',
  params
})


/* 交换标准-交换标准发布 */
// 获取交换标准列表
export const getExchangeList = params => http.get({
  url: '/ygt-basic-manage/exchangeStandard/listPublishExchangeStandard',
  params
})
// 获取停用的交换标准
export const getDeactivateExchangeList = params => http.get({
  url: '/ygt-basic-manage/exchangeStandard/listDeactivateExchangeStandard',
  params
})
// 发布
export const publishExchangeList = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/publish',
  data
})
// 停用
export const stopExchangeList = data => http.post({
  url: '/ygt-basic-manage/exchangeStandard/deactivate',
  data
})
// 查看详情
export const getExchangeDetail = params => http.get({
  url: '/ygt-basic-manage/transferData/docs',
  params
})