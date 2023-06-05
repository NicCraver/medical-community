<template>
  <div class="checkRecord">
    <el-table
      ref="singleTable"
      height="100%"
      highlight-current-row
      :data="tableData"
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
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="item.prop === 'leixing'">
            <el-button
              type="text"
              :disabled="!scope.row.reportUrl"
              @click="toLink(scope.row.reportUrl)"
              >报告</el-button
            >
            <el-button
              type="text"
              :disabled="!scope.row.imageUrl"
              @click="toLink(scope.row.imageUrl)"
              >图像</el-button
            >
          </template>
          <template v-else-if="item.prop === 'itemName'">
            <span>
              {{ scope.row.itemName }}
              <!-- <i class="national" v-if="scope.row.nationwide == 1">
                <IconSvg
                  iconClass="to-change"
                  width="14"
                  height="14"
                  style="vertical-align: middle"
                ></IconSvg
                >全国互认
              </i> -->
            </span>
          </template>
          <template v-else>{{ scope.row[item.prop] }}</template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRisExamRecordByOpVisit } from "@/api/modules/healthEvent/index.js";
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
      tableNoDrugColumn: [
        {
          prop: "itemName",
          width: "300",
          label: "项目名称",
        },
        {
          prop: "itemTypeName",
          width: "50",
          label: "分类",
        },
        {
          prop: "applyTime",
          width: "100",
          label: "申请时间",
        },
        {
          prop: "execDeptName",
          width: "50",
          label: "检查科室",
        },

        {
          prop: "reportTime",
          width: "100",
          label: "报告时间",
        },
        {
          prop: "isPositive",
          width: "50",
          label: "是否阳性",
        },
        /* {
          prop: "leixing",
          width: "60",
          label: "操作",
        }, */
      ],
      tableLoading: false,
      tableData: [],
    };
  },
  watch: {
    personalInfos: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {},
      deep: true,
    },
    navBarObj: {
      handler(val) {
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
      try {
        let res = await getRisExamRecordByOpVisit({
          visitId: this.navBarObj.serialNumber,
          hosCode: this.navBarObj.hosCode || ""
        });
        this.tableData = [];
        console.log("门诊-检查记录", res);
        if (res.code === 0) {
          this.tableData = res.result;
        } else {
          this.tableData = [];
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.checkRecord {
  width: 100%;
  height: calc(100% - 1px);
  border: 1px solid #ebeef5;
  border-bottom: none;
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
}
</style>
