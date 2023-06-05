<template>
  <div class="assaysRecord height100">
    <div class="title">
      {{ showModal == 1 ? "检验结果报告" : "检验结果对比" }}
    </div>
    <div class="show-modal">
      <el-radio-group v-model="showModal">
        <el-radio-button label="1">报告模式</el-radio-button>
        <el-radio-button label="2">对比模式</el-radio-button>
      </el-radio-group>
    </div>
    <div class="assaysRecord-cont">
      <template v-if="showModal == 1">
        <div
          class="assaysRecord-item"
          v-for="(item, index) in assaysRecordData"
          :key="index"
          v-show="index == 0 || isShow"
        >
          <div class="assaysRecord-detail">
            <div
              class="assaysRecord-detail-title"
              :title="item.reportTitle || ''"
            >
              {{ item.reportTitle || "--" }}
              <!-- <i class="national">
                <IconSvg
                  iconClass="to-change"
                  width="14"
                  height="14"
                  style="vertical-align: middle"
                ></IconSvg>
                全国互认
              </i> -->
            </div>
            <div :title="item.reportTime || ''">
              报告时间：{{ item.reportTime || "--" }}
            </div>
            <div :title="item.hosName || ''">
              报告机构：{{ item.hosName || "--" }}
            </div>
          </div>
          <div class="assaysRecord-detail assaysRecord-detail1">
            <div :title="item.diagName || ''">
              临床诊断：{{ item.diagName || "--" }}
            </div>
            <div>
              <el-button
                type="text"
                :disabled="!item.serialNumber"
                @click="jumpToFuc(item)"
                class="jump-btn"
                ><IconSvg
                  iconClass="card-two"
                  width="16"
                  height="16"
                  style="vertical-align: middle; margin-right: 1px"
                ></IconSvg>
                查看就诊
              </el-button>
            </div>
          </div>
          <div class="table-cont">
            <el-table
              ref="singleTable"
              highlight-current-row
              :data="item.results"
            >
              <el-table-column
                class="overflow-point"
                v-for="(item, index) in tableColumn"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fixed"
              >
                <template slot-scope="scope">
                  <template v-if="item.prop === 'result'">
                    <div class="result-cont">
                      <div class="result-detail">{{ scope.row.result }}</div>
                      <i
                        v-if="scope.row.abnormityTip == '3'"
                        class="el-icons el-icon-top"
                        style="color: #ff4d4f"
                      ></i>
                      <i
                        v-else-if="scope.row.abnormityTip == '4'"
                        class="el-icons el-icon-bottom"
                        style="color: #5e84d7"
                      ></i>
                    </div>
                  </template>
                  <template v-else>{{ scope.row[item.prop] }}</template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="item-bottom" v-if="index == 0">
            <template v-if="!isShow">
              <el-divider content-position="center">
                还有
                <span class="show-more-num">{{
                  assaysRecordData.length - 1
                }}</span>
                次同类检验报告，
                <el-button type="text" @click="handleShow(true)"
                  ><i class="el-icon-arrow-class el-icon-arrow-up"></i
                  >展开查看</el-button
                >
              </el-divider>
            </template>
            <template v-else>
              <el-divider content-position="center">
                历次同类检验报告，
                <el-button type="text" @click="handleShow(false)"
                  ><i class="el-icon-arrow-class el-icon-arrow-down"></i
                  >收起</el-button
                >
              </el-divider>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="assaysRecord-compare height100">
          <div class="assaysRecord-detail">
            <div class="assaysRecord-detail-title">
              {{
                assaysRecordData.length
                  ? assaysRecordData[0].reportTitle || "--"
                  : "--"
              }}
              <!-- <i class="national">
                <IconSvg
                  iconClass="to-change"
                  width="14"
                  height="14"
                  style="vertical-align: middle"
                ></IconSvg>
                全国互认
              </i> -->
            </div>
          </div>
          <div class="table-cont table-compare-cont">
            <el-table
              ref="singleTable"
              height="100%"
              highlight-current-row
              :data="assaysCompareData"
            >
              <el-table-column
                class="overflow-point"
                v-for="(item, index) in compareColumn"
                :key="index"
                :prop="item.prop"
                :min-width="item.width"
                :fixed="item.fixed"
              >
                <!-- :label="item.label" -->
                <template slot="header">
                  {{ item.label }}
                  <span class="benci" v-if="item.index === 0">（本次）</span>
                </template>
                <template slot-scope="scope">
                  <template v-if="item.prop === 'result'">
                    {{ scope.row[item.prop] }}
                  </template>
                  <template v-else>
                    <template v-if="typeof scope.row[item.prop] === 'object'">
                      {{ scope.row[item.prop].result }}
                      <i
                        v-if="scope.row[item.prop].abnormityTip == '3'"
                        class="el-icons el-icon-top"
                        style="color: #ff4d4f"
                      ></i>
                      <i
                        v-else-if="scope.row[item.prop].abnormityTip == '4'"
                        class="el-icons el-icon-bottom"
                        style="color: #5e84d7"
                      ></i>
                    </template>
                    <template v-else>{{ scope.row[item.prop] }}</template>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { listSameLisWithDetails } from "@/api/modules/healthEvent/index.js";
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/utils.js";

