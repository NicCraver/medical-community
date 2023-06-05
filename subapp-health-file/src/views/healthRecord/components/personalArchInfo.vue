<template>
  <div class="page">
    <div class="largeTitleWrapper">
      个人档案信息
      <!-- <l-card-title class="largeTitle">
        <span slot="left"></span>
      </l-card-title> -->
    </div>
    <div class="cardWrapper">
      <el-card class="box-card firstCard">
        <el-row class="line">
          <el-col :span="8">
            <dispalyCell title="健康档案编号：" :value="personalArchiveInfo.empi"></dispalyCell>
          </el-col>
          <el-col :span="8">
            <dispalyCell title="建档单位：" :value="personalArchiveMainInfo.healthArchManageOrgName"></dispalyCell>
          </el-col>
          <el-col :span="8">
            <dispalyCell title="责任医生：" :value="doctorNamePrivacy(personalArchiveMainInfo.dutyDocName)"></dispalyCell>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <dispalyCell title="建档医生：" :value="doctorNamePrivacy(personalArchiveMainInfo.regWorkerName)"></dispalyCell>
          </el-col>
          <el-col :span="16">
            <dispalyCell title="建档日期：" :value="personalArchiveMainInfo.createArchiveDate"></dispalyCell>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <l-card-title class="cardTitle">
          <span slot="left">基本信息</span>
        </l-card-title>
        <div class="cardContent">
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell title="姓名：" :value="personalNamePrivacy(personalArchiveMainInfo.name)"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="性别：" :value="personalArchiveMainInfo.gender"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="出生日期：" :value="personalArchiveMainInfo.birthday"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <dispalyCell :title="`${personalArchiveMainInfo.certType || ''}`" titleCode="CV02.01.101" connectMark="：" :value="personalArchiveMainInfo.certType == '1' ? personalIdPrivacy(personalArchiveMainInfo.certId) : personalArchiveMainInfo.certId"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="民族：" :value="personalArchiveMainInfo.nationName"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="婚姻状况：" :value="personalArchiveMainInfo.marital"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <dispalyCell title="本人电话：" :value="personalTelPrivacy(personalArchiveInfo.mobilePhoneNum)"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="联系人姓名：" :value="personalNamePrivacy(personalArchiveInfo.contactName)"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="联系人电话：" :value="personalTelPrivacy(personalArchiveInfo.contactPhone)"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <dispalyCell title="工作单位：" :value="personalArchiveInfo.companyName"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="职业：" :value="personalArchiveMainInfo.jobName"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="文化程度：" :value="personalArchiveMainInfo.eduLevel"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <dispalyCell title="医疗费用支付方式：" :value="personalArchiveMainInfo.medFeePayType"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <!-- //0.非户籍 1.户籍 -->
              <dispalyCell title="常住类型：" :value="liveStatusCodeShow(personalArchiveMainInfo.liveStatus)"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="暴露史：" :value="personalArchiveMainInfo.exposeName"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <dispalyCell title="血型：" :value="bloodType"></dispalyCell>
            </el-col>
            <el-col :span="16">
              <dispalyCell title="药物过敏史：" :value="jiWangShi.allergenRecordName" specialMark></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <dispalyCell title="户籍地址：" :value="addStrHandler1(personalArchiveInfo)"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="详细地址：" :value="privacyConfig.addPrivacyEnable === '1'?'****':personalArchiveInfo.registerAddr"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <dispalyCell title="现住址：" :value="addStrHandler(personalArchiveInfo)"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="详细地址：" :value="privacyConfig.addPrivacyEnable === '1'?'****':personalArchiveInfo.liveAddr"></dispalyCell>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card">
        <l-card-title class="cardTitle">
          <span slot="left">既往史</span>
        </l-card-title>
        <div class="cardContent">
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell title="疾病：" :value="jiWangShi.diseaseName"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <dispalyCell title="手术：" :value="jiWangShi.opsRecordName"></dispalyCell>
            </el-col>
          </el-row>
          <el-row class="line">
            <el-col :span="24">
              <dispalyCell title="外伤：" :value="jiWangShi.traumaRecordName"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <dispalyCell title="输血：" :value="jiWangShi.bloodTransfusionRecordName"></dispalyCell>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card">
        <l-card-title class="cardTitle">
          <span slot="left">家族史</span>
        </l-card-title>
        <div class="cardContent">
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell title="父亲：" :value="personalInfos.fatherDiseases || '--'"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <dispalyCell title="母亲：" :value="personalInfos.motherDiseases || '--'"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <dispalyCell title="兄弟姐妹：" :value="personalInfos.siblingsDiseases || '--'"></dispalyCell>
            </el-col>
            <el-col :span="12">
              <dispalyCell title="子女：" :value="personalInfos.childrenDiseases || '--'"></dispalyCell>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card firstCard">
        <el-row class="line">
          <el-col :span="12">
            <dispalyCell title="遗传病史：" :value="geneticHistoryName"></dispalyCell>
          </el-col>
          <el-col :span="12">
            <dispalyCell title="残疾情况：" :value="personalArchiveMainInfo.disabilityName"></dispalyCell>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <l-card-title class="cardTitle">
          <span slot="left">生活环境</span>
        </l-card-title>
        <div class="cardContent">
          <el-row class="line">
            <el-col :span="8">
              <dispalyCell title="厨房排风设施：" :value="kitchenExhaustName"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="燃料类型：" :value="personalArchiveMainInfo.fuelTypeName"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="饮水：" :value="personalArchiveMainInfo.drinkingWaterName"></dispalyCell>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <dispalyCell title="厕所：" :value="personalArchiveMainInfo.toiletName"></dispalyCell>
            </el-col>
            <el-col :span="8">
              <dispalyCell title="禽畜栏：" :value="livestockBarShow(personalArchiveMainInfo.livestockBar)"></dispalyCell>
            </el-col>
            <el-col :span="8"> </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import LCardTitle from "@/components/LCardTitle.vue";
