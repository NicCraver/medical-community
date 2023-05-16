<template>
  <div>
    <el-form-item label="身高Model">
      <el-input v-model="activeCom.heightModel"></el-input>
    </el-form-item>
    <el-form-item label="身高默认值">
      <el-input v-model="activeCom.heightValue"></el-input>
    </el-form-item>
    <el-form-item label="体重Model">
      <el-input v-model="activeCom.weightModel"></el-input>
    </el-form-item>
    <el-form-item label="体重默认值">
      <el-input v-model="activeCom.weightValue"></el-input>
    </el-form-item>
    <el-form-item label="BMIModel">
      <el-input v-model="activeCom.BMIModel"></el-input>
    </el-form-item>
    <el-form-item label="BMI默认值">
      <el-input v-model="activeCom.BMIValue"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'BMIConfig',
  props: ['activeCom']
};
</script>
