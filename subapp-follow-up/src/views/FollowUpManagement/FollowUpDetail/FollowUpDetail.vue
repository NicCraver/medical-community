<template>
  <ProLayout mainBgColor="#F5F5F5" padding="0">
    <template #title>{{ followupName }}</template>
    <template #main>
      <div class="container" v-loading="loading">
        <!-- 左侧记录 -->
        <div class="followup-list">
          <el-scrollbar style="height: 100%" ref="scrollBar">
            <div
              v-for="item in leftFollowupList"
              :key="item.id"
              :class="['followup-item', { active: item.followupId === followupId }]"
              :ref="item.followupId === followupId ? 'activeItem' : ''"
              @click="switchFollowup(item)"
            >
              <!-- 待随访 -->
              <div v-if="item.followupStatus === '1'">
                <!-- 暂存 -->
                <div v-if="item.entryStatus === '3'">
                  {{item.isTimeOutDate }}
                  <el-tooltip class="item" effect="dark" :content="item.isTimeOutDate==='1'?'超期暂存':'暂存'" placement="top">
                    <div class="time-icon temp-save-timeout" v-if="item.isTimeOutDate==='1'"></div>
                    <div class="time-icon temp-save" v-else></div>
                  </el-tooltip>
                  <p>{{ item.nextFollowTime }}</p>
                  <p class="extra-time">(暂存时间:{{ item.followUpDate }})</p>
                  <p>随访方式：{{ item.followupTypeText }}</p>
                  <p>随访人：{{ item.followUpName }}</p>
                </div>
                <!-- 超期 -->
                <div v-else-if="item.isTimeOutDate === '1'">
                  <el-tooltip class="item" effect="dark" content="超期未随访" placement="top">
                    <div class="time-icon load-followup-timeout"></div>
                  </el-tooltip>
                  <p>{{ item.nextFollowTime }}</p>
                  <p>随访方式：{{ item.followupTypeText }}</p>
                  <p>随访人：/</p>
                </div>
                <!-- 其他正常 -->
                <div v-else>
                  <el-tooltip class="item" effect="dark" content="待随访" placement="top">
                    <div class="time-icon load-followup"></div>
                  </el-tooltip>
                  <p>{{ item.nextFollowTime }}</p>
                  <p>随访方式：{{ item.followupTypeText }}</p>
                  <p>随访人：/</p>
                </div>
              </div>

              <!-- 已随访 -->
              <div v-if="item.followupStatus === '2'">
                <!-- 正常 -->
                <div v-if="item.isTimeOutDate === '0'">
                  <el-tooltip class="item" effect="dark" content="已随访" placement="top">
                    <div class="time-icon has-followuped-normal"></div>
                  </el-tooltip>
                  <p>{{ item.nextFollowTime }}</p>
                  <p class="extra-time">(录入时间:{{ item.followUpDate }})</p>
                  <p>随访方式：{{ item.followupTypeText }}</p>
                  <p>随访人：{{ item.followUpName }}</p>
                </div>
                <!-- 超期 -->
                <div v-else>
                  <el-tooltip class="item" effect="dark" content="超期已随访" placement="top">
                    <div class="time-icon has-followuped-timeout"></div>
                  </el-tooltip>
                  <p>{{ item.nextFollowTime }}</p>
                  <p class="extra-time">(补录时间:{{ item.followUpDate }})</p>
                  <p>随访方式：{{ item.followupTypeText }}</p>
                  <p>随访人：{{ item.followUpName }}</p>
                </div>
              </div>

              <!-- 中止 -->
              <div v-if="item.followupStatus === '3'">
                <el-tooltip class="item" effect="dark" content="已中止" placement="top">
                  <div class="time-icon suspened"></div>
                </el-tooltip>
                <p>{{ item.nextFollowTime }}</p>
                <p class="extra-time">(中止时间:{{ item.terminationDate }})</p>
                <p>
                  中止人：{{ item.terminationUserName }}
                  <el-tooltip effect="dark" :content="item.terminationReason" placement="top-start">
                    <i class="el-icon el-icon-question"></i>>
                  </el-tooltip>
                </p>
              </div>

              <!-- 关闭 -->
              <div v-if="item.followupStatus === '4'">
                <el-tooltip class="item" effect="dark" content="已关闭" placement="top">
                  <div class="time-icon closed"></div>
                </el-tooltip>
                <p>{{ item.nextFollowTime }}</p>
                <p class="extra-time">(关闭时间:{{ item.downTime }})</p>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 表单区域 -->
        <div class="content">
          <PatientInfoCard :patientInfo="patientInfo" style="margin-bottom: 0" @open360View="open360View" />
          <el-tabs v-model="activeTabForm">
            <el-tab-pane
              v-for="item in formTabDatas"
              :key="item.label"
              :name="item.name"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
          <div class="form-container" v-show="activeTabForm !== '数据采集'">
            <anx-form
              :anxFormData="anxFormData"
              :disabled="isDisabed"
              ref="anxForm"
              :baseUrl="baseUrl"
              :echoData="echoData"
            />
            <div
              class="assessment"
              v-if="
                feedbackStatus === '0' &&
                formType !== 'EVALUATION' &&
                (followupTypeText === '网络' || followupTypeText === '不限')
              "
            >
              待评估
            </div>
            <div
              class="assessment"
              :style="feedbackResult === '1' ? 'background:#5381E3' : 'background:#F79161'"
              v-if="
                feedbackStatus === '1' &&
                formType !== 'EVALUATION' &&
                (followupTypeText === '网络' || followupTypeText === '不限')
              "
            >
              {{ feedbackResult === '1' ? '平稳' : '需注意' }}
            </div>
          </div>
          <!-- 数据采集 -->
          <div class="form-container" v-if="activeTabForm === '数据采集'">
            <dataCollection :currentData="{ patientName, ...currentData }" ref="dataCollection"></dataCollection>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions" v-show="activeTabForm !== '数据采集'">
          <el-button
            @click="suspendSubmit"
            v-if="followupStatus === '1' && followupTypeAssess === '1'"
            style="color: #f79161 !important; border-color: #f79161"
            >中止</el-button
          >
          <el-button @click="followupTempSubmit" v-if="!isDisabed">暂存</el-button>
          <el-button type="primary" @click="followupSubmit" v-if="!isDisabed">提交</el-button>
          <el-button
            type="primary"
            @click="assessmentVisible = true"
            v-if="
              feedbackStatus === '0' &&
              formType !== 'EVALUATION' &&
              (followupTypeText === '网络' || followupTypeText === '不限')
            "
            >评估</el-button
          >
          <el-button
            @click="handleBack"
            id="baccccck"
            style="border: 1px solid rgba(145, 145, 145, 100); color: rgba(145, 145, 145, 100) !important"
            >返回</el-button
          >
        </div>
        <!-- 数据采集按钮 -->
        <div class="actions2" v-show="activeTabForm === '数据采集'">
          <div>
            <el-button
              @click="tixing"
              id="baccccck"
              style="border: 1px solid rgba(145, 145, 145, 100); color: rgba(145, 145, 145, 100) !important"
            >
              提醒
            </el-button>
          </div>
          <div>
            <el-button
              @click="handleBack"
              id="baccccck"
              style="border: 1px solid rgba(145, 145, 145, 100); color: rgba(145, 145, 145, 100) !important"
            >
              返回
            </el-button>
          </div>
        </div>
      </div>
      <el-dialog title="患者随访评估" top="30vh" width="500px" :visible.sync="assessmentVisible">
        <div>
          <div>请为该随访内容进行评估：</div>
          <div style="margin-top: 15px">
            <el-radio v-model="assessmentRadio" label="1">平稳</el-radio>
          </div>
          <div style="margin-top: 15px">
            <el-radio v-model="assessmentRadio" label="2">需注意</el-radio>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assessmentVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAssessment"> 确 定 </el-button>
        </div>
      </el-dialog>
      <SuspendFollowUp
        :visible="suspendFollowUpVisible"
        :suspendFollowParams="suspendFollowParams"
        :closeDialog="() => (suspendFollowUpVisible = false)"
        @terminationFollowUpSuccess="handleSuccess"
      />
    </template>
  </ProLayout>
