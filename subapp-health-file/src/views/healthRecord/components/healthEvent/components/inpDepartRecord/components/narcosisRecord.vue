<template>
  <div class="narcosisRecord" v-loading="loading">
    <template v-if="narcosisRecordData && narcosisRecordData.length">
      <div class="button-cont">
        <span
          class="button"
          v-for="(item, index) in narcosisRecordData"
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
          <div class="list-items">
            <div
              class="list-item overflow-point"
              v-if="currentData.hasOwnProperty(item.val)"
            >
              <!-- :style="{ width: item.linkText ? 'calc(100% - 100px)' : '100%' }" -->
              {{ item.label }}：
              <span class="item-detail" :title="showValue(item)">
                {{ showValue(item) }}
              </span>
              <span
                v-if="item.linkText && currentData[item.val]"
                class="goLink"
                @click="goLinkFuc(item)"
                ><IconSvg
                  iconClass="card-two"
                  style="color: #446bdd"
                  width="20"
                  height="20"
                ></IconSvg
                >{{ item.linkText }}</span
              >
            </div>
            <div class="list-item overflow-point" v-else>
              {{ item.label }}：--
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="table-cont">
        <el-table :data="currentData.ipEsthesiaDrugsList" border>
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
          <div class="list-items">
            <div
              class="list-item overflow-point"
              v-if="currentData.hasOwnProperty(item.val)"
            >
              <!-- :style="{ width: item.linkText ? 'calc(100% - 100px)' : '100%' }" -->
              {{ item.label }}：
              <span class="item-detail" :title="showValue(item)">
                {{ showValue(item) }}
              </span>
              <span
                v-if="item.linkText && currentData[item.val]"
                class="goLink"
                @click="goLinkFuc(item)"
              >
                <IconSvg
                  iconClass="card-two"
                  style="color: #446bdd"
                  width="20"
                  height="20"
                ></IconSvg>
                {{ item.linkText }}
              </span>
            </div>
            <div class="list-item overflow-point" v-else>
              {{ item.label }}：--
            </div>
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
import { getEsthesiaList } from "@/api/modules/healthEvent/index.js";
import { mapGetters } from "vuex";
import { intToChinese } from "@/utils/utils.js";

