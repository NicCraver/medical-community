<!--
  @description 质控board-区域总览-机构质控数据统计
  @date 2022/04/01
-->
<template>
  <el-card v-loading="loading">
    <header>
      <span>医疗机构数据统计</span>
      <span @click="$refs.large.open(tableData)">
        <IconSvg icon-class="full-screen" width="16" height="16"></IconSvg>
      </span>
      <el-select size="small" v-model="runLogId" @change="getData">
        <el-option v-for="item in selectData" :key="item.id" :value="item.id" :label="dayjs(item.executeStartTime).format('YYYY-MM-DD HH:mm')+'至'+dayjs(item.executeEndTime).format('YYYY-MM-DD HH:mm')"></el-option>
      </el-select>
    </header>
    <el-table ref="table" height="0" v-adaptive="{ bottomOffset: 20 }" :data="tableData" :cell-style="cellStyle" border stripe>
      <el-table-column label="排名" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="医疗机构" prop="orgName" min-width="150"></el-table-column>
      <el-table-column label="机构得分" prop="sumScore"></el-table-column>
      <el-table-column label="一致性得分" prop="consistencyScore">
        <template slot-scope="{row}">{{row.consistencyScore ==null? '--':row.consistencyScore}} </template>
      </el-table-column>
      <el-table-column label="整合性得分" prop="integrationScore">
        <template slot-scope="{row}">{{row.integrationScore ==null? '--':row.integrationScore}} </template>
      </el-table-column>
      <el-table-column label="完整性得分" prop="completeScore">
        <template slot-scope="{row}">{{row.completeScore ==null? '--':row.completeScore}} </template>
      </el-table-column>
      <el-table-column label="及时性得分" prop="timelinessScore">
        <template slot-scope="{row}">{{row.timelinessScore ==null? '--':row.timelinessScore}} </template>
      </el-table-column>
      <el-table-column label="执行时间" prop="executeTime" min-width="120"></el-table-column>
      <el-table-column label="计分周期" min-width="180">
        <template slot-scope="{row}">
          {{row.dataStartDate?row.dataStartDate+'至'+row.dataEndDate:'累计'}}
        </template>
      </el-table-column>
    </el-table>

    <DataCountLarge ref="large" :cellStyle="cellStyle"></DataCountLarge>
  </el-card>
</template>

<script>
import DataCountLarge from "./DataCountLarge.vue";
import { getOrgDataCount } from "api/qualityControl";
import { getRulePlanRunLogList } from "api/schemeOperationMonitor";

export default {
  components: { DataCountLarge },
  props: {
    id: String,
    cellStyle: Function,
  },
  data() {
    return {
      runLogId: "",
      selectData: [], //右侧下拉选项
      tableData: [],
      pageSize: 10,
      selectElement: null,
      loading: false,
    };
  },
  watch: {
    id: function (val) {
      this.getSelectData(true);
    },
  },
  mounted() {
    const loadSelectElement = document.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    this.selectElement = loadSelectElement;
  },
  methods: {
    getSelectData(isFirst) {
      let p = {
        rulePlanId: this.id,
        runResult: 1,
        pageNum: 1,
        pageSize: isFirst ? 10 : this.pageSize,
      };
      getRulePlanRunLogList(p).then(({ result, code, total }) => {
        if (code === 0) {
          this.selectData = result;
          if (isFirst) {
            this.runLogId = result[0]?.id;
            if (this.runLogId) {
              this.getData(this.runLogId);
            } else {
              this.tableData = [];
            }
            this.pageSize = 10;
            if (total > 10) {
              this.selectElement.addEventListener(
                "scroll",
                this.scrollLoadData
              );
            }
          } else if (this.pageSize >= total) {
            //如果已加载完全部数据，取消监听
            this.selectElement.removeEventListener(
              "scroll",
              this.scrollLoadData
            );
          }
        }
      });
    },
    getData(id) {
      let p = { id: this.id, runLogId: id };
      this.loading = true;
      getOrgDataCount(p)
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
    // 无限滚动
    scrollLoadData() {
      // 当滚动条高度等于卷入高度+可视高度时，说明到达底部，scrollHeight :滚动条高度，scrollTop ：已卷入不可见的滚动条高度，clientHeight：可见的滚动条高度。
      const scrollDistance =
        this.selectElement.scrollHeight -
        this.selectElement.scrollTop -
        this.selectElement.clientHeight;
      // 非搜索
      if (scrollDistance <= 0) {
        //页码依次加1
        this.pageSize += 5;
        this.getSelectData();
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.selectElement.removeEventListener("scroll", this.scrollLoadData);
    next();
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
    .el-select {
      float: right;
      width: 300px;
    }
  }
}
</style>