<!--
  @description 采集监控-基础配置-质控方案-机构名称编辑
  @date 2022/03/18
-->
<template>
  <el-drawer size="40%" :visible.sync="isVisible" :before-close="close">
    <template #title>
      <div class="head">机构名称-编辑</div>
    </template>
    <tree-transfer :title="['机构列表', '选中机构']" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label',children:'children'}" height='500px' width='95%' filter pid="parentId" rootPidValue="null" :filterNode="filterMethod"></tree-transfer>
    <footer>
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="save">确认</el-button>
    </footer>
  </el-drawer>
</template>

<script>
import { deepClone } from "utils/utils";

export default {
  props: {
    orgNameData: Array,
  },
  data() {
    return {
      isVisible: false,
      fromData: [],
      toData: [],
      orgNames: [],
    };
  },
  methods: {
    // 过滤函数
    filterMethod(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    save() {
      if (this.toData.length == 0) {
        this.$message.warning("请选择机构名称");
        return;
      }
      this.getOrgNames(this.toData);
      this.$emit("orgNameSave", this.orgNames, this.toData);
      this.$message.success("机构范围保存成功");
      this.close();
    },
    getOrgNames(data) {
      data.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.getOrgNames(item.children);
        } else if (!this.orgNames.includes(item.id)) {
          this.orgNames.push(item.id);
        }
      });
    },
    open(names) {
      this.fromData = deepClone(this.orgNameData);
      if (names) {
        this.toData = names;
      }
      this.isVisible = true;
    },
    close() {
      this.toData = [];
      this.orgNames = [];
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
.wl-transfer {
  margin-top: 10px;
  margin-left: 10px;
}
.el-form {
  padding: 10px;
  ::v-deep .el-transfer__buttons {
    padding: 0 10px;
    width: 66px;
    .el-button:last-child {
      margin: 0;
    }
  }
}
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #e9e9e9;
  .el-button {
    float: right;
    margin-top: 9px;
    margin-right: 10px;
  }
}
</style>