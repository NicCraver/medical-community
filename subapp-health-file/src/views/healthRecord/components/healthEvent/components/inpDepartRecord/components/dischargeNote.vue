<template>
  <div class="dischargeNote height100" v-loading="loading">
    <emrCom :titleList="titleList" :contList="contList"></emrCom>
  </div>
</template>

<script>
import emrCom from "./emrCom.vue";

import { getIpOutHosSummary } from "@/api/modules/healthEvent/index.js";

import { transNameFuc } from "@/utils/dictCodes.js";
import { deepClone } from "@/utils/utils.js";
import { mapGetters } from "vuex";

let titleListInit = [
  /* {
    label: "科室名称：",
    prop: "ksmc",
    value: "",
    span: 8,
  }, */
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
];
let contListInit = [
  {
    title: "出院情况",
    children: [
      {
        label: "入院日期时间：",
        prop: "rysj",
        tag: ["date"],
        value: "",
        span: 8,
      },
      {
        label: "出院日期时间：",
        prop: "cysj",
        tag: ["date"],
        value: "",
        span: 8,
      },
      {
        label: "住院天数：",
        prop: "zyts",
        value: "",
        span: 8,
      },
      {
        label: "入院诊断-西医诊断：",
        prop: "ryzd",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "入院诊断-中医病名：",
        prop: "ryzdzybmdm",
        code: "GB/T 15657-1995",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "入院诊断-中医证候：",
        prop: "ryzdzyzhdm",
        code: "GB/T 15657-1995-6",
        value: "",
        style: { "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "出院诊断-西医诊断：",
        prop: "cyzd",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "出院诊断-中医病名：",
        prop: "cyzdzybmdm",
        code: "GB/T 15657-1995",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "出院诊断-中医证候：",
        prop: "cyzdzyzhdm",
        code: "GB/T 15657-1995-6",
        value: "",
        style: { "line-height": "35px", padding: 0 },
        span: 24,
      },
      {
        label: "入院情况：",
        prop: "ryszyzzjtz",
        value: "",
        span: 24,
      },
      {
        label: "诊疗过程描述：",
        prop: "zlgc",
        value: "",
        span: 24,
      },
      {
        label: "出院情况：",
        prop: "cysqk",
        value: "",
        span: 24,
      },
      {
        label: "出院医嘱：",
        prop: "cyyz",
        value: "",
        span: 24,
      },
      {
        label: "住院医师：",
        prop: "zyysxm",
        tag: ["doctor"],
        value: "",
        style: { border: "none" },
        span: 8,
      },
      {
        label: "上级医师：",
        prop: "zzysxm",
        tag: ["doctor"],
        value: "",
        style: { border: "none" },
        span: 8,
      },
      {
        label: "签名日期时间：",
        prop: "qmrqsj",
        tag: ["date"],
        value: "",
        style: { border: "none" },
        span: 8,
      },
    ],
  },
];

let aaa = {
  bah: "1",
  bfh: "1",
  bmsj: "1",
  bqbm: "1",
  bqmc: "1",
  bzfxdm: "1",
  bzfxmc: "",
  ch: "1",
  cjsj: "2021-12-16 14:42:37",
  cysj: "2020-01-01 00:00:09",
  cysqk:
    "出院情况：1、患者2年前发现血压升高，在上一级医院诊断为为高血压病，长期规律服用降压药物治疗，血压控制可。无头晕、头痛，无视物模糊、黑朦及晕1                    厥，无胸痛、胸闷，无恶心、呕吐等不适症状。今复诊开药。起病以来，精神、食欲、睡眠可，大小便正常。",
  cyszyzzjtz: "1",
  cyyz: "出院医嘱：1、患者2年前发现血压升高，在上一级医院诊断为为高血压病，长期规律服用降压药物治疗，血压控制可。无头晕、头痛，无视物模糊、黑朦及晕1                    厥，无胸痛、胸闷，无恶心、呕吐等不适症状。今复诊开药。起病以来，精神、食欲、睡眠可，大小便正常。",
  cyzd: "1、原发性高血压   2、高血脂   3、糖尿病   4、出院诊断",
  cyzdzybmdm: "1",
  cyzdzyzhdm: "1",
  hbz: "1",
  kh: "1",
  klx: "1",
  ksbm: "1",
  ksmc: "1",
  mzzd: "1",
  nl: "1",
  qmrqsj: "1",
  rysj: "2008-01-01 00:00:09",
  ryszyzzjtz:
    "入院情况：患者2年前发现血压升高，在上一级医院诊断为为高血压病，长期规律服用降压药物治疗，血压控制可。无头晕、头痛，无视物模糊、黑朦及晕厥，       N                   闷，无恶心、呕吐等不适症状。今复诊开药。起病以来，精神、食欲、睡眠可，大小便正常",
  ryzd: "1、原发性高血压   2、高血脂   3、糖尿病",
  ryzdzybmdm: "1",
  ryzdzyzhdm: "1",
  shzgh: "1",
  shzsj: "1",
  shzxm: "1",
  sysjcjzyhz:
    "辅助检查：1、患者2年前发现血压升高，在上一级医院诊断为为高血压病，长期规律服用降压药物治疗，血压控制可。无头晕、头痛，无视物模糊、黑朦及晕1                    厥，无胸痛、胸闷，无恶心、呕吐等不适症状。今复诊开药。起病以来，精神、食欲、睡眠可，大小便正常。",
  wjlj: "",
  xb: "1",
  xm: "1",
  yljgdm: "888",
  ynjzrwyidh: "1",
  yxfzjcjg: "1",
  zlgc: "诊疗经过：1、患者2年前发现血压升高，在上一级医院诊断为为高血压病，长期规律服用降压药物治疗，血压控制可。无头晕、头痛，无视物模糊、黑朦及晕1                    厥，无胸痛、胸闷，无恶心、呕吐等不适症状。今复诊开药。起病以来，精神、食欲、睡眠可，大小便正常。",
  zljg: "9",
  ztbnr1: "1",
  ztbnr2: "1",
  zyjzff: "1",
  zyjzlsh: "YZ001016",
  zyqjtsjc: "1",
  zyszgcjgms: "1",
  zyts: "999",
  zyysid: "1",
  zyysxm: "张三丰",
  zyyyff: "1",
  zzysid: "1",
  zzysxm: "王大翠",
  zzzf: "1",
};
export default {
  name: "dischargeNote",
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
      dischargeNotes: {},
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
        this.dischargeNotes = {};
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
        let { code, result } = await getIpOutHosSummary(params);
        if (code === 0) {
          console.log("出院小结记录查询：", result);
          if (!result) {
            this.contList = [];
          } else {
            this.dischargeNotes = result;
            this.handleData();
          }
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleData() {
      let obj = this.dischargeNotes;
      let resObj = this.residentNotes?.ipRegInfo;
      this.titleList.forEach(async (item) => {
        if (item.code) {
          // 需要数据字典反显的字段
          item.value = await transNameFuc(resObj[item.prop] || "", item.code);
        } else {
          item.value = resObj[item.prop] || "";
        }
      });
      this.contList.forEach((item) => {
        item.children?.forEach(async (val) => {
          if (val.tag && val.tag.indexOf("doctor") > -1) {
            // 医生隐私处理
            val.value = this.doctorNamePrivacy(obj[val.prop] || "");
          } else if (val.tag && val.tag.indexOf("date") > -1  && obj[val.prop]) {
            val.value = this.dayjs(obj[val.prop]).format(
              "YYYY-MM-DD HH:mm"
            );
          } else if (val.code) {
            // 需要数据字典反显的字段
            val.value = await transNameFuc(obj[val.prop] || "--", val.code);
            // val.value = await transNameFuc("BNV100", val.code);
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
.dischargeNote {
}
</style>