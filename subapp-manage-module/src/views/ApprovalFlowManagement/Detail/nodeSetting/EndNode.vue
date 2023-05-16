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
      :model="endNodeSetting"
      label-width="90px"
    >
      <el-row>
        <el-col>
          <el-form-item label="通知" prop="noticeType">
            <el-radio-group v-model="endNodeSetting.noticeType">
              <el-radio label="close">关闭</el-radio>
              <el-radio label="open">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-col :offset="2">
            <el-form-item
              label=""
              v-if="endNodeSetting.noticeType === 'open'"
              label-width="10px"
            >
              <el-select v-model="endNodeSetting.noticeUser" multiple>
                <el-option label="全部发起人" value="startUsers" />
                <el-option label="全部审核人" value="examineUsers" />
                <el-option label="全部处理人" value="dealUsers" />
                <el-option label="指定角色" value="targetRole" />
                <el-option label="指定用户" value="targetUser" />
              </el-select>
            </el-form-item>
          </el-col>
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
// import { getFormTemplateList } from '@/api/modules/systemAdmin';

export default {
  data() {
    return {
      endNodeSetting: {
        noticeType: 'close'
      },
      rules: {}
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
      window.sessionStorage.setItem(this.nodeId, JSON.stringify(this.endNodeSetting));
      this.$emit('update:visible', false);
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (window.sessionStorage.getItem(this.nodeId)) {
          this.endNodeSetting = JSON.parse(window.sessionStorage.getItem(this.nodeId));
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