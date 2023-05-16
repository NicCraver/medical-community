import http from '../index'

// get
export const get = (params) =>
  http.get({
    url: '/ygt-user/get',
    params,
  })

// post
export const post = (data) =>
  http.post({
    url: '/ygt-user/post',
    data,
  })
