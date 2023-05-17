import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/serviceResource',
  },
  {
    // 服务资源
    path: '/serviceResource',
    name: 'serviceResource',
    redirect: '/serviceResource/overview',
    component: () => import('views/Main'),
    children: [{
      // 概览
      path: 'overview',
      name: 'overview',
      component: () => import('views/serviceResource/Overview')
    }, {
      // 概览-查看
      path: 'overview/show',
      name: 'overviewShow',
      component: () => import('views/serviceResource/components/ServiceManageShow')
    }, {
      // 资源目录
      path: 'resourceCatalog',
      name: 'resourceCatalog',
      component: () => import('views/serviceResource/ResourceCatalog')
    }, {
      // 服务管理
      path: 'serviceManage',
      name: 'serviceManage',
      component: () => import('views/serviceResource/ServiceManage')
    }, {
      // 服务管理-新增
      path: 'serviceManage/add',
      name: 'serviceManageAdd',
      component: () => import('views/serviceResource/components/ServiceManageAdd')
    }, {
      // 服务管理-编辑
      path: 'serviceManage/edit',
      name: 'serviceManageEdit',
      component: () => import('views/serviceResource/components/ServiceManageAdd')
    }, {
      // 服务管理-查看
      path: 'serviceManage/show',
      name: 'serviceManageShow',
      component: () => import('views/serviceResource/components/ServiceManageShow')
    }, {
      // 服务授权
      path: 'serviceEmpower',
      name: 'serviceEmpower',
      component: () => import('views/serviceResource/ServiceEmpower')
    }, {
      //服务授权-服务详情
      path: 'serviceEmpower/detail',
      name: 'serviceEmpowerDetail',
      component: () => import('views/serviceResource/components/ServiceManageShow')
    }, {
      // 服务授权-服务批量授权
      path: 'batchEmpower',
      name: 'batchEmpower',
      component: () => import('views/serviceResource/components/ServiceEmpower/batchEmpower')
    }, {
      // 机构白名单
      path: 'whitelist',
      name: 'whitelist',
      component: () => import('views/serviceResource/Whitelist')
    }, {
      // 访问日志
      path: 'visitlog',
      name: 'visitlog',
      component: () => import('views/serviceResource/Visitlog')
    }]
  }, {
    // 数据资源
    path: '/dataResource',
    redirect: '/dataResource/dataOverview',
    component: () => import('views/Main'),
    children: [{
      // 概览
      path: 'dataOverview',
      name: 'dataResource',
      component: () => import('views/dataResource/dataResource'),
    }, {
      // 概览-查看详情
      path: 'overview/detail',
      name: 'dataResourceDetail',
      component: () => import('views/dataResource/components/DataResourceDetail')
    }, {
      // 资源目录
      path: 'dataMenu',
      name: 'dataMenu',
      component: () => import('views/dataResource/dataMenu')
    }]
  }, {
    // 数据资产
    path: '/finResource',
    redirect: '/finResource/finOverView',
    component: () => import('views/Main'),
    children: [{
      // 概览
      path: 'finOverView',
      name: 'finOverView',
      component: () => import('views/finResource/finOverView')
    }]
  }, {
    // 采集监控
    path: '/collectMonitor',
    redirect: '/collectMonitor/cmOverview',
    component: () => import('views/Main'),
    children: [{
      // 概览
      path: 'cmOverview',
      name: 'cmOverview',
      component: () => import('views/collectMonitor/Overview')
    }, {
      // 对账指标
      path: 'indicator',
      name: 'indicator',
      component: () => import('views/collectMonitor/accountCheck/indicator')
    }, {
      // 业务对账
      path: 'business',
      name: 'business',
      component: () => import('views/collectMonitor/accountCheck/business')
    }]
  }, {
    // 基础配置
    path: '/basicConfig',
    redirect: '/basicConfig/ruleConfig',
    component: () => import('views/Main'),
    children: [{
      // 规则配置
      path: 'ruleConfig',
      name: 'ruleConfig',
      component: () => import('views/basicConfig/RuleConfig')
    }, {
      // 质控方案
      path: 'configQualityControl',
      name: 'configQualityControl',
      component: () => import('views/basicConfig/QualityControl')
    }, {
      // 质控方案-新增
      path: 'configQualityControl/add',
      name: 'configQualityControlAdd',
      component: () => import('views/basicConfig/qualityControl/QualityControlAdd')
    }, {
      // 质控方案-编辑
      path: 'configQualityControl/edit',
      name: 'configQualityControlEdit',
      component: () => import('views/basicConfig/qualityControl/QualityControlAdd')
    }, {
      // 质控方案-查看
      path: 'configQualityControl/show',
      name: 'configQualityControlShow',
      component: () => import('views/basicConfig/qualityControl/QualityControlShow')
    }, {
      // 方案运行监控
      path: 'configQualityControl/schemeOperationMonitor',
      name: 'schemeOperationMonitor',
      component: () => import('views/basicConfig/qualityControl/schemeOperationMonitor')
    }, {
      // 方案运行监控-查看
      path: 'configQualityControl/schemeOperationMonitor/show',
      name: 'schemeOperationMonitorShow',
      component: () => import('views/basicConfig/qualityControl/schemeOperationMonitorShow')
    }]
  }, {
    // 区域质控
    path: '/areaQuality',
    redirect: '/areaQuality/overview',
    component: () => import('views/Main'),
    children: [{
      //概览
      path: 'overview',
      name: 'areaOverview',
      component: () => import('views/qualityControl/AreaOverview')
    }, {
      //概览-xx性总览
      path: 'overview/:type',
      name: 'areaOverviewType',
      component: () => import('views/qualityControl/components/RuleOverview')
    }, {
      //概览-xx性总览-查看
      path: 'overview/:type/show',
      name: 'areaOverviewTypeShow',
      component: () => import('views/qualityControl/components/RuleOverviewShow')
    }, {
      //xx性总览
      path: ':type',
      name: 'areaType',
      component: () => import('views/qualityControl/components/RuleOverview')
    }, {
      //xx性总览-查看
      path: ':type/show',
      name: 'areaTypeShow',
      component: () => import('views/qualityControl/components/RuleOverviewShow')
    }]
  }, {
    // 机构质控
    path: '/institutionQuality',
    redirect: '/institutionQuality/overview',
    component: () => import('views/Main'),
    children: [{
      //概览
      path: 'overview',
      name: 'institutionOverview',
      component: () => import('views/qualityControl/InstitutionOverview')
    }, {
      //概览-xx性总览
      path: 'overview/:type',
      name: 'institutionOverviewType',
      component: () => import('views/qualityControl/components/RuleOverviewShow')
    }, {
      //xx性总览
      path: ':type',
      name: 'institutionType',
      component: () => import('views/qualityControl/components/RuleOverviewShow')
    }]
  }, {
    path: "/searchRes",
    name: "searchRes",
    component: () => import('@/views/searchRes/index')
  }, {
    path: "/emptyPage",
    name: "emptyPage",
    component: () => import('@/views/searchRes/emptyPage')
  }]

export default routes
