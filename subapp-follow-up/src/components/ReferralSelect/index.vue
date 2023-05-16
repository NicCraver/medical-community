<template>
  <div class="select-container">
    <el-cascader
      v-if="type === 'DEPT_OUT' || type === 'DEPT_IN'"
      v-model="selfValue"
      :options="optionsData"
      :props="{ checkStrictly: true }"
      :placeholder="placeholder"
      clearable
      @change="(val) => $emit('change', val)"
      :disabled="isDisabled"
      :key="key"
    ></el-cascader>
    <el-select
      v-else
      v-model="selfValue"
      clearable
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="placeholder"
      :disabled="isDisabled"
      @change="(val) => $emit('change', val)"
    >
      <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in optionsData" />
    </el-select>
  </div>
</template>

<script>
import { getReferralListDataDownBox, getReviewDataDownBox, getAdmissionsDataDownBox, getPublicDataDownBox } from '@/api/modules/ReferralSelect'

export default {
  name: 'ReferralSelect',
  model: {
    prop: 'selectModel',
    event: 'change',
  },
  props: {
    module: String,
    type: String,
    placeholder: '',
    selectModel: String | Array,
    status: String,
    hosId: String,
    orgId: String,
    deptId: String,
    deptType: String,
    disabled: Boolean,
    setRECDefault: Boolean,
  },
  data() {
    return {
      selfValue: this.selectModel,
      optionsData: [],
      key: Date.now(),
    }
  },
  computed: {
    getDataDownBoxApi() {
      const apiMap = {
        referralList: getReferralListDataDownBox,
        referralReview: getReviewDataDownBox,
        admissionsList: getAdmissionsDataDownBox,
        publicModule: getPublicDataDownBox,
      }
      return apiMap[this.module]
    },
    isDisabled() {
      // return false
      let flag = false
      if (this.type === 'ORG' && !this.$IS_ROOT_ADMIN) {
        flag = true
      }
      if (this.$IS_ORI_ADMIN) {
        if (this.type === 'ORG_HOS') {
          flag = true
        }
        if (this.type === 'HOS_OUT' && this.module === 'referralList') {
          flag = true
        }
        if (this.type === 'HOS_IN' && this.module !== 'referralList') {
          flag = true
        }
        if (this.type === 'DEPT_IN' && this.module === 'admissionsList') {
          flag = true
        }
      }
      return flag || this.disabled
    },
  },
  mounted() {
    console.log('this.type===', this.type)
    if (this.type === 'ICD' || this.type === 'ORG' || this.type === 'USER') {
      this.getDataDownBox()
    }
  },
  methods: {
    async getDataDownBox() {
      try {
        this.key = Date.now()
        this.optionsData = []
        const res = await this.getDataDownBoxApi({
          type: this.type,
          status: this.status,
          hosId: this.hosId || '',
          orgId: this.orgId || '',
          deptId: this.deptId || '',
          deptType: this.deptType || '',
        })
        this.selfValue = ''
        this.$emit('change', this.selfValue)
        this.optionsData = res.result
        if (this.type === 'DEPT_OUT' || this.type === 'DEPT_IN') {
          this.filterDeptData(this.optionsData, true)
        }
        if (this.isDisabled && this.type !== 'DR') {
          this.selfValue = this.optionsData[0].value
          this.$emit('change', this.selfValue)
        }
        if (this.type === 'ICD') {
          console.log('诊断下拉===', res.result)
        } else if (this.type === 'ORG') {
          console.log('集团下拉===', res.result)
          if (!this.$IS_ORI_ADMIN) {
            this.$EVENT_BUS.$emit('referralSelectReady')
          }
        } else if (this.type === 'HOS_OUT') {
          console.log('转出机构下拉===', res.result)
          if (this.isDisabled) {
            this.$EVENT_BUS.$emit('referralSelectReady')
          }
        } else if (this.type === 'DEPT_OUT') {
          console.log('转出科室下拉===', res.result)
        } else if (this.type === 'DR') {
          console.log('转诊医生下拉===', res.result)
        } else if (this.type === 'DEPT_IN') {
          if (this.$IS_ORI_ADMIN && this.$route.name === 'AdmissionsList') {
            this.selfValue = JSON.parse(window.sessionStorage.getItem('deptObject')).deptIds
            this.$emit('change', this.selfValue)
          }
          console.log('转入科室下拉===', res.result)
        } else if (this.type === 'HOS_IN') {
          console.log('转入机构下拉===', res.result)
          if (this.isDisabled) {
            this.$EVENT_BUS.$emit('referralSelectReady')
          }
        } else if (this.type === 'USER') {
          console.log('审核人===', res.result)
        } else if (this.type === 'REC') {
          console.log('接诊医生===', res.result)
          if (this.$IS_ORI_ADMIN && this.$route.name === 'AdmissionsList') {
            console.log('this.selfValue111', this.selectModel)
            const isExit = this.optionsData.find((item) => item.value === window.sessionStorage.getItem('userId'))
            console.log('isExit', isExit)
            this.selfValue = isExit ? window.sessionStorage.getItem('userId') : ''
            console.log('this.selfValue', this.selfValue)
            this.$emit('change', this.selfValue)
          }
        }
      } catch (err) {
        console.error(err)
      }
    },
    filterDeptData(optionsData, isFirst) {
      optionsData.forEach((item) => {
        if (!isFirst && item.children) {
          item.disabled = true
        }
        if (item.children) {
          this.filterDeptData(item.children)
        }
      })
    },
  },
  watch: {
    selectModel(newVal) {
      this.selfValue = newVal
    },
    orgId(newVal) {
      // this.selfValue = '';
      // this.$emit('change', this.selfValue);
      if (newVal) {
        this.getDataDownBox()
      }
    },
    hosId(newVal) {
      // this.selfValue = '';
      // this.$emit('change', this.selfValue);
      if (newVal) {
        this.getDataDownBox()
      }
    },
    deptId(newVal) {
      // this.selfValue = '';
      // this.$emit('change', this.selfValue);
      if (newVal) {
        this.getDataDownBox()
      }
    },
    deptType(newVal) {
      // this.selfValue = '';
      // this.$emit('change', this.selfValue);
      if (newVal) {
        this.getDataDownBox()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.select-container {
  display: inline-block;
}
</style>
