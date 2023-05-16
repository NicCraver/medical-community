import http from '../../index'

// 纳入管理查询
export const onSaveTemplate = (data) =>
  http.post({
    url: `/ygt-followup/tbFollowTemplate/onSaveTemplate`,
    data,
  })

// 查看模板
export const onQueryTemplateById = (data) =>
  http.post({
    url: `/ygt-followup/tbFollowTemplate/onQueryTemplateById`,
    data,
  })

// 模板列表
// private String id;

// 	/**
// 	 * 模板名称
// 	 */
// 	private String templateDesc;

// 	/**
// 	 * 模板内容
// 	 */
// 	private JSONObject templateData;

// 	private String deleteStatus;

// 	private Integer pageNum;

// 	private Integer pageSize;
export const onQueryTemplates = (data) =>
  http.post({
    url: `/ygt-followup/tbFollowTemplate/onQueryTemplates`,
    data,
  })

// 保存组件
// private String id;

// 	private String comName;

// 	private String category;

// 	private String classificationId;

// 	private JSONArray list;

// 	private String type;
export const onSaveComponent = (data) =>
  http.post({
    url: `/ygt-followup/tbFollowComponent/onSaveComponent`,
    data,
  })
// 查询业务组件
export const onQueryComponent = (data) =>
  http.post({
    url: `/ygt-followup/tbFollowComponent/onQueryComponent`,
    data,
  })

export const onQueryComponentById = (params) =>
  http.get({
    url: `/ygt-followup/tbFollowComponent/onQueryComponentById`,
    params,
  })

export const onChangeTemplateStatus = (params) =>
  http.get({
    url: `/ygt-followup/tbFollowTemplate/onChangeTemplateStatus`,
    params,
  })
