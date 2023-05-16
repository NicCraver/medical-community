import http from '../../index'

export const onCreateUserFromPat = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbPatient/onCreateUserFromPat`,
    params,
  })
