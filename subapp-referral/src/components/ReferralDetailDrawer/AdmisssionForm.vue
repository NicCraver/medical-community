<template>
  <el-form label-width="110px" label-position="right" disabled>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-form-item label="去向：" label-width="60px">
          <el-input v-model="admissionsInfo.targetSourceName" />
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item label="确认接诊时间：" label-width="120px">
          <el-input v-model="admissionsInfo.admApplyDate" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="确认接诊医生：">
          <el-input v-model="admissionsInfo.admReceiveDrName" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="确认转入科室：">
          <el-input v-model="admissionsInfo.admDeptName" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="备注信息：">
          <el-input v-model="admissionsInfo.remarkDesc" type="textarea" :rows="3" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getAdmissionsInfoById } from '@/api/modules/admissions';

export default {
  props: {
    referralId: String
  },
  data() {
    return {
      admissionsInfo: {}
    }
  },
  mounted() {
    this.getAdmissionsInfoById();
  },
  methods: {
    async getAdmissionsInfoById() {
      try {
        const res = await getAdmissionsInfoById({
          applyId: this.referralId
        });
        console.log('getAdmissionsInfoById==', res);
        this.admissionsInfo = res.result;
        this.$emit('getAdmissionsInfoSuccess', res.result)
      } catch(err) {
        console.error(err);
      }
    }
  },
  watch: {
    referralId() {
      this.getAdmissionsInfoById();
    }
  }
}
</script>
