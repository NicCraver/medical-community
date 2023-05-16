import http from '../index.js'

export const get = (params) =>
  http.get({
    url: ``,
    params,
  })

export const post = (data) =>
  http.post({
    url: ``,
    data,
  })
export const addLoginMenu = (data) =>
  http.post({
    url: `/ygt-user/tbMhLoginMenu/addLoginMenu`,
    data,
  })
export const getLoginMenuData = (params) =>
  http.get({
    url: `/ygt-user/tbMhLoginMenu/getLoginMenuData`,
    params,
  })
export const updateLoginMenu = (data) =>
  http.post({
    url: `/ygt-user/tbMhLoginMenu/updateLoginMenu`,
    data,
  })
