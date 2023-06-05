<template>
  <div class="firstTab height100">
    <!-- <div style="height: 10px"></div> -->
    <div class="year fixedTop">
      <!-- v-if="yearSelectBarShow" -->
      <span class="year-cont">{{ currentYear }}</span>
      <div class="dateSelector">
        <el-select v-model="yearVal" :clearable="false" @change="yearChangeNew">
          <el-option
            v-for="item in yearOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="tab-cont" id="scrollBody" v-show="firstData.length">
      <div
        id="scrollBodyInner"
        class="item-cont"
        v-infinite-scroll="firstLoadMore"
        :infinite-scroll-disabled="flagDisable || loading"
      >
        <!-- :style="{ marginTop: index == 0 ? '0' : '10px' }" -->
        <div
          class="item-detail"
          v-for="(item, index) in firstData"
          :key="index"
        >
          <div
            class="year"
            v-if="item.year"
            :class="'target-' + item.year"
            :data-id="item.year"
          >
            <span class="year-cont">{{ item.year || "" }}</span>
            <div class="dateSelector" v-if="index == 0">
              <!-- <el-date-picker
                    v-model="yearVal"
                    type="year"
                    value-format="yyyy"
                    format="yyyy"
                    :clearable="false"
                    :picker-options="pickerOptions"
                    @blur="yearChange"
                  >
                  </el-date-picker> -->
              <el-select
                v-model="yearVal"
                :clearable="false"
                @change="yearChangeNew"
              >
                <el-option
                  v-for="item in yearOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div
            class="details"
            :class="{ activity: currentFirstIndex == index }"
            @click="firstItemClick(item, index)"
          >
            <div class="type">{{ item.type || "--" }}</div>
            <div class="cont">
              <div class="top" :title="item.title">
                <div class="titl">{{ item.title || "--" }}</div>
                <div class="date">{{ item.date || "--" }}</div>
              </div>
              <div class="bottom" :title="item.detail">
                {{ item.detail || "--" }}
              </div>
            </div>
          </div>
        </div>
        <div class="item-bottom" v-if="loading">加载中...</div>
        <div class="item-bottom" v-else>
          <el-divider content-position="center">暂无更多</el-divider>
        </div>
      </div>
    </div>
    <div class="tab-cont emptyBox" v-show="!firstData.length">
      <IconSvg
        iconClass="empty-box"
        style="color: #cacdd4"
        width="80"
        height="80"
      ></IconSvg>
      <div class="emptyText">暂无数据</div>
    </div>
  </div>
</template>

