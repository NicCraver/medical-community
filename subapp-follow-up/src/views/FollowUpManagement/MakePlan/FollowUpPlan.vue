<template>
  <div class="follow-up-plan">
    <PatientInfoCard :patientInfo="patientInfo" @open360View="open360View" />
    <div class="bg-box disease-info" style="margin-bottom: 10px">
      <div class="title"><span>疾病信息</span></div>
      <div class="content">
        <el-row>
          <el-col :span="7">
            <span class="sub-title">临床诊断：</span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="diseaseInfo.diagnose"
              placement="top-start"
              v-if="diseaseInfo.diagnose && diseaseInfo.diagnose.length > 20"
            >
              <span class="diagnose-text">{{ diseaseInfo.diagnose.substring(0, 20) + '...' }}</span>
            </el-tooltip>
            <span v-else>{{ diseaseInfo.diagnose }}</span>
          </el-col>
          <el-col :span="17">
            <span class="sub-title">慢病标签：</span>
            <span v-for="item in diseaseInfo.diseaseTag" :key="item" class="disease-tag">{{
              item
            }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <span class="sub-title">责任医生：</span>
            {{ diseaseInfo.doctor }}
          </el-col>
          <el-col :span="17">
            <span class="sub-title">建档日期：</span>
            {{ diseaseInfo.archiveDate }}
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="bg-box plan-list">
      <div class="title"><span>随访计划</span></div>
      <div class="content">
        <div class="add">
          <el-dropdown :disabled="patientInfo.recordStatus === '4'">
            <el-button type="primary" :disabled="patientInfo.recordStatus === '4'">
              新增
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addPlan('1')"> 随访计划 </el-dropdown-item>
              <el-dropdown-item @click.native="addPlan('2')"> 随访评估 </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button icon="el-icon-plus" @click="addPlan">新增</el-button> -->
        </div>
        <el-table :data="planList" border v-adaptive="{ bottomOffset: 70 }" height="0">
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column label="随访类型" prop="followupTypeAssessText" width="80px" />
          <el-table-column label="计划名称" prop="planName" width="160" />
          <el-table-column label="随访病种" prop="diseaseText" />
          <el-table-column label="随访启动时间" prop="followupStartTime" width="180" />
          <el-table-column label="添加日期" prop="addTime" width="180" />
          <el-table-column label="随访表单" min-width="180">
            <template slot-scope="{ row }">
              {{ row.followTemplateDesc }}
              <el-tooltip
                effect="dark"
                :content="`表单模板已于${row.startEndDate}被更新`"
                placement="top-start"
                v-if="row.status === 'N'"
              >
                <i class="el-icon el-icon-warning-outline" style="color: red"></i>
              </el-tooltip>
              <el-tooltip
                effect="dark"
                placement="top-start"
                v-if="row.followupTableArr?.length"
              >
                <template slot="content">
                  <p v-for="(val, i) in row.followupTableArr"
                    :key="i"
                    style="margin-bottom: 3px"
                    :style="{color: val.status === 'N' ? '#EE0A24' : '#fff'}"
                  >
                    {{ i + 1 }}
                    {{ val }}
                  </p>
                </template>
                <i class="el-icon el-icon-warning-outline" style="color: #4468BD"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="followupCount" width="140">
            <template slot="header">
              <span>随访次数</span>
              <el-tooltip effect="dark" content="已随访次数/随访总次数" placement="top-start">
                <i class="el-icon el-icon-warning-outline"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="随访机构" prop="followupHosName" width="140" />
          <el-table-column label="操作人" prop="followupUserName" width="140" />
          <el-table-column label="状态" prop="statusText" width="60" />
          <el-table-column label="操作" width="135" fixed="right">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="showCheckPlan(row)"
                v-if="
                  !(
                    currentTime < new Date(row.followupStartTime).getTime() &&
                    row.recordStatus === '2'
                  )
                "
                >查看</el-button
              >
              <el-button
                type="text"
                v-if="
                  row.recordStatus === '1' &&
                  currentTime < new Date(row.followupStartTime).getTime()
                "
                @click="updatePlan(row)"
                >编辑</el-button
              >
              <el-button type="text" v-if="row.recordStatus === '1'" @click="shutDownPlan(row)"
                >关闭</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNum"
          :page-sizes="[10, 20, 50, 100, 200]"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        />
      </div>
    </div>
    <AddPlan
      :dialogType="dialogType"
      :planDetailType="planDetailType"
      :visible="planDetailVisable"
      :diseaseTypeList="diseaseTypeList"
      :planDetail="planDetail"
      :closeDialog="closeAddPlanDialog"
      :followUpForms="followUpForms"
      :followupTypeAssess="followupTypeAssess"
    />
    <AddPlanNew
      :dialogType="dialogType"
      :planDetailType="planDetailType"
      :visible="planDetailNewVisable"
      :diseaseTypeList="diseaseTypeList"
      :planDetail="planDetail"
      :closeDialog="closeAddPlanNewDraw"
      :followUpForms="followUpForms"
      v-if="planDetailNewVisable"
    />
    <CheckPlan
      v-if="checkPlanVisible"
      :visible="checkPlanVisible"
      :closeDrawer="closeCheckPlan"
      :planRow="planRow"
      :planDetail="planDetail"
      :followupTypeAssess="followupTypeAssess"
      :followUpForms="followUpForms"
      ref="checkPlan"
    />
    <ClosePlan
      v-if="closePlanVisible"
      :visible="closePlanVisible"
      :closeDialog="() => (closePlanVisible = false)"
      :planId="planId"
      @submit="shutDownPlanSubmit"
    />
    <Iframe360 :visible.sync="Iframe360" :pid="hisPatientId" :idNo="patientInfo.idNo"></Iframe360>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  getPatientInfo,
  getPatientRecordById,
  getPersonFollowUpPlans,
  getFollowUpForms,
  getPlanDetail,
  getFollowUpData,
  shutDownPlan,
} from '@/api/modules/PatientCenter'
import { PatientInfoCard } from 'anx-vue'
import AddPlan from './AddPlan'
import AddPlanNew from './AddPlanNew'
import CheckPlan from './CheckPlan'
import ClosePlan from './ClosePlan'
import { sexMap, paymentList } from '@/utils/data-map'
import Iframe360 from '@/components/Iframe360/index.vue'

