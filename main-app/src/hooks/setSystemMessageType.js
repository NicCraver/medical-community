// 设置系统消息类型
export const setSystemMessageType = (menus) => {
  console.log(`menus`, menus)
  let names = [...new Set(menus.map((el) => el.name))]
  console.log(`names`, names)
  // 转诊、活动  ws
  //  登录消息
  // 慢病
  // 转诊

  // 活动
  // 会诊
  const map = {}
}
