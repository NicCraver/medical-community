<template>
  <div>
    <el-select
      v-model="formItem.options.defaultValue"
      v-bind="formItem.options"
      style="width: 100% !important;"
    >
      <el-option
        v-for="(formItem, index) in formItem.options.options"
        :key="index"
        :label="formItem.label"
        :value="formItem.value"
      />
      <!-- <el-option key="其他" label="其他" value="其他" /> -->
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    formItem: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped></style>
