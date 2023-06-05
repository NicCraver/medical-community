<template>
  <div class="emrRecords">
    <div class="emr-left">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <el-collapse v-model="colNames">
            <el-collapse-item
              v-for="(item, index) in recordData"
              :key="index"
              :name="item.typeCode"
            >
              <template slot="title">
                <div
                  class="title-cont overflow-point"
                  :title="`${item.typeName || ''} (${item.fileCount || '0'})`"
                >
                  {{ item.typeName || "--" }} ({{ item.fileCount || "0" }})
                </div>
              </template>
              <div
                class="detail-cont overflow-point"
                :title="val.name || ''"
                :class="{
                  selected:
                    currentData.subTypeCode === item.typeCode &&
                    currentData.id === val.id,
                }"
                v-for="(val, key) in item.emrFiles"
                :key="key"
                @click="itemClick(val)"
              >
                <span class="circle-item"></span>
                <span class="label-item">
                  {{ val.name || "--" }}
                </span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="emr-right" v-loading="loading">
      <div
        class="btn-cont"
        v-if="currentData.fileUrl && currentData.fileType === 'pdf'"
      >
        <div>{{ `${currentPage}/${pageCount}` }}</div>
        <div class="btn-cont-right">
          <el-input-number
            v-model="sizeNum"
            size="small"
            :step="10"
            step-strictly
            :precision="0"
            :min="10"
            :max="200"
            style="width: 120px; margin-right: 10px"
            @change="sizeNumChange"
          ></el-input-number>
          <el-button type="text" @click="rotateFuc"
            ><IconSvg
              iconClass="rotateRight"
              style="color: #cacdd4"
              width="30"
              height="30"
            ></IconSvg
          ></el-button>
        </div>
      </div>
      <template v-if="currentData.fileUrl">
        <div class="pdf-cont" v-if="currentData.fileType === 'pdf'">
          <pdfCom
            :rotateEdge="rotateEdge"
            :pdfContStyle="pdfContStyle"
            :currentData="currentData"
            v-if="currentData.fileUrl"
            @currentPage="setCurrentPage"
            @pageCount="setPageCount"
          ></pdfCom>
        </div>
        <div class="img-cont" v-else>
          <!-- <img :src="currentData.fileUrl" alt="" /> -->
          <el-image
            alt=""
            title="点击预览"
            :src="currentData.fileUrl"
            :preview-src-list="[currentData.fileUrl]"
          >
          </el-image>
        </div>
      </template>
      <div class="empty-cont" v-else-if="currentData.id">
        <div class="emptyText">正在加载中...</div>
      </div>
      <div class="empty-cont" v-else>
        <IconSvg
          iconClass="empty-box"
          style="color: #cacdd4"
          width="80"
          height="80"
        ></IconSvg>
        <div class="emptyText">未找到对应文件</div>
      </div>
    </div>
  </div>
</template>

<script>
import pdfCom from "./pdfCom";

import { emrFileListByTreat } from "api/healthEvent";

