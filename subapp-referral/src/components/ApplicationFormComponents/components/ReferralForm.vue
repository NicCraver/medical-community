<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" :disabled="formStatus === 'examine' || formStatus === 'disabled'" ref="ruleForm" label-width="130px">
      <section class="main-from">
        <el-collapse v-model="active1">
          <el-collapse-item title="患者信息：" name="1">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名：" prop="patName">
                  <el-input v-model="ruleForm.patName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证号：" prop="idNo">
                  <el-input v-model="ruleForm.idNo" @input="idNoChange" maxlength="18"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别：" prop="sex">
                  <el-select v-model="ruleForm.sex" placeholder="请选择">
                    <el-option v-for="item in sexList" :key="item.LABLE" :label="item.LABLE" :value="item.VALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系电话：" prop="phoneNo">
                  <el-input v-model="ruleForm.phoneNo" maxlength="11"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="门诊/住院号：" prop="caseNo">
                  <el-input v-model="ruleForm.caseNo" maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="医保类型：">
                  <el-select v-model="ruleForm.medicareType" placeholder="请选择">
                    <el-option v-for="item in medicareTypeList" :key="item.LABLE" :label="item.LABLE" :value="item.VALUE" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系地址：">
                  <div style="display: flex">
                    <div style="width: 260px">
                      <AddressCascader ref="cascader" v-model="ruleForm.address" />
                      <!-- <el-cascader v-model="ruleForm.address" :options="areaList" :props="{ value: 'value' }" ref="cascader" style="width: 260px" /> -->
                    </div>
                    <!-- <el-select v-model="ruleForm.address" style="width: 240px; margin-right: 10px" placeholder="请选择">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select> -->
                    <el-input v-model="ruleForm.address1" style="margin-left: 10px; width: 100%"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </section>
      <section class="main-from" style="margin-top: 10px">
        <el-collapse v-model="active2">
          <el-collapse-item title="转诊信息" name="1">
            <el-row>
              <el-col :span="4">
                <el-form-item label="转诊类型：" prop="referralType">
                  <el-select v-model="ruleForm.referralType" placeholder="请选择" style="width: 120px">
                    <el-option label="上转" value="A"></el-option>
                    <el-option label="下转" value="B"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="申请转诊日期：">
                  <el-date-picker
                    @change="changeApplyDate"
                    v-model="ruleForm.applyDate"
                    type="date"
                    :picker-options="pickerOptions0"
                    placeholder="选择日期"
                    style="width: 150px"
                    :editable="false"
                    :clearable="false"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="转出机构：">
                  <el-input v-model="deptObject.hosName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="转出科室：">
                  <el-input v-model="deptObject.deptName" readonly style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="转诊医生：">
                  <el-input v-model="ruleForm.applyDrName" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!-- <el-col :span="24">
                <el-form-item label="转诊目标：" prop="referralGoal">
                  <el-input v-model="ruleForm.referralGoal" maxlength="1000" show-word-limit></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="24">
                <el-form-item label="诊断：" prop="diagnosis">
                  <el-input v-model="ruleForm.diagnosis" maxlength="1000" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现病史：" prop="hpi">
                  <el-input
                    v-model="ruleForm.hpi"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 15 }"
                    maxlength="1000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="既往史：" prop="pastHistory">
                  <el-input
                    v-model="ruleForm.pastHistory"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 15 }"
                    maxlength="1000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="治疗经过：">
                  <el-input
                    v-model="ruleForm.treatment"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 15 }"
                    maxlength="1000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="治疗方案：">
                  <el-input
                    v-model="ruleForm.curePlan"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 15 }"
                    maxlength="1000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="注意事项：">
                  <el-input v-model="ruleForm.notice" maxlength="1000" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
                <el-form-item label="转诊记录：">
                  <el-input v-model="ruleForm.referralRecord" maxlength="1000" show-word-limit></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="转入机构：" prop="inHosId">
                  <el-select
                    v-model="ruleForm.inHosId"
                    placeholder="请选择"
                    popper-class="popperClass"
                    filterable
                    @change="transferInstitutionChange"
                  >
                    <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in orgOrHosOptions" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <!-- prop="inDeptIds" -->
                <el-form-item label="转入科室：">
                  <div style="display: flex">
                    <el-select
                      placeholder="科室类别"
                      v-model="ruleForm.deptType"
                      :disabled="!ruleForm.inHosId"
                      style="width: 400px"
                      clearable
                      @change="initDeptCascaderOptions"
                      popper-class="popperClass"
                      filterable
                    >
                      <el-option :label="item.LABLE" :value="item.VALUE" :key="item.VALUE" v-for="item in deptTypeList" />
                    </el-select>
                    <div style="width: 100%; margin-left: 10px">
                      <el-cascader
                        @change="cascaderChange"
                        v-model="ruleForm.inDeptIds"
                        popper-class="popperClass2"
                        style="width: 100%"
                        :options="deptCascaderOptions"
                        placeholder="科室名称"
                        clearable
                        filterable
                        :disabled="!ruleForm.deptType"
                      />
                    </div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="接诊医生：">
                  <el-select
                    filterable
                    v-model="ruleForm.receiveDrId"
                    :disabled="ruleForm.inDeptIds.length === 0"
                    popper-class="popperClass"
                    placeholder="请选择医生"
                    clearable
                  >
                    <el-option :label="item.LABEL" :value="item.VALUE" :key="item.VALUE" v-for="item in inDeptIdsList" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </section>
    </el-form>
  </div>
