<template>
  <div class="recent-visit">
    <div class="r-tit">
      <span
        class="r-tit-left"
        :style="{
          backgroundImage:
            'linear-gradient(360deg, rgba(' +
            color +
            ',0.35) 50%, transparent 50%, transparent)',
        }"
        >{{ titleName }}</span
      >
      <span
        class="r-tit-right"
        v-if="dataObj.list && dataObj.list.length > 0"
        @click="showMore"
        >{{ dataObj.year }}年
        <IconSvg
          iconClass="more"
          width="18"
          height="18"
          style="margin: -2px 0 0 -8px; cursor: pointer; vertical-align: middle"
        ></IconSvg
      ></span>
    </div>
    <div class="r-cont" v-if="dataObj.list && dataObj.list.length">
      <el-row
        class="border"
        v-for="(item, index) in dataObj.list"
        :key="index"
        @click.native="itemShowMore(item)"
      >
        <el-col :span="2"
          ><div
            class="date-cirle"
            v-if="item.reportDate"
            :style="{ backgroundColor: 'rgb(' + color + ')' }"
          >
            {{ dateFilter(item.reportDate) }}
            <!-- {{ item.reportDate.split("-")[2].split(" ")[0] }}<span>/</span
            >{{ item.reportDate.split("-")[1] }} -->
          </div></el-col
        >
        <el-col :span="20" :offset="1">
          <div class="r-cont-top">
            <div class="overflow-point" :title="item.itemName || ''">
              {{ item.itemName }}
            </div>
            <div
              :style="{
                color: 'rgb(' + color + ')',
                border: '1px solid rgb(' + color + ')',
              }"
              class="itemType overflow-point"
              :title="item.diagName || ''"
            >
              {{ item.diagName }}
            </div>
          </div>
          <div
            class="r-cont-bottom overflow-point"
            :title="`${item.hospitalName}-${item.departmentName}`"
          >
            {{ item.hospitalName }}-{{ item.departmentName }}
          </div>
        </el-col>
        <el-col :span="1">
          <div style="margin-top: 9px">
            <i class="el-icon-arrow-right"></i>
          </div>
        </el-col>
      </el-row>
      <el-divider
        content-position="center"
        v-if="dataObj.list.length < Number(showNum)"
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
import { mapActions } from "vuex";
import {
  getRecent,
  getRecentData,
  getRecentDataP,
} from "@/api/modules/healthRecord/index.js";

