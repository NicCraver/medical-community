<template>
  <div class="operateRecord" v-loading="loading">
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
      <div class="button-cont" v-else></div>
      <el-row
        :gutter="10"
        class="width100"
        :class="{ 'row-class': navBarObj.activeName !== 'second' }"
      >
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
              >
                <IconSvg
                  iconClass="card-two"
                  style="color: #446bdd"
                  width="20"
                  height="20"
                ></IconSvg
                >{{ item.linkText }}
              </span>
            </div>
            <div class="list-item overflow-point" v-else>
              {{ item.label }}：--
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="table-cont">
        <el-table :data="currentData.tableData" border>
          <el-table-column
            v-for="(item, index) in list.tableColums"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :min-width="item.width"
          >
            <template slot-scope="scope">
              <template v-if="item.prop === 'ssjb'">
                <span
                  v-codeTransform
                  code="CV05.10.024"
                  :val="scope.row.ssjb"
                ></span>
              </template>
              <template v-else-if="item.prop === 'qkyhdj'">
                <span
                  v-codeTransform
                  code="CV05.10.023"
                  :val="scope.row.qkyhdj"
                ></span>
              </template>
              <template v-else>{{ scope.row[item.prop] }}</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row :gutter="10" class="row-class width100">
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
              <span class="item-detail">
                <template v-if="item.val === 'ssbwdm'">
                  <span
                    v-codeTransform
                    code="CT01.00.030"
                    :val="currentData.ssbwdm"
                  ></span>
                </template>
                <template v-else>
                  <span :title="showValue(item)">{{ showValue(item) }}</span>
                </template>
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
                ></IconSvg
                >{{ item.linkText }}
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
import {
  listSurgeryOpLog,
  listSurgeryOpLogItem,
} from "@/api/modules/healthEvent/index.js";
import { mapGetters } from "vuex";
import { intToChinese } from "@/utils/utils.js";

export default {
  name: "operateRecord",
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
            val: "ssqzdmc",
            span: 8,
          },
          {
            label: "术后诊断名称",
            val: "sshzdmc",
            span: 16,
          },
          {
            label: "手术开始时间",
            val: "ssqssj",
            span: 8,
          },
          {
            label: "手术结束时间",
            val: "ssjssj",
            span: 8,
          },
        ],
        list2: [
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
            span: 8,
          },
          {
            label: "介入物名称",
            val: "jrwmc",
            span: 16,
          },
          {
            label: "出血量",
            val: "sscxlml",
            span: 8,
          },
          {
            label: "输血量",
            val: "sxl",
            span: 8,
            linkText: "查看",
            linkProp: "bloodTransRecord",
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
            val: "sss",
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
            val: "qxhsxm",
            tag: ["doctor"],
            span: 8,
          },
          {
            label: "巡台护士",
            val: "xhhsxm",
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
            width: "100",
          },
          {
            label: "切口",
            prop: "qkyhdj",
            width: "100",
          },
        ],
      },
      operateRecordData: [],
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
        this.operateRecordData = [];
        this.currentData = {};
        this.currentIndex = -1;
        if (val.hosCode && val.serialNumber) {
          if (val.activeName === "second") {
            this.getRecordItem();
          } else {
            this.getRecord();
          }
        }
      },
      deep: true,
      immediate: true,
    },
    operateRecordData: {
      handler(val) {
        if (val.length) {
          let mzdbh =
            this.inDepartGoLinkData?.prop === "operateRecord"
              ? this.inDepartGoLinkData?.data?.mzdbh || ""
              : "";
          let yljgdm =
            this.inDepartGoLinkData?.prop === "operateRecord"
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
    // 获取手术记录
    async getRecord() {
      this.loading = true;
      try {
        let res = await listSurgeryOpLog({
          serialNumber: this.navBarObj.serialNumber || "",
          hosCode: this.navBarObj.hosCode || "",
        });
        console.log("住院的手术记录数据", res.result);
        let operateRecordData = [];
        for (let i in res.result) {
          operateRecordData.push({
            ...res.result[i],
            tableData: [{ ...res.result[i] }],
          });
        }
        this.operateRecordData = operateRecordData;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 获取某次手术记录
    async getRecordItem() {
      this.loading = true;
      try {
        let res = await listSurgeryOpLogItem({
          serialNumber: this.navBarObj.serialNumber || "",
          hosCode: this.navBarObj.hosCode || "",
        });
        console.log("住院的手术记录数据--具体", res.result);
        if (res.result) {
          let operateRecordData = [
            {
              ...res.result,
              tableData: [{ ...res.result }],
            },
          ];
          this.operateRecordData = operateRecordData;
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
      if (item.tag && item.tag.indexOf("doctor") > -1) {
        return `${this.doctorNamePrivacy(currentData[item.val]) || "--"}`;
      }
      return `${currentData[item.val] || "--"}`;
    },
    itemClickFuc(mzdbh, yljgdm) {
      let index = 0;
      for (let i in this.operateRecordData) {
        if (
          this.operateRecordData[i].mzdbh === mzdbh &&
          this.operateRecordData[i].yljgdm === yljgdm
        ) {
          index = i;
          break;
        }
      }
      if (Number(this.currentIndex) === Number(index)) {
        return;
      }
      this.itemClick(this.operateRecordData[index], index);
    },
    itemClick(item, index) {
      index = Number(index);
      this.$EventBus.$emit("inDepartGoLink", {});
      this.currentData = item;
      this.currentIndex = index;
      this.$emit("getMainData", {
        ...this.currentData,
        serialNumber: this.currentData.jzlsh,
      });
    },
    //跳转方法
    goLinkFuc(item) {
      this.$EventBus.$emit("inDepartGoLink", {
        prop: item.linkProp,
        data: this.currentData,
        index: this.currentIndex,
      });
    },
    indexC(index) {
      return intToChinese(index + 1) || "";
    },
  },
};
</script>

<style lang="scss">
.operateRecord {
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
