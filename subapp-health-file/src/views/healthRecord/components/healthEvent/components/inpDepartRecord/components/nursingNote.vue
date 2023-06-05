<template>
  <div class="nursingNote" v-loading="loading">
    <template v-if="natureData && natureData.length">
      <el-table
        :data="tableData"
        border
        height="100%"
        width="100%"
        :header-row-class-name="headerClass"
        :cell-style="cellStyle"
      >
        <el-table-column
          v-for="(item, index) in tableColums"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :min-width="item.width"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row[item.prop] }}
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <div class="emptyBox">
        <IconSvg
          iconClass="empty-box"
          style="color: #cacdd4"
          width="80"
          height="80"
        ></IconSvg>
        <div class="emptyText">暂无数据</div>
      </div>
    </template>
  </div>
</template>
<script>
import { listIpNursingSigns } from "@/api/modules/healthEvent/index.js";

import { deepClone } from "@/utils/utils.js";
import { transNameFuc } from "@/utils/dictCodes.js";

import { mapGetters } from "vuex";

let tableColumsInit = [
  {
    label: "记录日期",
    prop: "date",
    width: "120",
    fixed: "left",
  },
];
let tableDataInit = [
  { prop: "hldjmc", date: "护理等级" },
  { prop: "hllxdm", code: "CV06.00.221", date: "护理类型" },
  { prop: "tzkg", date: "体重（kg）" },
  { prop: "tw", date: "体温（℃）" },
  { prop: "hxplcmin", date: "呼吸频率（次/min）" },
  { prop: "xlcmin", date: "脉率（次/min）" },
  { prop: "ssymmhg", date: "收缩压（mmHg）" },
  { prop: "szymmhg", date: "舒张压（mmHg）" },
  { prop: "xybd", date: "血氧饱和度（%）" },
  { prop: "zbdmbdbz", date: "足背动脉搏动标志" },
  { prop: "ysqkdm", code: "CV06.00.224", date: "饮食情况" },
  { prop: "", date: "导管护理描述" },
  { prop: "", date: "气管护理" },
  { prop: "", date: "体位护理" },
  { prop: "", date: "皮肤护理" },
  { prop: "", date: "营养护理" },
  { prop: "", date: "饮食指导" },
  { prop: "", date: "心理护理" },
  { prop: "aqhllx", date: "安全护理" },
  { prop: "", date: "简要病情" },
  { prop: "hlgcxmjjg", date: "护理观察项目名称及结果" },
  { prop: "hlczxmmc", date: "护理操作名称" },
  // { prop: "hlczxmdm", date: "护理操作项目类目名称" },
  { prop: "hlczjg", date: "护理操作结果" },
  { prop: "", date: "发出手术安全核对表标志" },
  { prop: "", date: "收回手术安全核对表标志" },
  { prop: "", date: "发出手术风险评估表标志" },
  { prop: "", date: "收回手术风险评估表标志" },
  { prop: "glbz", date: "隔离标志" },
  { prop: "glhllx", date: "隔离种类" },
  { prop: "ksmc", date: "科室名称" },
  { prop: "bqmc", date: "病区名称" },
  { prop: "bch", date: "病床号" },
  { prop: "ywryxm", tag: ["doctor"], date: "护士姓名" },
  { prop: "jlsj", tag: ["date"], date: "签名时间" },
];
let aaa = [
  {
    bah: "bah",
    bczyzhsshfmsj: "bczyzhsshfmsj",
    bmsj: "bmsj",
    bqbm: "bqbm",
    bqmc: "bqmc",
    chxt: "chxt",
    cjsj: "2022-04-20 19:59:19",
    fwcm: "fwcm",
    hlczjg: "hlczjg",
    hlczxmdm: "hlczxmdm",
    hlczxmmc: "hlczxmmc",
    hldjdm: "hldjdm",
    hldjmc: "hldjmc",
    hlgcxmjjg: "hlgcxmjjg",
    hljldid: "hljldid",
    hllxdm: "hllxdm",
    hllxms: "hllxms",
    hxplcmin: "hxplcmin",
    hxqd: "hxqd",
    jlsj: "2022-02-20 19:59:19",
    jzlsh: "YZ001016",
    kfxtzmmoll: "kfxtzmmoll",
    kh: "kh",
    klx: "klx",
    ksbm: "ksbm",
    ksmc: "ksmc",
    qbqxlcmin: "qbqxlcmin",
    sfzzjh: "sfzzjh",
    sgcm: "sgcm",
    ssfxz: "ssfxz",
    ssymmhg: "ssymmhg",
    syhxjbz: "syhxjbz",
    szymmhg: "szymmhg",
    tw: "tw",
    twdh: "twdh",
    tzkg: "tzkg",
    xlcmin: "xlcmin",
    yljgdm: "yljgdm",
    ynjzrwyidh: "ynjzrwyidh",
    ywrybh: "ywrybh",
    ywryxm: "ywryxm",
    zbdmbdbz: "zbdmbdbz",
  },
];
export default {
  name: "nursingNote",
  props: {
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      tableColums: [],
      tableData: [],
      natureData: [],
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
        this.natureData = [];
        this.tableColums = tableColumsInit;
        this.tableData = tableDataInit;
        if (val.serialNumber && val.hosCode) {
          this.getRecord();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async getRecord() {
      this.loading = true;
      try {
        let res = await listIpNursingSigns({
          serialNumber: this.navBarObj.serialNumber,
          hosCode: this.navBarObj.hosCode,
        });
        if (res.code === 0) {
          console.log("护理操作记录数据", res.result);
          this.natureData = res.result;
          this.handleData();
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    async handleData() {
      let data = this.natureData;
      let tableColums = deepClone(this.tableColums);
      let tableData = deepClone(this.tableData);
      for (let i in data) {
        let item = data[i];
        tableColums.push({
          label: this.dayjs(item.jlsj).format("YYYY-MM-DD HH:mm"),
          prop: item.jlsj,
          width: "160",
        });
        for (let index in tableData) {
          let val = tableData[index];
          if (val.prop === "glbz") {
            // 隔离标志：BHHLLX 闭环护理类型值为“隔离护理”时，显示“是”,否则显示“--”
            val[item.jlsj] = item.bhhllx === "隔离护理" ? "是" : "--";
          } else if (val.prop === "hlgcxmjjg") {
            // 护理观察项目名称及结果，
            let list = item.hlgcxmjjg ? JSON.parse(item.hlgcxmjjg) : [];
            let str = "";
            list.forEach((vv) => {
              for(let ii in vv) {
                str += `${ii}：[${vv[ii]}] `;
              }
               str += "； "
            });
            val[item.jlsj] = str;
          } else if (
            val.hasOwnProperty("tag") &&
            val.tag.indexOf("doctor") > -1
          ) {
            val[item.jlsj] = val.prop
              ? `${this.doctorNamePrivacy(item[val.prop] || "") || "--"}`
              : "--";
          } else if (
            val.hasOwnProperty("tag") &&
            val.tag.indexOf("date") > -1
          ) {
            val[item.jlsj] = val.prop
              ? this.dayjs(item[val.prop] || "").format("YYYY-MM-DD HH:mm")
              : "--";
          } else {
            val[item.jlsj] = val.prop
              ? val.code
                ? await transNameFuc(item[val.prop] || "", val.code)
                : item[val.prop] || "--"
              : "--";
          }
        }
      }
      this.tableColums = tableColums;
      this.tableData = deepClone(tableData);
    },
    headerClass(data) {
      return "tableHeader";
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return {
        color: columnIndex === 0 ? "#919191" : "#606266",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.nursingNote {
  padding: 0px 10px 10px 10px;
  height: calc(100% - 16px);
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
::v-deep .el-table__row {
  .el-table__cell:nth-child(1) {
    background-color: #fafafa;
  }
}
::v-deep .el-table__row.hover-row {
  td {
    background-color: transparent !important;
  }
  td:first-child {
    background-color: #fafafa !important;
  }
}
::v-deep .tableHeader {
  th {
    color: #606266;
    background-color: #fff !important;
    .cell {
      background-color: #fff !important;
    }
  }
  th:first-child {
    color: #919191;
    background-color: #fafafa !important;
    .cell {
      background-color: #fafafa !important;
    }
  }
}
::v-deep .el-table .el-table__cell {
  padding: 5px 0;
  .cell {
    height: 29px !important;
    line-height: 29px !important;
  }
}
</style>