const planStatusMap = {
  1: '启动',
  2: '关闭',
  3: '结束',
}

export default {
  components: {
    PatientInfoCard,
    AddPlan,
    AddPlanNew,
    CheckPlan,
    ClosePlan,
    Iframe360,
  },
  data() {
    return {
      patId: '',
      patientInfo: {},
      currentTime: Date.now(),
      diseaseInfo: {},
      planList: [],
      followupTypeAssess: '',
      planDetailVisable: false,
      // 新随访计划抽屉
      planDetailNewVisable: false,
      planDetailType: 'add',
      diseaseTypeList: [],
      followUpForms: [],
      planDetail: {},
      originPlanDetail: {},
      checkPlanVisible: false,
      planRow: {},
      closePlanVisible: false,
      planId: '',
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      isChanged: false,
      Iframe360: false,
      hisPatientId: '',
      dialogType: '1',
    }
  },
  created() {
    this.getFollowUpForms('FOLLOW');
  },
  async mounted() {
    this.patId = this.$route.query.patId
    this.hisPatientId = this.$route.query.hisPatientId
    this.getPatientRecordById()
    await this.getPatientInfo()
    await this.getPersonFollowUpPlans()
  },
  methods: {
    open360View() {
      window.open(`http://10.10.254.234:8080/share/timeline?patientsn=${this.hisPatientId}`)
    },
    // 获取头部患者卡片信息
    async getPatientInfo() {
      try {
        const res = await getPatientInfo({ patId: this.patId })
        this.patientInfo = {
          ...res.result,
          sex: sexMap[res.result.sex],
          payment: paymentList.find((item) => item.value === res.result.payType)
            ? paymentList.find((item) => item.value === res.result.payType).label
            : '',
          addressDetail: res.result.addressText + res.result.street,
        }
        console.log('this.patientInfo===', this.patientInfo)
        this.diseaseTypeList = res.result.patientRichDiseaseList
      } catch (err) {
        console.log(err)
      }
    },
    // 获取患者疾病信息
    async getPatientRecordById() {
      try {
        const res = await getPatientRecordById({ patId: this.patId })
        console.log('getPatientRecordById===', res)
        this.diseaseInfo = {
          diagnose: res.result.diagnose,
          doctor: res.result.patient.doctorUserName,
          archiveDate: res.result.patient.archiveDate,
          diseaseTag: res.result.patientRichDiseaseList.map((item) => item.richDiseaseName),
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 获取随访表单列表
    async getFollowUpForms(type) {
      try {
        const res = await getFollowUpForms({ type })
        this.followUpForms = res.result
        console.log('this.followUpForms===', this.followUpForms)
      } catch (err) {
        console.error(err)
      }
    },
    // 获取个人随访计划列表
    async getPersonFollowUpPlans() {
      try {
        const res = await getPersonFollowUpPlans({
          patientId: this.patId,
          ...this.pageParams,
        })
        console.log('getPersonFollowUpPlans', res)
        console.log('this.diseaseTypeList==', this.diseaseTypeList)
        this.planList = res.result
          ? res.result.map((item) => {
              const disease = this.diseaseTypeList.find(
                (diseaseType) => diseaseType.richDiseaseCode === item.diseaseCode,
              )
              const frequencyRule = item.frequencyRule ? JSON.parse(item.frequencyRule) : [];
              let followupTableArr = [];
              frequencyRule.map(val => {
                let obj = this.followUpForms.find(vv => vv.value === val.followupTable);
                let name = obj?.label || "";
                if (name) {
                  followupTableArr.push(name);
                }
              });
              return {
                ...item,
                followupTypeAssessText: item.followupTypeAssess === '1' ? '计划' : '评估',
                diseaseText: disease ? disease.richDiseaseName : '/',
                statusText: planStatusMap[item.recordStatus],
                addDate: item.modDate || item.createDate,
                // followupTableText: this.followUpForms.find(followUpForm => followUpForm.value === item.followupTable).label,
                followupCount: `${this.formatNumber(item.remainingTimes)}/${this.formatNumber(
                  item.totalTimes,
                )}`,
                followupTableArr,
              }
            })
          : []
        this.total = res.total
      } catch (err) {
        console.error(err)
      }
    },
    // 点击新增计划
    async addPlan(type) {
      this.dialogType = type
      if (type === '1') {
        const week = new Date().getDay()
        let date = new Date(Date.now())
        if (week === 6) {
          date = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        } else if (week === 7) {
          date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        }
        this.planDetail = {
          patId: this.patId,
          planName: '',
          planType: '2',
          diseaseCode: '',
          frequencyTimes: '1',
          frequencyUnit: '2',
          followupType: '1',
          followupTable: '',
          msgToRemind: [''],
          systemCall: ['1', '2'],
          followupSize: '',
          beyondEditor: '1',
          followupStartTime: dayjs(date).format('YYYY-MM-DD'),
          name: this.patientInfo.name,
        }
        await this.getFollowUpForms('FOLLOW');
        this.followupTypeAssess = type
        this.originPlanDetail = JSON.parse(JSON.stringify(this.planDetail))
        this.planDetailType = 'add'
        this.planDetailNewVisable = true
        return;
      } else {
        this.planDetail = {
          patId: this.patId,
          planName: '',
          followupType: '2',
          followupTable: '',
          followupStartTime: dayjs(new Date()).format('YYYY-MM-DD'),
          name: this.patientInfo.name,
          msgToRemind: ['1'],
        }
        await this.getFollowUpForms('EVALUATION')
      }
      this.followupTypeAssess = type
      this.originPlanDetail = JSON.parse(JSON.stringify(this.planDetail))
      this.planDetailType = 'add'
      this.planDetailVisable = true
    },
    // 编辑计划
    async updatePlan(row) {
      this.followupTypeAssess = row.followupTypeAssess
      if (this.followupTypeAssess === '1') {
        await this.getFollowUpForms('FOLLOW');
        await this.getPlanDetail(row)
        this.planDetailType = 'update'
        this.planDetailNewVisable = true
        return
      } else {
        await this.getFollowUpForms('EVALUATION')
      }
      await this.getPlanDetail(row)
      this.planDetailType = 'update'
      this.planDetailVisable = true
    },
    // 获取计划详情
    async getPlanDetail(row) {
      try {
        const res = await getPlanDetail({ planId: row.planId })
        console.log('detail', res)
        this.planDetail = {
          ...res.result,
          systemCall: res.result.systemCall.split(','),
          msgToRemind: res.result.msgToRemind.split(','),
          name: this.patientInfo.name,
        }
        this.originPlanDetail = JSON.parse(JSON.stringify(this.planDetail))
      } catch (err) {
        console.error(err)
      }
    },
    closeAddPlanDialog(type) {
      if (type === 'refresh') {
        this.originPlanDetail = JSON.parse(JSON.stringify(this.planDetail))
        this.getPersonFollowUpPlans()
        this.planDetailVisable = false
      } else {
        this.checkPlanDetailChanged()
          .then(() => {
            this.planDetail = {}
            this.originPlanDetail = {}
            this.planDetailVisable = false
          })
          .catch(() => {})
      }
    },
    closeAddPlanNewDraw(type) {
      if (type === "refresh") {
        this.getPersonFollowUpPlans();
      }
      this.planDetailNewVisable = false
    },
    async showCheckPlan(row) {
      await this.getPlanDetail(row)
      this.followupTypeAssess = row.followupTypeAssess
      this.planRow = row
      this.checkPlanVisible = true
    },
    closeCheckPlan() {
      this.checkPlanVisible = false
      this.$refs.checkPlan.$destroy()
    },
    // 关闭计划
    async shutDownPlan(row) {
      // if (this.currentTime >= new Date(row.followupStartTime).getTime()) {
      //   this.$message.warning('存在未完成的随访任务，无法关闭');
      //   return
      // }
      this.planId = row.planId
      this.closePlanVisible = true
    },
    shutDownPlanSubmit() {
      this.$message.success("操作成功！");
      this.getPersonFollowUpPlans()
      this.closePlanVisible = false
    },
    handleSizeChange(val) {
      this.pageParams = {
        pageSize: val,
        pageNum: 1,
      }
      this.getPersonFollowUpPlans()
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val
      this.getPersonFollowUpPlans()
    },
    checkPlanDetailChanged() {
      let flag = false
      for (const key in this.planDetail) {
        if (JSON.stringify(this.planDetail[key]) !== JSON.stringify(this.originPlanDetail[key])) {
          console.log('key===', key)
          console.log('value', this.planDetail[key], this.originPlanDetail[key])
          flag = true
          break
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          this.$confirm('您有未保存的记录，确认要离开吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              resolve(true)
            })
            .catch(() => {
              reject(false)
            })
        } else {
          resolve(true)
        }
      })
    },
    formatNumber(num) {
      num = parseInt(num)
      if (num < 10 && num) {
        num = '0' + num
      }
      return num
    },
  },
  beforeRouteLeave(to, from, next) {
    this.checkPlanDetailChanged().then(() => {
      next()
    })
  },
}
</script>

<style lang="scss" scoped>
.follow-up-plan {
  // padding: 10px 10px 0 10px;
  .bg-box {
    padding: 10px 5px;
    background-color: #fff;
    .title {
      font-size: 16px;
      font-weight: bold;
      color: rgba(48, 49, 51, 100);
      margin-bottom: 20px;
      span {
        display: inline-block;
        line-height: 20px;
        text-indent: 10px;
        border-left: 3px solid rgba(19, 71, 150, 100);
      }
    }
  }
  .disease-info {
    .content {
      margin-left: 19px;
      font-size: 14px;
      color: rgba(48, 49, 51, 100);
      .sub-title {
        color: rgba(145, 145, 145, 100);
      }
      .el-col {
        margin-bottom: 23px;
        display: flex;
      }
      .diagnose-text {
        display: inline-block;
        word-break: keep-all;
        flex: 1;
        overflow: hidden;
        height: 23px;
        line-height: 23px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .disease-tag {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        border-radius: 3px;
        border: 1px solid #446abd;
        padding: 0 10px;
        margin-right: 17px;
        color: #446abd;
      }
    }
  }
  .plan-list {
    .content {
      .add {
        margin-bottom: 18px;
      }
    }
  }
  .grey {
    color: #919191;
  }
}
</style>

<style lang="scss">
.el-message-box {
  .el-button--primary {
    color: #fff !important;
  }
}
</style>
