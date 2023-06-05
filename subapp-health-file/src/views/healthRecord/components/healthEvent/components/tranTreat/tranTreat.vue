<template>
  <div class="tranTreat">
    <div class="each-block" v-for="(item, index) in tranTreatObj" :key="index">
      <div class="title">{{ item.label || "--" }}</div>
      <div class="content">{{ tranTreatData[item.prop] || "--" }}</div>
    </div>
  </div>
</template>

<script>
import { getReferralListById } from "@/api/modules/healthEvent/index.js";

export default {
  name: "tranTreat",
  components: {},
  props: {
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
      // 转诊渲染结构数据
      tranTreatObj: [
        {
          label: "初步印象",
          prop: "firstImpression",
        },
        {
          label: "主要现病史（转出原因）",
          prop: "mainHpi",
        },
        {
          label: "主要既往史",
          prop: "mainPastHistory",
        },
        {
          label: "治疗经过",
          prop: "treatmentProcess",
        },
      ],
      // 转诊数据
      tranTreatData: {
        firstImpression: "",
        mainHpi: "",
        mainPastHistory: "",
        treatmentProcess: "",
      },
    };
  },
  watch: {
    navBarObj: {
      handler(val) {
        this.getTreatmentRecord();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    async getTreatmentRecord() {
      if (!this.navBarObj.referralId) {
        return;
      }
      try {
        let res = await getReferralListById({
          referralId: this.navBarObj.referralId,
        });
        console.log("转诊记录", res);
        if (res.code === 0) {
          this.tranTreatData = res.result || {};
        } else {
          this.tranTreatData = {};
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.tranTreat {
  width: 100%;
  margin-top: 5px;
  margin-left: 3px;
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
