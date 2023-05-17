<!-- 
  @description 工作台-运维门户
  @date 2022/02/21
 -->
<template>
  <div class="system">
    <div class="protal-title">运维门户</div>
    <!-- 用户信息 -->
    <div class="protal-main">
      <el-card class="user-info">
        <div class="left">
          <p>欢迎您，{{username}}</p>
          <p class="time">{{time}}</p>
        </div>
        <div class="right">
          <span>今日登陆人数</span>
          <span class="num">{{loginNum}}</span>
        </div>
        <el-image :src="require('assets/platform/system_user.png')"></el-image>
      </el-card>
      <el-card class="data">
        <el-radio-group v-model="exchangeType" size="mini" class="fr" @change="getChartData">
          <el-radio-button label="7d">7天</el-radio-button>
          <el-radio-button label="2w">2周</el-radio-button>
          <el-radio-button label="1m">1个月</el-radio-button>
          <el-radio-button label="3m">3个月</el-radio-button>
          <el-radio-button label="6m">6个月</el-radio-button>
        </el-radio-group>
        <div class="chart" ref="chart" id="echart"></div>
      </el-card>
      <el-card class="message">
        <el-tabs v-model="messageTabName">
          <el-tab-pane label="最新动态" name="news">
            <el-scrollbar>
              <el-empty description="暂无数据" :image-size="70" v-show="newsData.length == 0"></el-empty>
              <div class="message-list" v-for="item in newsData" :key="item.messageId">
                <i class="iconfont icon-message"></i>
                <div class="content">
                  <span class="title">{{msgTitle(item.msgSendType)}}</span>
                  <a>{{item.content}}</a>
                </div>
                <p class="time">{{item.createDate}}</p>
              </div>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="消息" name="message">
            <el-scrollbar>
              <el-empty description="暂无数据" :image-size="70" v-show="messageData.length == 0"></el-empty>
              <div class="message-list" v-for="item in messageData" :key="item.messageId">
                <i class="iconfont icon-message"></i>
                <div class="content">
                  <span class="title">{{msgTitle(item.msgSendType)}}</span>
                  <a>{{item.content}}</a>
                </div>
                <p class="time">{{item.createDate}}</p>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-card class="apps">
        <el-tabs v-model="appTabName">
          <el-tab-pane label="技术应用" name="technology">
            <el-scrollbar>
              <div class="apps-list" v-for="item in technologyData" :key="item.id">
                <el-image style="width: 70px; height: 70px" :src="item.logoPath" fit="fill">
                  <div slot="error" class="image-err">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>{{item.name}}</p>
              </div>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="业务协同" name="work">
            <el-scrollbar>
              <div class="apps-list" v-for="item in workData" :key="item.id">
                <el-image style="width: 70px; height: 70px" :src="item.logoPath" fit="fill">
                  <div slot="error" class="image-err">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>{{item.name}}</p>
              </div>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="创新应用" name="innovation">
            <el-scrollbar>
              <div class="apps-list" v-for="item in innovationData" :key="item.id">
                <el-image style="width: 70px; height: 70px" :src="item.logoPath" fit="fill">
                  <div slot="error" class="image-err">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <p>{{item.name}}</p>
              </div>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";

import { getLoginNum, getExchangeChart, getMessage } from "api/platform.js";
import { getApplicationList } from "api/authority.js";

