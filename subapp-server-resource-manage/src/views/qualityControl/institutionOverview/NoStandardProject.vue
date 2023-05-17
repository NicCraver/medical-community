<!--
  @description 机构质控-质控未达标项目
  @date 2022/04/11
-->
<template>
  <el-card>
    <header>
      <span>质控未达标项目</span>
      <IconSvg icon-class="download" width="16" height="16"></IconSvg>
    </header>
    <el-table ref="table" height="0" empty-text="数据质量良好，无未达标规则～～" v-adaptive="{ bottomOffset: 20 }" v-loading="loading" :data="tableData" :cell-style="$parent.cellStyle" border stripe>
      <el-table-column label="排名" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="业务表名称" prop="businessTable" min-width="150"></el-table-column>
      <el-table-column label="规则名称" prop="configName" min-width="150"></el-table-column>
      <el-table-column label="规则得分" prop="configScore"></el-table-column>
      <el-table-column label="质量指数" prop="massIndex"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getOrgUnstandard } from "api/qualityControl";

export default {
  props: {
    id: String,
    orgId: String,
  },
  data() {
    return {
      tableData: [],
      loading: false,
    };
  },
  watch: {
    orgId: function (val) {
      if (val) this.getData();
    },
  },
  methods: {
    getData() {
      this.loading = true;
      getOrgUnstandard({ id: this.id, orgId: this.orgId })
        .then(({ result, code }) => {
          if (code === 0) {
            this.tableData = result;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  height: 100%;
  header {
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
    span {
      font-size: 18px;
      font-weight: 700;
      margin-right: 10px;
    }
    .svg-icon {
      cursor: pointer;
    }
  }
}
</style>