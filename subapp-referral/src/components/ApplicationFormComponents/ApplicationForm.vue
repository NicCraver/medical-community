<template>
  <div class="ApplicationForm" v-loading="loading">
    <header class="header">转诊申请单</header>
    <!-- <div v-loading="loading"> -->
      <ProcessStep :referralDetail="referralDetail"> </ProcessStep>
      <main class="main" v-show="showForm">      
        <ReferralForm ref="ReferralFormRef" :referralDetail="referralDetail" />
      </main>
      <main v-show="!showForm" class="main" style="padding: 10px; background-color: #fff">      
        <ReferralTable :referralDetail="referralDetail" ref="referralTable" />
      </main>

      <footer class="footer">
        <div>
          <el-button type="text" @click="onCancel" v-if="status === 'temporaryStorage'"> 取消转诊申请 </el-button>
        </div>
        <div class="right">
          <el-button
            type="primary"
            @click="onSubmit"
            v-if="status === 'add' || status === 'notDisabled' || status === 'temporaryStorage' || status === 'edit'"
          >
            提交
          </el-button>
          <el-button @click="onTemporaryStorage('')" v-if="status === 'add' || status === 'notDisabled' || status === 'temporaryStorage'">
            暂存
          </el-button>
          <el-button
            @click="$emit('suspend-click', referralDetail)"
            v-if="
              (referralDetail.applyStatus === '0' || referralDetail.applyStatus === '1') &&
              $route.query.status !== 'examine' &&
              $route.query.status !== 'disabled'
            "
          >
            关闭
          </el-button>
          <el-button type="text" @click="goReferral" v-if="referralDetail.applyStatus === '2'">*如需撤回/关闭请前往转诊列表</el-button>
          <el-button
            type="primary"
            @click="$emit('reback-referral', referralDetail)"
            v-if="referralDetail.applyStatus === '6' && $route.query.status === 'examine'"
          >
            恢复
          </el-button>
          <div v-if="printBtnShowFlag" style="margin: 0 10px">
            <el-button v-print="printObj">打印</el-button>
          </div>
          <el-button @click="goBack">返回</el-button>
          <el-button type="primary" @click="handleAdmissionClick" v-if="$route.name === 'AdmissionsListDetail' && $route.query.status !== 'examine'">
            接诊
          </el-button>
        </div>
      </footer>
      <div style="width: 0; height: 0; overflow: hidden">
        <el-card class="print-card" id="print-content" shadow="never">
          <div style="font-size: 16px; padding: 20px">
            <h1 style="font-size: 24px; text-align: center">双向转诊（转出）单</h1>
            <!-- text-decoration: underline -->
            <p>
              <span>
                <strong>{{ referralDetail.inHosName }}</strong>
                （机构名称）
              </span>
            </p>
            <div style="text-indent: 2em">
              <p>
                <span>现有患者 </span>
                <span style="text-decoration: underline"> {{ referralDetail.name }} </span>
                <span> 性别：</span>
                <span style="text-decoration: underline"> {{ referralDetail.sexDesc }} </span>
                <span> 年龄：</span>
                <span style="text-decoration: underline">{{ referralDetail.refAge }}岁，（{{ referralDetail.phone }}） </span>
                <span>&nbsp;&nbsp;因病情需要，需转入贵单位，请予以接诊。</span>
              </p>
              <p><strong>我院诊疗情况：</strong></p>
              <!-- <p>
              {{ firstSentence(referralDetail) }}
            </p> -->
              <p><strong>主要现病史：</strong></p>
              <p>
                {{ referralDetail.hpi }}
              </p>
              <p><strong>主要既往史：</strong></p>
              <p>
                {{ referralDetail.pastHistory }}
              </p>
              <p><strong>诊断：</strong></p>
              <p>
                {{ referralDetail.diagnosis }}
              </p>
              <p><strong>治疗经过及转出原因：</strong></p>
              <p>
                {{ referralDetail.treatment }}
              </p>
              <p><strong>治疗方案：</strong></p>
              <p>
                {{ referralDetail.curePlan }}
              </p>
              <p><strong>注意事项：</strong></p>
              <p>
                {{ referralDetail.notice }}
              </p>

              <div style="position: relative；height: 100px;">
                <div style="position: absolute; right: 80px; height: 100px">
                  <p>
                    <strong>接诊医生（签字）：{{ referralDetail.receiveDrName }}</strong>
                  </p>
                  <p>
                    <strong>转诊医生（签字）：{{ referralDetail.createUserName }}</strong>
                  </p>
                  <p>
                    <strong>转诊医生联系电话：{{ deptTelephone }}</strong>
                  </p>
                  <div style="text-align: right">
                    <p>
                      <strong> {{ referralDetail.outHosName }} </strong>（机构名称）
                    </p>
                    <p style="text-align: right">
                      <span>{{ taday }}</span>
                      <!-- <span style="margin-left: 30px">月</span>
                    <span style="margin-left: 30px">日</span> -->
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import ProcessStep from '@/components/ProcessStep/index.vue'
import { onSaveReferral, getReferralInfoById, onCancelReferral } from '@/api/modules/patientCenter'
import ReferralTable from '../ReferralTable'
import ReferralForm from './components/ReferralForm'
import dayjs from 'dayjs'
export default {
  components: {
    ProcessStep,
    ReferralTable,
    ReferralForm,
  },
  data() {
    return {
      loading: false,
      showForm: true,
      referralId: '',
      referralDetail: {},
      status: '',
      patId: '',
      btnStatus: '',
      printDrawer: true,
      printObj: {
        id: 'print-content',
        popTitle: '',
        // extraCss: 'https://www.google.com,https://www.google.com',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        beforeOpenCallback(vue) {
          vue.printLoading = true
          console.log('打开之前')
        },
        openCallback(vue) {
          vue.printLoading = false
          console.log('执行了打印')
        },
        closeCallback(vue) {
          console.log('关闭了打印工具')
        },
      },
    }
  },
  computed: {
    printBtnShowFlag() {
      if (this.$route.name === 'AdmissionsListDetail') {
        return false
      }
      if (this.$route.name === 'ReferralPatientCenterDetail') {
        return !(this.btnStatus === '2' || this.status === 'add')
      }
      if (this.$route.name === 'ReferralListDetail') {
        return this.referralDetail.applyStatus !== '6'
      }
    },
    taday() {
      return dayjs(new Date()).format('YYYY年MM月DD日')
    },
    deptTelephone() {
      return JSON.parse(sessionStorage.getItem('deptObject')).deptTelephone
    },
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.init()
      },
      deep: true
    },
  },
  mounted() {
    this.init()
    // let ids = []
    // this.mockData(ids, '测试0523', '0523')
  },
  methods: {
    init() {
      this.referralId = this.$route.query.referralId || ''
      this.patId = this.$route.query.patId || ''
      this.status = this.$route.query.status || ''
      this.btnStatus = this.$route.query.btnStatus || ''
      console.log('this.referralId', this.referralId)
      console.log('this.status', this.status)
      console.log('this.patId', this.patId)
      this.getReferralInfoById()
    },
    // 初步印象
    firstSentence(row) {
      if (!Object.keys(row).length) return
      let temp = row
      return temp.hpi.split('。')[0]
    },
    // 获取转诊申请信息
    async getReferralInfoById() {
      if (!this.referralId) {
        return
      }
      this.loading = true
      try {
        let data = {
          id: this.referralId === '/' ? '' : this.referralId,
          patId: this.status === 'temporaryStorage' ? '' : this.status === 'notDisabled' ? this.patId : this.referralId === '/' ? this.patId : '',
        }
        // console.log('data', data)
        const res = await getReferralInfoById(data)
        console.log('getReferralInfoById==', res)
        this.referralDetail = res.result

        // console.log('this.referralDetail', JSON.parse(JSON.stringify(this.referralDetail)))
        // console.log('this.referralDetail.applyStatus', this.referralDetail.applyStatus)
        // 表格或表单
        if (this.referralDetail.applyStatus) {
          this.showForm = parseInt(this.referralDetail.applyStatus) < 3
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error', error)
      }
    },
    async postSubmit(formData, msg) {
      console.log('formData', formData)
      try {
        const res = await onSaveReferral({
          ...formData,
          createAllName: window.sessionStorage.getItem('headerLoginName'),
          patId: this.referralDetail.patId ? this.referralDetail.patId : formData.patId ? formData.patId : '',
          referralId: this.referralDetail.id || this.referralDetail.referralId || '',
        })
        // console.log(res)
        //标识已提交，或已暂存
        if(res.code == 0){
           window.sessionStorage.setItem('saveFlagParamsData', JSON.stringify(res.result))
           this.$message.success(msg)
        }
       
        if (formData.status === '1') {
          this.$router
            .replace({
              name: 'ReferralPatientCenterDetail',
              query: {
                status: 'disabled',
                referralId: res.result.referralId,
                patId: res.result.patId,
              },
            })
            .catch((error) => {
              if (error.name !== 'ReferralPatientCenterDetail' && !error.message.includes('Avoided redundant navigation to current location')) {
                console.log(error)
              }
            })
          this.init()
          this.$refs.ReferralFormRef.init()
        }
        if (formData.status === '0') {
          this.$router
            .replace({
              name: 'ReferralPatientCenterDetail',
              query: {
                status: 'temporaryStorage',
                referralId: res.result.referralId,
                patId: res.result.patId,
              },
            })
            .catch((error) => {
              if (error.name !== 'ReferralPatientCenterDetail' && !error.message.includes('Avoided redundant navigation to current location')) {
                console.log(error)
              }
            })
          this.init()
          this.$refs.ReferralFormRef.init()
        }
      } catch (error) {
        console.error('error', error)
      }
    },
    onSubmit() {
      // "status":0-暂存，1-提交
      const { flag, formData } = this.$refs.ReferralFormRef.submitForm()
      if (flag) {
        formData.status = '1'
        console.log('formData', formData)
        this.postSubmit(formData, '提交成功')
      }
    },
    // 取消转诊申请
    onCancel() {
      this.$confirm('您确定要取消本次转诊申请？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.onCancelReferral()
        })
        .catch(() => {})
    },
    async onCancelReferral() {
      try {
        const res = await onCancelReferral({
          referralId: this.referralId,
        })
        this.$message.success('取消成功')
        this.$router.go(-1)
      } catch (error) {
        console.error('error', error)
      }
    },
    onTemporaryStorage(type) {
      console.log('2222222222', 2222222222)
      const { flag, formData } = this.$refs.ReferralFormRef.saveReferralInfo(type)
      console.log('flag', flag, formData)
      if (flag) {
        formData.status = '0'
        console.log('formData', formData)
        this.postSubmit(formData, '暂存成功')
        return false;
      }else{
        return true;
      }
    },
    openPrintDialog() {
      // console.log(this.$refs)
      // this.$refs.printClick.$el.click()
    },
    onPrint() {
      this.printDrawer = true
    },
    goReferral() {
      window.sessionStorage.removeItem('activeTab')
      this.$router.push({
        name: 'ReferralList',
        params: {
          name: this.referralDetail.name,
        },
      })
    },
    goBack() {
      console.log('this.status', this.status)
      //this.$router.go(-1)
      let flagCut = window.sessionStorage.getItem('saveFlagParamsData') ? true : false;  
      if (this.status === 'add' && !flagCut) {
        this.$confirm('您有未保存的记录，确认要离开吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {         
          this.$router.push({name:'ReferralPatientCenter', params:{type: 'back'}})
        })
        .catch(() => {})
      } else {
        this.$router.go(-1)
      }
    },
    mockData(ids, patName, caseNo) {
      for (let i = 0; i < ids.length; i++) {
        const _ = ids[i]
        let formData = {
          patName: patName + `${i > 10 ? '0' : '00'}` + (i + 1),
          caseNo: caseNo + `${i > 10 ? '0' : '00'}` + (i + 1),
          idNo: _,
          sex: 'fgajfa4204dsjlf4325wejfsdfss',
          phoneNo: '12521321421',
          medicareType: 'kjadf3498036234rkf09sdkdkfads',
          address: ['650100', '650102'],
          address1: '2125421',
          referralType: 'A',
          applyDate: '2022-05-23',
          outHosId: '8f2654c6f6374cef80f0fc451d26e14b',
          outDeptId: 'efbfac52044a4aea95e03085f46915c9',
          applyDrId: 'da81ca0e1a4942a48667b351b2e57902',
          hpi: '现病史',
          pastHistory: '既往史',
          curePlan: '治疗方案',
          referralRecord: '转诊记录',
          inHosId: 'def3b65478a1420caa1783e1932db171',
          inDeptIds: ['f9b5d4dfcc1349c5a7dc60141a696c8a', '0bd9d85625e74684aa349fa619dfd802'],
          receiveDrId: 'acd61342c0484a059fa37ae3e1246bf4',
          status: '1',
          patId: '',
          referralId: '',
          applyDrName: '王伟',
          referralGoal: '转诊目标',
          deptType: '8262f6b1710c4f73b658abceea12bf83',
          createAllName: '王伟-门诊>全科医疗科>全科医疗科- 天津市河东区大直沽医院',
        }
        this.postSubmit(formData, '提交成功')
      }
    },
    handleAdmissionClick() {   
      this.$emit('admission-click', {
        ...this.$refs.referralTable.$refs.reviewTable.auditInfo,
        ...this.referralDetail,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ApplicationForm {
  display: flex;
  flex-direction: column;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  // height: 100%;
  .header {
    margin-bottom: 10px;
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    text-align: center;
  }

  .main {
    // height: 100%;
    flex: 1;
    overflow: auto;
  }
  .status {
    text-align: center;
    margin-top: 10px;
    height: 70px;
    line-height: 70px;
    background-color: #fff;
    margin-bottom: 15px;
    padding: 0 20px;
  }
  .footer {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-top: 1px solid #f5f5f5;
    padding: 0 10px;
    .right {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

<style lang="scss">
@page {
  padding: 35px 0px;
}
@media print {
}
</style>
