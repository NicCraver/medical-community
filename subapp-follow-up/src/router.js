import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject){
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/fuPatientCenter',
  },
  // 患者中心
  {
    path: '/fuPatientCenter',
    name: 'PatientCenter',
    component: () => import('./views/FollowUpManagement/PatientCenter/PatientCenter'),
  },
  {
    path: '/PersonFollowUpList',
    name: 'PersonFollowUpList',
    component: () => import('./views/FollowUpManagement/PersonFollowUpList/PersonFollowUpList'),
  },
  // 随访列表
  {
    path: '/FollowUpList',
    name: 'FollowUpList',
    component: () => import('./views/FollowUpManagement/FollowUpList/FollowUpList'),
  },

  // 制定计划
  {
    path: '/MakePlan',
    name: 'MakePlan',
    component: () => import('./views/FollowUpManagement/MakePlan/MakePlan'),
  },
  {
    path: '/FollowUpDetail',
    name: 'FollowUpDetail',
    component: () => import('./views/FollowUpManagement/FollowUpDetail/FollowUpDetail'),
  },
  // 表单设计器
  {
    path: '/FormD',
    name: 'FormD',
    component: () => import('./views/TemplateMaintenance/FormD/FormD'),
  },
  // 表单设计器
  {
    path: '/TemplateList',
    name: 'TemplateList',
    component: () => import('./views/TemplateMaintenance/TemplateList/TemplateList'),
  },
  // 新增编辑调研
  {
    path: '/AddEditorSurvey',
    name: 'AddEditorSurvey',
    component: () => import('./views/ResearchOfFeedback/AddEditorSurvey/AddEditorSurvey'),
  },
  // 调研列表
  {
    path: '/ListOfResearch',
    name: 'ListOfResearch',
    component: () => import('./views/ResearchOfFeedback/ListOfResearch/ListOfResearch'),
  },
  // 调研列表调研反馈
  {
    path: '/ResearchFeedback',
    name: 'ResearchFeedback',
    component: () => import('./views/ResearchOfFeedback/ResearchFeedback/ResearchFeedback'),
  },
  // 患者反馈
  {
    path: '/PatientsWithFeedback',
    name: 'PatientsWithFeedback',
    component: () => import('./views/ResearchOfFeedback/PatientsWithFeedback/PatientsWithFeedback'),
  },
  // 患者反馈详情
  {
    path: '/ResearchDetail',
    name: 'ResearchDetail',
    component: () => import('./views/ResearchOfFeedback/ResearchDetail/ResearchDetail'),
  },{
    path: '/multiFollow',
    name: 'multiFollow',
    component: () => import('./views/FollowUpManagement/MakePlan/multiFollow.vue'),
  },
  // 患者反馈已完成
  // {
  //   path: '/ResearchCompleted',
  //   name: 'ResearchCompleted',
  //   component: () => import('./views/ResearchOfFeedback/ResearchFeedback/ResearchCompleted'),
  // },
  // // 患者反馈未完成
  // {
  //   path: '/ResearchUndone',
  //   name: 'ResearchUndone',
  //   component: () => import('./views/ResearchOfFeedback/ResearchFeedback/ResearchUndone'),
  // },
]

export default routes
