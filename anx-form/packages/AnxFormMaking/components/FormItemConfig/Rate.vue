<template>
  <div>
    <el-form-item label="最大值">
      <el-input-number
        v-model="activeCom.options.max"
        :min="0"
        :max="10"
        size="small"
      />
    </el-form-item>
    <el-form-item label="允许半选">
      <el-switch v-model="activeCom.options['allow-half']" />
    </el-form-item>
    <el-form-item label="默认值">
      <el-rate
        v-model="activeCom.options.defaultValue"
        v-bind="activeCom.options"
        show-text
        :texts="[
          '极差（1分）',
          '失望（2分）',
          '一般（3分）',
          '满意（4分）',
          '很满意（5分）'
        ]"
      />
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'RateConfig',
  props: ['activeCom']
};
</script>
