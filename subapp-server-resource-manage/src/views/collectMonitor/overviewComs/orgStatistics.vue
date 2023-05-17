<template>
  <el-card class="orgStatistics">
    <div class="title">
      <div class="title-info">
        <span>机构来源统计</span>
        <img :src="require('img/collectMonitor/iconPark-refresh.png')" alt="" @click="getNatureData" />
      </div>
      <el-date-picker v-model="dataVal" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="getNatureData">
      </el-date-picker>
    </div>
    <div class="cont" v-loading="loading">
      <el-table ref="singleTable" stripe width="100%" :data="tableData">
        <el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>
        <el-table-column class="overflow-point" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" :header-align="item.headerAlign || 'center'" :align="item.align || 'center'" :fixed="item.fixed">
          <template slot-scope="scope">
            {{ scope.row[item.prop] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
<script>
import { getListOrgSourceStatistics } from "api/indicator.js";
export default {
  name: "orgStatistics",
  data() {
    return {
      loading: false,
      tableColumn: [
        { prop: "orgName", label: "机构名称", width: "150", align: "left" },
        { prop: "total", label: "累计条数", width: "90" },
        { prop: "current", label: "当日条数", width: "90" },
        { prop: "updatedTime", label: "更新时间", width: "120" },
      ],
      tableData: [],
      dataVal: [],
    };
  },
  created() {
    let date1 = this.dayjs(new Date()).format("YYYY-MM") + "-01";
    let date2 = this.dayjs(new Date()).format("YYYY-MM-DD");
    this.dataVal = [date1, date2];
    this.getNatureData();
  },
  methods: {
    async getNatureData() {
      this.loading = true;
      try {
        let startTime =
          this.dataVal && this.dataVal.length
            ? this.dataVal[0] + " 00:00:00"
            : "";
        let endTime =
          this.dataVal && this.dataVal.length
            ? this.dataVal[1] + " 23:59:59"
            : "";
        let params = {
          startTime,
          endTime,
        };
        let { result, code } = await getListOrgSourceStatistics(params);
        if (code === 0) {
          console.log("机构来源统计:", result);
          this.tableData = result;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.orgStatistics {
  height: 100%;
  .title {
    height: 30px;
    padding: 0 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(48, 49, 51, 100);
    font-size: 18px;
    font-family: SourceHanSansSC-medium;
    .title-info {
      display: flex;
      align-items: center;
      font-weight: 700;
      img {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        cursor: pointer;
      }
    }
  }
  .cont {
    height: calc(100% - 40px);
    overflow: auto;
    border: 1px solid #e9e9e9;
  }
}

::v-deep .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: 0px solid #e6e6e6;
}
::v-deep .el-table__cell {
  border-right: 1px solid #e9e9e9;
}
::v-deep tr .el-table__cell:last-child {
  border-right: none;
}
::v-deep thead tr .el-table__cell {
  background: #f2f2f2;
}
::v-deep
  .el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td.el-table__cell {
  background: #f2f2f2;
}
::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: #fff;
}
::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr.el-table__row--striped:hover
  > td.el-table__cell {
  background-color: #f2f2f2;
}
::v-deep thead tr .el-table__cell {
  border-bottom: none !important;
}
::v-deep thead tr .el-table__cell:nth-last-child(2) {
  border-right: none;
}
</style>