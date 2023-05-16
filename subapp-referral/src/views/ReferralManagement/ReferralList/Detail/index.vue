<template>
  <div class="ReferralListDetail">
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin="0" padding="0">
      <template #title>{{ status === 'edit' ? '编辑' : '查看' }}</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component
          :is="activeComponent"
          :referralId="$route.query.referralId"
          @reback-referral="rebackReferral"
          @suspend-click="handleSuspendClick"
        />
      </template>
    </ProLayout>
    <ActionDialog
      :visible.sync="actionDialogVisable"
      mode="suspend"
      :referralId="referralId"
      @actionSuccss="$router.go(-1)"
      :referralRow="referralDetail"
    ></ActionDialog>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import ApplicationForm from '@/components/ApplicationFormComponents/ApplicationForm'
import MedicalRecords from '@/components/ApplicationFormComponents/MedicalRecords'
import ActionDialog from '../ActionDialog';
import { batchRecoverRefInfo } from '@/api/modules/referralList';
export default {
  components: {
    ProLayout,
    ApplicationForm,
    MedicalRecords,
    ActionDialog
  },
  data() {
    return {
      status: '',
      activeComponent: 'ApplicationForm',
      tabDatas: [
        {
          label: '转诊申请单',
          component: 'ApplicationForm',
        },
        {
          label: '病情记录',
          component: 'MedicalRecords',
        }
      ],
      actionDialogVisable: false,
      referralDetail: {},
      referralId: ''
    }
  },
  created() {
    console.log('this.$route.query', this.$route.query)
    const { status } = this.$route.query
    this.status = this.$route.query.status
  },
  methods: {
    rebackReferral(row) {
      this.$confirm('恢复后，请在待处理页面查看本条记录，确认要恢复吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          const res = await batchRecoverRefInfo({
            ids: [row.id]
          });
          this.$message.success('恢复成功');
          this.$router.go(-1);
        } catch(err) {
          console.error(err);
        }
      })
    },
    handleSuspendClick(referralDetail) {
      this.referralId = referralDetail.id;
      this.actionDialogVisable = true;
      this.referralDetail = referralDetail
    }
  }
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
