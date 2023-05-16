<template>
  <div class="PatientsWithFeedback">
    <ProLayout model="tab">
      <template #title>患者反馈</template>
      <template #tab>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="已完成" name="ResearchCompleted"></el-tab-pane>
          <el-tab-pane label="未完成" name="ResearchUndone"></el-tab-pane>
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
import ResearchCompleted from './ResearchCompleted.vue'
import ResearchUndone from './ResearchUndone.vue'
export default {
  components: {
    ProLayout,
  },
  data() {
    return {
      tabDatas: [
        {
          name: 'ResearchCompleted',
          label: '已完成',
          component: ResearchCompleted,
        },
        {
          name: 'ResearchUndone',
          label: '未完成',
          component: ResearchUndone,
        },
      ],
      activeName: 'ResearchCompleted',
      tabComponent: {
        name: 'ResearchCompleted',
        label: '已完成',
        component: ResearchCompleted,
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
      this.activeName = tab.name
      this.tabComponent = this.tabDatas.find((item) => {
        return item.name === tab.name
      })
    },
  },
}
</script>

<style lang="scss">
.PatientsWithFeedback {
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
