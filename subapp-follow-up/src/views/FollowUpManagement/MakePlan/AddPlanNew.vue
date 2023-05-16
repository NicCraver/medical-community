<template>
  <el-drawer
    :visible.sync="visible"
    direction="rtl"
    size="700px"
    :before-close="closeDialog"
  >
    <template #title>
      <div class="title">新增随访计划</div>
    </template>
    <AddPlanNewCom
      :planDetailType="planDetailType"
      :diseaseTypeList="diseaseTypeList"
      :planDetail="planDetail"
      :followUpForms="followUpForms"
      followupType="single"
      @closeDialog="closeDialog"
    ></AddPlanNewCom>
  </el-drawer>
</template>

<script>
import AddPlanNewCom from "./AddPlanNewCom";

export default {
  name: "AddPlanNew",
  components: { AddPlanNewCom },
  props: {
    planDetailType: {
      type: String,
      default: "add",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    diseaseTypeList: {
      type: Array,
      default() {
        return [];
      },
    },
    followUpForms: {
      type: Array,
      default() {
        return [];
      },
    },
    planDetail: {
      type: Object,
      default() {
        return {};
      },
    },
    closeDialog: Function,
  },
  watch: {
    visible(val) {
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-drawer__header) {
  padding: 10px;
  margin-bottom: 0;
}
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
}
header {
  padding: 20px 0;
  .line {
    width: 76px;
    height: 1px;
    background: #bfbfbf;
    margin: 0 10px;
  }
  .num-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    line-height: 17px;
    font-size: 12px;
    text-align: center;
    border-radius: 15px;
  }

  .num-text-color1 {
    color: #303133;
    margin-left: 10px;
  }

  .num-text-color2 {
    color: #bfbfbf;
    margin-left: 10px;
  }

  .num-icon-color1 {
    color: #fff;
    border: 1px solid rgba(68, 104, 189, 100);
    background: #4468bd;
  }

  .num-icon-color2 {
    color: #bfbfbf;
    border: 1px solid #bfbfbf;
    background: #fff;
  }
}
</style>
