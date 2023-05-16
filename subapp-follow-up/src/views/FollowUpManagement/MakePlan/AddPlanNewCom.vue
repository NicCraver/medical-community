<template>
  <div class="AddPlanNewCom">
    <header class="flex">
      <div class="flex">
        <div>
          <div
            class="num-icon"
            :class="stepState === '1' ? 'num-icon-color1' : 'num-icon-color2'"
          >
            1
          </div>
        </div>
        <div :class="stepState === '1' ? 'num-text-color1' : 'num-text-color2'">
          基础信息
        </div>
      </div>
      <div class="line"></div>
      <div class="flex">
        <div>
          <div
            class="num-icon"
            :class="stepState === '2' ? 'num-icon-color1' : 'num-icon-color2'"
          >
            2
          </div>
        </div>
        <div :class="stepState === '2' ? 'num-text-color1' : 'num-text-color2'">
          其他配置
        </div>
      </div>
    </header>
    <el-form
      label-width="90px"
      :rules="planDetailFormRules"
      :model="planDetailForm"
      ref="planForm"
      class="demo-form"
    >
      <template v-if="stepState === '1'">
        <el-row :gutter="10">
          <el-col :span="24" class="label">
            <span class="xinghao">* </span>随访病种及计划名称
          </el-col>
          <el-col :span="6">
            <el-form-item prop="diseaseCode" label-width="0">
              <el-select
                v-model="planDetailForm.diseaseCode"
                clearable
                style="width: 100%"
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
          <el-col :span="12">
            <el-form-item prop="planName" label-width="0">
              <el-input
                v-model="planDetailForm.planName"
                maxlength="20"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="planType" label-width="0">
              <el-select v-model="planDetailForm.planType" style="width: 100%">
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
            <el-form-item
              label="开启时间"
              prop="followupStartTime"
              label-width="90px"
            >
              <el-date-picker
                type="date"
                v-model="planDetailForm.followupStartTime"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                @change="followupStartTimeChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="startTimeStr" label-width="0">
              <el-time-picker
                v-model="planDetailForm.startTimeStr"
                value-format="HH:mm:ss"
                style="width: 100%"
                @change="followupTimeChange"
              >
              </el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="随访频率"
              prop="frequencyType"
              label-width="90px"
            >
              <el-radio-group
                v-model="planDetailForm.frequencyType"
                @change="typeChange"
              >
                <el-radio :label="0">固定</el-radio>
                <el-radio :label="1">自定义</el-radio>
              </el-radio-group>
              <el-button
                type="text"
                @click="quoteTempFuc"
                style="margin-left: 10px"
                v-if="planDetailForm.frequencyType === 1"
              >
                引用模板
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 固定频率 -->
        <template v-if="planDetailForm.frequencyType === 0">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-form-item label="频率设置" prop="frequencyTimes" required>
                <el-select
                  v-model="planDetailForm.frequencyTimes"
                  style="width: 100%"
                >
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
              <el-form-item label-width="10px" prop="frequencyUnit" required>
                <el-select
                  v-model="planDetailForm.frequencyUnit"
                  @change="frequencyUnitChange"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in frequencyUnitList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="随访次数" prop="followupSize" required>
                <el-input-number
                  v-model="planDetailForm.followupSize"
                  :controls="false"
                  :min="1"
                  :max="50"
                  :step="1"
                  @blur="followupSizeChange"
                >
                  <template slot="append">次</template>
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <!-- 自定义频率 -->
        <div class="custom" v-if="planDetailForm.frequencyType === 1">
          <div class="switch-cont">
            <div class="left-cont">
              <div class="el-tag-item">
                <div class="circle"></div>
                单次
              </div>
              <div class="el-tag-item el-tag-circle">
                <div class="circle"></div>
                循环
              </div>
            </div>
            <div class="right-cont">
              <el-switch
                v-model="planDetailForm.isCustomTable"
                active-color="#4468BD"
                inactive-color="#bbb"
                active-value="1"
                inactive-value="0"
                style="margin-right: 5px"
              >
              </el-switch>
              自选随访表单
            </div>
          </div>
          <div class="frequency-cont">
            <div
              class="frequency-item"
              :class="{ 'frequency-item-last': !isShowSortNum(item) }"
              v-for="(item, index) in planDetailForm.frequency"
              :key="index"
            >
              <div class="item-top">
                <div class="item-left">
                  <el-form-item
                    :prop="'frequency.' + index + '.sortNum'"
                    :rules="rules.sortNum"
                    label-width="5px"
                  >
                    <el-select
                      v-model="item.sortNum"
                      @change="sortNumChange($event, item, index)"
                      :disabled="planDetailForm.frequency?.length > index + 1"
                      style="width: 120px"
                    >
                      <el-option
                        v-for="val in sortNumObj[index]"
                        :key="val.value"
                        :label="val.label"
                        :value="val.value"
                      />
                    </el-select>
                  </el-form-item>
                  <template v-if="isShowSortNum(item)">
                    <el-form-item
                      :prop="'frequency.' + index + '.timeType'"
                      :rules="rules.timeType"
                      label-width="5px"
                    >
                      <el-select
                        v-model="item.timeType"
                        style="width: 135px"
                        :style="{
                          'margin-right':
                            item.timeType === 'customTime' ? '148px' : 0,
                        }"
                        @change="timeTypeChange($event, item, index)"
                      >
                        <el-option
                          v-for="(val, kk) in timeTypeList"
                          :key="kk"
                          :label="val.label"
                          :value="val.value"
                          :disabled="
                            (val.value === 'afterLastTime' && !index) ||
                            (val.value === 'afterStartTime' && index > 0)
                          "
                        />
                      </el-select>
                    </el-form-item>
                    <template
                      v-if="
                        item.timeType === 'afterStartTime' ||
                        item.timeType === 'afterLastTime'
                      "
                    >
                      <el-form-item
                        :prop="'frequency.' + index + '.timeContent'"
                        :rules="rules.timeContent"
                        label-width="5px"
                      >
                        第
                        <el-input-number
                          v-model="item.timeContent"
                          :controls="false"
                          :min="index == 0 ? 0 : 1"
                          :step="1"
                          style="width: 60px"
                          @blur="timeContentChange($event, item, index)"
                        ></el-input-number>
                        <span style="margin-right: 50px">天</span>
                      </el-form-item>
                    </template>
                  </template>
                  <template v-else>
                    <el-form-item
                      :prop="'frequency.' + index + '.frequencyTimes'"
                      :rules="rules.frequencyTimesItem"
                      label-width="5px"
                    >
                      <el-select
                        v-model="item.frequencyTimes"
                        @change="frequencyTimesChange($event, item, index)"
                        style="width: 65px"
                      >
                        <el-option
                          v-for="val in countList"
                          :key="val"
                          :label="val"
                          :value="val"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      :prop="'frequency.' + index + '.frequencyUnit'"
                      :rules="rules.frequencyUnitItem"
                      label-width="5px"
                    >
                      <el-select
                        v-model="item.frequencyUnit"
                        @change="frequencyUnitChange($event, item, index)"
                        style="width: 90px"
                      >
                        <el-option
                          v-for="val in frequencyUnitList"
                          :key="val.value"
                          :label="val.label"
                          :value="val.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      :prop="'frequency.' + index + '.followupSize'"
                      :rules="rules.followupSizeItem"
                      label-width="5px"
                    >
                      执行
                      <el-input-number
                        v-model="item.followupSize"
                        :controls="false"
                        :min="1"
                        :max="50"
                        :step="1"
                        style="width: 60px"
                        @blur="followupSizeChange($event, item, index)"
                      ></el-input-number>
                      次
                    </el-form-item>

                    <el-form-item
                      label-width="120px"
                      :prop="'frequency.' + index + '.followupDateStr'"
                      :rules="rules.followupDateStrItem"
                    >
                      <span class="timeType-text">
                        {{ selectDateText(item, index) }}
                      </span>
                    </el-form-item>
                    <el-form-item
                      :prop="'frequency.' + index + '.followupDateType'"
                      :rules="rules.followupDateType"
                      label-width="10px"
                    >
                      <el-select
                        v-model="item.followupDateType"
                        @change="followupDateTypeChange($event, item, index)"
                        style="width: 155px"
                      >
                        <el-option
                          v-for="(val, key) in dateObj[index]"
                          :key="key"
                          :label="val.label"
                          :value="val.code"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                  <el-form-item
                    :prop="'frequency.' + index + '.followupDateStr'"
                    :rules="rules.followupDateStrItem"
                    label-width="0"
                  >
                    <div
                      class="selectDate"
                      v-if="
                        item.timeType === 'afterStartTime' ||
                        item.timeType === 'afterLastTime'
                      "
                    >
                      <span class="selectDateCls" v-if="item.followupDateStr">
                        {{ formatDate(item.followupDateStr, "MM月DD日") }}
                      </span>
                      <span
                        class="selectDateCls warn-btn"
                        v-else-if="item.isValied"
                      >
                        请重新填写
                      </span>
                      <span class="selectDateCls noSelectDate" v-else>
                        请生成日期
                      </span>
                    </div>
                    <div
                      class="selectDate selectDateCusor"
                      v-else-if="item.timeType === 'customTime'"
                    >
                      <el-popover placement="right" width="400" trigger="click">
                        <div class="calendar-navBar">
                          <div class="one">123...</div>
                          <div class="two">已定随访日</div>
                          <div class="three">数字</div>
                          <div class="four">今日</div>
                          <div class="five">数字</div>
                          <div>开启时间</div>
                        </div>
                        <el-calendar class="calendar">
                          <template slot="dateCell" slot-scope="{ data, date }">
                            <div
                              class="dateCls"
                              :class="getDateCls(date, item, index)"
                              @click="calendarChange(date, item, index)"
                            >
                              {{ formatDate(date, "DD") }}
                              <div
                                class="labelCls"
                                v-if="getDateContent(date, index)"
                              >
                                {{ getDateContent(date, index) }}
                              </div>
                            </div>
                          </template>
                        </el-calendar>
                        <el-button
                          slot="reference"
                          type="text"
                          class="btn-text"
                        >
                          <span
                            v-if="item.followupDateStr"
                            class="selectDateCls"
                            :class="{
                              'date-btn': !item.isTemp && !item.isValied,
                            }"
                          >
                            {{ formatDate(item.followupDateStr, "MM月DD日") }}
                          </span>
                          <span
                            v-else-if="item.isTemp || item.isValied"
                            class="selectDateCls warn-btn"
                          >
                            请重新填写
                          </span>
                          <span class="selectDateCls" v-else>日历选择</span>
                        </el-button>
                      </el-popover>
                    </div>
                  </el-form-item>
                </div>
                <div class="item-right">
                  <el-button
                    type="text"
                    :disabled="!isShowSortNum(item)"
                    @click="addFuc(item, index)"
                  >
                    <img src="@/assets/add_point.png" alt="" />
                  </el-button>
                  <el-button
                    type="text"
                    :disabled="
                      index === 0 && planDetailForm?.frequency?.length === 1
                    "
                    style="margin-left: 5px"
                    @click="deleteFuc(item, index)"
                  >
                    <img src="@/assets/delete_point.png" alt="" />
                  </el-button>
                </div>
              </div>
              <div
                class="item-bottom"
                v-if="planDetailForm.isCustomTable === '1'"
              >
                <el-form-item
                  :prop="'frequency.' + index + '.followupTable'"
                  :rules="rules.followupTableItem"
                  label-width="130px"
                >
                  <el-select
                    v-model="item.followupTable"
                    filterable
                    @change="followupTableChange($event, item, index)"
                    style="width: 230px"
                  >
                    <el-option
                      v-for="val in followUpForms"
                      :key="val.value"
                      :label="val.label"
                      :value="val.value"
                      :disabled="val.disabled"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="template-bar">
            <el-button plain size="mini" class="muban-btn" @click="saveTempFuc"
              >存为模板
            </el-button>
            <div class="text">
              <span>
                总计：

                <template v-if="allFollowupTimes">
                  {{ allFollowupTimes }}次随访
                </template>
                <template v-else>等待计算</template>
              </span>
              <el-button type="text" @click="calcFuc">
                <img src="@/assets/xarcoDesign-calendar.png" alt="" />
              </el-button>
            </div>
          </div>
        </div>
      </template>
      <!-- 其他配置 -->
      <template v-else>
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item label="随访科室" prop="followupHosId">
              <UniversalSelect
                v-model="planDetailForm.followupHosId"
                ref="followupHosIdRef"
                placeholder="请选择随访机构"
                url="/ygt-richdiseases/tbMbPatOrg/getJoinHosData"
                :params="{
                  patId: $route?.query?.patId || planDetail?.patId || '',
                }"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="" prop="followupDeptId" label-width="90px">
              <el-select
                v-model="planDetailForm.followupDeptId"
                placeholder="请选择随访科室"
                style="width: 100%"
                @change="followupDeptIdChange"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="随访方式" prop="followupType">
              <el-select
                v-model="planDetailForm.followupType"
                style="width: 100%"
                @change="handleFollowupChange"
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
          <el-col
            :span="18"
            v-if="
              planDetailForm.frequencyType === 0 ||
              planDetailForm.isCustomTable === '0'
            "
          >
            <el-form-item label="随访表单" prop="followupTable" required>
              <el-select
                v-model="planDetailForm.followupTable"
                filterable
                style="width: 100%"
                @change="followupTableChange"
              >
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
            <el-form-item label="患者提醒" prop="msgToRemind">
              <el-checkbox-group v-model="planDetailForm.msgToRemind">
                <el-checkbox label="1" disabled>系统消息</el-checkbox>
                <el-checkbox
                  label="2"
                  :disabled="
                    planDetailForm.followupType === '1' ||
                    planDetailForm.followupType === '3'
                  "
                  >短信消息</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="医生提醒" prop="systemCall">
              <el-checkbox-group v-model="planDetailForm.systemCall">
                <el-checkbox
                  v-for="item in warnList"
                  :key="item.value"
                  :label="item.value"
                  :disabled="
                    item.value === '1' ||
                    planDetailForm.followupType === '2' ||
                    (item.value === '3' && planDetailForm.beyondEditor === '0')
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
            <el-form-item label="" prop="msgToUserId" label-width="90px">
              提醒范围
              <el-select
                v-model="planDetailForm.msgToUserId"
                multiple
                style="width: calc(100% - 90px)"
              >
                <el-option
                  v-for="item in systemCallRangeList"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                  :disabled="item.deptId !== planDetailForm.followupDeptId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="超期编辑" prop="beyondEditor">
              <el-radio-group
                v-model="planDetailForm.beyondEditor"
                :disabled="planDetailForm.followupType === '2'"
                @change="beyondEditorChange"
              >
                <el-radio label="1">开</el-radio>
                <el-radio
                  label="0"
                  :disabled="
                    planDetailForm.systemCall &&
                    planDetailForm.systemCall.includes('3')
                  "
                  >关</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <div class="footer" v-if="followupType === 'single'">
      <el-button type="text" @click="closeDialog('')">取消</el-button>
      <div class="right-btn">
        <el-button
          plain
          class="step-btn"
          v-if="stepState === '1'"
          @click="nextFuc"
        >
          下一步
        </el-button>
        <el-button
          plain
          class="step-btn"
          v-if="stepState === '2'"
          @click="beforeFuc"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          v-if="stepState === '2'"
          @click="addPlanSubmitFuc"
        >
          创建
        </el-button>
      </div>
    </div>
    <div class="footer footer-multi" v-else>
      <el-button
        plain
        class="step-btn"
        v-if="stepState === '1'"
        @click="nextFuc"
      >
        下一步
      </el-button>
      <el-button
        plain
        class="step-btn"
        v-if="stepState === '2'"
        @click="beforeFuc"
      >
        上一步
      </el-button>
    </div>
    <previewPlan
      ref="checkPlan"
      v-if="checkPlanVisible"
      :visible="checkPlanVisible"
      :closeDrawer="closeCheckPlan"
      :followupStartTime="planDetailForm.followupStartTime"
      :dateList="dateList"
    ></previewPlan>
    <quoteTemp
      v-if="quoteTempVisible"
      :visible="quoteTempVisible"
      :handleClose="quoteTempClose"
      :followUpForms="followUpForms"
      :allDiseaseTypeList="allDiseaseTypeList"
      @getApplyTemp="getApplyTemp"
    ></quoteTemp>
    <saveTemp
      v-if="saveTempVisible"
      :visible="saveTempVisible"
      :handleClose="saveTempClose"
      :planDetailFormTemp="planDetailFormTemp"
      :dateObj="dateObj"
      :followUpForms="followUpForms"
      :allFollowupTimes="allFollowupTimes"
      :allDiseaseTypeList="allDiseaseTypeList"
      tempType="add"
      titleName="新增模板"
    ></saveTemp>
  </div>
