<template>
  <div>
    <el-table
      ref="table"
      element-loading-text="Loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width:100%"
    >
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in tableLabel"
        :width="item.width ? item.width : ''"
        :key="index"
        :align="item.align ? item.align : 'center'"
        :label="item.label"
        :prop="item.param"
      >
        <template slot-scope="scope">
          <span v-if="item.render" style="color:#606266">
            {{ item.render(scope.row) }}
          </span>
          <span v-else style="color:#606266">{{ scope.row[item.param] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableOption.label"
        :width="tableOption.width ? tableOption.width : ''"
        :label="tableOption.label"
        align="center"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in tableOption.options"
            :key="index"
            :type="item.type ? item.type : 'text'"
            :icon="item.icon ? item.icon : ''"
            @click="handleButton(item.methods, scope.row)"
            size="small"
          >
            {{ item.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right;"
      :page-sizes="[5, 10, 15, 20]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pager.currentPage"
      :page-size.sync="pager.pageSize"
      :hide-on-single-page="true"
      layout="total, prev, pager, next, sizes"
      :total="pager.total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    tableData: {
      // 表格数据
      type: Array,
      default: () => {
        return [];
      },
    },
    tableLabel: {
      // label信息
      type: Array,
      default: () => {
        return [];
      },
    },
    tableOption: {
      // 操作数据
      type: Object,
      default: () => {
        return {};
      },
    },
    showSelection: {
      // 是否显示复选框
      type: Boolean,
      default: false,
    },
    pager: {
      // 分页信息
      type: Object,
      default: function() {
        return {
          currentPage: 1,
          pageSize: 10,
          total: 0,
        };
      },
    },
  },
  methods: {
    // 触发自定义按钮操作
    handleButton(method, row) {
      this.$emit("handleButton", method, row);
    },
    // 获取所有的复选框选项
    getAllSelections() {
      return this.$refs.table.selection;
    },
    // size发生变化时，令currentPgae为1，并发送自定义事件
    handleSizeChange(val) {
      this.pager.currentPage = 1;
      this.$emit("pagination", val);
    },
    // currentPage发生变化时，发送自定义事件
    handleCurrentChange(val) {
      this.$emit("pagination", val);
    },
  },
};
</script>
