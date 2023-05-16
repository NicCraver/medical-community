<!--
  @description 患者指标分析-患者全局指标分析
  @date
-->
<template>
  <div class="patient">
    <div class="top">
      <el-image class="user" :src="require('@/assets/round-people.png')"></el-image>
      <div class="info">{{ userInfo.name }} {{ userInfo.sex }} {{ userInfo.age }}</div>
      <div class="plans">
        <div class="plan" v-for="(plan, index) in userInfo.planNames" :key="index" @click="jumpPlan(plan)">
          {{ plan.planName }}
        </div>
      </div>
      <div class="illness">
        <div class="cards">
          <span class="card" v-for="(i, index) in userInfo.cards" :key="index">{{ i }}</span>
        </div>
        <div class="adiagnoses">
          <!-- <span class="adiagnose" v-for="(i,index) in userInfo.adiagnoses" :key="index">{{i}}</span> -->
          <span class="adiagnose">{{ userInfo.diagnosesStr }}</span>
        </div>
      </div>
    </div>
    <div class="query">
      <el-select v-model="queryParams.type" placeholder="指标" clearable>
        <el-option v-for="item in normData" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-select v-model="queryParams.status" placeholder="监测状态" clearable>
        <el-option v-for="item in statusData" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-date-picker
        v-model="queryParams.daterange"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
      <el-button icon="el-icon-refresh-right" @click="getPatientData"></el-button>
    </div>
    <div class="empty" v-if="isEmpty">
      <el-image :src="require('./empty2.png')"></el-image>
      <div class="text">无数据</div>
    </div>
    <el-collapse v-else class="main" v-model="activeNames" v-loading="loading">
      <el-collapse-item v-for="item in patientData" :key="item.date" :name="item.date">
        <template slot="title">
          {{ item.date }}
          <span class="abnormal" v-show="item.isAbnormal">有异常</span>
        </template>
        <div v-for="(info, index) in item.recordList" :key="index" class="info">
          <div class="circle" :style="{ backgroundColor: info.isAbnormal ? '#F77601' : '#d9d9d9' }"></div>
          <span class="time">{{ info.time }}</span>
          <template v-if="info.type == 'S' || info.type == 'G'">
            <span class="value" :style="{ color: info.patBloodList[0].isAbnormal ? '#F77601' : '#333' }">{{
              info.patBloodList[0].value
            }}</span>
            <span class="label">{{ info.patBloodList[0].typeDesc }}</span>
          </template>
          <template v-else-if="info.type == 'P'">
            <span class="value" :style="{ color: info.patBloodList[0].isAbnormal ? '#F77601' : '#333' }">{{
              info.patBloodList[0].value
            }}</span>
            <span class="label">{{ info.patBloodList[0].typeDesc }}</span>
            <span class="value" :style="{ color: info.patBloodList[1].isAbnormal ? '#F77601' : '#333' }">{{
              info.patBloodList[1].value
            }}</span>
            <span class="label">{{ info.patBloodList[1].typeDesc }}</span>
          </template>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="bottom">
      <div class="button" @click="remindFuc"><i class="el-icon-message"></i><span>提醒</span></div>
      <div class="button" style="width: 60px" @click="patientReachBtnClick" v-permission="2">
        <IconSvg iconClass="phonelink" width="20" height="20"></IconSvg><span>患者触达</span>
      </div>
      <div class="button" @click="recordBtnClick">
        <IconSvg iconClass="phonelink" width="20" height="20"></IconSvg><span>患阅</span>
      </div>
      <div class="button" @click="configBtnClick">
        <IconSvg iconClass="setting" width="20" height="20"></IconSvg><span>设置</span>
      </div>
    </div>

    <remindDIalog
      title="提醒"
      v-if="remindVisible"
      :visible.sync="remindVisible"
      width="520PX"
      :before-close="remindBeforeClose"
      @remindClose="remindBeforeClose"
      :userInfo="userInfo"
    ></remindDIalog>
    <setDrawer
      title="患者个性化设置"
      v-if="setDrawering"
      :visible.sync="setDrawering"
      direction="rtl"
      :size="400"
      :before-close="setHandleClose"
      @setClose="setHandleClose"
      :userInfo="userInfo"
    ></setDrawer>
    <Record ref="record" v-bind="$attrs"></Record>
    <PatientReachDrawer ref="PatientReachDrawerRef" v-bind="$attrs" :userInfo="userInfo"></PatientReachDrawer>
  </div>
