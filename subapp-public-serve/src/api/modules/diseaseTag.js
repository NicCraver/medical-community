import http from '../index.js'

// 查询病种标签
export const getDiseaseTagList = (data) =>
  http.post({
    url: `/ygt-user/tbTagDiseaseDept/onQueryTagDiseaseDept`,
    data,
  })

export const getTagDiseaseDepts = (params) =>
  http.get({
    url: `/ygt-user/tbDictionaryDetail/getDeptDictionaryForTagDisease`,
    params,
  })

export const saveDiseaseTag = (data) =>
  http.post({
    url: `/ygt-user/tbTagDiseaseDept/onSaveTagDiseaseDept`,
    data,
  })

// 检测标签是否被使用
export const checkTagUseStatus = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatientRichDisease/checkTagUseStatus`,
    data,
  })

// 开启关闭标签
export const changeStatus = (data) =>
  http.post({
    url: `/ygt-user/tbTagDiseaseDept/changeStatus`,
    data,
  })

// 列表查询中科室下拉数据
export const getDeptDictionaryForQuery = (params) =>
  http.get({
    url: `/ygt-user/tbTagDiseaseDept/getDeptDictionaryForQuery`,
    params,
  })