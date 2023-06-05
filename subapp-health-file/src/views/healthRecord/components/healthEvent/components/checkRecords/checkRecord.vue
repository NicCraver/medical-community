<template>
  <div class="checkRecord" v-loading="tableLoading">
    <div class="check-box">
      <el-table
        ref="singleTable"
        highlight-current-row
        width="100%"
        height="100%"
        :data="tableData"
        :span-method="spanMethod"
        element-loading-text="列表正在加载中"
      >
        <el-table-column
          class="overflow-point"
          v-for="(item, index) in tableNoDrugColumn"
          :key="index"
          :prop="item.prop"
          :min-width="item.width"
          :label="item.label"
          :fixed="item.fixed === true"
        >
          <template slot-scope="scope">
            <template v-if="item.prop === 'leixing'">
              <span v-if="!scope.row.reportUrl && !scope.row.imageUrl">-</span>
              <span v-else>
                <el-button
                  type="text"
                  v-if="scope.row.reportUrl"
                  @click="toLink(scope.row.reportUrl)"
                  >报告</el-button
                >
                <el-button
                  type="text"
                  v-if="scope.row.imageUrl"
                  @click="toLink(scope.row.imageUrl)"
                  >图像</el-button
                >
              </span>
            </template>
            <template v-else-if="item.prop === 'itemName'">
              <span v-if="!scope.row.itemNameSecond">
                {{ scope.row.itemName }}
                <span class="benci" v-if="scope.row.itemNameFirst"
                  >（本次）</span
                >
                <!-- <i class="national" v-if="scope.row.nationwide == 1"
                  ><IconSvg
                    iconClass="to-change"
                    width="14"
                    height="14"
                    style="vertical-align: middle"
                  ></IconSvg
                  >全国互认</i
                > -->
              </span>
              <span v-else>
                <el-divider content-position="center"
                  >历次同类检查报告</el-divider
                >
              </span>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNum"
          :page-sizes="[20, 50, 100, 200, 300]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { listSameRisRecord } from "@/api/modules/healthEvent/index.js";
import { mapGetters } from "vuex";

export default {
  name: "checkRecord",
  components: {},
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
    // 导航传过来的内容
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      pageParams: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      tableNoDrugColumn: [
        {
          prop: "itemName",
          width: "200",
          label: "项目名称",
        },
        {
          prop: "itemTypeName",
          label: "分类",
        },
        {
          prop: "applyTime",
          width: "120",
          label: "申请时间",
        },
        {
          prop: "execDeptName",
          label: "检查科室",
        },
        {
          prop: "reportTime",
          width: "120",
          label: "报告时间",
        },
        {
          prop: "hosName",
          width: "120",
          label: "报告机构",
        },
        {
          prop: "isPositive",
          width: "80",
          label: "是否阳性",
        },
        /* {
          prop: "leixing",
          width: "120",
          label: "类型",
        }, */
      ],
      tableLoading: false,
      tableData: [],
    };
  },
  computed: {
    ...mapGetters({
      personalArchInfo: "base/personalArchInfo",
    }),
  },
  watch: {
    personalInfos: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {},
      deep: true,
    },
    navBarObj: {
      handler(val) {
        this.pageParams.total = 0;
        this.pageParams.pageNum = 1;
        this.getList();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    toLink(url) {
      window.open(url, "_blank");
    },
    async getList() {
      this.tableLoading = true;
      this.tableData = [];
      try {
        let archiveInfo = this.personalArchInfo || {};
        let certId = archiveInfo.personalArchiveInfo
          ? archiveInfo.personalArchiveInfo.certId || ""
          : "";
        let certType = archiveInfo.personalArchiveInfo
          ? archiveInfo.personalArchiveInfo.certType || ""
          : "";
        let params = {
          risItemCode: this.navBarObj.serialNumber || "",
          certId,
          certType,
          hosCode: this.navBarObj.hosCode || "",
          pageNum: this.pageParams.pageNum,
          pageSize: this.pageParams.pageSize,
        };
        let res = await listSameRisRecord(params);
        console.log("查询相同类型的检查记录", res);
        if (res.code === 0) {
          this.pageParams.total = res.total;
          let tableData1 = [];
          let tableData2 = [];
          let tableData = [];
          if (this.pageParams.pageNum == 1) {
            if (res.result.length > 0) {
              tableData1 = [{ ...res.result[0], itemNameFirst: true }];
            }
            if (res.result.length > 1) {
              tableData2 = res.result.slice(1);
              tableData = tableData1.concat([
                { itemName: "历次同类检查报告", itemNameSecond: true },
              ]);
            } else {
              tableData = tableData1;
            }
            this.tableData = tableData.concat(tableData2);
          } else if (res.result.length > 0) {
            let row = [{ itemName: "历次同类检查报告", itemNameSecond: true }];
            this.tableData = row.concat(res.result);
          }
        }
      } catch (error) {
      } finally {
        this.tableLoading = false;
      }
    },
    handleSizeChange(val) {
      this.pageParams.total = 0;
      this.pageParams.pageNum = 1;
      this.pageParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.getList();
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.itemNameSecond) {
        return [1, this.tableNoDrugColumn.length];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checkRecord {
  width: 100%;
  height: 100%;
  .check-box {
    height: calc(100% - 50px);
    border: 1px solid #ebeef5;
    border-bottom: none;
    .benci {
      color: rgba(87, 181, 170, 100);
      font-size: 12px;
      font-family: SourceHanSansSC-regular;
    }
    ::v-deep.el-table thead {
      color: #919191;
    }
    .el-table {
      color: #333333;
      .el-table__cell {
        padding: 4px 0;
      }
      ::v-deep th {
        padding: 7px 0;
      }
      ::v-deep td {
        padding: 4px 0;
      }
      ::v-deep thead th {
        background-color: #f7f7f7 !important;
        color: #919191;
      }
    }
    .national {
      color: #50aea3;
      padding: 2px 3px;
      font-weight: bold;
      font-size: 10px;
      border: 1px solid #50aea3;
      margin: 4px;
    }
    .his {
      line-height: 40px;
      text-align: center;
      color: #333;
      border-bottom: 1px solid #ebeef5;
      overflow: hidden;
      height: 40px;
      padding: 10px;
      padding-top: 0;
      /* i{
        width: 51.8%;
        height: 1px;
        background: #e5e5e5;
        display: block;
        position: absolute;
        top: 20px;
        left: 50%;
        margin-left: -25.9%;
        z-index: 1;
      }
      span{
        position: absolute;

        z-index: 2;
      } */
    }
  }
}
</style>
