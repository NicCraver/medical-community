/*
 * @Author: Nic
 * @Date: 2023-02-15 17:34:53
 * @LastEditTime: 2023-03-06 14:24:35
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/src/api/modules/login/index.js
 */
import http from '../../index'

// 登录
export const userLogin = (data) =>
  http.post({
    url: `/ygt-user/user/login`,
    data,
  })

// 获取token 
// get
// /ygt-user/auth/getToken
export const getToken = (params) =>
  http.get({
    url: `/ygt-user/auth/getToken`,
    params,
  })


// 获取菜单权限
// export const getLoginMenus = (params) =>
//   http.get({
//     url: `/ygt-user/role/getLoginMenus`,
//     params,
//   })

export const getLoginMenuById = (params) =>
  http.get({
    url: `/ygt-user/tbMhLoginMenu/getLoginMenuById`,
    params,
  })
// 获取组织角色下拉(登录界面)
// ?loginname=
// GET
// loginname：登录名
export const getLoginOrgRoles = (params) =>
  http.get({
    url: `/ygt-user/role3/getLoginOrgRoles`,
    params,
  })
// 获取登录菜单

export const getLoginMenus = (data) =>
  http.post({
    url: `/ygt-user/role3/getLoginMenus`,
    data,
  })
// POST
// {
// 	appIds：[]应用id
// 	userRoleRefId：用户绑定角色id(登录时选择的)
// }

// 黑龙江单点登录接口
export const getCurrentUser = () =>
  http.get({
    url: `${process.env.VUE_APP_SINGLE_API}/ips/admin/web/getCurrentUser`,
    withCredentials: true,
  })

// export const beforeFact = (params) =>
//   http.get({
//     url: `${process.env.VUE_APP_SINGLE_API}/ips/admin/web/beforeFact`,
//     params,
//     withCredentials: true,
//   })

// POST /ygt-user/user/generateKey
// BODY {"id":xxxx}
// 生成用户私钥
export const generateKey = (data) =>
  http.post({
    url: `/ygt-user/user/generateKey`,
    data,
  })