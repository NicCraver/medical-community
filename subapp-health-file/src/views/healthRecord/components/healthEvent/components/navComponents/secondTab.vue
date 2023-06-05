<template>
  <div class="secondTab height100">
    <div class="tab-cont">
      <div class="second-top">
        <el-row :gutter="10">
          <el-col
            :span="item.span"
            v-for="(item, index) in secondTypeList"
            :key="index"
          >
            <div
              class="second-top-item"
              :class="{
                activity: secondIndex === index,
                disableCls: item.disabled,
              }"
            >
              <el-button
                type="text"
                :disabled="item.disabled"
                @click="secondTopClick(item, index)"
                class="top-btn"
                >{{ item.label }}</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="second-search">
        <el-input
          :placeholder="`请输入${
            secondIndex >= 0
              ? secondTypeList[secondIndex].keyWords || ''
              : '关键字'
          }`"
          v-model="secondSearchValue"
          style="height: 40px"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <i slot="suffix">
            <span @click="secondSearch" class="second-search-button">搜索</span>
          </i>
        </el-input>
      </div>
      <div class="itemCommonCls">
        <itemCommon
          v-if="
            secondIndex > -1 && secondTypeList[secondIndex].type !== 'pharmacy'
          "
          ref="itemCommon"
          :currentSecondType="secondTypeList[secondIndex] || {}"
          :secondData="secondData"
          :secondDisabled="secondDisabled"
          @secondLoadMore="secondLoadMore"
          @loadEventFuc="loadEventFuc"
          v-loading="loading"
        ></itemCommon>
        <!-- 用药组件 -->
        <div
          class="height100"
          v-if="
            secondIndex > -1 && secondTypeList[secondIndex].type === 'pharmacy'
          "
        >
          <el-radio-group
            v-model="radio"
            class="typeRadio"
            @change="radioChange"
          >
            <el-radio :label="1">近期用药</el-radio>
            <el-radio :label="2">疾病用药</el-radio>
          </el-radio-group>
          <div class="itemMedicine-cont">
            <itemMedicine
              ref="itemMedicine"
              :currentSecondType="secondTypeList[secondIndex] || {}"
              :secondData="secondData"
              :secondDisabled="secondDisabled"
              @secondLoadMore="secondLoadMore"
              @loadEventFuc="loadEventFuc"
              v-loading="loading"
            ></itemMedicine>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getVisitRecords,
  queryAdviceGroupByDiag,
  queryAdviceGroupByTreat,
  queryLisReport,
  queryRisExamRecord,
  referralListQuery,
  getHealthEventTypeCount,
} from "@/api/modules/healthEvent/index.js";
import itemCommon from "./itemCommon.vue";
import itemMedicine from "./itemMedicine.vue";

import { mapGetters, mapActions } from "vuex";
import { deepClone } from "@/utils/utils.js";

let secondTypeList = [
  {
    type: "O",
    label: "门诊病历",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "门诊",
    code: "M20301",
    logo: "menzhenbingli",
    keyWords: "诊断关键字",
    disabled: true,
    component: "treatmentRecord",
  },
  {
    type: "I",
    label:
      window.g.VUE_APP_ENVIRONMENT === "heilongjiang"
        ? "病案首页管理"
        : "住院病案",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "住院",
    code: "M20302",
    logo: "zhuyuanbingan",
    keyWords: "诊断关键字",
    disabled: true,
    component: "medRecordIndex",
  },
  {
    type: "E",
    label: "体检",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "体检",
    code: "M20303",
    logo: "tijianbiao",
    disabled: true,
    keyWords: "体检类型关键字",
    component: "healthExam",
  },
  {
    type: "tranTreat",
    label: "转诊",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "转诊",
    code: "M20304",
    logo: "sxzhuanzhen",
    disabled: true,
    keyWords: "医疗机构名称",
    component: "tranTreat",
  },
  {
    type: "pharmacy",
    label: "用药",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "用药",
    code: "M20305",
    logo: "empty-box",
    disabled: true,
    keyWords: "药品名称关键字",
    component: "pharmacy",
  },
  {
    type: "L",
    label: "检验",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "检验",
    code: "M20307",
    logo: "jianyan",
    disabled: true,
    keyWords: "检验项目",
    component: "assaysRecord",
  },
  {
    type: "R",
    label: "检查",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "检查",
    code: "M20306",
    logo: "jianchaxiangmu",
    disabled: true,
    keyWords: "检查项目",
    component: "checkRecord",
  },
  {
    type: "S",
    label: "手术",
    span: window.g.VUE_APP_ENVIRONMENT === "heilongjiang" ? 8 : 6,
    labelFlag: "手术",
    code: "M20308",
    logo: "shoushudao",
    disabled: true,
    keyWords: "手术名称关键字",
    component: "operateRecord",
  },
];

export default {
  name: "secondTab",
  components: { itemCommon, itemMedicine },
  props: {},
  data() {
    return {
      radio: 1,
      secondSearchValue: "",
      secondTypeList: [],
      typeCount: {},
      secondIndex: -1,
      secondPageParams: {
        pageNum: 1,
        pageSize: 20,
        start: 0,
        end: 0,
        total: 0,
      },
      // 导航数据
      secondData: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      personalArchInfo: "base/personalArchInfo",
      hygieneRecordData: "base/hygieneRecordData",
      jumpToData: "base/jumpToData",
    }),
    // 下拉列表禁止加载
    secondDisabled() {
      if (this.secondIndex <= 0) {
        return true;
      }
      if (this.secondTypeList[this.secondIndex].type === "pharmacy") {
        return this.secondPageParams.end >= this.secondPageParams.total;
      }
      return (
        this.secondPageParams.pageNum >=
        Math.ceil(this.secondPageParams.total / this.secondPageParams.pageSize)
      );
    },
    certId() {
      let archiveInfo = this.personalArchInfo || {};
      let certId = archiveInfo.personalArchiveInfo
        ? archiveInfo.personalArchiveInfo.certId || ""
        : "";
      return certId;
    },
    certType() {
      let archiveInfo = this.personalArchInfo || {};
      let certType = archiveInfo.personalArchiveInfo
        ? archiveInfo.personalArchiveInfo.certType || ""
        : "";
      return certType;
    },
  },
  watch: {
    certId: {
      handler(val, old) {
        if (val && old) {
          this.typeCount = {};
          this.secondData = [];
          this.getTabDisabled(() => {
            this.handleTabDisabled();
            this.getFType();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    // 配置信息
    hygieneRecordData: {
      handler(val) {
        this.typeCount = {};
        this.secondData = [];
        this.secondIndex = -1;
        if (val.hasOwnProperty("childTreeDto") && val.childTreeDto.length) {
          this.getTabList();
          // this.typeClickHandle();
          this.getTabDisabled(() => {
            this.handleTabDisabled();
            this.typeClickHandle();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      setJumpToData: "base/setJumpToData",
    }),
    // 首页的跳转--定位类型
    typeClickHandle() {
      if (this.jumpToData.firstLevelName) {
        let index = -1;
        for (let i in this.secondTypeList) {
          if (
            this.secondTypeList[i].type == this.jumpToData.healthEventItem.type
          ) {
            index = Number(i);
            break;
          }
        }
        if (index > -1) {
          this.secondTopClick(this.secondTypeList[index], index);
          return;
        }
        this.getFType();
      }
      this.getFType();
    },
    // 查找导航栏上第一个有数据的类型
    getFType() {
      let index = this.secondIndex == -1 ? 0 : this.secondIndex;
      if (!this.secondTypeList[index].disabled) {
        this.secondTopClick(this.secondTypeList[index], index);
        return;
      }
      index = -1;
      for (let i in this.secondTypeList) {
        if (!this.secondTypeList[i].disabled) {
          index = Number(i);
          break;
        }
      }
      this.secondTopClick(this.secondTypeList[index], index);
    },
    // 点击导航栏上面的类型
    secondTopClick(item, index) {
      if (this.loading) {
        return;
      }
      this.$emit("loadEventFuc", {
        item: {
          activeName: "second",
          type: "",
        },
        index,
      });
      if (this.secondIndex != index) {
        this.secondSearchValue = "";
      }
      this.secondIndex = index;
      if (index < 0) {
        return;
      }
      this.secondPageParams.pageNum = 1;
      this.secondPageParams.start = 0;
      this.secondPageParams.total = 0;
      this.secondData = [];
      this.getSecondData();
    },
    // 搜索
    secondSearch() {
      if (this.secondIndex < 0 || this.loading) {
        return;
      }

      this.secondPageParams.pageNum = 1;
      this.secondPageParams.start = 0;
      this.secondPageParams.total = 0;
      this.secondData = [];
      this.getSecondData();
    },
    // 获取卫生服务活动导航数据
    getSecondData() {
      let type = this.secondTypeList[this.secondIndex].type;
      let list = ["I", "O", "E", "S", "L", "R"];
      if (list.indexOf(type) > -1) {
        this.getSecondDataFuc();
        return;
      } else if (type === "pharmacy") {
        this.getRecentAdvice();
        return;
      } /*  else if (type === "assaysRecord") {
        this.getLisReport();
        return;
      } else if (type === "checkRecord") {
        this.getCheckRecord();
        return;
      } */ else if (type === "tranTreat") {
        this.getTranTreatRecord();
        return;
      }
    },
    // 门诊、住院、体检、手术
    async getSecondDataFuc() {
      this.loading = true;
      try {
        let { code, result, desc } = await getVisitRecords({
          pAId: this.$route.params.pAId,
          pageNum: this.secondPageParams.pageNum,
          pageSize: this.secondPageParams.pageSize,
          type: this.secondTypeList[this.secondIndex].type,
          keyword: this.secondSearchValue,
        });
        if (code === 0) {
          console.log("second导航栏数据", result);
          this.secondPageParams.total = result.total;
          if (this.secondPageParams.pageNum == 1) {
            this.secondData = [];
          }
          this.secondData = this.handleSecondData1(
            this.secondData.concat(result.records)
          );
          if (this.secondPageParams.pageNum == 1) {
            this.jumpToFuc("itemCommon");
            /* this.$nextTick(() => {
              this.$refs.itemCommon.secondItemClick(this.secondData[0], 0);
            }); */
          }
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 处理门诊、住院、体检、手术数据
    handleSecondData1(data) {
      let arr = [];
      data.forEach((item, index) => {
        arr.push({
          ...item,
          organizationName:
            (item.hospitalName || "--") + "-" + (item.departmentName || "--"),
        });
      });
      return arr;
    },
    // 转诊
    async getTranTreatRecord() {
      this.loading = true;
      try {
        let params = {
          certId: this.certId,
          certType: this.certType,
          hospitalName: this.secondSearchValue,
          pageNum: this.secondPageParams.pageNum,
          pageSize: this.secondPageParams.pageSize,
        };
        let { code, result, desc } = await referralListQuery(params);
        if (code === 0) {
          console.log("second导航栏数据--转诊", result);
          this.secondPageParams.total = result.total;
          if (this.secondPageParams.pageNum == 1) {
            this.secondData = [];
          }
          this.secondData = this.handleTranTreatRecord(
            this.secondData.concat(result.records)
          );
          if (this.secondPageParams.pageNum == 1) {
            this.jumpToFuc("itemCommon");
            /* this.$nextTick(() => {
              this.$refs.itemCommon.secondItemClick(this.secondData[0], 0);
            }); */
          }
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 处理转诊数据
    handleTranTreatRecord(data) {
      let arr = [];
      let objTrans = {
        1: "上转记录",
        2: "下转记录",
      };
      data.forEach((item, index) => {
        let itemDate =
          item.turnOutTime && item.turnOutTime.indexOf(" ") > -1
            ? item.turnOutTime.split(" ")[0]
            : "";
        arr.push({
          ...item,
          itemName: objTrans[item.referralType] || "",
          organizationName: `<div class="overflow-point" title="${
            item.fromHospitalName || "--"
          } -> ${item.toHospitalName || "--"}">${
            item.fromHospitalName || "--"
          } <i class="el-icon-right"></i> ${item.toHospitalName || "--"}</div>`,
          itemDate,
          serialNumber: item.treatmentId,
          hosCode: item.toHospitalId || "",
        });
      });
      return arr;
    },
    radioChange() {
      this.secondPageParams.start = 0;
      this.secondPageParams.end = 0;
      this.secondPageParams.total = 0;
      this.secondData = [];
      this.getRecentAdvice();
    },
    // 用药
    async getRecentAdvice() {
      this.loading = true;
      try {
        let params = {};
        let res;
        if (this.radio == 1) {
          params = {
            certId: this.certId,
            certType: this.certType,
            searchKey: this.secondSearchValue,
            start: this.secondPageParams.start,
            pageSize: this.secondPageParams.pageSize,
          };
          res = await queryAdviceGroupByTreat(params);
        } else if (this.radio == 2) {
          params = {
            certId: this.certId,
            certType: this.certType,
            searchKey: this.secondSearchValue,
            start: this.secondPageParams.start,
            pageSize: this.secondPageParams.pageSize,
          };
          res = await queryAdviceGroupByDiag(params);
        }
        if (res.code === 0) {
          console.log("second导航栏数据---用药", res.result);
          this.secondPageParams.total = res.result.total;
          this.secondPageParams.end = res.result.end;
          if (this.secondPageParams.start == 0) {
            this.secondData = [];
          }
          let groups = res.result.groups.map((item) => {
            let itemCodeList = item.items.map((val) => {
              return val.itemCode;
            });
            return {
              ...item,
              serialNumber: itemCodeList || [], //用于首页跳转的字段，药itemCode的集合
            };
          });
          this.secondData = this.secondData.concat(groups || []);
          if (this.secondPageParams.start == 0) {
            this.jumpToFuc("itemMedicine");
            /* this.$nextTick(() => {
              this.$refs.itemMedicine.secondItemClick(this.secondData[0], 0);
            }); */
          }
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 检验
    async getLisReport() {
      try {
        let params = {
          certId: this.certId,
          certType: this.certType,
          searchKey: this.secondSearchValue,
          pageNum: this.secondPageParams.pageNum,
          pageSize: this.secondPageParams.pageSize,
        };
        let { code, result, desc } = await queryLisReport(params);
        if (code === 0) {
          console.log("second导航栏数据--检验", result);
          this.secondPageParams.total = result.total;
          if (this.secondPageParams.pageNum == 1) {
            this.secondData = [];
          }
          this.secondData = this.handleLisReport(
            this.secondData.concat(result.records)
          );
          if (this.secondPageParams.pageNum == 1) {
            this.jumpToFuc("itemCommon");
            /* this.$nextTick(() => {
              this.$refs.itemCommon.secondItemClick(this.secondData[0], 0);
            }); */
          }
        }
      } catch (error) {}
    },
    // 处理检验数据
    handleLisReport(data) {
      let arr = [];
      data.forEach((item, index) => {
        arr.push({
          ...item,
          itemName: item.reportTitle || "",
          organizationName: item.execDeptName || "",
          itemDate: item.reportTime || "",
        });
      });
      return arr;
    },
    // 检查
    async getCheckRecord() {
      try {
        let params = {
          certId: this.certId,
          certType: this.certType,
          searchKey: this.secondSearchValue,
          pageNum: this.secondPageParams.pageNum,
          pageSize: this.secondPageParams.pageSize,
        };
        let { code, result, desc } = await queryRisExamRecord(params);
        if (code === 0) {
          console.log("second导航栏数据--检查", result);
          this.secondPageParams.total = result.total;
          if (this.secondPageParams.pageNum == 1) {
            this.secondData = [];
          }
          this.secondData = this.handleCheckRecord(
            this.secondData.concat(result.records)
          );
          if (this.secondPageParams.pageNum == 1) {
            this.jumpToFuc("itemCommon");
            /* this.$nextTick(() => {
              this.$refs.itemCommon.secondItemClick(this.secondData[0], 0);
            }); */
          }
        }
      } catch (error) {}
    },
    // 处理检查数据
    handleCheckRecord(data) {
      let arr = [];
      data.forEach((item, index) => {
        arr.push({
          ...item,
          itemName: item.itemName || "",
          organizationName: item.execDeptName || "",
          itemDate: item.reportTime || "",
          risItemCode: item.itemCode || "",
        });
      });
      return arr;
    },
    // 下拉加载事件
    secondLoadMore() {
      if (this.secondDisabled) {
        return;
      }
      let type = this.secondTypeList[this.secondIndex].type;
      if (type === "pharmacy") {
        this.secondPageParams.start = this.secondPageParams.end;
      } else {
        this.secondPageParams.pageNum++;
      }
      this.getSecondData();
    },
    loadEventFuc(data) {
      this.$emit("loadEventFuc", {
        ...data,
      });
    },
    // 获取tab配置
    getTabList() {
      let hygieneRecordData = this.hygieneRecordData.childTreeDto || [];
      let arr = [];
      for (let i in secondTypeList) {
        for (let j in hygieneRecordData) {
          // debugger
          if (
            secondTypeList[i].code == hygieneRecordData[j].deptCode &&
            hygieneRecordData[j].status == "1"
          ) {
            arr.push(deepClone(secondTypeList[i]));
          }
        }
      }
      this.secondTypeList = arr;
    },
    // 查询头部方块是否有数据
    async getTabDisabled(fn) {
      try {
        let res = await getHealthEventTypeCount({
          fAId: this.$route.params.pAId || "",
        });
        if (res.code === 0) {
          console.log("查询头部方块是否有数据:", res);
          this.typeCount = res.result;
        }
      } catch (error) {
      } finally {
        fn && fn();
      }
    },
    // 处理头部方块是否可点
    handleTabDisabled() {
      if (!this.secondTypeList.length) {
        return;
      }
      this.secondTypeList.forEach((item) => {
        item.disabled = Number(this.typeCount[item.labelFlag] || 0) <= 0;
      });
    },
    // 精准跳转
    jumpToFuc(itemComName) {
      this.$nextTick(() => {
        let healthEventItem = this.jumpToData.healthEventItem;
        if (healthEventItem.flag === "list") {
          this.secondData.length &&
            this.$refs[itemComName].secondItemClick(this.secondData[0], 0);
        } else if (healthEventItem.flag === "item") {
          let index = 0;
          let itemFlag = healthEventItem.itemFlag || "itemName";
          for (let i in this.secondData) {
            // 用药的时候匹配：用药列表里面是否有跳转过来的药code
            let flag =
              healthEventItem.type === "pharmacy"
                ? this.secondData[i][itemFlag].indexOf(
                    healthEventItem.item[itemFlag]
                  ) > -1
                : this.secondData[i][itemFlag] ===
                  healthEventItem.item[itemFlag];
            if (flag) {
              index = Number(i);
              break;
            }
          }
          this.secondData.length &&
            this.$refs[itemComName].secondItemClick(
              this.secondData[index],
              index
            );
        } else {
          this.secondData.length &&
            this.$refs[itemComName].secondItemClick(this.secondData[0], 0);
        }
        this.setJumpToData({
          firstLevelName: "",
          healthEventName: "",
          healthEventItem: {},
        });
      });
    },
  },
  // 销毁定时器
  beforeDestroy() {},
};
</script>

<style lang="scss">
.secondTab {
  .tab-cont {
    height: 100%;
    position: relative;
    .second-top {
      padding-right: 10px;
      .second-top-item {
        margin-top: 10px;
        height: 28px;
        line-height: 28px;
        border-radius: 2px;
        background-color: #fff;
        border: 1px solid #5e84d7;
        font-size: 14px;
        text-align: center;
        font-family: Roboto;
        cursor: pointer;
        .top-btn {
          color: #5e84d7;
          padding: 0;
          width: 100%;
          height: 100%;
        }
        .top-btn.is-disabled {
          color: #c0c4cc;
        }
      }
      .activity {
        background-color: #5e84d7;
        .top-btn {
          color: #fff;
        }
      }
      .disableCls {
        background-color: #fff;
        border: 1px solid #c0c4cc;
      }
    }
    .second-search {
      margin: 10px 10px 0 0;
      .el-input__suffix-inner {
        display: flex;
        height: 100%;
        align-items: center;
      }
      input {
        height: 40px !important;
      }
      .second-search-button {
        padding: 2px 5px;
        height: 24px;
        line-height: 24px;
        border-radius: 16px;
        background-color: #f5f8ff;
        color: #5e84d7;
        font-size: 14px;
        text-align: center;
        font-family: Roboto;
        border: 1px solid #5e84d7;
        cursor: pointer;
      }
    }
    .itemCommonCls {
      height: calc(100% - 144px);
      .typeRadio {
        margin-top: 10px;
        height: 15px;
      }
      .itemMedicine-cont {
        height: calc(100% - 35px);
      }
    }
  }
  .emptyBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .emptyText {
      color: #88898e;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
    }
  }
}
</style>
