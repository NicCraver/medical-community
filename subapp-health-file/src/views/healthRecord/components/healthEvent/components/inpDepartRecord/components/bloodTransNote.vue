<template>
  <div class="bloodTransNote" v-loading="loading">
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
      <div class="title-name">输血信息</div>
      <el-row :gutter="10" class="row-class">
        <el-col v-for="(item, index) in list" :key="index" :span="item.span">
          <div class="table-cont" v-if="item.type === 'table'">
            <el-table :data="currentData.details" border>
              <el-table-column
                v-for="(item, index) in item.tableColums"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                :min-width="item.width"
              >
              </el-table-column>
            </el-table>
          </div>
          <div class="list-item overflow-point" v-else>
            {{ item.label }}：
            <span class="item-detail" :title="showValue(item)">
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
  name: "bloodTransNote",
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
  },
  data() {
    return {
      list: [
        {
          label: "疾病诊断",
          val: "diagnosis",
          span: 16,
        },
        {
          label: "输血史标识",
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
          tag: ["date"],
          span: 8,
        },
        {
          label: "输血ABO血型代码",
          val: "transfusionBloodType",
          span: 8,
        },
        {
          label: "输血Rh血型代码",
          val: "transfusionBloodType",
          span: 8,
        },
        {
          label: "输血性质",
          val: "transfusionBloodNature",
          span: 8,
        },
        {
          label: "患者ABO血型",
          val: "patientBloodType",
          span: 8,
        },
        {
          label: "患者Rh血型",
          val: "patientBloodType",
          span: 8,
        },
        {
          label: "累计输血次数",
          val: "transfusionTotal",
          units: "次",
          span: 8,
        },
        {
          type: "table",
          span: 24,
          tableColums: [
            {
              label: "输血品种代码",
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

        {
          label: "输血反应标志",
          val: "transfusionReaction",
          span: 8,
        },
        {
          label: "输血不良反应类型",
          val: "transfusionReactionType",
          span: 16,
        },
        {
          label: "输血原因",
          val: "",
          span: 24,
        },
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
          tag: ["date"],
          span: 8,
        },
      ],
      totals: 0,
      bloodTransRecordData: [{}],
      currentData: {},
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
    navBarObj: {
      handler(val) {
        this.bloodTransRecordData = [];
        this.currentData = {};
        this.currentIndex = -1;
        if (val.serialNumber && val.hosCode) {
          this.getRecord();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  // 销毁定时器
  beforeDestroy() {},
  destroyed() {},
  methods: {
    // 获取输血记录
    async getRecord() {
      this.loading = true;
      try {
        let res = await bloodTransfusionsByInp({
          ZYJZLSH: this.navBarObj.serialNumber || "",
          hosCode: this.navBarObj.hosCode || "",
        });
        if (res.code === 0) {
          console.log("输血记录数据", res.result);
          this.bloodTransRecordData = res.result;
          this.totals = res.total || 0;
          this.bloodTransRecordData.length &&
            this.itemClick(this.bloodTransRecordData[0], 0);
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    itemClick(item, index) {
      this.currentData = item;
      this.currentIndex = index;
    },
    // 字段显示
    showValue(item) {
      // 累计输血次数
      if (item.val === "transfusionTotal") {
        return this.totals;
      }

      if (!this.currentData.hasOwnProperty(item.val)) {
        return "--";
      }
      let vals = this.currentData[item.val] || "--";
      // 反显数据
      if (item.hasOwnProperty("transObj")) {
        vals = item.transObj[vals] || "--";
      }
      if (item.tag && item.tag.indexOf("doctor") > -1) {
        return `${this.doctorNamePrivacy(this.currentData[item.val]) || "--"}`;
      }
      if (item.tag && item.tag.indexOf("date") > -1) {
        let dateVal = this.currentData[item.val]
          ? this.dayjs(this.currentData[item.val]).format("YYYY-MM-DD HH:mm")
          : "--";
        return dateVal;
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
.bloodTransNote {
  height: 100%;
  .button-cont {
    padding: 0 10px;
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
  .title-name {
    height: 40px;
    margin-top: 13px;
    padding-left: 8px;
    line-height: 40px;
    background-color: rgba(247, 247, 247, 100);
    color: #333;
    font-weight: 600;
    font-size: 16px;
    font-family: SourceHanSansSC-medium;
  }
  .row-class {
    width: 100%;
    margin-top: 10px;
    padding: 0 10px;
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
