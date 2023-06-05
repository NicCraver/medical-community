<template>
  <div class="progressNote height100" v-loading="loading">
    <emrCom :titleList="titleList" :contList="contList"></emrCom>
  </div>
</template>

<script>
import emrCom from "./emrCom.vue";

import { getIpFirstProgressNotes } from "@/api/modules/healthEvent/index.js";

import { transNameFuc } from "@/utils/dictCodes.js";
import { deepClone } from "@/utils/utils.js";
import { mapGetters } from "vuex";

let titleListInit = [
  {
    label: "病区名称：",
    prop: "rybqmc",
    value: "",
    span: 8,
  },
  {
    label: "病床号：",
    prop: "zych",
    value: "",
    span: 8,
  },
  {
    label: "记录时间：",
    prop: "jlrqsj",
    tag: ["date"],
    value: "",
    span: 8,
  },
];
let contListInit = [
  {
    title: "首次病程记录",
    children: [
      {
        label: "主诉：",
        prop: "zs",
        value: "",
        span: 24,
      },
      {
        label: "病例特点：",
        prop: "bltd",
        value: "",
        span: 24,
      },
      {
        label: "西医诊断-初步诊断：",
        prop: "cbzd",
        value: "",
        span: 24,
      },
      {
        label: "诊断依据：",
        prop: "zdyj",
        value: "",
        span: 24,
      },
      {
        label: "西医诊断-鉴别诊断：",
        prop: "jbzd",
        value: "",
        span: 24,
      },
      {
        label: "中医病名-初步诊断：",
        prop: "cbzdZybm",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "中医证候-初步诊断：",
        prop: "cbzdzyzhmc",
        value: "",
        span: 24,
      },
      {
        label: "中医“四诊结果”：",
        prop: "zyszgcjgms",
        value: "",
        span: 24,
      },
      /* {
        label: "中医病名-鉴别诊断：",
        prop: "",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "中医证候-鉴别诊断：",
        prop: "",
        value: "",
        span: 24,
      }, */
      {
        label: "中医诊断-辩证分型：",
        prop: "bzfxmc",
        value: "",
        span: 24,
      },
      {
        label: "诊疗计划：",
        prop: "zljh",
        value: "",
        span: 24,
      },
      {
        label: "治则治法：",
        prop: "zzzf",
        value: "",
        span: 24,
      },
      {
        label: "住院医师：",
        prop: "zyysqm",
        tag: ["doctor"],
        value: "",
        style: { border: "none" },
        span: 12,
      },
      {
        label: "上级医师：",
        prop: "sjysqm",
        tag: ["doctor"],
        value: "",
        style: { border: "none" },
        span: 12,
      },
    ],
  },
];
let aaa = {
  bch: "1",
  bltd: "1",
  bqbm: "1",
  bqmc: "1",
  bzfxdm: "1",
  bzfxmc: "1",
  cbzd: "1",
  cbzdZybm: "1",
  cbzdZybmdm: "1",
  cbzdzyzhdm: "1",
  cbzdzyzhmc: "1",
  cjsj: "2022-04-18 22:10:39",
  crbs: "1",
  csnrkkbz: "1",
  fbjcjg: "1",
  gmzzjcjg: "1",
  hztbjqqgjcjg: "1",
  hzxm: "1",
  jbzd: "1",
  jlrqsj: "1",
  jzjcjg: "1",
  jzs: "1",
  kh: "1",
  klx: "1",
  ksbm: "1",
  ksmc: "1",
  nl: 1,
  pfhnmjcjg: "1",
  qsqblbjjc: "1",
  sjxtjcjg: "1",
  sjysqm: "1",
  sjysqmsj: "1",
  sss: "1",
  tz: 1,
  xb: "1",
  xbjcjg: "1",
  xdhzjbjcjg: "1",
  ybjkzkbz: "1",
  ybzkjcjg: "1",
  yfjzs: "1",
  yljgdm: "888",
  ynjzrwyidh: "1",
  zdyj: "1",
  zkqk: "1",
  zljh: "1",
  zs: "1",
  zyh: "101",
  zyszgcjgms: "1",
  zyysqm: "1",
  zyysqmsj: "1",
  zzzf: "1",
};
export default {
  name: "progressNote",
  props: {
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
    residentNotes: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: { emrCom },
  data() {
    return {
      loading: false,
      progressNotes: {},
      titleList: [],
      contList: [],
    };
  },
  computed: {
    ...mapGetters({
      doctorNamePrivacy: "base/doctorNamePrivacy",
    }),
  },
  watch: {
    navBarObj: {
      handler(val) {
        this.progressNotes = {};
        this.titleList = deepClone(titleListInit);
        this.contList = deepClone(contListInit);
        this.getLeftList();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    async getLeftList() {
      this.loading = true;
      try {
        let params = {
          serialNumber: this.navBarObj.serialNumber,
          hosCode: this.navBarObj.hosCode,
        };
        let { code, result } = await getIpFirstProgressNotes(params);
        if (code === 0) {
          console.log("病程记录查询：", result);
          if (!result) {
            this.contList = [];
          } else {
            this.progressNotes = result;
            this.handleData();
          }
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleData() {
      let obj = this.progressNotes;
      let resObj = this.residentNotes?.ipRegInfo;
      this.titleList.forEach((item) => {
        if (item.tag && item.tag.indexOf("date") > -1) {
          item.value = this.dayjs(obj[item.prop] || "").format(
            "YYYY-MM-DD HH:mm"
          );
        } else {
          item.value = resObj[item.prop] || "--";
        }
      });
      this.contList.forEach((item) => {
        item.children?.forEach((val) => {
          if (val.tag && val.tag.indexOf("doctor") > -1) {
            // 医生隐私处理
            val.value = this.doctorNamePrivacy(obj[val.prop] || "");
          } else {
            val.value = obj[val.prop] || "--";
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.progressNote {
}
</style>