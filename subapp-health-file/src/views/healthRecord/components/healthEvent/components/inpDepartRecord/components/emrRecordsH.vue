<template>
  <div class="emrRecordsH">
    <div class="emr-left">
      <div
        class="detail-cont"
        :class="{ actitvity: index === currentIndex }"
        v-for="(item, index) in recordData"
        :key="index"
        @click="itemClick(item, index)"
      >
        <div class="icon-cont">
          <IconSvg
            :iconClass="item.iconClass"
            class="iconCLs"
            width="12"
            height="12"
          ></IconSvg>
        </div>
        {{ item.label }}
      </div>
    </div>
    <el-card class="emr-right">
      <component
        :is="currentData.component"
        :navBarObj="navBarObj"
        :residentNotes="residentNotes"
      ></component>
    </el-card>
  </div>
</template>

<script>
import residentNote from "./residentNote.vue";
import progressNote from "./progressNote.vue";
import salvageNote from "./salvageNote.vue";
import dieNote from "./dieNote.vue";
import dischargeNote from "./dischargeNote.vue";
import bloodTransNote from "./bloodTransNote.vue";
import operateNote from "./operateNote.vue";
import nursingNote from "./nursingNote.vue";

import { getIpInHosRecord } from "@/api/modules/healthEvent/index.js";

export default {
  name: "emrRecordsH",
  props: {
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    residentNote,
    progressNote,
    salvageNote,
    dieNote,
    dischargeNote,
    bloodTransNote,
    operateNote,
    nursingNote,
  },
  data() {
    return {
      recordData: [
        {
          label: "入院记录",
          iconClass: "inBed",
          component: "residentNote",
        },
        {
          label: "病程记录",
          iconClass: "bingcheng",
          component: "progressNote",
        },
        {
          label: "手术记录",
          iconClass: "shoushu",
          component: "operateNote",
        },
        {
          label: "输血记录",
          iconClass: "shuxue",
          component: "bloodTransNote",
        },
        {
          label: "抢救记录",
          iconClass: "qiangjiu",
          component: "salvageNote",
        },
        {
          label: "护理操作记录",
          iconClass: "hulipinggu",
          component: "nursingNote",
        },
        {
          label: "死亡记录",
          iconClass: "died",
          component: "dieNote",
        },
        {
          label: "出院小结",
          iconClass: "outHospital",
          component: "dischargeNote",
        },
      ],
      currentIndex: -1,
      currentData: {
        component: null,
      },
      residentNotes: null,
      pAId: "",
    };
  },
  watch: {
    navBarObj: {
      handler(val) {
        this.residentNotes = null;
        this.pAId = this.$route.query?.pAId;
        this.getLeftList();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.itemClick(this.recordData[0], 0);
  },
  methods: {
    itemClick(item, index) {
      this.currentIndex = index;
      this.currentData = { ...item };
    },
    // 获取入院记录
    async getLeftList() {
      try {
        let params = {
          serialNumber: this.navBarObj.serialNumber,
          hosCode: this.navBarObj.hosCode,
          pAId: this.pAId,
        };
        let { code, result } = await getIpInHosRecord(params);
        if (code === 0) {
          console.log("入院记录查询：", result);
          // this.residentNotes = result;
          let allergenRecordList = result.allergenRecordList || [];
          let allergenRecordStr = allergenRecordList.map((item) => {
            return item.allergenSourceName;
          });
          this.residentNotes = {
            ...result,
            ipFirstProgressNotes: {
              ...result.ipFirstProgressNotes,
              hzjwsxs: result.hzjwsxs,
              allergenRecordList: allergenRecordStr.join(","),
            },
          };
        }
      } catch (error) {
      } finally {
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.emrRecordsH {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  .emr-left {
    width: 210px;
    .detail-cont {
      height: 38px;
      padding-left: 8px;
      line-height: 38px;
      border-radius: 2px;
      background-color: rgba(247, 247, 247, 100);
      color: rgba(16, 16, 16, 100);
      font-size: 14px;
      font-family: Roboto;
      border: 1px solid rgba(233, 233, 233, 100);
      border-bottom: 1px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      .icon-cont {
        width: 18px;
        height: 18px;
        margin-right: 7px;
        border-radius: 9px;
        border: 1px solid rgba(229, 229, 229, 100);
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconCLs {
          color: #e5e5e5;
        }
      }
    }
    .detail-cont:last-child {
      border-bottom: 1px solid rgba(233, 233, 233, 100);
    }
    .detail-cont.actitvity {
      background-color: rgba(255, 255, 255, 100);
      color: rgba(16, 16, 16, 100);
      border: 1px solid rgba(149, 177, 240, 100);
      .icon-cont {
        border: 1px solid #c7d2eb;
        background-color: transparent;
        .iconCLs {
          color: #446abd;
        }
      }
    }
  }
  .emr-right {
    width: calc(100% - 220px);
    margin-left: 10px;
    padding: 8px 0;
    background-color: #fff;
    color: rgba(16, 16, 16, 100);
    overflow-y: auto;

    .empty-cont {
      overflow: hidden;
      width: calc(100% - 2px);
      height: calc(100% - 42px);
      border: 1px solid #f7f7f7;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .emptyText {
        color: #88898e;
        font-size: 14px;
        font-family: SourceHanSansSC-regular;
      }
    }
  }
}
</style>