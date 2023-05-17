import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Main = () => import('views/Main');
const routes = [
  {
    path: '/',
    redirect: '/portal',
  }, {
    // 工作台
    path: '/portal',
    redirect: '/portal/systemManager',
    component: Main,
    children: [{
      // 运维门户
      path: 'systemManager',
      name: 'systemManager',
      component: () => import('views/portal/SystemManager')
    }, {
      // 医生门户
      path: 'doctorPlatform',
      name: 'doctorPlatform',
      component: () => import('views/portal/DoctorPlatform')
    }, {
      // 管理员门户
      path: 'managerPlatform',
      name: 'managerPlatform',
      component: () => import('views/portal/ManagerPlatform')
    }]
  }, {
    // 标准管理
    path: '/standard',
    redirect: '/standard/areaStandard',
    component: Main,
    children: [{
      //值域管理
      path: 'areaStandard',
      name: 'areaStandard',
      component: () => import('views/standard/AreaStandard')
    }, {
      //数据元管理
      path: 'dataElement',
      name: 'dataElement',
      component: () => import('views/standard/DataElement')
    }, {
      //交换标准-基础配置
      path: 'exchangeStandard',
      name: 'basicConfig',
      component: () => import('views/standard/ExchangeStandard')
    }, {
      //交换标准-交换标准配置
      path: 'exchangeConfig',
      name: 'exchangeConfig',
      component: () => import('views/standard/ExchangeStandardConfig')
    }, {
      //交换标准-交换标准发布
      path: 'exchangeRelease',
      name: 'exchangePublish',
      component: () => import('views/standard/ExchangeStandardRelease')
    }]
  }, {
    // 统一资源管理
    path: '/resource',
    redirect: '/resource/appointmentRecord',
    component: Main,
    children: [{
      // 预约管理-预约记录
      path: 'appointmentRecord',
      name: 'appointmentRecord',
      component: () => import('views/resource/AppointmentRecord')
    }, {
      // 医院管理-医院信息
      path: 'hospitalInfo',
      name: 'hospitalInfo',
      component: () => import('views/resource/HospitalInfo')
    }]
  },
  {
    // 注册管理系统
    path: '/regManage',
    redirect: '/regManage/hosManage',
    component: Main,
    children: [{
      // 机构注册
      path: 'hosManage',
      name: 'hosManage',
      component: () => import('views/regManage/hosManage')
    }, {
      // 部门注册
      path: 'departManage',
      name: 'departManage',
      component: () => import('views/regManage/departManage')
    }, {
      // 人员注册
      path: 'peopleManage',
      name: 'peopleManage',
      component: () => import('views/regManage/peopleManage')
    }]
  }
]

export default routes
