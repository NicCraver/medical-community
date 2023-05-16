import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/organMngmt',
    redirect: '/organAdmin',
  },
  {
    path: '/demo',
    name: 'demo',
    component: () => import(/* webpackChunkName: "page2" */ './views/Demo/index.vue'),
  },
  {
    path: '/page2',
    name: 'page2',
    component: () => import(/* webpackChunkName: "page2" */ './views/page2.vue'),
  },
  {
    path: '/page3-3',
    name: 'page3-3',
    component: () => import(/* webpackChunkName: "page2" */ './views/page2.vue'),
  },
  {
    // 组织管理
    path: '/organAdmin',
    name: 'organAdmin',
    component: () => import('./views/OrganManage/OrganAdmin/index.vue'),
  },
  {
    // 新增组织测试
    path: '/organAdmin/addOrgan',
    name: 'addOrgan',
    component: () => import('./views/OrganManage/OrganAdmin/addOrgan.vue'),
  },
  {
    // 用户管理
    path: '/userAdmin',
    name: 'userAdmin',
    component: () => import('./views/OrganManage/UserAdmin/index.vue'),
  },
  {
    // 角色管理
    path: '/permissionAdmin/roleAdmin',
    name: 'roleAdmin',
    component: () => import('./views/OrganManage/PermissionAdmin/RoleAdmin/index.vue'),
  },
  {
    // 角色授权
    path: '/permissionAdmin/roleAuthorization',
    name: 'roleAuthorization',
    component: () => import('./views/OrganManage/PermissionAdmin/RoleAuthorization/index.vue'),
  },
  {
    // 菜单管理
    path: '/menuManagement',
    name: 'menuManagement',
    component: () => import('./views/OrganManage/MenuManagement/index.vue'),
  },
  {
    // 应用管理
    path: '/applicationManagement',
    name: 'applicationManagement',
    component: () => import('./views/OrganManage/ApplicationManagement/index.vue'),
  },
  {
    // 医院管理
    path: '/hospitalAdmin',
    name: 'HospitalAdmin',
    component: () => import('./views/MedicalManage/HospitalAdmin/index.vue'),
  },
  {
    // 医院详情
    path: '/hospitalDetail',
    name: 'HospitalDetail',
    component: () => import('./views/MedicalManage/HospitalAdmin/HospitalDetail.vue'),
  },
  {
    // 科室管理
    path: '/departmentAdmin',
    name: 'DepartmentAdmin',
    component: () => import('./views/MedicalManage/DepartmentAdmin/index.vue'),
  },
  {
    // 新增科室
    path: '/addDepartment',
    name: 'AddDepartment',
    component: () => import('./views/MedicalManage/DepartmentAdmin/AddDepartment.vue'),
  },
  {
    // 医生管理
    path: '/doctorAdmin',
    name: 'DoctorAdmin',
    component: () => import('./views/MedicalResourceManage/DoctorAdmin/index.vue'),
  },
  {
    // 医生详情
    path: '/doctorDetail',
    name: 'DoctorDetail',
    component: () => import('./views/MedicalResourceManage/DoctorAdmin/DoctorDetail.vue'),
  },
  {
    // 审批流
    path: '/approvalFlowManagement',
    name: 'ApprovalFlowManagement',
    component: () => import('./views/ApprovalFlowManagement/List'),
  },
  {
    // 审批流详情
    path: '/approvalFlowDetail',
    name: 'ApprovalFlowDetail',
    component: () => import('./views/ApprovalFlowManagement/Detail'),
  },
  {
    // 系统配置
    path: '/systemConfiguration',
    name: 'SystemConfiguration',
    component: () => import('./views/SystemConfiguration/SystemConfiguration.vue'),
  },
  {
    // api测试
    path: '/apiTest',
    name: 'ApiTest',
    component: () => import('./views/ApiTest.vue'),
  },
  {
    // api测试
    path: '/orgConfig',
    name: 'OrgConfig',
    component: () => import('./views/OrgConfig.vue'),
  },
]

export default routes
