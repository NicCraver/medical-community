<template>
  <div class="ReviewInclusion">
    <ProLayout model="tab">
      <template #title>审核纳入</template>
      <template #tab>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待审核" name="PendingReview"></el-tab-pane>
          <el-tab-pane label="纳入成功" name="SuccessfullyIncluded"></el-tab-pane>
          <el-tab-pane label="纳入失败" name="FailedToInclude"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component v-if="tabComponent.name === activeName" :is="tabComponent.component"></component>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import PendingReview from './PendingReview.vue'
import SuccessfullyIncluded from './SuccessfullyIncluded.vue'
import FailedToInclude from './FailedToInclude.vue'
export default {
  components: {
    ProLayout,
    PendingReview,
    SuccessfullyIncluded,
    FailedToInclude,
  },
  data() {
    return {
      tabDatas: [
        {
          name: 'PendingReview',
          label: '待审核',
          component: PendingReview,
        },
        {
          name: 'SuccessfullyIncluded',
          label: '纳入成功',
          component: SuccessfullyIncluded,
        },
        {
          name: 'FailedToInclude',
          label: '纳入失败',
          component: FailedToInclude,
        },
      ],
      activeName: 'PendingReview',
      tabComponent: {
        name: 'PendingReview',
        label: '待审核',
        component: PendingReview,
      },
    }
  },
  watch: {
    '$route.name'(n, o) {
      this.activeName = n
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(`tab.name`, tab.name)
      this.activeName = tab.name
      this.tabComponent = this.tabDatas.find((item) => {
        return item.name === tab.name
      })
      console.log(`this.tabComponent`, this.tabComponent)
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
<style lang="scss" scoped>
</style>
