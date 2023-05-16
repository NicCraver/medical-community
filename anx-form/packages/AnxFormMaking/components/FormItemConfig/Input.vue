<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="activeCom.options.placeholder"></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input v-model="activeCom.options.defaultValue" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'InputConfig',
  props: ['activeCom']
};
</script>
