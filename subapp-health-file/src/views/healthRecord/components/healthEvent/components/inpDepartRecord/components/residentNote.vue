<template>
  <div class="residentNote height100" v-loading="loading">
    <emrCom :titleList="titleList" :contList="contList"></emrCom>
  </div>
</template>

<script>
import emrCom from "./emrCom.vue";

import { getIpInHosRecord } from "@/api/modules/healthEvent/index.js";

import { transNameFuc } from "@/utils/dictCodes.js";
import { deepClone } from "@/utils/utils.js";
import { mapGetters } from "vuex";

let titleListInit = [
  {
    label: "病史陈述者：",
    prop: "bscsz",
    value: "",
    span: 8,
  },
  {
    label: "陈述者与患者关系：",
    prop: "bscszyhzgx",
    code: "GB/T 4761-2008",
    value: "",
    span: 8,
  },
  {
    label: "可靠程度：",
    prop: "csnrkkbz",
    code: "CT01.00.002",
    value: "",
    span: 8,
  },
  {
    label: "记录时间：",
    prop: "cjsj",
    firstName: "ipInHosRecord",
    tag: ["date"],
    value: "",
    span: 8,
  },
  {
    label: "入院时间：",
    prop: "rysj",
    firstName: "ipInHosRecord",
    tag: ["date"],
    value: "",
    span: 8,
  },
];
let contListInit = [
  {
    title: "病史",
    firstName: "ipFirstProgressNotes",
    children: [
      {
        label: "主诉：",
        prop: "zs",
        value: "",
        span: 24,
      },
      {
        label: "现病史：",
        prop: "xbs",
        value: "",
        firstName: "ipInHosRecord",
        span: 24,
      },
      {
        label: "一般健康状况：",
        prop: "ybjkzkbz",
        code: "CT01.00.002",
        value: "",
        span: 24,
      },
      {
        label: "疾病史（含外伤）：",
        prop: "jbzd",
        code: "GB/T 14396-2016",
        value: "",
        span: 24,
      },
      {
        label: "患者传染标志：",
        prop: "ycrbbg",
        code: "CT01.00.002",
        value: "",
        firstName: "ycrbbg",
        span: 8,
      },
      {
        label: "传染病史：",
        prop: "crbs",
        value: "",
        span: 16,
      },
      {
        label: "预防接种史：",
        prop: "yfjzs",
        value: "",
        span: 24,
      },
      {
        label: "手术史：",
        prop: "sss",
        value: "",
        span: 24,
      },
      {
        label: "输血史：",
        prop: "hzjwsxs",
        value: "",
        firstName: "",
        span: 24,
      },
      {
        label: "过敏史：",
        prop: "allergenRecordList",
        value: "",
        firstName: "",
        span: 24,
      },
      {
        label: "个人史：",
        prop: "grs",
        value: "",
        firstName: "ipInHosRecord",
        span: 24,
      },
      {
        label: "婚育史：",
        prop: "hys",
        value: "",
        firstName: "ipInHosRecord",
        span: 24,
      },
      {
        label: "月经史：",
        prop: "yjs",
        value: "",
        firstName: "ipInHosRecord",
        span: 24,
      },
      {
        label: "家族史：",
        prop: "jzs",
        value: "",
        style: { border: "none" },
        span: 24,
      },
    ],
  },
  {
    title: "体格检查",
    firstName: "ipInHosRecord",
    children: [
      {
        label: "体温（℃）：",
        prop: "tw",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 8,
      },
      {
        label: "脉率（次/分））：",
        prop: "xlcmin",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 8,
      },
      {
        label: "呼吸频率（次/分）：",
        prop: "hxplcmin",
        value: "",
        style: { border: "none", "line-height": "35px", padding: 0 },
        span: 8,
      },
      {
        label: "血压（mmHg）：",
        prop: "ssymmhg",
        value: "",
        style: { "line-height": "35px", padding: 0 },
        span: 8,
      },
      {
        label: "身高（cm）：",
        prop: "",
        value: "",
        firstName: "",
        style: { "line-height": "35px", padding: 0 },
        span: 8,
      },
      {
        label: "体重（kg）：",
        prop: "tz",
        value: "",
        firstName: "ipFirstProgressNotes",
        style: { "line-height": "35px", padding: 0 },
        span: 8,
      },
      {
        label: "一般情况：",
        prop: "ybzkjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "皮肤和黏膜：",
        prop: "pfhnmjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "淋巴检查：",
        prop: "qsqblbjjc",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "颈部检查：",
        prop: "xdhzjbjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "胸部检查：",
        prop: "xbjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "腹部检查：",
        prop: "fbjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "肛门指诊：",
        prop: "gmzzjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "外生殖器检查：",
        prop: "",
        value: "",
        firstName: "",
        span: 24,
      },
      {
        label: "脊柱检查：",
        prop: "jzjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        span: 24,
      },
      {
        label: "四肢检查：",
        prop: "",
        value: "",
        firstName: "",
        span: 24,
      },
      {
        label: "神经系统检查：",
        prop: "sjxtjcjg",
        value: "",
        firstName: "ipFirstProgressNotes",
        style: { border: "none" },
        span: 24,
      },
    ],
  },
  {
    title: "专科情况",
    firstName: "ipFirstProgressNotes",
    children: [
      {
        label: "专科情况：",
        prop: "zkqk",
        // code: "CT01.00.002",
        value: "",
        style: { border: "none" },
        span: 24,
      },
    ],
  },
  {
    title: "辅助检查",
    firstName: "ipInHosRecord",
    children: [
      {
        label: "辅助检查结果：",
        prop: "fzjc",
        value: "",
        style: { border: "none" },
        span: 24,
      },
    ],
  },
  {
    title: "诊断信息",
    firstName: "ipFirstProgressNotes",
    children: [
      {
        label: "中医‘四诊’结果： ",
        prop: "zyszgcjgms",
        value: "",
        span: 16,
      },
      {
        label: "辩证分型：",
        prop: "bzfxmc",
        value: "",
        span: 8,
      },
      {
        label: "治则治法：",
        prop: "zzzf",
        value: "",
        span: 24,
      },
      {
        label: "初步诊断-西医诊断：",
        prop: "cbzd",
        value: "",
        span: 24,
      },
      {
        label: "初步诊断-中医病名：",
        prop: "cbzdZybm",
        value: "",
        span: 24,
      },
      {
        label: "初步诊断-中医证候：",
        prop: "cbzdzyzhmc",
        value: "",
        span: 24,
      },
      {
        label: "接诊医师：",
        prop: "jzysxm",
        tag: ["doctor"],
        value: "",
        firstName: "ipInHosRecord",
        style: { border: "none" },
        span: 6,
      },
      {
        label: "住院医师：",
        prop: "zyysxm",
        tag: ["doctor"],
        value: "",
        firstName: "ipInHosRecord",
        style: { border: "none" },
        span: 6,
      },
      {
        label: "主治医师：",
        prop: "zzysxm",
        tag: ["doctor"],
        value: "",
        firstName: "ipInHosRecord",
        style: { border: "none" },
        span: 6,
      },
      {
        label: "主任（副主任）医师：",
        prop: "zrysxm",
        tag: ["doctor"],
        value: "",
        firstName: "ipInHosRecord",
        style: { border: "none" },
        span: 6,
      },
    ],
  },
];

