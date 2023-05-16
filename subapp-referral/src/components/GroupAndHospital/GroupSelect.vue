<template>
  <el-select
    placeholder="集团"
    v-model="selfValue"
    clearable
    :disabled="!$IS_ROOT_ADMIN"
  >
    <el-option
      :label="item.label"
      :value="item.value"
      :key="item.value"
      v-for="item in orgOptionsList"
    />
  </el-select>
</template>


<script>
import { getOrgOrHosOptions } from '@/api/modules/systemAdmin';

export default {
  model: {
    prop: 'selectModel',
    event: 'change'
  },
  props: {
    selectModel: String
  },
  data() {
    return {
      selfValue: this.selectModel,
      orgOptionsList: []
    }
  },
  mounted() {
    this.getOrgOrHosOptions();
  },
  methods: {
    /*
      获取集团或者医院下拉列表
      parentId为空时查询集团
      parentId为机构ID时查询机构下的医院
      传入deptType查询科室级联
    */
    async getOrgOrHosOptions(parentId, deptType) {
      try {
        const res = await getOrgOrHosOptions({
          parentId: ''
        });
        console.log('getOrgOrHosOptions===', res);
        this.orgOptionsList = res.result;
        console.log('集团下拉列表==', this.orgOptionsList);
        // 如果不是超级管理员，默认选中第一项也是仅有的一项，并且不可选择
        if(!this.$IS_ROOT_ADMIN) {
          this.selfValue = this.orgOptionsList[0].value;
        } else {
          this.$EVENT_BUS.$emit('selectOptionsReady')
        }
      } catch(err) {
        console.error(err);
      }
    }
  },
  watch: {
    selfValue(newVal) {
      this.$emit('change', newVal)
    }
  }
}
</script>