</template>

<script>
import previewPlan from "./previewPlan";
import quoteTemp from "./quoteTemp";
import saveTemp from "./saveTemp";
import {
  addPlanSubmit,
  saveFollowUpBatch,
  updatePlanSubmit,
  quoteTemplates,
  getTagDiseases,
  getDeptAndDocInfo,
} from "@/api/modules/PatientCenter";
import {
  followUpTypeList,
  warnList,
  planTypeList,
  unitList,
  frequencyUnitList,
  timeTypeList,
} from "@/utils/data-map";
import { intToChinese } from "@/utils/utils.js";
import dayjs from "dayjs";
import { MessageBox } from "element-ui";
var weekday = require("dayjs/plugin/weekday");
dayjs.extend(weekday);

let planDetailFormInit = {
  frequencyType: 0,
  msgToRemind: [],
  systemCall: [],
  msgToUserId: [],
  beyondEditor: "0",
};

export default {
  name: "AddPlanNewCom",
  components: { previewPlan, quoteTemp, saveTemp },
  props: {
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
    // followupType:single(单次随访)：multi(批量随访)
    followupType: {
      type: String,
      default: "single",
    },
    // 批量随访的患者list
    patDtoList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    // 固定频率（间隔、单位、次数）
    let frequencyTimesValodator = (rule, value, callback) => {
      if (this.planDetailForm.frequencyType === 0 && !value) {
        callback(new Error("请选择随访频率"));
      } else {
        callback();
      }
    };
    let frequencyUnitValodator = (rule, value, callback) => {
      if (this.planDetailForm.frequencyType === 0 && !value) {
        callback(new Error("请选择随访频率单位"));
      } else {
        callback();
      }
    };
    let followupSizeValodator = (rule, value, callback) => {
      if (this.planDetailForm.frequencyType === 0 && !value) {
        callback(new Error("请选择随访次数"));
      } else {
        callback();
      }
    };
    let msgToRemindValodator = (rule, value, callback) => {
      let followupType = this.planDetailForm.followupType;
      if ((followupType === "1" || followupType === "3") && !value) {
        callback(new Error("请选择患者提醒"));
      } else {
        callback();
      }
    };

    return {
      allDiseaseTypeList: [], //所有的病种
      stepState: "1",
      planTypeList: planTypeList,
      countList: 5,
      unitList: unitList,
      frequencyUnitList: frequencyUnitList,
      followUpTypeList: followUpTypeList,
      deptList: [],
      systemCallRangeList: [
        {
          name: sessionStorage.getItem("loginName"),
          userId: sessionStorage.getItem("userId"),
        },
      ],
      constFollowupTypeText: "网络",
      warnList: warnList,
      sortNumObj: {},
      timeTypeList: timeTypeList,
      dateObj: {},
      pickerOptions: {
        disabledDate(time) {
          return (
            Date.now() > time.getTime() + 24 * 60 * 60 * 1000 ||
            time.getDay() === 6 ||
            time.getDay() === 0
          );
        },
      },
      planDetailFormRules: {},
      // 除自定义项中的其他rule
      ruleFixed: {
        diseaseCode: [
          { required: true, message: "请选择随访病种", trigger: "change" },
        ],
        planName: [
          { required: true, message: "请输入随访计划", trigger: "change" },
        ],
        planType: [
          { required: true, message: "请选择计划类型", trigger: "change" },
        ],
        followupStartTime: [
          { required: true, message: "请选择开启日期", trigger: "change" },
        ],
        startTimeStr: [
          { required: true, message: "请选择开启时间", trigger: "change" },
        ],
        frequencyType: [
          { required: true, message: "请选择随访频率方式", trigger: "change" },
        ],
        followupHosId: [
          { required: true, message: "请选择随访机构", trigger: "change" },
        ],
        followupDeptId: [
          { required: true, message: "请选择随访科室", trigger: "change" },
        ],
        followupType: [
          { required: true, message: "请选择随访方式", trigger: "change" },
        ],
        followupTable: [
          { required: true, message: "请选择随访表单", trigger: "change" },
        ],
        msgToRemind: [{ validator: msgToRemindValodator, trigger: "change" }],
        systemCall: [
          { required: true, message: "请选择医生提醒", trigger: "change" },
        ],
        msgToUserId: [
          { required: true, message: "请选择提醒范围", trigger: "change" },
        ],
        beyondEditor: [
          { required: true, message: "请选择超期编辑", trigger: "change" },
        ],
        // 固定频率
        frequencyTimes: [
          { validator: frequencyTimesValodator, trigger: "change" },
        ],
        frequencyUnit: [
          { validator: frequencyUnitValodator, trigger: "change" },
        ],
        followupSize: [{ validator: followupSizeValodator, trigger: "change" }],
      },
      // 自定义rule
      rules: {
        // 自定义
        sortNum: [
          { required: true, message: "请选择第几次", trigger: "change" },
        ],
        timeType: [
          { required: true, message: "请选择日期计算规则", trigger: "change" },
        ],
        followupDateStrItem: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        timeContent: [
          { required: true, message: "请选择第几天", trigger: "change" },
        ],
        frequencyTimesItem: [
          { required: true, message: "请选择执行间隔", trigger: "change" },
        ],
        frequencyUnitItem: [
          { required: true, message: "请选择执行单位", trigger: "change" },
        ],
        followupSizeItem: [
          { required: true, message: "请选择执行频率", trigger: "change" },
        ],
        followupTableItem: [
          { required: true, message: "请选择随访表单", trigger: "change" },
        ],
      },
      submitBtnDisabled: false,
      evaluteSystemCall: [],
      evaluteBeyondEditor: "0",
      planDetailForm: {},
      planDetailFormTemp: {},
      checkPlanVisible: false, //预览随访
      quoteTempVisible: false, //引用模板
      saveTempVisible: false, //新增模板
      dateList: [],
      timer: null,
    };
  },
  computed: {
    allFollowupTimes() {
      let dates = this.calcAllFollowupTimes();
      dates = dates || [];
      let arr = dates.filter((item) => {
        return item;
      });
      return arr?.length || 0;
    },
    currentRole() {
      return JSON.parse(sessionStorage.getItem("currentRole"));
    },
  },
  watch: {
    stepState(val) {
      this.$emit("updateStepState", val);
    },
    planDetail: {
      handler(val) {
        if (this.planDetailType === "add") {
          // 新增
          this.planDetailForm = {
            ...val,
            ...planDetailFormInit,
            followupStartTime: dayjs(new Date()).format("YYYY-MM-DD"),
            startTimeStr: "08:00:00",
            followupHosId: this.currentRole.hosId,
            followupDeptId: this.currentRole.deptId,
            msgToUserId: [sessionStorage.getItem("userId")],
          };
          return;
        }
        // 编辑
        let planDetailForm = {
          ...val,
          frequencyType: Number(val.frequencyType),
          followupStartTime: dayjs(val.followupStartTime).format("YYYY-MM-DD"),
          startTimeStr: dayjs(val.followupStartTime).format("HH:mm:ss"),
          msgToUserId: val.msgToUserId?.split(",") || [],
        };
        if (val.frequencyType == "1" && val.frequencyRule) {
          // 自定义
          let frequency = JSON.parse(val.frequencyRule);
          let newFrequency = frequency.map((item, index) => {
            let list = this.createSortNumObj(index + 1);
            this.$set(this.sortNumObj, index, list);
            if (item.timeType === "customTime") {
              this.setDateObj(item.followupDateStr, index);
            }
            let obj = { ...item };
            if (item.type === "1") {
              obj.sortNum = `${item.sortNum}-${item.sortNum}`;
            }
            return obj;
          });
          planDetailForm.frequency = newFrequency;
        }
        this.planDetailForm = planDetailForm;
      },
      deep: true,
      immediate: true,
    },
    "planDetailForm.followupHosId": {
      handler(val) {
        if (val) {
          this.getDeptAndDocInfoFuc();
        }
      },
      deep: true,
      immediate: true,
    },
    "planDetailForm.followupType": {
      handler(val) {
        this.handleFollowupChange(val);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.initRules();
    this.getTagDiseases();
  },
  mounted() {},
  beforeDestroy() {
    this.timer = null;
    clearTimeout(this.timer);
  },
  methods: {
    initRules() {
      this.planDetailFormRules = {
        ...this.ruleFixed,
        ...this.rules,
      };
    },
    // 自动生成随访计划名称
    handleDiseaseChange(diseaseCode) {
      if (!diseaseCode) {
        this.planDetailForm.planName = "";
        return;
      }
      let diseaseName = this.diseaseTypeList.find(
        (item) => item.richDiseaseCode === diseaseCode
      ).richDiseaseName;
      this.planDetailForm.planName = `${dayjs(new Date()).format(
        "YYYY-MM"
      )}${diseaseName}随访计划`;
    },
    followupDeptIdChange(val) {
      this.$set(this.planDetailForm, "msgToUserId", []);
    },
    // 随访方式
    handleFollowupChange(val) {
      if (val === "2") {
        this.planDetailForm.msgToRemind = ["1", "2"];
        this.planDetailForm.systemCall = [""];
        this.planDetailForm.beyondEditor = "0";
      } else if (val === "4") {
        this.planDetailForm.msgToRemind = ["1", "2"];
        this.planDetailForm.systemCall = ["1"];
        this.planDetailForm.beyondEditor = "1";
      } else if (val === "1" || val === "3") {
        this.planDetailForm.msgToRemind = [];
        this.planDetailForm.systemCall = ["1", "2"];
        this.planDetailForm.beyondEditor = "1";
      }
    },
    // 超期编辑
    beyondEditorChange(val) {
      console.log("超期编辑：", val);
      if (val === "0") {
        MessageBox.alert(
          `我们将按照截止日期当日23:59:59进行随访任务的关闭且不可补录，请谨慎勾选超期不可编辑。`,
          "提示",
          {
            confirmButtonText: "已知晓",
            type: "warning",
            callback: (action) => {},
          }
        );
      }
    },
    // 开启日期change
    followupStartTimeChange(val) {
      this.followupTimeChange();
      if (!val) {
        return;
      }
      let date = dayjs(val).format("YYYYMMDD");
      let nowDate = dayjs(new Date()).format("YYYYMMDD");
      if (date > nowDate) {
        this.$set(this.planDetailForm, "startTimeStr", "08:00:00");
      }
      // 如果是自定义频率，重新计算生成的随访日期
      if (this.planDetailForm?.frequency?.length) {
        // this.calcAgain();
      }
    },
    //重新计算
    calcAgain() {
      let frequency = this.planDetailForm.frequency;
      frequency.forEach((item, index) => {
        if (item.timeType !== "customTime") {
          this.timeContentChange(item.timeContent, item, index);
        } else if (index > 0) {
          let lastDate = dayjs(frequency[index - 1].followupDateStr).format(
            "YYYYMMDD"
          );
          let itemDate = dayjs(item.followupDateStr).format("YYYYMMDD");
          if (itemDate >= lastDate) {
            this.$set(item, "followupDateStr", "");
            this.$delete(this.dateObj, index);
          }
        }
      });
    },
    followupTimeChange() {
      if (
        this.planDetailForm.followupStartTime &&
        this.planDetailForm.startTimeStr
      ) {
        let dateDetail = new Date(
          `${this.planDetailForm.followupStartTime} ${this.planDetailForm.startTimeStr}`
        ).getTime();
        let nowTime = new Date().getTime();
        if (dateDetail < nowTime) {
          MessageBox.alert(
            `首次随访将立即启动，未来随访于<i style="color: #446ABD">${this.planDetailForm.startTimeStr}</i>启动，是否继续?`,
            "提示",
            {
              confirmButtonText: "确定",
              type: "warning",
              dangerouslyUseHTMLString: true,
              callback: (action) => {},
            }
          );
        }
      }
    },
    // 切换计算日期的方式
    typeChange(val) {
      if (val === 1 && !this.planDetailForm.followupStartTime) {
        // 校验开启时间
        this.$refs["planForm"].validateField(
          ["followupStartTime", "startTimeStr"],
          (valid) => {}
        );
        MessageBox.alert("请您先填写开启时间，再配置自定义随访频率。", "提示", {
          confirmButtonText: "好的",
          type: "warning",
          callback: (action) => {
            this.$set(this.planDetailForm, "frequencyType", 1);
          },
        });
        return;
      }
      if (val === 1 && !this.planDetailForm?.frequency?.length) {
        let list = this.createSortNumObj(1);
        this.$set(this.sortNumObj, 0, list);
        // 初始化自定义频率表单
        let obj = {
          sortNum: 1,
          timeType: "afterStartTime",
          timeContent: 0,
          followupDateStr: this.planDetailForm.followupStartTime,
        };
        this.$set(this.planDetailForm, "frequency", [obj]);
      }
    },
    // 第几次change
    sortNumChange(val, item, index) {
      let str = val.toString();
      if (str?.indexOf("-") > -1) {
        this.$set(
          this.planDetailForm.frequency[index],
          "timeType",
          "customTime"
        );
      }
    },
    // 自开始日期还是自选日期change
    timeTypeChange(val, item, index) {
      this.$set(this.planDetailForm.frequency[index], "followupDateStr", "");
      if (val !== "customTime") {
        this.validatecDateFuc(item, index);
      }
    },
    // 天数change
    timeContentChange(val, item, index) {
      if (index > 0 && val == 0) {
        // 从第二次随访开始，不可选择0
        this.$message.error("不可选择跟上次随访一样的日期！");
        // this.$set(this.planDetailForm.frequency[index], "timeContent", 1);
        return;
      }
      this.validatecDateFuc(item, index);
    },
    // 自开始日期or天数 计算日期
    validatecDateFuc(item, index) {
      let frequency = this.planDetailForm.frequency;
      let followupDateStr = this.calcfollowupDateStr(item, index);
      if (!followupDateStr) {
        return;
      }
      let followupDateStrTime = new Date(followupDateStr).getTime();
      let lastItemDate =
        index > 0 ? frequency[index - 1]?.followupDateStr || "" : "";
      let lastItemDateTime = lastItemDate
        ? new Date(lastItemDate).getTime()
        : "";
      let nextItemDateTimes = [];
      frequency.map((vv, kk) => {
        if (kk > index && vv.followupDateStr) {
          nextItemDateTimes.push(new Date(vv.followupDateStr).getTime());
        }
      });
      let newNextItemDateTimes = nextItemDateTimes.sort((a, b) => {
        return a - b;
      });
      let nextItemDateTime = newNextItemDateTimes?.length
        ? newNextItemDateTimes[0] || ""
        : "";

      if (lastItemDateTime && followupDateStrTime <= lastItemDateTime) {
        this.$message.error("日期应该在上次随访计划的日期之后，请重新生成！");
        this.$set(frequency[index], "followupDateStr", "");
        return;
      } else if (nextItemDateTime && followupDateStrTime >= nextItemDateTime) {
        // this.$message.error("日期应该在下次随访计划的日期之前，请重新生成！");
        // this.$set(frequency[index], "followupDateStr", "");
        this.$confirm(
          "您设定的本次随访时间与其它随访事件有冲突，请确认。",
          "提示",
          {
            confirmButtonText: "确认更改",
            cancelButtonText: "返回",
            type: "warning",
          }
        )
          .then(() => {
            // 清除本条以下所有的计划的时间
            let newFrequency = [];
            frequency.map((vv, kk) => {
              let newFrequencyItem = {};
              if (kk == index) {
                newFrequencyItem = {
                  ...vv,
                  followupDateStr,
                  isValied: false, //清除校验痕迹
                };
              } else if (kk < index) {
                newFrequencyItem = {
                  ...vv,
                  isValied: false, //清除校验痕迹
                };
              } else {
                newFrequencyItem = {
                  ...vv,
                  followupDateStr: "",
                  followupDateType: "",
                  isValied: true, //添加校验痕迹
                };
                this.$delete(this.dateObj, kk);
              }
              newFrequency.push(newFrequencyItem);
            });
            this.$set(this.planDetailForm, "frequency", newFrequency);
          })
          .catch(() => {
            this.$set(frequency, index, {
              sortNum: item.sortNum,
              timeType: item.timeType,
              followupDateStr: "",
              isValied: true, //添加校验痕迹
            });
          });
        return;
      }
      this.$set(frequency, index, {
        ...frequency[index],
        followupDateStr: followupDateStr,
        isValied: false, //清除校验痕迹
      });
    },
    // 执行频率
    frequencyTimesChange(val, item, index) {},
    // 执行单位
    frequencyUnitChange(val, item, index) {
      switch (val) {
        case "1":
          this.countList = 24;
          break;
        case "2":
          this.countList = 60;
          break;
        case "3":
          this.countList = 10;
          break;
      }
      if (index !== undefined) {
        if (Number(item.frequencyTimes) > this.countList) {
          this.$set(
            this.planDetailForm.frequency[index],
            "frequencyTimes",
            this.countList
          );
        }
      } else {
        if (Number(this.planDetailForm.frequencyTimes) > this.countList) {
          this.$set(this.planDetailForm, "frequencyTimes", this.countList);
        }
      }
    },
    followupSizeChange(val, item, index) {},
    // 规则change
    followupDateTypeChange(val, item, index) {},
    // 自选日期
    calendarChange(date, item, index) {
      let className = this.getDateCls(date, item, index);
      if (this.getDateContent(date, index) || className["disabledCls"]) {
        return;
      }
      let frequency = this.planDetailForm.frequency;
      let nowDate = dayjs(date).format("YYYY-MM-DD");
      this.$set(frequency[index], "followupDateStr", nowDate);

      // 最后一次循环随访，计算所选日期下拉框
      /* if (this.isShowSortNum(item)) {
        return;
      } */
      // 计算所选日期下拉框
      this.setDateObj(nowDate, index);
      // 默认选择(月)第几日
      let dateList = this.dateObj[index];
      if (dateList?.length) {
        let num = dateList.length - 2 > -1 ? dateList.length - 2 : 0;
        this.$set(this.planDetailForm.frequency, index, {
          ...frequency[index],
          followupDateType: dateList[num]["code"],
          isValied: false, //清除校验痕迹
        });
      }
    },
    // 随访表单change
    followupTableChange(val, item, index) {},
    // 计算所选日期下拉框
    setDateObj(nowDate, index) {
      let endOfMonth = dayjs(nowDate).endOf("month"); //月末日期
      let dateDetail = dayjs(nowDate).date(); //几号
      let lastDateDetailOfMonth = Math.floor(
        dayjs(nowDate).endOf("month").date() / 2
      ); //月中几号
      let str1 = "";
      let code1 = "";
      if (nowDate === dayjs(endOfMonth).format("YYYY-MM-DD")) {
        str1 = `(月)最后1日`;
        code1 = `lastDay_0`;
      } else if (dateDetail == lastDateDetailOfMonth) {
        str1 = `(月)中`;
        code1 = `middleMonth`;
      }

      let str2 = "";
      let code2 = "";
      if (dateDetail < 30) {
        str2 = `(月)${dateDetail}日`;
        code2 = `day_${dateDetail}`;
      }

      let str3 = "";
      let code3 = ``;
      let week = dayjs(nowDate).day(); //周几
      let calcWeek = week == 0 ? 7 : week;
      let WeekStartOfMonth = dayjs(dayjs(nowDate).startOf("month")).day(); //月初日期是周几
      let WeekStartDayOfMonth = WeekStartOfMonth == 0 ? 7 : WeekStartOfMonth;
      let WeekEndOfMonth = dayjs(dayjs(nowDate).endOf("month")).day(); //月底日期是周几
      let WeekEndDayOfMonth = WeekEndOfMonth == 0 ? 7 : WeekEndOfMonth;
      let WeekOfMonth = this.calcWeekOfMonth(nowDate); //第几周
      let WeekAllOfMonth = this.calcWeekOfMonth(dayjs(nowDate).endOf("month")); //本月一共多少周
      // debugger
      if (
        WeekOfMonth === 1 ||
        (WeekOfMonth === 2 && calcWeek < WeekStartDayOfMonth)
      ) {
        str3 = `(月)第一个周${week == 0 ? "日" : intToChinese(week)}`;
        code3 = `startWeek_1_${week}`;
      } else if (
        (calcWeek <= WeekEndDayOfMonth && WeekOfMonth === WeekAllOfMonth) ||
        (calcWeek > WeekEndDayOfMonth && WeekOfMonth === WeekAllOfMonth - 1)
      ) {
        str3 = `(月)最后一个周${week == 0 ? "日" : intToChinese(week)}`;
        code3 = `lastWeek_0_${week}`;
      } else {
        str3 = `(月)第${intToChinese(WeekOfMonth)}周的周${
          week == 0 ? "日" : intToChinese(week)
        }`;
        code3 = `week_${WeekOfMonth}_${week}`;
      }

      let obj1 = {
        label: str1,
        code: code1,
      };
      let str1List = str1 ? [obj1] : [];
      let obj2 = {
        label: str2,
        code: code2,
      };
      let str2List = str2 ? [obj2] : [];
      let obj3 = {
        label: str3,
        code: code3,
      };
      let str3List = [obj3];
      let strList = str1List.concat(str2List).concat(str3List);
      this.$set(this.dateObj, index, strList);
      console.log("this.dateObj", JSON.parse(JSON.stringify(this.dateObj)));
    },
    // 生成第几次/从这次开始 下拉框
    createSortNumObj(index) {
      let label = intToChinese(index);
      let list = [
        {
          label: `第${label}次`,
          value: index,
        },
        {
          label: `第${label}次开始`,
          value: `${index}-${index}`,
        },
      ];
      return list;
    },
    // 新增
    addFuc(item, index) {
      let frequency = this.resetObjFuc(item, index, "add");
      let obj = {
        sortNum: Number(index) + 2,
        timeType: "",
      };
      frequency.splice(index + 1, 0, obj);
      this.$set(this.planDetailForm, "frequency", frequency);
    },
    // 删除
    deleteFuc(item, index) {
      this.$confirm("删除之后将不可恢复，确认删除吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "返回",
        type: "warning",
      }).then(() => {
        let frequency = this.resetObjFuc(item, index, "delete");
        this.$delete(frequency, index);
        this.$set(this.planDetailForm, "frequency", frequency);
      });
    },
    // 新增/删除产生的sortNum、sortNumObj、dateObj索引错乱的问题
    resetObjFuc(item, index, type) {
      let frequency = this.planDetailForm.frequency;
      let newFrequency = frequency.map((vv, kk) => {
        // sortNumObj重新生成
        if (kk > index) {
          this.$delete(this.sortNumObj, kk);
        }

        let num = 0;
        if (type === "add") {
          num = kk + 1;
        } else if (type === "delete") {
          num = kk - 1;
        }
        if (num > 0) {
          let list = this.createSortNumObj(num + 1);
          this.$set(this.sortNumObj, num, list);
        }

        // dateObj重新生成
        if (kk > index) {
          this.$delete(this.dateObj, index);
          if (frequency[kk].timeType === "customTime") {
            this.setDateObj(frequency[kk].followupDateStr, num);
          }
        }

        if (type === "add") {
          if (kk > index) {
            this.$delete(this.dateObj, index);
            if (frequency[kk].timeType === "customTime") {
              this.setDateObj(frequency[kk].followupDateStr, num);
            }
          }
        } else if (type === "delete") {
          if (kk >= index) {
            this.$delete(this.dateObj, index);
            if (
              kk + 1 < frequency.length &&
              frequency[kk + 1].timeType === "customTime"
            ) {
              this.setDateObj(frequency[kk + 1].followupDateStr, kk + 1);
            }
          }
        }

        // sortNum重新排序
        if (kk > index) {
          if (type === "add") {
            return {
              ...vv,
              sortNum: this.isShowSortNum(vv)
                ? num + 1
                : `${num + 1}-${num + 1}`,
            };
          } else if (type === "delete") {
            return {
              ...vv,
              sortNum: this.isShowSortNum(vv)
                ? num + 1
                : `${num + 1}-${num + 1}`,
            };
          }
        } else {
          return { ...vv };
        }
      });
      return newFrequency;
    },
    // 下一步
    nextFuc() {
      this.$refs["planForm"].validate((valid, obj) => {
        console.log("valid obj：", valid, obj);
        if (valid) {
          this.stepState = "2";
          this.$nextTick(() => {
            this.$refs.followupHosIdRef.init();
          });
          this.$refs["planForm"].clearValidate();
        }
      });
    },
    // 上一步
    beforeFuc() {
      this.$refs["planForm"].clearValidate();
      this.stepState = "1";
    },
    // 取消
    closeDialog(data) {
      this.$emit("closeDialog", data);
    },
    // 处理提交/保存模板的数据
    handleSubmitData() {
      let planDetailForm = this.planDetailForm;
      let params = {};
      // 总的随访结束日期
      let followupTime = this.calcAllFollowupTimes();
      let followupHosName = this.$refs.followupHosIdRef.getHosName();
      let followupDeptName = this.deptList.find(
        (item) => item.deptId === planDetailForm.followupDeptId
      )?.deptName;
      let msgToUserId = this.planDetailForm.msgToUserId || [];
      let msgToUserName = msgToUserId.map((item) => {
        let obj = this.systemCallRangeList.find((vv) => vv.userId === item);
        return obj?.name;
      });
      params = {
        followupUserId: sessionStorage.getItem("userId"),
        followupUserName: sessionStorage.getItem("loginName"),
        followupTypeAssess: "1",
        planName: planDetailForm.planName,
        planType: planDetailForm.planType,
        diseaseCode: planDetailForm.diseaseCode,
        isCustomTable: planDetailForm.isCustomTable || "",
        followupType: planDetailForm.followupType,
        msgToRemind: planDetailForm.msgToRemind.join(","),
        systemCall: planDetailForm.systemCall.join(","),
        beyondEditor: planDetailForm.beyondEditor,
        followupStartTime: planDetailForm.followupStartTime,
        startTimeStr: planDetailForm.startTimeStr,
        followupEndTime: followupTime?.length
          ? followupTime[followupTime.length - 1]
          : "",
        followupHosId: planDetailForm.followupHosId,
        followupHosName,
        followupDeptId: planDetailForm.followupDeptId,
        followupDeptName,
        msgToUserId: msgToUserId.join(","),
        msgToUserName: msgToUserName.join(","),
        frequencyType: planDetailForm.frequencyType,
      };
      // 单人随访
      if (this.followupType === "single") {
        params.patId = this.$route.query.patId || this.planDetail.patId;
        params.name = this.planDetail.name;
      } else if (this.followupType === "multi") {
        params.patDtoList = this.patDtoList || [];
      }

      if (this.planDetailType === "update") {
        params.planId = this.planDetail.planId;
      }
      if (planDetailForm.frequencyType === 0) {
        // 固定频率
        params.frequencyTimes = planDetailForm.frequencyTimes;
        params.frequencyUnit = planDetailForm.frequencyUnit;
        params.followupSize = planDetailForm.followupSize;
        params.followupTable = planDetailForm.followupTable;
      } else if (planDetailForm.frequencyType === 1) {
        // 自定义频率
        if (planDetailForm.isCustomTable == "0") {
          params.followupTable = planDetailForm.followupTable;
        }
        let frequencyDtoList = this.handleCustomData();
        params.frequencyDtoList = frequencyDtoList || [];
      }
      console.log("提交的数据：", JSON.stringify(params));
      return params;
    },
    // 处理自定义频率数据
    handleCustomData() {
      let planDetailForm = this.planDetailForm;
      let frequency = planDetailForm.frequency || [];
      let frequencyDtoList = frequency.map((item, index) => {
        let obj = {};
        if (this.isShowSortNum(item)) {
          // 前几次
          if (
            item.timeType === "afterStartTime" ||
            item.timeType === "afterLastTime"
          ) {
            obj = {
              sortNum: item.sortNum,
              timeType: item.timeType,
              timeContent: item.timeContent,
              followupDateStr: item.followupDateStr,
              type: "0",
            };
          } else if (item.timeType === "customTime") {
            obj = {
              sortNum: item.sortNum,
              timeType: item.timeType,
              timeContent: "",
              followupDateStr: item.followupDateStr,
              followupDateType: item.followupDateType,
              type: "0",
            };
          }
          // 表单
          if (planDetailForm.isCustomTable === "1") {
            obj.followupTable = item.followupTable;
          }
          return obj;
        } else {
          // 最后一次固定
          let sortNum = item.sortNum.split("-")[0];
          let obj = {
            sortNum,
            frequencyTimes: item.frequencyTimes,
            frequencyUnit: item.frequencyUnit,
            followupSize: item.followupSize,
            timeType: item.timeType,
            timeContent: "",
            followupDateStr: item.followupDateStr,
            followupDateType: item.followupDateType,
            type: "1",
          };
          // 表单
          if (planDetailForm.isCustomTable === "1") {
            obj.followupTable = item.followupTable;
          }
          return obj;
        }
      });
      return frequencyDtoList || [];
    },
    // 提交
    addPlanSubmitFuc() {
      if (this.submitBtnDisabled) {
        return;
      }
      this.submitBtnDisabled = true;
      this.$refs["planForm"].validate(async (valid) => {
        if (valid) {
          let submitData = this.handleSubmitData();
          try {
            if (this.followupType === "multi") {
              await saveFollowUpBatch(submitData);
            } else if (this.planDetailType === "add") {
              await addPlanSubmit(submitData);
            } else {
              await updatePlanSubmit(submitData);
            }
            this.closeDialog("refresh");
          } catch (err) {
          } finally {
            this.submitBtnDisabled = false;
          }
        } else {
          this.submitBtnDisabled = false;
        }
      });
    },
    // 自选初始日期
    selectDateText(item, index) {
      let text = intToChinese(index + 1);
      return `自选第${text}次初始日期`;
    },
    // 为日历增加第几次随访上角标
    getDateContent(date, index) {
      let dates = dayjs(date).format("YYYY-MM-DD");
      let frequency = this.planDetailForm.frequency;
      let arr = frequency.filter((item, key) => {
        return item.followupDateStr === dates && index !== key;
      });
      if (arr.length) {
        return arr[0].sortNum;
      }
      return "";
    },
    // 日历classname
    getDateCls(date, item, index) {
      let dates = dayjs(date).format("YYYY-MM-DD");
      let datesTimes = new Date(dates).getTime();
      let nowDate = dayjs(new Date()).format("YYYY-MM-DD");
      let nowTimes = new Date(nowDate).getTime();
      let followupStartDate = this.planDetailForm.followupStartTime;
      let followupStartTimes = new Date(followupStartDate).getTime();

      let frequency = this.planDetailForm.frequency;

      let arr1 = frequency.map((val, key) => {
        if (key < index) {
          return val.followupDateStr
            ? new Date(val.followupDateStr).getTime()
            : 0;
        } else {
          return 0;
        }
      });
      let arr2 = frequency.map((val, key) => {
        if (key > index) {
          return val.followupDateStr
            ? new Date(val.followupDateStr).getTime()
            : 0;
        } else {
          return 0;
        }
      });
      let arrNew1 = arr1.sort((a, b) => {
        return a - b;
      });
      let arrNew2 = arr2.sort((a, b) => {
        return a - b;
      });

      let className = {};
      // 选中的
      if (item.followupDateStr === dates) {
        className["selected"] = true;
      }
      // 开启日期
      if (datesTimes === followupStartTimes) {
        className["startTimeCls"] = true;
      }
      // 置灰
      if (
        datesTimes < nowTimes ||
        datesTimes <= followupStartTimes ||
        (arrNew1?.length &&
          datesTimes <= arrNew1[arrNew1.length - 1] &&
          arrNew2?.length &&
          datesTimes >= arrNew2[0])
      ) {
        className["disabledCls"] = true;
      }
      return className;
    },
    // 第几次or第几次开始权限控制
    isShowSortNum(item) {
      let str = item?.sortNum.toString();
      if (str?.indexOf("-") < 0) {
        return true;
      }
      return false;
    },
    // 计算每次随访的日期
    calcfollowupDateStr(item, index) {
      let frequency = this.planDetailForm.frequency || [];
      let followupStartTime = "";
      let followupDateStr = "";
      if (this.isShowSortNum(item)) {
        // 前几次
        if (item.timeType === "afterStartTime") {
          followupStartTime = this.planDetailForm.followupStartTime;
          if (
            followupStartTime &&
            item.timeContent !== null &&
            item.timeContent !== undefined &&
            item.timeContent !== ""
          ) {
            let startTime = new Date(followupStartTime).getTime();
            let addTime = Number(item.timeContent) * 24 * 60 * 60 * 1000;
            let nowDateTimes = startTime + addTime;
            followupDateStr = dayjs(nowDateTimes).format("YYYY-MM-DD");
          }
        } else if (item.timeType === "afterLastTime" && index > 0) {
          followupStartTime = frequency[index - 1]?.followupDateStr;
          if (
            followupStartTime &&
            item.timeContent !== null &&
            item.timeContent !== undefined &&
            item.timeContent !== ""
          ) {
            let startTime = new Date(followupStartTime).getTime();
            let addTime = Number(item.timeContent) * 24 * 60 * 60 * 1000;
            let nowDateTimes = startTime + addTime;
            followupDateStr = dayjs(nowDateTimes).format("YYYY-MM-DD");
          }
        }
      }
      return followupDateStr;
    },
    /*
      按照规则生成日期
      lastTime: 上次日期
      lastDateType： 计算规则
    */
    calcFollowupTime(item) {
      if (
        !item?.followupDateStr ||
        !item?.frequencyTimes ||
        !item?.frequencyUnit
      ) {
        return;
      }
      let lastDateType = item?.followupDateType || ""; //上一次规则
      let lastTime = item.followupDateStr; //上一次时间
      let followupDateStr = "";
      let followupDate = "";
      let lastDateDetailOfMonth = "";
      if (!lastDateType || lastDateType.indexOf("day_") > -1) {
        switch (item.frequencyUnit) {
          case "1":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "day")
              .format("YYYY-MM-DD");
            break;
          case "2":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "month")
              .format("YYYY-MM-DD");
            break;
          case "3":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "year")
              .format("YYYY-MM-DD");
            break;
        }
      } else if (lastDateType === "lastDay_0") {
        switch (item.frequencyUnit) {
          case "1":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "day")
              .format("YYYY-MM-DD");
            break;
          case "2":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "month")
              .endOf("month")
              .format("YYYY-MM-DD");
            break;
          case "3":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "year")
              .endOf("month")
              .format("YYYY-MM-DD");
            break;
        }
      } else if (lastDateType === "middleMonth") {
        switch (item.frequencyUnit) {
          case "1":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "day")
              .format("YYYY-MM-DD");
            break;
          case "2":
            followupDate = dayjs(lastTime).add(
              Number(item.frequencyTimes),
              "month"
            );
            lastDateDetailOfMonth = Math.floor(
              dayjs(followupDate).endOf("month").date() / 2
            );
            followupDateStr =
              dayjs(followupDate).format("YYYY-MM") +
              "-" +
              lastDateDetailOfMonth;
            break;
          case "3":
            followupDate = dayjs(lastTime).add(
              Number(item.frequencyTimes),
              "year"
            );
            lastDateDetailOfMonth = Math.floor(
              dayjs(followupDate).endOf("month").date() / 2
            );
            followupDateStr =
              dayjs(followupDate).format("YYYY-MM") +
              "-" +
              lastDateDetailOfMonth;
            break;
        }
      } else if (lastDateType.indexOf("startWeek") > -1) {
        // 第一个周几
        switch (item.frequencyUnit) {
          case "1":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "day")
              .format("YYYY-MM-DD");
            break;
          case "2":
            let week2 = Number(lastDateType.split("startWeek_1_")[1]);
            let calcWeek2 = week2 == 0 ? 7 : week2;
            let WeekStartOfMonth = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "month")
              .startOf("month");
            let firstDayOfWeek = WeekStartOfMonth.day(); // 获取第一天对应的星期几
            firstDayOfWeek = firstDayOfWeek == 0 ? 7 : firstDayOfWeek;
            if (calcWeek2 >= firstDayOfWeek) {
              followupDateStr = dayjs(WeekStartOfMonth)
                .add(calcWeek2 - firstDayOfWeek, "day")
                .format("YYYY-MM-DD");
            } else {
              followupDateStr = dayjs(WeekStartOfMonth)
                .add(7 - firstDayOfWeek + calcWeek2, "day")
                .format("YYYY-MM-DD");
            }
            break;
          case "3":
            let week3 = Number(lastDateType.split("startWeek_1_")[1]);
            let calcWeek3 = week3 == 0 ? 7 : week3;
            let WeekStartOfMonth3 = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "year")
              .startOf("month");
            let firstDayOfWeek3 = WeekStartOfMonth3.day(); // 获取第一天对应的星期几
            firstDayOfWeek3 = firstDayOfWeek3 == 0 ? 7 : firstDayOfWeek3;
            if (calcWeek3 >= firstDayOfWeek3) {
              followupDateStr = dayjs(WeekStartOfMonth3)
                .add(calcWeek3 - firstDayOfWeek3, "day")
                .format("YYYY-MM-DD");
            } else {
              followupDateStr = dayjs(WeekStartOfMonth3)
                .add(7 - firstDayOfWeek3 + calcWeek3, "day")
                .format("YYYY-MM-DD");
            }
            break;
        }
      } else if (lastDateType.indexOf("lastWeek") > -1) {
        // 最后一个周几
        switch (item.frequencyUnit) {
          case "1":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "day")
              .format("YYYY-MM-DD");
            break;
          case "2":
            let week2 = Number(lastDateType.split("lastWeek_0_")[1]);
            let calcWeek2 = week2 == 0 ? 7 : week2;
            let WeekEndOfMonth = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "month")
              .endOf("month");
            let WeekEndDayOfMonth = dayjs(WeekEndOfMonth).day();
            let calcWeekEndDayOfMonth =
              WeekEndDayOfMonth == 0 ? 7 : WeekEndDayOfMonth;

            let subtractNum = 0;
            if (calcWeek2 <= calcWeekEndDayOfMonth) {
              subtractNum = calcWeekEndDayOfMonth - calcWeek2;
            } else {
              subtractNum = calcWeekEndDayOfMonth + (7 - calcWeek2);
            }
            followupDateStr = dayjs(WeekEndOfMonth)
              .subtract(subtractNum, "day")
              .format("YYYY-MM-DD");
            break;
          case "3":
            let week3 = Number(lastDateType.split("lastWeek_0_")[1]);
            let calcWeek3 = week3 == 0 ? 7 : week3;
            let WeekEndOfMonth3 = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "year")
              .endOf("month");
            let WeekEndDayOfMonth3 = dayjs(WeekEndOfMonth3).day();
            let calcWeekEndDayOfMonth3 =
              WeekEndDayOfMonth3 == 0 ? 7 : WeekEndDayOfMonth3;

            let subtractNum3 = 0;
            if (calcWeek3 <= calcWeekEndDayOfMonth3) {
              subtractNum3 = calcWeekEndDayOfMonth3 - calcWeek3;
            } else {
              subtractNum3 = calcWeekEndDayOfMonth3 + (7 - calcWeek3);
            }
            followupDateStr = dayjs(WeekEndOfMonth3)
              .subtract(subtractNum3, "day")
              .format("YYYY-MM-DD");
            break;
        }
      } else if (lastDateType.indexOf("week") > -1) {
        // 第几周的周几
        let WeekOfMonth = Number(lastDateType.split("_")[1]); //第几周
        let week = Number(lastDateType.split("_")[2]); //周几
        let calcWeek = week == 0 ? 7 : week;
        switch (item.frequencyUnit) {
          case "1":
            followupDateStr = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "day")
              .format("YYYY-MM-DD");
            break;
          case "2":
            let WeekStartOfMonth = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "month")
              .startOf("month");
            let num = 8 + 7 * (WeekOfMonth - 2);
            let secondWeekStartDay = dayjs(WeekStartOfMonth)
              .startOf("month")
              .date(num); // 获取当前月份的 8 号
            let firstDayOfWeek = secondWeekStartDay.day(); // 获取这一天是星期几
            firstDayOfWeek = firstDayOfWeek == 0 ? 7 : firstDayOfWeek;
            followupDateStr = dayjs(secondWeekStartDay)
              .add(calcWeek - firstDayOfWeek, "day")
              .format("YYYY-MM-DD");
            break;
          case "3":
            let WeekStartOfMonth3 = dayjs(lastTime)
              .add(Number(item.frequencyTimes), "year")
              .startOf("month");
            let num3 = 8 + 7 * (WeekOfMonth - 2);
            let secondWeekStartDay3 = dayjs(WeekStartOfMonth3)
              .startOf("month")
              .date(num3); // 获取当前月份的 8 号
            let firstDayOfWeek3 = secondWeekStartDay3.day(); // 获取这一天是星期几
            firstDayOfWeek3 = firstDayOfWeek3 == 0 ? 7 : firstDayOfWeek3;
            followupDateStr = dayjs(secondWeekStartDay3)
              .add(calcWeek - firstDayOfWeek3, "day")
              .format("YYYY-MM-DD");
            break;
        }
      }
      console.log("最终算的日期：", followupDateStr);
      return followupDateStr;
    },
    // 计算随访所有的日期
    calcAllFollowupTimes() {
      let planDetailForm = this.planDetailForm;
      let followupDates = []; //随访日期
      if (planDetailForm.frequencyType === 0) {
        // 固定频率
        followupDates.push(planDetailForm.followupStartTime); //固定频率开始日期就算第一次随访
        let followupSize = planDetailForm.followupSize;
        if (!followupSize) {
          return;
        }
        for (var i = 0; i < Number(followupSize); i++) {
          let obj = {
            frequencyTimes: Number(planDetailForm.frequencyTimes || 0),
            frequencyUnit: planDetailForm.frequencyUnit,
            followupDateType: "",
          };
          if (i == 0) {
            obj.followupDateStr = planDetailForm.followupStartTime;
          } else {
            obj.followupDateStr = followupDates[i - 1];
          }
          let followupDateItem = this.calcFollowupTime(obj);
          followupDates.push(followupDateItem);
        }
      } else if (planDetailForm.frequencyType === 1) {
        // 自定义频率
        for (let i in planDetailForm.frequency) {
          let item = planDetailForm.frequency[i];
          if (!item.sortNum) {
            return "";
          }
          if (item?.sortNum.toString().indexOf("-") < 0) {
            // 第几次
            followupDates.push(item.followupDateStr);
          } else {
            // 第几次开始
            followupDates.push(item.followupDateStr);
            if (!item.followupSize) {
              return;
            }
            let len = Number(item.followupSize) - 1;
            for (var j = 0; j < len; j++) {
              let obj = {
                frequencyTimes: Number(item.frequencyTimes || 0),
                frequencyUnit: item.frequencyUnit,
                followupDateType: item.followupDateType,
                sortNum: item.sortNum,
                timeType: item.timeType,
              };
              if (j == 0) {
                obj.followupDateStr = item.followupDateStr;
              } else {
                obj.followupDateStr = followupDates[followupDates.length - 1];
              }
              let followupDateItem = this.calcFollowupTime(obj);
              followupDates.push(followupDateItem);
            }
          }
        }
      }
      this.dateList = followupDates;
      return followupDates;
    },
    // 计算当天是当月第几周
    calcWeekOfMonth(date) {
      let diffDays = dayjs(date).date() - dayjs(date).startOf("month").date();
      let day = dayjs(date).startOf("month").day();
      day = day == 0 ? 7 : day;
      let weekOfMonth = Math.ceil((diffDays + day) / 7);
      return weekOfMonth;
    },
    // 计算遇到周末顺延的日期
    weekendDelayNum(date) {
      let day = dayjs(date).day();
      let startTime = new Date(date).getTime();
      let addTime = 0;
      let nowDateTimes = "";
      let nowDate = "";
      if (day === 6) {
        addTime = 2 * 24 * 60 * 60 * 1000;
      } else if (day === 0) {
        addTime = 1 * 24 * 60 * 60 * 1000;
      }
      nowDateTimes = startTime + addTime;
      nowDate = dayjs(nowDateTimes).format("YYYY-MM-DD");
      return nowDate;
    },
    // 格式化日期
    formatDate(date, format) {
      let data = dayjs(date).format(format);
      return data;
    },
    // 随访预览
    calcFuc() {
      let dates = this.calcAllFollowupTimes();
      console.log("随访所有的日期预览：", dates);
      if (!dates || !dates?.length) {
        this.$message.warning("暂未生成随访，请填写后再预览。");
        return;
      }
      this.checkPlanVisible = true;
    },
    closeCheckPlan() {
      this.checkPlanVisible = false;
      this.$refs.checkPlan.$destroy();
    },
    // 引用模板
    quoteTempFuc() {
      this.quoteTempVisible = true;
    },
    // 保存模板
    saveTempFuc() {
      this.planDetailFormRules = {
        ...this.rules,
      };
      this.timer = setTimeout(() => {
        this.$refs["planForm"].validate(async (valid) => {
          if (valid) {
            this.planDetailFormTemp = {
              diseaseCode: this.planDetailForm.diseaseCode,
              isCustomTable: this.planDetailForm.isCustomTable,
              frequency: this.handleCustomData() || [],
            };
            this.saveTempVisible = true;
          }
          this.initRules();
        });
      }, 100);
    },
    // 引用模板
    async getApplyTemp(temp) {
      this.quoteTempVisible = false;
      try {
        let { code, result } = await quoteTemplates({
          tId: temp.id,
          startDate: this.planDetailForm.followupStartTime,
        });
        if (code === 0) {
          console.log("引用模板接口：", result);
          if (result && result.length) {
            this.handleApplyTemp(result);
          }
        }
      } catch (error) {}
      // this.$set(this.planDetailForm, "frequency", temp.templateData.frequencyRule);
    },
    // 处理引用模板接口的数据
    handleApplyTemp(result) {
      let isTooltip = false;
      let arr = result.map((item, index) => {
        let list = this.createSortNumObj(index + 1);
        this.$set(this.sortNumObj, index, list);
        this.setDateObj(item.resultDateStr, index);
        if (item.timeType === "customTime") {
          isTooltip = true;
        }
        let obj = {
          sortNum:
            item.type === "1"
              ? `${item.sortNum}-${item.sortNum}`
              : Number(item.sortNum),
          timeType: item.timeType || "",
          timeContent: item.timeType === "customTime" ? "" : item.timeContent,
          followupDateType: item.followupDateType || "",
          followupSize: item.followupSize || "",
          frequencyTimes: item.frequencyTimes || "",
          frequencyUnit: item.frequencyUnit || "",
          followupDateStr: item.resultDateStr || "",
          isTemp: true, //是否为模板的标识
        };
        return obj;
      });
      this.$set(this.planDetailForm, "frequency", arr);

      if (isTooltip) {
        this.$message({
          type: "warning",
          dangerouslyUseHTMLString: true,
          message:
            "<span style='color: #191919'>引用模版，请再次确认<i style='color: #4468BD'>描紫</i>日期</span>",
        });
      }
    },
    quoteTempClose() {
      this.quoteTempVisible = false;
    },
    saveTempClose() {
      this.saveTempVisible = false;
    },
    // 获取病种list
    async getTagDiseases() {
      try {
        let { code, result } = await getTagDiseases();
        if (code === 0) {
          this.allDiseaseTypeList = result || [];
          console.log("病种list：", this.allDiseaseTypeList);
        }
      } catch (error) {}
    },
    // 获取科室list
    async getDeptAndDocInfoFuc() {
      try {
        let params = {
          hosId: this.planDetailForm.followupHosId,
        };
        let { code, result } = await getDeptAndDocInfo(params);
        if (code === 0) {
          console.log("科室list：", result);
          this.handleDeptList(result || []);
        }
      } catch (error) {}
    },
    handleDeptList(list) {
      let userList = [];
      let deptList = list.map((item) => {
        let children = item?.children || [];
        let users = children.map((vv) => {
          return {
            ...vv,
            deptId: item.deptId,
          };
        });
        userList = userList.concat(users);
        return {
          deptName: item.deptName,
          deptId: item.deptId,
        };
      });
      this.deptList = deptList;
      this.systemCallRangeList = userList;
    },
  },
};
</script>

