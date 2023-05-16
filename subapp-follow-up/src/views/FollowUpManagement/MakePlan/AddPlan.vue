<template>
  <el-dialog
    :visible="visible"
    :title="dialogType === '1' ? '新增随访计划' : '新增随访评估'"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="520px"
  >
    <el-form
      label-width="90px"
      :rules="rules"
      :model="planDetail"
      ref="planForm"
      v-if="followupTypeAssess === '1' && visible"
    >
      <p
        style="
          padding-left: 10px;
          background-color: rgba(217, 217, 217, 0.27);
          border-radius: 2px 2px 0 0;
          line-height: 30px;
        "
      >
        <span style="color: red; margin-right: 2px">*</span>随访病种及计划名称
      </p>
      <el-row>
        <el-col
          :span="6"
          style="
            background-color: rgba(217, 217, 217, 0.27);
            border-radius: 0px 0px 0px 2px;
          "
        >
          <el-form-item prop="diseaseCode" label-width="10px">
            <el-select
              v-model="planDetail.diseaseCode"
              clearable
              @change="handleDiseaseChange"
            >
              <el-option
                v-for="item in diseaseTypeList"
                :key="item.richDiseaseCode"
                :label="item.richDiseaseName"
                :value="item.richDiseaseCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="background-color: rgba(217, 217, 217, 0.27)">
          <el-form-item prop="planName" label-width="10px">
            <el-input v-model="planDetail.planName" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col
          :span="6"
          style="
            background-color: rgba(217, 217, 217, 0.27);
            border-radius: 0px 0px 2px 0px;
          "
        >
          <el-form-item
            prop="planType"
            label-width="10px"
            style="margin-right: 10px"
          >
            <el-select v-model="planDetail.planType">
              <el-option
                v-for="item in planTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="18">
          <el-form-item label="随访机构" prop="followupStartTime">
            <UniversalSelect
              v-model="planDetail.followupHosId"
              ref="followupHosIdRef"
              placeholder="请选择随访机构"
              url="/ygt-richdiseases/tbMbPatOrg/getJoinHosData"
              :params="{
                patId: patId,
              }"
            />
            <!-- <OrgHosSelect
              ref="hosRef"
              v-model="planDetail.followupHosId"
              :parentId="parentId"
            ></OrgHosSelect> -->
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="开启时间" prop="followupStartTime">
            <el-date-picker
              type="date"
              v-model="planDetail.followupStartTime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="随访频率" prop="frequencyTimes">
            <el-select v-model="planDetail.frequencyTimes">
              <el-option
                v-for="item in countList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="10px" prop="frequencyUnit">
            <el-select v-model="planDetail.frequencyUnit">
              <el-option
                v-for="item in unitList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="随访次数" prop="followupSize">
            <el-input v-model="planDetail.followupSize" maxlength="3">
              <template slot="append">次</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="随访方式" prop="followupType">
            <el-select
              v-model="planDetail.followupType"
              @change="handleFollowuoChange"
            >
              <el-option
                v-for="item in followUpTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="随访表单" prop="followupTable">
            <el-select v-model="planDetail.followupTable" filterable>
              <el-option
                v-for="item in followUpForms"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="患者提醒">
            <el-checkbox-group v-model="planDetail.msgToRemind">
              <el-checkbox
                label="1"
                :disabled="
                  planDetail.followupType !== '1' &&
                  planDetail.followupType !== '3'
                "
                >系统消息</el-checkbox
              >
              <el-checkbox
                label="2"
                :disabled="
                  planDetail.followupType === '1' ||
                  planDetail.followupType === '3'
                "
                >短信消息</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="医生提醒" prop="systemCall">
            <el-checkbox-group v-model="planDetail.systemCall">
              <el-checkbox
                v-for="item in warnList"
                :key="item.value"
                :label="item.value"
                :disabled="
                  item.value === '1' ||
                  planDetail.followupType === '2' ||
                  (item.value === '3' && planDetail.beyondEditor === '0')
                "
              >
                {{ item.label }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="待随访任务可录入时，提醒一次"
                  placement="top"
                  v-if="item.label === '提前'"
                >
                  <i
                    class="el-icon el-icon-question"
                    style="color: #446bbd"
                  ></i>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="超期编辑" prop="beyondEditor">
            <el-radio-group
              v-model="planDetail.beyondEditor"
              :disabled="planDetail.followupType === '2'"
            >
              <el-radio label="1">开</el-radio>
              <el-radio
                label="0"
                :disabled="
                  planDetail.systemCall && planDetail.systemCall.includes('3')
                "
                >关</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      label-width="90px"
      :rules="eveluateRules"
      :model="planDetail"
      ref="eveluateForm"
      v-else-if="followupTypeAssess === '2' && visible"
    >
      <el-row>
        <el-col :span="18" style="position: relative">
          <el-form-item label="评估名称" prop="planName">
            <el-input
              v-model="planDetail.planName"
              placeholder="请控制在20字以内"
              maxlength="20"
            />
          </el-form-item>
          <span
            class="small-tips"
            @mouseenter="demoImgShowFlag = true"
            @mouseleave="demoImgShowFlag = false"
            >居民端展示位置</span
          >
        </el-col>
        <el-col :span="18">
          <el-form-item label="随访机构" prop="followupStartTime">
            <UniversalSelect
              v-model="planDetail.followupHosId"
              ref="followupHosIdRef"
              placeholder="请选择随访机构"
              url="/ygt-richdiseases/tbMbPatOrg/getJoinHosData"
              :params="{
                patId: patId,
              }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="开启时间" prop="followupStartTime">
            <el-date-picker
              type="date"
              v-model="planDetail.followupStartTime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="随访方式">
            <el-input v-model="constFollowupTypeText" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="随访表单" prop="followupTable">
            <el-select v-model="planDetail.followupTable" filterable>
              <el-option
                v-for="item in followUpForms"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="患者提醒">
            <el-checkbox-group v-model="planDetail.msgToRemind">
              <el-checkbox label="1" disabled>系统消息</el-checkbox>
              <el-checkbox label="2">短信消息</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="医生提醒">
            <el-checkbox-group v-model="evaluteSystemCall" disabled>
              <el-checkbox
                v-for="item in warnList"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="待随访任务可录入时，提醒一次"
                  placement="top"
                  v-if="item.label === '提前'"
                >
                  <i
                    class="el-icon el-icon-question"
                    style="color: #446bbd"
                  ></i>
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="超期编辑">
            <el-radio-group v-model="evaluteBeyondEditor" disabled>
              <el-radio label="1">开</el-radio>
              <el-radio label="0">关</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="addPlanSubmit">确认</el-button>
    </div>
    <div class="img-container" v-show="demoImgShowFlag">
      <img src="@/assets/demo.png" alt="" />
    </div>
  </el-dialog>