export default {
  name: "emrRecords",
  props: {
    // 导航传过来的内容
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    pdfCom,
  },
  data() {
    return {
      activeName: "1",
      tabList: [
        {
          label: "医生病历",
          name: "1",
        },
        {
          label: "护理文书",
          name: "2",
        },
      ],
      colNames: [],
      recordData: [],
      currentData: {},
      sizeNum: 100,
      pdfContStyle: {
        width: "798px",
      },
      timer: null,
      loading: false,
      // pdf当前页数
      currentPage: 0,
      // pdf文件总页数
      pageCount: 0,
      // 翻转角度
      rotateEdge: 0,
      // 图片样式
      // imgContStyle: {},
      // imgStyle: {
      //   width: "100%",
      //   height: "auto",
      // },
      lastClickId: ''
    };
  },
  watch: {
    navBarObj: {
      handler(val) {
        this.getLeftList();
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    tabClick() {
      this.getLeftList();
    },
    // 查询左侧列表
    async getLeftList() {
      this.recordData = [];
      this.currentData = {};
      this.lastClickId = "";
      this.colNames = [];
      try {
        let params = {
          treatId: this.navBarObj.serialNumber,
          emrMainTypeCode: this.activeName,
        };

        let { result, code } = await emrFileListByTreat(params);
        if (code === 0) {
          console.log("左侧列表：", result);
          this.recordData = result;
          this.getFirstItem();
        }
      } catch (error) {}
    },
    // 初始化默认展开第一个有数据的类型，并且选中第一条
    getFirstItem() {
      let data = this.recordData;
      for (let i in data) {
        let item = data[i];
        if (item.emrFiles && item.emrFiles.length) {
          this.$set(this.colNames, this.colNames.length, item.typeCode);
          this.itemClick(item.emrFiles[0]);
          break;
        }
      }
    },
    // 点击左侧列表
    itemClick(row) {
      if (this.loading) {
        return;
      }
      // 防止重复点击
      if (this.lastClickId == row.id) {
        return;
      }
      this.lastClickId = row.id;
      this.pdfContStyle = {
        width: "798px",
      };
      /* this.imgStyle = {
        width: "100%",
        height: "auto",
      };
      this.imgContStyle = {}; */
      this.rotateEdge = 0;
      this.sizeNum = 100;

      if (row.fileType === "pdf") {
        this.loading = true;
        this.currentData = {
          subTypeCode: row.subTypeCode,
          id: row.id,
        };
        this.currentPage = 0;
        this.pageCount = 0;
        this.timer = setTimeout(() => {
          this.currentData = row;
          this.loading = false;
        }, 200);
      } else {
        this.currentPage = 1;
        this.pageCount = 1;
        this.currentData = row;
      }
    },
    // 旋转方法
    rotateFuc() {
      let rotateEdge = this.rotateEdge;
      rotateEdge += 90;
      rotateEdge = rotateEdge >= 360 ? 0 : rotateEdge;
      this.rotateEdge = rotateEdge;
      /* if (this.currentData.fileType && this.currentData.fileType !== "pdf") {
        this.$set(this.imgStyle, "transform", `rotate(${this.rotateEdge}deg)`);
      } */
    },
    // 放大缩小方法
    sizeNumChange(val) {
      if (this.currentData.fileType && this.currentData.fileType == "pdf") {
        let width = 798 * val * 0.01;
        this.$set(this.pdfContStyle, "width", width + "px");
      } /*  else {
        this.$set(this.imgStyle, "width", val + "%");
      } */
    },
    setCurrentPage(num) {
      this.currentPage = num;
    },
    setPageCount(num) {
      this.pageCount = num;
    },
  },
  beforeDestroy() {
    this.timer = null;
  },
};
</script>

<style lang="scss" scoped>
.emrRecords {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  .emr-left {
    width: 210px;
    ::v-deep.el-tabs__header {
      margin-bottom: 5px;
    }
    ::v-deep .el-tabs .el-tabs__content {
      overflow-y: auto;
      padding: 0 !important;
      height: calc(100% - 45px);
    }
    .el-collapse {
      // margin-right: 10px;
      border: none;
      ::v-deep .el-collapse-item {
        .el-collapse-item__header {
          background-color: #eff2f9;
          height: 33px;
          line-height: 33px;
          color: #333;
          font-family: SourceHanSansSC-regular;
          align-items: center;
          .title-cont {
            width: calc(100% - 13px);
            height: 100%;
            padding: 0 5px;
            background-color: #eff2f9;
            color: rgba(145, 145, 145, 100);
            font-size: 14px;
          }
        }
        .el-collapse-item__wrap {
          border: none;
        }
        .el-collapse-item__content {
          padding: 0;
          cursor: pointer;
          .detail-cont {
            padding: 0 15px;
            height: 40px;
            line-height: 40px;
            border: 1px solid transparent;
            border-bottom: 1px solid #ededed;
            .circle-item {
              width: 8px;
              height: 8px;
              margin-right: 20px;
              border-radius: 4px;
              background-color: transparent;
              display: inline-block;
            }
            .label-item {
              line-height: 20px;
              color: rgba(51, 51, 51, 100);
              font-size: 14px;
              text-align: left;
              font-family: SourceHanSansSC-regular;
            }
          }
          .detail-cont.selected {
            background-color: rgba(245, 248, 255, 100);
            border: 1px solid rgba(149, 177, 240, 100);
            .circle-item {
              background-color: #5e84d7;
            }
          }
        }
      }
      .el-collapse-item.is-active {
        border: none;
      }
    }
  }
  .emr-right {
    width: calc(100% - 220px);
    margin-left: 10px;
    background-color: #f7f7f7;
    .btn-cont {
      height: 40px;
      padding: 0 10px;
      // border-bottom: 1px solid #f7f7f7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btn-cont-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .pdf-cont {
      overflow: auto;
      width: calc(100% - 2px);
      height: calc(100% - 42px);
      border: 1px solid #f7f7f7;
    }
    .img-cont {
      overflow: auto;
      width: calc(100% - 2px);
      height: calc(100% - 2px);
      border: 1px solid #f7f7f7;
    }
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