<template>
  <div class="checkRecord">
    <div class="utilsCls">
      <LFormtTitle class="utils_item" label="类型">
        <el-radio-group v-model="radio" @change="utilsChange">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">长期医嘱</el-radio>
          <el-radio :label="2">临时医嘱</el-radio>
        </el-radio-group>
      </LFormtTitle>
      <LFormtTitle class="utils_item" label="项目分类">
        <el-select v-model="value" placeholder="请选择" @change="utilsChange">
          <el-option v-for="item in options" :key="item.code" :label="item.value" :value="item.code">
          </el-option>
        </el-select>
      </LFormtTitle>
    </div>
    <div class="check-box" v-loading="tableLoading">
      <div class="maintable">
        <el-table ref="singleTable" highlight-current-row style="width: 100%" :data="tableData" height="100%" element-loading-text="列表正在加载中">
          <el-table-column class="overflow-point" v-for="(item, index) in tableNoDrugColumn" :key="index" show-overflow-tooltip :prop="item.prop" :min-width="item.width" :label="item.label" :fixed="item.fixed === true">
            <template slot-scope="scope">
              <template v-if="item.prop === 'yzlb'">
                <span code="CT05.10.013" :val="scope.row.yzlb" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop === 'yzxmFldm'">
                <span code="CV06.00.229" :val="scope.row.yzxmFldm" v-codeTransform></span>
              </template>
              <template v-else-if="item.prop === 'yizhunr'">
                <!-- 西药/成药类医嘱显示 -->
                <!-- 医嘱名称 + 计量 + 计量单位 + 用药途径 + 频次 + 备注 + 是否紧急 + 皮试结果 + 出院带药-->
                <div v-if="
                    scope.row.yzxmFldm == '11' || scope.row.yzxmFldm == '12'
                  ">
                  <span v-if="scope.row.yzmxMc">
                    {{ scope.row["yzmxMc"] }}
                  </span>
                  <!-- 计量 -->
                  <span v-if="scope.row.mcsyJl">
                    {{ scope.row["mcsyJl"] }}
                  </span>
                  <!-- 计量单位 -->
                  <span v-if="scope.row.mcsyJldw">
                    {{ scope.row["mcsyJldw"] }}
                  </span>
                  <!-- 用药途径 -->
                  <span v-if="scope.row.yytj">
                    {{ scope.row["yytj"] }}
                  </span>
                  <!-- 频次 -->
                  <span v-if="scope.row.yypdDm">
                    {{ scope.row["yypdDm"] }}
                  </span>
                  <!-- 备注 -->
                  <span v-if="scope.row.yzBzsm">
                    {{ scope.row["yzBzsm"] }}
                  </span>
                  <!-- 是否紧急 -->
                  <span class="isJi" v-if="scope.row.sfjj == 1"> 急 </span>
                  <!-- 皮试结果 -->
                  <!-- <span
                    v-if="scope.row.psqk"
                    class="psqk"
                    :class="psqkObj[scope.row['psqk']].class"
                  >
                    {{ psqkObj[scope.row["psqk"]].value || "" }}
                  </span> -->
                  <!-- 出院带药 -->
                  <span v-if="scope.row.yzlb == 3" class="yzlb">
                    出院带药
                  </span>
                </div>
                <!-- 草药类医嘱 -->
                <!-- 医嘱名称 + 计量 + 计量单位 + 中药煎煮法 + 频次 + 备注 + 总剂书 + 出院带药 -->
                <div v-else-if="scope.row.yzxmFldm == '13'">
                  <span v-if="scope.row.yzmxMc">
                    {{ scope.row["yzmxMc"] }}
                  </span>
                  <!-- 计量 -->
                  <span v-if="scope.row.mcsyJl">
                    {{ scope.row["mcsyJl"] }}
                  </span>
                  <!-- 计量单位 -->
                  <span v-if="scope.row.mcsyJldw">
                    {{ scope.row["mcsyJldw"] }}
                  </span>
                  <!-- 中药煎煮法 -->
                  <span v-if="scope.row.zyJzfDm">
                    {{ scope.row["zyJzfDm"] }}
                  </span>
                  <!-- 频次 -->
                  <span v-if="scope.row.yypdDm">
                    {{ scope.row["yypdDm"] }}
                  </span>
                  <!-- 备注 -->
                  <span v-if="scope.row.yzBzsm">
                    {{ scope.row["yzBzsm"] }}
                  </span>
                  <!-- 剂数 -->
                  <span v-if="scope.row.cfdts">
                    {{ scope.row["cfdts"] }}剂
                  </span>
                  <!-- 是否紧急 -->
                  <span class="isJi" v-if="scope.row.sfjj == 1"> 急 </span>
                  <!-- 出院带药 -->
                  <span v-if="scope.row.yzlb == 3" class="yzlb">
                    出院带药
                  </span>
                </div>
                <!-- 治疗类医嘱 -->
                <!-- 医嘱名称 + 单词数量 + 数量单位 + 频次 + 备注 -->
                <div v-else>
                  <span v-if="scope.row.yzmxMc">
                    {{ scope.row["yzmxMc"] }}
                  </span>
                  <!-- 单词数量 -->
                  <span v-if="scope.row.mcsySl">
                    {{ scope.row["mcsySl"] }}
                  </span>
                  <!-- 数量单位 -->
                  <span v-if="scope.row.mcsyJldw">
                    {{ scope.row["mcsySldw"] }}
                  </span>
                  <!-- 频次 -->
                  <span v-if="scope.row.yypdDm">
                    {{ scope.row["yypdDm"] }}
                  </span>
                  <!-- 备注 -->
                  <span v-if="scope.row.yzBzsm">
                    {{ scope.row["yzBzsm"] }}
                  </span>
                </div>
                <!-- <div v-else>
                  <span v-if="scope.row.yzmxMc">
                    {{ scope.row["yzmxMc"] }}
                  </span>
                </div> -->
              </template>
              <template v-else-if="item.prop === 'yzjlrXm'">
                {{doctorNamePrivacy(scope.row.yzjlrXm)}}
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import LFormtTitle from "@/components/LFormtTitle.vue";
import hosYiZhuCell from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/rpModule/hosYiZhuCell.vue";

