<template>
  <ProDrawer
    :visible="visible"
    :wrapperClosable="false"
    title="配置"
    :size="700"
    @close="handleClose"
    show-close
    class="drawer"
    :modal-append-to-body="false"
  >
    <div class="title">西红柿区域双向转诊申请单V2.0</div>
    <div style="padding: 0 15px">
      <el-table :data="tableData" border>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="field" label="表单字段" />
        <el-table-column prop="dataType" label="数据类型" />
        <el-table-column prop="title" label="查看">
          <template slot-scope="{ row }">
            <el-checkbox v-model="row.isCanCheck" :disabled="mode === 'check'" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="编辑">
          <template slot-scope="{ row }">
            <el-checkbox v-model="row.isCanEdit" :disabled="mode === 'check'" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    
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
      tableData: [
        { title: '标题1', field: '展示字段名称', dataType: '自定' },
        { title: '标题1', field: '展示字段名称', dataType: '自定' },
        { title: '标题1', field: '展示字段名称', dataType: '自定' },
        { title: '标题1', field: '展示字段名称', dataType: '自定' },
      ]
    }
  },
  props: {
    visible: Boolean,
    mode: String
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    handleSubmit() {
      this.$emit('update:visible', false);
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
  .title {
    height: 40px;
    line-height: 40px;
    background-color: #F7F7F7;
    font-size: 16px;
    font-weight: bold;
    margin-top: 16px;
    margin-bottom: 8px;
    padding-left: 15px;
  }
}
</style>