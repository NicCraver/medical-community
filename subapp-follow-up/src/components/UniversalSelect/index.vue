<template>
  <el-select
    v-model="selfValue"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import http from '@/api'
const getUniversalSelectData = (url, params) =>
  http.get({
    // url: `/ygt-marketing/tbADictionary/getActivityDictionary`,
    url,
    params,
  })

export default {
  name: 'UniversalSelect',
  mounted() {},
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    params: {
      type: Object,
      default: () => {},
    },
    placeholder: {
      type: String,
      default: () => '',
    },
    clearable: {
      type: Boolean,
      default: () => true,
    },
    url: {
      type: String,
      default: () => '',
    },
    value: {
      type: String,
      default: () => '',
    },
    trigger: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      disabled: false,
      selfValue: this.value,
      options: [],
    }
  },
  watch: {
    value: {
      // immediate: true,
      handler(n, o) {
        if (n !== o) {
          this.selfValue = n
        }
      },
    },
    selfValue(val) {
      this.$emit('change', val)
    },
  },
  created() {
    if (this.trigger) {
      this.init()
    }
  },
  methods: {
    async init() {
      try {
        const res = await getUniversalSelectData(this.url, this.params)
        this.options = res.result
        console.log(`this.options`, this.options)
      } catch (error) {}
    },
    getHosName() {
      let a = this.options.filter((_) => _.value === this.selfValue)
      return a[0].label
    },
  },
}
</script>

<style lang="scss" scoped></style>
