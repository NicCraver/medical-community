<template>
  <div>
    <ProDrawer :visible.sync="detailsFlag" title="新增用户" :size="540" @close="onDetailsClose">
      <template #footer>
        <el-button @click="detailsFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()"> 确 定 </el-button>
      </template>
    </ProDrawer>
  </div>
</template>

<script>
import { ProDrawer } from '../../packages/index'
export default {
  components: {
    ProDrawer,
  },
  data() {
    return {
      detailsFlag: true,
    }
  },
  methods: {
    submitForm() {
      this.detailsFlag = false
    },
    onDetailsClose() {
      // console.log('onDetailsClose')
      this.detailsFlag = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
