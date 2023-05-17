<!--
  @description 区域质控-机构质控数据统计-放大弹窗
  @date 2022/07/21
-->
<template>
  <el-dialog width="60%" :visible.sync="isVisible" :before-close="close">
    <div slot="title" class="head">机构质控数据统计</div>
    <el-table height="500" :data="tableData" :cell-style="cellStyle" border stripe>
      <el-table-column label="排名" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="医疗机构" prop="orgName" min-width="150"></el-table-column>
      <el-table-column label="机构得分" prop="sumScore"></el-table-column>
      <el-table-column label="一致性得分" prop="consistencyScore">
        <template slot-scope="{row}">{{row.consistencyScore ==null? '--':row.consistencyScore}} </template>
      </el-table-column>
      <el-table-column label="整合性得分" prop="integrationScore">
        <template slot-scope="{row}">{{row.integrationScore ==null? '--':row.integrationScore}} </template>
      </el-table-column>
      <el-table-column label="完整性得分" prop="completeScore">
        <template slot-scope="{row}">{{row.completeScore ==null? '--':row.completeScore}} </template>
      </el-table-column>
      <el-table-column label="及时性得分" prop="timelinessScore">
        <template slot-scope="{row}">{{row.timelinessScore ==null? '--':row.timelinessScore}} </template>
      </el-table-column>
      <el-table-column label="执行时间" prop="executeTime" min-width="120"></el-table-column>
      <el-table-column label="计分周期" min-width="180">
        <template slot-scope="{row}">
          {{row.dataStartDate?row.dataStartDate+'至'+row.dataEndDate:'累计'}}
        </template>
      </el-table-column>
    </el-table>

  </el-dialog>
</template>

<script>
export default {
  props: {
    cellStyle: Function,
  },
  data() {
    return {
      isVisible: false,
      tableData: [],
    };
  },
  methods: {
    open(tableData) {
      this.tableData = tableData;
      this.isVisible = true;
    },
    close() {
      this.tableData = [];
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog__header {
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
</style>