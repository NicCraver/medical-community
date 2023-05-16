<template>
  <div class="ReferralList">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0">
      <template #title>转诊列表</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component
          :is="activeComponent"
          :activeComponent="activeComponent"
          :referralInfo="referralInfo"
        />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import LoadDeal from './LoadDeal.vue';
import LoadAdmissions from './LoadAdmissions.vue';
import HasCompleted from './HasCompleted.vue';
import HasSuspend from './HasSuspend.vue';

export default {
  data() {
    return {
      activeComponent: 'LoadDeal',
      tabDatas: [
        {
          label: '待处理',
          component: 'LoadDeal',
        },
        {
          label: '待接诊',
          component: 'LoadAdmissions',
        },
        {
          label: '已完成',
          component: 'HasCompleted',
        },
        {
          label: '已关闭',
          component: 'HasSuspend',
        },
      ],
      referralInfo: {}
    }
  },
  mounted() {
    this.activeComponent = window.sessionStorage.getItem('activeTab') || 'LoadDeal';
    window.sessionStorage.removeItem('activeTab');
    this.$EVENT_BUS.$on('noticationEmit', referralInfo => {
      if (referralInfo) {
        this.$nextTick(() => {
          this.referralInfo = referralInfo;
        })
      }
    });
  },
  beforeDestroy() {
    this.$EVENT_BUS.$off('noticationEmit');
  },
  components: {
    LoadDeal,
    LoadAdmissions,
    HasCompleted,
    HasSuspend,
    ProLayout
  }
}
</script>

<style lang="scss" scoped>
.ReferralList {

}
</style>
