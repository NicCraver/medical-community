<template>
  <el-select
    v-model="selfValue"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import http from '@/api'
const getActivityDictionary = (params) =>
  http.get({
    url: `/ygt-marketing/tbADictionary/getActivityDictionary`,
    params,
  })

export default {
  name: 'ActivityDictionary',
  mounted() {},
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: () => '',
    },
    clearable: {
      type: Boolean,
      default: () => true,
    },
    type: {
      type: String,
      default: () => '',
    },
    value: {
      type: String,
      default: () => '',
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
  methods: {
    async init() {
      try {
        const res = await getActivityDictionary({
          type: this.type,
        })
        this.options = res.result
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped></style>
