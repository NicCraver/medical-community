<!-- 
  @description 采集监控-数据对账-业务对账
  @date
 -->
<template>
  <div class="account-business">
    <div class="protitle">业务对账</div>
    <div class="promain">
      <div class="business">
        <div class="business-left">
          <header class="head">机构列表</header>
          <div class="left-list" v-loading="loadingL">
            <div class="items overflow-point" :class="{ selected: currentIndex === index }" v-for="(item, index) in lists" :key="index" :title="item.label" @click="itemClick(index)">
              {{ item.label }}
            </div>
          </div>
        </div>
        <div class="business-right">
          <header class="head">对账明细</header>
          <div class="title">
            医院名称：
            <span class="tit-cont">
              {{ currentIndex > -1 ? lists[currentIndex].label || "" : "" }}
            </span>
          </div>
          <div class="cont">
            <ProTable>
              <template #header>
                <el-select size="small" placeholder="业务分类" v-model="queryParams.bizType" clearable>
                  <el-option v-for="(item, index) in bizTypeOptions" :key="index" :value="item.code" :label="item.name"></el-option>
                </el-select>
                <el-input size="small" placeholder="业务表/业务指标" v-model="queryParams.indicatorName" clearable></el-input>
                <el-date-picker size="small" v-model="queryParams.date" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至" value-format="yyyy-MM-dd" format="yyyy-MM-dd" clearable></el-date-picker>
              </template>
              <template #actions>
                <el-button size="small" type="primary" @click="search">搜索</el-button>
                <el-button size="small" @click="reset">重置</el-button>
              </template>
              <el-table ref="table" v-adaptive="{ bottomOffset: 105 }" width="100%" height="0" :data="tableData" v-loading="loading" border>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column class="overflow-point" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" :fixed="item.fixed">
                  <template slot-scope="scope">{{ scope.row[item.prop] }}</template>
                </el-table-column>
              </el-table>
              <div class="pagination-cont">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationObj.pageNum" :page-sizes="paginationObj.pageSizes" :page-size="paginationObj.pageSize" :layout="paginationObj.layout" :total="paginationObj.total">
                </el-pagination>
              </div>
            </ProTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import { getHosOptions, getDockBalanceAccounts } from "api/indicator.js";
import { deepClone, getCodesListFuc } from "utils/utils";

export default {
  name: "business",
  components: {
    ProTable,
  },
  data() {
    return {
      lists: [],
      currentIndex: -1,
      queryParams: {},
      bizTypeOptions: [],
      loadingL: false,
      loading: false,
      paginationObj: {
        pageSizes: [20, 100, 200, 300],
        pageSize: 20,
        pageNum: 1,
        layout: "total,sizes,prev,pager,next,jumper",
        total: 0,
      },
      tableColumn: [
        { prop: "createdTime", label: "对账日期", width: "120" },
        { prop: "bizType", label: "业务分类", width: "180" },
        { prop: "bizTbEn", label: "业务表名", width: "180" },
        { prop: "indicatorName", label: "业务指标", width: "180" },
        { prop: "orgStatistic", label: "机构上传量", width: "100" },
        { prop: "platformStatistic", label: "平台统计量", width: "100" },
        { prop: "resultStatistic", label: "对账结果", width: "100" },
      ],
      tableData: [],
    };
  },
  created() {
    this.getOptions();
    this.getHosOptionsFuc();
  },
  methods: {
    // 获取业务分类options
    getOptions() {
      let list = getCodesListFuc("BIZ_TYPE");
      this.bizTypeOptions = deepClone(list);
    },
    // 获取机构列表
    async getHosOptionsFuc() {
      try {
        this.loadingL = true;
        let { result, code } = await getHosOptions();
        console.log("查询机构数据：", result);
        if (code === 0) {
          this.lists = result;
          if (this.lists && this.lists.length) {
            this.itemClick(0);
          }
        }
      } catch (error) {
      } finally {
        this.loadingL = false;
      }
    },
    itemClick(index) {
      this.currentIndex = index;
      this.getTableData();
    },
    search() {
      this.paginationObj.pageNum = 1;
      this.getTableData();
    },
    reset() {
      this.queryParams = {};
    },
    async getTableData() {
      this.loading = true;
      try {
        let date = this.queryParams.date || [];
        let startTime = date.length ? date[0] : "";
        let endTime = date.length ? date[1] : "";

        let params = {
          pageNum: this.paginationObj.pageNum,
          pageSize: this.paginationObj.pageSize,
          ...this.queryParams,
          startTime,
          endTime,
          orgId:
            this.currentIndex <= -1
              ? ""
              : this.lists[this.currentIndex].value || "",
        };
        delete params.date;
        let { result, code, total } = await getDockBalanceAccounts(params);
        console.log("查询对账明细数据：", result);
        if (code === 0) {
          this.tableData = result;
          this.paginationObj.total = total;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleSizeChange(val) {
      this.paginationObj.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.paginationObj.pageNum = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="less" scoped>
.account-business {
  height: 100%;
}
.business {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .business-left {
    margin-right: 10px;
    width: 230px;
    height: 100%;
    background-color: #fff;
    .head::before {
      background-color: transparent;
    }
    .left-list {
      height: calc(100% - 40px);
      overflow-y: auto;
      .items {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        border-radius: 8px;
        background-color: #fff;
        color: #919191;
        font-size: 14px;
        font-family: Roboto;
        cursor: pointer;
      }
      .items.selected {
        background-color: rgba(237, 248, 254, 100);
        color: #4465bc;
      }
    }
  }
  .business-right {
    width: calc(100% - 240px);
    height: 100%;
    background-color: #fff;
    .title {
      height: 30px;
      line-height: 20px;
      padding: 10px;
      padding-bottom: 0;
      color: rgba(145, 145, 145, 100);
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
      .tit-cont {
        color: #333;
      }
    }

    .cont {
      padding: 10px;
      height: calc(100% - 60px);
      .pagination-cont {
        height: 32px;
        display: flex;
        justify-content: right;
      }
    }
  }
  .head {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e9e9e9;
    font-size: 16px;
    padding: 0 10px;
    color: #333;
  }
}
</style>