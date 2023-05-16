<template>
  <div>
    <ProDialog :visible.sync="flag" title="新增用户" :before-close="handleClose" :close-on-click-modal="false">
      <div>22222222</div>
      <template #footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm()"> 确 定 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProDialog } from '../../packages/index'
export default {
  components: {
    ProDialog,
  },
  data() {
    return {
      flag: true,
    }
  },
  methods: {
    submitForm() {
      this.handleClose()
    },
    handleClose() {
      // console.log('handleClose')
      this.flag = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