</template>

<script>
import remindDIalog from './remindDIalog.vue'
import setDrawer from './setDrawer.vue'
import Record from './Record.vue'
import PatientReachDrawer from './PatientReachDrawer.vue'
import { onQueryPatBloodAnalysis } from '@/api/modules/PatientCenter/indicatorAnaysis.js'
import { getPatientInfo } from '@/api/modules/PatientCenter'
import { getKeyByValue, sexMap } from '../data-map'

export default {
  components: { remindDIalog, setDrawer, Record, PatientReachDrawer },
  props: {
    patientDate: Array,
    pickerOptions: Object,
  },
  data() {
    return {
      userInfo: {}, //患者信息
      remindVisible: false,
      setDrawering: false,
      queryParams: { daterange: [] }, //过滤条件
      normData: [
        { value: '', label: '全部指标' },
        { value: 'P', label: '高血压指标' },
        { value: 'S', label: '糖尿病指标' },
        { value: 'G', label: '糖化指标' },
      ], //指标下拉
      statusData: [{ value: true, label: '异常状态' }], //状态下拉
      activeNames: [], //折叠面板
      patientData: [], //患者数据
      loading: false,
    }
  },
  watch: {
    patientDate: function (val) {
      this.queryParams.daterange = val
      if (val.length > 0) {
        this.getPatientData()
      }
    },
  },
  computed: {
    isEmpty() {
      return this.patientDate.length == 0
    },
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    // 获取患者信息
    getUserInfo() {
      getPatientInfo({ patId: this.$route.query.patId }).then(({ code, result }) => {
        if (code === 0) {
          this.userInfo = {
            ...result,
            name: result.name,
            sex: getKeyByValue(sexMap, result.sex),
            age: result.age,
            planNames: result.planNames.length == 0 ? [{ planName: '无正在执行的随访计划' }] : result.planNames,
            cards: result.patientRichDiseaseList.map((item) => item.richDiseaseName),
            diagnosesStr: result.diagnosesStr,
          }
        }
      })
    },
    // 获取患者数据
    getPatientData() {
      let param = {
        patId: this.$route.query.patId,
        startDate: this.queryParams.daterange?.[0] ?? '',
        endDate: this.queryParams.daterange?.[1] ?? '',
        ...this.queryParams,
      }
      delete param.daterange
      this.loading = true
      onQueryPatBloodAnalysis(param)
        .then(({ code, result }) => {
          if (code === 0) {
            this.patientData = result
            this.activeNames = [result[0].date]
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 随访计划跳转
    jumpPlan(plan) {
      if (plan.planId) {
        const url = `/app-followup/PersonFollowUpList?patId=${this.$route.query.patId}&planId=${plan.planId}`
        window.history.pushState(history.state, '', url)
        window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }))
      }
    },
    // 患阅
    recordBtnClick() {
      this.$refs.record.open()
    },
    // 患者触达
    patientReachBtnClick() {
      this.$refs.PatientReachDrawerRef.open()
    },
    configBtnClick() {
      this.setDrawering = true
    },
    setHandleClose() {
      this.setDrawering = false
    },
    remindFuc() {
      this.remindVisible = true
    },
    remindBeforeClose() {
      this.remindVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.patient {
  position: relative;
  background-color: #fff;
  border-radius: 2px 2px 4px 4px;
  .top {
    position: relative;
    height: 165px;
    background-color: #4468bd;
    padding: 18px 5px 5px 20px;
    .el-image.user {
      position: absolute;
      top: 20px;
      left: 20px;
    }
    .info {
      margin-left: 76px;
      font-size: 18px;
      font-weight: 500;
      color: #fff;
      height: 26px;
    }
    .plans {
      margin: 7px 0 20px 76px;
      height: 25px;
      line-height: 20px;
      overflow-x: auto;
      white-space: nowrap;
      .plan {
        height: 20px;
        display: inline-block;
        background-color: #607fc7;
        color: #d8e3ff;
        border-radius: 25px;
        padding: 0 13px;
        margin-right: 8px;
        cursor: pointer;
      }
    }
    .illness {
      height: 64px;
      overflow-y: auto;
      .cards {
        display: flex;
        flex-wrap: wrap;
        .card {
          display: inline-block;
          padding: 0 10px;
          background-color: #d8e3ff;
          color: #4468bd;
          height: 24px;
          line-height: 24px;
          margin-right: 10px;
          border-radius: 2px;
          margin-bottom: 10px;
        }
      }
      .adiagnoses {
        display: flex;
        flex-wrap: wrap;
        .adiagnose {
          display: inline-block;
          color: #d8e3ff;
          height: 20px;
          line-height: 20px;
          padding: 0 5px;
          border-right: 1px solid #6a87cf;
          margin-bottom: 10px;
          &:last-child {
            border: none;
          }
        }
      }
      ::v-deep ::-webkit-scrollbar-thumb {
        background-color: #d9e1ff;
      }
    }
  }
  .query {
    .el-select {
      margin: 10px 0 0 10px;
      width: 146px;
    }
    .el-range-editor {
      width: 262px;
      margin: 10px 10px 0 10px;
    }
    .el-button {
      width: 32px;
      margin-top: 10px;
      padding: 4px;
      font-size: 20px;
    }
  }
  .empty {
    height: calc(100% - 296px);
    text-align: center;
    .el-image {
      margin-top: 80px;
    }
  }
  .main {
    margin: 10px;
    overflow-y: auto;
    height: calc(100% - 296px);
    padding-right: 6px;
    ::v-deep .el-collapse-item__header {
      background-color: #f9fafd;
      height: 32px;
      line-height: 32px;
    }
    ::v-deep .el-collapse-item__content {
      padding: 0;
    }
    .el-collapse-item {
      border: 1px solid #e3e8f5;
      border-radius: 4px;
      margin-bottom: 13px;
      .abnormal {
        background-color: #8dacf9;
        color: #fff;
        border-radius: 23px;
        padding: 5px;
        margin-left: 10px;
        height: 20px;
        line-height: 12px;
      }
      .info {
        position: relative;
        height: 48px;
        line-height: 48px;
        color: #9d9d9d;
        &:nth-child(even) {
          background-color: #f9fafd;
        }
        &:nth-last-child(n + 2)::before {
          content: '';
          position: absolute;
          width: 1px;
          height: 20px;
          left: 14px;
          top: 32px;
          background-color: #e6e6e6;
        }
        &:nth-child(n + 2)::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 24px;
          left: 14px;
          top: 0;
          background-color: #e6e6e6;
        }
        .circle {
          display: inline-block;
          height: 8px;
          width: 8px;
          border-radius: 4px;
          background-color: #9d9d9d;
          margin: 0 10px;
        }
        .value {
          display: inline-block;
          margin-left: 25px;
          color: #333;
          font-size: 20px;
          text-align: right;
          width: 45px;
          padding-right: 5px;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 40px;
    background-color: #4468bd;
    opacity: 0.8;
    border-radius: 0 0 4px 4px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 30px;
      color: #fff;
      cursor: pointer;
      span {
        line-height: 16px;
      }
      i {
        font-size: 20px;
      }
    }
  }
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  border-radius: 2px;
  overflow: auto;
  margin-left: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 4px;
}
</style>
