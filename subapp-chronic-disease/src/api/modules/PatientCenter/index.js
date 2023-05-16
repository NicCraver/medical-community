import http from '../../index'

// 获取个人档案信息
export const getPatientRecordById = (params) =>
  // 获取个人基本信息
  http.get({
    url: `/ygt-richdiseases/tbMbPatient/getPatientRecordById`,
    params,
  })

// 保存个人基本信息
export const submitPatientRecord = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatient/saveData`,
    data,
  })

// 获取慢病标签
export const getOrgDiseaseTypes = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbOrgDiseaseType/onQueryOrgDiseaseTypes`,
    params,
  })

// 获取查询 慢病种类下拉框
export const onQueryAllDiseaseTypes = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbSysDiseaseType/onQueryAllDiseaseTypes`,
    params,
  })

export const getPatientInfo = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatient/getPatientById`,
    params,
  })

export const saveDiseaseTag = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatientRichDisease/saveData`,
    data,
  })

export const getPatientCenterForPage = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatient/forPage`,
    data,
  })

export const finishArchive = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatient/finishArchive`,
    data,
  })

export const restoreArchive = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatient/restoreArchive`,
    data,
  })
export const joinFollowUp = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatient/followup`,
    data,
  })

export const getDoctorList = (params) =>
  http.get({
    // url: `/ygt-registry-manage/tbRmUser/getDoctorList`,
    url: `/ygt-registry-manage/tbRmUser/getDoctorList`,
    params,
  })

// 获取责任医生 new
export const getDoctorUserData = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatient/getDoctorUserData`,
    params,
  })

export const getUserList = (data) =>
  http.post({
    url: `/ygt-user/user/onQueryDoctorList`,
    data,
  })

export const onQueryArchiveUsers = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbJoinDetail/onQueryArchiveUsers`,
    params,
  })

export const getLogList = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbModifyLogRecordsMain/onQueryModifyLogs`,
    params,
  })

export const getLogDetail = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbModifyLogRecords/onQueryModifyLogDetails`,
    params,
  })

export const getPersonFollowUpRecord = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/getPersonFollowUpRecord`,
    data,
  })

// 获取个人随访计划
export const getPlanName = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowPlan/getPlanName`,
    params,
  })

// 获取个人随访人员
export const getFollowupUserIdAndName = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowPlan/getFollowupUserIdAndName`,
    params,
  })
// 获取个人随访人员
export const getDiseaseMain = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbDiseaseMain/getDiseaseMain`,
    params,
  })

//慢病档案 疾病+手术 搜索下拉
export const getRequestMain = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbIcdDictionary/getIcdDicByDirectoryTypeForOrderBy`,
    params
  }) 

//手术-手术编号 
// export const getDiseaseCut = (params) =>
//   http.get({
//     url: `/ygt-mdt/tbMdtPatientsBaseInfo/getSurgeryData`, 
//     params,
//   })

// 获取个人中心责任医生下拉
export const getDoctorUserIdAndName = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatient/getDoctorUserIdAndName`,
    params,
  })

// // 获取个人中心责任医生下拉
// export const test = (params) =>
//   http.get({
//     url: `/ygt-api/general/test`,
//     params,
//   });

// 初始化纳入随访界面
// POST
// []   患者id
export const onInitFollowup = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatient/onInitFollowup`,
    data,
  })
export const batchPushActivity = (data) =>
  http.post({
    url: `/ygt-marketing/tbAActivityPush/batchPushActivity`,
    data,
  })

export const queryPushPatientInfo = (data) =>
  http.post({
    url: `/ygt-marketing/tbAActivityPush/queryPushPatientInfo`,
    data,
  })

// hosId
export const getPatIsExistFollowupPlanOver = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowPlan/getPatIsExistFollowupPlanOver`,
    params,
  })

// 查询患者提醒设置
export const queryPatRemindSetting = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbRemindSet/queryPatRemindSetting`,
    data,
  })

// 查询模板
export const getMesTemplateByType = (data) =>
  http.post({
    url: `/ygt-user/tbOrgMesTemplate/getMesTemplateByType`,
    data,
  })

// 保存患者提醒设置
export const patRemindSetting = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbRemindSet/patRemindSetting`,
    data,
  })

// 查询患者个性化设置信息
export const queryPersonalizedSetting = (data) =>
  http.post({
    url: `/ygt-richdiseases/patDataCollectionLevel/queryPersonalizedSetting`,
    data,
  })

// 患者个性化设置
export const personalizedSettings = (data) =>
  http.post({
    url: `/ygt-richdiseases/patDataCollectionLevel/personalizedSettings`,
    data,
  })

// 字典接口
export const getDictionary = (params) =>
  http.get({
    url: `/ygt-user/tbDictionaryGroup/getDictionary`,
    params,
  })


// 疾病，手术下拉接口
// 入参
// value：疾病名称/编码(选填)
// directoryType：类型：ICD10-A  疾病编码，ICD9-B   手术编码
export const getIcdDicForOrderBy = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbIcdDictionary/getIcdDicByDirectoryTypeForOrderBy`,
    params,
  })