<template>
  <el-drawer
    title="查看计划"
    :visible="true"
    direction="rtl"
    size="650px"
    class="check-plan"
    :before-close="closeDrawer"
    destroy-on-close
  >
    <div class="tab-list">
      <div
        :class="['tab-item', { active: activeTab === 'cascader' }]"
        @click="activeTab = 'cascader'"
      >
        计划日历
      </div>
      <div
        :class="['tab-item', { active: activeTab === 'detail' }]"
        @click="activeTab = 'detail'"
      >
        计划详情
      </div>
    </div>
    <div class="container" v-show="activeTab === 'cascader'">
      <el-row style="margin-bottom: 20px; padding: 0 30px">
        <el-col :span="24">
          <div class="instruction" v-if="planRow.statusText === '关闭'">
            <span><i class="el-icon el-icon-info"></i>图例说明</span>
            <span class="ins-item">
              <span class="squre has-followed"></span>
              <span>已随访</span>
            </span>
            <span class="ins-item">
              <span class="squre has-suspend"></span>
              <span>已中止</span>
            </span>
            <span class="ins-item">
              <span class="squre closed"></span>
              <span>已关闭</span>
            </span>
          </div>
          <div class="instruction" v-else>
            <i class="el-icon el-icon-info"></i>图例说明
            <span class="ins-item">
              <span class="squre has-followed"></span>
              <span>已随访</span>
            </span>
            <span class="ins-item">
              <span class="squre load-follow"></span>
              <span>待随访</span>
            </span>
            <span class="ins-item">
              <span class="squre has-planed"></span>
              <span>已计划</span>
            </span>
            <span class="ins-item">
              <span class="squre has-suspend"></span>
              <span>已中止</span>
            </span>
            <span class="ins-item">
              <span class="squre closed"></span>
              <span>已关闭</span>
            </span>
          </div>
        </el-col>
        <el-col :span="12" style="width: 275px; margin-top: 20px">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
          />
        </el-col>
      </el-row>
      <div class="calendar-list">
        <el-scrollbar style="height: 100%">
          <el-calendar
            v-for="(item, index) in calendarList"
            :key="index"
            class="calendar"
            v-model="item.monthDate"
          >
            <template slot="dateCell" slot-scope="{ data }">
              <p
                :class="[
                  'date-p',
                  classMap[findDate(item, data.day).followupStatus],
                ]"
                @click="pageToNext(findDate(item, data.day), data.day, $event)"
              >
                {{ data.day.substr(-2) }}
              </p>
            </template>
          </el-calendar>
        </el-scrollbar>
      </div>
    </div>
    <div class="plan-detail" v-show="activeTab === 'detail'">
      <el-form disabled v-if="followupTypeAssess === '1'" class="formCls">
        <div class="title">随访病种及计划名称</div>
        <div class="content">
          <el-input
            v-model="diseaseName"
            style="width: 107px; margin-right: 10px"
          />
          <el-input
            v-model="planName"
            style="width: 245px; margin-right: 10px"
          />
          <el-input v-model="planTypeText" style="width: 120px" />
        </div>
        <div class="title">随访机构</div>
        <div class="content">
          <el-input v-model="planDetail.followupHosName" style="width: 362px" />
        </div>
        <div class="content">
          <el-input
            v-model="planDetail.followupDeptName"
            style="width: 362px"
          />
        </div>
        <div class="title">开启时间</div>
        <div class="content">
          <el-input
            v-model="followupStartTime"
            style="width: 362px; margin-right: 10px"
          />
          <el-input v-model="startTimeStr" style="width: 120px" />
        </div>
        <div class="title">随访频率</div>
        <div class="content">
          <el-radio-group v-model="planDetail.frequencyType">
            <el-radio :label="'0'">固定</el-radio>
            <el-radio :label="'1'">自定义</el-radio>
          </el-radio-group>
        </div>
        <div class="content" v-if="planDetail.frequencyType == 0">
          <el-input v-model="frequency" style="width: 362px" />
        </div>
        <!-- 自定义 -->
        <div class="frequency-cont" v-else>
          <el-scrollbar style="height: 100%; padding-right: 10px">
            <div
              class="frequency-item"
              v-for="(item, index) in frequencyList"
              :key="index"
            >
              <div class="item-top">
                <div class="item-left">
                  <el-input v-model="item.sortNumName" style="width: 110px" />
                </div>
                <div class="item-right">
                  <template v-if="item.type === '0'">
                    <el-input
                      v-model="item.timeTypeName"
                      style="width: 120px; margin-right: 8px"
                    />
                    <template
                      v-if="
                        item.timeType === 'afterStartTime' ||
                        item.timeType === 'afterLastTime'
                      "
                    >
                      第
                      <el-input-number
                        v-model="item.timeContent"
                        :controls="false"
                        style="width: 60px; margin: 0 8px"
                      ></el-input-number>
                      <span style="margin-right: 15px">天</span>
                    </template>
                    <span v-else style="width: 120px"></span>
                  </template>
                  <template v-else>
                    <el-input
                      v-model="item.frequencyTimes"
                      style="width: 50px; margin-right: 8px"
                    />
                    <el-input
                      v-model="item.frequencyUnitName"
                      style="width: 70px; margin-right: 8px"
                    />
                    执行
                    <el-input-number
                      v-model="item.followupSize"
                      :controls="false"
                      style="width: 60px; margin: 0 8px"
                    ></el-input-number>
                    <span style="margin-right: 100px">次</span>
                    <span class="timeType-text" style="margin: 0 8px">
                      {{ item.selectDateText }}
                    </span>
                    <el-input
                      v-model="item.followupDateTypeName"
                      style="width: 100px; margin-right: 8px"
                    />
                  </template>
                  <div class="selectDate" style="margin: 0 8px">
                    {{ item.followupDateStrName }}
                  </div>
                </div>
              </div>
              <div class="item-bottom" v-if="planDetail.isCustomTable === '1'">
                <el-input
                  v-model="item.followupTableName"
                  style="width: 240px"
                />
                <span v-if="item.status === 'N'" style="margin-left: 10px">
                  <i
                    class="el-icon el-icon-warning-outline"
                    style="color: red"
                  ></i>
                  表单模板已于{{ item.startEndDate }}被停用
                </span>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="title">随访次数</div>
        <div class="content">
          <el-input v-model="followupSize" style="width: 362px" />
        </div>
        <div class="title">随访方式</div>
        <div class="content">
          <el-input v-model="followupType" style="width: 362px" />
        </div>
        <template
          v-if="
            planDetail.frequencyType == 0 || planDetail.isCustomTable === '0'
          "
        >
          <div class="title">随访表单</div>
          <div class="content">
            <el-input v-model="followupForm" style="width: 362px" />
            <span
              v-if="this.planDetail.status === 'N'"
              style="margin-left: 10px"
            >
              <i class="el-icon el-icon-warning-outline" style="color: red"></i>
              表单模板已于{{ this.planDetail.startEndDate }}被更新
            </span>
          </div>
        </template>
        <div class="inline-content">
          <span class="title">患者提醒</span>
          <el-checkbox-group v-model="planDetail.msgToRemind">
            <el-checkbox label="1">系统消息</el-checkbox>
            <el-checkbox label="2">短信消息</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="inline-content">
          <span class="title">医生提醒</span>
          <el-checkbox-group v-model="systemCall">
            <el-checkbox
              v-for="(item, index) in warnList"
              :key="index"
              :label="item.value"
              :disabled="item.value === '1'"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div class="inline-content">
          <span class="title">提醒范围</span>
          <el-input v-model="planDetail.msgToUserName" style="width: 362px" />
        </div>
        <div class="inline-content">
          <span class="title">超期编辑</span>
          <el-radio-group v-model="beyondEditor">
            <el-radio label="1">开</el-radio>
            <el-radio label="0">关</el-radio>
          </el-radio-group>
        </div>
      </el-form>
      <el-form disabled v-else>
        <el-row>
          <el-col :span="18" style="position: relative">
            <el-form-item label="评估名称">
              <el-input v-model="planDetail.planName" />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="开启时间">
              <el-input v-model="planDetail.followupStartTime" />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="随访方式">
              <el-input v-model="constFollowupTypeText" />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="随访表单">
              <div class="content">
                <el-input v-model="followupForm" />
                <span
                  v-if="this.planDetail.status === 'N'"
                  style="margin-left: 10px"
                >
                  <i
                    class="el-icon el-icon-warning-outline"
                    style="color: red"
                  ></i>
                  表单模板已于{{ this.planDetail.startEndDate }}被更新
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="患者提醒">
              <el-checkbox-group v-model="planDetail.msgToRemind">
                <el-checkbox label="1">系统消息</el-checkbox>
                <el-checkbox label="2">短信消息</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import dayjs from "dayjs";
