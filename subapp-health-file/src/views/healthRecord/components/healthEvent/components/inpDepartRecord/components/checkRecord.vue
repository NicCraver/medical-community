<template>
  <div class="checkRecord">
    <div class="check-box">
      <el-table
        ref="singleTable"
        highlight-current-row
        style="width: 100%"
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
              <span
                >{{ scope.row.itemName
                }}<!-- <i class="national" v-if="scope.row.nationwide == 1"
                  ><IconSvg
                    iconClass="to-change"
                    width="14"
                    height="14"
                    style="vertical-align: middle"
                  ></IconSvg
                  >全国互认</i
                > --></span
              >
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getRisExamRecordByIpReg } from "@/api/modules/healthEvent";

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
          prop: "isPositive",
          width: "80",
          label: "是否阳性",
        },
        /* {
          prop: "leixing",
          width: "120",
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
        console.log(987654321, val.serialNumber);
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
        let res = await getRisExamRecordByIpReg({
          regId: this.navBarObj.serialNumber,
          hosCode: this.navBarObj.hosCode || ""
        });
        this.tableData = [];
        console.log("住院-检查记录", res);
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
  height: 100%;
  .check-box {
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
}
</style>