<style lang="scss" scoped>
.AddPlanNewCom {
  width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    padding: 20px 0;
    .line {
      width: 76px;
      height: 1px;
      background: #bfbfbf;
      margin: 0 10px;
    }
    .num-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 24px;
      height: 24px;
      line-height: 17px;
      font-size: 12px;
      text-align: center;
      border-radius: 15px;
    }

    .num-text-color1 {
      color: #303133;
      margin-left: 10px;
    }

    .num-text-color2 {
      color: #bfbfbf;
      margin-left: 10px;
    }

    .num-icon-color1 {
      color: #fff;
      border: 1px solid rgba(68, 104, 189, 100);
      background: #4468bd;
    }

    .num-icon-color2 {
      color: #bfbfbf;
      border: 1px solid #bfbfbf;
      background: #fff;
    }
  }
  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .demo-form {
    flex: 1;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    .label {
      color: #303133;
      font-size: 14px;
      margin-bottom: 12px;
      .xinghao {
        color: #f56c6c;
      }
    }
    .left-cont {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .el-tag-item {
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        border-radius: 2px;
        margin-left: 8px;
        background-color: #f7f7f7;
        color: #7495e6;
        display: flex;
        align-items: center;
        .circle {
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background-color: #7495e6;
          margin-right: 5px;
        }
      }
      .el-tag-item.el-tag-circle {
        background-color: #f2f9f7;
        color: #1bc4b1;
        margin-left: 20px;
        .circle {
          background-color: #1bc4b1;
        }
      }
    }
    .custom {
      flex: 1;
      .switch-cont {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #5b5b5b;
        font-size: 12px;
        background-color: #f6f7fb;
        padding: 5px 5px 0 5px;
        .right-cont {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
      .frequency-cont {
        background-color: #f6f7fb;
        max-height: calc(100vh - 465px);
        overflow-y: auto;
        padding: 0 5px 25px 5px;
        .frequency-item {
          margin: 10px 8px;
          border-radius: 2px;
          background-color: #f7f7f7;
          color: #101010;
          font-size: 14px;
          text-align: center;
          font-family: Roboto;
          border: 1px solid #cad3f5;
          .item-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            .item-left {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              flex-wrap: wrap;
              .selectDate {
                color: #333333;
                font-size: 12px;
                margin-left: 10px;
                .noSelectDate {
                  color: #c0c4cc;
                }
              }
              .selectDateCusor {
                cursor: pointer;
                span {
                  color: #4468bd;
                }
              }
              .btn-text {
                font-size: 12px;
                .date-btn {
                  color: #333;
                  text-decoration: underline;
                }
                .warn-btn {
                  text-decoration: underline;
                }
              }
              .warn-btn {
                color: #f77601 !important;
              }
            }
            .item-right {
              width: 40px;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              img {
                width: 18px;
                height: 18px;
              }
            }
          }
          .item-bottom {
            display: flex;
            justify-content: flex-start;
          }
          :deep(.el-form-item) {
            margin-bottom: 0;
          }
          :deep(.el-form-item.is-error) {
            .selectDateCls {
              color: #f56c6c !important;
              text-decoration: underline;
            }
          }
        }
        .frequency-item-last {
          background-color: #f2f9f7;
          border: 1px solid #afe2dc;
        }
      }
      .timeType-text {
        color: #1bc4b1;
        line-height: 32px;
        width: 126px;
        display: inline-block;
      }

      :deep(.el-form-item__error) {
        display: none;
      }
    }
    .template-bar {
      height: 40px;
      border-radius: 0px 0px 2px 2px;
      background-color: #7495e6;
      color: #fff;
      font-size: 14px;
      box-shadow: 0px 2px 2px 0px rgba(211, 210, 210, 40);
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button.muban-btn {
        text-align: center;
        border-radius: 2px;
        background-color: transparent;
        color: #ffffff !important;
        font-size: 14px;
        border: 1px solid #b1bff9;
      }
      img {
        margin-left: 8px;
        width: 20px;
        height: 20px;
      }
    }
  }
  .title {
    flex: 1;
    color: #303133;
    font-size: 16px;
    border-left: 3px solid #134796;
    line-height: 20px;
    padding-left: 10px;
  }
  .footer {
    height: 60px;
    padding: 0 10px;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right-btn {
      text-align: right;
      :deep(.el-button--text) {
        color: #919191 !important;
      }
      .step-btn {
        background-color: #fff;
        color: #919191 !important;
        font-size: 14px;
        border: 1px solid #919191;
      }
      :deep(.el-button--primary) {
        background-color: #5381e3 !important;
      }
    }
  }
  .footer-multi {
    justify-content: center;
    border-top: none;
    margin-top: 10px;
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
}
.calendar-navBar {
  height: 40px;
  line-height: 17px;
  font-size: 12px;
  color: #5b5b5b;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .one {
    line-height: 14px;
    border-radius: 2px;
    background-color: #7495e6;
    color: #ffffff;
    font-size: 9px;
    margin-right: 5px;
  }
  .two {
    margin-right: 20px;
  }
  .three {
    color: #5381e3;
    margin-right: 2px;
  }
  .four {
    margin-right: 15px;
  }
  .five {
    border-radius: 2px;
    background-color: #f1f3fd;
    margin-right: 2px;
  }
}
.calendar {
  :deep(.el-calendar__body) {
    padding: 12px 20px;
  }

  :deep(.el-calendar-table) {
    thead th {
      width: 40px;
      height: 40px;
      padding: 0;
      text-align: center;
      line-height: 40px;
      color: #979797;
      background-color: #fff !important;
      font-size: 14px;
      font-family: Microsoft Yahei;
    }
    td {
      border: none;
    }
    tr:first-child td {
      border-left: none;
    }
    tr td:first-child {
      border-left: none;
    }
    .current.is-selected {
      background-color: transparent;
    }
    .el-calendar-day {
      height: 100%;
      padding: 0;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      font-family: Roboto;
      .dateCls {
        height: 100%;
        width: 100%;
        position: relative;
        .labelCls {
          width: 10px;
          height: 10px;
          line-height: 10px;
          background-color: #7495e6;
          color: #fff;
          font-size: 9px;
          text-align: center;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .dateCls.selected {
        background-color: #7495e6;
        color: #fff;
      }
      .dateCls.disabledCls {
        cursor: not-allowed;
      }
      .dateCls.startTimeCls {
        background-color: #f1f3fd;
      }
    }
    .el-calendar-day:hover {
      background-color: transparent;
    }
  }
}
</style>
