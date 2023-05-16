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

export const getLogList = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbModifyLogRecordsMain/onQueryModifyLogs`,
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

// 个人随访列表
export const getPersonFollowUpList = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/getPersonFollowUpForm`,
    data,
  })

// 查询患者随访计划
export const getPersonFollowUpPlans = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/getFollowUpPlan`,
    params,
  })

// 查询随访表单
export const getFollowUpForms = (params) =>
  http.get({
    url: `/ygt-followup/tbFollowTemplate/getTemplateOptions`,
    params,
  })

// 新增计划提交
export const addPlanSubmit = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/saveFollowUp`,
    data,
  })

// 新增计划提交
export const saveFollowUpBatch = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/saveFollowUpBatch`,
    data,
  })
// 修改计划提交
export const updatePlanSubmit = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/updateFollowUp`,
    data,
  })

// 获取计划详情
export const getPlanDetail = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowPlan/getPlanDataById`,
    params,
  })

// 查看随访计划
export const getFollowUpData = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/getFollowUpDataToForm`,
    data,
  })

// 查询随访统计数量
export const getFollowUpRate = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowPlan/getFollowUpRate`,
    params,
  })

// 关闭随访计划
export const shutDownPlan = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowPlan/shutDownPlan`,
    data,
  })

// 中止随访计划
export const terminationFollowUp = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/terminationFollowUp`,
    data,
  })

// 获取随访时间线
export const getEntryDataToLeft = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowEntry/getEntryDataToLeft`,
    params,
  })

// 随访录入提交
export const entryFollowUp = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowup/entryFollowUp`,
    data,
  })

// 获取已录入随访内容
export const getEntryData = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowEntry/getEntryData`,
    params,
  })

// 获取责任医生
export const getDoctorList = (params) =>
  http.get({
    url: `/ygt-registry-manage/tbRmUser/getDoctorList`,
    params,
  })

// 获取个人随访种类
export const getFollowupDiseaseCodeAndName = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowPlan/getFollowupDiseaseCodeAndName`,
    params,
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

// 获取个人中心责任医生下拉
export const getDoctorUserIdAndName = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatient/getDoctorUserIdAndName`,
    params,
  })

// 表单暂存
export const followupToTemStorage = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowEntry/followupToTemStorage`,
    data,
  })

// 表单暂存
export const assessToFollowupEntry = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowEntry/assessToFollowupEntry`,
    data,
  })

// 获取模板需要自动返显的数据
export const getTemplateDateById = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowEntry/getTemplateDateById`,
    params,
  })

// 纳入人列表
export const getFollowupIncludeUserList = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatient/getIncludePerson`,
    params,
  })

// 获取随访详情页面所需字段
export const getEntrySubmitData = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowEntry/getEntrySubmitData`,
    params,
  })

// 获取所有患者id
export const getPatientIds = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbPatient/getPatientIds`,
    data,
  })

// 批量调研预存
export const onResearchPrestore = (data) =>
  http.post({
    url: `/ygt-followup/tbMbPatientResearch/onResearchPrestore`,
    data,
  })

// 查看调研详情上部患者查询
export const getPatientInfoOnResearch = (params) =>
  http.get({
    url: `/ygt-followup/tbMbPatientResearch/getPatientInfoOnResearch`,
    params,
  })

// 编辑调研详情上部患者查询
export const getPatientInfoOnEdit = (params) =>
  http.get({
    url: `/ygt-followup/tbMbPatientResearch/getPatientInfoOnEdit`,
    params,
  })

// 新增随访调研
export const saveResearch = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowResearch/saveResearch`,
    data,
  })

// 获取调研列表
export const getResearchForm = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowResearch/getResearchForm`,
    data,
  })

// 获取调研反馈列表
export const getResearchFeedbackInfo = (data) =>
  http.post({
    url: `/ygt-followup/tbMbPatientResearch/getResearchFeedbackInfo`,
    data,
  })

// 查看调研详情
export const getResearchInfo = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowResearch/getResearchInfo`,
    params,
  })

// 患者反馈查询
export const getPatientFeedbackInfo = (data) =>
  http.post({
    url: `/ygt-followup/tbMbPatientResearch/getPatientFeedbackInfo`,
    data,
  })

// 调研详情页面，修改患者是否删除
export const deletePatientInResearch = (data) =>
  http.post({
    url: `/ygt-followup/tbMbPatientResearch/deletePatientInResearch`,
    data,
  })

// 调研详情页面，修改提交
export const updateResearch = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowResearch/updateResearch`,
    data,
  })

// 新增时-取消调研
export const deleteResearch = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowResearch/deleteResearch`,
    data,
  })
// 调研详情
export const getResearchFormHeaderInfo = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowResearch/getResearchFormHeaderInfo`,
    params,
  })

// 获取患者调研测评填写内容
export const getResearchRecordInfo = (params) =>
  http.get({
    url: `/ygt-followup/tbMbResearchEntry/getResearchRecordInfo`,
    params,
  })

// 调研反馈-关闭（批量）
export const downResearch = (data) =>
  http.post({
    url: `/ygt-followup/tbMbPatientResearch/downResearch`,
    data,
  })

// 获取调研发起人列表
export const getResearchUserInfo = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowResearch/getResearchUserInfo`,
    params,
  })

// 调研列表关闭调研
export const downFollowResearch = (data) =>
  http.post({
    url: `/ygt-followup/tbMbFollowResearch/downFollowResearch`,
    data,
  })

// 调研责任医生
export const getDoctorUserIdAndNameForRes = (params) =>
  http.get({
    url: `/ygt-followup/tbMbPatientResearch/getDoctorUserIdAndNameForRes`,
    params,
  })

// 患者调研测评页面获取所需字段
export const getInfoParams = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowResearch/getInfoParams`,
    params,
  })

// 调研列表关闭人下拉
export const getTerminationUser = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowResearch/getTerminationUser`,
    params,
  })

// 随访已中止操作人下拉框
export const getFollowUpSuspendList = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/getTerminationUser`,
    params,
  })

// 判断日历是否有权限点击
export const checkCalendarAuth = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatOrg/checkCalendarAuth`,
    params,
  })
  
// 保存随访模板
export const onSaveTemplate = (params) =>
  http.post({
    url: `/ygt-followup/tbFollowTemplate/onSaveTemplate`,
    data: params,
  })
// 更新随访模板
export const onUpdateTemplate = (params) =>
  http.post({
    url: `/ygt-followup/tbFollowTemplate/onUpdateTemplate`,
    data: params,
  })

// 查询随访模板列表
export const onQueryTemplates = (params) =>
  http.post({
    url: `/ygt-followup/tbFollowTemplate/onQueryTemplates`,
    data: params,
  })

// 引用模板接口
export const quoteTemplates = (params) =>
  http.post({
    url: `/ygt-followup/tbFollowTemplate/quoteTemplates`,
    params,
  })
// 查询病种接口
export const getTagDiseases = (params) =>
  http.get({
    url: `/ygt-user/tbTagDiseaseDept/getTagDiseases`,
    params,
  })
// 查询机构下的科室与用户接口
export const getDeptAndDocInfo = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowPlan/getDeptAndDocInfo`,
    params,
  })
  