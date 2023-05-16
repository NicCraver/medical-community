import http from "../../index";

// 登录
export const userLogin = (data) =>
  http.post({
    url: `/ygt-user/user/login`,
    data,
  });

// 获取token
export const getToken = (data) =>
  http.post({
    url: `/ygt-api/general/getToken`,
    data,
  });
