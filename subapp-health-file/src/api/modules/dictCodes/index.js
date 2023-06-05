import http from '../../index'

let commonUrl = "/ygt-api";
let commonUrl1 = "/ygt-health-archive";
let sUrl = "/dictionary";

// 获取缓存字典列表信息
export const getDictSimpleByCodes = params => http.get({
  url: commonUrl + sUrl + '/dictSimpleByCodes',
  params
})

// 获取诊断字典列表信息
export const getZDDictSimpleByCodes = params => http.get({
  url: commonUrl1 + '/dictionaryDiag/dictSimpleByCodes',
  params
})