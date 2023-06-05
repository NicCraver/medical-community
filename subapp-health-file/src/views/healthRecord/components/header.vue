<template>
  <div class="headerCom-cont">
    <div class="info-first">
      <div class="headPortrait">
        <img src="@/assets/man.png" alt="" style="width: 60px; height: 60px" v-if="personalInfos.personalArchiveInfo.gender === '1'" />
        <img src="@/assets/women.png" alt="" style="width: 60px; height: 60px" v-else-if="personalInfos.personalArchiveInfo.gender === '2'" />
      </div>
      <div class="info info-one">
        <div class="info-item info-top" :title="`${personalNamePrivacy(personalArchInfo.name)} ${personalArchInfo.gender} ${personalArchInfo.age}`">
          <span class="info-item-name">{{
            personalNamePrivacy(personalArchInfo.name) || "--"
          }}</span>
          <span class="info-item-gender">{{
            personalArchiveMainInfo.gender || "--"
          }}</span>
          <span>{{ personalArchInfo.age || "--" }}</span>
        </div>
        <div class="info-item" :title="`${personalArchInfo.birthday}`">
          出生日期：{{ personalArchInfo.birthday || "--" }}
        </div>
      </div>
      <div class="info info-two">
        <div class="info-item info-top" :title="`${personalArchInfo.empi}`">
          健康档案编号：{{ personalArchInfo.empi || "--" }}
        </div>
        <div class="info-item">
          <span v-codeTransform code="CV02.01.101" :val="personalArchInfo.certType || ''"></span>
          ：
          <span :title="`${personalArchInfo.certId}`">{{personalArchInfo.certId || "--"}}</span>
        </div>
      </div>
      <div class="info info-three">
        <div class="info-item info-top" :title="`${personalArchiveMainInfo.archStatus}`">
          状态：{{ personalArchiveMainInfo.archStatus || "--" }}
        </div>
        <div class="info-item" :title="`${personalArchInfo.mobilePhoneNum}`">
          电话：{{ personalTelPrivacy(personalArchInfo.mobilePhoneNum) || "--" }}
        </div>
      </div>
      <div class="info info-four">
        <div class="info-item info-top" :title="personalArchiveMainInfo.chronicDiseasesName.join('，')">
          <span class="chronicDisease" v-for="(item, index) in personalArchiveMainInfo.chronicDiseasesName" :key="index">{{ item }}</span>
        </div>
        <div class="info-item" :title="personalArchInfo.addr">
          联系地址：
          {{ personalArchInfo.addr || "--" }}
        </div>
      </div>
    </div>
    <div class="info-last">
      <el-button @click="getHealthRecord" v-if="persionInfoIsShow">查看个人档案</el-button>
      <el-button type="primary" v-if="membersIsShow && membersList && membersList.length > 0" @click="getMembers" style="margin-top: 6px">查看家庭成员</el-button>
    </div>
    <el-drawer :visible.sync="drawerShowMembers" size="37%" :withHeader="false" direction="rtl">
      <members-dialog :membersList="membersList" v-if="drawerShowMembers" :personalInfos="personalInfos" @close="drawerShowMembers = false"></members-dialog>
    </el-drawer>
    <el-drawer :visible.sync="drawerShow" size="61.8%" :withHeader="false" direction="rtl">
      <personalArchInfo v-if="drawerShow" :personalInfos="personalInfos"></personalArchInfo>
    </el-drawer>
  </div>
</template>
<script>
import personalArchInfo from "@/views/healthRecord/components/personalArchInfo.vue";
import membersDialog from "@/views/healthRecord/components/membersDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "headerCom",
  components: { personalArchInfo, membersDialog },
  props: {
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
    membersList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      drawerShowMembers: false,
      drawerShow: false,
      archStatusObj: {
        1: "正常",
        2: "注销",
      },
    };
  },
  computed: {
    ...mapGetters({
      indexViewData: "base/indexViewData",
      personalNamePrivacy: "base/personalNamePrivacy",
      personalIdPrivacy: "base/personalIdPrivacy",
      personalTelPrivacy: "base/personalTelPrivacy",
      personalAddPrivacy: "base/personalAddPrivacy",
    }),
    persionInfoIsShow() {
      let flag = false;
      let arr = this.indexViewData.childTreeDto || [];
      flag = arr.find((item) => {
        return item.deptName === "个人档案" && item.status == "1";
      });
      return flag;
    },
    membersIsShow() {
      let flag = false;
      let arr = this.indexViewData.childTreeDto || [];
      flag = arr.find((item) => {
        return item.deptName === "家庭档案" && item.status == "1";
      });
      return flag;
    },
    personalArchInfo() {
      let data = this.personalInfos.personalArchiveInfo || {};
      let birthday =
        data.birthday && data.birthday.indexOf(" ") > -1
          ? data.birthday.split(" ")[0]
          : data.birthday || "--";
      // let certId =
      //   data.certType == "1"
      //     ? data.certId.replace(/^(.{4})(?:\w+)(.{10})$/, "$1****$2")
      //     : data.certId;
      let certId =
        data.certType == "1"
          ? this.personalIdPrivacy(data.certId)
          : data.certId;
      let addr = this.personalAddPrivacy(
        data.liveProvince,
        data.liveCity,
        data.liveCounty,
        data.liveTownship,
        data.liveResidentCommittee,
        data.liveVillage,
        data.liveRoadNo,
        data.liveBuildingNo,
        data.liveDoorNo,
        data.liveAddr
      );
      return {
        ...data,
        birthday,
        // gender,
        // certType,
        certId,
        addr,
      };
    },
    personalArchiveMainInfo() {
      let data = this.personalInfos.personalArchiveMainInfo || {};
      let archStatus = data.archStatus
        ? this.archStatusObj[data.archStatus]
        : "--";
      let chronicDiseasesName =
        data.chronicDiseasesName && data.chronicDiseasesName.indexOf(";") > -1
          ? data.chronicDiseasesName.split(";")
          : data.chronicDiseasesName
          ? [data.chronicDiseasesName]
          : [];
      return {
        ...data,
        archStatus,
        chronicDiseasesName,
      };
    },
  },
  methods: {
    getHealthRecord() {
      this.drawerShow = true;
    },
    getMembers() {
      this.drawerShowMembers = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.headerCom-cont {
  border-radius: 4px;
  background-color: rgba(68, 107, 189, 100);
  color: rgba(16, 16, 16, 100);
  font-size: 14px;
  font-family: Roboto;
  // height: calc(100% - 30px);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  .info-first {
    display: flex;
    width: calc(100% - 120px);
  }
  .headPortrait {
    width: 60px;
    height: 60px;
    border-radius: 100px;
    background-color: #fff;
  }
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 18px;
    overflow: hidden;
    .info-item {
      color: rgba(255, 255, 255, 100);
      font-size: 16px;
      text-align: left;
      font-family: SourceHanSansSC-regular;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      .info-item-name {
        font-size: 20px;
        margin-right: 15px;
      }
      .info-item-gender {
        margin-right: 10px;
      }
      .chronicDisease {
        margin-right: 10px;
        padding: 2px 6px;
        height: 24px;
        border-radius: 3px;
        color: rgba(255, 255, 255, 100);
        font-size: 14px;
        text-align: center;
        font-family: Microsoft Yahei;
        border: 1px solid rgba(255, 255, 255, 100);
      }
    }
    .info-top {
      height: 33px;
      margin-bottom: 10px;
    }
  }

  .info-last {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }
}
</style>