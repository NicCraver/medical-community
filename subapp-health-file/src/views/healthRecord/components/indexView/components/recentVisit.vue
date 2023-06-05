<template>
  <div class="recent-visit">
    <div class="r-tit">
      <span class="r-tit-left">{{ titleName }}</span>
      <span class="r-tit-right" v-if="list && list.length > 0"
        >{{ year || "--" }}年
        <span @click="showMore">
          <IconSvg
            iconClass="more"
            width="18"
            height="18"
            style="
              margin: -2px 0 0 -8px;
              cursor: pointer;
              vertical-align: middle;
            "
          ></IconSvg> </span
      ></span>
    </div>
    <div class="r-cont" v-if="list && list.length > 0">
      <el-row
        class="border"
        v-for="item in list"
        :key="item.id"
        @click.native="itemShowMore(item)"
      >
        <el-col :span="2">
          <div class="date-cirle">{{ dateFilter(item.itemDate) }}</div>
        </el-col>
        <el-col :span="20" :offset="1">
          <div class="r-cont-top">
            <div class="overflow-point" :title="item.itemName || ''">
              {{ item.itemName }}
            </div>
            <div
              class="itemType overflow-point"
              :title="item.itemType || ''"
              v-if="item.itemType != ''"
            >
              {{ item.itemType }}
            </div>
          </div>
          <div class="r-cont-bottom ellipsis" :title="concatStr(item)">
            {{ concatStr(item) }}
          </div>
        </el-col>
        <el-col :span="1">
          <div class="cursor-pointer" style="margin-top: 9px">
            <i class="el-icon-arrow-right"></i>
          </div>
        </el-col>
      </el-row>
      <el-divider
        content-position="center"
        v-if="list.length < Number(showNum)"
      >
        没有更多啦
      </el-divider>
    </div>
    <div v-else class="r-cont no-data">
      <IconSvg
        iconClass="empty-box"
        style="color: rgb(202, 205, 212)"
        width="80"
        height="80"
      ></IconSvg>
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import {
  getRecentVisitRecord,
  getRecentMedicalExamRecord,
  getRecentOperationRecord,
} from "@/api/modules/healthRecord/index.js";
import { mapActions } from "vuex";