export default {
  data() {
    return {
      userId: "",
      username: "",
      loginNum: "0", //今日登陆人数
      time: "",
      echartData: {
        date: [],
        yesterday: [],
        today: [],
        disable: [],
      }, //交换标准数据量
      exchangeChart: null,
      exchangeType: "7d", //交换标准数据量日期类型
      messageTabName: "news",
      newsData: [], //最新动态
      messageData: [], //消息
      appTabName: "technology",
      technologyData: [], //技术应用
      workData: [], //业务协同
      innovationData: [], //创新应用
    };
  },
  computed: {
    ...mapGetters(["msgTitle"]),
  },
  mounted() {
    setInterval(this.getTime, 1000);
    if (!sessionStorage.getItem("userId")) {
      this.$confirm("获取用户信息失败，请重新登录", "提示", {
        showCancelButton: false,
        type: "warning",
      })
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => {});
    } else {
      this.userId = sessionStorage.getItem("userId");
      this.username = sessionStorage.getItem("username");
      // 登陆人数
      getLoginNum().then((res) => {
        this.loginNum = res.result;
      });
      this.getChartData();
      // 最新动态&消息 暂时用一个
      getMessage(this.userId).then((res) => {
        this.newsData = res.result;
        this.messageData = res.result;
      });
      // 应用
      getApplicationList().then((res) => {
        this.technologyData = res.result.filter((item) => item.appType == "1");
        this.workData = res.result.filter((item) => item.appType == "2");
        this.innovationData = res.result.filter((item) => item.appType == "3");
      });
    }
  },
  methods: {
    // 获取交换标准数据量
    getChartData() {
      getExchangeChart({ date: this.exchangeType }).then((res) => {
        this.echartData = res.result;
        this.initEchart();
      });
    },
    // 当前时间
    getTime() {
      this.time = this.dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss");
    },
    // 初始化图表
    initEchart() {
      if (!this.exchangeChart) {
        this.exchangeChart = echarts.init(this.$refs.chart);
      }
      let option = {
        color: ["#B8D9FD", "#919191", "#FFCCC7"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["昨日累计(条数)", "今日新增(条数)", "停用(条数)"],
        },
        grid: {
          left: "0",
          right: "20px",
          top: "40px",
          bottom: "0",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.echartData.date,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "昨日累计(条数)",
            type: "line",
            smooth: true,
            showSymbol: false,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(184, 217, 253, 0.4)", // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: "rgba(184, 217, 253, 0.1)", // 渐变线的结束颜色
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
            emphasis: {
              focus: "series",
            },
            data: this.echartData.yesterday,
          },
          {
            name: "今日新增(条数)",
            type: "line",
            smooth: true,
            showSymbol: false,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(145, 145, 145, 0.4)", // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: "rgba(145, 145, 145, 0.1)", // 渐变线的结束颜色
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
            emphasis: {
              focus: "series",
            },
            data: this.echartData.today,
          },
          {
            name: "停用(条数)",
            type: "line",
            smooth: true,
            showSymbol: false,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(255, 204, 199, 0.4)", // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: "rgba(255, 204, 199, 0.1)", // 渐变线的结束颜色
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
            emphasis: {
              focus: "series",
            },
            data: this.echartData.disable,
          },
        ],
      };
      this.exchangeChart.setOption(option);
      window.addEventListener("resize", () => {
        this.exchangeChart.resize();
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.getTime);
  },
};
</script>

<style lang="scss" scoped>
.system {
  height: 100%;
  .user-info {
    float: left;
    position: relative;
    width: 70%;
    height: 170px;
    font-size: 16px;
    margin-bottom: 16px;
    margin-right: 16px;
    .el-image {
      position: absolute;
      left: 40%;
      bottom: 0;
    }
    .left {
      float: left;
      margin-top: 40px;
      width: 40%;
      line-height: 30px;
      .time {
        font-weight: 700;
      }
    }
    .right {
      float: right;
      margin-top: 60px;
      .num {
        display: inline-block;
        margin-left: 10px;
        width: 60px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 8px;
        font-size: 20px;
        font-weight: 700;
        background-color: #6b73ca;
        color: #fff;
      }
    }
  }
  .data {
    float: left;
    position: relative;
    width: 70%;
    height: 325px;
    margin-bottom: 16px;
    &::before {
      content: "交换标准数据量";
      position: absolute;
      top: 16px;
      left: 16px;
      font-size: 16px;
      font-weight: 700;
    }
    .chart {
      margin-top: 30px;
      height: calc(100% - 30px);
      width: 100%;
    }
  }
  .message {
    float: left;
    width: 70%;
    height: calc(100% - 527px);
    .message-list {
      position: relative;
      height: 60px;
      padding: 5px 32px;
      overflow: hidden;
      line-height: 25px;
      i {
        position: absolute;
        left: 0;
        top: 10px;
        font-size: 24px;
        color: #909399;
      }
      .content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .title {
          font-weight: 700;
          margin-right: 5px;
        }
        a {
          color: #409eff;
          cursor: pointer;
        }
      }
      .time {
        color: #909399;
      }
    }
  }
  .apps {
    position: relative;
    height: 100%;
    .el-tabs {
      margin-top: 27px;
      height: calc(100% - 27px);
      .el-tab-pane {
        height: 100%;
      }
      .apps-list {
        float: left;
        width: 70px;
        cursor: pointer;
        margin: 0 35px 40px 35px;
        ::v-deep .image-err {
          width: 70px;
          height: 70px;
          text-align: center;
          i {
            font-size: 25px;
            color: #909399;
            margin-top: 30px;
          }
        }
        p {
          font-size: 14px;
          text-align: center;
          height: 40px;
          line-height: 20px;
          overflow: hidden;
          word-wrap: break-word;
        }
      }
    }
  }
  .user-info::before,
  .apps::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 27px;
    background-color: #f4f3f8;
  }
  .el-tabs {
    height: 100%;
    ::v-deep .el-tabs__header {
      margin-bottom: 10px;
    }
    ::v-deep .el-tabs__item {
      height: 32px;
      line-height: 32px;
    }
    ::v-deep .el-tabs__content {
      height: calc(100% - 42px);
    }
  }
}
</style>
