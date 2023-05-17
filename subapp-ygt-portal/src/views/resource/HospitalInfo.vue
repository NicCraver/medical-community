<!-- 
  @description 统一资源管理后台-医院管理-医院信息
  @date 2021/10/19
 -->
<template>
  <div class="hospital-info">
    <div class="protal-title">医院信息</div>
    <div class="protal-main">
      <el-card>
        <!-- 搜索行 -->
        <el-row class="search">
          <span>医院名称：</span>
          <el-input size="small" v-model="searchForm.name"></el-input>
          <span>状态：</span>
          <el-select v-model="searchForm.state" size="small">
            <el-option value="1" label="已启用"></el-option>
            <el-option value="0" label="已停用"></el-option>
            <el-option value="2" label="全部"></el-option>
          </el-select>
          <span>时间范围：</span>
          <el-date-picker size="small" v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <el-button type="primary">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-row>
        <!-- 操作行 -->
        <el-row class="operate protal-row">
          <el-button>批量导入</el-button>
          <el-button icon="iconfont icon-plus">导出</el-button>
          <span class="tip"><i class="iconfont icon-info-circle-fill"></i>已选择 {{multipleSelection.length}} 项</span>
        </el-row>
        <div class="table">
          <el-table border stripe size="small" height="100%" ref="table" :data="tableData" @selection-change="tableSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="code" label="卫生机构代码"></el-table-column>
            <el-table-column prop="name" label="医院名称"></el-table-column>
            <el-table-column prop="level" label="医院等级"></el-table-column>
            <el-table-column prop="time" label="添加日期" sortable></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="{row}">
                <i class="table-circle" :class="{'table-circle-blue': row.state == '1'}"></i>
                <span v-if="row.state == '1'">已启用</span>
                <span v-else>已停用</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-button type="text" @click="showDetail(row)">详情</el-button>
                <el-button type="text">院区</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length" class="fr">
        </el-pagination>
      </el-card>
    </div>

    <show-detail ref="detail"></show-detail>
    <show-area ref="area"></show-area>
  </div>
</template>

<script>
import ShowDetail from "./hospital/HospitalInfoDetail.vue";
import ShowArea from "./hospital/HospitalInfoArea.vue";

export default {
  components: { ShowDetail, ShowArea },
  data() {
    return {
      searchForm: {
        name: "", //医院名称
        state: "", //状态
        time: [], //时间范围
      }, //搜索条件
      tableData: [
        {
          code: "1234567890",
          name: "上海市东方医院",
          level: "三级甲等",
          time: "2021-09-06 11:00:00",
          state: "1",
        },
        {
          code: "1234567890",
          name: "上海市仁济医院",
          level: "三级甲等",
          time: "2021-09-06 11:00:00",
          state: "0",
        },
      ],
      multipleSelection: [], // 表格被选中的内容
      currentPage: 1, //当前页
      pageSize: 10, //每页多少条
    };
  },
  methods: {
    // 重置 button click
    reset() {
      this.searchForm = {
        name: "",
        state: "",
        time: [],
      };
    },
    // table 详情 button click
    showDetail(row) {
      this.$refs.detail.open(row);
    },
    //table 选择项发生变化事件
    tableSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.hospital-info {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
}
.el-row {
  height: 32px;
  line-height: 32px;
  margin-bottom: 16px;
  padding: 0;
}
.search {
  span,
  .el-button,
  .el-input,
  .el-select,
  .el-date-editor {
    float: left;
  }
  span {
    width: 80px;
    text-align: right;
  }
  .el-input,
  .el-select {
    width: 220px;
    margin-right: 16px;
  }
  .el-input {
    margin-right: 0;
  }
  .el-date-editor {
    margin-right: 32px;
    width: 250px;
  }
}
.operate .tip {
  width: calc(100% - 188px);
}
.table {
  height: calc(100% - 96px - 64px);
  .table-circle {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #d5dade;
    margin-right: 5px;
  }
  .table-circle-blue {
    background-color: #134796;
  }
}
.el-pagination {
  margin-top: 16px;
}
</style>