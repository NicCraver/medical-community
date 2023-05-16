<template>
  <el-table
    empty-text="暂无数据"
    ref="table"
    :data="tableList"
    border
    stripe
    fit
    highlight-current-row
    :height="inTableHeight"
    @selection-change="selectionChange"
    @row-click="rowClick"
  >
    <!-- 选择框 -->
    <el-table-column
      v-if="select"
      type="selection"
      fixed="left"
      width="55"
      align="center"
    />
    <template v-for="(itm, idx) in header">
      <!-- 特殊处理列 -->
      <el-table-column
        v-if="itm.render"
        :key="idx"
        :prop="itm.prop ? itm.prop : null"
        :label="itm.label ? itm.label : null"
        :width="itm.width ? itm.width : null"
        :sortable="itm.sortable ? itm.sortable : false"
        :align="itm.align ? itm.align : 'center'"
        :fixed="itm.fixed ? itm.fixed : null"
        :show-overflow-tooltip="itm.tooltip"
        min-width="50"
      >
        <template slot-scope="scope">
          <ex-slot
            :render="itm.render"
            :row="scope.row"
            :index="scope.$index"
            :column="itm"
          />
        </template>
      </el-table-column>
      <!-- 正常列 -->
      <el-table-column
        v-else
        :key="idx"
        :prop="itm.prop ? itm.prop : null"
        :label="itm.label ? itm.label : null"
        :width="itm.width ? itm.width : null"
        :sortable="itm.sortable ? itm.sortable : false"
        :align="itm.align ? itm.align : 'center'"
        :fixed="itm.fixed ? itm.fixed : null"
        :formatter="itm.formatter"
        :show-overflow-tooltip="itm.tooltip"
        min-width="50"
      />
    </template>
  </el-table>
</template>

<script>
// 自定义内容的组件
var exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, context) => {
    const params = {
      row: context.props.row,
      index: context.props.index
    };
    if (context.props.column) params.column = context.props.column;
    return context.props.render(h, params);
  }
};

export default {
  components: { exSlot },
  props: {
    tableList: {
      type: Array,
      default: () => []
    },
    header: {
      type: Array,
      default: () => []
    },
    select: {
      type: Boolean,
      default: () => false
    },
    height: {
      type: [Number, String, Function],
      default: () => null
    }
  },
  data() {
    return {
      inTableHeight: null
    };
  },
  created() {
    //该阶段可以接收父组件的传递参数
    this.inTableHeight = this.height;
  },
  mounted() {
    this.$nextTick(() => {
      //表格高度自适应浏览器大小
      this.changeTableHight();
      if (!this.height) {
        window.onresize = () => {
          this.changeTableHight();
        };
      }
    });
  },
  destroyed() {
    //高度自适应事件注销
    window.onresize = null;
  },
  watch: {
    /**
     * 数据变化后 高度自适应
     */
    tableList() {
      this.$nextTick(() => {
        this.changeTableHight();
      });
    }
  },
  methods: {
    /**
     * 选择框选择后更改,事件分发
     */
    selectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    /**
     * 点击事件
     */
    rowClick(row, column, event) {
      this.$emit("row-click", row, column, event);
    },
    /**
     * 高度自适应
     * 当表格展示空间小于460按460px展示，大于的时候高度填充
     */
    changeTableHight() {
      if (this.height) {
        //如果有传进来高度就取消自适应
        this.inTableHeight = this.height;
        this.$refs.table.doLayout();
        return;
      }
      let tableHeight = window.innerHeight || document.body.clientHeight;
      //高度设置
      let disTop = this.$refs.table.$el;
      //如果表格上方有元素则减去这些高度适应窗口，66是底下留白部分
      tableHeight -= disTop.offsetTop + 66;
      if (disTop.offsetParent) tableHeight -= disTop.offsetParent.offsetTop;
      this.inTableHeight = tableHeight < 460 ? 460 : tableHeight;
      //重绘表格
      this.$refs.table.doLayout();
    }
  }
};
</script>
<style></style>