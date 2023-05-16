<template>
  <el-select
    placeholder="机构名称"
    v-model="selfValue"
    clearable
    :disabled="!groupId || $IS_ORI_ADMIN || disabled"
  >
    <el-option
      :label="item.label"
      :value="item.value"
      :key="item.value"
      v-for="item in hosOptionsList"
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
    branchFlg: Boolean,
    selectModel: String,
    groupId: String,
    disabled: Boolean
  },
  data() {
    return {
      selfValue: this.selectModel,
      hosOptionsList: []
    }
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
          parentId: this.groupId,
          branchFlg: this.branchFlg ? 'Y' : 'N'
        });
        console.log('getOrgOrHosOptions1===', res);
        this.hosOptionsList = res.result;
        // 如果是机构级别的账号，机构默认选中当前机构，并且不可选
        if (this.$IS_ORI_ADMIN) {
          this.selfValue = this.hosOptionsList[0].value;
        }
        // 下拉里面没有对应值就清空，主要用于详情页面编辑第一次进去
        if (!this.hosOptionsList.find(item => item.value === this.selfValue)) {
          this.selfValue = '';
        }
        this.$EVENT_BUS.$emit('selectOptionsReady');
      } catch(err) {
        console.error(err);
      }
    },
  },
  watch: {
    groupId: {
      immediate: true,
      handler(newVal){
        if (newVal) {
          this.getOrgOrHosOptions();
        } else {
          this.selfValue = '';
        }
      }
    },
    selfValue(newVal) {
      this.$emit('change', newVal);
    },
    selectModel(newVal) {
      this.selfValue = newVal;
    }
  }
}
</script>
