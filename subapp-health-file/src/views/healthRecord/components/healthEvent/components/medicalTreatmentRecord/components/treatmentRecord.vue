<template>
  <div class="treatmentRecord">
    <div class="each-block">
      <div class="title">主诉</div>
      <div class="content">{{ obj.zs ? obj.zs : "" }}</div>
    </div>
    <div class="each-block">
      <div class="title">现病史</div>
      <div class="content">{{ obj.xbs ? obj.xbs : "" }}</div>
    </div>
    <div class="each-block">
      <div class="title">既往史</div>
      <div class="content">{{ obj.jws ? obj.jws : "" }}</div>
    </div>
    <div class="each-block">
      <div class="title">体格检查</div>
      <div class="content">{{ obj.tgjcjgms ? obj.tgjcjgms : "" }}</div>
    </div>
    <div class="each-block">
      <div class="title">辅助检查</div>
      <div class="content">{{ obj.fzjcjg ? obj.fzjcjg : "" }}</div>
    </div>
    <div class="each-block">
      <div class="title">疾病诊断</div>
      <div class="content">
        <div v-for="(item, index) in opDiagnosis" :key="index">
          {{ index + 1 }}. {{ item }}
        </div>
      </div>
    </div>
    <div class="each-block">
      <div class="title">处理意见</div>
      <div class="content">
        {{ obj.czyj ? obj.czyj : "" }}
      </div>
    </div>
  </div>
</template>

<script>
import { OpMedicalRecords } from "@/api/modules/healthEvent/index.js";

export default {
  name: "treatmentRecord",
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
      obj: {},
      zyzdbzObj: {
        1: "主要诊断",
        2: "其他诊断",
      },
    };
  },
  computed: {
    opDiagnosis() {
      let list = this.obj.opDiagnosisDetailsList || [];
      let arr1 = [];
      let arr2 = [];
      list.map((item, i) => {
        let zyzd = this.zyzdbzObj[item.zyzdbz] ? `[${this.zyzdbzObj[item.zyzdbz]}]` : "";
        let diagnosisDesc = item.diagnosisDesc || "";
        let zyzh = item.sfzyzd === "1" && item.zyzh ? `[${item.zyzh}${item.cyzyzh ? "," + item.cyzyzh : ""}]` : "";
        let str = zyzd + diagnosisDesc + zyzh;
        if (item.zyzdbz === "1") {
          arr1.push(str)
        } else {
          arr2.push(str)
        }
      });
      let arr = arr1.concat(arr2);
      return arr;
    }
  },
  watch: {
    personalInfos: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {},
      deep: true,
    },
    navBarObj: {
      handler(val) {
        console.log(12345, val);
        this.getTreatmentRecord();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    async getTreatmentRecord() {
      this.obj = {};
      if (!this.navBarObj.serialNumber || !this.navBarObj.hosCode) {
        return;
      }
      try {
        let res = await OpMedicalRecords({
          serialNumber: this.navBarObj.serialNumber,
          hosCode: this.navBarObj.hosCode,
        });
        console.log("病历记录", res);
        if (res.code === 0) {
          this.obj = res.result || {};
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.treatmentRecord {
  width: 100%;
  // margin-top: 5px;
  // margin-left: 3px;
  .each-block {
    border-bottom: 1px dashed rgba(233, 233, 233, 1);
    padding-bottom: 14px;
    padding-top: 14px;
    color: #333;
    line-height: 32px;
    font-size: 16px;
    .title {
      font-weight: bold;
    }
    .content {
      font-size: 14px;
    }
  }
  .each-block:first-child {
    padding-top: 0;
  }
}
</style>
