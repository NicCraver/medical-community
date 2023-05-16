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
