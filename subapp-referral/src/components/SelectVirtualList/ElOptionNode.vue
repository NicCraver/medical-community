<template>
  <el-option :key="index" :label="source[label]" :value="source[value]"></el-option>
</template>

<script>
export default {
  name: 'item-component',
  props: {
    index: {
      // 每一行的索引
      type: Number,
    },
    source: {
      // 每一行的内容
      type: Object,
      default() {
        return {}
      },
    },
    label: {
      // 要显示的名称
      type: String,
    },
    value: {
      // 绑定的值
      type: String,
    },
  },
}
</script>
