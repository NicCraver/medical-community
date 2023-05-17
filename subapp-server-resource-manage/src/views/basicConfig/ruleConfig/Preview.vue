<!--
  @description 基础配置-规则配置-规则语法预览
  @date 2022/05/31
-->
<template>
  <el-dialog :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" :show-close="false" :modal="false" v-el-drag-dialog>
    <div slot="title" class="head">规则语法预览</div>
    <el-alert :title="'规则名称：'+form.name" type="info" :closable="false"></el-alert>
    <el-form ref="form" size="small" label-width="100px" :model="form">
      <el-form-item label="数据库类型" prop="dbType">
        <el-select v-model="form.dbType" disabled></el-select>
      </el-form-item>
      <el-form-item label="规则语句" prop="sqlExpression">
        <el-input type="textarea" placeholder="根据配置展示部分语句" v-model="form.sqlExpression" :rows="10"></el-input>
      </el-form-item>
      <el-button type="text" v-clipboard:copy="form.sqlExpression" v-clipboard:success="onCopy" v-clipboard:error="onError">一键复制</el-button>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="close">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from "@/directive/el-dragDialog";

export default {
  data() {
    return {
      isVisible: false,
      form: { name: "", dbType: "", sqlExpression: "" },
    };
  },
  directives: {
    elDragDialog,
  },
  methods: {
    open(data) {
      let str = "";
      data.refSqlList.forEach((item, index) => {
        str +=
          "第" +
          (index + 1) +
          "条：\n\t【successSql】 " +
          item.successSql +
          "\n\t【failSql】 " +
          item.failSql +
          "\n";
      });
      data.sqlExpression = str;
      this.form = data;
      this.isVisible = true;
    },
    close() {
      this.form = {};
      this.isVisible = false;
    },
    onCopy() {
      this.$message.success("复制成功");
    },
    onError() {
      this.$message.error("复制失败");
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
  margin-top: 10px;
}
.el-alert {
  color: #101010;
  margin-bottom: 10px;
}
.el-form .el-button {
  margin-left: 100px;
}
</style>