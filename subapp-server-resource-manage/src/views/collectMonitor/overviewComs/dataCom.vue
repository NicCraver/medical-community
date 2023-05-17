<template>
  <el-card class="dataCom">
    <div class="title">
      <div class="left-title">
        <span class="title-info">{{ titleObj.title }}</span>
        <span class="unit">{{ titleObj.unit }}</span>
      </div>
      <div class="right-title">
        <span :class="{ select: yearCurrent === '1' }" @click="yearClick('1')"
          >累计</span
        >
        <span
          :class="{
            select: yearCurrent === '2',
            disabledCls: yearCurrent === '1' && dataObj.endVal == 0,
          }"
          @click="yearClick('2')"
          >本年</span
        >
      </div>
    </div>
    <div class="data-cont">
      <div class="left-cont">
        <countTo
          :startVal="dataObj.startVal"
          :endVal="dataObj.endVal"
          :duration="durationNum"
        ></countTo>
        <span
          v-show="flag !== '1'"
          :class="{
            toIndex: true,
            toUp: dataObj.ratio > 0,
            toLow: dataObj.ratio < 0,
          }"
        >
          {{
            dataObj.ratio > 0
              ? `+${dataObj.ratio}%`
              : dataObj.ratio < 0
              ? `${dataObj.ratio}%`
              : ""
          }}
        </span>
      </div>
      <div
        class="right-cont"
        :style="{ 'background-image': `url(${urls.outUrl})` }"
      >
        <div
          v-if="urls.inUrl"
          class="cont"
          :style="{ 'background-image': `url(${urls.inUrl})` }"
        ></div>
      </div>
    </div>
  </el-card>
</template>
<script>
import countTo from "vue-count-to";
export default {
  name: "dataCom",
  components: { countTo },
  props: {
    flag: {
      type: String,
      default: "",
    },
    dataComData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      yearCurrent: "1",
      durationNum: 1000,
      dataObj: {
        startVal: 0,
        endVal: 0,
        ratio: 0,
      },
    };
  },
  computed: {
    titleObj() {
      switch (this.flag) {
        case "1":
          return {
            title: "医疗机构",
            unit: "家",
          };
        case "2":
          return {
            title: "采集数据",
            unit: "份",
          };
        case "3":
          return {
            title: "健康档案",
            unit: "份",
          };
      }
    },
    urls() {
      switch (this.flag) {
        case "1":
          return {
            outUrl: require("img/collectMonitor/col1-1.png"),
            inUrl: require("img/collectMonitor/col1-2.png"),
          };
        case "2":
          return {
            outUrl: require("img/collectMonitor/col2-1.png"),
            inUrl: "",
          };
        case "3":
          return {
            outUrl: require("img/collectMonitor/col3-1.png"),
            inUrl: "",
          };
      }
    },
  },
  watch: {
    dataComData: {
      handler(val) {
        this.yearClick("1");
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  methods: {
    yearClick(data) {
      if (
        data === "2" &&
        this.yearCurrent === "1" &&
        this.dataComData.allNum == 0
      ) {
        return;
      }
      this.yearCurrent = data;
      this.getData(data);
    },
    getData(data) {
      this.dataObj = {
        startVal: this.dataObj.endVal || 0,
        endVal:
          data === "1"
            ? this.dataComData.allNum || 0
            : this.dataComData.yearNum || 0,
        ratio: data === "1" ? "" : this.dataComData.ratio, //在累计条件下不应该展示趋势比。
      };
    },
  },
};
</script>
<style lang="less" scoped>
.dataCom {
  height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    .left-title {
      line-height: 25px;
      color: rgba(48, 51, 19, 100);
      font-size: 14px;
      font-family: SourceHanSansSC-medium;
      border-bottom: 1px solid rgba(233, 233, 233, 94);
      padding-right: 50px;
      .title-info {
        font-weight: 700;
        margin-right: 5px;
      }
      .unit {
        color: rgba(145, 145, 145, 100);
        font-family: SourceHanSansSC-regular;
      }
    }
    .right-title {
      span {
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        border-radius: 2px;
        background-color: rgba(255, 255, 255, 100);
        color: rgba(93, 118, 217, 100);
        font-size: 12px;
        text-align: center;
        font-family: Roboto;
        border: 1px solid rgba(93, 118, 217, 100);
        cursor: pointer;
      }
      span:nth-child(1) {
        border-right: 0;
      }
      span.select {
        background-color: rgba(93, 118, 217, 100);
        color: rgba(254, 255, 254, 100);
      }
      span.disabledCls {
        background-color: rgba(233, 233, 233, 100);
        color: rgba(145, 145, 145, 100);
        border: 1px solid rgba(192, 195, 203, 100);
      }
    }
  }
  .data-cont {
    height: calc(100% - 26px);
    padding: 0 30px 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-cont {
      color: rgba(48, 49, 51, 100);
      font-size: 24px;
      font-family: Roboto-regular;
      display: flex;
      align-items: center;
      .toIndex {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        margin-left: 10px;
        padding: 0 15px;
        font-family: Roboto;
        font-size: 12px;
        border-radius: 6px;
      }
      .toUp {
        background-color: #f2fff8;
        color: #65e5a5;
      }
      .toLow {
        opacity: 1;
        background-color: #fee9e9;
        color: #ff5b5c;
      }
    }
    .right-cont {
      width: 75px;
      height: 43px;
      .cont {
        width: 24px;
        height: 25px;
        margin-top: 10px;
        margin-left: 6px;
      }
    }
  }
}
</style>