import dispalyCell from "@/components/displayCell/dispalyCell";
import { getPersonalArchiveInfoById } from "@/api/modules/healthRecord/index.js";
import { mapGetters } from "vuex";

export default {
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {
          personalArchiveInfo: {},
          diseaseRecordList: [],
        };
      },
    },
  },
  data() {
    return {
      jiWangShi: {
        diseaseName: "",
        opsRecordName: "",
        traumaRecordName: "",
        allergenRecordName: "",
        bloodTransfusionRecordName: "",
      },
      familyShi: {
        father: "",
        mather: "",
        ssterBtr: "",
        ziNv: "",
        yiChuanBingShi: "",
        canJiQingkuang: "",
      },
      shengHuoHuanJing: {
        chuFangSheShi: "",
        ranLiaoLeiXing: "",
        yinYongShui: "",
        ceSuo: "",
        qingChuLan: "",
      },
      // 生活环境
      personalArchiveMainInfo: {},
      liveStatusCode: [
        {
          name: "非户籍",
          code: "0",
        },
        {
          name: "户籍",
          code: "1",
        },
      ],
      livestockBarCode: [
        {
          name: "单设",
          code: "1",
        },
        {
          name: "室外",
          code: "3",
        },
        {
          name: "室内",
          code: "2",
        },
      ],
      /* relationData: [
        {
          name: "本人",
          code: "0",
        },
        {
          name: "兄弟",
          code: "7",
        },
        {
          name: "父亲",
          code: "51",
        },
        {
          name: "母亲",
          code: "52",
        },
        {
          name: "儿子",
          code: "2",
        },
        {
          name: "妻子",
          code: "1",
        },
        {
          name: "女儿",
          code: "3",
        },
      ], */
      // GB/T 2261.2-2003
      /* maritalCode: [
        {
          name: "未婚",
          code: "10",
        },
        {
          name: "已婚",
          code: "20",
        },
        {
          name: "离婚",
          code: "40",
        },
        {
          name: "丧偶",
          code: "30",
        },
      ], */
      familyMemberRelationshipList: [],
      diseaseRecordList: [],
      personalArchiveInfo: {
        name: "",
        gender: "",
        birthday: "", // 出生日期：
        certId: "", //证件号码
        nationName: "", //
        marital: "",
        mobilePhoneNum: "",
        contactName: "",
        companyName: "",
        jobName: "",
        eduLevel: "",
        medFeePayType: "",
        liveStatus: "",
        exposeName: "",
        bloodType: "",
        drugExposeName: "",
        hujiLiveAddr: "",
        fLiveAddr: "",
        nLiveAddr: "",
        pAID: "",
        healthArchManageOrgName: "",
        dutyDocName: "",
        jdDoctor: "",
        createArchiveDate: "",
      },
      familyDiseaseList: [],
    };
  },
  computed: {
    ...mapGetters({
      privacyConfig: "base/privacyConfig",
      personalNamePrivacy: "base/personalNamePrivacy",
      personalIdPrivacy: "base/personalIdPrivacy",
      personalTelPrivacy: "base/personalTelPrivacy",
      personalAddPrivacy: "base/personalAddPrivacy",
      doctorNamePrivacy: "base/doctorNamePrivacy",
    }),
    geneticHistoryName() {
      let name = "";
      if (this.personalArchiveMainInfo.geneticHistoryMark == "0") {
        name = "无";
      } else {
        name = this.personalArchiveMainInfo.geneticHistoryName || "--";
      }
      return name;
    },
    kitchenExhaustName() {
      let name = "";
      if (this.personalArchiveMainInfo.kitchenExhaustMark == "0") {
        name = "否";
      } else {
        name = this.personalArchiveMainInfo.kitchenExhaustName || "--";
      }
      return name;
    },
    bloodType() {
      let name = this.personalArchiveMainInfo.bloodType || "";
      let bloodRhCode = this.personalArchiveMainInfo.bloodRhCode;
      let name1 =
        bloodRhCode == "1"
          ? "rh阴性"
          : bloodRhCode == "2"
          ? "rh阳性"
          : bloodRhCode == "3"
          ? "rh不详"
          : bloodRhCode == "4"
          ? "rh未查"
          : "";
      return name + " " + name1;
    },
  },
  components: {
    LCardTitle,
    dispalyCell,
  },
  created() {
    this.getPatientArchInfo();
    // console.log("created");
  },
  mounted() {
    // console.log("mounted");
  },
  methods: {
    liveStatusCodeShow(code) {
      let tarObj = this.liveStatusCode.find((item) => item.code == code);
      // console.log(tarObj);
      return tarObj ? tarObj.name : "--";
    },
    livestockBarShow(code) {
      let tarObj = this.livestockBarCode.find((item) => item.code == code);
      // console.log(tarObj);
      return tarObj ? tarObj.name : "--";
    },
    addStrHandler1(obj) {
      let {
        registerProvince = "",
        registerCity = "",
        registerCounty = "",
        registerTownship = "",
      } = obj;
      console.log("=======");
      console.log(obj);
      return this.personalAddPrivacy(
        registerProvince,
        registerCity,
        registerCounty,
        registerTownship,
        obj.registerRc,
        obj.registerVillage,
        obj.registerRoadNo,
        obj.registerBuildingNo,
        obj.registerDoorNo
      );
    },
    addStrHandler(obj) {
      let {
        liveProvince = "",
        liveCity = "",
        liveCounty = "",
        liveTownship = "",
      } = obj;
      return this.personalAddPrivacy(
        liveProvince,
        liveCity,
        liveCounty,
        liveTownship,
        obj.liveResidentCommittee,
        obj.liveVillage,
        obj.liveRoadNo,
        obj.liveBuildingNo,
        obj.liveDoorNo,
        obj.liveAddr
      );
    },
    /* maritalHandler(code) {
      console.log("code:::", code);
      let tarObj = this.maritalCode.find(
        (item) => item.code == code.maritalStatus
      );
      return tarObj ? tarObj.name : "--";
    }, */
    familyShiHandler(code) {
      let arr = this.familyDiseaseList.filter((item) => {
        return code.indexOf(item.patientRelationshipCode.toString()) > -1;
      });
      let diseaseNameArr = arr.map((item) => {
        return item.diseaseName;
      });
      let diseaseNameStr = diseaseNameArr.join("，");
      return diseaseNameStr || "--";
    },
    concatStr(List = [], nameStr = "diseaseName") {
      let diseaseNameStr = "";
      List.forEach((element, index) => {
        diseaseNameStr += index + 1 + "、" + element[nameStr] + "    ";
      });
      return diseaseNameStr;
    },
    async getPatientArchInfo() {
      let {
        personalArchiveInfo = {},
        opsRecordList,
        bloodTransfusionRecordList,
        allergenRecordList,
        traumaRecordList,
        familyMemberRelationshipList,
        personalArchiveMainInfo,
        diseaseRecordList = [],
        familyDiseaseList = [],
      } = this.personalInfos;
      console.log(personalArchiveInfo);
      this.personalArchiveInfo = personalArchiveInfo || {};
      this.personalArchiveMainInfo = personalArchiveMainInfo || {};
      this.familyMemberRelationshipList = familyMemberRelationshipList || [];
      let diseaseNameStr = "";
      // console.log(diseaseRecordList);
      // let diseaseNameList = diseaseRecordList.forEach((element, index) => {
      //   diseaseNameStr += index + 1 + "、" + element.diseaseName;
      // });
      this.jiWangShi.diseaseName = this.concatStr(diseaseRecordList);
      this.jiWangShi.opsRecordName = this.concatStr(
        opsRecordList,
        "operationsName"
      );
      this.jiWangShi.traumaRecordName = this.concatStr(
        traumaRecordList,
        "traumaName"
      );
      this.jiWangShi.bloodTransfusionRecordName = this.concatStr(
        bloodTransfusionRecordList,
        "bTCause"
      );
      this.jiWangShi.allergenRecordName = this.concatStr(
        allergenRecordList,
        "allergenSourceName"
      );
      this.familyDiseaseList = familyDiseaseList;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-card__body {
  padding: 6px 8px;
}

.cardWrapper {
  padding-left: 11px;
}

.largeTitleWrapper {
  display: flex;
  line-height: 50px;
  background-color: $l-color-menu;
  font-size: $l-font-size-max !important;
  color: #fff !important;
  padding-left: 12px;
}

// .box-card-first {
//   margin: 4px 0;
// }

.firstCard {
  ::v-deep .el-card__body {
    padding: 4px 17px;
  }
}

.box-card {
  margin: 12px 0;
  .cardTitle {
    padding: 0 6px;
  }
  .el-row {
    line-height: 29px;
  }
  .cardContent {
    padding: 0 9px;
    margin-top: 6px;
  }
}
</style>
