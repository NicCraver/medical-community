<template>
  <ProDialog
    title="接诊"
    width="520px"
    :before-close="handleResetClose"
    :close-on-click-modal="false"
    top="12vh"
    v-bind="$attrs"
    :visible="visible"
    class="dia"
  >
    <div class="titler">患者：{{ referralDetail.name }} {{ referralDetail.sexDesc }} {{ referralDetail.refAge }}岁</div>
    <el-form
      ref="elForm"
      :model="admissionsDetail"
      :rules="rules"
      label-width="123px"
      label-position="right"
    >
      <el-form-item label="去向：" prop="targetSource">
        <el-select
          v-model="admissionsDetail.targetSource"
          placeholder="去向"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in deptTypeList"
            :label="item.LABLE"
            :value="item.VALUE"
            :key="item.VALUE"
          />
        </el-select>

      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="16">
          <el-form-item label="确认接诊时间：" prop="admApplyDate" style="display: inline-block;">
            <el-date-picker
              v-model="admissionsDetail.admApplyDate"
              type="date"
              placeholder="选择转诊日期"
              clearable
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width: 100%"
              :picker-options="pickerOptions"
              @change="handleDateChange"
            />
          </el-form-item>
        </el-col>      
        <el-col :span="8">
          <el-form-item label-width="0" prop="admApplyTime" style="display: inline-block;">
            <el-time-picker
              format='HH:mm'
              value-format="HH:mm"
              v-model="admissionsDetail.admApplyTime"
              placeholder="转诊时间"
              style="width: 100%"
              :picker-options="pickerOptions2"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col>
          <!-- disabled -->
          <el-form-item label="确认接诊机构：" prop="receptionInstitution">
            <el-select
              v-model="admissionsDetail.receptionInstitution"
              placeholder="用户所在机构"
              clearable
              @change="receptionChane"
              style="width: 100%"           
            >
              <el-option
                v-for="item in orgOrHosOptionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="确认转入科室：" prop="admDeptIds">
            <el-cascader
              v-model="admissionsDetail.admDeptIds"
              style="width: 100%"
              :options="deptCascaderOptions"
              placeholder="请选择科室"
              clearable
              @change="handleDeptChange"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="确认接诊医生：" prop="admReceiveDrId">
        <el-select
          v-model="admissionsDetail.admReceiveDrId"
          placeholder="请选择接诊医生"
          clearable
          style="width: 100%"
          disabled
        >
          <el-option
            v-for="item in doctorList"
            :key="item.VALUE"
            :label="item.LABEL"
            :value="item.VALUE"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注信息：">
        <el-input
          type="textarea"
          v-model="admissionsDetail.remarkDesc"
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
      <el-button type="primary" @click="submitForm()">确认</el-button>
    </template>
  </ProDialog>
</template>

<script>
import { ProList, ProDialog } from "anx-vue";
import { getDictionary, getOrgOrHosOptions } from '@/api/modules/systemAdmin';
import { getDeptDoctorOptions, getReferralHosOptions } from '@/api/modules/patientCenter';
import { goAdmissions } from '@/api/modules/admissions';
import dayjs from 'dayjs';

