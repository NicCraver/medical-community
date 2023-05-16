<template>
  <el-dialog :visible="visible" :before-close="handleClose" title="修改记录">
    <el-table :data="oldTableList">
      <el-table-column
        v-for="item in tableColumnList"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      />
    </el-table>
  </el-dialog>
</template>


<script>
export default {
  props: {
    oldTableList: Array,
    visible: Boolean,
    handleClose: Function,
    tableType: String
  },
  computed: {
    tableColumnList() {
      let tableColumnList = [];
      if (this.tableType === '疾病记录') {
        tableColumnList = [
          { label: '疾病名称', prop: 'medName'},
          { label: '疾病描述', prop: 'medDesc'},
          { label: '确诊时间', prop: 'confirmTime'},
        ]
      } else if (this.tableType === '手术记录') {
        tableColumnList = [
          { label: '手术名称', prop: 'medName'},
          { label: '确诊时间', prop: 'confirmTime'},
        ]
      } else if (this.tableType === '外伤记录') {
        tableColumnList = [
          { label: '外伤名称', prop: 'medName'},
          { label: '受伤时间', prop: 'confirmTime'},
        ]
      } else if (this.tableType === '输血记录') {
        tableColumnList = [
          { label: '输血原因', prop: 'medName'},
          { label: '输血时间', prop: 'confirmTime'},
        ]
      }
      return tableColumnList
    }
  }
}
</script>
