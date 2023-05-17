<!-- 
  @description 标准管理-交换标准-交换标准配置-模板
  @date 2021/9/22
-->
<template>
  <el-dialog title="模板" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false">
    <tree-transfer :title="['模板列表', '字段列表']" :from_data='fromData' :to_data='toData' :defaultProps="treeProps" @add-btn='add' @remove-btn='remove' height='500px' filter pid="parentId" rootPidValue="0001" :filterNode="filterMethod"></tree-transfer>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import treeTransfer from "el-tree-transfer";

import { addExchangeField } from "api/standard.js";

export default {
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isVisible: false,
      treeProps: {
        label: (data) =>
          data.type == "1" ? data.name + "(模板)" : data.name + "(字段)",
        // label: "name",
        children: "infoDtoList",
      },
      fromData: [],
      toData: [],
      templateData: "", //模板列表，一直不变
      fieldData: [], //字段列表
      fieldNames: [], //存字段列表名，用于判断是否重复
      bindId: "", //交换标准id
    };
  },
  components: { treeTransfer },
  methods: {
    open(id) {
      this.bindId = id;
      this.templateData = JSON.stringify(this.treeData);
      this.fromData = JSON.parse(this.templateData);
      this.toData = [];
      this.fieldData = [];
      this.fieldNames = [];
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
    },
    save() {
      if (this.fieldData.length == 0) {
        this.$message("请将要添加的字段移到字段列表中");
      } else {
        this.$confirm(
          "是否确定添加字段列表中的字段(将自动去掉重复字段)?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            let param = [];
            this.fieldData.forEach((item) => {
              param.push(item.realId);
            });
            addExchangeField({
              exchangeStandardId: this.bindId,
              fieldId: param,
            }).then((res) => {
              if (res.code == 0) {
                this.$emit("templateAddSubmit");
                this.$message.success("添加成功");
                this.close();
              }
            });
          })
          .catch(() => {});
      }
    },
    // 过滤函数
    filterMethod(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      this.fromData = JSON.parse(this.templateData);
      obj.nodes.forEach((item) => {
        if (item.type == "2" && this.fieldNames.indexOf(item.name) == -1) {
          this.fieldNames.push(item.name);
          this.fieldData.push(item);
        }
      });
      this.toData = JSON.parse(JSON.stringify(this.fieldData));
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      this.fieldData = JSON.parse(JSON.stringify(this.toData));
      this.fieldNames = [];
      this.fieldData.forEach((item) => {
        this.fieldNames.push(item.name);
      });
      this.fromData = JSON.parse(this.templateData);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-transfer,
::v-deep .el-transfer-panel {
  height: 450px;
  .el-transfer-panel__list.is-filterable {
    height: 348px;
  }
}
</style>
