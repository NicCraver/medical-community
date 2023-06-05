<template>
  <div class="bloodTransRecord" v-loading="loading">
    <template v-if="bloodTransRecordData && bloodTransRecordData.length">
      <div class="button-cont">
        <span
          class="button"
          v-for="(item, index) in bloodTransRecordData"
          :key="index"
          :class="{ activity: currentIndex === index }"
          @click="itemClick(item, index)"
          >第{{ indexC(index) }}次</span
        >
      </div>
      <el-row :gutter="10" class="row-class">
        <el-col
          v-for="(item, index) in list.list1"
          :key="index"
          :span="item.span"
        >
          <div class="list-item overflow-point">
            {{ item.label }}：
            <span class="item-detail" :title="showValue(item)">
              {{ showValue(item) }}
            </span>
          </div>
        </el-col>
      </el-row>
      <div class="table-cont">
        <el-table :data="currentData.details" border>
          <el-table-column
            v-for="(item, index) in list.tableColums"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :min-width="item.width"
          >
          </el-table-column>
        </el-table>
      </div>
      <el-row :gutter="10" class="row-class">
        <el-col
          v-for="(item, index) in list.list2"
          :key="index"
          :span="item.span"
        >
          <div class="list-item overflow-point">
            {{ item.label }}：<span
              class="item-detail"
              :title="showValue(item)"
            >
              {{ showValue(item) }}
            </span>
          </div>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <div class="emptyBox">
        <IconSvg
          iconClass="empty-box"
          style="color: #cacdd4"
          width="80"
          height="80"
        ></IconSvg>
        <div class="emptyText">暂无数据</div>
      </div>
    </template>
  </div>
</template>

<script>
import { bloodTransfusionsByInp } from "@/api/modules/healthEvent/index.js";
import { intToChinese } from "@/utils/utils.js";
import { mapGetters } from "vuex";

