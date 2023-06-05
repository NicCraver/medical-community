import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/Login.vue"),
  },
  // 首页
  {
    path: "/Home/:pAId",
    name: "Home",
    component: () => import("@/views/Home/Home"),
  },
  // /单点登录
  {
    path: "/singleSign",
    name: "singleSign",
    component: () => import("@/views/singleSign/singleSign.vue"),
  },
  {
    // path: '/residentCenter',
    // name: 'ResidentCenter',
    // component: () => import('@/views/ResidentCenter/ResidentCenter.vue'),
    path: "/residentCenterInfo",
    name: "residentCenterInfo",
    component: () => import("@/views/singleSign/sMain"),
  },
  {
    // 健康档案共享调阅-居民中心
    path: '/residentCenter',
    name: 'residentCenter',
    component: () => import('@/views/infomationPlatform/healthRecord/ResidentCenter'),
  },
  {
    // 健康档案共享调阅-统计分析
    path: '/monitorStatistics',
    name: 'monitorStatistics',
    component: () => import('@/views/infomationPlatform/healthRecord/monitorStatistics'),
  },
  {
    // 健康档案共享调阅-系统配置-模块配置
    path: '/moduleConfig',
    name: 'moduleConfig',
    component: () => import('@/views/infomationPlatform/healthRecord/ModuleConfig'),
  },
  {
    // 健康档案共享调阅-系统配置-隐私配置
    path: '/privacyConfig',
    name: 'privacyConfig',
    component: () => import('@/views/infomationPlatform/healthRecord/PrivacyConfig'),
  }
]

export default routes