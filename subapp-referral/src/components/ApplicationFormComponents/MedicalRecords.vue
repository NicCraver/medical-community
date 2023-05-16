<template>
  <div class="MedicalRecords">
    <MedicalRecordsForm
      class="main"
      ref="MedicalRecordsFormRef"
      :referralId="referralId"
      :patId="patId"
      @getDetailReady="(modeDate) => (modeDate1 = modeDate)"
    />
    <footer class="footer">
      <span style="flex: 1">上次更新时间：{{ modeDate1 }}</span>
      <el-button
        type="primary"
        @click="onSubmit"
        v-if="$route.query.status !== 'disabled' && $route.query.status !== 'examine' && $route.query.status !== 'submit'"
        >保存</el-button
      >
      <el-button @click="goBack">返回</el-button>
    </footer>
  </div>
</template>

<script>
import ProcessStep from '@/components/ProcessStep/index.vue'
import MedicalRecordsForm from './components/MedicalRecordsForm.vue'
import { onSaveIllnessState } from '@/api/modules/patientCenter'
export default {
  props: {
    referralId: String,
    patId: String,
  },
  components: { ProcessStep, MedicalRecordsForm },
  data() {
    return {
      modeDate1: '',
    }
  },
  methods: {
    async onSubmit() {
      try {
        const result = this.$refs.MedicalRecordsFormRef.submitForm()
        if (result) {
          const res = await onSaveIllnessState(result)
          console.log('onSaveIllnessState==', res)
          this.$message.success('保存成功')
        }
      } catch (err) {
        console.error(err)
      }
    },
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.MedicalRecords {
  display: flex;
  flex-direction: column;
  height: 100%;
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
    justify-content: right;
    background-color: #fff;
    border-top: 1px solid #f5f5f5;
    padding: 0 10px;
  }
}
</style>
