import http from '../index.js'

export const get = (params) =>
  http.get({
    url: ``,
    params,
  })

export const post = (data) =>
  http.post({
    url: ``,
    data,
  })

// 保存指征编码与HIS的映射
// /ygt-referral/tbHisIcdCorrelation/onSaveHisIcdCorrelationForReferral
// POST
// [
//   {
//     id：
//   icdCode：icd编码
//   hosId：机构id
//   hisIcdCode：his icd编码
//   hisIcdName：his icd名称
//   status：状态：Y/N
//   }
// ]
export const onSaveHisIcdCorrelationForReferral = (data) =>
  http.post({
    url: `/ygt-referral/tbHisIcdCorrelation/onSaveHisIcdCorrelationForReferral`,
    data,
  })

// 获取转诊目录类型下拉选项
// /ygt-referral/tbHisIcdCorrelation/getDirectoryTypeOptions
// GET
export const getDirectoryTypeOptions = (params) =>
  http.get({
    url: `/ygt-referral/tbHisIcdCorrelation/getDirectoryTypeOptions`,
    params,
  })

// 指征编码下拉
// /ygt-referral/tbIcdDictionary/getIcdDicByDirectoryTypeForOrderBy?value=&directoryType=
// GET
// value：icd编码/名称
// directoryType：目录类型

export const getIcdDicByDirectoryTypeForOrderBy = (params) =>
  http.get({
    url: `/ygt-referral/tbIcdDictionary/getIcdDicByDirectoryTypeForOrderBy`,
    params,
  })

// 转诊目录医院机构下拉框
// GET
export const getHosOptionsByUserAuth = (params) =>
  http.get({
    url: `/ygt-user/org/getHosOptionsByUserAuth`,
    params,
  })

// 转诊目录查询
// /ygt-referral/tbHisIcdCorrelation/onQueryHisIcdCorrelation
// POST
// 传参
// {
// "icdCode"：指征编码/名称
// "modDateS":：更新开始时间(yyyy-MM-dd HH:mm:ss)
// "modDateE"：更新结束时间(yyyy-MM-dd HH:mm:ss)
// "directoryType"：目录类型
// "createDateS"：创建开始时间(yyyy-MM-dd HH:mm:ss)
// "createDateE"：创建结束时间(yyyy-MM-dd HH:mm:ss)
// "pageNum"：页数
// "pageSize"：每页条数
// }
// 回参
// seq 序号
// modDate 更新时间
// directoryTypeDesc 目录类型
// icdCode 指征编码
// icdName 指征名称
// hosName 医疗机构名称
// hisIcdCode 机构内编码
// hisIcdName 机构内名称
// status 启用/停用(Y/N)
// createUserName 创建人
// createDate 创建时间
export const onQueryHisIcdCorrelation = (data) =>
  http.post({
    url: `/ygt-referral/tbHisIcdCorrelation/onQueryHisIcdCorrelation`,
    data,
  })

//   取消记录查询
// /ygt-referral/tbRHisWarn/onQueryHisWarns
// POST
// 传参
// patName： 姓名，门诊号，联系电话，身份证号
// orgId：集团id
// hosId：机构id
// createDateS：创建开始时间
// createDateE：创建结束时间
// pageNum：页数
// pageSize：每页条数
export const onQueryHisWarns = (data) =>
  http.post({
    url: `/ygt-referral/tbRHisWarn/onQueryHisWarns`,
    data,
  })

//   关闭/开启转诊目录
// /ygt-referral/tbHisIcdCorrelation/onChangeStatus?id=
// GET

export const onChangeStatus = (params) =>
  http.get({
    url: `/ygt-referral/tbHisIcdCorrelation/onChangeStatus`,
    params,
  })

// 批量关闭转诊目录
// /ygt-referral/tbHisIcdCorrelation/onBatchClose
// POST
// 传参：[]  id
export const onBatchClose = (data) =>
  http.post({
    url: `/ygt-referral/tbHisIcdCorrelation/onBatchClose`,
    data,
  })
