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
    path: '/bulletinBoard',
    name: 'BulletinBoard',
    component: () => import('./views/BulletinBoard'),
  },
  {
    path: '/bulletinBoard/announcementDetails',
    name: 'AnnouncementDetails',
    component: () => import('./views/BulletinBoard/AnnouncementDetails'),
  },
]

export default routes
