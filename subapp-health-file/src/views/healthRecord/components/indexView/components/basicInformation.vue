<template>
  <div class="basic-info">
    <el-row class="line">
      <el-col :span="7">
        <el-row class="row">
          <el-col :span="8" class="txt-left">血型：</el-col>
          <el-col :span="16" class="txt-right">
            <span
              v-if="
                personalInfos.personalArchiveMainInfo
              "
              >{{ personalInfos.personalArchiveMainInfo.bloodType }}
              {{
                personalInfos.personalArchiveMainInfo.bloodRhCode == "1"
                  ? "Rh:阴性"
                  : personalInfos.personalArchiveMainInfo.bloodRhCode == "2"
                  ? "Rh:阳性"
                  : personalInfos.personalArchiveMainInfo.bloodRhCode == "3"
                  ? "Rh:不详"
                  : personalInfos.personalArchiveMainInfo.bloodRhCode == "4"
                  ? "Rh:未查"
                  : ""
              }}
            </span>
            <span v-else>--</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-row class="row">
          <el-col :span="9" class="txt-left">过敏史：</el-col>
          <el-col :span="15" class="txt-right">
            <span
              v-if="
                personalInfos.allergenRecordList &&
                personalInfos.allergenRecordList.length > 0
              "
              :title="
                personalInfos
                  | filterlist(that, 'allergenRecordList', 'allergenSourceName')
              "
              >{{
                personalInfos
                  | filterlist(that, "allergenRecordList", "allergenSourceName")
              }}
            </span>
            <span v-else>--</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-row class="row">
          <el-col :span="9" class="txt-left">手术史：</el-col>
          <el-col :span="15" class="txt-right">
            <span
              v-if="
                personalInfos.opsRecordList &&
                personalInfos.opsRecordList.length > 0
              "
              :title="
                personalInfos
                  | filterlist(that, 'opsRecordList', 'operationsName')
              "
            >
              {{
                personalInfos
                  | filterlist(that, "opsRecordList", "operationsName")
              }}
            </span>
            <span v-else>--</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="line">
      <el-col :span="7">
        <el-row class="row">
          <el-col :span="8" class="txt-left">残疾情况：</el-col>
          <el-col :span="16" class="txt-right">
            <span
              :title="personalInfos.personalArchiveMainInfo.disabilityName"
              v-if="
                personalInfos.personalArchiveMainInfo &&
                personalInfos.personalArchiveMainInfo.disabilityName
              "
            >
              {{ personalInfos.personalArchiveMainInfo.disabilityName }}
            </span>
            <span v-else>--</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-row class="row">
          <el-col :span="9" class="txt-left">预防接种史：</el-col>
          <el-col :span="15" class="txt-right">
            <span>
              {{
                personalInfos.vaccinationCount &&
                personalInfos.vaccinationCount > 0
                  ? "有"
                  : "无"
              }}
            </span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-row class="row">
          <el-col :span="9" class="txt-left">健康危险因素：</el-col>
          <el-col :span="15" class="txt-right">
            <span
              v-if="
                personalInfos.personalArchiveMainInfo &&
                personalInfos.personalArchiveMainInfo.behaviorRiskFactorsName
              "
              :title="
                personalInfos.personalArchiveMainInfo.behaviorRiskFactorsName
              "
            >
              {{
                personalInfos.personalArchiveMainInfo.behaviorRiskFactorsName
              }}
            </span>
            <span v-else>--</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="line">
      <el-col :span="14">
        <el-row class="row">
          <el-col :span="4" class="txt-left">既往史：</el-col>
          <el-col :span="20" class="txt-right">
            <span
              v-if="
                personalInfos.diseaseRecordList &&
                personalInfos.diseaseRecordList.length > 0
              "
              :title="
                personalInfos
                  | filterlist(that, 'diseaseRecordList', 'diseaseName')
              "
            >
              {{
                personalInfos
                  | filterlist(that, "diseaseRecordList", "diseaseName")
              }}
            </span>
            <span v-else>--</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" :offset="2">
        <el-row class="row">
          <el-col :span="9" class="txt-left">家族遗传史：</el-col>
          <el-col :span="15" class="txt-right">
            <span
              v-if="
                personalInfos.personalArchiveMainInfo &&
                personalInfos.personalArchiveMainInfo.geneticHistoryName
              "
              :title="personalInfos.personalArchiveMainInfo.geneticHistoryName"
            >
              {{ personalInfos.personalArchiveMainInfo.geneticHistoryName }}
            </span>
            <span v-else>--</span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="line">
      <el-col :span="14">
        <el-row class="row">
          <el-col :span="5" class="txt-left">亲属健康情况：</el-col>
          <el-col :span="19" class="txt-right">
            <!-- <span
              v-if="
                personalInfos.familyDiseaseList &&
                personalInfos.familyDiseaseList.length > 0
              "
              :title="
                personalInfos
                  | filterlist1(
                    that,
                    'familyDiseaseList',
                    'diseaseName',
                    'patientRelationship'
                  )
              "
            >
              {{
                personalInfos
                  | filterlist1(
                    that,
                    "familyDiseaseList",
                    "diseaseName",
                    "patientRelationship"
                  )
              }}
            </span>
            <span v-else>--</span> -->
            <span :title="familyDiseases">{{ familyDiseases }}</span>
          </el-col>
        </el-row>
      </el-col>
      <el-col
        :span="8"
        :offset="2"
        v-if="
          personalInfos.personalArchiveMainInfo &&
          personalInfos.personalArchiveMainInfo.genderCode == '2'
        "
      >
        <el-row class="row">
          <el-col :span="9" class="txt-left">分娩史：</el-col>
          <el-col :span="15" class="txt-right">
            <span>
              {{
                personalInfos.womenBirthCount &&
                personalInfos.womenBirthCount > 0
                  ? "有"
                  : "无"
              }}
            </span>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "basicInformation",
  filters: {
    filterlist(a, that, list, name, label) {
      let filterlist = that.personalInfos[list].map((x) => {
        return x[name];
      });
      filterlist = filterlist.join(";");
      return filterlist;
    },
    filterlist1(a, that, list, name, label) {
      let filterlist = that.personalInfos[list].map((x) => {
        return (x[label] || "") + "-" + (x[name] || "");
      });
      filterlist = filterlist.join("; ");
      return filterlist;
    },
  },
  computed: {},
  data() {
    return {
      that: this,
    };
  },

  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    familyDiseases() {
      let personalInfos = this.personalInfos;
      let father = personalInfos.fatherDiseases
        ? `父亲:${personalInfos.fatherDiseases};`
        : "";
      let mother = personalInfos.motherDiseases
        ? `母亲:${personalInfos.motherDiseases};`
        : "";
      let siblings = personalInfos.siblingsDiseases
        ? `兄弟姐妹:${personalInfos.siblingsDiseases};`
        : "";
      let children = personalInfos.childrenDiseases
        ? `子女:${personalInfos.childrenDiseases};`
        : "";
      let familyDiseases = father + mother + siblings + children;
      return familyDiseases || "--";
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.basic-info {
  margin-right: 15px;
  margin-left: -44px;
  .line {
    margin-bottom: 20px;
    .row {
      line-height: 32px;
      .txt-left {
        text-align: right;
      }
      .txt-right {
        background-color: rgba(172, 187, 219, 0.2);
        border-radius: 2px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span {
          margin-left: 4px;
        }
      }
    }
  }
}
@media screen and (max-width: $resolution-ratio-width) {
  .basic-info {
    margin-left: 0;
  }
}
/*@media screen and (max-width: $device-min-width) {
  .basic-info {
    margin-left:0;
  }
}*/
</style>
