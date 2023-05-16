import http from '../index'

// 字典数据
export const getDictionary = (params) =>
  http.get({
    url: '/ygt-user/tbDictionaryGroup/getDictionary',
    params,
  })

export const getOrgTree = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgTree',
    params,
  })

export const saveOrg = (data) =>
  http.post({
    url: '/ygt-user/org/onSaveOrg',
    data,
  })

//患者中心列表
// POST
// 入参
// {
// 	"patName":患者姓名
// 	"modDateS":更新开始时间
// 	"modDateE":更新结束时间
// 	"dataSource":患者来源
// 	"optUserId":操作人
// 	"createDateS":创建开始时间
// 	"createDateE":创建结束时间
// 	"hasReferral":是否有进行中的转诊
// 	"hosId":
// 	"pageNum":页数
// 	"pageSize":每页条数
// }

export const onQueryPatients = (data) =>
  http.post({
    url: '/ygt-referral/tbRPatient/onQueryPatients',
    data,
  })

// 转诊申请新增/修改
// POST
// 入参
// "patId": 患者id
// "patName":患者姓名
// "idNo":身份证号
// "sex":性别
// "phoneNo":手机号
// "medicareType":医保类型
// "address":联系地址
// "address1":详细地址
// "referralId":转诊申请单ID
// "referralType":转诊类型
// "applyDate":申请转诊日期
// "outHosId":转出机构
// "outDeptId":转出科室
// "applyDrId":转诊医生
// "referralGoal":转诊目标
// "hpi":现病史
// "pastHistory":既往史
// "curePlan":治疗方案
// "referralRecord":转诊记录
// "inHosId":转入机构
// "inDeptId":转入科室
// "receiveDrId":接诊医生
// "caseNo":门诊/住院号
// "status":0-暂存，1-提交
export const onSaveReferral = (data) =>
  http.post({
    url: '/ygt-referral/tbRApplyRecord/onSaveReferral',
    data,
  })

// 患者中心下拉框
//   GET
// 回参
// diagnoses：诊断
// nearOptUser：最近一次操作人
// createUser：创建人
export const onInitPatQueryParam = (params) =>
  http.get({
    url: '/ygt-referral/tbRApplyRecord/onInitPatQueryParam',
    params,
  })

// 查询科室医生(接诊医生)
// GET
// deptId
export const getDeptDoctorOptions = (params) =>
  http.get({
    url: '/ygt-user/user/getReceiveDoctorOptions',
    params,
  })
export const getReceiveDoctorOptions = (params) =>
  http.get({
    url: '/ygt-user/user/getReceiveDoctorOptions',
    params,
  })

// 新疆联系地址
// /ygt-referral/tbRegion/getRegions?regionCode=650000
// GET
export const getRegions = (params) =>
  http.get({
    url: '/ygt-referral/tbRegion/getRegions',
    params,
  })

//转诊记录
export const getReferralRecordInfo = (data) =>
  http.post({
    url: '/ygt-referral/tbRApplyRecord/getReferralRecordInfo',
    data,
  })

// 申请单回显
export const getReferralInfoById = (params) =>
  http.get({
    url: '/ygt-referral/tbRApplyRecord/getReferralInfoById',
    params,
  })

//   转诊医院查询接口
// GET
// orgId：当前登录用户所在集团id
// hosId：当前登录用户所在医院id
export const getReferralHosOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getReferralHosOptions',
    params,
  })

// 查询病情记录
export const getIllnessState = (params) =>
  http.get({
    url: '/ygt-referral/tbRIllnessState/getIllnessState',
    params,
  })

// 新增/修改病情记录
export const onSaveIllnessState = (data) =>
  http.post({
    url: '/ygt-referral/tbRIllnessState/onSaveIllnessState',
    data,
  })

// 查询诊断/手术下拉框
// type：类型：A-诊断，B-手术
export const getIcdDic = (params) =>
  http.get({
    url: '/ygt-referral/tbIcdDictionary/getIcdDic',
    params,
  })

// 身份证号重复校验
export const onCheckIdNo = (params) =>
  http.get({
    url: '/ygt-referral/tbRPatient/onCheckIdNo',
    params,
  })
// 入参
// idNo:身份证号
// 回参
// {
// 	flg：true/false（true：需要弹窗，false：不需要弹窗）
//   	warnType：A-该患者已有在转/关闭申请，不可再次提交转诊申请。
//   			  B-该患者身份证号已建档，是否同步患者数据？
//   	patName：患者姓名
//   	idNo：身份证号
//   	sex：性别
//   	phoneNo：手机号
//   	medicareType：医保类型
//   	address：联系地址下拉选
//   	address1：详细地址
// }

// 取消转诊申请
// referralId
export const onCancelReferral = (params) =>
  http.get({
    url: '/ygt-referral/tbRApplyRecord/onCancelReferral',
    params,
  })

// 获取机构/科室下拉选(转诊申请)
// GET
// parentId：父id，非必填(填写时查询科室级联数据，不填时查询机构数据)
// deptType：科室类型，父id填写时需填写
// status：状态，转诊申请编辑时传Y

export const getOrgOrHosOptionsForApply = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgOrHosOptionsForApply',
    params,
  })
