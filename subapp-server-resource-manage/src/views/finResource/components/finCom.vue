<template>
  <el-card class="finCom">
    <div class="title">
      <div class="title-info">资产</div>
      <div class="date-select">
        <el-select
          v-model="dateVal"
          placeholder="请选择"
          size="small"
          style="width: 100px"
          @change="dateChange"
        >
          <el-option
            v-for="item in dateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="cont">
      <div class="cont-item" v-for="(item, index) in natureData" :key="index">
        <div class="left-item">
          <div class="iconfont" :style="{ background: item.bgColor }">
            <IconSvg
              :iconClass="item.icons"
              :style="{ color: item.color }"
              :width="item.size || 20"
              :height="item.size || 20"
            ></IconSvg>
          </div>
          <div class="info">
            <div>{{ item.title }}</div>
            <div class="bottom-info">{{ item.info }}</div>
          </div>
        </div>
        <div class="right-item">{{ item.num }}</div>
      </div>
    </div>
  </el-card>
</template>
<script>
import { getAsset } from "api/finResource.js";

export default {
  name: "finCom",
  data() {
    return {
      loading: false,
      dateVal: "",
      dateOptions: [
        {
          label: "全部",
          value: "",
        },
        /* {
          label: "本年",
          value: "1",
        },
        {
          label: "本月",
          value: "2",
        },
        {
          label: "本周",
          value: "3",
        }, */
      ],
      // 资产数据
      natureData: [
        {
          prop: "schemaCount",
          title: "数据库",
          info: "统计平台数据库总个数",
          num: 0,
          icons: "database",
          color: "#6F9BF0",
          bgColor: "#E2ECFF",
          size: "20",
        },
        {
          prop: "tableCount",
          title: "数据表",
          info: "统计平台内数据表总张数",
          num: 0,
          icons: "antOutline-table",
          color: "#13C2C2",
          bgColor: "#CBF4F8",
          size: "16",
        },
        {
          prop: "viewCount",
          title: "数据视图",
          info: "统计平台内数据视图总张数",
          num: 0,
          icons: "md-web",
          color: "#FF5B5C",
          bgColor: "#FEDDDD",
          size: "20",
        },
        {
          prop: "rowCount",
          title: "数据条数",
          info: "统计平台内数据总条数",
          num: 0,
          icons: "iconParkBroadcast",
          color: "#39DA8A",
          bgColor: "#D2FFE8",
          size: "20",
        },
      ],
    };
  },
  created() {
    this.getNatureData();
  },
  methods: {
    dateChange() {
      this.getNatureData();
    },
    // 获取资产数据
    async getNatureData() {
      this.loading = true;
      try {
        let params = {};
        let { result, code } = await getAsset();
        if (code === 0) {
          console.log("资产数据:", result);
          this.handleData(result);
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleData(data) {
      for (let i in this.natureData) {
        let item = this.natureData[i];
        this.$set(item, "num", data[item.prop] || 0);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.finCom {
  height: 100%;
  .title {
    height: 30px;
    padding: 0 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(48, 49, 51, 100);
    font-size: 18px;
    font-family: SourceHanSansSC-medium;
    .title-info {
      font-weight: 700;
    }
  }
  .cont {
    height: calc(100% - 40px);
    overflow-y: auto;
    .cont-item {
      padding: 0 10px;
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left-item {
        display: flex;
        align-items: center;
        .iconfont {
          margin-right: 15px;
          width: 36px;
          height: 36px;
          border-radius: 36px;
          line-height: 36px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .info {
          line-height: 24px;
          color: rgba(48, 49, 51, 100);
          font-size: 16px;
          font-family: SourceHanSansSC-regular;
          .bottom-info {
            line-height: 20px;
            color: rgba(145, 145, 145, 100);
            font-size: 14px;
          }
        }
      }
      .right-item {
        line-height: 26px;
        color: rgba(48, 49, 51, 100);
        font-size: 18px;
        font-family: SourceHanSansSC-regular;
      }
    }
  }
}
</style>