export default {
  name: "narcosisRecord",
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
            label: "术前诊断",
            val: "sqzd",
            span: 8,
          },
          {
            label: "术后诊断名称",
            val: "shzd",
            span: 16,
          },
          {
            label: "麻醉开始时间",
            val: "mzkssj",
            span: 8,
          },
          {
            label: "手术开始时间",
            val: "sskssj",
            span: 8,
          },

          {
            label: "出手术室时间",
            val: "cssssj",
            span: 8,
          },
          {
            label: "手术及操作名称与编码",
            val: "ssczmc",
            span: 16,
            linkText: "查看",
            linkProp: "operateRecord",
          },
          {
            label: "ASA分级",
            val: "asafj",
            span: 8,
          },
          {
            label: "血型",
            val: "aboxxdm",
            span: 8,
          },
          {
            label: "体重",
            val: "tzkg",
            units: "kg",
            span: 8,
          },
          {
            label: "年龄",
            val: "nl",
            units: "岁",
            span: 8,
          },
          {
            label: "麻醉方法",
            val: "mzffmc",
            span: 8,
          },
          {
            label: "麻醉体位",
            val: "mztw",
            span: 8,
          },
          {
            label: "麻醉前用药",
            val: "mzqyy",
            span: 8,
          },
        ],
        list2: [
          {
            label: "气管插管分类",
            val: "qgcgfl",
            span: 8,
          },
          {
            label: "呼吸类型",
            val: "hxlx",
            span: 8,
          },
          {
            label: "穿刺过程",
            val: "ccgcms",
            span: 8,
          },
          {
            label: "麻醉合并症",
            val: "mzhbzms",
            span: 8,
          },
          {
            label: "麻醉过程描述",
            val: "mzms",
            span: 8,
          },
          {
            label: "麻醉效果",
            val: "mzxg",
            span: 8,
          },
          {
            label: "诊疗过程描述",
            val: "zlgcms",
            span: 24,
          },
          {
            label: "输血记录",
            val: "sxjl",
            span: 8,
            linkText: "查看",
            linkProp: "bloodTransRecord",
          },
          {
            label: "患者去向",
            val: "brqxdm",
            span: 16,
          },
          {
            label: "手术医生",
            val: "ssysxm",
            tag: ["doctor"],
            span: 8,
          },
          {
            label: "麻醉医生",
            val: "mzysxm",
            tag: ["doctor"],
            span: 8,
          },
          {
            label: "签名时间",
            val: "tbsj",
            span: 8,
          },
        ],
        tableColums: [
          {
            label: "麻醉用药名称",
            prop: "mzywmc",
            width: "180",
          },
          {
            label: "规格",
            prop: "gg",
            width: "100",
          },
          {
            label: "剂量",
            prop: "mzywzjl",
            width: "100",
          },
          {
            label: "单位",
            prop: "jldw",
            width: "100",
          },
        ],
      },
      narcosisRecordData: [],
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
    personalInfos: {
      handler(val) {},
      deep: true,
      immediate: true,
    },
    navBarObj: {
      handler(val) {
        this.narcosisRecordData = [];
        this.currentData = {};
        this.currentIndex = -1;
        if (val.serialNumber && val.hosCode) {
          this.getRecord();
        }
      },
      deep: true,
      immediate: true,
    },
    narcosisRecordData: {
      handler(val) {
        if (val.length) {
          let mzdbh =
            this.inDepartGoLinkData?.prop === "narcosisRecord"
              ? this.inDepartGoLinkData?.data?.mzdbh || ""
              : "";
          let yljgdm =
            this.inDepartGoLinkData?.prop === "narcosisRecord"
              ? this.inDepartGoLinkData?.data?.yljgdm || ""
              : "";
          this.itemClickFuc(mzdbh, yljgdm);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    // 获取麻醉记录
    async getRecord() {
      this.loading = true;
      try {
        let res = await getEsthesiaList({
          serialNumber: this.navBarObj.serialNumber || "",
          hosCode: this.navBarObj.hosCode || "",
        });
        console.log("住院的麻醉记录数据", res.result);
        this.narcosisRecordData = res.result;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 显示字段
    showValue(item) {
      let currentData = this.currentData;
      /* if (item.val === "hasTransfusion") {
        return `${currentData[item.val] ? "有" : "无"}`;
      } */
      if (item.val === "aboxxdm") {
        return currentData[item.val] + " " + currentData.rhxx;
      }

      if (item.tag && item.tag.indexOf("doctor") > -1) {
        return this.doctorNamePrivacy(currentData[item.val]) || "--";
      }
      return `${currentData[item.val] || "--"}${item.units || ""}`;
    },
    itemClickFuc(mzdbh, yljgdm) {
      let index = 0;
      for (let i in this.narcosisRecordData) {
        if (
          this.narcosisRecordData[i].mzdbh === mzdbh &&
          this.narcosisRecordData[i].yljgdm === yljgdm
        ) {
          index = i;
          break;
        }
      }
      if (Number(this.currentIndex) === Number(index)) {
        return;
      }
      this.itemClick(this.narcosisRecordData[index], index);
    },
    itemClick(item, index) {
      index = Number(index);
      this.$EventBus.$emit("inDepartGoLink", {});
      this.currentData = item;
      this.currentIndex = index;
    },
    //跳转方法
    goLinkFuc(item) {
      let inDepartGoLinkData = {
        prop: item.linkProp,
        data: this.currentData,
        index: this.currentIndex,
      };
      this.$EventBus.$emit("inDepartGoLink", inDepartGoLinkData);
    },
    indexC(index) {
      return intToChinese(index + 1) || "";
    },
  },
};
</script>

<style lang="scss">
.narcosisRecord {
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
  .list-items {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .list-item {
    height: 34px;
    line-height: 34px;
    color: #919191;
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
    display: flex;
    align-items: center;
    .item-detail {
      color: #333;
      cursor: pointer;
    }
  }
  .goLink {
    height: 34px;
    line-height: 34px;
    width: 55px;
    margin-left: 10px;
    color: #446bdd;
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
    display: flex;
    align-items: center;
    cursor: pointer;
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