import { intToChinese } from "@/utils/utils.js";
import {
  getFollowUpData,
  getPatientInfo,
  checkCalendarAuth,
} from "@/api/modules/PatientCenter";
import {
  warnList,
  planTypeList,
  unitList,
  followUpTypeList,
  timeTypeList,
  frequencyUnitList,
} from "@/utils/data-map";
export default {
  name: "CheckPlan",
  props: [
    "visible",
    "closeDrawer",
    "planRow",
    "planDetail",
    "followupTypeAssess",
    "followUpForms",
  ],
  data() {
    return {
      dateRange: [],
      calendarList: [],
      classMap: {
        1: "load-follow",
        2: "has-followed",
        3: "has-suspend",
        4: "closed",
        5: "has-planed",
      },
      diseaseTypeList: [],
      activeTab: "cascader",
      warnList: warnList,
    };
  },
  computed: {
    diseaseName() {
      const deasease = this.diseaseTypeList.find(
        (diseaseType) =>
          diseaseType.richDiseaseCode === this.planDetail.diseaseCode
      );
      return deasease ? deasease.richDiseaseName : "";
    },
    planName() {
      return this.planDetail.planName;
    },
    planTypeText() {
      const plan = planTypeList.find(
        (item) => item.value === this.planDetail.planType
      );
      return plan ? plan.label : "";
    },
    followupStartTime() {
      let followupStartTime = this.planDetail.followupStartTime
        ? dayjs(new Date(this.planDetail.followupStartTime)).format(
            "YYYY-MM-DD"
          )
        : "";
      return followupStartTime;
    },
    startTimeStr() {
      let startTimeStr = this.planDetail.followupStartTime
        ? dayjs(new Date(this.planDetail.followupStartTime)).format("HH:mm:ss")
        : "";
      return startTimeStr;
    },
    frequency() {
      const unit = unitList.find(
        (item) => item.value === this.planDetail.frequencyUnit
      );
      const unitLabel = unit ? unit.label : "";
      return `${this.planDetail.frequencyTimes}${unitLabel}1次`;
    },
    followupSize() {
      return `${this.planDetail.followupSize}次`;
    },
    followupType() {
      return followUpTypeList.find(
        (item) => item.value === this.planDetail.followupType
      ).label;
    },
    followupForm() {
      return this.planDetail.followTemplateDesc;
    },
    systemCall() {
      return this.planDetail.systemCall;
    },
    beyondEditor() {
      return this.planDetail.beyondEditor;
    },
    constFollowupTypeText() {
      return "网络";
    },
    frequencyList() {
      let frequencyList = [];
      if (
        this.planDetail.frequencyType == "1" &&
        this.planDetail.frequencyRule
      ) {
        // 自定义
        let frequency = JSON.parse(this.planDetail.frequencyRule);
        let newFrequency = frequency.map((item, index) => {
          let obj = { ...item };
          if (item.type === "1") {
            obj.sortNumName = `第${intToChinese(item.sortNum)}次开始`;
            obj.selectDateText = `自选第${intToChinese(
              item.sortNum
            )}次初始日期`;
            obj.followupDateTypeName = this.getFollowupDateTypeName(
              item.followupDateType
            );
          } else {
            obj.sortNumName = `第${intToChinese(item.sortNum)}次`;
            obj.timeTypeName = timeTypeList.find(
              (vv) => vv.value === item.timeType
            )?.label;
          }

          if (this.planDetail.isCustomTable === "1") {
            obj.followupTableName = this.followUpForms.find(
              (vv) => vv.value === item.followupTable
            )?.label;
          }
          obj.frequencyUnitName = frequencyUnitList.find(
            (vv) => vv.value === item.frequencyUnit
          )?.label;
          obj.followupDateStrName = item.followupDateStr
            ? dayjs(item.followupDateStr).format("MM月DD日")
            : "";
          return obj;
        });
        console.log("newFrequency:", newFrequency);
        frequencyList = newFrequency;
      }
      return frequencyList;
    },
  },
  async mounted() {
    console.log("this.planDetail", this.planDetail);
    await this.getPatientInfo();
    this.getFollowUpData();
  },
  methods: {
    async getPatientInfo() {
      try {
        const res = await getPatientInfo({ patId: this.$route.query.patId });
        this.diseaseTypeList = res.result.patientRichDiseaseList;
      } catch (err) {
        console.log(err);
      }
    },
    findDate(calendar, date) {
      if (!calendar) {
        return;
      }
      const follow = calendar.personFollowUpDtos.find(
        (item) => item.nextFollowTime.split(" ")[0] === date
      );
      if (!follow) {
        return {};
      }
      return follow;
    },
    async getFollowUpData() {
      try {
        const res = await getFollowUpData({
          patId: this.$route.query.patId,
          planId: this.planRow.planId,
          followupStartTime: this.dateRange[0] || "",
          followupEndTime: this.dateRange[1] || "",
        });
        this.dateRange = res.result.followupStartTime
          ? [res.result.followupStartTime, res.result.followupEndTime]
          : [];
        this.calendarList = res.result.drawerDateDtos;
      } catch (err) {
        console.error(err);
      }
    },
    async checkCalendarAuth() {
      let flag = false;
      try {
        await checkCalendarAuth({ patId: this.$route.query.patId });
        flag = true;
      } catch (error) {
        flag = false;
      }
      return flag;
    },
    async pageToNext(follow, date, e) {
      let flag = await this.checkCalendarAuth();
      if (!flag) {
        this.$message.error("您没有权限查看！");
        return;
      }
      e.stopPropagation();
      const status = follow.followupStatus;
      if (status === "5") {
        return;
      }

      if (status === "1") {
        window.sessionStorage.setItem("isFirstFromOtherPage", true);
        if (follow.isEntry === "0") {
          this.$message.warning(`${follow.canEntryTime}可录入`);
          return;
        }
        this.$router.push({
          name: "FollowUpDetail",
          query: {
            followupId: follow.followupId,
            planId: follow.planId,
          },
        });
      } else if (status === "2") {
        this.$router.push({
          name: "FollowUpDetail",
          query: {
            followupId: follow.followupId,
            planId: follow.planId,
          },
        });
      }
      // else if (status === '3') {
      //   window.sessionStorage.setItem('isFirstFromOtherPage', true);
      //   this.$router.push({
      //     name: 'FollowUpList',
      //     query: {
      //       searchValue: follow.name,
      //       followUpStatus: status,
      //       followupStartTime: dayjs(date).format('YYYY-MM-DD'),
      //       followupEndTime: dayjs(date).format('YYYY-MM-DD'),
      //       diseaseCode: follow.diseaseCode
      //     }
      //   });
      // } else if (status === '4') {
      //   window.sessionStorage.setItem('isFirstFromOtherPage', true);
      //   this.$router.push({
      //     name: 'FollowUpList',
      //     query: {
      //       searchValue: follow.name,
      //       followUpStatus: status,
      //       followupStartTime: dayjs(date).format('YYYY-MM-DD'),
      //       followupEndTime: dayjs(date).format('YYYY-MM-DD'),
      //       diseaseCode: follow.diseaseCode,
      //     }
      //   });
      // }
    },
    // 反显followupDateTypeName
    getFollowupDateTypeName(data) {
      if (!data) {
        return "";
      }
      let str = "";
      if (data.indexOf("lastDay_0") > -1) {
        str = "(月)最后1日";
      } else if (data.indexOf("day_") > -1) {
        str = `(月)${data.split("day_")[1]}日`;
      } else if (data === "middleMonth") {
        str = "(月)中";
      } else if (data.indexOf("startWeek") > -1) {
        let weekDay = data.split("startWeek_1_")[1];
        str = `(月)第一个周${intToChinese(weekDay === 0 ? 7 : weekDay)}`;
      } else if (data.indexOf("lastWeek") > -1) {
        let weekDay = data.split("lastWeek_0_")[1];
        str = `(月)最后一个周${intToChinese(weekDay === 0 ? 7 : weekDay)}`;
      } else if (data.indexOf("week") > -1) {
        let WeekOfMonth = Number(lastDateType.split("_")[1]); //第几周
        let week = Number(lastDateType.split("_")[2]); //周几
        str = `(月)第${intToChinese(WeekOfMonth)}周的周${
          week == 0 ? "日" : intToChinese(week)
        }`;
      }
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.check-plan {
  .tab-list {
    width: 260px;
    margin: 0 auto;
    background-color: #f7f7f7;
    border-radius: 130px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    margin-bottom: 20px;
    .tab-item {
      width: 130px;
      color: #333333;
      text-align: center;
      cursor: pointer;
      &.active {
        background-color: #4469bd;
        color: #fff;
        border-radius: 130px;
      }
    }
  }
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .instruction {
      border-radius: 1px;
      background-color: rgba(235, 241, 253, 100);
      border: 1px solid rgba(68, 106, 189, 100);
      color: rgba(48, 51, 19, 100);
      font-size: 14px;
      padding-left: 10px;
      height: 32px;
      line-height: 32px;
      display: flex;
      .el-icon {
        margin-top: 10px;
        margin-right: 6px;
        color: #446bbd;
      }
      .ins-item {
        margin-left: 12px;
        display: flex;
        align-items: center;
        &:first-child {
          margin-left: 15px;
        }
        .squre {
          display: inline-block;
          width: 16px;
          height: 16px;
          border-radius: 2px;
          margin-right: 5px;
          &.has-followed {
            background-color: rgba(101, 101, 101, 100);
          }
          &.load-follow {
            background-color: rgba(68, 106, 189, 100);
          }
          &.has-planed {
            border: 2px solid rgba(68, 106, 189, 100);
          }
          &.has-suspend {
            border: 2px solid rgba(255, 37, 37, 100);
          }
          &.closed {
            background-color: rgba(255, 37, 37, 100);
          }
        }
      }
    }
    .calendar-list {
      flex: 1;
      overflow: hidden;
      .calendar {
        display: inline-block;
        margin-left: 30px;
        width: 275px;
        &:nth-child(2n) {
          margin-right: 0;
          margin-bottom: 30px;
        }
        .date-p {
          box-sizing: border-box;
          pointer-events: none !important;
        }
        .has-followed {
          background-color: rgba(101, 101, 101, 100);
          color: #fff;
          pointer-events: auto !important;
        }
        .load-follow {
          background-color: rgba(68, 106, 189, 100);
          color: #fff;
          pointer-events: auto !important;
        }
        .has-planed {
          border: 2px solid rgba(68, 106, 189, 100);
          line-height: 29px;
          // pointer-events: auto !important;
        }
        .has-suspend {
          border: 2px solid rgba(255, 37, 37, 100);
          line-height: 29px;
          pointer-events: auto !important;
          cursor: no-drop;
        }
        .closed {
          background-color: rgba(255, 37, 37, 100);
          color: #fff;
          pointer-events: auto !important;
          cursor: no-drop;
        }
      }
    }
  }
  .plan-detail {
    padding: 0 22px;
    flex: 1;
    overflow: hidden;

    .formCls {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .content {
      margin-bottom: 20px;
    }
    .inline-content {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .title {
        margin-right: 10px;
      }
    }

    .frequency-cont {
      overflow-y: auto;
      .frequency-item {
        margin-right: 5px;
        margin-bottom: 12px;
        padding: 8px;
        border-radius: 2px;
        background-color: #f6f7fb;
        color: #101010;
        font-size: 14px;
        border: 1px solid #d9d9d9;
        .item-top {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          .item-left {
            margin-right: 8px;
          }
          .item-right {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
          }
          .selectDate {
            color: #333333;
            font-size: 12px;
            margin-left: 10px;
          }
        }
        .item-bottom {
          display: flex;
          justify-content: flex-start;
          padding-left: 118px;
        }
        :deep(.el-input) {
          margin-bottom: 5px !important;
        }
        :deep(.el-input-number) {
          .el-input {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>

<style scoped>
>>> .el-calendar__button-group {
  display: none !important;
}
>>> .el-calendar {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #e4e7ed;
  border-radius: 10px;
}
>>> .el-calendar-table .el-calendar-day {
  height: 33px !important;
  line-height: 33px !important;
  padding: 0;
  text-align: center;
}
>>> .el-calendar-table th {
  text-align: center;
}
>>> .el-calendar__header {
  justify-content: center;
}

>>> .el-calendar-table td {
  border: 0 !important;
  pointer-events: none !important;
}
>>> .el-calendar__body {
  padding-bottom: 10px;
}
>>> .el-drawer__header {
  padding: 0;
}
>>> .el-drawer__header span {
  border-left: 3px solid #446abd;
  padding-left: 10px;
  color: #000;
}

>>> .el-date-editor {
  width: 100% !important;
}

>>> .el-calendar-table td.is-selected {
  background-color: transparent;
}

>>> .el-input {
  width: 245px;
}

>>> .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #606266;
  border-color: #606266;
}
>>> .el-radio__input.is-disabled.is-checked + span.el-radio__label {
  color: #606266;
}
>>> .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #606266;
  border-color: #606266;
}
>>> .el-checkbox__input.is-disabled.is-checked + span.el-checkbox__label {
  color: #606266;
}
>>> .el-input.is-disabled .el-input__inner {
  color: #606266;
}

>>> .el-drawer__body {
  display: flex;
  flex-direction: column;
}
</style>
