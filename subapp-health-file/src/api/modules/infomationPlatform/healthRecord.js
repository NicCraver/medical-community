//医共体信息平台门户-健康档案共享调阅
import http from '../../index'
let commonUrl = "/ygt-health-archive";
let commonUrl1 = "/ygt-user";

/* 居民中心 */
// 查询居民列表
export const getResidentList = params => http.get({
  url: commonUrl + '/personalArchiveInfo/listPersonalArchiveInfo',
  params
})

/* 统计分析 */
// 查询统计分析列表
export const getStatisticsList = params => http.get({
  url: commonUrl + '/ehrStat/pageEhrStat',
  params
})

// 查询医疗机构、统筹区列表
export const getHospitalList = params => http.get({
  url: commonUrl + '/ehrStat/getCombobox',
  params
})

/* 系统配置-模块配置 */
// 查询模块列表
export const getModuleList = () => http.get({
  url: commonUrl + '/dept/getTreeDept'
})
// 保存
export const saveModuleList = data => http.post({
  url: commonUrl + '/dept/saveTreeDept',
  data
})

/* 系统配置-隐私配置 */
// 获取隐私配置
export const getPrivacyConfig = () => http.get({
  url: commonUrl + '/config/getPrivacy'
})
// 保存
export const savePrivacyConfig = data => http.post({
  url: commonUrl + '/config/savePrivacy',
  data
})

// 获取机构名称树形
export const getOrgNames = () => http.get({
  url: `${commonUrl1}/org/getOrgTree`
});
