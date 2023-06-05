import http from '../index.js'

// 查询病种对照列表
export const getDiseaseIcdList = (data) =>
  http.post({
    url: `/ygt-user/tbIcdDiseaseTag/onQueryIcdDiseaseTags`,
    data
  })

//修改总状态
export const onChangeStatus = (data) =>
  http.post({
    url: `/ygt-user/tbIcdDiseaseTagMain/onChangeStatus`,
    data
  })

//删除病种对照(列表中的删除按钮)
export const onDelIcdDiseaseTagMain = (data) =>
  http.post({
    url: `/ygt-user/tbIcdDiseaseTagMain/onDelIcdDiseaseTagMain`,
    data
  })

//疾病编码类型下拉接口
export const getIcdTypes = (params) =>
  http.get({
    url: `/ygt-user/tbDictionaryDetail/getIcdTypes`,
    params
  })

//疾病下拉接口
export const getIcdDicForOrderBy = (params) =>
  http.get({
    url: `/ygt-user/tbIcdDictionary/getIcdDicForOrderBy`,
    params
  })

//查询科室
export const getDeptDictionaryForIcd = (params) =>
  http.get({
    url: `/ygt-user/tbTagDiseaseDept/getDeptDictionaryForIcd`,
    params
  })

//病种标签下拉框接口
export const getTagDiseaseByDeptId = (params) =>
  http.get({
    url: `/ygt-user/tbTagDiseaseDept/getTagDiseaseByDeptId`,
    params
  }) 

//保存病种标签对照
export const saveDiseaseIcd = (data) =>
  http.post({
    url: `/ygt-user/tbIcdDiseaseTag/onSaveIcdDiseaseTag`,
    data
  })

  
