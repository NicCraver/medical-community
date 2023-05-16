<template>
  <div class="other-settings">
    <el-form label-width="70px" class="el-form">
      <el-form-item label="异常日志">
        <el-radio-group v-model="otherSettings.recordLog">
          <el-radio label="1">开启</el-radio>
          <el-radio label="2">关闭</el-radio>
        </el-radio-group>
        <div class="tip">指流程节点中人员为空时，导致流程无法继续，系统将记录异常日志</div>
      </el-form-item>
      <el-form-item label="模板权限">
        <el-radio-group v-model="otherSettings.templateAuth">
          <el-radio label="1">流程未开始，允许编辑</el-radio>
          <el-radio label="2">流程进行中，仍可编辑</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      otherSettings: {
        recordLog: '1',
        templateAuth: '1',
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.other-settings {
  .el-form {
    width: 500px;
    margin: 20px auto;
    .tip {
      font-weight: bold;
    }
  }
}
</style>