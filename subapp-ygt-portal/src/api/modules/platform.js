/* 
  @description 工作台
  @date 2021/12/13
*/
import http from '../index.js'

// 医生门户
// 获取诊疗数据
export const getPatientNum = params => http.get({
  url: '/ygt-basic-manage/patient/getStatistics',
  params
});
// 获取健康管理数据
export const getHealthNum = params => http.get({
  url: '/ygt-basic-manage/healthy/getStatistics',
  params
});
// 获取随访患者列表
export const getPatientList = params => http.get({
  url: '/ygt-basic-manage/follow/listPatient',
  params
});
// 获取出勤情况
export const getAttendance = params => http.get({
  url: '/ygt-basic-manage/attendance/list',
  params
});
// 获取消息
export const getMessage = data => http.post({
  url: '/ygt-user/user/getNotesByUser',
  data
})

/* 运维门户 */
// 获取今日登陆人数
export const getLoginNum = () => http.get({
  url: '/ygt-user/user/online'
})
// 获取交换标准数据量
export const getExchangeChart = params => http.get({
  url: '/ygt-basic-manage/exchangeStandard/createLineChartForDate', params
})
