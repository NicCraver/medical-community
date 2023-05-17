<!--
  @description 采集监控-基础配置-质控方案-发布-执行配置
  @date 2022/05/09
-->
<template>
  <el-dialog width="600px" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" :show-close="false" :modal="false" v-el-drag-dialog class="config">
    <div slot="title" class="head">
      <span>执行配置</span>
      <el-alert :title="`方案名称：${name}`" type="info" :closable="false"></el-alert>
    </div>
    <cron class="cron" ref="cron" v-model="cronValue" :loading="type=='show'"></cron>
    <div slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="save" v-show="type=='edit'">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import cron from "components/Cron/cron.vue";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  components: { cron },
  data() {
    return {
      isVisible: false,
      name: "",
      cronValue: "",
      type: "edit",
    };
  },
  directives: {
    elDragDialog,
  },
  methods: {
    save() {
      this.$emit("configSave", this.cronValue);
      this.isVisible = false;
    },
    open(name, v, type = "edit") {
      this.name = name;
      this.cronValue = v;
      this.type = type;
      this.isVisible = true;
    },
    close() {
      this.$emit("configClose");
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  margin-left: 820px !important;
}
.config {
  .el-alert {
    float: right;
    height: 32px;
    width: 60%;
    margin-top: 5px;
    color: #101010;
  }
  .cron {
    height: 550px;
  }
  ::v-deep .el-dialog__footer {
    margin-top: 0;
  }
}
</style>