let compareColumnInit = [
  { prop: "itemName", label: "项目", width: "120", fixed: true },
  { prop: "referenceValue", label: "参考值", width: "90", fixed: true },
  { prop: "unitName", label: "单位", width: "90", fixed: true },
];
import { mapActions } from "vuex";
export default {
  name: "assaysRecord",
  props: {
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
      // 模式
      showModal: "1",
      tableColumn: [
        { prop: "itemName", label: "项目", width: "180" },
        { prop: "result", label: "结果", width: "120" },
        { prop: "unitName", label: "单位", width: "100" },
        { prop: "referenceValue", label: "参考值", width: "120" },
        { prop: "testMethod", label: "检测方法", width: "150" },
      ],
      // 同类型检验数据
      assaysRecordData: [],
      // 是否显示同类型数据
      isShow: false,
      compareColumn: [],
      // 对比模式数据
      assaysCompareData: [],
    };
  },
  computed: {
    ...mapGetters({
      personalArchInfo: "base/personalArchInfo",
    }),
  },
  watch: {
    navBarObj: {
      handler(val) {
        this.listSameLisWithDetails();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      setJumpToData: "base/setJumpToData",
    }),
    // 查询检验信息
    async listSameLisWithDetails() {
      this.compareColumn = [];
      this.assaysRecordData = [];
      this.assaysCompareData = [];
      try {
        let archiveInfo = this.personalArchInfo || {};
        let certId = archiveInfo.personalArchiveInfo
          ? archiveInfo.personalArchiveInfo.certId || ""
          : "";
        let certType = archiveInfo.personalArchiveInfo
          ? archiveInfo.personalArchiveInfo.certType || ""
          : "";
        let params = {
          lisItemCode: this.navBarObj.serialNumber || "",
          certId,
          certType,
          hosCode: this.navBarObj.hosCode || "",
        };
        let res = await listSameLisWithDetails(params);
        if (res.code === 0) {
          console.log("查询检验信息：", res.result);
          // this.assaysRecordData = res.result;
          this.handleData(res.result);
        }
      } catch (error) {}
    },
    handleShow(flag) {
      this.isShow = flag;
    },
    handleData(results) {
      // 排序
      let newResults = results.slice(1);
      let initDatas = newResults.sort((a, b) => {
        let reportTimeA = new Date(a.reportTime).getTime();
        let reportTimeB = new Date(b.reportTime).getTime();
        return reportTimeB - reportTimeA;
      });
      let assaysRecordData = [results[0]].concat(initDatas);
      this.assaysRecordData = assaysRecordData;
      // 对比的表头
      let colums = [];
      // 对比的内容
      let assaysCompareData = [];
      let compareItem = {};
      assaysRecordData.forEach((item, index) => {
        let columItem = {
          label: this.dayjs(item.reportTime || "").format("YYYY-MM-DD HH:mm"),
          prop: item.reportId,
          width: "120",
          index,
        };
        colums.push(columItem);
        item.results.forEach((val) => {
          compareItem[val.itemCode] = {
            ...compareItem[val.itemCode],
            ...val,
          };
          compareItem[val.itemCode][item.reportId] = val;
        });
      });
      this.compareColumn = compareColumnInit.concat(colums);
      for (let i in compareItem) {
        assaysCompareData.push(compareItem[i]);
      }
      this.assaysCompareData = assaysCompareData;
      console.log("compareItem", compareItem);
      console.log("assaysCompareData", assaysCompareData);
    },
    // 查看就诊
    jumpToFuc(item) {
      let year = item.reportTime.split("-")[0] || "";
      let jumpToDataObj = {
        firstLevelName: "two",
        healthEventName: "first",
        healthEventItem: {
          item,
          type: "visit",
          flag: "item",
          year,
        },
      };
      console.log("跳转的2222222222222", jumpToDataObj);
      this.setJumpToData(jumpToDataObj);
    },
  },
};
</script>
<style lang="scss" scoped>
.assaysRecord {
  position: relative;
  .title {
    line-height: 32px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin: 0 0 12px 0;
  }
  .show-modal {
    position: absolute;
    right: 0;
    top: 0;
  }
  .national {
    color: #50aea3;
    padding: 2px 3px;
    font-weight: bold;
    font-size: 10px;
    border: 1px solid #50aea3;
    margin: 4px;
  }
  .assaysRecord-cont {
    height: calc(100% - 53px);
    overflow-y: auto;
    .assaysRecord-detail {
      height: 40px;
      padding: 0 5px;
      line-height: 40px;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
      color: #101010;
      background-color: rgba(247, 247, 247, 100);
      border: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      .assaysRecord-detail-title {
        font-size: 16px;
        font-family: Microsoft Yahei;
      }
    }
    .assaysRecord-detail1 {
      border-top: none;
    }
    .jump-btn {
      padding: 10px 0;
      font-size: 16px;
    }
    .table-cont {
      margin-bottom: 10px;
      border-left: 1px solid #e5e5e5;
      border-right: 1px solid #e5e5e5;
      .el-table {
        color: #333333;
        .el-table__cell {
          padding: 4px 0;
        }
        ::v-deep th {
          padding: 7px 0;
        }
        ::v-deep td {
          padding: 4px 0;
        }
        ::v-deep thead th {
          background-color: #fff !important;
          color: #919191;
        }
        .result-cont {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .result-detail {
            min-width: 70px;
          }
          .el-icons {
            width: 20px;
            height: 20px;
            font-weight: bold;
            margin-right: 20px;
            line-height: 20px;
          }
        }
      }
    }
    .assaysRecord-compare {
      overflow-y: hidden;
    }
    .table-compare-cont {
      height: calc(100% - 42px);
      .benci {
        color: rgba(68, 107, 189, 100);
        font-size: 12px;
        font-family: SourceHanSansSC-regular;
      }
    }
    .item-bottom {
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      text-align: center;
      font-family: SourceHanSansSC-regular;
      color: rgba(51, 51, 51, 100);
      .show-more-num {
        font-size: 16px;
        color: #446bbd;
      }
      .el-icon-arrow-class {
        margin-right: 3px;
        height: 16px;
        width: 16px;
        color: #446bbd;
      }
    }
  }
}
</style>
