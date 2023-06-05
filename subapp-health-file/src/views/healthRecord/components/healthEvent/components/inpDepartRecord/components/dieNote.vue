<template>
  <div class="dieNote height100" v-loading="loading">
    <emrCom :titleList="titleList" :contList="contList"></emrCom>
  </div>
</template>

<script>
import emrCom from "./emrCom.vue";

import { getIpDeathRecord } from "@/api/modules/healthEvent/index.js";

import { transNameFuc } from "@/utils/dictCodes.js";
import { deepClone } from "@/utils/utils.js";
import { mapGetters } from "vuex";

let titleListInit = [
  /* {
    label: "科室名称：",
    prop: "",
    code: "DEPT_DIC",
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
    title: "死亡记录",
    children: [
      {
        label: "入院日期时间：",
        prop: "ryrqsj",
        tag: ["date"],
        value: "",
        span: 12,
      },
      {
        label: "死亡日期时间：",
        prop: "swrqsj",
        tag: ["date"],
        value: "",
        span: 12,
      },
      {
        label: "入院诊断：",
        prop: "ryzd",
        value: "",
        span: 24,
      },
      {
        label: "死亡诊断：",
        prop: "swzddm",
        code: "GB/T 14396-2016",
        value: "",
        span: 24,
      },
      {
        label: "入院情况：",
        prop: "ryqk",
        value: "",
        span: 24,
      },
      {
        label: "诊疗过程描述：",
        prop: "zlgcms",
        value: "",
        span: 24,
      },
      {
        label: "直接死亡原因名称：",
        prop: "zjswyy",
        code: "GB/T 14396-2016",
        value: "",
        span: 8,
      },
      {
        label: "直接死亡原因编码：",
        prop: "zjswyy",
        value: "",
        span: 8,
      },
      {
        label: "家属同意尸体解剖标志：",
        prop: "jssftystjpbz",
        value: "",
        span: 8,
      },
      {
        label: "住院医师：",
        prop: "zyysqm",
        tag: ["doctor"],
        value: "",
        span: 8,
      },
      {
        label: "主治医师：",
        prop: "zzysqm",
        tag: ["doctor"],
        value: "",
        span: 8,
      },
      {
        label: "主任（副主任）医师：",
        prop: "zrysqm",
        tag: ["doctor"],
        value: "",
        span: 8,
      },
      {
        label: "签名日期时间：",
        prop: "qmrqsj",
        tag: ["date"],
        value: "",
        style: { border: "none" },
        span: 24,
      },
    ],
  },
];
let aaa = {
  bmsj: "2022-04-11 23:14:58",
  cjsj: "2022-04-18 23:14:30",
  cyzkgrsfdm: "1",
  cyzkgrsfmc: "1",
  hzxm: "1",
  jssftystjpbz: "1",
  jzlsh: "YZ001016",
  kh: "1",
  klx: "1",
  nl: 1,
  qmrqsj: "1",
  ryqk: "1",
  ryrqsj: "1",
  ryzd: "1",
  swrqsj: "1",
  swzd: "1",
  swzddm: "1",
  swzdzybmdm: "1",
  swzdzybmmc: "1",
  swzdzyzhdm: "1",
  swzdzyzhmc: "1",
  xb: "1",
  yljgdm: "888",
  ynjzrwyidh: "1",
  ywhdlbdm: "1",
  zjswyy: "1",
  zlgcms: "1",
  zrysid: "1",
  zrysqm: "1",
  zyszgcjg: "1",
  zyysqm: "1",
  zzysqm: "1",
};
export default {
  name: "dieNote",
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
      dieNotes: {},
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
        this.dieNotes = {};
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
        let { code, result } = await getIpDeathRecord(params);
        if (code === 0) {
          console.log("死亡记录查询：", result);
          if (!result) {
            this.contList = [];
          } else {
            this.dieNotes = result;
            this.handleData();
          }
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleData() {
      let obj = this.dieNotes;
      let resObj = this.residentNotes?.ipRegInfo;
      this.titleList.forEach(async (item) => {
        if (item.code) {
          // 需要数据字典反显的字段
          item.value = await transNameFuc(resObj[item.prop] || "", item.code);
        } else {
          item.value = resObj[item.prop] || "--";
        }
      });
      this.contList.forEach((item) => {
        item.children?.forEach(async (val) => {
          if (val.tag && val.tag.indexOf("doctor") > -1) {
            // 医生隐私处理
            val.value = this.doctorNamePrivacy(obj[val.prop] || "");
          } else if (val.tag && val.tag.indexOf("date") > -1 && obj[val.prop]) {
            val.value = this.dayjs(obj[val.prop]).format("YYYY-MM-DD HH:mm");
          } else if (val.code) {
            // 需要数据字典反显的字段
            val.value = await transNameFuc(obj[val.prop] || "", val.code);
          } else {
            val.value = obj[val.prop] || "--";
          }
        });
      });
    },
    itemClick(item, index) {
      this.currentIndex = index;
      this.currentData = { ...item };
    },
  },
};
</script>

<style lang="scss" scoped>
.dieNote {
}
</style>