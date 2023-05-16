<template>
  <el-select v-model="selfValue" clearable :placeholder="placeholder" :disabled="disabled">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import http from '@/api'
// 获取集团/医院下拉框(所有查询界面调用)
// GET
// parentId：集团id，选填(不填时查询集团，填写时查询医院)
// 返回值只有一个 lenght=1   自动选中  锁死
// 多个可选
const getOrgOrHosForQuery = (params) =>
  http.get({
    url: '/ygt-user/role3/getOrgOrHosForQuery',
    params,
  })

export default {
  name: 'OrgHosSelect',
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
    parentId: {
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
        const res = await getOrgOrHosForQuery({
          parentId: this.parentId,
        })
        this.options = res.result
        console.log(`集团机构----`, JSON.parse(JSON.stringify(res.result)))
        if (res.result.length === 1) {
          this.disabled = true
          this.selfValue = res.result[0].value
        }
      } catch (error) {}
    },
    getHosName() {
      let a = this.options.filter((_) => _.value === this.selfValue)
      return a[0].label
    },
    getHosLength() {
      return this.options.length
    },
  },
}
</script>

<style lang="scss" scoped></style>
