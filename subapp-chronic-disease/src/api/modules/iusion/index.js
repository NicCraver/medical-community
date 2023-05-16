/*
 * @Author: Nic
 * @Date: 2022-12-08 10:04:18
 * @LastEditTime: 2023-03-13 15:31:49
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/api/modules/iusion/index.js
 */
import http from '../../index'

// 纳入管理查询
export const onQueryJoinDetail = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbJoinDetail/onQueryJoinDetail`,
    data,
  })

// 纳入 joinDetailIds(array) joinFlg(Y/N) reason(原因)
export const onJoin = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbJoinDetail/onJoin`,
    data,
  })

// 导入文件
export const onImportPatBaseExcelData = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbJoinDetail/onImportPatBaseExcelData`,
    data,
  })

// 申请下拉框
export const onQueryOrgs = () =>
  http.get({
    url: `/ygt-richdiseases/tbMbSysOrg/onQueryOrgs`,
    params: {
      orgType: '_DEPT_',
    },
  })
// 申请科室下拉框
export const onQueryApplyDepts = (params) =>
  http.get({
    url: `/ygt-richdiseases/tbMbJoinDetail/onQueryApplyDepts`,
    params,
  })
// 申请下拉框
export const onQueryDictionaryData = () =>
  http.get({
    url: `/ygt-richdiseases/tbSysDictionary/onQueryDictionaryData`,
    params: {
      dicGroup: 'EXCEL_TEMPLATE',
      dicId: 'DOWNLOAD_PATH',
    },
  })
// 批量下载 下拉框
export const getExcelConfigForLoginUser = (params) =>
  http.get({
    url: `/ygt-user/tbOrgConfig/getExcelConfigForLoginUser`,
    params,
  })

// get /ygt-user/tbOrgConfig/getExcelConfigForLoginUser
export const getExcelConfigForLoginUserNew = (params) =>
  http.get({
    url: `/ygt-user/tbOrgConfig/getExcelConfigForLoginUser`,
    params,
  })

