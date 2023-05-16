<template>
  <div>
    <el-cascader v-if="isShowInfo" ref="cascader" v-model="data_value" :props="props" @change="change" style="width: 100%"></el-cascader>
  </div>
</template>

<script>
import http from '@/api'
// areaCode 区域编码(选填)
const getSysAreas = (params) =>
  http.get({
    url: '/ygt-user/tbSysArea/getSysAreas',
    params,
  })
let id = 0
export default {
  name: 'com-select',
  props: {
    size: {
      type: String,
      default: 'mini',
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'name',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    value: null,
  },
  data() {
    let that = this
    return {
      resetCascaderPlus: 0,
      isShowInfo: true,
      options1: [],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          const nodes = []
          let areaCode = level == 0 ? '' : node.value
          getSysAreas({ areaCode })
            .then((res) => {
              // 节点数组
              res.result.forEach((item) => {
                let obj = {
                  value: item.value,
                  label: item.label,
                  leaf: node.level >= 2,
                }
                nodes.push(obj)
                that.$nextTick(() => {
                  const $el = document.querySelectorAll('.el-cascader-panel .el-cascader-node[aria-owns]')
                  Array.from($el).map((item) => item.removeAttribute('aria-owns'))
                })
              })
              // resolve 节点返回
              resolve(nodes)
            })
            .catch((error) => {
              console.log(error)
            })
        },
      },
      data_value: null,
    }
  },
  watch: {
    value: {
      handler(val) {
        this.data_value = val
        if (this.resetCascaderPlus === 0) {
          this.isShowInfo = false
          setTimeout(() => {
            this.isShowInfo = true
          }, 0)
        }
        this.resetCascaderPlus++
      },
    },
  },
  methods: {
    change(val) {
      this.$emit('input', val)
    },
    // 地址中文拼接
    getCheckedNodes() {
      return this.$refs.cascader.getCheckedNodes()[0] ? this.$refs.cascader.getCheckedNodes()[0].pathLabels.join('') : ''
    },
  },
}
</script>

<style lang="scss" scoped></style>
