<!-- 
  @description 数据资源-概览-查看详情-表详情
  @date 2022/03/01
 -->
<template>
  <el-drawer size="40%" :visible.sync="isVisible" :before-close="close">
    <template #title>
      <div class="head">详情</div>
    </template>
    <div class="detail">
      <el-row>
        表信息
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-tooltip :content="tableInfo.tableName" effect="light">
            <div class="gird-content">{{tableInfo.tableName}}</div>
          </el-tooltip>
        </el-col>
        <el-col :span="6">
          <div class="gird-content">{{tableInfo.owner}}</div>
        </el-col>
        <el-col :span="6">
          <div class="gird-content">{{tableInfo.environment}}</div>
        </el-col>
      </el-row>
      <el-row class="tab">
        <el-col :span="24">
          <!-- tab不放到row里面会崩溃，elementui版本问题 -->
          <el-tabs v-model="activeName">
            <el-tab-pane label="字段信息" name="field">
              <el-table border stripe size="small" height="100%" ref="fieldTable" :data="fieldData">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="columnName" label="字段名"></el-table-column>
                <el-table-column prop="nullable" label="必填"></el-table-column>
                <el-table-column prop="dataType" label="类型"></el-table-column>
                <el-table-column prop="comments" label="说明"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-button size="small" class="fr" @click="close">返回</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { getDatabaseTableDetail } from "api/dataResource.js";

export default {
  data() {
    return {
      isVisible: false,
      tableInfo: { tableName: "", owner: "", environment: "" }, //表信息
      activeName: "field", //当前选中的标签页
      fieldData: [], //字段信息
    };
  },
  methods: {
    open(id, row) {
      this.tableInfo = row;
      getDatabaseTableDetail({ id: id, tableName: row.tableName }).then(
        (res) => {
          this.fieldData = res.result;
        }
      );
      this.isVisible = true;
    },
    close() {
      this.tableInfo = {};
      this.fieldData = [];
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-drawer__header {
  padding: 5px 10px 5px 0;
  margin-bottom: 0;
  border-bottom: 1px solid #e9e9e9;
  color: #303133;
}
.detail {
  height: 100%;
  padding: 10px;
  .el-row {
    height: 32px;
    line-height: 32px;
    .gird-content {
      height: 32px;
      border-radius: 2px;
      background-color: #f5f5f5;
      border: 1px solid #d9d9d9;
      padding-left: 10px;
      overflow: hidden;
    }
  }
  .tab {
    margin-top: 10px;
    height: calc(100% - 116px);
    .el-col {
      height: 100%;
      .el-tabs {
        height: 100%;
        ::v-deep .el-tabs__header {
          margin-bottom: 10px;
        }
        ::v-deep .el-tabs__content {
          height: calc(100% - 50px);
          .el-tab-pane {
            height: 100%;
          }
        }
      }
    }
  }
  .el-button {
    margin-top: 10px;
  }
}
</style>
