<template>
  <el-form label-width="85px" label-position="right" disabled>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-form-item label="转诊类型：">
          <el-input v-model="applyDetail.referralTypeDesc" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="申请转诊日期：" label-width="120px">
          <el-input v-model="applyDetail.applyDate" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="转诊医生：">
          <el-input v-model="applyDetail.applyDrName" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="转出机构：">
          <el-input v-model="applyDetail.outHosName" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="转出科室：">
          <el-input v-model="applyDetail.outDeptName" />
        </el-form-item>
      </el-col>
      <!-- <el-col>
        <el-form-item label="转诊目标：">
          <el-input
            v-model="applyDetail.referralGoal"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 999}"
          />
        </el-form-item>
      </el-col> -->
      <el-col>
        <el-form-item label="诊断：">
          <el-input
            v-model="applyDetail.diagnosis"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 999}"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="现病史：">
          <el-input
            v-model="applyDetail.hpi"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 999}"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="既往史：">
          <el-input
            v-model="applyDetail.pastHistory"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 999}"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="治疗经过：">
          <el-input
            v-model="applyDetail.treatment"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 999}"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="治疗方案：">
          <el-input
            v-model="applyDetail.curePlan"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 999}"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="注意事项：">
          <el-input
            v-model="applyDetail.notice"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 999}"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="转入机构：">
          <el-input v-model="applyDetail.inHosName" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="转入科室：">
          <el-input v-model="applyDetail.inDeptName" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="接诊医生：">
          <el-input v-model="applyDetail.receiveDrName" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    applyDetail: Object
  }
}
</script>
