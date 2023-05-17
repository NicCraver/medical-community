import http from '../index'

let commonUrl = "/ygt-api";
let sUrl = "/dictionary";

// 获取缓存字典列表信息
export const getDictSimpleByCodes = params => http.get({
    url: commonUrl + sUrl + '/dictSimpleByCodes',
    params
})