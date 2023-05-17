/* 
  @description 登录
  @date 
*/
import http from '../index'

// 用户登录
export const userLogin = data => http.post({
  url: '/ygt-user/user/login',
  data
});

// 获取token
export const getToken = data => http.post({
  url: '/ygt-api/general/getToken',
  data
});

// 用户登出
export const userLogout = data => http.post({
  url: '/ygt-user/user/logout',
  data
});

// 获取菜单权限
export const getLoginMenus = (params) =>
  http.get({
    url: `/ygt-user/role/getLoginMenus`,
    params,
  });
