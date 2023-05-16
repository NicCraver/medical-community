//标准管理接口
import http from '../index'

// 转诊综合统计
export const onQueryStatisticsAnaData = (data) =>
  http.post({
    url: '/ygt-referral/tbRStatisticsAna/onQueryStatisticsAnaData',
    data,
  })

// 医生工作量统计
export const onQueryDoctorWorkloadData = (data) =>
  http.post({
    url: '/ygt-referral/tbRDoctorWorkload/onQueryDoctorWorkloadData',
    data,
  })

// 患者统计
export const onQueryPatAnaData = (data) =>
  http.post({
    url: '/ygt-referral/tbRPatAna/onQueryPatAnaData',
    data,
  })

// 转诊综合导出
export const comprehensiveExportExcel = (data) =>
  http.post({
    responseType: 'blob',
    url: '/ygt-referral/tbRStatisticsAna/exportExcel',
    data,
  })

// 下拉框
export const getDataDownBox = (params) =>
  http.get({
    url: '/ygt-referral/tbRDoctorWorkload/getDataDownBox',
    params,
  })

// 科室工作量统计
export const onQueryDeptAnaData = (data) =>
  http.post({
    url: '/ygt-referral/tbRStatisticsAna/onQueryDeptAnaData',
    data,
  })

// 接诊人次统计
export const onQueryAdmAnaData = (data) =>
  http.post({
    url: '/ygt-referral/tbRStatisticsAna/onQueryAdmAnaData',
    data,
  })