<script>
import {
  getVisitRecord,
  getVisitRecordForYear,
} from "@/api/modules/healthRecord/index.js";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "firstTab",
  components: {},
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
      yearOffsetTopData: [],
      currentYear: 2021,
      // yearSelectBarShow: false,
      yearVal: "",
      yearOptions: [],
      firstPageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0, // 全部数据的数量
      },
      // 请求回来的导航数据
      natureFirstData: [],
      // 就诊活动数据
      firstData: [],
      currentFirstIndex: -1,
      timer1: null,
      timer2: null,
      timer3: null,
      scrollTopVal: 0,

      loading: false,
      flagDisable: false,
    };
  },
  computed: {
    // 下拉列表禁止加载
    firstDisabled() {
      return (
        this.firstPageParams.pageNum >=
        Math.ceil(this.firstPageParams.total / this.firstPageParams.pageSize)
      );
    },
    pAId() {
      let archiveInfo = this.personalArchInfo || {};
      let pAId = archiveInfo.personalArchiveInfo
        ? archiveInfo.personalArchiveInfo.pAId || ""
        : "";
      return pAId;
    },
    ...mapGetters({
      personalArchInfo: "base/personalArchInfo",
      jumpToData: "base/jumpToData",
    }),
  },
  watch: {
    pAId: {
      handler(val, old) {
        if (val && old) {
          this.$emit("loadEventFuc", {
            item: { activeName: "" },
            index: -1,
          });
          this.firstPageParams.pageNum = 1;
          this.getFirstDataSelect();
        }
      },
      immediate: true,
      deep: true,
    },
    // 首页的跳转数据
    jumpToData: {
      handler(val, old) {
        // debugger
        this.getVisitRecordForYear();
        if ((!val || !val.firstLevelName) && (!old || !old.firstLevelName)) {
          this.getFirstDataSelect();
        }
        if (val.firstLevelName) {
          this.firstPageParams.pageNum = 1;
          this.getFirstDataSelect(Number(val?.healthEventItem?.year || 0) - 2, () => {
            this.tagetNavBar(val);
          });
          return;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // this.getVisitRecordForYear();
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        // 监听滚动事件
        document.getElementById("scrollBody") &&
          document
            .getElementById("scrollBody")
            .addEventListener("scroll", () => {
              this.scrollHandlerFunc();
            });
      }, 500);
    });
  },
  methods: {
    ...mapActions({
      setJumpToData: "base/setJumpToData",
    }),
    // 获取 年份的 scrollTop
    updateYearBarData() {
      this.$nextTick(() => {
        this.yearOffsetTopData = [];
        let list = $("div[data-id]");
        // //console.log("list::::", list);
        // if (!$("#scrollBodyInner")) return;
        try {
          let scrollBodyoffsetTop = $("#scrollBodyInner").offset().top;
          // console.log("scrollBodyoffsetTop",scrollBodyoffsetTop);
          list.each((index, element) => {
            let year = $(element).attr("data-id");
            let offsetTop = $(element).offset().top;

            this.yearOffsetTopData.push({
              year,
              scrollTop: Math.ceil(offsetTop - scrollBodyoffsetTop),
            });
          });
          this.yearOffsetTopData = this.yearOffsetTopData.slice().reverse();
        } catch (error) {}
      });
    },
    setCurrentYear(year) {
      this.currentYear = year;
    },
    // 滚动回调事件， 处理 滚动置顶
    scrollHandlerFunc() {
      let scrollTop = document.getElementById("scrollBody").scrollTop;
      let yearOffsetTopObj = this.yearOffsetTopData.find(
        (item) => item.scrollTop <= scrollTop
      );
      if (yearOffsetTopObj) {
        this.currentYear = yearOffsetTopObj.year;
      }
    },
    async yearChangeNew(value) {
      try {
        this.setJumpToData({
          firstLevelName: "two",
          healthEventName: "first",
          healthEventItem: {
            flag: "year",
            year: value,
          },
        });
        // this.firstPageParams.pageNum = 1;
        // await this.getFirstDataSelect(value);
      } catch (error) {}
    },
    // 列表根据条件滚动到指定位置
    scrollFuc(pro, condition, fn) {
      let firstData = this.firstData;
      let topVal = 0;
      let flag = -1;
      let itemDetails = document.getElementsByClassName("item-detail");
      for (let i in firstData) {
        let item = firstData[i];
        if (
          pro === "serialNumber"
            ? item[pro] === condition[pro] && item["hosCode"] === condition["hosCode"]
            : item[pro] === condition[pro]
        ) {
          flag = i;
          break;
        }
        let itemHeight = itemDetails[i].offsetHeight;
        // console.log("itemDetails[i]", itemDetails[i]);
        // console.log("itemHeight", itemHeight);
        topVal += itemHeight;
        /* if (item.year) {
          topVal += 116.94;
        } else {
          topVal += 78.63;
        } */
      }
      if (flag > -1) {
        // console.log("topValtopValtopVal", topVal);
        this.$nextTick(() => {
          this.scrollTopVal = topVal;
          document.getElementById("scrollBody").scrollTop = topVal;
          fn && fn(firstData[flag], flag);
        });
      } else {
        fn && fn(firstData[0], 0);
        /* this.firstLoadMore(() => {
          this.timer2 = setTimeout(() => {
            this.scrollFuc(pro, condition, fn);
          }, 1000);
        }); */
      }
    },
    // 获取年份下拉
    async getVisitRecordForYear() {
      if (this.yearOptions.length) {
        return;
      }
      try {
        let { code, result, desc } = await getVisitRecordForYear({
          pAId: this.$route.params.pAId || "",
        });
        console.log("获取年份数据？？？？？", code, result, desc);
        if (code === 0) {
          // result.forEach(element => {
          //   element = Number(element);
          // });
          this.yearOptions = result;
        }
      } catch (error) {}
    },
    // 获取选择年份的数据
    async getFirstDataSelect(value, fn) {
      this.loading = true;
      if (this.firstPageParams.pageNum == 1) {
        // delete params.pageSize;
        this.firstPageParams.pageSize = 10000;
      }
      try {
        let params = {
          pAId: this.$route.params.pAId || "",
          pageNum: this.firstPageParams.pageNum,
          pageSize: this.firstPageParams.pageSize,
          year: value,
        };
        if (!value) {
          delete params.year;
        }
        // if (this.firstPageParams.pageNum == 1) {
        // delete params.pageSize;
        // }
        let { code, result, desc } = await getVisitRecord(params);
        if (code === 0) {
          console.log(
            "导航栏数据Select--第" +
              this.firstPageParams.pageNum +
              "页--" +
              this.firstPageParams.pageSize +
              "---" +
              value +
              "年份",
            result
          );
          // this.firstPageParams.total = result.total;
          // this.firstPageParams.pageNum = 1;

          if (this.firstPageParams.pageNum == 1 && !value) {
            this.firstPageParams.total = result.total;
            this.natureFirstData = [];
          } else if (this.firstPageParams.pageNum == 1 && value) {
            this.firstPageParams.total = result.total + 1;
            this.firstPageParams.pageSize = result.total;
            this.natureFirstData = [];
          } else {
            this.firstPageParams.total = result.total;
          }
          if (this.firstPageParams.pageNum != 1 && !result.records.length) {
            this.flagDisable = true;
          } else {
            this.flagDisable = false;
          }
          this.natureFirstData = this.natureFirstData.concat(result.records);
          this.handleNatureData();

          // if (this.flagDisable) {

          this.$nextTick(() => {
            fn && fn();
          });
          // }

          if (value) {
            this.$nextTick(() => {
              /* let obj = this.yearOffsetTopData.find(
                (item) => item.year == value
              );
              console.log(obj);
              if (obj) {
                $("#scrollBody").scrollTop(obj.scrollTop);
              } */
            });
          }

          try {
            if (this.natureFirstData.length > 0) {
              let year = this.dayjs(this.natureFirstData[0].itemDate).format(
                "YYYY"
              );
              this.setCurrentYear(year);
            } else {
              this.setCurrentYear("");
            }
          } catch (error) {
            this.setCurrentYear("");
          }

          this.updateYearBarData();
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
      if (
        this.firstPageParams.pageNum == 1 &&
        !this.jumpToData.firstLevelName &&
        !fn
      ) {
        // debugger
        this.currentFirstIndex = -1;
        this.firstItemClick(this.firstData[0], 0);
      }
    },
    // 下拉加载事件
    firstLoadMore(fn) {
      //TODO
      console.log(
        "允许加载下一页吗？flagDisable",
        this.flagDisable,
        this.loading
      );
      if (this.flagDisable || this.loading) {
        return;
      }
      this.firstPageParams.pageNum++;
      this.getFirstDataSelect();
      fn && fn();
    },
    // 处理接口数据方法
    handleNatureData() {
      let natureFirstData = this.natureFirstData;
      let firstData = [];
      for (let i in natureFirstData) {
        let item = natureFirstData[i];
        let dateStr =
          i > 0
            ? this.dayjs(natureFirstData[i - 1].itemDate).format("YYYY")
            : "";
        let year = "";
        if (dateStr === this.dayjs(item.itemDate).format("YYYY")) {
          year = "";
        } else {
          year = this.dayjs(item.itemDate).format("YYYY");
        }
        firstData.push({
          ...item,
          type: item.itemType,
          year,
          date: this.dayjs(item.itemDate).format("YYYY-MM-DD"),
          title: item.itemName,
          detail: `${item.hospitalName}-${item.departmentName}`,
        });
      }
      this.firstData = firstData;
      // 跳转定位
      // this.jumpToFuc();
    },
    // 点击某一个导航
    firstItemClick(item, index) {
      if (item.hasOwnProperty("isPrivacy") && item.isPrivacy === "0") {
        this.$message.warning("该数据为隐私数据，无法查看。");
        return;
      }

      this.currentFirstIndex = index;
      this.$emit("loadEventFuc", {
        item: {
          ...item,
          activeName: "first",
        },
        index,
      });
    },
    // 首页跳转到事件界面，精准定位导航 || 根据年份定位到第一个
    tagetNavBar(val) {
      let res = val.healthEventItem;
      if (res.flag === "item") {
        // 某个
        this.scrollFuc(
          "serialNumber",
          res.item,
          (value, index) => {
            this.firstItemClick(value, index);
            this.setJumpToData({
              firstLevelName: "",
              healthEventName: "",
              healthEventItem: {},
            });
          }
        );
      } else if (res.flag === "list") {
        // 某类型
        let typeName = "";
        if (res.type === "visit") {
          typeName = "门诊";
        } else if (res.type === "MedicalExamRecord") {
          typeName = "体检";
        }
        this.scrollFuc("type", {type: typeName}, (value, index) => {
          // debugger
          this.firstItemClick(value, index);
          this.setJumpToData({
            firstLevelName: "",
            healthEventName: "",
            healthEventItem: {},
          });
        });
      } else if (res.flag === "year") {
        this.scrollFuc("year", {year: res.year}, (value, index) => {
          // debugger
          console.log(
            'document.getElementById("scrollBody").scrollTop',
            document.getElementById("scrollBody").scrollTop
          );
          this.firstItemClick(value, index);
          this.setJumpToData({
            firstLevelName: "",
            healthEventName: "",
            healthEventItem: {},
          });
        });
      }
    },
  },
  // 销毁定时器
  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
    this.timer1 = null;
    this.timer2 = null;
    this.timer3 = null;
  },
};
</script>

