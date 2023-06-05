import http from '../../index'
let commonUrl1 = "/ygt-user";
let commonUrl2 = "/ygt-api";
// 登录
export const userLogin = (data) =>
  http.post({
    url: `${commonUrl1}/user/login`,
    data,
  });

// 获取token
export const getToken = (data) =>
  http.post({
    url: `${commonUrl2}/general/getToken`,
    data,
  });

// 用户登出
export const userLogout = data => http.post({
  url: `${commonUrl1}/user/logout`,
  data
});

// 单点登录接口
export const getCurrentUser = () =>
  http.get({
    url: `/ips/admin/web/getCurrentUser`,
    withCredentials: true
  });

export const beforeFact = (params) =>
  http.get({
    url: `/ips/admin/web/beforeFact`,
    params,
    withCredentials: true
  });