export default {
  components: { ProList, ProDialog },
  props: {
    isReady: Boolean,
    referralDetail: Object
  },
  data() {
    return {
      visible: false,
      deptTypeList: [],
      deptCascaderOptions: [],
      doctorList: [],
      rules: {
        targetSource: [{ required: true, message: "请选择去向", trigger: "blur" }],
        admApplyDate: [{ required: true, message: "请选择确认接诊日期", trigger: "blur" }],
        admApplyTime: [{ required: true, message: "请选择确认接诊时间", trigger: "blur" }],
        admDeptIds: [{ required: true, message: "请选择确认转入科室", trigger: "blur" }],
        admReceiveDrId: [{ required: true, message: "请选择接诊医生", trigger: "blur" }],
        receptionInstitution: [{ required: true, message: "请选择确认接诊机构", trigger: "blur" }]
      },
      admissionsDetail: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      pickerOptions2: {
        selectableRange: `${new Date()} - '23:59:59'`
      },
      orgOrHosOptionsList:[] //确认接诊机构
    };
  },
  mounted() {
    this.getDictionary();   
  },
  methods: {
    receptionChane(val){
      //console.log(val, this.orgOrHosOptionsList.length)
      if(this.orgOrHosOptionsList.length){     
        let paramsCut = this.orgOrHosOptionsList.filter(item => item.value == val);     
        this.admissionsDetail.ackAdmHosId = paramsCut[0].value;
        this.admissionsDetail.ackAdmHosName = paramsCut[0].label; 
      }
    },
    async getReferralHosOptions() {
      try {
        let deptObject = JSON.parse(sessionStorage.getItem('deptObject'))
        console.log(deptObject.orgId)
        console.log(this.referralDetail.outHosId)         
        const res = await getReferralHosOptions({
          orgId: deptObject.orgId, //当前登录用户所在集团id
          hosId: this.referralDetail.outHosId, //当前登录用户所在医院id
        })
        console.log('getReferralHosOptions==', res)  
        if(res.code == 0){
          this.orgOrHosOptionsList = res.result;
        }         
      } catch (error) {
        console.error('error', error)
      }
    },
    async getDictionary() {
      try {
        const res = await getDictionary({
          code: 'DEPT_CLASSIFY'
        });
        console.log('getDictionary==', res);
        this.deptTypeList = res.result.filter(item => item.LABLE === '门诊' || item.LABLE === '住院');
      } catch(err) {
        console.error(err);
      }
    },
    handleResetClose() {
      this.visible = false;
      this.$emit("update:isReady", false);
    },
    submitForm() {
      this.$refs.elForm.validate(async (valid) => {
        if(valid) {
          try {
            const params = {
              ...this.admissionsDetail,
              createUserId: window.sessionStorage.getItem('userId'),
              admDeptId: this.admissionsDetail.admDeptIds[this.admissionsDetail.admDeptIds.length - 1],
              createUserName: window.sessionStorage.getItem('headerLoginName'),
              id: this.$route.query.admissionsId,
              applyId: this.referralDetail.id,
              admApplyDate: `${this.admissionsDetail.admApplyDate} ${this.admissionsDetail.admApplyTime}`
            }
            delete params.admDeptIds;
            const targetSourceName = this.deptTypeList.find(item => item.VALUE === this.admissionsDetail.targetSource).LABLE;
            if (targetSourceName === '门诊') {
              this.$confirm('门诊去向的患者，确认接诊即为转诊完成。确认要接诊吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }).then(async () => {
                const res = await goAdmissions(params);
                console.log('goAdmissions==', res);
                this.$message.success('操作成功')
                this.$router.go(-1);
              })
            } else {
               const res = await goAdmissions(params);
              console.log('goAdmissions==', res);
              this.$message.success('操作成功')
              this.$router.go(-1);
            }

          } catch(err) {
            console.error(err);
          }
        }
      });
    },
    // 初始化科室级联名称
    async initDeptCascaderOptions(row) {
      try {
        const res = await getOrgOrHosOptions({
          parentId: this.referralDetail.inHosId,
          deptType: this.referralDetail.auditDeptType,
        })
        console.log('getOrgOrHosOptions', getOrgOrHosOptions)
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
          deptId: deptId
        })
        this.doctorList = res.result || [];
      } catch (error) {
        console.error(error)
      }
    },
    // 科室发生改变重新查询接诊医生
    handleDeptChange() {
      this.admissionsDetail.admReceiveDrId = '';
      this.doctorList = [];
      console.log('this.admissionsDetail.admDeptIds', this.admissionsDetail.admDeptIds)
      if (this.admissionsDetail.admDeptIds && this.admissionsDetail.admDeptIds.length) {
        this.getDeptDoctorOptions(this.admissionsDetail.admDeptIds[this.admissionsDetail.admDeptIds.length - 1]);
      }
    },
    handleDateChange() {
      this.admissionsDetail.admApplyTime = '';
      if (new Date(this.admissionsDetail.admApplyDate) > new Date()) {
        this.pickerOptions2 = {
          selectableRange: `00:00:00 - '23:59:59'`
        }
      } else {
        this.pickerOptions2 = {
          selectableRange: `${new Date()} - '23:59:59'`
        }
      }

    }
  },
  watch: {
    async isReady(newVal) {   
      if (newVal) {
        console.log('this.referralDetail==', this.referralDetail)
        await this.getReferralHosOptions();
        await this.initDeptCascaderOptions();
        await this.getDeptDoctorOptions(this.referralDetail.auditDeptId);
        this.admissionsDetail = {
          targetSource: this.referralDetail.auditDeptType === this.deptTypeList.find(item => item.LABLE === '住院').VALUE ? this.referralDetail.auditDeptType : this.deptTypeList.find(item => item.LABLE === '门诊').VALUE,
          admApplyDate: dayjs(new Date()).format('YYYY-MM-DD'),
          admApplyTime: dayjs(new Date()).format('HH:mm'),
          admDeptIds: this.referralDetail.auditDeptIds,
          admReceiveDrId: window.sessionStorage.getItem('userId'), //this.referralDetail.receiveDrId,
          remarkDesc: '',
          receptionInstitution: this.referralDetail.ackAdmHosId
        }
        this.visible = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.titler {
  background-color: #F5F5F5;
  color: #101010;
  margin-bottom: 20px;
  padding: 5px;
}
.dia {

  ::v-deep .el-dialog__headerbtn {    
      top: 10px !important;    
  }
  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }
  ::v-deep.ProDialog .title {
    padding-left: 15px !important;
  }
  ::v-deep.ProDialog .title:before {
    content: "";
    position: absolute;
    left: 0;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;

  }
}
</style>