</template>

<script>
import dayjs from 'dayjs'
import { followUpTypeList, sexMap, paymentList } from '@/utils/data-map'
import { AnxForm } from 'anx-form'
import { ProLayout } from 'anx-vue'
import { PatientInfoCard } from 'anx-vue'
import {
  getEntryDataToLeft,
  entryFollowUp,
  getPatientInfo,
  getEntryData,
  followupToTemStorage,
  assessToFollowupEntry,
  getEntrySubmitData,
  getOrgDiseaseTypes,
  getTemplateDateById,
} from '@/api/modules/PatientCenter'
import { onQueryTemplateById } from '@/api/modules/FormDesign'
import SuspendFollowUp from '@/components/SuspendFollowUp/SuspendFollowUp'
import dataCollection from './dataCollection'

export default {
  name: 'FollowUpDetail',
  data() {
    return {
      patId: '',
      planId: '',
      followupId: '',
      followupName: '',
      leftFollowupList: [],
      patientInfo: {},
      formTemplateId: '',
      templateDateById: '',
      formType: '',
      anxFormData: {},
      echoData: {},
      activeTabForm: '',
      isDisabed: false,
      followupStatus: '',
      formTabDatas: [],
      followupTypeText: '',
      feedbackStatus: '',
      followupTypeAssess: '',
      suspendFollowUpVisible: false,
      suspendFollowParams: {},
      patientName: '',
      entryId: '',
      assessmentRadio: '1',
      assessmentVisible: false,
      originEchoData: {},
      feedbackResult: '',
      hisPatientId: '',
      loading: true,
      timeout: null,
      baseUrl: '',
      currentData: {},
    }
  },
  async mounted() {
    this.baseUrl = window.g.VUE_APP_BASE_API + '/ygt-followup'
    await this.initPage()
    await this.getEntryDataToLeft()
    await this.getPatientInfo()
    this.$nextTick(() => {
      this.$refs.scrollBar.wrap.scrollTop = this.$refs.activeItem[0].offsetTop
    })
  },
  methods: {
    // 页面初始化
    async initPage() {
      this.followupId = this.$route.query.followupId
      this.planId = this.$route.query.planId

      await this.getEntrySubmitData()

      await this.getFormTemplate()

      if (this.followupStatus === '1' && this.entryStatus !== '3' && this.followupTypeText !== '网络') {
        // 获取需要自动返显的数据
        await this.getTemplateDateById()
      }

      // 已随访、暂存状态的随访获取回填数据
      if (this.followupStatus === '2' || this.entryStatus === '3') {
        await this.getEntryData()
      }
      this.loading = false
      this.originEchoData = this.$refs.anxForm.getFormInitData()
    },

    // 获取需要自动返显的数据
    async getTemplateDateById() {
      try {
        const res = await getTemplateDateById({
          planId: this.planId,
          templateId: this.templateDateById,
        })
        console.log('getTemplateDateById ----------- ', JSON.parse(res.result))
        this.echoData = JSON.parse(res.result)
        // this.originEchoData = JSON.parse(res.result);
        this.$nextTick(() => {
          this.$refs.anxForm.clearValidateForm()
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 获取左侧数据列表
    async getEntryDataToLeft() {
      const res = await getEntryDataToLeft({ planId: this.planId })
      console.log('getEntryDataToLeft', res)
      this.leftFollowupList = res.result.records.map((item) => ({
        ...item,
        followupTypeText: followUpTypeList.find((followUpType) => followUpType.value === item.followUpType).label,
      }))
      this.currentData = this.leftFollowupList.find((item, index) => {
        return item.followupId === this.followupId
      })
    },

    // 获取页面所需内容
    async getEntrySubmitData() {
      try {
        const res = await getEntrySubmitData({ followupId: this.followupId, planId: this.planId })
        console.log('getEntrySubmitData', res)
        this.followupName = `${res.result.followupDiseaseName}随访`
        this.formTemplateId = res.result.templateId
        this.followupTypeText = followUpTypeList.find((item) => item.value === res.result.followupType).label
        this.isDisabed = res.result.followupStatus === '2' || this.followupTypeText === '网络'
        this.followupStatus = res.result.followupStatus
        this.feedbackStatus = res.result.feedbackStatus
        this.entryStatus = res.result.entryStatus
        this.patientName = res.result.patName
        this.feedbackResult = res.result.feedbackResult
        this.patId = res.result.patId
        this.hisPatientId = res.result.patientId
        this.followupTypeAssess = res.result.followupTypeAssess
        // 版本权限控制
        this.formTabDatas = this.$isP(2)
          ? [
              { label: res.result.planName, name: res.result.planName },
              { label: '数据采集', name: '数据采集' },
            ]
          : [{ label: res.result.planName, name: res.result.planName }]
        // 切换左侧随访时间线，保持右侧的tab不变
        let activeTabForm = this.$route?.query?.activeTabForm || ''
        this.activeTabForm = activeTabForm || res.result.planName || '数据采集'
      } catch (err) {
        console.error(err)
      }
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
      } catch (err) {
        console.log(err)
      }
    },

    // 获取表单模板
    async getFormTemplate() {
      try {
        const res = await onQueryTemplateById({
          id: this.formTemplateId,
          followupId: this.followupId,
        })
        console.log('res======', res)
        this.templateDateById = res.result.id
        this.formType = res.result.type

        this.anxFormData = JSON.parse(res.result.templateData)
      } catch (err) {
        console.error(err)
      }
    },

    // 获取表单回显数据
    async getEntryData() {
      try {
        const res = await getEntryData({ followupId: this.followupId })
        console.log('getEntryData======', res)
        this.entryId = res.result.entryId
        this.echoData = JSON.parse(res.result.templateData)
        // this.originEchoData = JSON.parse(res.result.templateData);
        console.log('this.echoData===', this.echoData)
      } catch (err) {
        console.error(err)
      }
    },

    // 中止
    suspendSubmit() {
      this.suspendFollowUpVisible = true
      this.suspendFollowParams = {
        followupId: this.followupId,
        planId: this.planId,
      }
    },

    // 暂存
    async followupTempSubmit() {
      const formData = this.$refs.anxForm.getFormInitData()
      if (!formData) {
        return
      }
      try {
        const res = await followupToTemStorage({
          followupId: this.followupId,
          patName: this.patientName,
          templateData: JSON.stringify(formData),
          followupDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          followupUserId: sessionStorage.getItem('userId'),
          followupUserName: sessionStorage.getItem('loginName'),
        })
        if (res.code === 0) {
          this.$message.success('暂存成功，请尽快完成！')
          window.sessionStorage.setItem('isBackFromDetail', true)
          this.$router.go(-1)
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 提交
    async followupSubmit() {
      const formData = this.$refs.anxForm.formSubmit()
      if (!formData) {
        return
      }
      try {
        const res = await entryFollowUp({
          followupId: this.followupId,
          patName: this.patientName,
          templateData: JSON.stringify(formData),
          followupDate: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          followupUserId: sessionStorage.getItem('userId'),
          followupUserName: sessionStorage.getItem('loginName'),
          feedbackStatus: '0',
        })
        this.$message.success('您已成功完成一条随访任务!')
        window.sessionStorage.setItem('isBackFromDetail', true)
        window.sessionStorage.removeItem('systemCall')
        window.sessionStorage.removeItem('followupId')
        this.$router.go(-1)
      } catch (err) {
        console.error(err)
      }
    },

    // 评估提交
    async saveAssessment() {
      try {
        const res = await assessToFollowupEntry({
          entryId: this.entryId,
          feedbackResult: this.assessmentRadio,
        })
        this.feedbackStatus = '1'
        this.feedbackResult = this.assessmentRadio
        this.assessmentVisible = false
        console.log(`res`, res)
      } catch (error) {
        console.log(`error`, error)
      }
    },

    // 返回逻辑
    handleBack() {
      this.examineFiledIsChanged()
        .then(() => {
          if (window.sessionStorage.getItem('nextPagePath')) {
            window.pageToNext(window.sessionStorage.getItem('nextPagePath'))
            window.sessionStorage.setItem('nextPagePath', '')
            window.sessionStorage.setItem('isBackFromDetail', true)
          } else {
            window.sessionStorage.setItem('isBackFromDetail', true)
            this.$router.go(-1)
          }
        })
        .catch(() => {})
    },

    // 检查表单内容是否发生改变
    examineFiledIsChanged() {
      const result = this.$refs.anxForm.getFormInitData()
      console.log(this.originEchoData, result)
      let flag = false
      for (const key in result) {
        if (JSON.stringify(result[key]) !== JSON.stringify(this.originEchoData[key])) {
          console.log(key, result[key], this.originEchoData[key])
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

    // 点击左侧切换随访任务
    switchFollowup(item) {
      console.log('item', JSON.parse(JSON.stringify(item)))
      this.currentData = item
      if (item.followupId === this.followupId) {
        return
      }
      if (item.followupStatus === '3') {
        this.$message.warning('提示该任务已中止, 无随访记录')
        return
      }
      if (item.followupStatus === '4') {
        this.$message.warning('提示该任务已关闭, 无随访记录')
        return
      }
      // this.getTemplateDateById();
      this.examineFiledIsChanged().then(() => {
        this.echoData = {}
        this.loading = true
        this.timeout && clearTimeout(this.timeout)
        let query = {
          followupId: item.followupId,
          planId: item.planId,
        }
        if (this.activeTabForm === '数据采集') {
          query.activeTabForm = this.activeTabForm
        }
        this.$router.replace({
          name: 'FollowUpDetail',
          query,
        })
      })
    },
    handleSuccess() {
      window.sessionStorage.removeItem('systemCall')
      window.sessionStorage.removeItem('followupId')
      this.$router.go(-1)
    },
    // 打开360视图
    open360View() {
      window.open(`http://10.10.254.234:8080/share/timeline?patientsn=${this.hisPatientId}`)
    },
    // 提醒--数据采集
    tixing() {
      this.$refs.dataCollection && this.$refs.dataCollection.tixing()
    },
  },
  watch: {
    $route(newRoute) {
      if (newRoute.name === 'FollowUpDetail') {
        this.initPage()
      }
    },
  },
  components: {
    ProLayout,
    PatientInfoCard,
    AnxForm,
    SuspendFollowUp,
    dataCollection,
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  .followup-list {
    width: 220px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 12px 0px 12px 8px;
    margin-right: 15px;
    overflow: hidden;
    height: 100%;
    .followup-item {
      position: relative;
      padding-left: 22px;
      padding-bottom: 20px;
      cursor: pointer;
      &:hover {
        background: #f7f7f7;
      }
      &.active {
        color: #4468bd;
        font-weight: bold;
      }
      &:before {
        content: ' ';
        position: absolute;
        display: inline-block;
        width: 2px;
        top: 12px;
        left: 5px;
        bottom: -6px;
        background: #e8e8e8;
      }
      &:last-child {
        &:before {
          display: none;
        }
      }
      .time-icon {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 6px;
        box-sizing: border-box;
        background: #fff;
        &.load-followup {
          border: 2px solid #4468bd;
        }
        &.has-followuped-normal {
          background: #4468bd;
        }
        &.has-followuped-timeout {
          background: #f3666c;
        }
        &.load-followup-timeout {
          border: 2px solid #f3666c;
        }
        &.temp-save {
          border: 1px solid #4468bd;
          &:before {
            display: inline-block;
            content: ' ';
            position: absolute;
            top: -1px;
            width: 7px;
            height: 12px;
            border-radius: 7px 0 0 7px;
            transform: translate(-1px, 0);
            background: #4468bd;
          }
        }
        &.temp-save-timeout {
          border: 1px solid #f3666c;
          &:before {
            display: inline-block;
            content: ' ';
            position: absolute;
            top: -1px;
            width: 7px;
            height: 12px;
            border-radius: 7px 0 0 7px;
            transform: translate(-1px, 0);
            background: #f3666c;
          }
        }
        &.suspened {
          background: #919191;
        }
        &.closed {
          background: #919191;
        }
      }
      .el-icon-question {
        color: #4468bd;
        margin-left: 2px;
      }
      .extra-time {
        font-size: 12px;
      }
    }
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .form-container {
      flex: 1;
      background-color: #fff;
      margin-bottom: 45px;
      overflow: auto;
      .assessment {
        position: absolute;
        right: 10px;
        top: 280px;
        width: 100px;
        height: 36px;
        line-height: 36px;
        border-radius: 20px 0px 0px 20px;
        background-color: rgba(159, 157, 157, 100);
        color: #fff;
        font-size: 14px;
        text-align: center;
        z-index: 2;
      }
    }
    .form-container::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    .form-container::-webkit-scrollbar-thumb {
      background-color: #dedde3;
      border-radius: 8px;
    }
  }
  .actions {
    position: fixed;
    left: 208px;
    bottom: 0;
    right: 0;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    box-shadow: 0px -1px 3px 0px rgba(204, 204, 204, 80);
    text-align: right;
    padding-right: 25px;
    z-index: 1000;
  }

  .actions2 {
    position: fixed;
    left: 208px;
    bottom: 0;
    right: 0;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    box-shadow: 0px -1px 3px 0px rgba(204, 204, 204, 80);
    // text-align: right;
    display: flex;
    justify-content: space-between;
    padding-right: 25px;
    z-index: 1000;
    padding-left: 20px;
  }
}
</style>

<style scoped>
::v-deep .el-timeline-item__node {
  background-color: #fff;
  border: 2px solid #446abd;
}
::v-deep.el-timeline-item__node--primary {
  background-color: #446bbd !important;
}
::v-deep .el-tabs__header {
  padding-left: 8px;
  background-color: #fff;
}

::v-deep.el-timeline-item.supply-active .el-timeline-item__node {
  background-color: #fff;
  border: 2px solid red;
}
::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #606266;
  border-color: #606266;
}
::v-deep .el-radio__input.is-disabled.is-checked + span.el-radio__label {
  color: #606266;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #606266;
  border-color: #606266;
}
::v-deep .el-checkbox__input.is-disabled.is-checked + span.el-checkbox__label {
  color: #606266;
}
::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}
::v-deep .el-tag.el-tag--info {
  color: #606266;
}
</style>

<style>
.el-scrollbar__thumb {
  background-color: #aaa !important;
}
</style>
