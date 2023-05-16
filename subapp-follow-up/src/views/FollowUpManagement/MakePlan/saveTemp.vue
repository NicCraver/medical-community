<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    :before-close="handleClose"
    width="520px"
  >
    <template #title>
      <div class="title">{{ titleName }}</div>
    </template>
    <el-form
      label-width="90px"
      :rules="rules"
      :model="tempForm"
      ref="tempForm"
      class="temp-form"
    >
      <el-form-item prop="disease" label="适用病种">
        <el-select
          v-model="tempForm.disease"
          clearable
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in allDiseaseTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="dept" label="适用科室">
        <el-select
          v-model="tempForm.dept"
          clearable
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in deptList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item prop="templateDesc" label="模板名称" required>
        <el-input
          v-model="tempForm.templateDesc"
          placeholder="自动带入“某病种频率模版” 可修改"
        ></el-input>
        <div class="name-note">如：糖尿病院后频率模版</div>
      </el-form-item>
    </el-form>
    <div class="note">
      <div class="note-title">
        <div class="remind">为了随访服务的时效性，请再次对频率模版进行确认</div>
        <div class="followNum">
          此模版总计执行{{ allFollowupTimes || 0 }}次随访
        </div>
        <!-- <el-checkbox v-model="isWeek">随访任务遇周末顺延</el-checkbox> -->
      </div>
      <div class="note-cont">
        <div class="rule-cont">
          <div
            class="rule-item"
            v-for="(item, index) in frequency"
            :key="index"
          >
            <div class="sortNumCls">
              第{{ intToChineseFuc(index + 1) }}次<i v-if="item?.type === '1'"
                >开始</i
              >
            </div>
            <div class="item-cont">
              <template v-if="item.timeType === 'customTime'">
                上一次时间
                <el-select
                  v-model="item.timeContent"
                  size="mini"
                  style="width: 58px; margin: 0 2px"
                >
                  <el-option
                    v-for="(vv, kk) in monthList"
                    :key="kk"
                    :label="vv.label"
                    :value="vv.code"
                  />
                </el-select>
                后的
                <el-select
                  v-model="item.followupDateType"
                  size="mini"
                  style="width: 130px; margin: 0 2px"
                >
                  <el-option
                    v-for="(vv, kk) in dateObj[index]"
                    :key="kk"
                    :label="vv.label"
                    :value="vv.code"
                  />
                </el-select>
                ；
              </template>
              <template v-else-if="item?.type !== '1'">
                <div class="describeCls">
                  {{ item.timeTypeName }}第
                  <i class="timeContentCls">
                    {{ item.timeContent }}
                  </i>
                  天；
                </div>
              </template>
              <div v-if="item.type === '1'">
                {{ item.frequencyTimes }}{{ item.frequencyUnitName }}
                ，执行
                {{ item.followupSize }}
                次，每次
                <i class="dateTypeCls">
                  {{
                    dateObj[index].find(
                      (vv) => vv.code === item.followupDateType
                    )?.label
                  }}
                </i>
                为截止日；
              </div>

              <div class="tableCls" v-if="item.followupTableName">
                <img src="@/assets/fa-tasks.png" alt="" />
                <span>{{ item.followupTableName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="sureFuc">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { onSaveTemplate, onUpdateTemplate } from "@/api/modules/PatientCenter";
import { frequencyUnitList, timeTypeList, monthList } from "@/utils/data-map";
import { intToChinese } from "@/utils/utils.js";

export default {
  name: "saveTemp",
  props: {
    tempType: String,
    visible: Boolean,
    handleClose: Function,
    planDetailFormTemp: Object,
    dateObj: Object,
    followUpForms: Array,
    allFollowupTimes: Number | String,
    titleName: String,
    allDiseaseTypeList: Array,
  },
  data() {
    return {
      deptList: [],
      monthList: monthList,
      rules: {
        templateDesc: [
          {
            message: "请输入模板名称",
            trigger: ["change", "blur"],
            required: true,
          },
        ],
      },
      isWeek: false,
      tempForm: {
        templateDesc: "",
        disease: [],
        // dept: [],
      },
      frequency: [], //规则
    };
  },
  computed: {},
  watch: {
    planDetailFormTemp: {
      handler(val) {
        if (this.tempType === "add") {
          //自动带入现在的患者病种
          if (this.planDetailFormTemp.diseaseCode) {
            const name = this.allDiseaseTypeList.find(
              (item) => item.value === this.planDetailFormTemp.diseaseCode
            );
            let diseaseName = name?.label ? name.label + "频率模板" : "";
            this.tempForm.templateDesc = diseaseName;
          }

          this.handleTempList();
          return;
        }
        // 编辑
        this.tempForm = {
          templateDesc: val.templateDesc,
          disease: val.disease,
          //   dept: val.dept,
        };
        this.frequency = val.templateData.frequencyRule;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  methods: {
    // 自定义模板生成
    handleTempList() {
      let frequency = this.planDetailFormTemp.frequency || [];
      let followupTableName = this.getFollowupTableName(
        this.planDetailFormTemp.followupTable
      );
      let arr = [];
      frequency.map((item, index) => {
        let obj = {
          ...item,
          followupTableName:
            this.planDetailFormTemp.isCustomTable === "1" && item.followupTable
              ? this.getFollowupTableName(item.followupTable)
              : followupTableName,
          frequencyUnitName: this.getFrequencyUnitName(item.frequencyUnit),
          timeTypeName: this.getTimeTypeName(item.timeType),
        };
        if (item.timeType === "customTime") {
          obj.timeContent = "currentMonth";
        }
        arr.push(obj);
      });
      this.frequency = arr;
    },
    // 处理提交数据
    handleSubmitData() {
      let frequencyRule = this.frequency.map((item, index) => {
        let obj = {
          ...item,
        };
        if (item.timeType === "customTime") {
          let followupDateTypeList = this.dateObj[index] || [];
          obj.followupDateTypeList = followupDateTypeList;
        }
        delete obj.followupDateStr;
        delete obj.followupTableName;
        delete obj.frequencyUnitName;
        delete obj.timeTypeName;
        return obj;
      });
      let templateData = {
        // isWeek: this.isWeek ? "1" : "",
        frequencyRule,
        followupSize: this.allFollowupTimes || 0,
      };
      let disease = this.tempForm.disease.join(",");
      //   let dept = this.tempForm.dept.join(",");

      let params = {
        templateDesc: this.tempForm.templateDesc,
        templateData,
        disease,
        // dept,
        type: "FREQUENCY", //类型 固定传值
      };
      if (this.tempType === "update") {
        params.id = this.planDetailFormTemp.id;
      }

      console.log("提交的数据：", params);
      return params;
    },
    // 保存模板
    sureFuc() {
      this.$refs["tempForm"].validate(async (valid) => {
        if (valid) {
          let params = this.handleSubmitData();
          try {
            let res = {};
            if (this.tempType === "add") {
              res = await onSaveTemplate(params);
            } else if (this.tempType === "update") {
              res = await onUpdateTemplate(params);
            }
            if (res.code === 0) {
              this.$message.success("保存成功！");
              this.handleClose();
            }
          } catch (error) {}
        }
      });
    },
    getFollowupTableName(val) {
      if (!val) {
        return "";
      }
      let followupTableName = "";
      let arr = [];
      arr = this.followUpForms.filter((vv) => {
        return vv.value === val;
      });
      if (arr?.length) {
        followupTableName = arr[0].label;
      }
      return followupTableName;
    },
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
    getTimeTypeName(val) {
      if (!val) {
        return "";
      }
      let timeTypeName = "";
      let arr = [];
      arr = timeTypeList.filter((vv) => {
        return vv.value === val;
      });
      if (arr?.length) {
        timeTypeName = arr[0].label;
      }
      return timeTypeName;
    },
    intToChineseFuc(num) {
      return intToChinese(num);
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
.temp-form {
  .name-note {
    line-height: 17px;
    color: #5b5b5b;
    font-size: 12px;
  }
}
.note {
  margin-top: 10px;

  .note-title {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 4px 4px 0px 0px;
    background-color: #7495e6;
    color: #fff;
    font-size: 12px;
    box-shadow: 0px 2px 2px 0px rgba(211, 210, 210, 40);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .remind {
      //   color: #5b5b5b;
      //   font-weight: 700;
      //   margin-bottom: 15px;
      //   padding-top: 15px;
    }
    .followNum {
      width: 160px;
      height: 22px;
      line-height: 22px;
      border-radius: 2px;
      background-color: #f6f7fb;
      color: #7495e6;
      text-align: center;
    }
    :deep(.el-checkbox__label) {
      color: #fff !important;
    }
  }
  .note-cont {
    height: 230px;
    padding: 0 10px;
    overflow-y: auto;
    line-height: 20px;
    border-radius: 2px;
    background-color: #f6f7fb;
    color: #101010;
    font-size: 14px;
    border: 1px solid #c2d2f7;
    border-top: none;
  }
  .rule-cont {
    padding-top: 10px;
    .rule-item {
      margin-bottom: 10px;
      font-size: 14px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .sortNumCls {
        width: 70px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;
        background-color: #e9ecf9;
        color: #4468bd;
        text-align: center;
        font-size: 12px;
        margin: 2px 5px 2px 0;
      }
      .item-cont {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        line-height: 28px;
        :deep(.el-input--mini .el-input__inner) {
          padding-left: 2px;
        }
      }
      .dateTypeCls {
        color: #4468bd;
      }
      .describeCls {
        .timeContentCls {
          color: #4468bd;
          font-weight: 700;
        }
      }
      .tableCls {
        img {
          width: 14px;
          height: 14px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