<style lang="scss">
.firstTab {
  .tab-cont {
    height: calc(100% - 10px);
    position: relative;
    overflow-y: auto;
    .item-cont {
      margin-right: 10px;
      height: calc(100% - 10px);
      .item-detail {
        .details {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          padding: 8px 10px 9px 10px;
          border-radius: 2px;
          font-size: 14px;
          font-family: Roboto;
          background-color: #fff;
          border: 1px solid transparent;
          border-bottom: 1px solid #e5e5e5;
          cursor: pointer;
          .type {
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-radius: 4px;
            text-align: center;
            opacity: 0.8;
            border-radius: 4px;
            background-color: #5e84d7;
            color: #fff;
            // color: #5e84d7;
            // border: 1px solid #5e84d7;
          }
          .cont {
            width: calc(100% - 48px);
            margin-left: 8px;
          }
          .top {
            line-height: 24px;
            font-size: 16px;
            font-family: SourceHanSansSC-medium;
            color: rgba(94, 132, 215, 100);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
          .bottom {
            line-height: 17px;
            opacity: 0.85;
            color: rgba(255, 255, 255, 100);
            font-size: 12px;
            font-family: SourceHanSansSC-regular;
            color: rgba(51, 51, 51, 100);
          }
          .top,
          .bottom {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .date {
            width: 85px;
            line-height: 24px;
            opacity: 0.85;
            color: #919191;
            font-size: 14px;
            font-family: SourceHanSansSC-medium;
          }
        }
        .activity {
          background-color: #f5f8ff;
          border: 1px solid #5e84d7;
          .type {
            // opacity: 1;
            // background-color: #799ce8;
          }
          .top {
            color: #5e84d7;
          }
          .date {
            color: #5e84d7;
          }
        }
      }
      .item-bottom {
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
        text-align: center;
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
  .el-popper[x-placement^="bottom"] {
    margin-top: 0;
    .popper__arrow {
      display: none;
    }
  }
}

.year {
  margin-bottom: 5px;
  // padding-top: 10px;
  color: #5a5a5a;
  font-size: 14px;
  text-align: left;
  font-family: SourceHanSansSC-medium;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .year-cont {
    background-image: linear-gradient(
      360deg,
      rgba(94, 132, 215, 0.25) 50%,
      transparent 40%,
      transparent
    );
  }
  .dateSelector {
    width: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .text {
      height: 23px;
    }
    /* .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
              width: 0;
              height: 23px;
            }
            .el-input__prefix {
              top: -4px;
              left: 0px;
            }
            .el-input--prefix .el-input__inner {
              padding-left: 0;
              border: none;
              background: transparent;
              height: 23px;
            }
            .el-icon-date:before {
              content: "年份\e790";
            } */
    .el-input__icon {
      width: 45px;
      color: #333;
      font-size: 14px;
      text-align: left;
      font-family: SourceHanSansSC-regular;
    }
    .el-icon-arrow-up:before {
      content: "年份\e790";
    }
    .is-reverse.el-icon-arrow-up:before {
      content: "年份";
    }
    .el-input--suffix .el-input__inner {
      padding-left: 0;
      border: none;
      background: transparent;
      height: 23px;
      width: 0;
    }
    .el-select .el-input .el-select__caret {
      transform: rotateZ(0);
      transform: translateX(20px);
    }
    .el-select .el-input .el-select__caret.is-reverse {
      transform: rotateZ(0);
      transform: translateX(20px);
    }
  }
}

.fixedTop {
  // margin-top: 10px;
  position: absolute;
  left: 0;
  right: 16px;
  z-index: 111;
  background-color: #fff;
  height: 24px;
}
</style>
