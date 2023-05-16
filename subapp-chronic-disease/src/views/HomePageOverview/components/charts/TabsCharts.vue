<!--
 * @Author: Nic
 * @Date: 2022-09-08 17:33:41
 * @LastEditTime: 2023-02-22 18:04:33
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/HomePageOverview/components/charts/TabsCharts.vue
-->
<template>
  <div class="TabsCharts">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="服务统计" name="ServiceTrendStatistics"></el-tab-pane>
      <!-- 权限控制 -->
      <el-tab-pane v-if="$isP(2)" label="活动统计" name="Activity"></el-tab-pane>
    </el-tabs>
    <div>
      <component v-if="tabComponent.name === activeName" :is="tabComponent.component"></component>
    </div>
  </div>
</template>

<script>
import ServiceTrendStatistics from './ServiceTrendStatistics.vue'
import Activity from './Activity.vue'
export default {
  components: {
    Activity,
    ServiceTrendStatistics,
  },
  data() {
    return {
      activeName: 'ServiceTrendStatistics',
      tabDatas: [
        {
          name: 'ServiceTrendStatistics',
          label: '服务统计',
          component: ServiceTrendStatistics,
        },
        {
          name: 'Activity',
          label: '活动统计',
          component: Activity,
        },
      ],
      activeName: 'ServiceTrendStatistics',
      tabComponent: {
        name: 'ServiceTrendStatistics',
        label: '服务统计',
        component: ServiceTrendStatistics,
      },
    }
  },
  created() {
    // console.log(`this.$isP(2)`,this.$isP(2))
    // if (this.$isP(2)) {
    //   this.tabDatas = [
    //     {
    //       name: 'ServiceTrendStatistics',
    //       label: '服务统计',
    //       component: ServiceTrendStatistics,
    //     },
    //     {
    //       name: 'Activity',
    //       label: '活动统计',
    //       component: Activity,
    //     },
    //   ]
    // } else {
    //   this.tabDatas = [
    //     {
    //       name: 'ServiceTrendStatistics',
    //       label: '服务统计',
    //       component: ServiceTrendStatistics,
    //     },
    //   ]
    // }
  },
  methods: {
    handleClick(tab) {
      console.log(`tab`, tab)
      this.activeName = tab.name
      this.tabComponent = this.tabDatas.find((item) => {
        return item.name === tab.name
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.TabsCharts {
  ::v-deep.el-tabs__item {
    font-size: 16px;
    color: #bbbbbb;
  }
  ::v-deep.el-tabs__item.is-active {
    color: #303133 !important;
  }
  ::v-deep.el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #fff !important;
    z-index: 1;
  }
}
</style>
