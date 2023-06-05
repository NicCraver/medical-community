<template>
  <div class="healthExam">
    <headers :examData="examData" :navBarObj="navBarObj"></headers>
    <!-- <div class="health-header">
      <div class="title">{{ navBarObj.hospitalName }}</div>
      <el-row class="title-info">
        <el-col :span="6">类型：{{ titleInfo.type }} </el-col>
        <el-col :span="6">科室：{{ titleInfo.source || "" }} </el-col>
        <el-col :span="6">体检日期：{{ titleInfo.examDate }}</el-col>
        <el-col :span="6">责任医生：{{ titleInfo.docName }}</el-col>
      </el-row>
    </div> -->
    <mains
      style="height: calc(100% - 92px)"
      :navBarObj="navBarObj"
      @getExamData="getExamData"
    ></mains>
  </div>
</template>

<script>
import headers from "./components/header.vue";
import mains from "./components/main.vue";

export default {
  name: "healthExam",
  components: { headers, mains },
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
      examData: {},
    };
  },
  computed: {
    titleInfo() {
      let obj = this.examData.medicalExamRecord || {};
      return {
        type: "体检",
        source: obj.source || "--",
        examDate:
          obj.examDate && obj.examDate.indexOf(" ") > -1
            ? obj.examDate.split(" ")[0]
            : "--",
        docName: obj.docName || "--",
      };
    },
  },
  created() {},
  methods: {
    getExamData(data) {
      this.examData = data;
      this.$emit("getMainData", {
        ...this.examData,
      });
    },
  },
};
</script>

<style lang="scss">
.healthExam {
  width: 100%;
  height: 100%;
  .health-header {
    .title {
      font-size: 20px;
      color: #333;
      text-align: center;
      margin: 5px auto 16px;
      font-weight: bold;
    }
    .title-info {
      color: rgb(90, 90, 90);
      font-size: 16px;
      margin: 0 18px;
      .el-col {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
