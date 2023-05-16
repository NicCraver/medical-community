<template>
  <div class="ReviewInclusion">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0">
      <template #title>随访列表</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane
            v-for="item in tabDatas"
            :key="item.label"
            :name="item.name"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component :is="activeComponent" />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import LoadFollowUp from './LoadFollowUp'
import FollowUped from './FollowUped'
import FollowUpClosed from './FollowUpClosed'
import HasSuspend from './HasSuspend'

export default {
  components: {
    ProLayout,
    LoadFollowUp,
    FollowUped,
    FollowUpClosed,
    HasSuspend,
  },
  data() {
    return {
      activeComponent: 'LoadFollowUp',
      tabDatas: [
        {
          name: 'LoadFollowUp',
          label: '待随访',
          component: LoadFollowUp,
          followUpStatus: '1',
        },
        {
          name: 'FollowUped',
          label: '已随访',
          component: FollowUped,
          followUpStatus: '2',
        },
        {
          name: 'HasSuspend',
          label: '已中止',
          component: HasSuspend,
          followUpStatus: '3',
        },
        {
          name: 'FollowUpClosed',
          label: '已关闭',
          component: FollowUpClosed,
          followUpStatus: '4',
        },
      ],
    }
  },
  created() {
    let followUpStatus = window.sessionStorage.getItem('followupStatus')
    if (!followUpStatus) {
      followUpStatus = this.$route.query.followUpStatus
    } else {
      window.sessionStorage.removeItem('followupStatus')
    }

    const activetTab = this.tabDatas.find((item) => item.followUpStatus === followUpStatus)
    this.activeComponent = activetTab ? activetTab.name : 'LoadFollowUp'
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== 'FollowUpDetail') {
      window.sessionStorage.removeItem('followupStatus')
      window.sessionStorage.removeItem('queryParams')
      window.sessionStorage.removeItem('isBackFromDetail')
    }
    next()
  },
  destroyed() {
    this.activeComponent = null
  },
  watch: {
    activeComponent() {
      console.log(`this.activeComponent`, this.activeComponent)
    },
    $route() {
      this.activeComponent = 'LoadFollowUp'
    },
  },
}
</script>

<style lang="scss">
.ReviewInclusion {
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 !important;
  }
  .el-tabs__nav,
  .el-tabs__nav-scroll {
    background-color: #fff !important;
  }
  .el-tabs__item.is-top.is-active {
    border-bottom: none !important;
  }
  .el-tabs__item.is-active {
    color: #134796 !important;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #949da3 !important;
  }
  .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: #134796 !important;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    border-radius: 4px !important;
  }
  .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
  }
}
</style>
<style lang="scss" scoped></style>
