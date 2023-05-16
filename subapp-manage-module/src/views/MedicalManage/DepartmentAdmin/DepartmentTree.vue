<template>
  <el-dialog
    title="科室列表"
    :visible="visible"
    class="department-tree"
    :before-close="closeDialog"
  >
    <div class="title">
      <p>修改科室名称，请先选中非末级科室</p>
      <div class="input-container">
        <el-input placeholder="请输入新科室名称" v-model="activeDeptName" />
        <el-button type="primary" class="submit" @click="handleSubmit">保存</el-button>
      </div>
    </div>
    <div class="tree-container">
      <el-tree
        :data="deptTreeData"
        :expand-on-click-node="false"
        highlight-current
        @node-click="handleNodeClick"
      />
    </div>
  </el-dialog>
</template>


<script>
import {
  getDeptTree,
  updateDeptName
} from '@/api/modules/systemAdmin';

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    hosId: {
      type: String,
      required: true
    },
    closeDialog: {
      type: Function
    }
  },
  data() {
    return {
      activeDeptName: '',
      deptTreeData: [],
      activeDept: {}
    }
  },
  mounted() {
    this.getDeptTree();
  },
  methods: {
    async getDeptTree() {
      console.log('hosId', this.hosId)
      try {
        const res = await getDeptTree({ hosId: this.hosId });
        console.log('getDeptTree==', res);
        this.deptTreeData = res.result;
      } catch(err) {
        console.error(err);
      }
    },
    handleNodeClick(data) {
      this.activeDept = data;
      console.log('this.activeDept==', this.activeDept);
      this.activeDeptName = this.activeDept.label;
    },
    async handleSubmit() {
      if (!this.activeDeptName.trim()) {
        this.$message.error('请输入新科室名称');
        return;
      }
      console.log('this.activeDept', this.activeDept)
      if (!this.activeDept.children) {
        this.$message.error('请选择非末级科室');
        return;
      }

      try {
        const res = await updateDeptName({
          id: this.activeDept.value,
          name: this.activeDeptName
        });
        this.activeDept.label = this.activeDeptName;
        console.log('updateDeptName===', res);
        this.$emit('update-success');
        this.$message.success('科室名称修改成功!');
      } catch(err) {
        console.error(err);
      }
    }
  },
  watch: {
    hosId() {
      this.getDeptTree();
    },
    visible(newVal) {
      if (!newVal) {
        this.getDeptTree();
        this.activeDeptName = '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.department-tree {
  .title {
    background-color: #F5F5F5;
    padding: 10px;
    .input-container {
      margin-top: 5px;
      display: flex;
      .submit {
        margin-left: 20px;
      }
    }
  }
  .tree-container {
    margin-top: 10px;
  }
  ::v-deep .el-tree {
    .is-current {
      font-weight: normal;
    }
    // .is-focusable {
    //   background-color: #EEF3FF
    // }
  }


}
</style>
