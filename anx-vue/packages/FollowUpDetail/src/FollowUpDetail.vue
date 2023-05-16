<template>
  <ProLayout mainBgColor="#F5F5F5" padding="0">
    <template #title>{{ followUpName }}</template>
    <template #main>
      <div class="add-followup">
        <div class="time-line" v-show="activities.length">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in activities"
              :key="index"
              :timestamp="item.timestamp"
              :type="item.timestamp === activeTimestamp ? 'primary' : null"
              :class="{
                'supply-active':
                  item.isTimeOutDate === '1' &&
                  item.timestamp !== activeTimestamp,
              }"
              placement="top"
            >
              <p v-if="item.isTimeOutDate === '1'">
                (补录时间:{{ item.followUpDate }})
              </p>
              <p>{{ item.type }}</p>
              <p>随访人：{{ item.person }}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="content">
          <PatientInfoCard
            :patientInfo="patientInfo"
            style="margin-bottom: 0"
            @open360View="() => $emit('open360View')"
          />
          <el-tabs v-model="activeTabForm">
            <el-tab-pane
              v-for="item in formTabDatas"
              :key="item.label"
              :name="item.name"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
          <div class="form-container">
            <anx-form
              :anxFormData="anxFormData"
              :disabled="isDisabed"
              ref="anxForm"
              :baseUrl="baseUrl"
              :echoData="echoData"
            />
            <div
              class="assessment"
              v-if="
                feedbackStatus === '0' &&
                formType !== 'EVALUATION' &&
                (followupType === '网络' || followupType === '不限')
              "
            >
              待评估
            </div>
            <div
              class="assessment"
              :style="
                feedbackResult === '1'
                  ? 'background:#5381E3'
                  : 'background:#F79161'
              "
              v-if="
                feedbackStatus === '1' &&
                formType !== 'EVALUATION' &&
                (followupType === '网络' || followupType === '不限')
              "
            >
              {{ feedbackResult === "1" ? "平稳" : "需注意" }}
            </div>
          </div>
        </div>

        <div class="actions" v-if="showBottomActions">
          <el-button @click="suspendSubmit" v-if="showSubmitButton" style="color: #F79161 !important; border-color: #F79161"
            >中止</el-button
          >
          <el-button @click="followupTempSubmit" v-if="showSubmitButton"
            >暂存</el-button
          >
          <el-button
            type="primary"
            @click="followupSubmit"
            v-if="showSubmitButton"
            >提交</el-button
          >
          <el-button
            type="primary"
            @click="onAssessment"
            v-if="
              !showSubmitButton &&
              formType !== 'EVALUATION' &&
              (followupType === '网络' || followupType === '不限')
            "
            :disabled="!isDisabed || feedbackStatus !== '0'"
          >
            评估
          </el-button>
          <el-button
            @click="back"
            id="baccccck"
            style="
              border: 1px solid rgba(145, 145, 145, 100);
              color: rgba(145, 145, 145, 100) !important;
            "
            >返回</el-button
          >
        </div>
      </div>
    </template>
  </ProLayout>
</template>

<script>
import ProLayout from "../../ProLayout";
import { AnxForm } from "anx-form";
// import { ProLayout } from "anx-vue";
import PatientInfoCard from "../../PatientInfoCard";

export default {
  name: "FollowUpDetail",
  props: {
    baseUrl: {
      type: String,
      required: true,
    },
    followupType: {
      type: String,
      required: true,
    },
    formType: {
      type: String,
      required: true,
    },
    followUpName: {
      type: String,
      required: true,
    },
    activities: {
      type: Array,
      required: true,
    },
    formTabDatas: {
      type: Array,
      required: true,
    },
    feedbackStatus: {
      type: String,
      required: true,
    },
    feedbackResult: {
      type: String,
      required: true,
    },
    activeTabForm: {
      type: String,
      required: true,
    },
    anxFormData: {
      type: Object,
      required: true,
    },
    showBottomActions: {
      type: Boolean,
      default: false,
    },
    showSubmitButton: {
      type: Boolean,
      default: true,
    },
    isDisabed: {
      type: Boolean,
      default: false,
    },
    activeTimestamp: {
      type: String,
      required: true,
    },
    patientInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    echoData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    followupSubmit() {
      this.$emit("followup-submit", this.$refs.anxForm.formSubmit());
    },
    followupTempSubmit() {
      this.$emit("followup-temp-submit", this.$refs.anxForm.getFormInitData());
    },
    getSubmitData() {
      return this.$refs.anxForm.formSubmit();
    },
    getFormInitData() {
      return this.$refs.anxForm.getFormInitData();
    },
    back(arg) {
      this.$emit("back", arg);
    },
    onAssessment() {
      this.$emit("onAssessment");
    },
    suspendSubmit() {
      this.$emit("suspendSubmit");
    }
  },
  components: {
    ProLayout,
    PatientInfoCard,
    AnxForm,
  },
};
</script>

<style lang="scss" scoped>
.add-followup {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  .time-line {
    width: 220px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 12px 8px;
    margin-right: 15px;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .form-container {
      flex: 1;
      background-color: #fff;
      margin-bottom: 45px;
      overflow: auto;
      .assessment {
        position: absolute;
        right: 10px;
        top: 280px;
        width: 100px;
        height: 36px;
        line-height: 36px;
        border-radius: 20px 0px 0px 20px;
        background-color: rgba(159, 157, 157, 100);
        color: #fff;
        font-size: 14px;
        text-align: center;
        z-index: 2;
      }
    }
    .form-container::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    .form-container::-webkit-scrollbar-thumb {
      background-color: #dedde3;
      border-radius: 8px;
    }
  }
  .actions {
    position: fixed;
    left: 208px;
    bottom: 0;
    right: 0;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    // box-shadow: 2px 0 0 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0px -1px 3px 0px rgba(204, 204, 204, 80);
    text-align: right;
    padding-right: 25px;
    z-index: 1000;
  }
}
</style>

<style scoped>
::v-deep .el-timeline-item__node {
  background-color: #fff;
  border: 2px solid #446abd;
}
::v-deep.el-timeline-item__node--primary {
  background-color: #446bbd !important;
}
::v-deep .el-tabs__header {
  padding-left: 8px;
  background-color: #fff;
}

::v-deep.el-timeline-item.supply-active .el-timeline-item__node {
  background-color: #fff;
  border: 2px solid red;
}
</style>
