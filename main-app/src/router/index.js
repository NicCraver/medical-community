import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import BasicLayout from '../layouts/BasicLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'
import Home from '../views/Home.vue'
import store from '../store'

// only githubpages preview site used, if use template please remove this check
// and use `createWebHistory` is recommend
const hasGithubPages = false

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/login.vue'),
    },
    // 单点登录-数据治理or后台管理
    {
      path: '/singleSignOn',
      name: 'singleSignOn',
      component: () => import('../views/singleSignOn/singleSignOn.vue'),
    },
    // 单点登录-EHR
    {
      path: '/singleSign',
      name: 'singleSign',
      component: () => import('../views/singleSignOn/singleSignOn.vue'),
    },
    // 单点登录-门户
    {
      path: '/singleSignIn',
      name: 'singleSignIn',
      component: () => import('../views/singleSignOn/singleSignOn.vue'),
    },
    {
      path: '/app-manageModule/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/manageModule.vue'),
    },
    {
      path: '/app-chronicDisease/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/chronicDisease.vue'),
    },
    {
      path: '/app-followup/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/followup.vue'),
    },
    {
      path: '/app-referral/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/referral.vue'),
    },
    {
      path: '/app-healthFile/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/healthFile.vue'),
    },
    {
      path: '/app-mdt/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/mdt.vue'),
    },
    {
      path: '/app-activity/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/activity.vue'),
    },
    {
      path: '/app-serverResourceManage/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/serverResourceManage.vue'),
    },
    {
      path: '/app-publicServe/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/publicServe.vue'),
    },
    {
      path: '/app-ygtPortal/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/ygtPortal.vue'),
    },
    {
      path: '/app-qcCenter/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/qcCenter.vue'),
    },
    {
      path: '/app-template/:page*',
      meta: { requireAuth: true },
      component: () => import('../views/child/template.vue'),
    },
    {
      path: '/welcome',
      name: 'welcome',
      meta: { title: '欢迎', icon: 'icon-icon-test' },
      component: () => import('../views/Page1.vue'),
    },
    {
      path: '/admins',
      name: 'admins',
      meta: { title: '管理页', icon: 'icon-tuijian', flat: true },
      component: BlankLayout,
      redirect: () => ({ name: 'page1' }),
      children: [
        {
          path: 'page-1',
          name: 'page1',
          meta: { title: '一级页面' },
          component: () => import('../views/admins/PageInfo.vue'),
        },
        {
          path: 'page-2',
          name: 'page2',
          meta: { title: '二级页面' },
          component: () => import('../views/admins/PageTypography.vue'),
        },
        {
          path: 'page-3',
          name: 'page3',
          meta: { title: '3级页面' },
          component: BlankLayout,
          redirect: () => ({ name: 'page3-1' }),
          children: [
            {
              path: 'page3-1',
              name: 'page3-1',
              meta: { title: '3-1级页面' },
              component: () => import('../views/admins/PageInfo.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/version',
      name: 'version',
      meta: { title: 'Version', icon: 'icon-antdesign' },
      component: () => import('../views/Detail.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  // console.log('history.state', history.state)
  // if (!window.history.state.current) window.history.state.current = to.fullPath
  // if (!window.history.state.back) window.history.state.back = from.fullPath
  if (history.state && !history.state.current) {
    Object.assign(history.state, {
      current: from.fullPath,
    })
  }
  const hasToken = sessionStorage.getItem('token')
  // requireAuth: true 表示需要登录
  if (to.meta.requireAuth) {
    if (hasToken) {
      // console.log('111111111111', 111111111111)
      next()
    } else {
      // console.log('22222222222222', 22222222222222)
      next(`/login?redirect=${to.path}`)
    }
  } else {
    if (to.fullPath !== '/login') {
      // console.log('333333333', 333333333)
      next()
    }
  }
  const urlsName = ['/singleSign', '/singleSignOn', '/singleSignIn']
  if (to.fullPath === '/login' || urlsName.indexOf(to.fullPath) > -1) {
    // console.log(`to`, to)
    if (hasToken) {
      // console.log('44444444', 44444444)
      next(`/login?redirect=${to.path}`)
    } else {
      // console.log('55555555555', 55555555555)
      next()
    }
  }
})
