import http from '../index.js'

/* 应用管理 */
// 获取应用列表
export const getApplicationList = (params) =>
  http.get({
    url: '/ygt-user/application/list',
    params,
  })
// 获取基本信息
export const getApplicationInfo = (params) =>
  http.get({
    url: '/ygt-user/application/getInfo',
    params,
  })
// 应用新增
export const addApplication = (data) =>
  http.post({
    url: '/ygt-user/application/add',
    data,
  })
// 应用修改
export const updateApplication = (data) =>
  http.post({
    url: '/ygt-user/application/update',
    data,
  })
// 应用删除
export const deleteApplication = (data) =>
  http.post({
    url: '/ygt-user/application/delete',
    data,
  })

/* 组织管理 */
// 获取树
export const getGroupTree = (params) =>
  http.get({
    url: '/ygt-user/org/getChildNodes',
    params,
  })
// 获取基本信息
export const getGroupInfo = (params) =>
  http.get({
    url: '/ygt-user/org/getNodeInfo',
    params,
  })
// 新增
export const addGroup = (data) =>
  http.post({
    url: '/ygt-user/org/add',
    data,
  })
// 编辑
export const updateGroup = (data) =>
  http.post({
    url: '/ygt-user/org/update',
    data,
  })
// 删除
export const deleteGroup = (data) =>
  http.post({
    url: '/ygt-user/org/delete',
    data,
  })

/* 菜单管理 */
// 获取菜单列表
export const getMenuList = (params) =>
  http.get({
    url: '/ygt-user/menu/getChildNodes',
    params,
  })
// 获取基本信息
export const getMenuInfo = (params) =>
  http.get({
    url: '/ygt-user/menu/getNodeInfo',
    params,
  })
// 新增
export const addMenu = (data) =>
  http.post({
    url: '/ygt-user/menu/add',
    data,
  })
// 编辑
export const updateMenu = (data) =>
  http.post({
    url: '/ygt-user/menu/update',
    data,
  })
// 删除
export const deleteMenu = (data) =>
  http.post({
    url: '/ygt-user/menu/delete',
    data,
  })

/* 权限管理 */
// 获取角色列表
export const getRoleList = (params) =>
  http.get({
    url: '/ygt-user/role/list',
    params,
  })
// 获取角色基本信息
export const getRoleInfo = (params) =>
  http.get({
    url: '/ygt-user/role/getInfo',
    params,
  })
// 获取角色菜单权限
export const getRoleMenuData = (params) =>
  http.get({
    url: '/ygt-user/application/getChildNodes',
    params,
  })
// 角色新增
export const addRole = (data) =>
  http.post({
    url: '/ygt-user/role/add',
    data,
  })
// 角色修改
export const updateRole = (data) =>
  http.post({
    url: '/ygt-user/role/update',
    data,
  })
// 角色删除
export const deleteRole = (data) =>
  http.post({
    url: '/ygt-user/role/delete',
    data,
  })
// 菜单权限-开启
export const openRoleMenu = (data) =>
  http.post({
    url: '/ygt-user/role/enableMenu',
    data,
  })
// 菜单权限-关闭
export const closeRoleMenu = (data) =>
  http.post({
    url: '/ygt-user/role/disableMenu',
    data,
  })

/* 用户管理 */
// 获取用户列表
export const getUserList = (data) =>
  http.post({
    url: '/ygt-user/user/queryUserInfo',
    data,
  })
// 获取证件类型下拉选项
export const getCertificateTypes = () =>
  http.get({
    url: '/ygt-user/user/getCertificateTypes',
  })
// 获取组织名称下拉选项
export const getOrgNames = () =>
  http.get({
    url: '/ygt-user/org/getOrgNames',
  })
// 获取密码正则
export const getPasswordReg = () =>
  http.get({
    url: '/ygt-user/user/getPasswordRegex',
  })
// 用户新增
export const addUser = (data) =>
  http.post({
    url: '/ygt-user/user/register',
    data,
  })
// 用户修改
export const updateUser = (data) =>
  http.post({
    url: '/ygt-user/user/updateUserInfo',
    data,
  })
// 用户删除
export const deleteUser = (data) =>
  http.post({
    url: '/ygt-user/user/delUser',
    data,
  })
// 修改用户状态
export const changeUserStatus = (data) =>
  http.post({
    url: '/ygt-user/user/updateStatus',
    data,
  })

// 保存角色(平台创建-root)
// 入参
// {
// 	id：角色id
//   	name ：角色名称
//   	authId ：数据权限   3fad093759674f539d5910a29b45ae4c：集团    12e1c7ef650f44ae9ca08fe17ea81c7f：机构
//   	description ：定义
//   	status ：状态
// }
export const onSaveRoleRoot = (data) =>
  http.post({
    url: '/ygt-user/role3/onSaveRoleRoot',
    data,
  })

// 查询角色(角色管理界面)
// {
// 	name：角色名称/角色id
//   	authId：数据权限
//   	status：状态
//   	authorizeStatus：菜单授权
//   	createDateS：添加开始日期
//   	createDateE：添加结束日期
//   	pageNum：页码
//   	pageSize：每页条数
// }
export const onQueryRoles = (data) =>
  http.post({
    url: '/ygt-user/role3/onQueryRoles',
    data,
  })
