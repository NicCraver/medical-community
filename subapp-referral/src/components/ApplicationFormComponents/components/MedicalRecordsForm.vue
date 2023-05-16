<template>
  <div class="MedicalRecordsForm" v-loading="loading">
    <header class="header">病情记录</header>
    <IllnessInfoPatientCard :patientInfo="illnessAllInfo"></IllnessInfoPatientCard>
    <main class="main">
      <section class="main-from">
        <el-collapse v-model="active1">
          <el-collapse-item title="患者信息：" name="patientInfo">
            <el-form label-width="100px" disabled>
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="姓名：" prop="patName">
                    <el-input v-model="illnessAllInfo.patName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="民族：" prop="nation">
                    <el-input v-model="illnessAllInfo.nation" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别：" prop="sex">
                    <el-select v-model="illnessAllInfo.sex" placeholder="请选择">
                      <el-option v-for="item in sexList" :key="item.LABLE" :label="item.LABLE" :value="item.VALUE" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出生日期：" prop="birthday">
                    <el-input v-model="illnessAllInfo.birthday" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="年龄：" prop="age">
                    <el-input v-model="illnessAllInfo.refAge" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系电话：" prop="phoneNo">
                    <el-input v-model="illnessAllInfo.phoneNo" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="居住地址：" prop="address">
                    <el-cascader v-model="illnessAllInfo.address" :options="areaList" :props="{ value: 'value' }" ref="cascader" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="详细地址：" prop="address1">
                    <el-input v-model="illnessAllInfo.address1" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="病情信息" name="illnessInfo">
            <el-form
              label-width="80px"
              label-position="left"
              :model="illnessModel"
              :rules="illnessRules"
              ref="ruleForm"
              :disabled="isIllnessDisabled"
            >
              <!-- 初步诊断 -->
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="初步诊断" prop="initDiagnosisModel">
                    <el-radio-group v-model="illnessInfo.initDiagnosisModel" @change="illnessRadioChange('initDiagnosis', '1')">
                      <el-radio label="Y">有</el-radio>
                      <el-radio label="N" :disabled="!!(illnessInfo.initDiagnosis.length - 1)">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-show="illnessInfo.initDiagnosisModel === 'Y'">
                <div class="tab-title">诊断记录</div>
                <el-table
                  :data="illnessInfo.initDiagnosis"
                  :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'initDiagnosis')"
                  border
                  :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'initDiagnosis')"
                >
                  <el-table-column label="诊断编码>诊断名称" width="420px">
                    <template slot-scope="{ row, $index }">
                      <el-button v-if="$index === illnessInfo.initDiagnosis.length - 1" type="text" @click="addTableRow('initDiagnosis', '1')"
                        >添加一行</el-button
                      >
                      <el-select v-model="row.text1" filterable remote v-else :remote-method="(value) => getIcdDic(value, 'A')" clearable>
                        <el-option :label="item.label" :value="item.label" :key="item.label" v-for="item in diagnoisList" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="诊断机构（选填）">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.text3" />
                    </template>
                  </el-table-column>
                  <el-table-column label="诊断日期（选填）">
                    <template slot-scope="{ row }">
                      <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="row.text4" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="{ $index }">
                      <IconSvg v-if="isIllnessDisabled" iconClass="delete-disabled" />
                      <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'initDiagnosis')" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 过敏史 -->
              <div style="display: flex">
                <el-form-item label="过敏史" prop="allergyModel" style="width: 200px">
                  <el-radio-group v-model="illnessInfo.allergyModel" @change="$set(illnessAllInfo, 'allergy', '')">
                    <el-radio label="Y">有</el-radio>
                    <el-radio label="N">无</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div style="flex: 1; margin-top: 5px" v-show="illnessInfo.allergyModel === 'Y'">
                  <el-input v-model="illnessAllInfo.allergy" placeholder="请输入内容，多条内容需以；隔开" />
                </div>
              </div>

              <!-- 既往史 -->
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="既往史" prop="hisIllDiagnosisModel">
                    <el-radio-group v-model="illnessInfo.hisIllDiagnosisModel" @change="illnessRadioChange('hisIllDiagnosis', '1')">
                      <el-radio label="Y">有</el-radio>
                      <el-radio label="N" :disabled="!!(illnessInfo.hisIllDiagnosis.length - 1)">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-show="illnessInfo.hisIllDiagnosisModel === 'Y'">
                <div class="tab-title">诊断记录</div>
                <el-table
                  :data="illnessInfo.hisIllDiagnosis"
                  :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'hisIllDiagnosis')"
                  border
                  :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'hisIllDiagnosis')"
                >
                  <el-table-column label="诊断编码>诊断名称" width="420px">
                    <template slot-scope="{ row, $index }">
                      <el-button v-if="$index === illnessInfo.hisIllDiagnosis.length - 1" type="text" @click="addTableRow('hisIllDiagnosis', '1')"
                        >添加一行</el-button
                      >
                      <el-select v-model="row.text1" filterable remote v-else :remote-method="(value) => getIcdDic(value, 'A')" clearable>
                        <el-option :label="item.label" :value="item.label" :key="item.label" v-for="item in diagnoisList" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="诊断机构（选填）">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.text3" />
                    </template>
                  </el-table-column>
                  <el-table-column label="诊断日期（选填）">
                    <template slot-scope="{ row }">
                      <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="row.text4" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="{ $index }">
                      <IconSvg v-if="isIllnessDisabled" iconClass="delete-disabled" />
                      <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'hisIllDiagnosis')" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 检查结果 -->
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="检查结果" prop="examineResultModel">
                    <el-radio-group v-model="illnessInfo.examineResultModel" @change="illnessRadioChange('examineResult', '1')">
                      <el-radio label="Y">有</el-radio>
                      <el-radio label="N" :disabled="!!(illnessInfo.examineResult.length - 1)">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-show="illnessInfo.examineResultModel === 'Y'">
                <div class="tab-title">检查/检验记录</div>
                <el-table
                  :data="illnessInfo.examineResult"
                  :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'examineResult')"
                  border
                  :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'examineResult')"
                >
                  <el-table-column label="检查/检验类别">
                    <template slot-scope="{ row, $index }">
                      <el-button v-if="$index === illnessInfo.examineResult.length - 1" type="text" @click="addTableRow('examineResult', '1')"
                        >添加一行</el-button
                      >
                      <el-select v-model="row.text1" v-else>
                        <el-option label="检验" value="检验" />
                        <el-option label="检查" value="检查" />
                      </el-select>
                      <el-input v-else v-model="row.text1"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="项目名称">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.text2" />
                    </template>
                  </el-table-column>
                  <el-table-column label="项目编码">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.text3" />
                    </template>
                  </el-table-column>
                  <el-table-column label="检查检验/结果">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.text4" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="{ $index }">
                      <IconSvg v-if="isIllnessDisabled" iconClass="delete-disabled" />
                      <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'examineResult')" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 手术记录 -->
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-form-item label="手术" prop="operateRecordsModel">
                    <el-radio-group v-model="illnessInfo.operateRecordsModel" @change="illnessRadioChange('operateRecords', '1')">
                      <el-radio label="Y">有</el-radio>
                      <el-radio label="N" :disabled="!!(illnessInfo.operateRecords.length - 1)">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-show="illnessInfo.operateRecordsModel === 'Y'">
                <div class="tab-title">手术记录</div>
                <el-table
                  :data="illnessInfo.operateRecords"
                  :span-method="({ rowIndex }) => arraySpanMethod(rowIndex, 'operateRecords')"
                  border
                  :cell-style="({ rowIndex }) => handleCellStyle(rowIndex, 'operateRecords')"
                >
                  <el-table-column label="手术编码-手术名称" width="420px">
                    <template slot-scope="{ row, $index }">
                      <el-button v-if="$index === illnessInfo.operateRecords.length - 1" type="text" @click="addTableRow('operateRecords', '1')"
                        >添加一行</el-button
                      >
                      <el-select v-model="row.text1" filterable remote v-else :remote-method="(value) => getIcdDic(value, 'B')" clearable>
                        <el-option :label="item.label" :value="item.label" :key="item.label" v-for="item in operateList" />
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="手术描述">
                    <template slot-scope="{ row }">
                      <el-input v-model="row.text3" />
                    </template>
                  </el-table-column>
                  <el-table-column label="手术日期">
                    <template slot-scope="{ row }">
                      <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="row.text4" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="{ $index }">
                      <IconSvg v-if="isIllnessDisabled" iconClass="delete-disabled" />
                      <IconSvg v-else iconClass="delete" @click.native="deleteTableRow($index, 'operateRecords')" />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </section>
    </main>
  </div>
