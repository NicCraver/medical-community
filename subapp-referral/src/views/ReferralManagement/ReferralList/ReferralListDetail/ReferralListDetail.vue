<template>
  <div class="ReferralListDetail">
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin="0" padding="0">
      <template #title>转诊申请</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
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
import ApplicationForm from '@/components/ApplicationFormComponents/ApplicationForm'
import MedicalRecords from '@/components/ApplicationFormComponents/MedicalRecords'
import ReferralRecords from '@/components/ApplicationFormComponents/ReferralRecords'
export default {
  components: {
    ProLayout,
    ApplicationForm,
    MedicalRecords,
    ReferralRecords,
  },
  data() {
    return {
      activeComponent: 'ApplicationForm',
      tabDatas: [
        {
          label: '转诊申请单',
          component: 'ApplicationForm',
        },
        {
          label: '病情记录',
          component: 'MedicalRecords',
        },
        {
          label: '转诊记录',
          component: 'ReferralRecords',
        },
      ],
    }
  },
  created() {
    console.log('this.$route.query', this.$route.query)
    const { status, activeComponent = 'ApplicationForm' } = this.$route.query
    this.activeComponent = activeComponent
  },
}
</script>

<style lang="scss" scoped>
// .ReferralListDetail {
// }
</style>
<style lang="scss">
.ReferralListDetail {
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
