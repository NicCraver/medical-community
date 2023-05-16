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
      :model="timerNodeSetting"
      label-width="40px"
    >
      <el-row>
        <el-col>
          <el-form-item label="定时类型" prop="startType" label-width="90px">
            <el-radio-group v-model="timerNodeSetting.timerType">
              <el-radio label="delay">延时</el-radio>
              <el-radio label="fixed">定时</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-row :gutter="10" v-if="timerNodeSetting.timerType === 'delay'">
            <el-col :span="8">
              <el-form-item label="年: ">
                <el-input v-model="timerNodeSetting.delayYear" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="月: ">
                <el-input v-model="timerNodeSetting.delayMonth" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="日: ">
                <el-input v-model="timerNodeSetting.delayDay" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时: ">
                <el-input v-model="timerNodeSetting.delayHour" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分: ">
                <el-input v-model="timerNodeSetting.delayMinute" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-date-picker
            v-model="timerNodeSetting.fixedTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            v-else
            style="margin-left: 20px;"
          />
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
export default {
  data() {
    return {
      timerNodeSetting: {},
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
      }
    }
  },
  props: {
    visible: Boolean,
    nodeId: String
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    handleSubmit() {
      const result = this.timerNodeSetting.timerType === 'delay' ? {
        timerType: this.timerNodeSetting.timerType,
        delayYear: this.timerNodeSetting.delayYear,
        delayMonth: this.timerNodeSetting.delayMonth,
        delayDay: this.timerNodeSetting.delayDay,
        delayHour: this.timerNodeSetting.delayHour,
        delayMinute: this.timerNodeSetting.delayMinute,
      } : {
        timerType: this.timerNodeSetting.timerType,
        fixedTime: this.timerNodeSetting.fixedTime
      }
      window.sessionStorage.setItem(this.nodeId, JSON.stringify(result));
      this.$emit('update:visible', false);
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (window.sessionStorage.getItem(this.nodeId)) {
          this.timerNodeSetting = JSON.parse(window.sessionStorage.getItem(this.nodeId));
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