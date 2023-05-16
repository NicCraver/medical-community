//标准管理接口
import http from '../index'
// 获取组织机构列表
export const getOrgTree = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgTree',
    params,
  })

// 保存医院/机构
export const saveOrg = (data) =>
  http.post({
    url: '/ygt-user/org/onSaveOrg',
    data,
  })

// 上级机构级联
export const getOrgOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgOptions',
    params,
  })

// 机构删除
export const deleteOrg = (params) =>
  http.get({
    url: '/ygt-user/org/onDelOrg',
    params,
  })

// 获取机构/医院下拉框选项
export const getOrgOrHosOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgOrHosOptions',
    params,
  })

// 医院列表查询
export const getHospitalList = (data) =>
  http.post({
    url: '/ygt-user/org/onQueryHos',
    data,
  })

// 查询医院详细信息
export const getHospitalDetail = (params) =>
  http.get({
    url: '/ygt-user/tbMhOrgDetail/onQueryHosDetailById',
    params,
  })

// 上传图片
export const uploadFiles = (data) =>
  http.post({
    url: '/ygt-user/tbFilePath/uploadFiles',
    data,
  })

// 字典数据
export const getDictionary = (params) =>
  http.get({
    url: '/ygt-user/tbDictionaryGroup/getDictionary',
    params,
  })

// 医院信息保存
export const saveHospitalInfo = (data) =>
  http.post({
    url: '/ygt-user/tbMhOrgDetail/onSaveHosDetail',
    data,
  })

// 获取科室列表
export const getDepartmentList = (data) =>
  http.post({
    url: '/ygt-user/org/onQueryDept',
    data,
  })

// 科室停用/启用
export const onChangeOrgStatus = (params) =>
  http.get({
    url: '/ygt-user/org/onChangeOrgStatus',
    params,
  })

// 科室删除
export const delDept = (data) =>
  http.post({
    url: '/ygt-user/org/delete',
    data,
  })

// 获取带有权限的级联集团医院数据
export const getHosCascaderOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getHosCascaderOptions',
    params,
  })

// 科室批量删除
export const batchDelDept = (data) =>
  http.post({
    url: '/ygt-user/org/onBatchDeleteDepts',
    data,
  })

// 获取医院/机构列表
export const getHosOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getHosOptions',
    params,
  })

// 关联平台科室列表
export const getDeptDicOptions = (params) =>
  http.get({
    url: '/ygt-user/tbDictionaryGroup/getDeptDicOptions',
    params,
  })

// 关联平台科室级联查询
export const getDeptDicCascaderOptions = (data) =>
  http.post({
    url: '/ygt-user/tbDictionaryGroup/getDeptDicCascaderOptions',
    data,
  })

// 科室下拉框
export const getDeptOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getDeptOptions',
    params,
  })

// 获取科室详情
export const getDeptDetail = (params) =>
  http.get({
    url: '/ygt-user/tbMhOrgDetail/onQueryDeptDetailById',
    params,
  })

// 科室信息保存
export const saveDeptInfo = (data) =>
  http.post({
    url: '/ygt-user/tbMhOrgDetail/onSaveDeptDetail',
    data,
  })

// 获取科室树
export const getDeptTree = (params) =>
  http.get({
    url: '/ygt-user/org/getDeptTree',
    params,
  })

// 修改科室名称
export const updateDeptName = (params) =>
  http.get({
    url: '/ygt-user/org/onChangeOrgName',
    params,
  })

// 批量创建科室
export const batchAddDept = (data) =>
  http.post({
    url: '/ygt-user/org/onBatchSaveDepts',
    data,
  })

// 获取类型-职称拼接下拉
export const getTitleDownBox = (params) =>
  http.get({
    url: '/ygt-user/tbUserInfoDetail/getTitleDownBox',
    params,
  })

// 获取医生列表
export const getDoctorList = (data) =>
  http.post({
    url: '/ygt-user/tbUserInfoDetail/getMedicalPersonForPage',
    data,
  })

// 根据职称类型获取职称
export const getTitleInfoByCode = (params) =>
  http.get({
    url: '/ygt-user/tbDictionaryGroup/getTitleInfoByCode',
    params,
  })

// 新增医生基本信息
export const addMedicalPersonBasicInfo = (data) =>
  http.post({
    url: '/ygt-user/tbUserInfoDetail/addMedicalPersonBasicInfo',
    data,
  })

// 更新医生基本信息
export const updateMedicalPersonBasicInfo = (data) =>
  http.post({
    url: '/ygt-user/tbUserInfoDetail/updateMedicalPersonBasicInfo',
    data,
  })

// 获取医生详情
export const getDoctorDetailById = (params) =>
  http.get({
    url: '/ygt-user/tbUserInfoDetail/getMedicalPersonInfoById',
    params,
  })

