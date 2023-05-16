import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/home.vue'

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
    name: 'home',
    component: Home,
  },
  {
    // 概览
    path: '/analysis',
    name: 'Analysis',
    component: () => import('./views/Workbench/Analysis/Analysis.vue'),
  },
  {
    // 患者中心
    path: '/referralPatientCenter',
    name: 'ReferralPatientCenter',
    component: () => import('./views/ReferralManagement/ReferralPatientCenter/ReferralPatientCenter.vue'),
  },
  {
    // 患者中心详情
    path: '/referralPatientCenterDetail',
    name: 'ReferralPatientCenterDetail',
    component: () => import('./views/ReferralManagement/ReferralPatientCenter/ReferralPatientCenterDetail/ReferralPatientCenterDetail.vue'),
  },
  {
    // 转诊列表
    path: '/referralList',
    name: 'ReferralList',
    component: () => import('./views/ReferralManagement/ReferralList/List'),
  },
  {
    // 转诊列表详情
    path: '/referralListDetail',
    name: 'ReferralListDetail',
    component: () => import('./views/ReferralManagement/ReferralList/Detail'),
  },
  {
    // 转诊批量撤回或批量关闭
    path: '/referralBatchAction',
    name: 'ReferralBatchAction',
    component: () => import('./views/ReferralManagement/ReferralList/BatchAction'),
  },
  {
    // 接诊处理
    path: '/admissionsList',
    name: 'AdmissionsList',
    component: () => import('./views/ReferralManagement/AdmissionsList/AdmissionsList.vue'),
  },
  {
    // 接诊处理详情
    path: '/admissionsListDetail',
    name: 'AdmissionsListDetail',
    component: () => import('./views/ReferralManagement/AdmissionsList/AdmissionsListDetail/AdmissionsListDetail.vue'),
  },
  {
    // 审核列表
    path: '/reviewList',
    name: 'ReviewList',
    component: () => import('./views/ReferralReview/ReviewList/ReviewList.vue'),
  },
  {
    // 审核列表详情
    path: '/reviewListDetail',
    name: 'ReviewListDetail',
    component: () => import('./views/ReferralReview/ReviewList/ReviewListDetail/ReviewListDetail.vue'),
  },
  {
    // 统计分析
    path: '/statisticalAnalysis',
    name: 'StatisticalAnalysis',
    component: () => import('./views/StatisticalAnalysis/index.vue'),
  },
  {
    // 目录列表
    path: '/directoryList',
    name: 'DirectoryList',
    component: () => import('./views/ReferralDirectory/DirectoryList/DirectoryList.vue'),
  },
  {
    // 取消记录
    path: '/cancelRecord',
    name: 'CancelRecord',
    component: () => import('./views/SystemRecord/CancelRecord/CancelRecord.vue'),
  },
  {
    // 取消记录
    path: '/appointmentRecord',
    name: 'AppointmentRecord',
    component: () => import('./views/SystemRecord/AppointmentRecord/AppointmentRecord.vue'),
  },
]

export default routes
