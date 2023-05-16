<template>
  <el-select placeholder="诊断" @change="updateUserInfo" v-model="selfValue" @blur="blurTest" clearable filterable popper-class="virtualSelect">
    <VirtualList
      ref="virtualListRef"
      style="max-height: 245px; overflow-y: auto; width: 400px"
      :data-key="'VALUE'"
      :data-sources="sources"
      :data-component="itemComponent"
      :keeps="20"
      :extra-props="{
        label: 'LABEL',
        value: 'VALUE',
      }"
    />
  </el-select>
</template>

<script>
import ElOptionNode from './ElOptionNode.vue'
import virtualList from 'vue-virtual-scroll-list'

export default {
  model: {
    prop: 'selectModel',
    event: 'update',
  },
  props: {
    sources: {
      type: Array,
    },
  },
  components: {
    VirtualList: virtualList,
  },
  data() {
    return {
      selfValue: this.selectModel,
      queryParams: {},
      itemComponent: ElOptionNode,
    }
  },
  watch: {
    selfValue(newVal) {
      console.log('newVal', newVal)
      this.selfValue = newVal
    },
  },
  methods: {
    updateUserInfo() {
      this.$emit('update', this.selfValue)
    },
    changeVal(val, lr) {
      this.$emit('modelVal', val) // 更新 model
      this.$emit('change', val, lr) // 事件传值
    },
    blurTest() {
      console.log('2222222222', 2222222222)
      // console.log('this.$refs.virtualListRef', this.$refs.virtualListRef.reset())
      this.$refs.virtualListRef.reset()
    },
  },
}
</script>

<style lang="scss" scoped></style>

<style>
.virtualSelect .el-scrollbar .el-scrollbar__bar.is-vertical {
  width: 0;
}
</style>
