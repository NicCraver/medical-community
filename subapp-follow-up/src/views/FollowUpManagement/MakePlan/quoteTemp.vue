<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    :before-close="handleClose"
    width="900px"
  >
    <template #title>
      <div class="title">
        引用模板
        <span style="margin-left: 15px; color: #919191; font-size: 14px"
          >引用模版后请再次确认“
          <i style="color: #4468bd">提醒</i>
          “事项
        </span>
      </div>
    </template>
    <el-row :gutter="10" class="nav-bar">
      <el-col :span="8">
        模版名称
        <el-input
          v-model="searchParam.templateDesc"
          placeholder="请输入"
          class="input-item"
        ></el-input>
      </el-col>
      <el-col :span="8">
        适用病种
        <el-select
          v-model="searchParam.deasease"
          placeholder="筛选病种"
          class="input-item"
        >
          <el-option
            v-for="(item, index) in deaseaseList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <!-- <el-col :span="8">
        适用科室
        <el-select
          v-model="searchParam.dept"
          placeholder="筛选科室"
          class="input-item"
        >
          <el-option
            v-for="(item, index) in deptList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col> -->
      <el-col :span="8" style="text-align: right">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <div class="table-cont">
      <el-table :data="tableData" border height="300px">
        <el-table-column
          v-for="(item, index) in columnList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="{ row, $index }">
            <template v-if="item.prop === 'operate'">
              <el-button type="text" @click="editTemp(row, $index)"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="quoteTemp(row, $index)"
                v-if="selectIndex === -1 || $index !== selectIndex"
                >引用本项</el-button
              >
              <el-button
                type="text"
                v-if="selectIndex !== -1 && $index === selectIndex"
                disabled
                >已引用</el-button
              >
            </template>
            <template v-else>
              {{ row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNum"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="sureFuc">确认</el-button>
    </span>
    <saveTemp
      v-if="saveTempVisible"
      :visible="saveTempVisible"
      :handleClose="saveTempClose"
      :planDetailFormTemp="editRow"
      :dateObj="dateObj"
      :followUpForms="followUpForms"
      :allDiseaseTypeList="allDiseaseTypeList"
      tempType="update"
      titleName="编辑模板"
    ></saveTemp>
  </el-dialog>
</template>

<script>
import saveTemp from "./saveTemp";
import { onQueryTemplates } from "@/api/modules/PatientCenter";
import { intToChinese } from "@/utils/utils.js";
import { frequencyUnitList, monthList } from "@/utils/data-map";

export default {
  name: "quoteTemp",
  components: { saveTemp },
  props: {
    visible: Boolean,
    handleClose: Function,
    followUpForms: Array,
    allDiseaseTypeList: Array,
  },
  data() {
    return {
      searchParam: {},
      deaseaseList: [],
      deptList: [],
      columnList: [
        {
          prop: "templateDesc",
          label: "模版名称",
          width: 120,
        },
        {
          prop: "diseaseName",
          label: "适用病种",
          width: 100,
        },
        /* {
          prop: "deptName",
          label: "适用科室",
          width: 120,
        }, */
        {
          prop: "templateDataRules",
          label: "模版规则",
          width: 500,
        },
        {
          prop: "modDate",
          label: "更新时间",
          width: 180,
        },
        {
          prop: "operate",
          label: "操作",
          width: 150,
          fixed: "right",
        },
      ],
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      saveTempVisible: false, //新增模板
      editRow: {}, //编辑的数据
      dateObj: {},
      allFollowupTimes: 0,
      selectIndex: -1, //选中的引用模板
    };
  },
  computed: {},
  created() {
    this.search();
  },
  methods: {
    // 重置
    reset() {
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.searchParam = {
        templateDesc: "",
        deasease: "",
        dept: "",
      };
      this.search();
    },
    // 查询模板列表
    async search() {
      try {
        let params = {
          ...this.pageParams,
          type: "FREQUENCY",
          templateDesc: this.searchParam.templateDesc,
          deseaseList: this.searchParam.deasease,
          //   deptList: this.searchParam.dept,
        };
        let res = await onQueryTemplates(params);
        if (res.code === 0) {
          this.pageParams.total = res?.result?.total || 0;
          let tableData = this.handleTableData(res?.result?.records || []);
          console.log("tableData:", JSON.parse(JSON.stringify(tableData)));
          this.tableData = tableData;
        }
      } catch (error) {}
    },
    handleTableData(tableData) {
      let arr = tableData.map((item, index) => {
        let diseaseArr = item.disease.split(",");
        let diseaseName = this.getDiseaseName(diseaseArr);
        // let deptArr = item.dept.split(",");
        let templateData = item.templateData
          ? JSON.parse(item.templateData)
          : {};
        let rules = templateData?.frequencyRule || [];
        let ruleText = `${templateData.followupSize || 0}次随访；顺序为：`;
        let newRules = rules.map((vv, kk) => {
          let str = "";
          let followupDateTypeName = this.getFollowupDateTypeName(
            vv.followupDateType
          );
          if (vv.type === "1") {
            let frequencyUnitName = this.getFrequencyUnitName(vv.frequencyUnit);
            str = `${vv.frequencyTimes}${frequencyUnitName}的${followupDateTypeName}`;
          } else {
            if (vv.timeType === "customTime") {
              let timeContentName = this.getTimeContentName(vv.timeContent);
              str = `${timeContentName}的${followupDateTypeName}`;
            } else {
              str = `${vv.timeContent}`;
            }
          }
          return str;
        });
        let newRulesText = newRules.join("、");
        return {
          ...item,
          diseaseName,
          templateData,
          templateDataRules: ruleText + newRulesText,
        };
      });
      return arr;
    },
    handleSizeChange(val) {
      this.pageParams = {
        pageSize: val,
        pageNum: 1,
      };
      this.search();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.search();
    },
    // 编辑
    editTemp(row) {
      let editRow = {
        ...row,
        // dept: row.dept ? row.dept?.split(",") || [] : [],
        disease: row.disease ? row.disease?.split(",") || [] : [],
      };
      let dateObj = {};
      row.templateData.frequencyRule.map((item, index) => {
        if (
          item.timeType === "customTime" &&
          item?.followupDateTypeList?.length
        ) {
          dateObj[index] = item?.followupDateTypeList;
        }
      });

      delete editRow.templateDataRules;
      delete editRow.deptName;
      delete editRow.diseaseName;
      this.editRow = editRow;
      this.dateObj = dateObj;
      this.allFollowupTimes = row.templateData.followupSize;
      console.log("this.editRow", editRow, dateObj);
      this.saveTempVisible = true;
    },
    // 引用
    quoteTemp(row, index) {
      this.selectIndex = index;
    },
    // 确认
    sureFuc() {
      if (this.selectIndex < 0) {
        return;
      }
      let applyTemp = this.tableData[this.selectIndex];
      this.$emit("getApplyTemp", applyTemp);
    },
    saveTempClose() {
      this.saveTempVisible = false;
      this.search();
    },
    // 反显病种名称
    getDiseaseName(val) {
      let list = val || [];
      let name = [];
      list.map((item) => {
        this.allDiseaseTypeList.map((vv) => {
          if (item === vv.value) {
            name.push(vv.label);
          }
        });
      });
      return name.join(",");
    },
    // 反显当月还是隔月
    getTimeContentName(code) {
      if (!code) {
        return "";
      }
      let name = "";
      let arr = [];
      arr = monthList.filter((vv) => {
        return vv.code === code;
      });
      if (arr?.length) {
        name = arr[0].label;
      }
      return name;
    },
    // 反显月中/月末等
    getFrequencyUnitName(val) {
      if (!val) {
        return "";
      }
      let frequencyUnitName = "";
      let arr = [];
      arr = frequencyUnitList.filter((vv) => {
        return vv.value === val;
      });
      if (arr?.length) {
        frequencyUnitName = arr[0].label;
      }
      return frequencyUnitName;
    },
    // 反显followupDateType
    getFollowupDateTypeName(code) {
      if (!code) {
        return "";
      }
      if (code === "middleMonth") {
        return `(月)中`;
      } else if (code === "lastDay_0") {
        return `(月)最后1日`;
      } else if (code.indexOf("day_") > -1) {
        // 月几号
        return `(月)${code.split("_")[1]}日`;
      } else if (code.indexOf("startWeek") > -1) {
        let week = code.split("startWeek_1_")[1];
        return `(月)第一个周${week == 0 ? "日" : intToChinese(week)}`;
      } else if (code.indexOf("lastWeek") > -1) {
        let week = code.split("lastWeek_0_")[1];
        return `(月)最后一周的周${week == 0 ? "日" : intToChinese(week)}`;
      } else if (code.indexOf("week") > -1) {
        let week1 = code.split("_")[1];
        let week2 = code.split("_")[1];
        let week2Name = week2 == 0 ? "日" : intToChinese(week2);
        return `(月)第${intToChinese(week1)}周的周${week2Name}`;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  flex: 1;
  color: #303133;
  font-size: 16px;
  border-left: 3px solid #134796;
  line-height: 20px;
  padding-left: 10px;
}
.nav-bar {
  .input-item {
    width: calc(100% - 75px);
    margin-left: 10px;
  }
}
.table-cont {
  margin-top: 20px;
}
</style>