export default {
  name: "residentNote",
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
      // residentNotes: {},
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
    residentNotes: {
      handler(val) {
        // this.residentNotes = {};
        if (!val) {
          this.contList = [];
        } else {
          this.titleList = deepClone(titleListInit);
          this.contList = deepClone(contListInit);
          this.handleData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.pAId = this.$route.query?.pAId;
  },
  mounted() {},
  methods: {
    handleData() {
      let obj = this.residentNotes;
      this.titleList.forEach(async (item) => {
        let objNew = {};
        if (item.firstName) {
          objNew = deepClone(obj[item.firstName]) || {};
        } else {
          objNew = deepClone(obj);
        }
        if (item.code) {
          // 需要数据字典反显的字段
          item.value = await transNameFuc(objNew[item.prop] || "", item.code);
        } else if (item.tag && item.tag.indexOf("date") > -1) {
          item.value = this.dayjs(objNew[item.prop] || "").format(
            "YYYY-MM-DD HH:mm"
          );
        } else {
          item.value = objNew[item.prop] || "--";
        }
      });
      this.contList.forEach((item) => {
        item.children?.forEach(async (val) => {
          let objData =
            val.firstName === val.prop
              ? obj
              : obj[val.firstName || item.firstName];
          if (val.prop === "ssymmhg") {
            // 血压
            let ssymmhg = objData[val.prop] || "--";
            let szymmhg = objData["szymmhg"] || "--";
            val.value = `${ssymmhg}/${szymmhg}`;
          } else if (val.prop === "fzjc") {
            let fzjcsysjc = objData["fzjcsysjc"] || "";
            let fzjctsjc = objData["fzjctsjc"] || "";
            let fzjcbljc = objData["fzjcbljc"] || "";
            let fzjcqt = objData["fzjcqt"] || "";
            let fzjc =
              fzjcsysjc + " " + fzjctsjc + " " + fzjcbljc + " " + fzjcqt;
            val.value = fzjc;
          } else if (val.tag && val.tag.indexOf("doctor") > -1) {
            // 医生隐私处理
            val.value = this.doctorNamePrivacy(objData[val.prop] || "");
          } else if (val.code) {
            // 需要数据字典反显的字段
            val.value = await transNameFuc(objData[val.prop] || "", val.code);
          } else if (val.prop === "hzjwsxs") {
            val.value =
              objData[val.prop] === "1"
                ? "有"
                : objData[val.prop] === "2"
                ? "无"
                : objData[val.prop] === "3"
                ? "未标明"
                : "";
          } else {
            val.value = objData[val.prop] || "--";
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.residentNote {
}
</style>