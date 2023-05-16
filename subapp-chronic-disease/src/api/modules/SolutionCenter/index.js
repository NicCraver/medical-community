/*
 * @Author: Nic
 * @Date: 2023-02-07 16:42:09
 * @LastEditTime: 2023-02-24 10:38:30
 * @LastEditors: Nic
 * @Description: SolutionCenter 方案中心接口
 * @FilePath: /medical-community/subapp-chronic-disease/src/api/modules/SolutionCenter/index.js
 */
import http from '../../index'

// get
export const onCreateUserFromPat = (params) =>
  http.get({
    url: `/ygt-dis-manage/tbMbPatient/onCreateUserFromPat`,
    params,
  })

// post
export const submitPatientRecord = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbPatient/saveData`,
    data,
  })

// 获取弹窗数据
// 新增疾病分期 传parentId = 1
export const getPageConfig = (params) =>
  http.get({
    url: `/ygt-dis-manage/tbMbJmPageConfig/getPageConfig`,
    params,
  })

//新建分期保存
export const newlyBuiltStaging = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmDiseasePer/newlyBuiltStaging`,
    data,
  })

//复制分期保存
export const copyDiseasePer = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmDiseasePer/copyDiseasePer`,
    data,
  })

//查询疾病分期tab列表
export const getDiseasePerByPlanId = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmDiseasePer/getDiseasePerByPlanId`,
    data,
  })

//删除疾病分期tab页
export const deleteDiseasePer = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmDiseasePer/deleteDiseasePer`,
    data,
  })

// 查询运算符
export const getOperators = (params) =>
  http.get({
    url: `/ygt-user/tbDictionaryDetail/getOperators`,
    params,
  })

// 保存方案基本信息
// 入参
// id :主键
// name 
// tagDiseaseDeptId :适配病种
// cycleNum :周期数量
// cycleUnitId :周期单位
// status :状态 :0-开启，1-关闭
// description :方案简述
// draftFlg :是否为草稿 :0-否，1-是
export const onSaveJmPlan = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmPlan/onSaveJmPlan`,
    data,
  })


// 查询方案
// id
export const onQueryJmPlanById = (params) =>
  http.get({
    url: `/ygt-dis-manage/tbMbJmPlan/onQueryJmPlanById`,
    params,
  })


//方案发布 + 保存返回  
export const saveDiseasePer = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmDiseasePer/saveDiseasePer`,
    data
  })

// 查询病种
export const getTagDiseases = (params) =>
  http.get({
    url: `/ygt-user/tbTagDiseaseDept/getTagDiseases`,
    params,
  })

// 方案中心查询方案
// 入参
// name :方案集，子方案名称
// tagDiseaseDeptId :病种
// serType :0 - 操作人，1 - 创建人
// userId :操作人员
// dateType :0 - 操作时间，1 - 创建时间
// startDate :开始时间
// endDate :结束时间
// planType :模板类型 :0 - 平台模板，1 - 院内模板，2 - 草稿栏
// pageNum :当前页码
// pageSize :每页数量

// 回参
// id :主键
// name :方案集名称
// tagDiseaseDeptId :适配病种，TB_TAG_DISEASE_DEPT表id
// tagDiseaseDesc :病种名称
// status :状态 :0 - 开启，1 - 关闭
// versionNo :版本号
// createUserId :创建人
// createUserName :创建人姓名
// userTot :使用次数（被引用次数）
// diseasePerNames :[]疾病分期名称
// newFlgType :角标类型 :0 - 无，1 - NEW，2 - 更新
// quoteBtn :引用按钮，true / false
// quoteAgainBtn :再次引用按钮，true / false
// createDraftBtn :创建草稿按钮，true / false
// startData  院内-启用
// stopData  院内-停用
// draftData  草稿
// rootData  平台
// draftQty  草稿数量
// rootQty  平台数量
// hosQty  院内数量
export const onQueryJmPlans = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmPlan/onQueryJmPlans`,
    data,
  })


//病例信息 添加疾病诊断
export const getIcdTypeForOrderBy = (urlRequest, data) =>
  http.post({
    //url: `${urlRequest}`,
    url:`/ygt-user/tbIcdDictionary/getIcdDicAndShowSelectForJm`,
    data
  })

// 方案引用/创建草稿
// id 方案id
// quoteType 引用类型 0-引用，1-创建草稿
//方案引用/创建草稿
export const onQuoteJmPlan = (params) =>
  http.get({
    url: `/ygt-dis-manage/tbMbJmPlan/onQuoteJmPlan`,
    params
  })

export const postOtherTypeForOrderBy = (urlRequest, data) =>
  http.post({
    url: `${urlRequest}`,
    data
  })

// 开启 停用 ?id
export const onChangeJmPlanStatusById = (params) =>
  http.get({
    url: `/ygt-dis-manage/tbMbJmPlan/onChangeJmPlanStatusById`,
    params
  })

// 获取创建人
export const getCreateUserOptions = (params) =>
  http.get({
    url: `/ygt-dis-manage/tbMbJmPlan/getCreateUserOptions`,
    params
  })

// 删除方案
// id 
export const onDelJmPlanById = (params) =>
  http.get({
    url: `/ygt-dis-manage/tbMbJmPlan/onDelJmPlanById`,
    params
  }) 


//方案配置
//新增子方案时 获取内容配置项
export const getConfigInfo = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmItemConfig/getConfigInfo`,
    data
  })

//添加检验检查 查询检验项目
export const getItemInfo = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmItemConfig/getItemInfo`,
    data
  })

//保存子方案信息（草稿 发布）
export const saveSubScheme = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmSubscheme/saveSubScheme`,
    data
  })

//获取子方案tab列表
export const getSubSchemeByPlanId = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmSubscheme/getSubSchemeByPlanId`,
    data
  })

//复制子方案
export const copyScheme = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmSubscheme/copyScheme`,
    data
  })

//删除子方案
export const deleteScheme = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmSubscheme/deleteScheme`,
    data
  })

//查询方案名称是否重复
export const subSchemeNameNotRepeat = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmSubscheme/subSchemeNameNotRepeat`,
    data
  })

//查询疾病分期名称是否重复
export const perNameNotRepeat = (data) =>
  http.post({
    url: `/ygt-dis-manage/tbMbJmDiseasePer/perNameNotRepeat`,
    data
  })





  
  
