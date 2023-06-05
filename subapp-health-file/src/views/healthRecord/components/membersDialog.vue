<template>
  <div class="page">
    <div class="largeTitleWrapper">家庭成员信息</div>
    <div v-if="membersList && membersList.length > 0" class="cardWrapper">
      <el-card
        class="box-card firstCard"
        v-for="(item, index) in membersListNew"
        :key="item.certId"
      >
        <span
          @click="toLink(item.pAId)"
          v-if="
            item.pAId &&
            item.pAId != $route.params.pAId &&
            item.archStatus === '1'
          "
          >查看健康档案</span
        >
        <i class="card-icon">{{ index + 1 }}</i>
        <el-row class="line">
          <el-col :span="11" :offset="1">
            <dispalyCell title="健康档案号：" :value="item.empi"></dispalyCell>
          </el-col>
          <el-col :span="11" :offset="1">
            <dispalyCell
              title="档案状态："
              :value="
                item.archStatus === '1'
                  ? '正常'
                  : item.archStatus === '2'
                  ? '注销'
                  : '--'
              "
            ></dispalyCell>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">
            <el-row class="name-line">
              <el-col :span="$route.query.pAId == item.pAId ? 12 : 24">
                <dispalyCell
                  title="姓名："
                  :value="personalNamePrivacy(item.name)"
                ></dispalyCell>
              </el-col>
              <el-col
                :span="11"
                :offset="1"
                v-if="$route.query.pAId == item.pAId"
              >
                <div class="currentP">当前就诊</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="11" :offset="1">
            <dispalyCell title="性别：" :value="item.gender"></dispalyCell>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">
            <dispalyCell title="年龄：" :value="item.age"></dispalyCell>
          </el-col>
          <el-col :span="11" :offset="1">
            <!-- <dispalyCell title="身份证号：" :value="item.certId.replace(/^(.{4})(?:\w+)(.{10})$/, '$1****$2')"></dispalyCell> -->
            <dispalyCell
              :title="`${item.certType || ''}`"
              titleCode="CV02.01.101"
              connectMark="："
              :value="item.certType === '1' ? personalIdPrivacy(item.certId) : item.certId"
            ></dispalyCell>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">
            <dispalyCell
              title="联系电话："
              :value="personalTelPrivacy(item.mobilePhoneNum)"
            ></dispalyCell>
          </el-col>
          <el-col :span="11" :offset="1">
            <dispalyCell
              title="文化程度："
              :value="item.eduLevel"
            ></dispalyCell>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" :offset="1">
            <dispalyCell title="职业：" :value="item.jobName"></dispalyCell>
          </el-col>
          <el-col :span="11" :offset="1">
            <dispalyCell title="婚姻：" :value="item.marital"></dispalyCell>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23" :offset="1">
            <dispalyCell
              title="与户主间关系："
              :value="item.hHRs"
            ></dispalyCell>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div v-else class="cardWrapper no-data">暂无数据</div>
  </div>
</template>

<script type="text/ecmascript-6">
import dispalyCell from "@/components/displayCell/dispalyCell";
import { mapGetters } from "vuex";

export default {
  name: "membersDialog",
  components: {
    dispalyCell,
  },
  props: {
    membersList: Array,
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      personalNamePrivacy: "base/personalNamePrivacy",
      personalIdPrivacy: "base/personalIdPrivacy",
      personalTelPrivacy: "base/personalTelPrivacy",
    }),
    membersListNew() {
      let arr1 = this.membersList.filter((item) => {
        return this.$route.query.pAId == item.pAId;
      });
      let arr2 = this.membersList.filter((item) => {
        return this.$route.query.pAId != item.pAId;
      });
      return arr1.concat(arr2);
    },
  },
  created() {},
  methods: {
    toLink(pAId) {
      this.$emit("close");
      let queryPAId = this.$route.query.pAId || "";
      this.$router.push({ path: `/Home/${pAId}`, query: { pAId: queryPAId } });
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  height: 100%;
}
::v-deep .el-card__body {
  padding: 6px 8px;
}
::v-deep .el-card {
  border-radius: 0;
  .el-message {
    border-radius: 0;
  }
}

.cardWrapper {
  padding-left: 11px;
  padding-top: 5px;
  height: calc(100% - 55px);
  overflow-y: auto;
}
.cardWrapper.no-data {
  line-height: 45;
  color: #999;
  text-align: center;
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
    padding: 20px 0 20px 0;
  }
  position: relative;
  span {
    position: absolute;
    right: 12px;
    bottom: 15px;
    color: rgba(41, 64, 221, 100);
    text-decoration: underline;
    cursor: pointer;
    z-index: 2;
    color: #446bbd;
  }
}

.box-card {
  margin: 12px 10px 12px 0;
  overflow: hidden;
  position: relative;
  .el-row {
    line-height: 29px;
  }
  .card-icon {
    position: absolute;
    top: 0;
    width: 28px;
    left: 0;
    height: 28px;
    background: #446abd;
    display: block;
    border-radius: 0 0 100% 0;
    text-align: center;
    line-height: 28px;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.name-line {
  display: flex;
  align-items: center;
}
.currentP {
  width: 60px;
  height: 20px;
  line-height: 20px;
  border-radius: 9px;
  background-color: rgba(87, 181, 170, 100);
  color: rgba(255, 255, 255, 100);
  font-size: 12px;
  text-align: center;
  font-family: Roboto;
}
</style>
