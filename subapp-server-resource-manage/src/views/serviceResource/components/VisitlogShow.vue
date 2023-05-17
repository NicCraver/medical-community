<!-- 
  @description 服务资源-访问日志-查看
  @date 2022/2/16
 -->
<template>
  <el-dialog :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" :show-close="false">
    <span slot="title" class="el-dialog__title">
      查看日志
      <el-button size="small" class="fr" style="margin-left:10px" @click="close">关闭</el-button>
      <el-button size="small" class="fr" v-clipboard:copy="copyMsg" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
      <!-- <el-button size="small" class="fr">下载</el-button> -->
    </span>
    <el-scrollbar>
      <el-empty description="暂无数据" v-show="detail.length==0"></el-empty>
      <p v-for="(str, index) in detail" :key="index" class="item">{{str}}</p>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import { getLogDetail } from "api/serviceResource";

export default {
  data() {
    return { isVisible: false, id: "", detail: [], copyMsg: "暂无数据" };
  },
  methods: {
    open(id) {
      getLogDetail({ traceId: id }).then((res) => {
        this.detail = res.result;
        this.copyMsg = this.getCopy(res.result);
      });
      this.isVisible = true;
    },
    close() {
      this.detail = [];
      this.isVisible = false;
    },
    getCopy(arr) {
      if (arr.length == 0) {
        return "暂无数据";
      } else {
        return arr.join("\n");
      }
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
::v-deep .el-dialog__body {
  height: 500px;
  .item {
    line-height: 25px;
    margin-bottom: 10px;
  }
}
</style>