<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div
            v-for="(v, index) in props.row.components"
            :key="index"
            style="display: flex; align-items: center"
          >
            <div style="margin-right: 20px">{{ v.name }}</div>
            <el-button type="text" @click="editComponents(v)">编辑</el-button>
            <!-- <el-button type="text">删除</el-button> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分组名称" prop="category"> </el-table-column>
      <el-table-column label="id" prop="classificationId"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { onQueryComponent } from "@/api/modules/FormDesign";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.onQueryComponent();
  },
  methods: {
    // 查询业务组件
    async onQueryComponent() {
      try {
        const res = await onQueryComponent({});
        this.tableData = res.result;
        console.log("res", res);
      } catch (err) {
        console.error("err", err);
      }
    },
    editComponents(row) {
      console.log(`editComponents`, row);
    },
  },
};
</script>

<style lang="scss" scoped>
.da {
  align-items: center;
}
</style>