// 修改医生资质信息
export const saveDoctorLicenceInfo = (data) =>
  http.post({
    url: '/ygt-user/tbUserInfoDetail/addOrUpdateMedicalPersonNEInfo',
    data,
  })

// 获取医生账户信息
export const getAccountManageById = (params) =>
  http.get({
    url: '/ygt-user/tbUserInfoDetail/getAccountManageById',
    params,
  })

// 更新医生排序
export const updateSerialNum = (data) =>
  http.post({
    url: '/ygt-user/tbUserInfoDetail/updateSerialNum',
    data,
  })

// 批量停用医生
export const batchStopDoctor = (data) =>
  http.post({
    url: '/ygt-user/tbUserInfoDetail/batchStop',
    data,
  })

// 删除医生
export const deleteDoctor = (data) =>
  http.post({
    url: '/ygt-user/tbUserInfoDetail/deleteMedicalPerson',
    data,
  })

// 用户管理
// 查询用户列表
// {
// 	"name":登录名/姓名,
//   	"status":状态,
//   	"createDateS":添加开始日期,
//   	"createDateE":添加结束日期,
//   	"pageNum":页数,
//   	"pageSize":每页条数
// }
export const onQueryAccountList = (data) =>
  http.post({
    url: '/ygt-user/user/onQueryAccountList',
    data,
  })
// 批量停用用户
// {
//   "userIds":[]勾选用户id
// }
export const onBatchStopAccounts = (data) =>
  http.post({
    url: '/ygt-user/user/onBatchStopAccounts',
    data,
  })

// 保存账号
// {
//   "id":用户id
//   "name":姓名
//   "loginName":登录名
//   "loginPwd":登录密码
//   "orgIds":
//   "sex":性别
//   "telephone":手机号码
//   "certificateType":证件类型
//   "certificateNum":证件号码
//   "email":邮箱
//   "status":状态
//   "roleIds":角色
//   "roleDescribe":备注
// }
export const onSaveUserAccount = (data) =>
  http.post({
    url: '/ygt-user/user/onSaveUserAccount',
    data,
  })

// 停用/启用
// {
//   "userId":用户id,
//    "status":用户状态，0-关闭，1-开启
//  }
export const updateStatus = (data) =>
  http.post({
    url: '/ygt-user/user/updateStatus',
    data,
  })

// 角色下拉框
// "orgIds":[]机构id
export const getRoleOptions = (data) =>
  http.post({
    url: '/ygt-user/role/getRoleOptions',
    data,
  })
// 返显用户
// "id":
export const getUserAccountMes = (params) =>
  http.get({
    url: '/ygt-user/user/getUserAccountMes',
    params,
  })

// 重置密码
// {
//   "id":用户ID
//   "loginPwd":新密码
// }
export const onResetPassword = (data) =>
  http.post({
    url: '/ygt-user/user/onResetPassword',
    data,
  })

// 角色列表
// POST
// {
//   name:角色名称/角色ID
//   roleLevelId:角色级别
//   status:状态
//   authorizeStatus:授权状态
//   createDateS:添加开始日期
//   createDateE:添加结束日期
//   pageNum:页数
//   pageSize:每页条数
// }
export const onQueryRole = (data) =>
  http.post({
    url: '/ygt-user/role/onQueryRole',
    data,
  })

//   角色级别下拉
// GET
export const getRoleLevels = (params) =>
  http.get({
    url: '/ygt-user/tbDictionaryGroup/getRoleLevels',
    params,
  })

//   角色下拉
export const getAllRoleOptions = (params) =>
  http.get({
    url: '/ygt-user/role/getAllRoleOptions',
    params,
  })

// 角色列表
// POST
// {
// 	"name":角色名称
// }
export const getRoleOptionsList = (data) =>
  http.post({
    url: '/ygt-user/role/getRoleOptions',
    data,
  })

// 点击角色获取菜单
// roleId=
// GET
export const getRoleMenus = (data) =>
  http.post({
    url: '/ygt-user/role3/getRoleMenusByRoleId',
    data,
  })

// 姓名下拉框
// orgIds
export const getDoctorOptions = (data) =>
  http.post({
    url: '/ygt-user/user/getDoctorOptions',
    data,
  })

// 用户机构下拉框
export const getOrgCascaderOptions = (params) =>
  http.get({
    url: '/ygt-user/org/getOrgCascaderOptions',
    params,
  })

// 保存角色菜单
// {
//   "roleId":角色ID
//   "menuIds":[]所选菜单ID
//   "authId":数据权限ID（3fad093759674f539d5910a29b45ae4c：集团   12e1c7ef650f44ae9ca08fe17ea81c7f：机构）
// }
export const onSaveRoleMenus = (data) =>
  http.post({
    url: '/ygt-user/role3/onSaveRoleMenus',
    data,
  })