export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    pAId: {
      type: String,
      default: "",
    },
    showNum: {
      type: Number,
      default: 0,
    },
    titleName: {
      type: String,
      default: "",
    },
  },
  components: {},
  mounted() {},
  data() {
    return {
      list: [],
      year: "",
    };
  },
  filters: {},
  watch: {
    pAId: {
      handler(val) {
        if (!val) {
          return;
        }
        this.list = [];
        this.year = "";
        switch (this.type) {
          case "MedicalExamRecord":
            if (this.showNum) {
              this.getRecentMedicalExamRecord();
            }
            break;
          case "operation":
            this.getRecentOperationRecord();
            break;
          case "visit":
            this.getRecentVisitRecord();
            break;
        }
      },
      deep: true,
      immediate: true,
    },
    showNum: {
      handler(val) {
        if (val && this.type === "MedicalExamRecord") {
          this.list = [];
          this.year = "";
          this.getRecentMedicalExamRecord();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      setJumpToData: "base/setJumpToData",
    }),
    showMore() {
      //跳转到健康事件界面
      this.setJumpToData({
        firstLevelName: "two",
        healthEventName: this.type === "operation" ? "second" : "first",
        healthEventItem: {
          list: this.list,
          type: this.type === "operation" ? "S" : this.type,
          flag: "list",
          year: this.year,
        },
      });
    },
    itemShowMore(item) {
      if (item.hasOwnProperty("isPrivacy") && item.isPrivacy === "0") {
        this.$message.warning("该数据为隐私数据，无法查看。");
        return;
      }
      //跳转到健康事件界面
      this.setJumpToData({
        firstLevelName: "two",
        healthEventName: this.type === "operation" ? "second" : "first",
        healthEventItem: {
          item,
          itemFlag: "serialNumber", //精准定位的依据字段
          type: this.type === "operation" ? "S" : this.type,
          flag: "item",
          year: this.year,
        },
      });
    },
    concatStr(item) {
      let { hospitalName = "", departmentName = "" } = item;
      if (hospitalName && departmentName) {
        return hospitalName + "-" + departmentName;
      } else {
        return hospitalName + departmentName;
      }
    },
    dateFilter(value) {
      return this.dayjs(value).format("MM/DD");
    },
    //最近体检
    async getRecentMedicalExamRecord() {
      if (!this.pAId) return;
      let { code, desc, result } = await getRecentMedicalExamRecord({
        fAId: this.pAId,
        size: this.showNum,
      });
      console.log("首页体检数据", result);
      if (code == 0) {
        let { itemList, year } = result || {};
        this.year = year;
        let list = [];
        for (let i in itemList) {
          let item = itemList[i];
          list.push({
            ...item,
            itemType: item.itemLabel,
          });
        }
        this.list = list;
      } else {
        // this.$message.error(desc || "获取近期就诊数据错误");
      }
    },
    //最近手术
    async getRecentOperationRecord() {
      if (!this.pAId) return;
      let { code, desc, result } = await getRecentOperationRecord({
        fAId: this.pAId,
        size: 3,
      });
      console.log("首页手术数据", result);
      if (code == 0) {
        let { itemList, year } = result || {};
        this.list = itemList.length > 3 ? itemList.splice(0, 3) : itemList;
        this.year = year;
      } else {
        // this.$message.error(desc || "获取近期就诊数据错误");
      }
    },
    // 最近就诊
    async getRecentVisitRecord() {
      if (!this.pAId) return;
      let {
        code,
        desc,
        result = {},
      } = await getRecentVisitRecord({
        pAId: this.pAId,
        size: 3,
      });
      console.log("首页就诊数据", result);
      if (code == 0) {
        let { itemList, year } = result || {};
        this.year = year;
        let list = [];
        for (let i in itemList) {
          let item = itemList[i];
          list.push({
            ...item,
            itemName: item.itemType,
            itemType: item.itemLabel,
          });
        }
        this.list = list.length > 3 ? list.splice(0, 3) : list;
      } else {
        // this.$message.error(desc || "获取近期就诊数据错误");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.recent-visit {
  font-family: SourceHanSansSC;
  margin: 0 25px 0;
  // height: calc(100% - 15px);
  height: 100%;
  .r-tit {
    overflow: hidden;
    line-height: 26px;
    .r-tit-left {
      display: block;
      float: left;
      font-size: 16px;
      color: #333;
      font-weight: bold;
      background-image: linear-gradient(
        360deg,
        #becbe8 50%,
        transparent 50%,
        transparent
      );
      background-size: 50% 70%;
      background-position: right;
      background-repeat: no-repeat;
    }
    .r-tit-right {
      float: right;
      color: #5a5a5a;
      font-size: 12px;
    }
  }
  .r-cont {
    // margin-top: 12px;
    height: calc(100% - 26px);
    overflow: hidden;
    .el-row {
      cursor: pointer;
      border-bottom: 1px solid #f4f4f4;
      padding-bottom: 7px;
      padding-top: 7px;
      // margin-top: 7px;
      .date-cirle {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: rgb(94, 132, 215);
        color: #fff;
        text-align: center;
        line-height: 32px;
        letter-spacing: -1px;
        font-size: 12px;
        font-weight: bold;
      }
      .r-cont-top {
        color: rgb(16, 16, 16);
        line-height: 20px;
        display: flex;
        .itemType {
          border: 1px solid #446abd;
          color: #446abd;
          line-height: 12px;
          height: 18px;
          display: inline-block;
          font-size: 12px;
          padding: 2px 10px;
          margin-left: 8px;
          max-width: 150px;
          min-width: 24px;
        }
      }
      .r-cont-bottom {
        line-height: 20px;
        // color: #999;
        color: rgba(16, 16, 16, 0.6);
        max-width: 100%;
      }
    }
    .el-row:last-child {
      border-bottom: none;
    }
    .el-row:hover {
      background-color: rgb(245, 248, 255);
    }
  }
  .r-cont.no-data {
    // color: #999;
    color: rgba(16, 16, 16, 0.6);
    margin-top: 14%;
    text-align: center;
    color: rgba(136, 137, 142, 100);
  }
}

.ellipsis {
  text-overflow: ellipsis; //文本溢出显示省略号
  white-space: nowrap; //文本不会换行
  overflow: hidden;
}
::v-deep .el-divider {
  background-color: #f4f4f4;
}
::v-deep .el-divider__text {
  color: #10101099;
}
</style>
