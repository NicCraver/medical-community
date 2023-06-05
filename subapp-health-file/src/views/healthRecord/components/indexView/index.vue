<template>
  <div class="indexView height100">
    <lifecycle
      :personalArchiveInfo="personalInfos.personalArchiveInfo"
      v-if="lifecycleShow"
    ></lifecycle>

    <el-row
      :gutter="10"
      :style="{
        height:
          proEnv === 'heilongjiang'
            ? lifecycleShow
              ? 'calc(50% - 35px)'
              : 'calc(100% - 5px)'
            : auto,
      }"
    >
      <el-col
        :span="18"
        :class="{
          'row-block': true,
          'row-blockH': proEnv === 'heilongjiang',
        }"
      >
        <div class="block">
          <basic-info :personalInfos="personalInfos"></basic-info>
        </div>
      </el-col>
      <el-col
        :span="6"
        :class="{
          'row-block': true,
          'row-blockH': proEnv === 'heilongjiang',
        }"
      >
        <div class="block">
          <recent-visit
            title-name="近期就诊"
            :pAId="personalInfos.personalArchiveInfo.pAId"
            type="visit"
            color="94, 132, 215"
            :showNum="3"
          ></recent-visit>
        </div>
      </el-col>
    </el-row>
    <template v-if="proEnv === 'heilongjiang'">
      <el-row
        :gutter="10"
        style="margin-top: 10px"
        class="row-bottom"
        :style="{
          height: lifecycleShow ? 'calc(50% - 35px)' : 'calc(100% - 5px)',
        }"
      >
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-check
              title-name="近期用药"
              type="recipes"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              :showNum="showNum"
            ></recent-check>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-check
              title-name="近期检查"
              type="checks"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              :showNum="showNum"
            ></recent-check>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-check
              title-name="近期检验"
              type="assays"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              :showNum="showNum"
            ></recent-check>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-visit
              title-name="近期手术"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              type="operation"
              color="94, 132, 215"
              :showNum="3"
            ></recent-visit>
          </div>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-col :span="18" class="row-block">
          <div class="block">
            <chronicDiseIndicator
              :personalInfos="personalInfos"
            ></chronicDiseIndicator>
          </div>
        </el-col>
        <el-col :span="6"  class="row-block">
          <div class="block block-bottom">
            <recent-visit
              title-name="近期手术"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              type="operation"
              color="94, 132, 215"
              :showNum="3"
            ></recent-visit>
          </div>
        </el-col>
      </el-row>
      <el-row
        :gutter="10"
        class="row-bottom"
        :style="{
          height: lifecycleShow ? 'calc(100% - 550px)' : 'calc(100% - 480px)',
        }"
      >
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-check
              title-name="近期用药"
              type="recipes"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              :showNum="showNum"
            ></recent-check>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-check
              title-name="近期检查"
              type="checks"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              :showNum="showNum"
            ></recent-check>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-check
              title-name="近期检验"
              type="assays"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              :showNum="showNum"
            ></recent-check>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="block block-bottom">
            <recent-visit
              title-name="近期体检"
              :pAId="personalInfos.personalArchiveInfo.pAId"
              type="MedicalExamRecord"
              color="94, 132, 215"
              :showNum="showNum"
            ></recent-visit>
          </div>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import basicInfo from "./components/basicInformation";
import recentCheck from "./components/recentCheck";
import chronicDiseIndicator from "./components/chronicDiseIndicator";
import lifecycle from "./components/lifecycle";
import recentVisit from "./components/recentVisit";

import { mapGetters } from "vuex";

export default {
  name: "indexView",
  components: {
    basicInfo,
    recentCheck,
    recentVisit,
    chronicDiseIndicator,
    lifecycle,
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
  data() {
    return {
      // 最下层的盒子高度
      blockBottomHeight: 0,
      // 最后一行展示项目个数
      showNum: 0,
    };
  },
  computed: {
    ...mapGetters({
      indexViewData: "base/indexViewData",
    }),
    lifecycleShow() {
      let flag = false;
      let arr = this.indexViewData.childTreeDto || [];
      flag = arr.find((item) => {
        return item.deptName === "生命周期" && item.status == "1";
      });
      return flag;
    },
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  watch: {
    personalInfos: {
      handler(val) {},
      deep: true,
      immediate: true,
    },
    blockBottomHeight: {
      handler(val) {
        let num = Math.floor(val / 57);
        console.log("元素高度：", val, num);
        this.showNum = num;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.getBottomHeight();
    window.addEventListener("resize", () => {
      this.getBottomHeight();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {});
  },
  methods: {
    // 获取最下面盒子高度，并且计算
    getBottomHeight() {
      this.$nextTick(() => {
        let blockBottomDom = document.getElementsByClassName("block-bottom");
        if (!blockBottomDom || !blockBottomDom.length) {
          return;
        }
        let rContDom = blockBottomDom[0].getElementsByClassName("r-cont");
        if (!rContDom || !rContDom.length) {
          return;
        }
        let height = rContDom[0];
        this.blockBottomHeight = Number(height.offsetHeight || 0);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.indexView {
  .block {
    // height: 200px;
    height: calc(100% - 30px);
    background: #fff;
    box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 14px;
    color: rgb(68, 107, 189);
    padding: 15px 0;
    overflow: hidden;
  }
  .row-block {
    height: 230px;
  }
  .row-blockH {
    height: 100%;
  }
  .row-bottom {
    margin-top: 10px;
    .el-col {
      height: 100%;
      .block-bottom {
        height: calc(100% - 30px);
      }
    }
  }
}
</style>
