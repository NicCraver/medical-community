import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('./views/HomePageOverview/HomePageOverview.vue'),
  },
  {
    // 首页概览
    path: '/homePageOverview',
    name: 'HomePageOverview',
    component: () => import('./views/HomePageOverview/HomePageOverview.vue'),
  },
  {
    // 审核纳入
    path: '/reviewInclusion',
    name: 'ReviewInclusion',
    component: () => import('./views/IncludeManage/ReviewInclusion/index.vue'),
  },
  {
    // 暂不管理
    path: '/notManage',
    name: 'NotManage',
    component: () => import('./views/IncludeManage/NotManage/NotManage.vue'),
  },
  // 批量不管理
  {
    path: '/batchNotManage',
    name: 'BatchNotManage',
    component: () => import('./views/IncludeManage/ReviewInclusion/BatchNotManage'),
  },
  // 批量纳入失败
  {
    path: '/bulkInclusionWarning',
    name: 'BulkInclusionWarning',
    component: () => import('./views/IncludeManage/ReviewInclusion/BulkInclusionWarning'),
  },
  // 患者中心
  {
    path: '/patientCenter',
    name: 'PatientCenter',
    component: () => import('./views/PatientCenter/PatientCenter'),
  },
  // 完善基本档案
  {
    path: '/patientCenter/patientArchives',
    name: 'PatientArchives',
    redirect: '/patientCenter/patientArchives/basicArchives',
    component: () => import('./views/PatientCenter/PatientArchives'),
    children: [
      {
        // 慢病基本档案
        path: 'basicArchives',
        name: 'BasicArchives',
        redirect: '/patientCenter/patientArchives/basicArchives/fullInformation',
        component: () => import('./views/PatientCenter/BasicArchives/index.vue'),
        children: [
          {
            // 全量信息
            path: 'fullInformation',
            name: 'FullInformation',
            component: () => import('./views/PatientCenter/BasicArchives/FullInformation'),
          },
          {
            // 患者提交
            path: 'patientSubmission',
            name: 'PatientSubmission',
            component: () => import('./views/PatientCenter/BasicArchives/PatientSubmission'),
          },
        ],
      },
      {
        // 随访记录
        path: 'followUpRecords',
        name: 'FollowUpRecords',
        component: () => import('./views/PatientCenter/FollowUpRecords'),
      },
      {
        // 患者指标分析
        path: 'indicatorAnaysis',
        name: 'IndicatorAnaysis',
        component: () => import('./views/PatientCenter/IndicatorAnaysis'),
      },
    ]
  },
  // 数据维护
  {
    path: '/dataMaintenance',
    name: 'DataMaintenance',
    component: () => import('./views/DataMaintenance/DataMaintenance.vue'),
  },
  // 批量推送
  {
    path: '/bulkPush',
    name: 'BulkPush',
    component: () => import('./views/BulkPush/BulkPush.vue'),
  },
  // 方案中心 - 模板广场
  {
    path: '/solutionCenter/templateSquare',
    name: 'SolutionCenter',
    redirect: '/solutionCenter/templateSquare/innerTemplate',
    component: () => import('./views/SolutionCenter/TemplateSquare'),
    children: [
      {
        // 院内模板
        path: 'innerTemplate',
        name: 'InnerTemplate',
        component: () => import('./views/SolutionCenter/TemplateSquare/InnerTemplate'),
      },
      {
        // 草稿栏
        path: 'draftColumn',
        name: 'DraftColumn',
        component: () => import('./views/SolutionCenter/TemplateSquare/DraftColumn'),
      },
      {
        // 平台模版
        path: 'platformTemplate',
        name: 'PlatformTemplate',
        component: () => import('./views/SolutionCenter/TemplateSquare/PlatformTemplate'),
      },
      {
        // 方案新增
        path: 'addPlan',
        name: 'AddPlan',
        component: () => import('./views/SolutionCenter/TemplateSquare/Plan/AddPlan'),
      },
      {
        // 方案编辑
        path: 'editPlan',
        name: 'EditPlan',
        component: () => import('./views/SolutionCenter/TemplateSquare/Plan/EditPlan'),
      },
      {
        // 方案预览
        path: 'schemePreview',
        name: 'SchemePreview',
        component: () => import('./views/SolutionCenter/TemplateSquare/Plan/SchemePreview'),
      }
    ],
  },
]

export default routes
