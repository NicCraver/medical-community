<template>
  <div>
    <div style="height: 48px"></div>
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin="0" overflow footer>
      <template #title>接诊列表</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <div style="background-color: #fff">
          <div v-for="v in 200">dasdsad</div>
          <div>dasdsad</div>
        </div>
      </template>
      <template #footer>
        <el-button type="primary">21412</el-button>
        <el-button type="primary">21412</el-button>
        <el-button type="primary">21412</el-button>
        <el-button type="primary">21412</el-button>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from '../../packages/index'
export default {
  components: {
    ProLayout,
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
          component: 'ReferralRecord',
        },
        {
          label: '操作记录',
          component: 'OperationRecord',
        },
      ],
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
