import http from "../../index";

// 纳入管理查询
export const onQueryJoinDetail = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbJoinDetail/onQueryJoinDetail`,
    data,
  });

// 纳入 joinDetailIds(array) joinFlg(Y/N) reason(原因)
export const onJoin = (data) =>
  http.post({
    url: `/ygt-richdiseases/tbMbJoinDetail/onJoin`,
    data,
  });

// 申请下拉框
export const onQueryOrgs = () =>
  http.get({
    url: `/ygt-richdiseases/tbMbSysOrg/onQueryOrgs`,
    params: {
      orgType: "_DEPT_",
    },
  });
