import http from '../../index'

let commonUrl = "/ygt-health-archive";

// 查询患者档案信息
export const getPersonalArchiveInfoById = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveInfo/getPersonalArchiveInfoById`,
    params,
  });

//查询家庭成员信息
export const getAllFamilyMemberRelationship = (params) =>
  http.get({
    url: `${commonUrl}/tbFamilyMemberRelationship/getAllFamilyMemberRelationshipByPaId`,
    params,
  });

//近期检验公共方法
export const getRecent = (params, dic, url) =>
  http.get({
    url: `${commonUrl}/${dic}/${url}`,
    params,
  });

//近期检验、检查
export const getRecentData = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getRecentRecord`,
    params,
  });

//近期用药
export const getRecentDataP = (params) =>
  http.get({
    url: `${commonUrl}/tbHeAdviceDetail/getRecentRecord`,
    params,
  });

//getChronicDiseases
export const getChronicDiseases = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getChronicDiseases`,
    params,
  });


// 查询近期就诊
export const getRecentVisitRecord = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getRecentVisitRecord`,
    params,
  });

// 查询近期手术
export const getRecentOperationRecord = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getRecentOperationRecord`,
    params,
  });


// 查询近期体检
export const getRecentMedicalExamRecord = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getRecentMedicalExamRecord`,
    params,
  });

// 查询
export const getVisitRecord = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getVisitRecord`,
    params,
  });

// 查询 数据年份
export const getVisitRecordForYear = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getVisitRecordForYear`,
    params,
  });

//  根据门诊就诊记录查询医嘱明细
export const getAdviceDetailsByMedicalRecord = (params) =>
  http.get({
    url: `${commonUrl}/opAdviceDetails/getAdviceDetailsByMedicalRecord`,
    params,
  });


//  查询住院医嘱明细
export const searchAdviceDetails = (params) =>
  http.get({
    url: `${commonUrl}/tbIpAdviceDetails/searchAdviceDetails`,
    params,
  });


//  查询根据住院登记记录查询检验报告
export const getLisReportByIpReg = (params) =>
  http.get({
    url: `${commonUrl}/lisReport/getLisReportByIpReg`,
    params,
  });


//  根据门诊就诊记录查询检验报告
export const getLisReportByOpVisit = (params) =>
  http.get({
    url: `${commonUrl}/lisReport/getLisReportByOpVisit`,
    params,
  });

//  查询首页生命周期
export const getLifeCycle = (params) =>
  http.get({
    url: `${commonUrl}/personalArchiveMainInfo/getLifeCycle`,
    params,
  });