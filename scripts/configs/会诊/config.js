/*
 * @Author: Nic
 * @Date: 2022-11-24 13:47:12
 * @LastEditTime: 2023-03-29 10:45:30
 * @LastEditors: Nic
 * @Description: 配置文件 如果有window.env有参数则会加载window.env配置信息
 * @FilePath: /configs/会诊/config.js
 * 
 * @param: VUE_APP_BROWSER_TITLE
 * @Description: 项目名称 用于 main-app/src/views/login/hooks/index.js 
 * 这个文件中配置系统名称、logo、登录消息、实时消息等
 * 齐齐哈尔 慢病管理平台 多学科会诊平台 双向转诊平台 服务资源管理 黑龙江电子病历 阿克苏 后台管理 '鹰眼观谱科技-慢病管理平台' '鹰眼观谱科技-多学科会诊平台' '鹰眼观谱科技-双向转诊平台' 
 * 
 * @param: VUE_APP_BUILD_ENV
 * @Description 后台管理环境 参数为 backstage 其他项目不填即可
 * 
 * @param: VUE_APP_BASE_API
 * @Description baseApi 所有接口请求地址
 * 
 * @param: VUE_APP_WS_BASE_URL
 * @Description 主应用 websocket
 * 
 * mdt配置
 * @param: VUE_APP_VIDEO_BASE_URL
 * @Description video api
 * 
 * @param: VUE_APP_WS_MDT_BASE_URL
 * @Description mdt websocket api
 * 
 * @param: VUE_APP_DICOM_MDT_URL
 * @Description dicom预览
 * 
 * 慢病配置
 * @param: VUE_APP_HOSPITAL
 * @Description 只用于慢病 其他项目可以不填 参数可以填 '齐齐哈尔' || '环湖' 
 * 用于 subapp-chronic-disease/src/utils/ColumnMap.js
 * 这个文件中配置 表格渲染默认字段
 * 
 * @param: VUE_APP_ENVIRONMENT
 * @Description 只用于数据资源管理
 * 参数 product || akesu || heilongjiang
 * 
 * @param: VUE_APP_ISHEILONGJIANG
 * @Description 是否是数据资源管理 黑龙江环境 黑龙江电子病历
 * 参数 true || 不添加次参数
 * 
 */

window.env = {
    VUE_APP_BROWSER_TITLE: '多学科会诊平台',
    VUE_APP_API: '/api',
    VUE_APP_FILE_API: '/api/file/',
    // 会诊
    VUE_APP_VIDEO_MDT_API: '/api/video',
    VUE_APP_DICOM_MDT_API: '/api/dicom',
    VUE_APP_PERMISSION: 2
}

