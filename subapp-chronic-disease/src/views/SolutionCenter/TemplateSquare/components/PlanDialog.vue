<!--
 * @Author: Nic
 * @Date: 2023-02-07 14:34:44
 * @LastEditTime: 2023-02-14 15:29:34
 * @LastEditors: Nic
 * @Description: PlanDialog
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/PlanDialog.vue
-->
<template>
  <!-- v-bind="$attrs"
    v-on="$listeners" -->
  <el-dialog
    :title="title"
    :visible.sync="planDialogVisible"
    width="500px"
    class="universal-dialog"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="handleClose"
  >
    <template #title>
      <div class="dialog-head">{{ title }}</div>
    </template>
    <div class="dialog-body">
      <!-- 分期表单 -->
      <el-form v-if="state === 'addInstallment' || state === 'copyInstallment'" :model="installmentForm" :rules="installmentRules" ref="installmentFormRef" label-width="100px">
        <el-form-item label="分期名称" prop="installmentName">
          <el-input v-model="installmentForm.installmentName" placeholder="请控制在20字以内"></el-input>
        </el-form-item>
        <el-form-item label="诊断条件" prop="diagnostiCondition">
          <el-checkbox-group v-model="installmentForm.diagnostiCondition">
            <el-checkbox v-for="v in diagnosticConditions" :key="v.value" :label="v.label" :value="v.value" name="type" :disabled="v.label=='评估问卷'||v.label=='用药记录'"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- 院内检验检查表单 -->
      <el-form v-if="state === 'inspectionCheck'" :model="inspectionCheckForm" :rules="inspectionRules" ref="inspectionCheckForm" label-width="120px">
        <el-form-item label="项目名称" prop="projectName">
          <el-cascader
            style="width: 100%"
            ref="refCascader"
            v-model="inspectionCheckForm.projectName"
            :options="diagnosticConditions"
            @change="handleInspectionCheckChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="选择诊断指标" prop="diagnosticIndex">
          <div v-if="diagnosticIndexList.length === 0">
            {{ loadingText }}
          </div>
          <el-checkbox-group v-model="inspectionCheckForm.diagnosticIndex">
            <el-checkbox v-for="v in diagnosticIndexList" :key="v.value" :label="v.label" :value="v.value"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- 添加病历信息表单 -->
      <el-form
        v-if="state === 'addMedicalRecord'"
        :model="medicalRecordForm"
        :rules="medicalRecordRules"
        ref="medicalRecordFormRef"
        label-width="120px"
        label-position="top"
        style="padding-left: 20px"
      >
        <el-form-item label="请选择要关联的病历信息" prop="medicalRecordChecked">
          <el-checkbox-group v-model="medicalRecordForm.medicalRecordChecked">
            <el-checkbox v-for="v in diagnosticConditions" :key="v.value" :label="v.label" :value="v.value"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm()">{{
        state === 'addMedicalRecord' || state === 'inspectionCheck' ? '确认添加' : '保存'
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getPageConfig } from '../../../../api/modules/SolutionCenter/index.js'
export default {
  name: 'RuleDialog',
  props: {
    diagnosticConditions: {
      type: Array,
    },
    planDialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    state: {
      type: String,
    },
    formData: {
      type: Object,
    },
    labelType: {
      type: String,
    },
    distinguishType: {
      type: String,
    },
    operatorOptions: {
      type: Object,
    },
    tagDiseaseDeptId:{
      type: String
    }
  },
  model: {
    prop: 'planDialogVisible',
    event: 'close',
  },
  data() {
    return {
      loadingText: '暂无数据',
      // 分期表单
      installmentForm: {
        installmentName: '',
        diagnostiCondition: [],
      },
      // 检验检查表单
      inspectionCheckForm: {
        projectName: [],
        diagnosticIndex: [],
      },
      // 诊断指标
      diagnosticIndexList: [],
      // 返回给检验检查选中的数据
      checkedNodes: [],
      // 病历信息
      medicalRecordForm: {
        medicalRecordChecked: [],
      },
      // 病历信息
      medicalRecordOptions: [],
      // 分期校验
      installmentRules: {
        installmentName: [
          { required: true, message: '请输入分期名称', trigger: 'blur' },
          { min: 1, max: 20, message: '请控制在20字符以内', trigger: 'blur' },
        ],
        diagnostiCondition: [{ type: 'array', required: true, message: '请选择诊断条件', trigger: 'change' }],
      },
      // 检验检查校验
      inspectionRules: {
        projectName: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        diagnosticIndex: [{ type: 'array', required: true, message: '选择诊断指标', trigger: 'change' }],
      },
      // 病历信息校验
      medicalRecordRules: {
        medicalRecordChecked: [{ type: 'array', required: true, message: '选择诊断指标', trigger: 'change' }],
      },
    }
  },
  mounted() {
    console.log(this.operatorOptions)
    console.log('-------------')
    console.log(`this.diagnosticConditions`, this.diagnosticConditions)
  },
  methods: {    
    // 返回弹窗数据
    returnData() {
      console.group('returnData')

      const map = {
        addInstallment: () => {        
          let indicatorList = []
          this.installmentForm.diagnostiCondition.forEach((el) => {
            this.diagnosticConditions.forEach((item) => {
              if (el === item.label) {
                indicatorList.push(item)
              }
            })
          })
          console.log(`indicatorList`, indicatorList)
          this.$emit('getPlanDialogData', {
            installmentName: this.installmentForm.installmentName,
            indicatorList,
            type: 'addInstallment',
          })
        },
        copyInstallment: () => {
          let indicatorList = []
          this.installmentForm.diagnostiCondition.forEach((el) => {
            this.diagnosticConditions.forEach((item) => {
              if (el === item.label) {
                indicatorList.push(item)
              }
            })
          })
          console.log(`indicatorList`, indicatorList)
          this.$emit('getPlanDialogData', {
            installmentName: this.installmentForm.installmentName,
            indicatorList,
            type: 'copyInstallment',
          })
        },
        // 病历
        addMedicalRecord: () => {
          let temp = []
          this.medicalRecordForm.medicalRecordChecked.forEach((el) => {
            this.diagnosticConditions.forEach((item, i) => {
              if (el === item.label && i === 0) {
                temp.push({
                  name: item.label,
                  controlType: item.controlType, // 控件类型:0-血压，血糖，1-现病史等
                  operatorId: item.operatorTypeId, //运算符 id
                  url: item.url,
                  param: item.param,
                  connectiveParam: '',
                })
              } else if (el === item.label) {
                temp.push({
                  requisiteFlg: 0, // 0:和  1:或
                  name: item.label,
                  controlType: item.controlType, // 控件类型:0-血压，血糖，1-现病史等
                  operatorId: item.operatorTypeId, //运算符 id
                  url: item.url,
                  param: item.param,
                  connectiveParam: '',
                })
              }
            })
          })
          // param
          // url
          console.log(`temp`, temp)
          this.$emit('getPlanDialogData', {
            indicatorItemList: temp,
            labelType: this.labelType,
            distinguishType: this.distinguishType,
            type: 'addMedicalRecord',
          })
        },
        // 检验检查
        inspectionCheck: async () => {
          console.log(`this.diagnosticIndexList`, this.diagnosticIndexList)
          console.log(`this.checkedNodes`, this.checkedNodes)
          let temp = []
          this.inspectionCheckForm.diagnosticIndex.forEach((el) => {
            this.diagnosticIndexList.forEach((item, i) => {
              if (el === item.label && i === 0) {
                temp.push({
                  name: item.label,
                  controlType: item.controlType, // 控件类型:0-血压，血糖，1-现病史等
                  decimalDigits: item.decimalDigits, // 小数位数：0-整数，1-一位小数，2-两位小数
                  unitId: item.units, //单位
                  operatorId: item.operatorTypeId, //运算符 id
                  value1: item.minValue,
                  value2: item.maxValue,
                  itemId: item.value,
                })
              } else if (el === item.label) {
                temp.push({
                  requisiteFlg: 0, // 0:和  1:或
                  name: item.label,
                  controlType: item.controlType, // 控件类型:0-血压，血糖，1-现病史等
                  decimalDigits: item.decimalDigits, // 小数位数：0-整数，1-一位小数，2-两位小数
                  unitId: item.units, //单位
                  operatorId: item.operatorTypeId, //运算符 id
                  value1: item.minValue,
                  value2: item.maxValue,
                  itemId: item.value,
                })
              }
            })
          })
          this.$emit('getPlanDialogData', {
            requisiteFlg: 0,
            name: this.checkedNodes[0].label,
            jmConDConDtoList: temp,
            labelType: this.labelType,
            distinguishType: this.distinguishType,
            type: 'inspectionCheck',
          })
        },
      }
      console.groupEnd()
      map[this.state]()
    },
    // 提交
    submitForm() {
      let formName = ''
      const map = {
        addInstallment: () => {
          formName = 'installmentFormRef'
        },
        copyInstallment: () => {
          formName = 'installmentFormRef'
        },      
        addMedicalRecord: async () => {
          formName = 'medicalRecordFormRef'
        },
        inspectionCheck: async () => {
          formName = 'inspectionCheckForm'
        },
      }
      map[this.state]()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.returnData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 检验检查级联下拉框 change
    async handleInspectionCheckChange() {  
      this.checkedNodes = this.$refs.refCascader.getCheckedNodes()
      this.loadingText = '加载中...'
      console.log(`this.inspectionCheckForm`, this.inspectionCheckForm)
      this.diagnosticIndexList = await this.getDiagnosticList(this.inspectionCheckForm.projectName[this.inspectionCheckForm.projectName.length - 1])
      this.loadingText = '暂无数据'
      console.log(`this.diagnosticIndexList`, this.diagnosticIndexList)
    },
    // 根据id 获取诊断条件 检验检查等弹窗数据
    async getDiagnosticList(id) {
      return new Promise((resolve) => {
        getPageConfig({ parentId: id,  diseaseId:this.tagDiseaseDeptId })
          .then((res) => {
            console.log('getPageConfig', res)
            resolve(res.result)
          })
          .catch((error) => {
            console.error(error)
          })
      })
    },
    handleClose() {
      this.$emit('close', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.universal-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
    border-top: none !important;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 10px 15px;
    color: rgba(48, 49, 51, 1);
    font-size: 16px;
    padding: 10px 15px 10px 25px !important;
  }
  ::v-deep .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    // padding: 10px 15px;
  }
  ::v-deep .el-dialog__body {
    padding: 20px 20px 20px 0px;
  }

  .dialog-head {
    position: relative;
    font-weight: 700;

    &::before {
      content: '';
      position: absolute;
      left: -15px;
      width: 3px;
      height: 19px;
      margin-top: 4px;
      background-color: #134796;
    }
  }
}
</style>
