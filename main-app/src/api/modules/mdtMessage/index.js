import http from "../../index";
const commonUrl = "/ygt-mdt";

// MDT右上角消息列表
export const getMdtSysMessageInfoList = (params) =>
  http.post({
    url: `${commonUrl}/tbMdtSysMessageInfo/getMdtSysMessageInfoList`,
    params,
  });