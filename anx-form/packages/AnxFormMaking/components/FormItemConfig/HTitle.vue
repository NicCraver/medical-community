<template>
  <div>
    <el-form-item label="组件Id">
      <el-input v-model="activeCom.id" readonly></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <el-input v-model="activeCom.name"></el-input>
    </el-form-item>
    <el-form-item label="对齐方式">
      <el-radio-group v-model="activeCom.options.align">
        <el-radio label="left">左对齐</el-radio>
        <el-radio label="right">右对齐</el-radio>
        <el-radio label="center">居中对齐</el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'HTitleConfig',
  props: ['activeCom']
};
</script>
