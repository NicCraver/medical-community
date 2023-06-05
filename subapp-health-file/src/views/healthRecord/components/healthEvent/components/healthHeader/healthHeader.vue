<template>
  <div class="medicalTreatmentRecord">
    <div
      class="title"
      v-if="
        navBarObj.type === 'treatmentRecord' ||
        navBarObj.type === 'medRecordIndex' ||
        navBarObj.type === 'healthExam' ||
        navBarObj.type === 'operateRecord'
      "
    >
      {{ navBarObj.hospitalName }}
      <div class="title-two">
        {{
          navBarObj.type === "treatmentRecord"
            ? "门诊病历记录"
            : navBarObj.type === "medRecordIndex"
            ? "住院病案信息"
            : navBarObj.type === "healthExam"
            ? "体检记录"
            : "手术记录"
        }}
      </div>
    </div>
    <div class="title" v-else-if="navBarObj.type === 'pharmacy'">
      {{
        navBarObj.groupType === "diag"
          ? "疾病用药"
          : navBarObj.hospitalName || "--"
      }}
      <div class="title-two">
        {{
          navBarObj.groupType === "diag"
            ? `${navBarObj.groupTitle || ""}${navBarObj.groupDesc || ""}`
            : `${
                (navBarObj.groupTitle || "").indexOf(" ") > -1
                  ? navBarObj.groupTitle.split(" ")[1]
                  : ""
              }`
        }}
      </div>
    </div>
    <div class="title" v-else-if="navBarObj.type === 'checkRecord'">
      检查记录
    </div>
    <div v-else-if="navBarObj.type === 'tranTreat'" class="title changeHos">
      {{ navBarObj.itemName || "--" }}
      <div class="title-two">
        <span>{{ navBarObj.fromHospitalName || "--" }}</span>
        <i class="el-icon-right"></i>
        <span>{{ navBarObj.toHospitalName || "--" }}</span>
      </div>
    </div>
    <div v-else></div>
    <!-- 门诊病历 -->
    <el-row class="title-info" v-if="navBarObj.type === 'treatmentRecord'">
      <el-col :span="4" :title="navBarObj.itemDate || ''"
        >日期：{{ navBarObj.itemDate || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.departmentName || ''"
        >科室：{{ navBarObj.departmentName || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.doctorName || ''"
        >医生：{{ doctorNamePrivacy(navBarObj.doctorName) || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.itemLabel || ''"
        >诊断：{{ navBarObj.itemLabel || "--" }}</el-col
      >
      <el-col :span="2">
        <el-button
          type="text"
          :disabled="!itemObj.serialNumber"
          @click="jumpToFuc('serialNumber')"
          class="float-right jump-btn"
        >
          <IconSvg
            iconClass="card-two"
            width="16"
            height="16"
            style="vertical-align: middle; margin-right: 1px"
          ></IconSvg
          >查看就诊
        </el-button>
      </el-col>
    </el-row>
    <!-- 住院病案 -->
    <el-row class="title-info" v-else-if="navBarObj.type === 'medRecordIndex'">
      <el-col :span="8" :title="medRecordIndexData.itemDate"
        >日期：{{ medRecordIndexData.itemDate }}
      </el-col>
      <!-- <el-col :span="4" :title="medRecordIndexData.departmentName || ''"
        >科室：{{ medRecordIndexData.departmentName || "--" }}
      </el-col>
      <el-col :span="4" :title="medRecordIndexData.doctorName || ''"
        >医生：{{ doctorNamePrivacy(medRecordIndexData.doctorName) || "--" }}
      </el-col> -->
      <el-col :span="6" :title="navBarObj.itemLabel || ''"
        >入院诊断：{{ navBarObj.itemLabel || "--" }}</el-col
      >
      <el-col :span="2">
        <el-button
          type="text"
          :disabled="!itemObj.serialNumber"
          @click="jumpToFuc('serialNumber')"
          class="float-right jump-btn"
        >
          <IconSvg
            iconClass="card-two"
            width="16"
            height="16"
            style="vertical-align: middle; margin-right: 1px"
          ></IconSvg
          >查看就诊
        </el-button>
      </el-col>
    </el-row>
    <!-- 体检 -->
    <el-row class="title-info" v-else-if="navBarObj.type === 'healthExam'">
      <el-col :span="8" :title="navBarObj.itemDate || ''"
        >体检日期：{{ navBarObj.itemDate || "--" }}
      </el-col>
      <el-col :span="8" :title="navBarObj.detail || ''"
        >来源：{{ healthExamData.source || "" }}
      </el-col>
      <el-col :span="8" :title="navBarObj.doctorName || ''"
        >责任医生：{{ doctorNamePrivacy(navBarObj.doctorName) || "--" }}
      </el-col>
    </el-row>
    <!-- 手术 -->
    <el-row class="title-info" v-else-if="navBarObj.type === 'operateRecord'">
      <el-col :span="6" :title="navBarObj.itemDate || '--'"
        >手术日期：{{ navBarObj.itemDate || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.departmentName || '--'"
        >科室：{{ navBarObj.departmentName || "--" }}
      </el-col>
      <el-col :span="6" :title="operateRecordData.itemLabel || '--'"
        >临床诊断：{{ operateRecordData.itemLabel || "--" }}
      </el-col>
      <el-col :span="6">
        <el-button
          type="text"
          :disabled="!itemObj.serialNumber"
          @click="jumpToFuc('serialNumber')"
          class="float-right jump-btn"
        >
          <IconSvg
            iconClass="card-two"
            width="16"
            height="16"
            style="vertical-align: middle; margin-right: 1px"
          ></IconSvg
          >查看就诊
        </el-button>
      </el-col>
    </el-row>
    <!-- 用药 -->
    <el-row
      class="title-info"
      v-else-if="
        navBarObj.type === 'pharmacy' && navBarObj.groupType !== 'diag'
      "
    >
      <el-col :span="6" :title="navBarObj.deptName || ''"
        >科室：{{ navBarObj.deptName || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.doctorName || ''"
        >医生：{{ doctorNamePrivacy(navBarObj.doctorName) || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.diagName || ''"
        >诊断：{{ navBarObj.diagName || "--" }}
      </el-col>
      <el-col :span="6">
        <el-button
          type="text"
          :disabled="!itemObj.serialNumber"
          @click="jumpToFuc('serialNumber')"
          class="float-right jump-btn"
        >
          <IconSvg
            iconClass="card-two"
            width="16"
            height="16"
            style="vertical-align: middle; margin-right: 1px"
          ></IconSvg
          >查看就诊
        </el-button>
      </el-col>
    </el-row>
    <!-- 转诊 -->
    <el-row class="title-info" v-else-if="navBarObj.type === 'tranTreat'">
      <el-col
        :span="6"
        :title="
          navBarObj.turnOutTime && navBarObj.turnOutTime.indexOf(' ') > -1
            ? navBarObj.turnOutTime.split(' ')[0]
            : ''
        "
        >转出日期：{{
          navBarObj.turnOutTime && navBarObj.turnOutTime.indexOf(" ") > -1
            ? navBarObj.turnOutTime.split(" ")[0]
            : "--"
        }}
      </el-col>
      <el-col :span="6" :title="navBarObj.fromHospitalName || ''"
        >转出医院：{{ navBarObj.fromHospitalName || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.fromDeptName || ''"
        >转出科室：{{ navBarObj.fromDeptName || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.applyDoctorName || ''"
        >申请医生：{{
          doctorNamePrivacy(navBarObj.applyDoctorName) || "--"
        }}</el-col
      >
      <el-col :span="6" :title="navBarObj.bizType || ''"
        >业务类型：{{ navBarObj.bizType || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.toHospitalName || ''"
        >转入医院：{{ navBarObj.toHospitalName || "--" }}
      </el-col>
      <el-col :span="6" :title="navBarObj.toDeptName || ''"
        >转入科室：{{ navBarObj.toDeptName || "--" }}</el-col
      >
      <el-col :span="6">
        <el-button
          type="text"
          :disabled="!itemObj.serialNumber"
          @click="jumpToFuc('serialNumber')"
          class="float-right jump-btn"
        >
          <IconSvg
            iconClass="card-two"
            width="16"
            height="16"
            style="vertical-align: middle; margin-right: 1px"
          ></IconSvg
          >查看就诊
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "healthHeader",
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
    // 卫生服务活动数据
    mainData: {
      type: Object,
      default() {
        return {
          type: "",
          data: null,
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      doctorNamePrivacy: "base/doctorNamePrivacy",
    }),
    // 住院病案
    medRecordIndexData() {
      let basicInfo =
        this.mainData.data && this.mainData.data.hasOwnProperty("basicInfo")
          ? this.mainData.data.basicInfo
          : {};
      let rysj =
        basicInfo.rysj && basicInfo.rysj.indexOf(" ") > -1
          ? basicInfo.rysj.split(" ")[0]
          : basicInfo.rysj || "--";
      let cysj =
        basicInfo.cysj && basicInfo.cysj.indexOf(" ") > -1
          ? basicInfo.cysj.split(" ")[0]
          : basicInfo.cysj || "--";
      return {
        itemDate: `${rysj} 至 ${cysj}`, //日期
        departmentName: basicInfo.ryksmc || "--",
        doctorName: basicInfo.zzysxm || "--",
      };
    },
    // 手术
    operateRecordData() {
      let data = this.mainData.data ? this.mainData.data : {};
      return {
        itemLabel: `${data.ssqzdmc || "--"}(${data.ssqzd || "--"})`,
      };
    },
    healthExamData() {
      let medicalExamRecord =
        this.mainData.data &&
        this.mainData.data.hasOwnProperty("medicalExamRecord")
          ? this.mainData.data.medicalExamRecord
          : {};
      return {
        source: medicalExamRecord.source,
      };
    },
    // 跳转的数据
    itemObj() {
      let obj = {
        ...this.navBarObj,
        ...this.mainData.data || {},
      };
      if (this.navBarObj.type === "operateRecord") {
        obj.serialNumber = this.mainData?.data?.jzlsh;
      }
      return obj;
    },
  },
  watch: {
    personalInfos: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {},
      deep: true,
    },
    navBarObj: {
      handler(val) {
        console.log(8888, val);
      },
      deep: true,
    },
  },
  created() {},
  destroyed() {},
  methods: {
    ...mapActions({
      setJumpToData: "base/setJumpToData",
    }),
    jumpToFuc(itemFlag) {
      //跳转到健康事件界面
      let year = "";
      if (this.navBarObj.type == "pharmacy") {
        year = this.navBarObj.groupTitle.split("-")[0] || "";
      } else if (this.navBarObj.type == "tranTreat") {
        year = this.navBarObj.turnInTime.split("-")[0] || "";
      } else {
        year = this.navBarObj.itemDate.split("-")[0] || "";
      }

      let jumpToDataObj = {
        firstLevelName: "two",
        healthEventName: "first",
        healthEventItem: {
          item: this.itemObj,
          itemFlag,
          type: "visit",
          flag: "item",
          year,
        },
      };
      console.log("跳转的111111111111", jumpToDataObj);
      this.setJumpToData(jumpToDataObj);
    },
  },
};
</script>

<style lang="scss" scoped="">
.medicalTreatmentRecord {
  width: 100%;
  ::v-deep.el-tabs .el-tabs__content {
    padding-right: 15px !important;
  }
  .title {
    line-height: 24px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin: 0 0 12px 0;
    .title-two {
      margin-top: 10px;
    }
  }
  .title-info {
    color: rgb(90, 90, 90);
    font-size: 16px;
    line-height: 40px;
    background: #f7f7f7;
    padding: 0 8px;
    margin-bottom: 12px;
    box-shadow: 0px 1px 1px 1px rgba(223, 223, 223, 0.4);
    .el-col {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .jump-btn {
      padding: 10px 0;
      font-size: 16px;
    }
  }
}

.el-icon-right:before {
  font-weight: bold;
}
.changeHos {
  span {
    color: #333;
    opacity: 0.85;
  }
}
// .elTabsCls {
//   ::v-deep .el-tabs__content {
//     height: calc(100% - 82px) !important;
//   }
// }
</style>
