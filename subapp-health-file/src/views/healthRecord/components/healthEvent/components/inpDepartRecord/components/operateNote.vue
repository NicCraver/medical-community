<template>
  <div class="operateNote" v-loading="loading">
    <template v-if="operateRecordData && operateRecordData.length">
      <div class="button-cont" v-if="navBarObj.activeName !== 'second'">
        <span
          class="button"
          v-for="(item, index) in operateRecordData"
          :key="index"
          :class="{ activity: currentIndex === index }"
          @click="itemClick(item, index)"
          >第{{ indexC(index) }}次</span
        >
      </div>
      <div class="title-name">手术信息</div>
      <el-row
        :gutter="10"
        class="width100"
        :class="{ 'row-class': navBarObj.activeName !== 'second' }"
      >
        <el-col v-for="(item, index) in list" :key="index" :span="item.span">
          <template v-if="item.type === 'table'">
            <div class="table-cont">
              <el-table :data="currentData.tableData" border>
                <el-table-column
                  v-for="(item, index) in item.tableColums"
                  :key="index"
                  :label="item.label"
                  :prop="item.prop"
                  :min-width="item.width"
                >
                  <template slot-scope="scope">
                    <template v-if="item.code">
                      <span
                        v-codeTransform
                        :code="item.code"
                        :val="scope.row[item.prop]"
                      ></span>
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
          <template v-else>
            <div class="list-items">
              <div
                class="list-item overflow-point"
                v-if="currentData.hasOwnProperty(item.val)"
              >
                {{ item.label }}：
                <span class="item-detail" :title="showValue(item)">
                  <template v-if="item.code">
                    <span
                      v-codeTransform
                      :code="item.code"
                      :val="currentData[item.val]"
                    ></span>
                  </template>
                  <template v-else>
                    <span :title="showValue(item)">{{ showValue(item) }}</span>
                  </template>
                </span>
              </div>
              <div class="list-item overflow-point" v-else>
                {{ item.label }}：--
              </div>
            </div>
          </template>
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
import { listSurgeryOpLog } from "@/api/modules/healthEvent/index.js";
import { mapGetters } from "vuex";
import { intToChinese } from "@/utils/utils.js";

export default {
  name: "operateNote",
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
          label: "术前诊断名称",
          val: "ssqzdmc",
          span: 24,
        },
        {
          label: "术后诊断名称",
          val: "sshzdmc",
          span: 24,
        },
        {
          label: "手术开始时间",
          val: "ssqssj",
          tag: ["date"],
          span: 8,
        },
        {
          label: "手术结束时间",
          val: "ssjssj",
          tag: ["date"],
          span: 8,
        },
        {
          label: "手术史",
          val: "sqzd",
          code: "CT01.00.002",
          span: 8,
        },
        {
          type: "table",
          span: 24,
          tableColums: [
            {
              label: "手术名称",
              prop: "ssczmc",
              width: "180",
            },
            {
              label: "手术及操作编码",
              prop: "ssczbm",
              width: "100",
            },
            {
              label: "手术级别",
              prop: "ssjb",
              code: "CV05.10.024",
              width: "100",
            },
            {
              label: "切口",
              prop: "qkyhdj",
              code: "CV05.10.023",
              width: "100",
            },
          ],
        },
        {
          label: "麻醉方法",
          val: "mzffmc",
          span: 8,
          linkText: "查看",
          linkProp: "narcosisRecord",
        },
        {
          label: "手术部位",
          val: "ssbwdm",
          code: "CT01.00.030",
          span: 8,
        },
        {
          label: "手术体位",
          val: "sstw",
          span: 8,
        },
        {
          label: "手术过程描述",
          val: "ssjgms",
          span: 24,
        },
        {
          label: "皮肤消毒描述",
          val: "pfxdms",
          span: 24,
        },
        {
          label: "介入物名称",
          val: "jrwmc",
          span: 24,
        },
        {
          label: "出血量（ml）",
          val: "sscxlml",
          span: 8,
        },
        {
          label: "输血量（ml）",
          val: "sxl",
          span: 8,
        },
        {
          label: "输血反应标志",
          val: "sxfybz",
          code: "CT01.00.002",
          span: 8,
        },
        {
          label: "引流材料名称",
          val: "ooo",
          span: 8,
        },
        {
          label: "引流材料数量",
          val: "zzz",
          span: 8,
        },
        {
          label: "放置部位",
          val: "ppp",
          span: 8,
        },
        {
          label: "术前用药",
          val: "qqq",
          span: 8,
        },
        {
          label: "术中用药",
          val: "rrr",
          span: 8,
        },
        {
          label: "输液量",
          val: "",
          span: 8,
        },
        {
          label: "术者",
          val: "ssysxm",
          tag: ["doctor"],
          span: 8,
        },
        {
          label: "第一助手",
          val: "ssysizxm",
          tag: ["doctor"],
          span: 8,
        },
        {
          label: "第二助手",
          val: "ssysiizxm",
          tag: ["doctor"],
          span: 8,
        },
        {
          label: "器械护士",
          val: "www",
          tag: ["doctor"],
          span: 8,
        },
        {
          label: "巡台护士",
          val: "xxx",
          tag: ["doctor"],
          span: 8,
        },
        {
          label: "麻醉医生",
          val: "mzysxm",
          tag: ["doctor"],
          span: 8,
        },
      ],
      operateRecordData: [{}],
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
        this.operateRecordData = [];
        this.currentData = {};
        this.currentIndex = -1;
        if (val.hosCode && val.serialNumber) {
          this.getRecord();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    // 获取手术记录
    async getRecord() {
      this.loading = true;
      try {
        let res = await listSurgeryOpLog({
          serialNumber: this.navBarObj.serialNumber || "",
          hosCode: this.navBarObj.hosCode || "",
        });
        if (res.code === 0) {
          console.log("手术记录数据", res.result);
          let operateRecordData = [];
          for (let i in res.result) {
            operateRecordData.push({
              ...res.result[i],
              tableData: [{ ...res.result[i] }],
            });
          }
          this.operateRecordData = operateRecordData;
          this.operateRecordData.length &&
            this.itemClick(this.operateRecordData[0], 0);
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 显示字段
    showValue(item) {
      let currentData = this.currentData;
      if (item.val === "ssqzdmc") {
        return `${currentData.ssqzdmc || "--"}(${currentData.ssqzd || "--"})`;
      }
      if (item.val === "sshzdmc") {
        return `${currentData.sshzdmc || "--"}(${currentData.sshzd || "--"})`;
      }
      // 输血量项目值需带上单位,取sxljldw
      if (item.val === "sxl") {
        return `${currentData[item.val] || "--"}${
          currentData["sxljldw"] || ""
        }`;
      }
      if (item.tag && item.tag.indexOf("doctor") > -1) {
        return `${this.doctorNamePrivacy(currentData[item.val]) || "--"}`;
      }
      if (item.tag && item.tag.indexOf("date") > -1 && currentData[item.val]) {
        return this.dayjs(currentData[item.val]).format("YYYY-MM-DD HH:mm");
      }
      return `${currentData[item.val] || "--"}`;
    },
    itemClick(item, index) {
      this.currentData = item;
      this.currentIndex = index;
      this.$emit("getMainData", {
        ...this.currentData,
        serialNumber: this.currentData.jzlsh,
      });
    },
    indexC(index) {
      return intToChinese(index + 1) || "";
    },
  },
};
</script>

<style lang="scss">
.operateNote {
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
    margin-top: 10px;
    padding: 0 10px;
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