// 查询应用菜单
// title:菜单名称(选填)
// appId:应用Id(必填)
export const getAllMenu = (params) =>
  http.get({
    url: '/ygt-user/menu/getAllMenu',
    params,
  })

// 保存菜单
// POST
// {
//   "id":
//   "parentId":
//   "name":
//   "path":
//   "title":
//   "icon":
//   "breadcrumb":
//   "lastNode":
//   "seq":
export const onSaveMenu = (data) =>
  http.post({
    url: '/ygt-user/menu/onSaveMenu',
    data,
  })
export const onDeleteMenu = (data) =>
  http.post({
    url: '/ygt-user/menu/delete',
    data,
  })

// 保存角色
// POST
// {
//   "id"：角色id(修改时使用)
//   "type"：类型：Q-系统引用角色，D-自定义角色
//   "name"：角色名称
//   "description"：定义
//   "status"：停用/启用状态：Y-启用/N-停用
//   "systemRoleIds:[] 角色级别ID
// }
export const onSaveRole = (data) =>
  http.post({
    url: '/ygt-user/role/onSaveRole',
    data,
  })

// 删除角色
export const deleteRole = (data) =>
  http.post({
    url: '/ygt-user/role/delete',
    data,
  })

// 停用角色
export const updateRoleStatus = (data) =>
  http.post({
    url: '/ygt-user/role/onChangeStatus',
    data,
  })

// 获取角色详细数据 id
export const getRoleDetailById = (params) =>
  http.get({
    url: '/ygt-user/role/getRoleDetailById',
    params,
  })

// 获取系统内置角色
export const getSysDefaultRole = (data) =>
  http.post({
    url: '/ygt-user/role/getSysDefaultRole',
    data,
  })

//   查询角色列表(角色授权界面)
// ?authId=&roleName=
// GET
// authId：3fad093759674f539d5910a29b45ae4c-集团，12e1c7ef650f44ae9ca08fe17ea81c7f-机构
// roleName：角色名称
export const onQueryRoleList = (data) =>
  http.post({
    url: '/ygt-user/role3/onQueryRoleList',
    data,
  })

// 获取角色(添加用户时选择组织)
// /ygt-user/role3/getRolesByOrgId?orgId=
// GET
export const getRolesByOrgId = (params) =>
  http.get({
    url: '/ygt-user/role3/getRolesByOrgId',
    params,
  })

export const onSaveUserForRoot = (data) =>
  http.post({
    url: '/ygt-user/role3/onSaveUserForRoot',
    data,
  })

// 查询用户信息列表(用户管理界面)
// POST
export const onQueryUserMes = (data) =>
  http.post({
    url: '/ygt-user/role3/onQueryUserMes',
    data,
  })
//   获取机构树(组织结构界面、用户管理界面)
// ?name=&status=
// GET
export const getOrgTreev3 = (params) =>
  http.get({
    url: '/ygt-user/role3/getOrgTree',
    params,
  })

export const onInitCreateRole = (params) =>
  http.get({
    url: '/ygt-user/role3/onInitCreateRole',
    params,
  })

// 保存角色(集团创建)
// POST
// {
//   id：
//   name： 角色名字
//   description： 定义
//   status： 状态
//   authId： 数据权限
//   isTemplate： 是否为模板
//   roleTemplateIds：[] 角色模板ids
//   orgLevel：[] 机构层级
// }
export const onSaveRoleOrg = (data) =>
  http.post({
    url: '/ygt-user/role3/onSaveRoleOrg',
    data,
  })
export const getOrgForCreateUser = (params) =>
  http.get({
    url: '/ygt-user/role3/getOrgForCreateUser',
    params,
  })

// 保存用户(集团、机构管理员)
export const onSaveUserForOrg = (data) =>
  http.post({
    url: '/ygt-user/role3/onSaveUserForOrg',
    data,
  })
// POST
// {
// 	id
// 	name  姓名
// 	loginName  登录名
// 	loginPwd  密码
// 	sex  性别
// 	birthday  出生日期
// 	telephone  电话号码
// 	certificateType  证件类型
// 	certificateNum  证件号
// 	email  邮箱
// 	status  状态
// 	orgRoles  [{orgId  机构id，roleId  角色id}]角色
// 	defaultRoleId  默认角色id
// }

export const getRoleTags = (params) =>
  http.get({
    url: '/ygt-user/tbSystemConfig/getRoleTags',
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

//校验集团内是否有重复手机号 GET
export const checkSamePhone = (params) =>
  http.get({
    url: '/ygt-user/user/checkSamePhone',
    params,
  })