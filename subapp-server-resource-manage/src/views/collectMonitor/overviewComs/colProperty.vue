<template>
  <el-card class="colProperty">
    <div class="title">
      <div class="title-info">采集性能</div>
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
export default {
  name: "colProperty",
  data() {
    return {
      natureData: [
        {
          title: "吞吐量",
          info: "每分钟请求数",
          num: 56,
          icons: "database",
          color: "#6F9BF0",
          bgColor: "#E2ECFF",
          size: "20"
        },
        {
          title: "性能",
          info: "90%的请求相应时间（秒）",
          num: 0.3,
          icons: "antOutline-table",
          color: "#13C2C2",
          bgColor: "#CBF4F8",
          size: "16"
        },
        {
          title: "成功率",
          info: "两次测量间成功执行的查询百分比",
          num: 98.9,
          icons: "md-web",
          color: "#FF5B5C",
          bgColor: "#FEDDDD",
          size: "20"
        },
        {
          title: "失败率",
          info: "两次测量间执行失败的查询百分比",
          num: 1.1,
          icons: "iconParkBroadcast",
          color: "#39DA8A",
          bgColor: "#D2FFE8",
          size: "20"
        },
      ],
    };
  },
  methods: {
    // 获取数据
    getNatureData() {},
  },
};
</script>
<style lang="less" scoped>
.colProperty {
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