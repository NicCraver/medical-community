import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/basicManage',
    name: 'BasicManage',
    redirect: '/solutionCenter/test',
    component: () => import('./views/BasicManage'),
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('./views/BasicManage/Test'),
      },
    ]
  },
  {
    path: '/newsAnnouncements',
    name: 'NewsAnnouncements',
    redirect: '/solutionCenter/newsManage',
    component: () => import('./views/NewsAnnouncements'),
    children: [
      {
        path: 'newsManage',
        name: 'NewsManage',
        component: () => import('./views/NewsAnnouncements/NewsManage'),
      },
    ]
  },
  {
    path: '/logQuery',
    name: 'LogQuery',
    redirect: '/solutionCenter/test',
    component: () => import('./views/LogQuery'),
    children: [
      {
        path: 'loginLog',
        name: 'LoginLog',
        component: () => import('./views/LogQuery/LoginLog'),
      },
      {
        path: 'operationLog',
        name: 'OperationLog',
        component: () => import('./views/LogQuery/OperationLog'),
      },
    ]
  }
]

export default routes
