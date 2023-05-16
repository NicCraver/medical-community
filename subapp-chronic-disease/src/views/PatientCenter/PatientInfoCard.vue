<template>
  <div class="patient-info-card">
    <div class="flex-item">
      <img
        src="../../assets/women.png"
        alt=""
        v-if="patientInfo.sex === '女'"
      />
      <img src="../../assets/man.png" alt="" v-else />
    </div>
    <div class="flex-item">
      <div class="basic-info">
        {{ patientInfo.name }}<span class="sex">{{ patientInfo.sex }}</span
        >{{ patientInfo.age }}
      </div>
      <div :class="['view-360', { disabled: patientInfo.applyType !== 'HIS' }]" @click="Open360Frame">360视图</div>
    </div>
    <div class="flex-item">
      <el-row :gutter="40">
        <el-col :span="6">出生日期：{{ patientInfo.birthday }}</el-col>
        <el-col :span="9">居民身份证：{{ patientInfo.idNo }}</el-col>
        <el-col :span="9">联系地址：{{ patientInfo.addressDetail }}</el-col>
        <el-col :span="6">联系电话：{{ patientInfo.phoneNo }}</el-col>
        <el-col :span="18">医疗支付方式：{{ patientInfo.payment }}</el-col>
      </el-row>
      <div class="disease-list">
        <span
          v-for="item in patientInfo.patientRichDiseaseList"
          :key="item.richDiseaseCode"
          class="disease-item"
          >{{ item.richDiseaseName }}</span
        >
      </div>
    </div>
    <div
      :class="['update-tag', { disabled: isDisabled }]"
      v-if="tagFlag"
      @click="getPatientInfo(true)"
    >
      更新慢病标签
    </div>
    <div class="record-status" v-if="patientInfo.recordStatus === '4'">已结档</div>
    <el-drawer
      title="更新慢病标签"
      :visible.sync="drawer"
      direction="rtl"
      :size="380"
    >
      <ChronicTag
        :hasedTagList="hasedTagList"
        @saveDiseaseTagSuccess="getPatientInfo"
        :patientInfo="patientInfo"
        @cancelDrawer="drawer = false"
      />
    </el-drawer>
    <Iframe360
      :visible.sync="Iframe360"
      :pid="hisPatientId"
      :idNo="patientInfo.idNo"
    ></Iframe360>
  </div>
</template>

<script>
import ChronicTag from "./ChronicTag";
import Iframe360 from "../../components/Iframe360/index.vue";
import { getPatientInfo } from "@/api/modules/PatientCenter";
import { getKeyByValue, sexMap, paymentList } from "./data-map";

export default {
  props: {
    currentTime: {
      type: String,
    },
    tagFlag: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Iframe360: false,
      patientInfo: {},
      drawer: false,
      hasedTagList: [],
      hisPatientId: "",
    };
  },
  mounted() {
    this.patId = this.$route.query.patId;
    this.hisPatientId = this.$route.query.hisPatientId;
    this.getPatientInfo(false);
  },
  methods: {
    Open360Frame() {
      if (this.patientInfo.applyType !== 'HIS') {
        return
      }
      window.open(
        `http://10.10.254.234:8080/share/timeline?patientsn=${this.hisPatientId}`
      );
    },
    getPatientInfo(drawer) {
      getPatientInfo({ patId: this.patId }).then((res) => {
        console.log("res.result---", res.result);
        this.patientInfo = {
          ...res.result,
          sex: getKeyByValue(sexMap, res.result.sex),
          payment: paymentList.find((item) => item.value === res.result.payType)
            ? paymentList.find((item) => item.value === res.result.payType)
                .label
            : "",
          addressDetail: res.result.addressText + res.result.street,
        };
        this.hasedTagList = this.patientInfo.patientRichDiseaseList.map(
          (item) => ({
            label: item.richDiseaseName,
            orgCode: item.orgCode,
            value: item.richDiseaseCode,
          })
        );
        this.drawer = drawer;
        this.$emit("refreshLogs");
      });
    },
  },
  watch: {
    currentTime() {
      this.getPatientInfo();
    },
  },
  components: {
    ChronicTag,
    Iframe360,
  },
};
</script>

<style lang="scss" scoped>
.patient-info-card {
  padding: 12px;
  background-color: #446abd;
  color: #fff;
  display: flex;
  position: relative;
  margin-bottom: 11px;
  .flex-item:nth-child(2) {
    margin: 0 16px;
    .basic-info {
      font-size: 20px;
      .sex {
        margin: 0 8px;
      }
    }
    .view-360 {
      width: 140px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      color: rgba(19, 71, 150, 100);
      font-size: 14px;
      text-align: center;
      background-color: #fff;
      margin-top: 13px;
      user-select: none;
      cursor: pointer;
      &.disabled {
        background-color: rgba(245, 245, 245, 100);
        color: rgba(145, 145, 145, 100);
      }

    }
  }
  .flex-item:nth-child(3) {
    flex: 1;
    .el-row {
      font-size: 16px;
      .el-col {
        margin-bottom: 18px;
      }
    }
    .disease-list {
      .disease-item {
        display: inline-block;
        border: 1px solid #fff;
        line-height: 32px;
        height: 32px;
        text-align: center;
        padding: 0 8px;
        color: #fff;
        margin-right: 13px;
        font-size: 14px;
      }
    }
  }
  .update-tag {
    position: absolute;
    top: 50%;
    right: 0;
    height: 32px;
    line-height: 32px;
    margin-top: -62px;
    background-color: rgba(221, 231, 255, .7);
    color: #4468bd;
    padding-left: 10px;
    border-radius: 16px 0 0 16px;
    cursor: pointer;
    &:hover {
      background-color: rgba(221, 231, 255, 1);
    }
    &.disabled {
      background-color: rgba(245, 245, 245, 100);
      color: rgba(145, 145, 145, 100);
      pointer-events: none;
      cursor: default;
    }
  }
  .record-status {
    position: absolute;
    right: 15px;
    bottom: 15px;
    width: 75px;
    height: 75px;
    border: 2px solid #BFBFBF;
    color: #BFBFBF;
    border-radius: 50%;
    font-size: 18px;
    line-height: 75px;
    text-align: center;
    box-sizing: border-box;
    transform: rotate(24deg);
  }
}
</style>

<style scoped>
>>> .el-drawer__header {
  border-left: 2px solid #134796;
  padding-top: 0;
  font-weight: bold;
  color: #000;
  font-size: 16px;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 0;
}
>>> .el-drawer__body {
  padding: 0 12px;
}
</style>
