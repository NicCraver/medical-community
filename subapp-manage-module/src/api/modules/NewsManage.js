import http from '../index.js'
// 中部消息提示
export const followUpAlerts = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/followUpAlerts`,
    params,
  })

// 右上角消息提示
export const followUpAlertsList = (params) =>
  http.get({
    url: `/ygt-followup/tbMbFollowup/followUpAlertsList`,
    params,
  })
// 查询新闻列表
// /ygt-news/tbNewsList/onQueryNewsList
// POST
// 入参
// newsName : 标题
// classifyId : 类型
// status : 状态 : 0-关闭，1-开启
// createDateS : 创建开始时间
// createDateE : 创建结束时间
// isPublish : 0-暂存， 1-已发布
// pageNum : 页码
// pageSize : 每页条数
// 回参
// nlId : 主键
// newsName : 标题
// writerId : 作者id
// writerName : 作者姓名
// publishDate : 发布时间
// createDate : 创建日期
// classifyId : 类型id
// classifyDesc : 类型名称
// publishLimit : 发布范围 : 0-全平台，1-指定接收人
// publishLimitDesc : 发布范围名称
// closeTime : 关闭时间
// status : 状态 : 0-关闭，1-开启
export const onQueryNewsList = (data) =>
  http.post({
    url: `/ygt-news/tbNewsList/onQueryNewsList`,
    data,
  })

//   保存新闻
// /ygt-news/tbNewsList/onSaveNews
// POST
// 入参
// nlId : 主键
// newsAlias: 简介
// newsName : 标题
// isPublish : 是否发布:0-不发布(暂存)， 1-发布
// publishDate : 资讯发布时间
// newsContent : 内容
// closeType : 关闭类型 : 0-永久，1-自定义
// closeTime : 关闭时间
// classifyId : 类型
// publishLimit : 发布范围 : 0-全平台，1-部分用户
// roleId : 角色id
// userLimit : 用户限制 : 0-全部用户，1-指定用户
// userIds : [] 用户id

export const onSaveNews = (data) =>
  http.post({
    url: `/ygt-news/tbNewsList/onSaveNews`,
    data,
  })

// 类型下拉
// tbDictionaryDetail/getDictionarys
// groupId 67cc917a8e44482cb30a6f34636cedeb
// [key,groupId]
// post
export const getDictionarys = (data) =>
  http.post({
    url: `/ygt-user/tbDictionaryDetail/getDictionarys`,
    data,
  })

// 查询用户(质量控制中心使用) 穿梭框
// /ygt-user/user/getUsersForQcNews
// GET

export const getUsersForQcNews = (params) =>
  http.get({
    url: `/ygt-user/user/getUsersForQcNews`,
    params,
  })

export const uploadFiles = (data) =>
  http.post({
    url: '/ygt-user/tbFilePath/uploadFiles',
    data,
  })


// 查询健康资讯详细信息
export const getNewsDetailForQc = (params) =>
  http.get({
    url: `/ygt-news/tbNewsDetail/getNewsDetailForQc`,
    params,
  })

// 关闭新闻
export const onCloseNews = (data) =>
  http.post({
    url: '/ygt-news/tbNewsList/onCloseNews',
    data,
  })

// 开启新闻
export const onOpenNews = (data) =>
  http.post({
    url: '/ygt-news/tbNewsList/onOpenNews',
    data,
  })

// 删除新闻
export const onDelNews = (data) =>
  http.post({
    url: '/ygt-news/tbNewsList/onDelNews',
    data,
  })

// 复制新闻
export const onCopyNews = (data) =>
  http.post({
    url: '/ygt-news/tbNewsList/onCopyNews',
    data,
  })

