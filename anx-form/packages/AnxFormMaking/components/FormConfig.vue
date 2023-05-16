<template>
  <el-form label-position="top">
    <el-form-item label="表单宽度" title="?">
      <div class="tips">
        <i class="el-icon-warning"></i>
        <span>单位为%或者px</span>
      </div>
      <el-input v-model="formConfig.width"></el-input>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="标签对齐方式">
      <el-radio-group v-model="formConfig.labelPosition" size="small">
        <el-radio-button label="left">左对齐</el-radio-button>
        <el-radio-button label="right">右对齐</el-radio-button>
        <el-radio-button label="top">顶端对齐</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="标签宽度">
      <el-input-number
        v-model="formConfig.labelWidth"
        :min="50"
        :max="200"
        size="small"
      />
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="组件尺寸">
      <el-radio-group v-model="formConfig.size" size="small">
        <el-radio-button label="medium">medium</el-radio-button>
        <el-radio-button label="small">small</el-radio-button>
        <el-radio-button label="mini">mini</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否展示保存按钮">
      <el-switch v-model="formConfig.showNativeSave"></el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FormConfig',
  inject: ['formConfig']
};
</script>

<style lang="scss" scoped>
::v-deep.el-form-item {
  margin-bottom: 10px;
  .el-form-item__label {
    padding-bottom: 0;
  }
  .tips {
    color: red;
    position: absolute;
    left: 65px;
    top: -40px;
    .el-icon-warning {
      margin-right: 3px;
    }
  }
}
</style>
