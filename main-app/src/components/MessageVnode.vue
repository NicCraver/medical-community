<template>
  <div class="MessageVnode">
    <span v-if="!props.isLogin">
      <span v-if="props.messageType !== 'E1' || props.messageType !== 'E2'">
        <span>{{ props.doctor }}现有</span>
        <span class="pat">{{ '患者 ' + props.patName }}</span>
        <span>{{ message }}</span>
      </span>
      <span v-else>
        <span>您发起的</span>
        <span class="pat">{{ '患者 ' + props.patName }}</span>
        <span>{{ message }}</span>
      </span>
    </span>
    <span v-else>
      <span>{{ props.doctor }}医生您好，现有</span>
      <span class="pat">{{ props.tot }}条</span>
      <span>{{ message }}</span>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  isLogin: Boolean,
  patName: String,
  doctor: String,
  messageType: String,
  tot: Number,
})
const message = computed(() => {
  let temp = ''
  switch (props.messageType) {
    case 'A':
      temp = '转诊审批任务待处理。'
      break
    case 'B':
      temp = '接诊任务待处理。'
      break
    case 'C':
      temp = '转诊申请被退回。'
      break
    case 'D':
      temp = '转诊申请被通过'
      break
    case 'E1':
      temp = '下转申请超过3天未被接诊！'
      break
    case 'E2':
      temp = '下转申请超过3天未被审核！'
      break
    default:
      break
  }
  return temp
})
</script>

<style lang="less" scoped>
.MessageVnode {
  padding-top: 10px;
  // color: #85888e;
  // font-size: 12px;
  .pat {
    color: #4468bd;
  }
}
</style>
