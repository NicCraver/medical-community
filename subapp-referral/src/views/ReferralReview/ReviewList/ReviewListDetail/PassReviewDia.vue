<template>
  <div class="PassReviewDia">
    <ProDialog
      title="审核通过"
      width="520px"
      :before-close="handleResetClose"
      :close-on-click-modal="false"
      top="30vh"
      v-bind="$attrs"
      :visible="visible"
    >
      <div class="title1">
        患者：{{ referralDetail.patName || referralDetail.name }} {{ referralDetail.sexDesc }}
        {{
          referralDetail.refAge && referralDetail.refAge.indexOf('岁') > -1
            ? referralDetail.refAge
            : `${referralDetail.refAge}岁`
        }}
      </div>
      <el-form
        ref="elForm"
        :model="auditDetail"
        :rules="rules"
        label-width="123px"
        label-position="right"
      >
        <el-form-item label="确认转诊日期：" prop="auditApplyDate">
          <el-date-picker
            v-model="auditDetail.auditApplyDate"
            type="date"
            placeholder="选择转诊日期"
            clearable
            style="width: 100%"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认转入机构：" prop="ackInHosId">
          <el-select
            v-model="auditDetail.ackInHosId"
            placeholder="请选择"
            popper-class="popperClass"
            filterable
            @change="transferInstitutionChange"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              :key="item.value"
              v-for="item in orgOrHosOptions"
            />
          </el-select>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="确认转入科室：" prop="auditDeptType">
              <el-select
                v-model="auditDetail.auditDeptType"
                placeholder="科室类别"
                clearable
                style="width: 100%"
                @change="handleDeptTypeChange"
              >
                <el-option
                  v-for="item in deptTypeList"
                  :key="item.VALUE"
                  :label="item.LABLE"
                  :value="item.VALUE"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="auditDeptIds" label-width="0">
              <el-cascader
                v-model="auditDetail.auditDeptIds"
                style="width: 100%"
                :options="deptCascaderOptions"
                placeholder="请选择科室"
                clearable
                @change="handleDeptChange"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="确认接诊医生：" prop="auditReceiveDrId">
          <el-select
            v-model="auditDetail.auditReceiveDrId"
            placeholder="请选择接诊医生"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in doctorList"
              :key="item.VALUE"
              :label="item.LABEL"
              :value="item.VALUE"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核备注信息：" prop="">
          <el-input
            type="textarea"
            v-model="auditDetail.auditRemark"
            clearable
            maxlength="200"
            show-word-limit
            :autosize="{ minRows: 5, maxRows: 6 }"
            style="width: 100%"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleResetClose">取 消</el-button>
        <el-button type="primary" @click="submitForm()"> 确认通过 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProList, ProDialog } from 'anx-vue'
import { getDictionary, getOrgOrHosOptions } from '@/api/modules/systemAdmin'
import {
  getDeptDoctorOptions,
  getReferralHosOptions,
  getOrgOrHosOptionsForApply,
} from '@/api/modules/patientCenter'
import { auditPassOrRefuse } from '@/api/modules/ReferralReview'

