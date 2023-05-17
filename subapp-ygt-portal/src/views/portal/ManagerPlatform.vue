<!-- 
  @description 工作台-管理员门户
  @date 2021/12/07
 -->
<template>
  <div class="manager">
    <!-- 动态消息 -->
    <el-card class="message">
      <header>动态消息</header>
      <el-scrollbar>
        <el-empty description="暂无数据" :image-size="55" v-show="messageData.length == 0"></el-empty>
        <div class="message-list" v-for="item in messageData" :key="item.messageId">
          <i class="iconfont icon-message" :style="{color: item.msgTo==0? '#EE0C00':'#909399'}"></i>
          <div class="content">
            <span class="title">{{msgTitle(item.msgSendType)}}</span>
            <a @click="msgClick(item)">{{item.content}}</a>
          </div>
          <p class="time">{{item.createDate}}</p>
        </div>
      </el-scrollbar>
    </el-card>
    <!-- 日历 -->
    <el-card class="calendar">
      <v-calendar :attributes="calendarAttr" is-expanded></v-calendar>
    </el-card>
    <!-- 第三方快捷入口 -->
    <el-card class="fast-entrance">
      <header>全部应用</header>
      <div class="content">
        <el-scrollbar>
          <div class="system" v-for="item in apps" :key="item.id" @click="jump(item.extranetPath)">
            <el-image style="width: 85px; height: 85px" :src="item.logoPath" fit="fill">
              <div slot="error" class="image-err">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <p>{{item.name}}</p>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { getMessage } from "api/platform.js";
import { getApplicationList } from "api/authority.js";

export default {
  data() {
    return {
      userId: "",
      messageData: [], //动态消息
      calendarAttr: [
        {
          key: "today",
          dates: new Date(),
          highlight: true,
        },
      ], //日历配置
      apps: [
        {
          logoPath: require("assets/example/platform-1.png"),
          name: "EHR",
        },
        {
          logoPath: require("assets/example/platform-2.png"),
          name: "慢病管理",
        },
        {
          logoPath: require("assets/example/platform-3.png"),
          name: "会诊管理",
        },
        {
          logoPath: require("assets/example/platform-4.png"),
          name: "规范化",
        },
        {
          logoPath: require("assets/example/platform-5.png"),
          name: "智能助手",
        },
        { logoPath: require("assets/example/11.png"), name: "主数据" },
        { logoPath: require("assets/example/12.png"), name: "共享文档" },
        {
          logoPath: require("assets/example/platform-7.png"),
          name: "患者主索引",
        },
        {
          logoPath: require("assets/example/platform-6.png"),
          name: "ESB",
        },
        {
          logoPath: require("assets/example/platform-8.png"),
          name: "综合监管",
        },
        {
          logoPath: require("assets/example/platform-9.png"),
          name: "云公卫",
        },
        {
          logoPath: require("assets/example/platform-10.png"),
          name: "患者端",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["msgTitle"]),
  },
  mounted() {
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
      // 广播消息
      getMessage(this.userId).then((res) => {
        this.messageData = res.result;
      });
      // 应用
      getApplicationList().then((res) => {
        this.apps = res.result;
      });
    }
  },
  methods: {
    msgClick(item) {
      console.log(item.message);
    },
    jump(url) {
      window.history.pushState("", "", url);
    },
  },
};
</script>

<style lang="scss" scoped>
.manager {
  height: calc(100% - 50px);
  padding: 16px;
}
header {
  font-weight: 700;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 16px;
}
.message {
  float: left;
  width: 70%;
  height: 268px;
  margin: 0 16px 16px 0;
  .el-scrollbar {
    height: 180px;
  }
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
.calendar {
  ::v-deep .el-card__body {
    padding: 0;
  }
  .vc-container {
    border: none;
    height: 266px;
  }
}
.fast-entrance {
  float: left;
  width: 100%;
  height: calc(100% - 284px);
  .content {
    height: calc(100% - 46px);
  }
  .system {
    float: left;
    width: 85px;
    cursor: pointer;
    margin: 0 16px 32px 16px;
    ::v-deep .image-err {
      width: 85px;
      height: 85px;
      text-align: center;
      i {
        font-size: 25px;
        color: #909399;
        margin-top: 30px;
      }
    }
    p {
      font-size: 16px;
      text-align: center;
      height: 40px;
      line-height: 20px;
      overflow: hidden;
      word-wrap: break-word;
    }
  }
}
</style>