</template>

<script>
import IllnessInfoPatientCard from '@/components/IllnessInfoPatientCard'
import { onSaveIllnessState, getIllnessState, getDictionary, getRegions, getIcdDic } from '@/api/modules/patientCenter'

export default {
  props: {
    referralId: String,
    patId: String,
  },
  computed: {
    isIllnessDisabled() {
      return this.$route.name === 'AdmissionsListDetail' || this.$route.query.status === 'examine' || this.$route.query.status === 'disabled'
    },
  },
  data() {
    return {
      loading: true,
      illnessAllInfo: {},
      active1: ['patientInfo', 'illnessInfo'],
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        patName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
        type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
        resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      sexList: [],
      areaList: [],
      illnessModel: {},
      illnessRules: {},
      illnessInfo: {
        initDiagnosisModel: '',
        initDiagnosis: [],
        allergyModel: '',
        hisIllDiagnosisModel: '',
        hisIllDiagnosis: [],
        examineResultModel: '',
        examineResult: [],
        operateRecordsModel: '',
        operateRecords: [],
      },
      diagnoisList: [],
      operateList: [],
    }
  },
  async mounted() {
    console.log('referralId', this.referralId)
    this.ruleForm.date = new Date()
    await this.getRegions()
    await this.getSexList()
    await this.getIllnessState()
    this.illnessInfo.initDiagnosis.push({})
    this.illnessInfo.hisIllDiagnosis.push({})
    this.illnessInfo.examineResult.push({})
    this.illnessInfo.operateRecords.push({})
  },
  methods: {
    async getIcdDic(value, type) {
      try {
        const res = await getIcdDic({
          value,
          type,
        })
        console.log('getIcdDic==', res)
        if (type === 'A') {
          this.diagnoisList = res.result.map((item) => ({
            label: `${item.value}>${item.label}`,
          }))
        } else if (type === 'B') {
          this.operateList = res.result.map((item) => ({
            label: `${item.value}>${item.label}`,
          }))
        }
      } catch (err) {
        console.error(err)
      }
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
    async getIllnessState() {
      try {
        this.loading = true
        const res = await getIllnessState({
          referralId: this.referralId,
        })
        console.log('getIllnessState==', res)
        this.illnessAllInfo = res.result
        this.illnessInfo.initDiagnosis = res.result.diagnose.map((item) => ({
          ...item,
          text1: `${item.text1}>${item.text2}`,
        }))
        this.illnessInfo.initDiagnosisModel = res.result.diagnose.length ? 'Y' : 'N'

        this.illnessInfo.allergyModel = res.result.allergy ? 'Y' : 'N'

        this.illnessInfo.hisIllDiagnosis = res.result.pastHistory.map((item) => ({
          ...item,
          text1: `${item.text1}>${item.text2}`,
        }))
        this.illnessInfo.hisIllDiagnosisModel = res.result.pastHistory.length ? 'Y' : 'N'

        this.illnessInfo.examineResult = res.result.check
        this.illnessInfo.examineResultModel = res.result.check.length ? 'Y' : 'N'

        this.illnessInfo.operateRecords = res.result.operation.map((item) => ({
          ...item,
          text1: `${item.text1}>${item.text2}`,
        }))
        this.illnessInfo.operateRecordsModel = res.result.operation.length ? 'Y' : 'N'

        this.$emit('getDetailReady', res.result.modDate)
        this.loading = false
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    },
    submitForm() {
      let result = {}
      const initDiagnosisCheckResult = this.checkRequired('initDiagnosis', '请完善初步诊断诊断记录')
      const hisIllDiagnosisCheckResult = this.checkRequired('hisIllDiagnosis', '请完善既往史诊断记录')
      const examineResultCheckResult = this.checkRequired('examineResult', '请完善检验检查记录', ['text1', 'text2', 'text4'])
      const operateRecordsCheckResult = this.checkRequired('operateRecords', '请完善手术记录')
      if (this.illnessInfo.allergyModel === 'Y' && (!this.illnessAllInfo.allergy || !this.illnessAllInfo.allergy.trim())) {
        this.$message.error('请填写过敏史')
        return
      }
      if (!initDiagnosisCheckResult || !hisIllDiagnosisCheckResult || !examineResultCheckResult || !operateRecordsCheckResult) {
        return
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          console.log(11111)
          const { initDiagnosis, hisIllDiagnosis, examineResult, operateRecords } = this.illnessInfo
          result = {
            patId: this.patId,
            referralId: this.referralId,
            diagnose: initDiagnosis.slice(0, initDiagnosis.length - 1).map((item) => ({
              ...item,
              text1: item.text1.split('>')[0],
              text2: item.text1.split('>')[1],
            })),
            allergy: this.illnessAllInfo.allergy,
            allergyId: this.illnessAllInfo.allergyId,
            pastHistory: hisIllDiagnosis.slice(0, hisIllDiagnosis.length - 1).map((item) => ({
              ...item,
              text1: item.text1.split('>')[0],
              text2: item.text1.split('>')[1],
            })),
            check: examineResult.slice(0, examineResult.length - 1),
            operation: operateRecords.slice(0, operateRecords.length - 1).map((item) => ({
              ...item,
              text1: item.text1.split('>')[0],
              text2: item.text1.split('>')[1],
            })),
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      const { diagnose, pastHistory, check, operation } = result
      const diagnoseResRepeat = this.validateTableHasRepeat(diagnose, '初步诊断存在相同数据，请检查后重新提交')
      const pastHistoryResRepeat = this.validateTableHasRepeat(pastHistory, '既往史存在相同数据，请检查后重新提交')
      const checkResRepeat = this.validateTableHasRepeat(check, '检查结果存在相同数据，请检查后重新提交')
      const operationResRepeat = this.validateTableHasRepeat(operation, '手术存在相同数据，请检查后重新提交')
      if (diagnoseResRepeat || pastHistoryResRepeat || checkResRepeat || operationResRepeat) {
        return
      }
      return result
    },
    checkRequired(type, msg, fields) {
      fields = fields || ['text1']
      if (this.illnessInfo[`${type}Model`] === 'Y') {
        const length = this.illnessInfo[type].length
        let flag = true
        for (let i = 0; i < length - 1; i++) {
          for (let j = 0; j < fields.length; j++) {
            flag = flag && !!this.illnessInfo[type][i][fields[j]]
          }
          if (!flag) {
            this.$message.error(msg)
            return false
          }
        }
      }
      return true
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    illnessRadioChange(type) {
      if (this.illnessInfo[`${type}Model`] === 'Y') {
        this.addTableRow(type, 1)
      }
    },
    addTableRow(type, medType, rowCount) {
      rowCount = rowCount || 1
      for (let i = 0; i < rowCount; i++) {
        this.illnessInfo[type].splice(-1, 0, {
          text1: '',
          text2: '',
          text3: '',
          text4: '',
          id: '',
        })
      }
    },
    deleteTableRow($index, type) {
      this.illnessInfo[type].splice($index, 1)
    },
    arraySpanMethod(rowIndex, type) {
      if (rowIndex === this.illnessInfo[type].length - 1) {
        return [1, 5]
      }
    },
    handleCellStyle(rowIndex, type) {
      if (rowIndex === this.illnessInfo[type].length - 1) {
        return {
          textAlign: 'center',
        }
      }
    },
    validateTableHasRepeat(tableData, message) {
      let resIndex = -1
      for (let i = 0; i < tableData.length; i++) {
        const currentData = tableData[i]
        if (i < tableData.length - 1) {
          resIndex = tableData.slice(i + 1, tableData.length).findIndex((item) => {
            return (
              item.text1 === currentData.text1 &&
              item.text2 === currentData.text2 &&
              item.text3 === currentData.text3 &&
              item.text4 === currentData.text4
            )
          })
        }
        if (resIndex !== -1) {
          this.$message.warning(message)
          return true
        }
      }
      return false
    },
  },
  components: {
    IllnessInfoPatientCard,
  },
}
</script>

<style lang="scss" scoped>
.MedicalRecordsForm {
  display: flex;
  flex-direction: column;
  padding: 10px;
  // height: 100%;
  .header {
    color: rgba(16, 16, 16, 100);
    font-size: 16px;
    text-align: center;
    margin-bottom: 10px;
  }

  .main {
    overflow-y: auto;
    flex: 1;
  }
  .main-from {
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
    ::v-deep.el-collapse {
      border-top: none;
      border-bottom: none;
    }
    ::v-deep.el-collapse-item__wrap {
      will-change: height;
      background-color: #fff;
      overflow: hidden;
      box-sizing: border-box;
      border-bottom: none;
    }
    ::v-deep.el-collapse-item__header {
      display: flex;
      align-items: center;
      height: 40px;
      line-height: 40px;
      background-color: #f5f4f5;
      color: #303133;
      cursor: pointer;
      border-bottom: 0;
      font-size: 13px;
      font-weight: 500;
      transition: none;
      outline: 0;
      border: none;
      padding-left: 10px;
    }
    ::v-deep.el-icon-arrow-right:before {
      content: '\e6e0';
      font-size: 16px;
      color: #919191;
    }
    ::v-deep.el-collapse-item__content {
      padding-top: 20px;
      padding-bottom: 0;
    }
    ::v-deep.el-cascader {
      width: 100%;
    }
  }
}
</style>