</template>

<script>
import {
  getDictionary,
  getReceiveDoctorOptions,
  getRegions,
  getReferralInfoById,
  getReferralHosOptions,
  onCheckIdNo,
  getOrgOrHosOptionsForApply,
} from '@/api/modules/patientCenter'
import AddressCascader from '@/components/AddressCascader'
import { debounce } from '@/utils/index'
import dayjs from 'dayjs'
export default {
  components: {
    AddressCascader,
  },
  props: {
    referralDetail: Object,
  },
  data() {
    return {
      formStatus: 'add',
      active1: ['1'],
      active2: ['1'],
      ruleForm: {
        // patId: '', // 患者id
        // referralGoal: '', //转诊目标
        // referralId: '', //转诊申请单ID
        patName: '', //患者姓名
        idNo: '', //身份证号
        sex: '', //性别
        phoneNo: '', //手机号
        medicareType: '', //医保类型
        address: '', //联系地址
        address1: '', //详细地址
        referralType: '', //转诊类型
        applyDate: '', //申请转诊日期
        outHosId: '', //转出机构
        outDeptId: '', //转出科室
        applyDrId: '', //转诊医生
        hpi: '', //现病史
        pastHistory: '', //既往史
        curePlan: '', //治疗方案
        referralRecord: '', //转诊记录
        inHosId: '', //转入机构
        inDeptIds: [], //转入科室
        receiveDrId: '', //接诊医生
        caseNo: '', //门诊/住院号
        status: '', //0-暂存，1-提交
      },
      rules: {
        patName: [{ required: true, message: '请输入', trigger: 'blur' }],
        idNo: [{ required: true, message: '请输入', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择', trigger: 'blur' }],
        phoneNo: [{ required: true, message: '请输入', trigger: 'blur' }],
        caseNo: [{ required: true, message: '请输入', trigger: 'blur' }],
        referralType: [{ required: true, message: '请选择', trigger: 'blur' }],
        diagnosis: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 0, max: 1000, message: '长度不能超过1000', trigger: 'blur' },
        ],
        hpi: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 0, max: 1000, message: '长度不能超过1000', trigger: 'blur' },
        ],
        pastHistory: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 0, max: 1000, message: '长度不能超过1000', trigger: 'blur' },
        ],
        inHosId: [{ required: true, message: '请输入', trigger: 'blur' }],
        inDeptIds: [{ required: true, message: '请输入', trigger: 'blur' }],
        referralGoal: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [{ required: true, message: '请选择', trigger: 'change' }],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
        resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
      },
      medicareTypeList: [],
      orgOrHosOptions: [],
      deptTypeList: [],
      deptCascaderOptions: [],
      inDeptIdsList: [],
      areaList: [],
      sexList: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      deptObject: {},
      loginName: '',
      isClear: false,
      flagCut: window.sessionStorage.getItem('saveFlagParamsData') ? true : false,
    }
  },
  watch: {
    referralDetail: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.init(JSON.parse(JSON.stringify(newValue)))
      },
    },
    'ruleForm.deptType': {
      handler(newValue, oldValue) {
        if (this.formStatus !== 'add' && this.formStatus !== 'edit' && this.formStatus !== 'temporaryStorage') {
          this.getOrgOrHosOptionsForApply()
          this.getReceiveDoctorOptions(this.ruleForm.inDeptIds[this.ruleForm.inDeptIds.length - 1])
        }
      },
    },
    'ruleForm.inDeptIds': {
      handler(newValue, oldValue) {
        console.log('newValue', newValue)
      },
    },
    ruleForm: {
      deep: true,
      handler(params) {
        setTimeout(() => {
          if (this.formStatus == 'add' && !this.flagCut) {
            window.sessionStorage.setItem('saveRuleForm', JSON.stringify(params))
          }
        }, 1000)
      },
    },
  },
  created() {
    const { status } = this.$route.query
    this.formStatus = status
    this.deptObject = JSON.parse(sessionStorage.getItem('deptObject'))
    console.log(`this.deptObject`, this.deptObject)
    console.log('sessionStorage.getItem()', sessionStorage.getItem('loginName'))
    // this.ruleForm.applyDrName = sessionStorage.getItem('loginName')
    this.$set(this.ruleForm, 'applyDrName', sessionStorage.getItem('loginName'))
    this.DepartmentType()
    this.getReferralHosOptions()
    this.TypeMedicalInsurance()
    this.getRegions()
    this.getSexList()
    this.ruleForm.applyDate = dayjs().format('YYYY-MM-DD')
  },
  methods: {
    changeApplyDate() {
      this.ruleForm.applyDate = dayjs(this.ruleForm.applyDate).format('YYYY-MM-DD')
    },
    init(value) {
      console.log('value===============', value ? JSON.parse(JSON.stringify(value)) : value)
      const { status } = this.$route.query
      console.log(`status`, status)
      this.formStatus = status
      this.deptObject = JSON.parse(sessionStorage.getItem('deptObject'))
      const { referralId, patId } = this.$route.query
      if (value !== undefined && Object.keys(value).length !== 0) {
        console.log(`111111111122`, 111111111122)
        this.ruleForm = value
        if (status !== 'add') {
          this.$set(this.deptObject, 'hosName', value.outHosName)
          this.$set(this.deptObject, 'deptName', value.outDeptName)
        }
        this.$set(this.ruleForm, 'patName', value.name)
        this.$set(this.ruleForm, 'phoneNo', value.phone)
        console.log('value.receiveDrId', value.receiveDrId)
        if (value.receiveDrId !== null) {
          this.$set(this.ruleForm, 'receiveDrId', value.receiveDrId)
        } else {
          this.$set(this.ruleForm, 'receiveDrId', '')
        }
        if (value.applyDate !== null) {
          this.$set(this.ruleForm, 'applyDate', value.applyDate)
        } else {
          this.ruleForm.applyDate = dayjs().format('YYYY-MM-DD')
        }
        if (value.applyDrName !== '') {
          this.$set(this.ruleForm, 'applyDrName', value.applyDrName)
        } else {
          this.$set(this.ruleForm, 'applyDrName', sessionStorage.getItem('loginName'))
        }
        if (value.referralId && value.referralId !== '' && value.referralId !== '/') {
          console.log(`222222222222222`, 222222222222222)
          this.$set(this.deptObject, 'hosName', value.outHosName)
          this.$set(this.deptObject, 'deptName', value.outDeptName)
          this.$set(this.deptObject, 'hosId', value.outHosId)
          this.$set(this.deptObject, 'deptId', value.outDeptId)
        }
        // if (value.inHosId !== '') {
        //   this.$set(this.ruleForm, 'receiveDrId', value.receiveDrId)
        // } else {
        //   this.$set(this.ruleForm, 'receiveDrId', '')
        // }
        if (value.deptType !== '') {
          this.$set(this.ruleForm, 'deptType', value.deptType)
          this.getOrgOrHosOptionsForApply()
        }
        if (value.inDeptIds.length !== 0) {
          this.$set(this.ruleForm, 'inDeptIds', value.inDeptIds)
          this.getReceiveDoctorOptions(this.ruleForm.inDeptIds[this.ruleForm.inDeptIds.length - 1])
        }
      }
      this.$set(this.ruleForm, 'patId', patId)
      this.$set(this.ruleForm, 'referralId', referralId)
      // this.getOrgOrHosOptionsForApply()
      // this.initDeptCascaderOptions('init')
      // this.cascaderChange('init')
      // this.getReceiveDoctorOptions()
      console.log('this.ruleForm', this.ruleForm)
    },
    // 返显
    async getReferralInfoById(patId, referralId) {
      try {
        const res = await getReferralInfoById({ id: referralId })
        this.ruleForm = res.result

        this.$set(this.ruleForm, 'patId', patId)
        this.$set(this.ruleForm, 'referralId', referralId)
        this.$set(this.ruleForm, 'patName', res.result.name)
        this.$set(this.ruleForm, 'phoneNo', res.result.phone)
        // this.ruleForm.patId = patId
        // this.ruleForm.referralId = referralId
        // this.ruleForm.patName = res.result.name
        // this.ruleForm.phoneNo = res.result.phone
        this.loginName = res.result.applyDrName
      } catch (error) {
        console.error('error', error)
      }
    },
    // 暂存
    saveReferralInfo(type) {
      let flag = true
      // let tempDate = JSON.parse(JSON.stringify(this.ruleForm.applyDate));
      // console.log("tempDate.substring(0, 10)", tempDate.substring(0, 10));
      // this.ruleForm.applyDate = tempDate.substring(0, 10);
      let arr = ['patName', 'idNo', 'caseNo', 'sex', 'phoneNo']
      // console.log('this.ruleForm.deptType', this.ruleForm.deptType)
      //提醒弹框 - 暂存
      if (type) this.ruleForm = JSON.parse(window.sessionStorage.getItem('saveRuleForm'))
      //console.log(this.ruleForm)
      if (this.ruleForm.deptType !== '' && this.ruleForm.deptType !== undefined) {
        arr.push('inDeptIds')
      }
      if (this.ruleForm.hpi !== '') {
        arr.push('hpi')
      }
      if (this.ruleForm.pastHistory !== '') {
        arr.push('pastHistory')
      }
      this.ruleForm.outHosId = this.deptObject.hosId
      this.ruleForm.outDeptId = this.deptObject.deptId
      this.ruleForm.applyDrId = sessionStorage.getItem('userId')
      if (type) {
        arr.forEach((item) => {
          if (!this.ruleForm[item]) flag = false
        })
      } else {
        this.$refs['ruleForm'].validateField(arr, (valid) => {
          if (valid !== '') {
            flag = false
          }
        })
      }
      return {
        flag,
        formData: this.ruleForm,
      }
    },
    submitForm() {
      let flag
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          flag = true
        } else {
          console.log('error submit!!')
          flag = false
          return false
        }
      })
      if (flag) {
        // this.$set
        // let tempDate = JSON.parse(JSON.stringify(this.ruleForm.applyDate));
        // console.log('tempDate.substring(0, 10)', tempDate.substring(0, 10))
        // this.ruleForm.applyDate = tempDate.substring(0, 10);
        this.ruleForm.outHosId = this.deptObject.hosId
        this.ruleForm.outDeptId = this.deptObject.deptId
        this.ruleForm.applyDrId = sessionStorage.getItem('userId')
        // console.log('this.ruleForm', JSON.parse(JSON.stringify(this.ruleForm)))
        return {
          flag,
          formData: this.ruleForm,
        }
      } else {
        return {
          flag,
          formData: {},
        }
      }
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    async getRegions() {
      try {
        const res = await getRegions({ regionCode: '650000' })

        function deleteChildren(arr) {
          let childs = arr
          for (let i = childs.length; i--; i > 0) {
            if (childs[i].children) {
              if (childs[i].children.length) {
                deleteChildren(childs[i].children)
              } else {
                delete childs[i].children
              }
            }
          }
          return arr
        }
        // console.log('deleteChildren(res.result)', JSON.stringify(deleteChildren(res.result)))
        this.areaList = deleteChildren(res.result)
      } catch (err) {
        console.error(err)
      }
    },
    async getSexList() {
      try {
        const res = await getDictionary({ id: '55adjalldjf343249953434fksdd' })
        this.sexList = res.result
        console.log('this.sexList', this.sexList)
      } catch (err) {
        console.error(err)
      }
    },
    async DepartmentType() {
      try {
        const res = await getDictionary({ code: 'DEPT_CLASSIFY' })
        this.deptTypeList = res.result
        console.log('科室类别', this.deptTypeList)
      } catch (err) {
        console.error(err)
      }
    },
    // 医保类型
    async TypeMedicalInsurance() {
      try {
        const res = await getDictionary({ id: 'adj834230jdkad024849203923' })
        this.medicareTypeList = res.result
      } catch (error) {
        console.error(error)
      }
    },
    // 查询接诊医生
    async getReceiveDoctorOptions(deptId) {
      console.log('deptId', deptId)
      if (deptId) {
        try {
          const res = await getReceiveDoctorOptions({ deptId })
          this.inDeptIdsList = res.result
        } catch (error) {
          console.error(error)
        }
      }
    },
    async getReferralHosOptions() {
      try {
        const res = await getReferralHosOptions({
          orgId: this.deptObject.orgId, //当前登录用户所在集团id
          hosId: this.deptObject.hosId, //当前登录用户所在医院id
        })
        this.orgOrHosOptions = res.result
      } catch (error) {
        console.error('error', error)
      }
    },
    transferInstitutionChange() {
      this.ruleForm.deptType = ''
      this.ruleForm.inDeptIds = []
      this.ruleForm.receiveDrId = ''
    },
    idNoChange: debounce(function () {
      console.log(this.ruleForm.idNo)
      this.onCheckIdNo()
    }, 500),
    async onCheckIdNo() {
      if (this.ruleForm.idNo.length === 15 || this.ruleForm.idNo.length === 18) {
        try {
          const res = await onCheckIdNo({
            idNo: this.ruleForm.idNo,
          })
          console.log('this.ruleForm.referralId', this.ruleForm.referralId)
          if (res.result.message && !this.ruleForm.referralId) {
            this.$confirm(res.result.message, '提示', {
              confirmButtonText: res.result.warnType === 'A' ? '查看' : '同步',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                if (res.result.warnType === 'A') {
                  this.$router.replace({
                    name: 'ReferralPatientCenterDetail',
                    query: {
                      status: 'disabled',
                      referralId: res.result.referralId,
                      patId: res.result.patId,
                      btnStatus: '0',
                    },
                  })
                  // status=disabled&referralId=576977afbf5c4233b7ec75a8fe130d1b&patId=925e2f1a440d49c48e2647a75052e808&btnStatus=0
                } else {
                  this.$set(this.ruleForm, 'patName', res.result.patName)
                  this.$set(this.ruleForm, 'idNo', res.result.idNo)
                  this.$set(this.ruleForm, 'sex', res.result.sex)
                  this.$set(this.ruleForm, 'phoneNo', res.result.phoneNo)
                  this.$set(this.ruleForm, 'medicareType', res.result.medicareType)
                  this.$set(this.ruleForm, 'address', res.result.address)
                  this.$set(this.ruleForm, 'address1', res.result.address1)
                  this.$set(this.ruleForm, 'patId', res.result.patId)
                  this.$set(this.ruleForm, 'hpi', res.result.hpi)
                  this.$set(this.ruleForm, 'pastHistory', res.result.pastHistory)
                  this.isClear = true
                }
              })
              .catch(() => {})
          } else {
            if (this.isClear) {
              this.$set(this.ruleForm, 'patName', '')
              this.$set(this.ruleForm, 'sex', '')
              this.$set(this.ruleForm, 'phoneNo', '')
              this.$set(this.ruleForm, 'medicareType', '')
              this.$set(this.ruleForm, 'address', '')
              this.$set(this.ruleForm, 'address1', '')
              this.$set(this.ruleForm, 'patId', '')
              this.isClear = false
            }
            // this.$refs['ruleForm'].clearValidate()
            // console.log('22222222222', 22222222222)
          }
        } catch (err) {
          console.error(err)
        }
      }
    },
    // 转入科室数据
    async getOrgOrHosOptionsForApply() {
      try {
        const res = await getOrgOrHosOptionsForApply({
          parentId: this.ruleForm.inHosId,
          deptType: this.ruleForm.deptType,
          status: this.formStatus === 'add' || this.formStatus === 'temporaryStorage' ? 'Y' : '',
        })
        this.deptCascaderOptions = res.result
        console.log(res.result)
        console.log('this.deptCascaderOptions', this.deptCascaderOptions)
      } catch (err) {
        console.error(err)
      }
    },
    // 切换转入科室分类
    initDeptCascaderOptions() {
      if (this.ruleForm.deptType === '') {
        this.$set(this.ruleForm, 'inDeptIds', [])
        this.$set(this.ruleForm, 'receiveDrId', '')
      } else {
        this.$set(this.ruleForm, 'inDeptIds', [])
        this.$set(this.ruleForm, 'receiveDrId', '')
        this.getOrgOrHosOptionsForApply()
      }
    },
    // 切换转入科室名称
    cascaderChange() {
      this.$set(this.ruleForm, 'receiveDrId', '')
      if (this.ruleForm.inDeptIds.length !== 0) {
        this.getReceiveDoctorOptions(this.ruleForm.inDeptIds[this.ruleForm.inDeptIds.length - 1])
      }
    },
    // 转入科室名称
  },
}
</script>

<style lang="scss" scoped>
.main-from {
  min-width: 1230px;
  height: 100%;
  padding: 10px;
  background-color: #fff;
  .el-input {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>

<style>
.popperClass {
  height: 264px;
}
.popperClass2 {
  max-height: 264px;
}
</style>
<style media="print">
@page {
  size: auto;
  margin: 3mm;
}

html {
  background-color: #ffffff;
  height: auto;
  margin: 0px;
}
</style>