export default {
  name: "bloodTransRecord",
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
    // 跳转过来的数据
    inDepartGoLinkData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      list: {
        list1: [
          {
            label: "疾病诊断",
            val: "diagnosis",
            span: 16,
          },
          {
            label: "输血史",
            val: "transfusionHistory",
            span: 8,
            transObj: {
              1: "有",
              2: "无",
              3: "未标明",
            },
          },
          {
            label: "输血日期",
            val: "transfusionDate",
            span: 8,
          },
          {
            label: "输入血型代码",
            val: "transfusionBloodType",
            span: 8,
          },
          {
            label: "患者血型",
            val: "patientBloodType",
            span: 8,
          },
          {
            label: "输血性质",
            val: "transfusionBloodNature",
            span: 8,
          },
          {
            label: "累计输血次数",
            val: "transfusionTotal",
            units: "次",
            span: 8,
          },
        ],
        list2: [
          {
            label: "输血反应",
            val: "transfusionReaction",
            span: 8,
          },
          {
            label: "输血反应类型",
            val: "transfusionReactionType",
            span: 8,
          },
          /* {
            label: "手术体位",
            val: "operativePositionName",
            span: 8,
          }, */
          {
            label: "输血指征",
            val: "transfusionIndication",
            span: 24,
          },
          {
            label: "输血过程记录",
            val: "transfusionProcessRecord",
            span: 24,
          },
          {
            label: "输血医生",
            val: "transfusionDoctorName",
            tag: ["doctor"],
            span: 8,
          },
          {
            label: "签名时间",
            val: "signTime",
            span: 8,
          },
        ],
        tableColums: [
          {
            label: "输血成分",
            prop: "bloodConstituent",
            width: "180",
          },
          {
            label: "输血量",
            prop: "quantity",
            width: "100",
          },
          {
            label: "单位",
            prop: "unit",
            width: "100",
          },
        ],
      },
      totals: 0,
      bloodTransRecordData: [],
      currentData: { details: [] },
      currentIndex: -1,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      doctorNamePrivacy: "base/doctorNamePrivacy",
    }),
  },
  watch: {
    personalInfos: {
      handler(val) {},
      deep: true,
      immediate: true,
    },
    navBarObj: {
      handler(val) {
        this.bloodTransRecordData = [];
        this.currentData = { details: [] };
        this.currentIndex = -1;
        if (val.serialNumber && val.hosCode) {
          this.getRecord();
        }
      },
      deep: true,
      immediate: true,
    },
    bloodTransRecordData: {
      handler(val) {
        if (val.length) {
          let mzdbh =
            this.inDepartGoLinkData?.prop === "bloodTransRecord"
              ? this.inDepartGoLinkData?.data?.mzdbh || ""
              : "";
          let yljgdm =
            this.inDepartGoLinkData?.prop === "bloodTransRecord"
              ? this.inDepartGoLinkData?.data?.yljgdm || ""
              : "";
          this.itemClickFuc(mzdbh, yljgdm);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    // 获取输血记录
    async getRecord() {
      this.loading = true;
      try {
        let res = await bloodTransfusionsByInp({
          ZYJZLSH: this.navBarObj.serialNumber || "",
          hosCode: this.navBarObj.hosCode || "",
        });
        console.log("住院的输血记录数据", res.result);
        this.bloodTransRecordData = res.result;
        this.totals = res.total || 0;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    itemClickFuc(mzdbh, yljgdm) {
      let index = 0;
      for (let i in this.bloodTransRecordData) {
        if (
          this.bloodTransRecordData[i].mzdbh === mzdbh &&
          this.bloodTransRecordData[i].yljgdm === yljgdm
        ) {
          index = i;
          break;
        }
      }
      if (Number(this.currentIndex) === Number(index)) {
        return;
      }
      this.itemClick(this.bloodTransRecordData[index], index);
    },
    itemClick(item, index) {
      index = Number(index);
      this.$EventBus.$emit("inDepartGoLink", {});
      this.currentData = {
        ...item,
        details: item?.details || [],
      };
      this.currentIndex = index;
    },
    // 字段显示
    showValue(item) {
      // 累计输血次数
      if (item.val === "transfusionTotal") {
        return (this.totals || "-") + "次";
      }

      if (item.val === "signTime") {
        console.log("signTime", this.currentData[item.val]);
      }

      /*  if (!this.currentData.hasOwnProperty(item.val)) {
        return "--";
      } */

      let vals = this.currentData?.[item.val] || "--";

      if (
        item.val === "transfusionBloodType" ||
        item.val === "patientBloodType"
      ) {
        return vals + " " + (this.currentData?.patientRhBloodGroup || "");
      }

      if (item.val === "transfusionHistory") {
        return vals + (this.currentData?.jwsxs || "");
      }

      // 反显数据
      if (item.hasOwnProperty("transObj")) {
        vals = item.transObj[vals] || "--";
      }
      if (item.tag && item.tag.indexOf("doctor") > -1) {
        return `${
          this.doctorNamePrivacy(this.currentData?.[item.val]) || "--"
        }`;
      }
      let str = vals + (item.units || "");
      return str;
    },
    indexC(index) {
      return intToChinese(index + 1) || "";
    },
  },
};
</script>

<style lang="scss">
.bloodTransRecord {
  height: 100%;
  .button-cont {
    .button {
      height: 28px;
      line-height: 28px;
      border-radius: 16px;
      text-align: center;
      font-size: 14px;
      font-family: SourceHanSansSC-bold;
      margin-right: 5px;
      padding: 0 10px;
      display: inline-block;
      cursor: pointer;
      background-color: rgba(245, 248, 255, 100);
      color: rgba(87, 181, 170, 100);
      border: 1px dotted rgba(87, 181, 170, 100);
    }
    .activity {
      background-color: rgba(87, 181, 170, 100);
      color: rgba(250, 251, 255, 100);
      border: 1px solid rgba(87, 181, 170, 100);
    }
  }
  .row-class {
    width: 100%;
    margin-top: 10px;
  }
  .list-item {
    height: 34px;
    line-height: 34px;
    color: #919191;
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
    .item-detail {
      color: #333;
      cursor: pointer;
    }
  }
  .table-cont {
    margin-top: 10px;
    .el-table .el-table__cell {
      padding: 5px 0;
      min-height: 32px;
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
