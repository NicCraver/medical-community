<!--
  @description 机构质控-质控规则排名
  @date 2022/04/11
-->
<template>
  <el-card v-loading="loading">
    <header>
      <span>质控规则排名</span>
      <el-select size="small" v-model="type" @change="selectChange">
        <el-option v-for="item in typeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-select size="small" v-model="order" @change="getData">
        <el-option v-for="item in orderData" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
    </header>
    <div class="info">
      <span>规则条数：{{rankData.total}}条</span>
      <span class="fr">时间范围：{{rankData.dataStartDate?rankData.dataStartDate+'-'+rankData.dataEndDate:'累计'}}</span>
    </div>
    <el-table ref="table" height="0" v-adaptive="{ bottomOffset: 52 }" :data="rankData.orgScores" :cell-style="$parent.cellStyle">
      <el-table-column label="" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="规则名称" prop="configName"></el-table-column>
      <el-table-column label="规则得分" prop="configScore" align="center"></el-table-column>
    </el-table>
    <footer v-show="rankData.total > 10 && type==1">
      <el-button type="text" @click="more">查看更多</el-button>
    </footer>
  </el-card>
</template>

<script>
import { getOrgConfigRank } from "api/qualityControl";

export default {
  props: {
    id: String,
    orgId: String,
  },
  data() {
    return {
      order: "1",
      orderData: [
        { value: "0", label: "升序" },
        { value: "1", label: "降序" },
      ],
      type: "2",
      typeData: [
        { value: "1", label: "全部" },
        { value: "2", label: "top 10" },
      ],
      rankData: {
        total: 0,
        dataStartDate: "",
        dataEndDate: "",
        orgScores: [],
      },
      pageSize: 10,
      loading: false,
    };
  },
  watch: {
    orgId: function (val) {
      if (val) {
        this.order = "1";
        this.type = "2";
        this.getData();
      }
    },
  },
  methods: {
    getData() {
      let p = { id: this.id, orgId: this.orgId, asc: this.order };
      if (this.type == 1) {
        p.pageSize = this.pageSize;
        p.pageNum = 1;
      }
      this.loading = true;
      getOrgConfigRank(p)
        .then(({ code, result }) => {
          if (code === 0) {
            this.rankData = result;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    selectChange(val) {
      this.pageSize = 10;
      this.getData();
    },
    more() {
      this.pageSize += 10;
      this.getData();
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  height: 100%;
  ::v-deep .el-card__body {
    padding: 0;
  }
  header {
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 10px;
    span {
      font-size: 18px;
      font-weight: 700;
      margin-right: 10px;
    }
    .el-select {
      float: right;
      width: 90px;
      margin-left: 10px;
    }
  }
  .info {
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    padding: 0 10px;
    margin-bottom: 10px;
  }
  .el-table {
    padding: 0 10px;
  }
  footer {
    height: 32px;
    text-align: center;
    .el-button {
      line-height: 32px;
    }
  }
}
</style>