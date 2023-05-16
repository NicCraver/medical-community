<template>
  <el-collapse v-model="activeCollapse">
    <el-collapse-item title="病情信息" name="1">
      <el-form
        label-width="80px"
        label-position="left"
        disabled
      >
        <!-- 初步诊断 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="诊断记录" prop="initDiagnosisModel">
              <el-radio-group v-model="illnessInfo.initDiagnosisModel" >
                <el-radio label="Y">有</el-radio>
                <el-radio label="N">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="illnessInfo.initDiagnosisModel === 'Y'">
          <el-table :data="illnessInfo.initDiagnosis" border>
            <el-table-column label="诊断编码-诊断名称" prop="text1" />
            <el-table-column label="诊断机构（选填）" prop="text3" />
            <el-table-column label="诊断日期（选填）" prop="text4" />
          </el-table>
        </div>

        <!-- 过敏史 -->
        <div style="display: flex;">
          <el-form-item label="过敏史" prop="allergyModel" style="width: 200px">
            <el-radio-group v-model="illnessInfo.allergyModel">
              <el-radio label="Y">有</el-radio>
              <el-radio label="N">无</el-radio>
            </el-radio-group>
          </el-form-item>
          <div style="flex: 1;margin-top: 5px;" v-show="illnessInfo.allergyModel === 'Y'">
            <el-input v-model="illnessInfo.allergy" placeholder="请输入内容，多条内容需以；隔开" />
          </div>
        </div>

        <!-- 既往史 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="既往史" prop="hisIllDiagnosisModel">
              <el-radio-group v-model="illnessInfo.hisIllDiagnosisModel">
                <el-radio label="Y">有</el-radio>
                <el-radio label="N">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="illnessInfo.hisIllDiagnosisModel === 'Y'">
          <el-table :data="illnessInfo.hisIllDiagnosis" border>
            <el-table-column label="诊断编码-诊断名称" prop="text1" />
            <el-table-column label="诊断机构（选填）" prop="text3" />
            <el-table-column label="诊断日期（选填）" prop="text4" />
          </el-table>
        </div>

        <!-- 检查结果 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="检查结果" prop="examineResultModel">
              <el-radio-group v-model="illnessInfo.examineResultModel">
                <el-radio label="Y">有</el-radio>
                <el-radio label="N">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="illnessInfo.examineResultModel === 'Y'">
          <el-table :data="illnessInfo.examineResult" border>
            <el-table-column label="检查/检验类别" prop="text1" />
            <el-table-column label="项目名称" prop="text2" />
            <el-table-column label="项目编码" prop="text3" />
            <el-table-column label="检查检验/结果" prop="text4" />
          </el-table>
        </div>

        <!-- 手术记录 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="手术" prop="operateRecordsModel">
              <el-radio-group v-model="illnessInfo.operateRecordsModel">
                <el-radio label="Y">有</el-radio>
                <el-radio label="N">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-show="illnessInfo.operateRecordsModel === 'Y'">
          <el-table :data="illnessInfo.operateRecords" border>
            <el-table-column label="手术编码-手术名称" prop="text1" />
            <el-table-column label="手术描述" prop="text3" />
            <el-table-column label="手术日期" prop="text4" />
          </el-table>
        </div>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  props: {
    illnessInfo: Object
  },
  data() {
    return {
      activeCollapse: ['1']
    }
  }
}
</script>
