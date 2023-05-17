<!-- 
  @description 标准管理-交换标准-交换标准配置-详情
  @date 2021/9/22
-->
<template>
  <el-dialog title="详情" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" top="60px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="添加接口" name="add">
        <detail-content :data="addData"></detail-content>
      </el-tab-pane>
      <el-tab-pane label="查询接口" name="query">
        <detail-content :data="queryData"></detail-content>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getExchangeDetail } from "api/standard.js";

import DetailContent from "./ExchangeConfigDetailContent.vue";

export default {
  data() {
    return {
      isVisible: false,
      id: "",
      activeName: "add",
      addData: {},
      queryData: {},
    };
  },
  components: { DetailContent },
  methods: {
    open(id) {
      this.id = id;
      getExchangeDetail({ standardId: id, type: 1 }).then((res) => {
        this.addData = res.result;
      });
      getExchangeDetail({ standardId: id, type: 2 }).then((res) => {
        this.queryData = res.result;
      });
      this.isVisible = true;
    },
    close() {
      this.addData = {};
      this.queryData = {};
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0 16px;
}
</style>
