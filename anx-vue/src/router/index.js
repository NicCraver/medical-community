import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/Test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "Test" */ '../views/Test.vue'),
  },
  {
    path: '/ProLayout',
    name: 'ProLayout',
    component: () => import(/* webpackChunkName: "Test" */ '../views/ProLayout.vue'),
  },
  {
    path: '/ProDrawer',
    name: 'ProDrawer',
    component: () => import(/* webpackChunkName: "Test" */ '../views/ProDrawer.vue'),
  },
  {
    path: '/ProDialog',
    name: 'ProDialog',
    component: () => import(/* webpackChunkName: "Test" */ '../views/ProDialog.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
