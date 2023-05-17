<!--
  @description 质控board-机构总览-一致/整合/完整/及时性总览-查看
  @date 2022/07/14
-->
<template>
  <el-drawer size="50%" :visible.sync="isVisible" :before-close="close">
    <template #title>
      <div class="head">查看</div>
    </template>
    <div class="detail-drawer-main" v-loading="downLoading" element-loading-text="下载中...">
      <div class="title">规则信息</div>
      <el-descriptions :column="2" :labelStyle="descStyle" :contentStyle="descStyle" labelClassName="desc-label" contentClassName="desc-content">
        <el-descriptions-item label="规则名称">{{detailData.ruleName}}</el-descriptions-item>
        <el-descriptions-item label="数据范围">
          {{detailData.startTime?dayjs(detailData.startTime).format('YYYY-MM-DD HH:mm')+'至'+dayjs(detailData.endTime).format('YYYY-MM-DD HH:mm'):'累计'}}
        </el-descriptions-item>
        <el-descriptions-item label="业务表名">{{detailData.tableName}}</el-descriptions-item>
        <el-descriptions-item label="执行时间">
          {{detailData.executeStartTime?dayjs(detailData.executeStartTime).format('YYYY-MM-DD HH:mm')+'至'+dayjs(detailData.executeEndTime).format('YYYY-MM-DD HH:mm'):'--'}}</el-descriptions-item>
      </el-descriptions>
      <div class="title">
        <span>{{detailData.failLabel}}</span>
        <span @click="download">
          <IconSvg icon-class="download" width="16" height="16"></IconSvg>
        </span>
      </div>
      <el-table v-adaptive="{ bottomOffset: 105 }" height="0" :data="detailData.dataList" v-loading="loading" element-loading-text="数据量较大,拼命加载中..." highlight-current-row border stripe>
        <el-table-column type="index" label="序号" width="50" align="center">
          <template slot-scope="{$index}">
            <span>{{ $index + 1 + (pageNum - 1) * pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in detailData.headList" :key="index" :label="item" width="100">
          <template slot-scope="{row}">{{row[index]}}</template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageSize" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <footer>
        <el-button size="small" @click="close">返回</el-button>
      </footer>
    </div>
  </el-drawer>
</template>

<script>
import { getOrgLogData, orgLogExport } from "api/qualityControl";

export default {
  data() {
    return {
      isVisible: false,
      param: {},
      detailData: {},
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      total: 0, //总条数
      downLoading: false,
    };
  },
  computed: {
    descStyle() {
      return {
        color: "#303133",
      };
    },
  },
  methods: {
    open(param, row) {
      this.detailData = {
        ruleName: row.configName,
        tableName: row.businessTable,
        failLabel: row.failLabel,
      };
      this.param = param;
      this.isVisible = true;
      this.getTableData();
    },
    close() {
      this.detailData = {};
      this.pageNum = 1;
      this.pageSize = 10;
      this.isVisible = false;
    },
    // 获取不一致记录
    getTableData() {
      this.loading = true;
      getOrgLogData({
        ...this.param,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then(({ result, code, total }) => {
          if (code === 0) {
            this.detailData = {
              ...this.detailData,
              ...result,
            };
            this.total = total;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 下载
    download() {
      let name =
        this.detailData.ruleName + "-" + this.detailData.failLabel + ".xls";
      this.downLoading = true;
      orgLogExport(this.param)
        .then((res) => {
          var blob = res;
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = function (e) {
            var parent =
              document.getElementsByClassName("detail-drawer-main")[0];
            var a = document.createElement("a");
            a.setAttribute("id", "billHref");
            a.download = name;
            a.href = e.target.result;
            parent.appendChild(a);
            let aDom = document.getElementById("billHref");
            aDom.click();
            parent.removeChild(aDom);
          };
          this.downLoading = false;
        })
        .catch(() => {
          this.downLoading = false;
        });
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-drawer__header {
  padding: 5px 10px 5px 0;
  margin-bottom: 0;
  border-bottom: 1px solid #e9e9e9;
  color: #303133;
}
.detail-drawer-main {
  .title {
    margin: 10px 0;
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    padding: 0 10px;
    .svg-icon {
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .el-descriptions {
    margin: 10px;
  }
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    border-top: 1px solid #e9e9e9;
    .el-button {
      float: right;
      margin-top: 9px;
      &:first-child {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
.desc-label {
  color: red;
}
</style>