let objYS = {
  assays: "L",
  checks: "R",
  recipes: "pharmacy",
};
export default {
  components: {},
  props: {
    titleName: String,
    showNum: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "",
    },
    pAId: {
      type: String,
      default: "",
    },
  },
  computed: {},
  data() {
    return {
      color: "87, 181, 170",
      dataObj: {},
    };
  },
  watch: {
    pAId: {
      handler(val) {
        if (val && this.showNum) {
          this.getAll();
        }
      },
      deep: true,
      immediate: true,
    },
    showNum: {
      handler(val) {
        if (val) {
          this.getAll();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    ...mapActions({
      setJumpToData: "base/setJumpToData",
    }),
    // 查询检验、检查、用药
    getAll() {
      this.dataObj = {
        year: "",
        list: [],
      };
      switch (this.type) {
        case "assays":
          // 近期检验
          // this.getModules("tbMedicalAssayRecord", "getRecentAssays", "assays");
          this.getRecentList("L");
          break;
        case "checks":
          //近期检查
          this.getRecentList("R");
          // this.getModules("tbMedicalCheckRecord", "getRecentChecks", "checks");
          break;
        case "recipes":
          //近期用药
          this.getRecentListP();
          // this.getModules("tbRecipeController", "getRecentRecipes", "recipes");
          break;
      }
    },
    // 检验、检查
    async getRecentList(type) {
      if (!this.pAId) return;
      try {
        let params = {
          fAId: this.pAId,
          size: this.showNum,
          type,
        };
        let res = await getRecentData(params);
        console.log("近期" + type + "。个数是：" + this.showNum, res);
        let dataObj = {
          year: res.result.year,
          list: [],
        };
        res.result.itemList.map((item) => {
          dataObj.list.push({
            ...item,
            itemName: item.itemName,
            reportDate: item.itemDate,
            diagName: item.itemLabel,
            hospitalName: item.hospitalName,
            departmentName: item.departmentName,
            // reportId: item.serialNumber,
            // itemCode: item.serialNumber,
          });
        });
        this.dataObj = dataObj;
      } catch (error) {}
    },
    // 用药
    async getRecentListP() {
      if (!this.pAId) return;
      try {
        let params = {
          fAId: this.pAId,
          size: this.showNum,
        };
        let res = await getRecentDataP(params);
        console.log("近期用药，个数是：" + this.showNum, res);
        let dataObj = {
          year: res.result.year,
          list: [],
        };
        res.result.itemList.map((item) => {
          dataObj.list.push({
            ...item,
            itemName: item.itemName,
            reportDate: item.itemDate,
            diagName: item.itemLabel,
            hospitalName: item.hospitalName,
            departmentName: item.departmentName,
          });
        });
        this.dataObj = dataObj;
      } catch (error) {}
    },
    // 旧接口
    async getModules(dic, url, obj) {
      if (!this.pAId) return;
      try {
        let params = {
          size: this.showNum,
          pAId: this.pAId,
        };
        let res = await getRecent(params, dic, url);
        if (res.code === 0) {
          console.log(obj + "近期检查等。个数是：" + this.showNum, res);
          let dataObj = {
            year: res.result.year,
            list: [],
          };
          if (obj === "recipes") {
            let list = res.result[obj];
            list.map((item) => {
              dataObj.list.push({
                ...item,
                itemName: item.drugName,
                reportDate: item.createDate,
                diagName: item.diagName,
                hospitalName: item.hospitalName,
                departmentName: item.departmentName,
              });
            });
          } else if (obj === "assays") {
            dataObj.list = res.result[obj];
          } else {
            let list = res.result[obj];
            list.map((item) => {
              dataObj.list.push({
                ...item,
                itemName: item.itemName,
                reportDate: item.reportDate,
                diagName: item.itemTypeName,
                hospitalName: item.hospitalName,
                departmentName: item.departmentName,
              });
            });
          }
          this.dataObj = dataObj;
        }
      } catch (error) {}
    },
    showMore() {
      //跳转到健康事件界面
      this.setJumpToData({
        firstLevelName: "two",
        healthEventName: "second",
        healthEventItem: {
          list: this.dataObj.list,
          type: objYS[this.type],
          flag: "list",
          year: this.dataObj.year,
        },
      });
    },
    dateFilter(value) {
      return this.dayjs(value).format("MM/DD");
    },
    itemShowMore(item) {
      if (item.hasOwnProperty("isPrivacy") && item.isPrivacy === "0") {
        this.$message.warning("该数据为隐私数据，无法查看。");
        return;
      }
      //跳转到健康事件界面
      this.setJumpToData({
        firstLevelName: "two",
        healthEventName: "second",
        healthEventItem: {
          item,
          itemFlag: "serialNumber", //精准定位的依据字段
          type: objYS[this.type],
          flag: "item",
          year: this.dataObj.year,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.recent-visit {
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
      background-size: 50% 80%;
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
        color: #fff;
        text-align: center;
        line-height: 32px;
        letter-spacing: -1px;
        font-size: 12px;
      }
      .r-cont-top {
        color: rgb(16, 16, 16);
        line-height: 20px;
        display: flex;
        .itemType {
          line-height: 12px;
          height: 18px;
          display: inline-block;
          font-size: 12px;
          padding: 2px 10px;
          margin-left: 8px;
          max-width: 150px;
        }
      }
      .r-cont-bottom {
        line-height: 20px;
        color: rgba(16, 16, 16, 0.6);
      }
    }
    .el-row:last-child {
      border-bottom: none;
    }
    .el-row:hover {
      background-color: #57b5aa12;
    }
  }
  .r-cont.no-data {
    color: #999;
    margin-top: 10%;
    text-align: center;
    color: rgba(136, 137, 142, 100);
  }
}
::v-deep .el-divider {
  background-color: #f4f4f4;
}
::v-deep .el-divider__text {
  color: #10101099;
}
</style>
