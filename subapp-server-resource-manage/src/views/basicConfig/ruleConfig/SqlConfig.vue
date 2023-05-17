<!--
  @description 基础配置-规则配置-SQL公式配置
  @date 2022/05/26
-->
<template>
  <el-dialog width="520px" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" :show-close="false" :append-to-body="true">
    <div slot="title" class="head">SQL公式配置</div>
    <el-alert :title="form.name+' | '+form.type" type="info" :closable="false"></el-alert>
    <el-form ref="form" size="small" label-width="80px" :model="form">
      <el-form-item label="状态:" prop="enableStatus">
        {{form.enableStatus==1?'开启':'关闭'}}
      </el-form-item>
      <el-form-item label="SQL公式:" prop="sqlExpression">
        <el-input type="textarea" placeholder="依照规则生成的规则公式" v-model="form.sqlExpression" :autosize="{ minRows: 5, maxRows: 10}"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="save">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      form: { name: "", type: "", enableStatus: 1, sqlExpression: "" },
    };
  },
  methods: {
    open(data) {
      this.form = data;
      this.isVisible = true;
    },
    save() {
      this.$emit("sqlEdit", this.form.sqlExpression);
      this.$message.success("SQL公式保存成功");
      this.close();
    },
    close() {
      this.form = {};
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog__header {
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
::v-deep .el-dialog__footer {
  padding: 10px;
  border-top: 1px solid #e9e9e9;
  margin-top: 100px;
}
.el-alert {
  color: #101010;
  margin-bottom: 10px;
}
</style>