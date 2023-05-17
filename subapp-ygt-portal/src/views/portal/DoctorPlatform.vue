<!-- 
  @description 工作台-医生门户
  @date 2021/11/19
 -->
<template>
  <div class="platform">
    <!-- 诊疗 -->
    <el-card class="patient">
      <header>诊疗</header>
      <el-row :gutter="16">
        <el-col :span="10">
          <!-- 我的患者 -->
          <el-card shadow="never" class="my-patient">
            <div class="header">
              <span class="icon"><i class="iconfont icon-mail"></i></span>
              <span>我的患者</span>
              <el-dropdown trigger="click" @command="myPatientCommand" class="fr">
                <span class="el-dropdown-link">
                  {{myPatientTypeValue}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">今日</el-dropdown-item>
                  <el-dropdown-item command="2">本周</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-row :gutter="16" v-loading="myPatientLoading">
              <el-col :span="6">
                <div class="num">{{myPatientData.subscribeDiagnoseCount}}</div>
                <div class="name">预约</div>
              </el-col>
              <el-col :span="6">
                <div class="num">{{myPatientData.waitDiagnoseCount}}</div>
                <div class="name">待诊</div>
              </el-col>
              <el-col :span="6">
                <div class="num">{{myPatientData.inDiagnoseCount}}</div>
                <div class="name">诊中</div>
              </el-col>
              <el-col :span="6">
                <div class="num">{{myPatientData.finishDiagnoseCount}}</div>
                <div class="name">结诊</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="never">
            <div class="header">
              <span class="icon"><i class="iconfont icon-book"></i></span>
              <span>科室患者</span>
              <el-dropdown trigger="click" @command="departmentPatientCommand" class="fr">
                <span class="el-dropdown-link">
                  {{departmentPatientTypeValue}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">今日</el-dropdown-item>
                  <el-dropdown-item command="2">本周</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <el-row :gutter="16" v-loading="departmentPatientLoading">
              <el-col :span="6">
                <div class="num">{{departmentPatientData.subscribeDiagnoseCount}}</div>
                <div class="name">预约</div>
              </el-col>
              <el-col :span="6">
                <div class="num">{{departmentPatientData.waitDiagnoseCount}}</div>
                <div class="name">待诊</div>
              </el-col>
              <el-col :span="6">
                <div class="num">{{departmentPatientData.inDiagnoseCount}}</div>
                <div class="name">诊中</div>
              </el-col>
              <el-col :span="6">
                <div class="num">{{departmentPatientData.finishDiagnoseCount}}</div>
                <div class="name">结诊</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="never">
            <div class="header"><span>转诊患者</span></div>
            <el-row v-loading="changePatientLoading">
              <el-col :span="24">
                <div class="num">{{changePatientNum}}</div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 公卫/健康管理 -->
    <el-card class="health">
      <header>公卫/健康管理</header>
      <el-card shadow="never" class="health-num">
        <div class="header">
          <el-dropdown trigger="click" @command="healthCommand" class="fr">
            <span class="el-dropdown-link">
              {{healthTypeValue}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">本月</el-dropdown-item>
              <el-dropdown-item command="2">本年</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-row :gutter="16" v-loading="healthLoading">
          <el-col :span="4">
            <div class="name">签约人数</div>
            <div class="num line">{{healthData.contractCount}}</div>
          </el-col>
          <el-col :span="5">
            <div class="name">建档家庭数</div>
            <div class="num line">{{healthData.familyRecordCount}} <span class="gray">/ {{healthData.familyCount}}</span></div>
          </el-col>
          <el-col :span="5">
            <div class="name">高血压数量</div>
            <div class="num"><i class="iconfont icon-experiment-fill" style="color: #E6A23C"></i>{{healthData.hypertensionCount}}</div>
          </el-col>
          <el-col :span="5">
            <div class="name">糖尿病数量</div>
            <div class="num"><i class="iconfont icon-experiment-fill" style="color: #67C23A"></i>{{healthData.diabetesCount}}</div>
          </el-col>
          <el-col :span="5">
            <div class="name">结核病数量</div>
            <div class="num"><i class="iconfont icon-experiment-fill" style="color: #409eff"></i>{{healthData.tuberculosisCount}}</div>
          </el-col>
        </el-row>
      </el-card>
      <div class="header">
        <span>随访中患者列表</span>
        <el-radio-group size="mini" v-model="patientListType" class="fr" @change="getPatientData">
          <el-radio-button :label="1">今日</el-radio-button>
          <el-radio-button :label="2">本月</el-radio-button>
        </el-radio-group>
      </div>
      <div class="patient-table">
        <el-table border stripe height="100%" ref="table" size="small" :data="patientTableData" v-loading="patientTableLoading">
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column label="慢病" width="100">
            <template slot-scope="{row}">{{diseaseType(row.chronicDiseaseType)}}</template>
          </el-table-column>
          <el-table-column prop="contractDate" label="签约日期"></el-table-column>
          <el-table-column prop="lastFollowDate" label="上一次随访日期"></el-table-column>
          <el-table-column prop="followDate" label="待随访日期"></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template>
              <el-button type="text">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 广播消息 -->
    <el-card class="message">
      <header>广播消息</header>
      <!-- <vue-seamless-scroll :data="messageData" class="message-list" :class-option="scrollOption">
          <div class="list" v-for="item in messageData" :key="item.id">
            <i class="iconfont icon-message" :style="{color: item.msgTo==0? '#EE0C00':'#909399'}"></i>
            <div class="content">
              <span class="title">{{getMsgTitle(item.msgSendType)}}</span>
              <span class="fr time">{{item.createDate}}</span>
              <a>{{item.content}}</a>
            </div>
          </div>
      </vue-seamless-scroll> -->
      <vue-j-scroll class="message-list" :data="messageData" :steep=".5">
        <el-empty description="暂无数据" :image-size="60" v-show="messageData.length == 0"></el-empty>
        <div class="list" v-for="item in messageData" :key="item.messageId">
          <i class="iconfont icon-message" :style="{color: item.msgTo==0? '#EE0C00':'#909399'}"></i>
          <div class="content">
            <span class="title">{{msgTitle(item.msgSendType)}}</span>
            <span class="fr time">{{item.createDate}}</span>
            <a @click="massageClick(item)">{{item.content}}</a>
          </div>
        </div>
      </vue-j-scroll>
    </el-card>
    <!-- 出勤 -->
    <el-card class="attendance">
      <header>出勤</header>
      <el-alert :title="getToday" :closable="false" center class="fr"></el-alert>
      <v-calendar :attributes="calendarAttr" @update:to-page="calendarChange" is-expanded></v-calendar>
      <el-row v-loading="attendLoading">
        <el-col :span="8">
          <div class="name">出勤</div>
          <div class="num line">{{attendanceDate['attend']}}</div>
        </el-col>
        <el-col :span="8">
          <div class="name yellow">请假</div>
          <div class="num line">{{attendanceDate['leave']}}</div>
        </el-col>
        <el-col :span="8">
          <div class="name red">旷工</div>
          <div class="num">{{attendanceDate['absence']}}</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import vueSeamlessScroll from "vue-seamless-scroll";
import VueJScroll from "components/VueJScroll";

import {
  getPatientNum,
  getHealthNum,
  getPatientList,
  getAttendance,
  getMessage,
} from "api/platform.js";

export default {
  components: { vueSeamlessScroll, VueJScroll },
  data() {
    return {
      myPatientTypeValue: "今日", //我的患者-时间类型
      myPatientData: {
        subscribeDiagnoseCount: 0, //预约
        waitDiagnoseCount: 0, //待诊
        inDiagnoseCount: 0, //诊中
        finishDiagnoseCount: 0, //结诊
      }, //我的患者
      myPatientLoading: false,
      departmentPatientTypeValue: "今日", //科室患者-时间类型
      departmentPatientData: {
        subscribeDiagnoseCount: 0, //预约
        waitDiagnoseCount: 0, //待诊
        inDiagnoseCount: 0, //诊中
        finishDiagnoseCount: 0, //结诊
      }, //科室患者
      departmentPatientLoading: false,
      changePatientNum: 0, //转诊患者
      changePatientLoading: false,
      healthTypeValue: "本月", //健康管理-时间类型
      healthData: {
        contractCount: 0, //签约人数
        familyRecordCount: 0, //建档家庭数
        familyCount: 0, //家庭数
        hypertensionCount: 0, //高血压数量
        diabetesCount: 0, //糖尿病数量
        tuberculosisCount: 0, //结核病数量
      }, //健康管理
      healthLoading: false,
      patientListType: 1, //患者列表-时间类型
      patientTableData: [], //患者列表
      patientTableLoading: false,
      messageData: [], //广播消息
      calendarAttr: [
        {
          key: "today",
          dates: new Date(),
          highlight: true,
        },
      ], //日历
      attendanceDate: {
        attend: 0,
        leave: 0,
        absence: 0,
      }, //出勤情况
      attendLoading: false,
      userId: "",
    };
  },
  computed: {
    ...mapGetters(["diseaseType", "msgTitle"]),
    /* scrollOption() {
      return {
        step: this.messageData.length > 3 ? 0.5 : 0, //滚动速度
        limitMoveNum: this.messageData.length, //开始无缝滚动的数据量
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 65, // 单步运动停止的高度
        waitTime: 5000, // 单步运动停止的时间
      };
    }, */
    getToday() {
      let d = new Date();
      let month = d.getMonth() + 1;
      return d.getFullYear() + "年" + month + "月" + d.getDate() + "日";
    },
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
      // 诊疗
      this.getMyPatientData("1");
      this.getDepartmentPatientData("1");
      this.getChangePatientNum();
      // 公卫/健康管理
      this.getHealthData("1");
      this.getPatientData();
      // 广播消息
      getMessage(this.userId).then((res) => {
        this.messageData = res.result;
      });
    }
  },
  methods: {
    //我的患者-日期切换 1:今日 2:本周
    myPatientCommand(type) {
      this.myPatientTypeValue = type === "1" ? "今日" : "本周";
      this.getMyPatientData(type);
    },
    //科室患者-日期切换 1:今日 2:本周
    departmentPatientCommand(type) {
      this.departmentPatientTypeValue = type === "1" ? "今日" : "本周";
      this.getDepartmentPatientData(type);
    },
    // 获取我的患者数据
    getMyPatientData(time) {
      this.myPatientLoading = true;
      getPatientNum({
        type: "1",
        userId: this.userId,
        dateType: time,
      })
        .then((res) => {
          if (res.code == 0) this.myPatientData = res.result;
          this.myPatientLoading = false;
        })
        .catch(() => {
          this.myPatientLoading = false;
        });
    },
    // 获取科室患者数据
    getDepartmentPatientData(time) {
      this.departmentPatientLoading = true;
      getPatientNum({
        type: "2",
        userId: this.userId,
        dateType: time,
      })
        .then((res) => {
          if (res.code == 0) this.departmentPatientData = res.result;
          this.departmentPatientLoading = false;
        })
        .catch(() => {
          this.departmentPatientLoading = false;
        });
    },
    // 获取转诊患者
    getChangePatientNum() {
      this.changePatientLoading = true;
      getPatientNum({
        type: "3",
        userId: this.userId,
        dateType: "1",
      })
        .then((res) => {
          if (res.code == 0) this.changePatientNum = res.result.diagnoseCount;
          this.changePatientLoading = false;
        })
        .catch(() => {
          this.changePatientLoading = false;
        });
    },

    // 健康管理-日期切换 1:本月 2:本年
    healthCommand(type) {
      this.healthTypeValue = type === "1" ? "本月" : "本年";
      this.getHealthData(type);
    },
    // 获取健康管理数据
    getHealthData(time) {
      this.healthLoading = true;
      getHealthNum({
        userId: this.userId,
        dateType: time,
      })
        .then((res) => {
          if (res.code == 0) this.healthData = res.result;
          this.healthLoading = false;
        })
        .catch(() => {
          this.healthLoading = false;
        });
    },
    // 获取随访患者列表
    getPatientData() {
      this.patientTableLoading = true;
      getPatientList({
        userId: this.userId,
        dateType: this.patientListType,
      })
        .then((res) => {
          if (res.code == 0) this.patientTableData = res.result;
          this.patientTableLoading = false;
        })
        .catch(() => {
          this.patientTableLoading = false;
        });
    },

    // 消息click
    massageClick(data) {
      console.log(data.content);
    },

    // 日历月份change
    calendarChange(page) {
      page.month = page.month < 10 ? "0" + page.month : page.month;
      this.attendLoading = true;
      getAttendance({
        userId: this.userId,
        month: page.year + "-" + page.month,
      })
        .then((res) => {
          if (res.code == 0) {
            let data = res.result;
            this.calendarAttr = [
              {
                key: "today",
                dates: new Date(),
                highlight: true,
              },
              {
                key: "attend",
                dates: data.attendanceDateList,
                dot: true,
              },
              {
                key: "leave",
                dates: data.leaveDateList,
                dot: "yellow",
              },
              {
                key: "absence",
                dates: data.absenteeismDateList,
                dot: "red",
              },
            ];
            this.attendanceDate.attend = data.attendanceDateList.length;
            this.attendanceDate.leave = data.leaveDateList.length;
            this.attendanceDate.absence = data.absenteeismDateList.length;
          }
          this.attendLoading = false;
        })
        .catch(() => {
          this.attendLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.platform {
  height: calc(100% - 50px);
  padding: 16px;
}
header {
  font-weight: 700;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
}
.header {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}
.patient {
  float: left;
  width: 70%;
  height: 206px;
  margin: 0 16px 16px 0;
  .el-card {
    background-color: #ecf5ff;
    border: none;
    height: 142px;
    .header {
      margin-bottom: 16px;
      span.icon {
        display: inline-block;
        width: 22px;
        height: 22px;
        background-color: #409eff;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 10px;
        text-align: center;
        i {
          display: flex;
          justify-content: center;
          line-height: 22px;
          color: #fff;
        }
      }
    }
    .el-col {
      text-align: center;
      .num {
        font-size: 30px;
        height: 45px;
        line-height: 45px;
      }
      .name {
        color: #909399;
      }
    }
  }
}
.health {
  float: left;
  width: 70%;
  height: calc(100% - 222px);
  margin-right: 16px;
  .health-num {
    background-color: rgba(240, 239, 253, 0.38);
    border: none;
    margin-bottom: 16px;
    height: 126px;
    .header {
      color: #409eff;
      text-align: right;
    }
    .el-col {
      text-align: center;
      .num {
        font-size: 30px;
        height: 45px;
        line-height: 45px;
        i {
          font-size: 30px;
        }
      }
      .name,
      .gray {
        color: #909399;
      }
      .gray {
        font-size: 20px;
      }
    }
    .line {
      border-right: 1px solid #e4e7ed;
    }
  }
  .patient-table {
    margin-top: 16px;
    height: calc(100% - 218px);
  }
}
.message {
  margin-bottom: 16px;
  height: 275px;
  .message-list {
    overflow: hidden;
    height: 195px;
    margin-top: 16px;
    .list {
      height: 65px;
      position: relative;
      padding-left: 32px;
      i {
        position: absolute;
        left: 0;
        top: 10px;
        font-size: 24px;
      }
      .content {
        display: inline-block;
        width: 100%;
        height: 63px;
        line-height: 20px;
        overflow: hidden;
        padding-bottom: 3px;
        border-bottom: 1px dotted #dcdfe6;
        font-size: 14px;
        a {
          color: #409eff;
          cursor: pointer;
          display: block;
        }
        .title {
          font-weight: 700;
        }
        .time {
          color: #909399;
        }
      }
    }
  }
}
.attendance {
  height: calc(100% - 291px);
  .el-alert {
    background-color: #ecf5ff;
    color: #000;
    margin: 16px 0;
  }
  .vc-container {
    border-radius: 2px;
    margin-bottom: 32px;
    height: 268px;
  }
  .el-col {
    text-align: center;
    .num {
      font-size: 30px;
      height: 45px;
      line-height: 45px;
    }
    .name {
      position: relative;
      color: #909399;
      &::before {
        content: "";
        position: absolute;
        top: 7px;
        left: 25%;
        width: 6px;
        height: 6px;
        background-color: #3182ce;
        border-radius: 50%;
      }
      &.yellow::before {
        background-color: #d69e2e;
      }
      &.red::before {
        background-color: #e53e3e;
      }
    }
    .line {
      border-right: 1px solid #e4e7ed;
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>