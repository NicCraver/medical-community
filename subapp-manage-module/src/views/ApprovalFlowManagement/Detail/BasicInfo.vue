<template>
  <div class="basic-info">
    <el-form label-width="70px" class="el-form">
      <el-form-item label="流程名称">
        <el-input placeholder="流程名称" v-model="basicInfo.name" />
      </el-form-item>
      <el-form-item label="所属应用">
        <el-select placeholder="所属应用" v-model="basicInfo.app" style="width: 100%;">
          <el-option label="双向转诊" value="1" />
          <el-option label="MDT" value="2" />
        </el-select>
      </el-form-item>
      <div>
        <el-form-item label="模板名称" style="display: inline-block;">
          <el-select v-model="basicInfo.templateType" @change="getFormTemplateList" style="width: 160px;">
            <el-option label="计划模板" value="FOLLOW" />
            <el-option label="评估模板" value="EVALUATION" />
            <el-option label="调研模板" value="RESEARCH" />
            <el-option label="不限" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="" label-width="0" style="display: inline-block;">
          <el-select v-model="basicInfo.templateId" style="width: 240px; margin-left: 10px;">
            <el-option
              v-for="item in formTemplateList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="3" placeholder="请输入描述" v-model="basicInfo.desc" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFormTemplateList } from '@/api/modules/systemAdmin';
export default {
  data() {
    return {
      basicInfo: {},
      formTemplateList: []
    }
  },
  methods: {
    // 获取随访表单列表
    async getFormTemplateList() {
      this.$set(this.basicInfo, 'templateId', '');
      try {
        const res = await getFormTemplateList({ type: this.basicInfo.templateType || '' });
        this.formTemplateList = res.result;
      } catch (err) {
        console.error(err);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
  .basic-info {
    .el-form {
      width: 480px;
      margin: 20px auto;
    }
  }
</style>