import { searchAdviceDetails } from "@/api/modules/healthRecord/index.js";
import { mapGetters } from "vuex";

const yzxmFldmList = [
  {
    code: 0,
    value: "全部",
  },
  {
    code: 11,
    value: "西药",
  },
  {
    code: 12,
    value: "中成药",
  },
  {
    code: 13,
    value: "中草药",
  },
  {
    code: 21,
    value: "治疗",
  },
  {
    code: 22,
    value: "检验",
  },
  {
    code: 23,
    value: "检查",
  },
  {
    code: 24,
    value: "手术",
  },
  {
    code: 25,
    value: "麻醉",
  },
  {
    code: 26,
    value: "护理",
  },
  {
    code: 27,
    value: "膳食",
  },
  {
    code: 28,
    value: "输血",
  },
  {
    code: 29,
    value: "输氧",
  },
  {
    code: 31,
    value: "其他",
  },
  {
    code: 32,
    value: "转科",
  },
  {
    code: 33,
    value: "术后",
  },
  {
    code: 34,
    value: "出院",
  },
  {
    code: 35,
    value: "转院",
  },
  {
    code: 36,
    value: "死亡",
  },
  {
    code: 37,
    value: "产后",
  },
];

export default {
  name: "checkRecord",
  components: {
    LFormtTitle,
    hosYiZhuCell,
  },
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
      total: 0,
      pageSize: 100,
      currentPage4: 1,
      tableLoading: false,
      radio: 0,
      options: yzxmFldmList,
      value: 0,
      tableNoDrugColumn: [
        {
          prop: "yzlb",
          label: "类型",
          width: "100",
        },
        {
          prop: "yizhunr",
          label: "医嘱内容",
          width: "400",
        },
        {
          prop: "yzxmFldm",
          label: "项目分类",
          width: "100",
        },
        {
          prop: "yqYzkszxSj",
          label: "开始时间",
          width: "160",
        },
        {
          prop: "yqYztzZxsj",
          label: "停止时间",
          width: "160",
        },
        {
          prop: "yzjlrXm",
          label: "开嘱医生",
          width: "100",
        },
        {
          prop: "xdksMc",
          label: "执行科室",
          width: "100",
        },
      ],
      tableLoading: false,
      tableData: [],
      psqkObj: {
        0: { value: "否", class: "" },
        1: { value: "阳性", class: "psqk-red" },
        2: { value: "阴性", class: "psqk-green" },
      },
    };
  },
  computed: {
    ...mapGetters({
      doctorNamePrivacy: "base/doctorNamePrivacy",
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
        this.searchAdviceDetails();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.searchAdviceDetails();
  },
  methods: {
    handleSizeChange(val) {
      this.resetPage();
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.searchAdviceDetails();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage4 = val;
      this.searchAdviceDetails();
    },
    resetPage() {
      this.total = 0;
      this.pageSize = 100;
      this.currentPage4 = 1;
    },
    utilsChange() {
      this.resetPage();
      this.searchAdviceDetails();
    },
    async searchAdviceDetails() {
      this.tableLoading = true;
      try {
        let aa = String(this.value);
        if (aa == 0) {
          aa = "";
        }

        let bb = String(this.radio);
        if (bb == 0) {
          bb = "";
        }

        let { result, desc, code } = await searchAdviceDetails({
          zyjzlsh: this.navBarObj.serialNumber,
          yljgdm: this.navBarObj.hosCode,
          yzlb: bb,
          yzxmFldm: aa,
          pageNo: String(this.currentPage4),
          pageSize: this.pageSize,
        });
        console.log("住院医嘱信息：", result);
        let { records, total, size, current } = result;
        if (code == 0) {
          this.tableData = records;
          this.total = total;
          this.currentPage4 = current;
          this.pageSize = size;
        } else {
          // this.$message.error(desc || "医嘱数据获取错误！");
        }
      } catch (error) {
      } finally {
        this.tableLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checkRecord {
  width: 100%;
  height: calc(100% - 10px);
  display: flex;
  flex-direction: column;
  .check-box {
    flex: 1;
    border: 1px solid #ebeef5;
    border-bottom: none;
    ::v-deep.el-table thead {
      color: #919191;
    }
    .el-table {
      color: #101010;
      .el-table__cell {
        padding: 4px 0;
      }
      ::v-deep th {
        padding: 7px 0;
      }
      ::v-deep td {
        padding: 8px 0;
        color: #333333 !important;
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

.check-box {
  display: flex;
  flex-direction: column;
  // height:calc(100% - 82px);
  position: relative;
  flex: 1;
  .maintable {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.pagination {
  height: 40px;
}

.utilsCls {
  padding-bottom: 12px;
}

.utils_item + .utils_item {
  margin-left: 63px;
}

.isJi {
  width: 22px;
  height: 21px;
  line-height: 21px;
  color: #e70f0f;
  font-size: 12px;
  text-align: center;
  font-family: Roboto;
  border: 1px solid rgba(231, 15, 15, 100);
  display: inline-block;
}
.psqk {
  margin-left: 10px;
}
.psqk-green {
  color: rgba(56, 169, 126, 100);
}
.psqk-red {
  color: #e70f0f;
}
.yzlb {
  margin-left: 10px;
  width: 60px;
  height: 21px;
  line-height: 21px;
  color: rgba(94, 132, 215, 100);
  font-size: 12px;
  text-align: center;
  font-family: Roboto;
  border: 1px solid rgba(94, 132, 215, 100);
  display: inline-block;
}
</style>
