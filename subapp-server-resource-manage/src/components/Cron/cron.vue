<template lang="html">
  <div class="cron" :val="value_" v-loading="loading"
    element-loading-text=""
    element-loading-spinner="el-icon-view"
    element-loading-background="rgba(0, 0, 0, 0.05)">
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="秒" name="s">
        <second-and-minute v-model="sVal" lable="秒"></second-and-minute >
      </el-tab-pane>
      <el-tab-pane label="分" name="m">
        <second-and-minute v-model="mVal" lable="分"></second-and-minute >
      </el-tab-pane> -->
      <el-tab-pane label="时" name="h">
        <hour v-model="hVal" lable="时"></hour>
      </el-tab-pane>
      <el-tab-pane label="日" name="d">
        <day v-model="dVal" lable="日"></day>
      </el-tab-pane>
      <el-tab-pane label="月" name="month">
        <month v-model="monthVal" lable="月"></month>
      </el-tab-pane>
      <el-tab-pane label="周" name="week">
        <week v-model="weekVal" lable="周"></week>
      </el-tab-pane>
      <el-tab-pane label="年" name="year">
        <year v-model="yearVal" lable="年"></year>
      </el-tab-pane>
    </el-tabs>
    <!-- table -->
    <el-table
       :data="tableData"
       size="mini"
       border
       style="width: 100%;">
       <el-table-column
         prop="sVal"
         label="秒"
         width="70">
       </el-table-column>
       <el-table-column
         prop="mVal"
         label="分"
         width="70">
       </el-table-column>
       <el-table-column
         prop="hVal"
         label="时"
         width="70">
       </el-table-column>
       <el-table-column
         prop="dVal"
         label="日"
         width="70">
       </el-table-column>
       <el-table-column
         prop="monthVal"
         label="月"
         width="70">
       </el-table-column>
       <el-table-column
         prop="weekVal"
         label="周"
         width="70">
       </el-table-column>
       <el-table-column
         prop="yearVal"
         label="年">
       </el-table-column>
     </el-table>
  </div>
</template>

<script>
import SecondAndMinute from "./cron/secondAndMinute";
import hour from "./cron/hour";
import day from "./cron/day";
import month from "./cron/month";
import week from "./cron/week";
import year from "./cron/year";
export default {
  props: {
    value: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //
      activeName: "h",
      sVal: "0",
      mVal: "0",
      hVal: "",
      dVal: "",
      monthVal: "",
      weekVal: "",
      yearVal: "",
    };
  },
  watch: {
    value(a, b) {
      this.updateVal();
    },
  },
  computed: {
    tableData() {
      return [
        {
          sVal: this.sVal,
          mVal: this.mVal,
          hVal: this.hVal,
          dVal: this.dVal,
          monthVal: this.monthVal,
          weekVal: this.weekVal,
          yearVal: this.yearVal,
        },
      ];
    },
    value_() {
      if (!this.dVal && !this.weekVal) {
        return "";
      }
      if (this.dVal === "?" && this.weekVal === "?") {
        this.$message.error("日期与星期不可以同时为“不指定”");
      }
      if (this.dVal !== "?" && this.weekVal !== "?") {
        this.$message.error("日期与星期必须有一个为“不指定”");
      }
      let v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`;
      if (v !== this.value) {
        this.$emit("input", v);
      }
      return v;
    },
  },
  methods: {
    updateVal() {
      if (!this.value) {
        this.reset();
      } else {
        let arrays = this.value.split(" ");
        this.sVal = arrays[0] ? arrays[0] : "0";
        this.mVal = arrays[1] ? arrays[1] : "0";
        this.hVal = arrays[2] ? arrays[2] : "*";
        this.dVal = arrays[3] ? arrays[3] : "*";
        this.monthVal = arrays[4] ? arrays[4] : "*";
        this.weekVal = arrays[5] ? arrays[5] : "?";
        this.yearVal = arrays[6] ? arrays[6] : "*";
      }
    },
    reset() {
      this.sVal = "0";
      this.mVal = "0";
      this.hVal = "*";
      this.dVal = "*";
      this.monthVal = "*";
      this.weekVal = "?";
      this.yearVal = "*";
    },
  },
  created() {
    this.updateVal();
  },
  components: {
    SecondAndMinute,
    hour,
    day,
    month,
    week,
    year,
  },
};
</script>

<style lang="less" scoped>
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  .el-tabs ::v-deep .el-tabs__content {
    background-color: #fff;
    .el-radio {
      margin-bottom: 10px;
    }
    .el-checkbox {
      margin-right: 0;
    }
  }
}
</style>