</template>

<script>
import {
  followUpTypeList,
  warnList,
  planTypeList,
  unitList,
} from "@/utils/data-map";
import { addPlanSubmit, updatePlanSubmit } from "@/api/modules/PatientCenter";
import dayjs from "dayjs";
// const planNameValidator = (rule, value, callback) => {
//   if (!value) {
//     return callback(new Error('计划名称不能为空'));
//   }
//   const reg = /^([\u4e00-\u9fa5]|[0-9]|[a-z]|[A-Z])+$/;
//   if (!reg.test(value)) {
//     return callback(new Error('计划名称须为中文、数字、英文组合'));
//   }
//   callback();
// }

const followupSizeValodator = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("随访次数不能为空"));
  }
  const reg = /^[1-9][0-9]{0,2}$/;
  if (!reg.test(value)) {
    return callback(new Error("请输入正确的随访次数"));
  }
  callback();
};

export default {
  props: {
    dialogType: {
      type: String,
      default: "1",
    },
    followupTypeAssess: {
      type: String,
      default: "",
    },
    planDetailType: {
      type: String,
      default: "add",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    diseaseTypeList: {
      type: Array,
      default() {
        return [];
      },
    },
    followUpForms: {
      type: Array,
      default() {
        return [];
      },
    },
    planDetail: {
      type: Object,
      default() {
        return {};
      },
    },
    closeDialog: Function,
  },
  data() {
    return {
      patId: "",
      planTypeList: planTypeList,
      countList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      unitList: unitList,
      followUpTypeList: followUpTypeList,
      constFollowupTypeText: "网络",
      warnList: warnList,
      pickerOptions: {
        disabledDate(time) {
          return (
            Date.now() > time.getTime() + 24 * 60 * 60 * 1000 ||
            time.getDay() === 6 ||
            time.getDay() === 0
          );
        },
      },
      rules: {
        planName: [
          { message: "请输入随访计划", trigger: "change", required: true },
        ],
        diseaseCode: [
          { required: true, message: "请选择随访病种", trigger: "change" },
        ],
        planType: [
          { required: true, message: "请选择计划类型", trigger: "change" },
        ],
        followupStartTime: [
          { required: true, message: "请选择开启日期", trigger: "change" },
        ],
        frequencyTimes: [
          { required: true, message: "请选择随访频率", trigger: "change" },
        ],
        followupSize: [
          {
            validator: followupSizeValodator,
            trigger: "change",
            required: true,
          },
        ],
        followupTable: [
          { required: true, message: "请选择随访表单", trigger: "change" },
        ],
        systemCall: [
          { required: true, message: "请选择系统提醒", trigger: "change" },
        ],
        beyondEditor: [
          { required: true, message: "请选择超期编辑", trigger: "change" },
        ],
      },
      eveluateRules: {
        planName: [
          { required: true, message: "请输入评估名称", trigger: "change" },
        ],
        followupStartTime: [
          { required: true, message: "请选择开启日期", trigger: "change" },
        ],
        followupTable: [
          { required: true, message: "请选择随访表单", trigger: "change" },
        ],
      },
      demoImgShowFlag: false,
      submitBtnDisabled: false,
      evaluteSystemCall: [],
      evaluteBeyondEditor: "0",
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.patId = this.$route.query.patId;
        this.$nextTick(() => {
          this.$refs.followupHosIdRef.init();
        });
      }
    },
  },
  methods: {
    handleDiseaseChange(diseaseCode) {
      if (!diseaseCode) {
        this.planDetail.planName = "";
        return;
      }
      const diseaseName = this.diseaseTypeList.find(
        (item) => item.richDiseaseCode === diseaseCode
      ).richDiseaseName;
      this.planDetail.planName = `${dayjs(new Date()).format(
        "YYYY-MM"
      )}${diseaseName}随访计划`;
    },
    addPlanSubmit() {
      if (this.submitBtnDisabled) {
        return;
      }
      this.submitBtnDisabled = true;
      let refForm;
      const params = {
        ...this.planDetail,
        followupUserId: sessionStorage.getItem("userId"),
        followupUserName: sessionStorage.getItem("loginName"),
        followupTypeAssess: this.followupTypeAssess,
        followupHosName: this.$refs.followupHosIdRef.getHosName(),
      };
      if (this.followupTypeAssess === "1") {
        refForm = "planForm";
        params.systemCall = this.planDetail.systemCall.join(",");
        params.msgToRemind = this.planDetail.msgToRemind.join(",");
      } else {
        refForm = "eveluateForm";
        params.msgToRemind = this.planDetail.msgToRemind.join(",");
      }
      this.$refs[refForm].validate(async (valid) => {
        if (valid) {
          console.log("params====", params);
          try {
            if (this.planDetailType === "add") {
              const res = await addPlanSubmit(params);
              console.log("res==", res);
            } else {
              await updatePlanSubmit(params);
            }
            this.submitBtnDisabled = false;
            this.closeDialog("refresh");
          } catch (err) {
            console.error(err);
            this.submitBtnDisabled = false;
          }
        } else {
          this.submitBtnDisabled = false;
        }
      });
    },
    handleFollowuoChange() {
      if (this.planDetail.followupType === "2") {
        this.planDetail.msgToRemind = ["1", "2"];
        this.planDetail.systemCall = [""];
        this.planDetail.beyondEditor = "0";
      } else if (this.planDetail.followupType === "4") {
        this.planDetail.msgToRemind = ["1", "2"];
        this.planDetail.systemCall = ["1"];
        this.planDetail.beyondEditor = "1";
      } else {
        this.planDetail.msgToRemind = [];
        this.planDetail.systemCall = ["1", "2"];
        this.planDetail.beyondEditor = "1";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  text-align: right;
  border-top: 1px solid #ccc;
  line-height: 50px;
  padding-top: 15px;
}
.small-tips {
  display: inline-block;
  width: 100px;
  top: 10px;
  color: #717070;
  font-size: 12px;
  text-decoration: underline;
  position: absolute;
  left: 100%;
  margin-left: 15px;
  cursor: pointer;
}
.img-container {
  position: absolute;
  top: 0;
  left: 100%;
  img {
    height: 457px;
  }
}
</style>

<style scoped>
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-date-editor {
  width: 100% !important;
}
::v-deep .el-dialog__body {
  padding: 0 10px !important;
  padding-top: 10px !important;
}
::v-deep .footer {
  /* padding-top: 10px !important; */

  padding-top: 0 !important;
}
</style>
