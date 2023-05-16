<template>
  <div class="multiFollow">
    <div class="top">
      <el-table
        height="300px"
        ref="singleTable"
        :data="patientList"
        border
        row-key="patId"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="性别" prop="sexDesc" />
        <el-table-column label="年龄" prop="age" />
        <el-table-column label="手机号" prop="phoneNo" width="130" />
        <el-table-column
          label="慢病种类"
          prop="richDiseaseName"
          show-overflow-tooltip
        />
        <el-table-column label="随访病种" prop="followUpDiseaseText" />
        <el-table-column
          label="是否有开启中的随访"
          prop="isStartFollowupText"
          width="150"
        />
        <el-table-column
          label="纳入人"
          prop="includeUserName"
          width="160"
          show-overflow-tooltip
        />
        <el-table-column label="纳入机构" prop="joinHosName" width="200" />
        <el-table-column label="纳入时间" prop="includeDate" width="180" />
        <el-table-column label="责任医生" prop="doctorUserName" />
      </el-table>
    </div>
    <div class="bottom">
      <AddPlanNewCom
        ref="AddPlanNewCom"
        planDetailType="add"
        :diseaseTypeList="diseaseTypeList"
        :followUpForms="followUpForms"
        :planDetail="planDetail"
        :patDtoList="patDtoList"
        followupType="multi"
        @updateStepState="updateStepState"
      ></AddPlanNewCom>
    </div>
    <div class="footer">
      <el-button @click="cancleFuc">取消</el-button>
      <el-button type="primary" v-if="submitShow" @click="addPlanSubmitFuc">
        创建
      </el-button>
    </div>
  </div>
</template>
<script>
import AddPlanNewCom from "./AddPlanNewCom";
import { getFollowUpForms } from "@/api/modules/PatientCenter";
import { mapGetters } from "vuex";
export default {
  name: "multiFollow",
  components: { AddPlanNewCom },
  data() {
    return {
      planDetail: {},
      submitShow: false,
      followUpForms: [],
    };
  },
  computed: {
    ...mapGetters({
      patientList: "base/patientList",
    }),
    diseaseTypeList() {
      let commonList = this.patientList.length
        ? this.patientList[0]?.commonList || []
        : [];
      let list = commonList.map((item) => {
        return {
          richDiseaseCode: item.value,
          richDiseaseName: item.label,
        };
      });
      return list;
    },
    patDtoList() {
      let list = this.patientList.map((item) => {
        return {
          patId: item.patId,
          name: item.name,
        };
      });
      return list;
    },
  },
  created() {
    this.getFollowUpForms();
  },
  methods: {
    // 获取随访表单列表
    async getFollowUpForms() {
      try {
        const res = await getFollowUpForms({ type: "FOLLOW" });
        this.followUpForms = res?.result || [];
      } catch (err) {
        console.error(err);
      }
    },
    // 取消
    cancleFuc() {
      this.$router.push({
        name: "PatientCenter",
      });
    },
    // 提交
    addPlanSubmitFuc() {
      let comName = this.$refs.AddPlanNewCom;
      comName && comName.addPlanSubmitFuc();
    },
    updateStepState(val) {
      this.submitShow = val === "2";
    },
  },
};
</script>
<style lang="scss" scoped>
.multiFollow {
  padding: 10px;
  height: calc(100vh - 118px);
  .top {
    background: #fff;
    padding: 10px;
  }
  .bottom {
    height: calc(100% - 370px);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    background: #fff;
  }
  .footer {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #fff;
    margin-top: 10px;
    padding: 15px;
  }
}
</style>
