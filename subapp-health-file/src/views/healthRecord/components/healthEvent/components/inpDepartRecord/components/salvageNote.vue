<template>
  <div class="salvageNote height100" v-loading="loading">
    <emrCom :titleList="titleList" :contList="contList"></emrCom>
  </div>
</template>

<script>
import emrCom from "./emrCom.vue";

import { getIpRescueRecord } from "@/api/modules/healthEvent/index.js";

import { transNameFuc } from "@/utils/dictCodes.js";
import { deepClone } from "@/utils/utils.js";
import { mapGetters } from "vuex";

let titleListInit = [
  /* {
    label: "科室名称：",
    prop: "ksbm",
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
    title: "抢救信息",
    children: [
      {
        label: "疾病诊断：",
        prop: "jbzddm",
        code: "GB/T 14396-2016",
        value: "",
        span: 24,
      },
      {
        label: "抢救开始时间：",
        prop: "qjrqsj",
        value: "",
        span: 12,
      },
      {
        label: "抢救结束时间：",
        prop: "qjrqsj",
        value: "",
        span: 12,
      },
      {
        label: "病情变化情况：",
        prop: "bqbhqk",
        value: "",
        span: 24,
      },
      {
        label: "抢救措施：",
        prop: "qjcs",
        value: "",
        span: 24,
      },
      {
        label: "手术操作名称：",
        prop: "ssczmc",
        value: "",
        span: 8,
      },
      {
        label: "手术操作代码：",
        prop: "ssczdm",
        value: "",
        span: 8,
      },
      {
        label: "手术操作部位名称：",
        prop: "ssczmbbwmc",
        value: "",
        span: 8,
      },
      {
        label: "介入物名称：",
        prop: "jrwmc",
        value: "",
        span: 8,
      },
      {
        label: "操作方法：",
        prop: "czff",
        value: "",
        span: 8,
      },
      {
        label: "操作次数：",
        prop: "czcs",
        value: "",
        span: 8,
      },
      {
        label: "检查/检验项目名称：",
        prop: "jcjyxmmc",
        value: "",
        span: 24,
      },
      {
        label: "检查/检验结果：",
        prop: "jcjyjg",
        value: "",
        span: 24,
      },
      {
        label: "检查/检验定量结果：",
        prop: "jcjydljg",
        value: "",
        span: 24,
      },
      {
        label: "检查/检验结果代码：",
        prop: "jcjyjgdm",
        value: "",
        span: 24,
      },
      {
        label: "注意事项：",
        prop: "tbzysx",
        value: "",
        span: 24,
      },
      {
        label: "参加抢救人员名单：",
        prop: "cjqjrymd",
        value: "",
        span: 24,
      },
      {
        label: "专业技术职称类别代码：",
        prop: "zyjszwlbdm",
        value: "",
        span: 24,
      },
      {
        label: "医生姓名：",
        prop: "ysqm",
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
        span: 16,
      },
    ],
  },
];

let aaa = {
  bchdm: "1",
  bchmc: "1",
  bfhdm: "1",
  bfhmc: "1",
  bmsj: "1",
  bqbhqk: "1",
  cjqjrymd: "1",
  cjsj: "2022-04-18 22:51:13",
  czcs: 1,
  czff: "1",
  czrqsj: "1",
  hzxm: "1",
  jbzddm: "1",
  jcjydljg: "1",
  jcjyjg: "1",
  jcjyjgdm: "1",
  jcjyxmmc: "1",
  jrwmc: "1",
  kh: "1",
  klx: "1",
  ksbm: "1",
  lczd: "1",
  nl: 1,
  qjcs: "1",
  qjjllsh: "1",
  qjrqsj: "1",
  qmrqsj: "1",
  ssczdm: "1",
  ssczmbbwmc: "1",
  ssczmc: "1",
  tbzysx: "1",
  xb: "1",
  yljgdm: "888",
  ynjzrwyidh: "1",
  ysid: "1",
  ysqm: "1",
  ywhdlbdm: "1",
  zyhmzlsh: "YZ001016",
  zyjszwlbdm: "1",
};

export default {
  name: "salvageNote",
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
      salvageNotes: {},
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
        this.salvageNotes = {};
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
        let { code, result } = await getIpRescueRecord(params);
        if (code === 0) {
          console.log("抢救记录查询：", result);
          if (!result) {
            this.contList = [];
          } else {
            this.salvageNotes = result;
            this.handleData();
          }
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleData() {
      let obj = this.salvageNotes;
      let resObj = this.residentNotes?.ipRegInfo;
      this.titleList.forEach(async (item) => {
        if (item.code) {
          // 需要数据字典反显的字段
          item.value = await transNameFuc(resObj[item.prop] || "--", item.code);
        } else {
          item.value = resObj[item.prop] || "--";
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
            val.value = await transNameFuc(obj[val.prop] || "", val.code);
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
.salvageNote {
}
</style>