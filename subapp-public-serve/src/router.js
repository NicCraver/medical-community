/*
 * @Author: Nic
 * @Date: 2022-11-30 09:09:53
 * @LastEditTime: 2023-01-04 14:40:05
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-public-serve/src/router.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/customerManage/diseaseTag',
  },
  {
    // 客户管理
    path: '/customerManage',
    name: 'customerManage',
    redirect: '/customerManage/diseaseTag',
    component: () => import('./views/Main.vue'),
    children: [
      {
        // 病种标签
        path: 'diseaseTag',
        name: 'DiseaseTag',
        component: () => import('./views/customerManage/DiseaseTag'),
      },
      {
        // 病种对照
        path: 'diseaseControl',
        name: 'DiseaseControl',
        component: () => import('./views/customerManage/DiseaseControl/DiseaseControl.vue'),
      },
      {
        // 运营标签
        path: 'operationalTag',
        name: 'OperationalTag',
        component: () => import('./views/customerManage/operationalTag'),
      },
      {
        // 运营标签 - 新增
        path: 'operationalTag/operateAdd',
        name: 'operateAdd',
        component: () => import('./views/customerManage/operationalTag/operateAdd.vue'),
      },
      {
        // 运营标签 - 详情
        path: 'operationalTag/operateDetails',
        name: 'operateDetails',
        redirect: 'operationalTag/operateDetails/tagInfo',
        component: () => import('./views/customerManage/operationalTag/operateDetails.vue'),
        children: [
          {
            // 病种标签
            path: 'tagInfo',
            name: 'tagInfo',
            component: () => import('./views/customerManage/operationalTag/components/tagInfo.vue'),
          },
          {
            // 病种标签
            path: 'tagData',
            name: 'tagData',
            component: () => import('./views/customerManage/operationalTag/components/tagData.vue'),
          },
        ],
      },
     
    ],
  },
]

export default routes
