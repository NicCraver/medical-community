<template>
  <div class="health-header">
    <div class="title">{{ navBarObj.hospitalName }}</div>
    <el-row class="title-info">
      <el-col :span="6" :title="titleInfo.type || ''">类型：{{ titleInfo.type || "" }}
      </el-col>
      <el-col :span="6" :title="titleInfo.source || ''">来源：{{ titleInfo.source || "" }}
      </el-col>
      <el-col :span="6" :title="titleInfo.examDate || ''">体检日期：{{ titleInfo.examDate || "" }}</el-col>
      <el-col :span="6" :title="titleInfo.docName || ''">责任医生：{{ doctorNamePrivacy(titleInfo.docName || "") }}</el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "header",
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
    examData: {
      type: Object,
      default() {
        return {
          homeSickbedRecordList: [],
          meInhospitalRecordList: [],
          medicalExamListRecordList: [],
          medicalExamRecord: {},
          medicalexamMedicineRecordList: [],
          nonImmuVaccinationRecordList: [],
          medicalExamListRecordList1: [],
          medicalExamListRecordList2: [],
          medicalExamListRecordList3: [],
        };
      },
    },
  },
  data() {
    return {};
  },
  watch: {
    personalInfos: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {},
      deep: true,
    },
  },
  computed: {
    ...mapGetters({ doctorNamePrivacy: "base/doctorNamePrivacy" }),
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
  methods: {},
};
</script>

<style lang="scss">
.health-header {
  border-bottom: 1px solid #f2f2f2;
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
</style>
