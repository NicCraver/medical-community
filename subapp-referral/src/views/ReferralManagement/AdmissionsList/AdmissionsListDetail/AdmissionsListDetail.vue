<template>
  <div>
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin="0" padding="0">
      <template #title>接诊</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component
          :is="activeComponent"
          @admission-click="showAdmissionConfirmDialog"
          :referralId="$route.query.referralId"
        />
      </template>
    </ProLayout>
    <ConfirmDialog
      :isReady.sync="isReady"
      :referralDetail="referralDetail"
    ></ConfirmDialog>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import ApplicationForm from '@/components/ApplicationFormComponents/ApplicationForm';
import MedicalRecords from '@/components/ApplicationFormComponents/MedicalRecords';
import ConfirmDialog from './ConfirmDialog';

export default {
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
      ],
      isReady: false,
      referralDetail: {}
    }
  },
  methods: {
    showAdmissionConfirmDialog(referralDetail) {    
      this.referralDetail = referralDetail;
      this.isReady = true;
    }
  },
  watch: {
    $route() {
      this.activeComponent = 'ApplicationForm';
    }
  },
  components: {
    ProLayout,
    ApplicationForm,
    MedicalRecords,
    ConfirmDialog
  }
}
</script>

<style lang="scss" scoped>

</style>
