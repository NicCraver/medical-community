<template>
  <div class="MakePlan">
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin='10' padding='0'>
      <template #title>制定计划</template>
      <template #tab>
        <el-tabs v-model="activeComponent" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabDatas"
            :key="item.label"
            :name="item.name"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component :is="activeComponent" ref="tabComponent" />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import FollowUpPlan from './FollowUpPlan.vue';
import BasicArchives from './BasicArchives.vue';

export default {
  components: {
    ProLayout,
    FollowUpPlan,
    BasicArchives,
  },
  data() {
    return {
      activeComponent: "FollowUpPlan",
      tabDatas: [
        {
          name: "FollowUpPlan",
          label: "随访计划",
          component: FollowUpPlan,
        },
        {
          name: "BasicArchives",
          label: "基本档案",
          component: BasicArchives,
        },
      ],
    };
  },
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.tabComponent = this.tabDatas.find((item) => {
        return item.name === tab.name;
      });
      console.log(`this.tabComponent`, this.tabComponent);
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.$refs.tabComponent.checkPlanDetailChanged) {
      this.$refs.tabComponent.checkPlanDetailChanged().then(() => {
        next();
      }).catch(() => {});
    } else {
      next();
    }
  }
};
</script>

<style lang="scss">
.MakePlan {
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
    content: "";
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
