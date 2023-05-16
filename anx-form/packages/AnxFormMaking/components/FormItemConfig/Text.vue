<template>
  <el-form-item label="默认值">
    <el-input
      type="textarea"
      v-model="activeCom.options.defaultValue"
    ></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'TextConfig',
  props: ['activeCom']
};
</script>
