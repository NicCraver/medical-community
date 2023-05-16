<!--
 * @Author: Nic
 * @Date: 2022-04-11 11:44:12
 * @LastEditTime: 2023-02-03 11:03:51
 * @LastEditors: Nic
 * @Description:
 * @FilePath: /anx-form/packages/AnxFormMaking/components/FormItemConfig/Textarea.vue
-->
<template>
  <div>
    <el-form-item label="占位内容">
      <el-input v-model="activeCom.options.placeholder"></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入内容"
        v-model="activeCom.options.defaultValue"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="是否显示字数统计">
      <el-switch
        v-model="activeCom.options.showWordLimit"
        active-color="#13ce66"
        inactive-color="#ff4949"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="minlength">
      <el-input placeholder="请输入内容" v-model="activeCom.options.minlength">
      </el-input>
    </el-form-item>
    <el-form-item label="最大输入值">
      <el-input placeholder="请输入内容" v-model="activeCom.options.maxlength">
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'TextareaConfig',
  props: ['activeCom']
};
</script>
