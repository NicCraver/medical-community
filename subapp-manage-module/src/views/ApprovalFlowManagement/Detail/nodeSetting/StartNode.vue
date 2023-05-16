<!--
 * @Author: Nic
 * @Date: 2023-02-15 11:46:11
 * @LastEditTime: 2023-02-15 11:53:19
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-manage-module/src/views/ApprovalFlowManagement/Detail/nodeSetting/StartNode.vue
-->
<template>
  <ProDrawer
    :visible="visible"
    :wrapperClosable="false"
    title="配置"
    :size="700"
    @close="handleClose"
    show-close
    class="drawer"
  >
    <el-form
      ref="elForm"
      :rules="rules"
      :model="startNodeSetting"
      label-width="90px"
    >
      <el-row>
        <el-col>
          <el-form-item label="启动日期" prop="startType">
            <el-radio-group v-model="startNodeSetting.startType">
              <el-radio label="immediate">立即</el-radio>
              <el-radio label="plan">计划</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label=""
            prop="startTime"
            v-if="startNodeSetting.startType === 'plan'"
            label-width="10px"
          >
            <el-date-picker
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="startNodeSetting.startTime"
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="模板名称" required>
            <el-checkbox v-model="startNodeSetting.isPC">电脑端</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="templateType" label-width="10px">
            <el-select v-model="startNodeSetting.templateType" @change="getFormTemplateList">
              <el-option label="计划模板" value="FOLLOW" />
              <el-option label="评估模板" value="EVALUATION" />
              <el-option label="调研模板" value="RESEARCH" />
              <el-option label="不限" value="" />
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="templateId" label-width="10px">
            <el-select v-model="startNodeSetting.templateId">
              <el-option
                v-for="item in formTemplateList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button type="default" @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </ProDrawer>
</template>

<script>
import { ProDrawer } from 'anx-vue';
import { getFormTemplateList } from '@/api/modules/systemAdmin';

export default {
  data() {
    return {
      startNodeSetting: {},
      rules: {
        startType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        templateType: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        templateId: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
      },
      formTemplateList: []
    }
  },
  props: {
    visible: Boolean,
    nodeId: String
  },
  methods: {
    // 获取随访表单列表
    async getFormTemplateList() {
      this.$set(this.startNodeSetting, 'templateId', '');
      try {
        const res = await getFormTemplateList({ type: this.startNodeSetting.templateType || '' });
        this.formTemplateList = res.result;
      } catch (err) {
        console.error(err);
      }
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
    handleSubmit() {
      window.sessionStorage.setItem(this.nodeId, JSON.stringify(this.startNodeSetting));
      this.$emit('update:visible', false);
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (window.sessionStorage.getItem(this.nodeId)) {
          this.startNodeSetting = JSON.parse(window.sessionStorage.getItem(this.nodeId));
        }
      }
    }
  },
  components: {
    ProDrawer
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  ::v-deep .el-form-item {
    display: inline-block;
  }
}
</style>