export default {
  name: 'PassReviewDia',
  components: { ProList, ProDialog },
  props: {
    isReady: Boolean,
    referralDetail: Object,
  },
  data() {
    return {
      visible: false,
      deptTypeList: [],
      orgOrHosOptions: [],
      deptCascaderOptions: [],
      doctorList: [],
      rules: {
        auditApplyDate: [{ required: true, message: '请选择确认转诊日期', trigger: 'blur' }],
        ackInHosId: [{ required: true, message: '请选择转入机构', trigger: 'blur' }],
        auditDeptType: [{ required: true, message: '请选择科室类别', trigger: 'blur' }],
        auditDeptIds: [{ required: true, message: '请选择确认转入科室', trigger: 'blur' }],
        auditReceiveDrId: [{ required: true, message: '请选择接诊医生', trigger: 'blur' }],
      },
      auditDetail: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        },
      },
    }
  },
  mounted() {
    this.getDictionary()
  },
  methods: {
    async getDictionary() {
      try {
        const res = await getDictionary({
          code: 'DEPT_CLASSIFY',
        })
        console.log('getDictionary==', res)
        this.deptTypeList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    handleResetClose() {
      this.visible = false
      this.$emit('update:isReady', false)
    },
    submitForm() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          try {
            const params = {
              ...this.auditDetail,
              auditType: '1',
              auditUserId: window.sessionStorage.getItem('userId'),
              auditDeptId: this.auditDetail.auditDeptIds[this.auditDetail.auditDeptIds.length - 1],
              auditUserName: window.sessionStorage.getItem('headerLoginName'),
              // ackInHosId:
            }
            delete params.auditDeptIds
            const res = await auditPassOrRefuse(params)
            console.log('auditPassOrRefuse==', res)
            this.$message.success('审核通过成功')
            this.handleResetClose()
            this.$emit('reload')
            this.$setMessageState()
          } catch (err) {
            console.error(err)
          }
        }
      })
    },
    // 初始化科室数据 new
    async getOrgOrHosOptionsForApply(deptType) {
      try {
        const res = await getOrgOrHosOptionsForApply({
          parentId: this.auditDetail.ackInHosId,
          deptType,
          status: 'Y',
        })
        this.deptCascaderOptions = res.result
        console.log(res.result)
        console.log('this.deptCascaderOptions', this.deptCascaderOptions)
      } catch (err) {
        console.error(err)
      }
    },
    // 初始化科室级联名称
    async initDeptCascaderOptions(deptType) {
      try {
        const res = await getOrgOrHosOptions({
          parentId: this.referralDetail.inHosId,
          deptType,
        })
        this.deptCascaderOptions = res.result
      } catch (err) {
        console.error(err)
      }
    },
    // 查询接诊医生
    async getDeptDoctorOptions(deptId) {
      console.log('deptId', deptId)
      try {
        const res = await getDeptDoctorOptions({
          deptId: deptId,
        })
        this.doctorList = res.result
      } catch (error) {
        console.error(error)
      }
    },
    handleDeptTypeChange() {
      this.auditDetail.auditDeptIds = []
      this.auditDetail.auditReceiveDrId = ''
      // this.initDeptCascaderOptions(this.auditDetail.auditDeptType)
      this.getOrgOrHosOptionsForApply(this.auditDetail.auditDeptType)
    },
    handleDeptChange() {
      this.auditDetail.auditReceiveDrId = ''
      if (this.auditDetail.auditDeptIds && this.auditDetail.auditDeptIds.length) {
        this.getDeptDoctorOptions(
          this.auditDetail.auditDeptIds[this.auditDetail.auditDeptIds.length - 1],
        )
      }
    },
    async getReferralHosOptions() {
      try {
        let deptObject = JSON.parse(sessionStorage.getItem('deptObject'))
        const res = await getReferralHosOptions({
          orgId: deptObject.orgId, //当前登录用户所在集团id
          hosId: this.referralDetail.outHosId, //当前登录用户所在医院id
        })
        this.orgOrHosOptions = res.result
      } catch (error) {
        console.error('error', error)
      }
    },
    transferInstitutionChange() {
      this.auditDetail.auditDeptType = ''
      this.auditDetail.auditDeptIds = []
      this.auditDetail.auditReceiveDrId = ''
    },
  },
  watch: {
    async isReady(newVal) {
      if (newVal) {
        console.log('this.referralDetail', this.referralDetail)
        this.auditDetail = {
          auditApplyDate: this.referralDetail.applyDate,
          auditDeptType: this.referralDetail.deptType === '/' ? '' : this.referralDetail.deptType,
          auditDeptIds: this.referralDetail.inDeptIds,
          auditReceiveDrId:
            this.referralDetail.receiveDrId === '/' ? '' : this.referralDetail.receiveDrId,
          auditRemark: '',
          auditId: this.referralDetail.auditId,
          ackInHosId: this.referralDetail.inHosId,
        }
        this.visible = true
      }
      await this.getReferralHosOptions()
      // await this.initDeptCascaderOptions(this.referralDetail.deptType)
      await this.getOrgOrHosOptionsForApply(this.referralDetail.deptType)
      await this.getDeptDoctorOptions(this.referralDetail.inDeptId)
    },
  },
}
</script>

<style lang="scss" scoped>
.PassReviewDia {
  .title1 {
    background-color: #f5f5f5;
    color: #101010;
    margin-bottom: 20px;
    padding: 5px;
  }
  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }
  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
}
</style>
