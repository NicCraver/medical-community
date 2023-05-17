<!-- 
  @description 方案运行监控-查看-查看访问日志
  @date 2022/5/12
 -->
<template>
  <el-dialog
    :visible.sync="isVisible"
    :before-close="close"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <span slot="title" class="el-dialog__title">
      查看日志
      <el-button
        size="small"
        class="fr"
        style="margin-left: 10px"
        @click="close"
        >关闭</el-button
      >
      <el-button
        size="small"
        class="fr"
        v-clipboard:copy="copyMsg"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        >复制</el-button
      >
      <el-button size="small" class="fr" @click="downFuc">下载</el-button>
      <el-input
        v-model="keyWords"
        size="small"
        class="fr"
        placeholder="请输入关键词"
        style="width: 214px"
        @keyup.enter.native="search"
      >
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="search"
        ></i>
      </el-input>
    </span>
    <el-scrollbar v-loading="loading">
      <el-empty description="暂无数据" v-show="detail.length == 0"></el-empty>
      <p v-for="(str, index) in detail" :key="index" class="item">{{ str }}</p>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
import { getLogDetail, exportExcel } from "api/serviceResource";

export default {
  name: "VisitlogShow",
  data() {
    return {
      loading: false,
      isVisible: false,
      detail: [],
      copyMsg: "暂无数据",
      rowData: {},
      keyWords: "",
    };
  },
  methods: {
    open(row) {
      this.rowData = row;
      this.isVisible = true;
      this.search();
    },
    search() {
      this.detail = [];
      if (!this.rowData.traceId) {
        return;
      }
      this.loading = true;
      getLogDetail({
        traceId: this.rowData?.traceId || "",
        content: this.keyWords || "",
      })
        .then((res) => {
          this.loading = false;
          this.detail = res.result;
          this.copyMsg = this.getCopy(res.result);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    close() {
      this.keyWords = "";
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
    // 下载
    async downFuc() {
      try {
        let res = await exportExcel(this.rowData.traceId);
        console.log("下载日志下载日志下载日志", res);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName(
            "schemeOperationMonitorShow"
          )[0];
          var a = document.createElement("a");
          a.setAttribute("id", "billHref");
          a.download = "日志.xls";
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
        };
      } catch (error) {}
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