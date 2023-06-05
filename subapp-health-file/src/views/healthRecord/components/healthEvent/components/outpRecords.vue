<template>
  <div class="outpRecords">
    <div
      class="height100"
      v-if="navBarObj.activeName === 'first' && currentComponent1"
    >
      <component
        :is="currentComponent1"
        :navBarObj="navBarObj"
        v-if="currentComponent1"
      ></component>
    </div>
    <div
      class="outpRecords-cont"
      v-else-if="navBarObj.activeName === 'second' && currentComponent2"
    >
      <health-header
        :navBarObj="navBarObj"
        :mainData="mainData"
        class="healthHeader"
      ></health-header>
      <div :style="healthContHeight">
        <component
          :is="currentComponent2"
          :navBarObj="navBarObj"
          @getMainData="getMainData"
          v-if="currentComponent2"
        ></component>
      </div>
    </div>
    <div
      class="tab-cont emptyBox"
      v-if="!currentComponent1 && !currentComponent2"
    >
      <IconSvg
        iconClass="empty-box"
        style="color: #cacdd4"
        width="80"
        height="80"
      ></IconSvg>
      <div class="emptyText">暂无数据</div>
    </div>
  </div>
</template>

<script>
import MedicalTreatmentRecord from "./medicalTreatmentRecord/medicalTreatmentRecord";
import inpDepartRecord from "./inpDepartRecord/inpDepartRecord";
import healthExam from "./healthExam/healthExam";
import healthExamMain from "./healthExam/components/main";
import treatmentRecord from "./medicalTreatmentRecord/components/treatmentRecord";
import medRecordIndex from "./inpDepartRecord/components/medRecordIndex";
import operateRecord from "./inpDepartRecord/components/operateRecord";
import checkRecord from "@/views/healthRecord/components/healthEvent/components/checkRecords/checkRecord";
import assaysRecord from "@/views/healthRecord/components/healthEvent/components/assaysRecord/assaysRecord";
import tranTreat from "@/views/healthRecord/components/healthEvent/components/tranTreat/tranTreat";
import prescriptionInfo from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/prescriptionInfo.vue";
import hosYiZhu from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/hosYiZhu.vue";
import diseaseMedicine from "@/views/healthRecord/components/healthEvent/components/diseaseMedicine/diseaseMedicine.vue";

import healthHeader from "./healthHeader/healthHeader";

export default {
  name: "outpRecords",
  components: {
    MedicalTreatmentRecord,
    inpDepartRecord,
    healthExam,
    healthExamMain,
    treatmentRecord,
    medRecordIndex,
    operateRecord,
    checkRecord,
    assaysRecord,
    tranTreat,
    prescriptionInfo,
    hosYiZhu,
    diseaseMedicine,
    healthHeader,
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
      currentComponent1: null,
      currentComponent2: null,
      //动态获取content高度
      healthContHeight: {
        height: "auto",
        "overflow-y": "hidden",
      },
      // 卫生服务活动数据
      mainData: {
        type: "",
        data: null,
      },
    };
  },
  watch: {
    personalInfos: {
      handler(val) {},
      deep: true,
    },
    navBarObj: {
      handler(val) {
        if (val.activeName === "first") {
          this.currentComponent2 = null;
          this.mainData = {
            type: "",
            data: null,
          };
          if (val.type === "门诊") {
            this.currentComponent1 = MedicalTreatmentRecord;
          } else if (val.type === "住院") {
            this.currentComponent1 = inpDepartRecord;
          } else if (val.type === "体检") {
            this.currentComponent1 = healthExam;
          } else {
            this.currentComponent1 = null;
          }
        } else if (val.activeName === "second") {
          this.currentComponent1 = null;
          this.mainData = {
            type: "",
            data: null,
          };
          this.healthContHeight = {
            height: "auto",
            "overflow-y": "hidden",
          };
          if (val.type === "treatmentRecord") {
            this.currentComponent2 = treatmentRecord;
          } else if (val.type === "medRecordIndex") {
            this.currentComponent2 = medRecordIndex;
          } else if (val.type === "healthExam") {
            this.currentComponent2 = healthExamMain;
          } else if (val.type === "operateRecord") {
            this.currentComponent2 = operateRecord;
          } else if (val.type === "checkRecord") {
            this.currentComponent2 = checkRecord;
          } else if (val.type === "assaysRecord") {
            this.currentComponent2 = assaysRecord;
          } else if (val.type === "tranTreat") {
            this.currentComponent2 = tranTreat;
          } else if (val.type === "pharmacy") {
            if (val.groupType === "outpatient") {
              // 门诊
              this.currentComponent2 = prescriptionInfo;
            } else if (val.groupType === "inpatient") {
              // 住院
              this.currentComponent2 = hosYiZhu;
            } else if (val.groupType === "diag") {
              // 疾病
              this.currentComponent2 = diseaseMedicine;
            }
          } else {
            this.currentComponent2 = null;
          }
          this.getHealthContHeight(val);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    getHealthContHeight(val) {
      this.$nextTick(() => {
        let healthHeaderDom = document.getElementsByClassName("healthHeader");
        let outpRecordsContDom =
          document.getElementsByClassName("outpRecords-cont");
        if (!healthHeaderDom || !healthHeaderDom.length) {
          return;
        }
        if (!outpRecordsContDom || !outpRecordsContDom.length) {
          return;
        }
        let healthHeaderHeight = healthHeaderDom[0].offsetHeight;
        let outpRecordsContHeight = outpRecordsContDom[0].offsetHeight;
        this.healthContHeight = {
          height: outpRecordsContHeight - healthHeaderHeight - 41 + "px",
          "overflow-y":
            val.type === "healthExam" ||
            val.type === "assaysRecord" ||
            val.type === "pharmacy"
              ? "hidden"
              : "auto",
        };
      });
    },
    getMainData(data) {
      this.mainData = {
        type: this.navBarObj.type,
        data,
      };
    },
  },
};
</script>

<style lang="scss" scoped="">
.outpRecords {
  width: 100%;
  height: 100%;
  .outpRecords-cont {
    height: calc(100% - 20px);
    overflow-y: visible;
    padding: 10px;
  }
  .emptyBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .emptyText {
      color: #88898e;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
    }
  }
}
</style>
