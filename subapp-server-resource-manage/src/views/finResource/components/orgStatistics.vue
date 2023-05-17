<template>
  <el-card class="orgStatistics">
    <div class="title">
      <div class="title-info">
        <span>医疗机构数据统计</span>
        <i class="el-icon-download" @click="downloadFuc"></i>
      </div>
      <div class="date-select">
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          size="small"
          style="width: 250px"
          @change="dateChange"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="cont">
      <el-table ref="singleTable" border stripe height="100%" :data="tableData">
        <el-table-column
          label="排名"
          type="index"
          width="60"
          align="center"
        >
          <template slot-scope="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          class="overflow-point"
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :header-align="item.headerAlign || 'center'"
          :align="item.align || 'center'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row[item.prop] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
<script>
import { listOrgDataStatistics, ehrBalanceExportExcel } from "api/finResource.js";

export default {
  name: "orgStatistics",
  data() {
    return {
      loading: false,
      dateVal: [],
      tableColumn: [
        { prop: "orgName", label: "医疗机构", width: "150", align: "left" },
        { prop: "emrCount", label: "电子病历", width: "80" },
        { prop: "adviceCount", label: "处方", width: "70" },
        { prop: "risCount", label: "检查", width: "70" },
        { prop: "lisCount", label: "检验", width: "70" },
        { prop: "medicalExamCount", label: "体检", width: "70" },
        { prop: "mrhpCount", label: "病案", width: "70" },
        { prop: "updatedTime", label: "更新时间", width: "150" },
      ],
      tableData: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    dateChange() {
      this.getData();
    },
    async getData() {
      this.loading = true;
      let startDate =
        this.dataVal && this.dataVal.length ? this.dataVal[0] : "";
      let endDate = this.dataVal && this.dataVal.length ? this.dataVal[1] : "";
      try {
        let params = {
          startDate,
          endDate,
        };
        let { result, code } = await listOrgDataStatistics(params);
        if (code === 0) {
          console.log("医疗机构数据统计:", result);
          this.tableData = result;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 导出
    async downloadFuc() {
      let startDate =
        this.dataVal && this.dataVal.length ? this.dataVal[0] : "";
      let endDate = this.dataVal && this.dataVal.length ? this.dataVal[1] : "";
      let params = {
        startDate,
        endDate,
      };
      let res = await ehrBalanceExportExcel(params);
      var blob = res.data;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("orgStatistics")[0];
        var a = document.createElement("a");
        a.setAttribute("id", "billHref");
        a.download = "医疗机构数据统计.xlsx";
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      };
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
      i {
        color: #446abd;
      }
    }
  }
  .cont {
    height: calc(100% - 40px);
  }
}
</style>