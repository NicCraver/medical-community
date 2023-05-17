<!--
  @description 基础配置-规则配置-完整性
  @date 2022/03/09
-->
<template>
  <div class="integrity">
    <el-card>
      <ProTable>
        <template #header>
          <el-input size="small" placeholder="规则名称/规则编码" v-model="queryParams.relate" clearable></el-input>
          <el-select size="small" placeholder="分级" v-model="queryParams.ruleLevel" clearable>
            <el-option v-for="(item, index) in ruleGradeSelect" :key="index" :value="item.code" :label="item.name||item.code"></el-option>
          </el-select>
          <el-cascader placeholder="角色/业务项目" size="small" v-model="queryParams.catalog" :options="catalogOptions" :props="catalogProps" filterable clearable></el-cascader>
          <el-select size="small" placeholder="状态" v-model="queryParams.status" clearable>
            <el-option :value="1" label="开启"></el-option>
            <el-option :value="0" label="关闭"></el-option>
          </el-select>
          <el-date-picker size="small" v-model="queryTime" type="daterange" start-placeholder="创建开始日期" end-placeholder="创建结束日期" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </template>
        <template #actions>
          <el-button size="small" type="primary" @click="search">搜索</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </template>
        <template #batchActions>
          <el-button size="small" type="primary" icon="iconfont icon-plus" @click="$refs.add.open('add')">新增</el-button>
          <el-button size="small" icon="iconfont icon-delete" @click="deleteBtnClick">删除</el-button>
          <div class="tip">
            <i class="iconfont icon-info-circle-fill"></i>
            <span>已选择 {{multipleSelection.length}} 项</span>
            <el-button type="text" @click="clearSelection">清空</el-button>
          </div>
        </template>
        <el-table ref="table" tooltip-effect="light" height="0" v-adaptive="{ bottomOffset: 105 }" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange" border stripe>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" type="index" width="50">
            <template slot-scope="{$index}">
              <span>{{ $index + 1 + (pageNum - 1) * pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规则类型" prop="type">
            <template>完整性</template>
          </el-table-column>
          <el-table-column label="规则分级">
            <template slot-scope="{row}">{{row.ruleLevel=='-1'?'无':row.ruleLevel}}</template>
          </el-table-column>
          <el-table-column label="业务目录" prop="roleBizName" min-width="170" show-overflow-tooltip></el-table-column>
          <el-table-column label="规则编号" prop="code" min-width="120"></el-table-column>
          <el-table-column label="规则名称" prop="name" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="业务表名" prop="businessTableName" min-width="250" show-overflow-tooltip></el-table-column>
          <el-table-column label="字段名" prop="businessVariableName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="字段规则">
            <template slot-scope="{row}">{{row.variableRule==1?'非空':'为空'}}</template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">{{row.enableStatus==1?'开启':'关闭'}}</template>
          </el-table-column>
          <el-table-column label="操作人" prop="updatedByName"></el-table-column>
          <el-table-column label="更新时间" prop="updatedTime" min-width="170"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="170"></el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-button type="text" @click="$refs.add.open('show', row.id)">查看</el-button>
              <el-button type="text" @click="$refs.add.open('edit', row.id)">编辑</el-button>
              <el-button type="text" @click="deleteByRow(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </ProTable>
    </el-card>

    <Add ref="add" v-bind="{...$attrs,...$props}" @save="search"></Add>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import Add from "./IntegrityAdd.vue";
import { getRuleConfigList, deleteRuleConfig } from "api/basicConfig";

export default {
  components: {
    ProTable,
    Add,
  },
  props: {
    ruleGradeData: Array,
    catalogOptions: Array,
  },
  data() {
    return {
      queryParams: {}, // 查询请求参数
      catalogProps: {
        value: "id",
        label: "name",
        children: "childNodes",
        checkStrictly: true,
      }, //业务目录prop
      queryTime: [], //创建日期
      tableData: [], //列表数据
      multipleSelection: [], //列表被选中的内容
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      total: 0, //总条数
    };
  },
  computed: {
    ruleGradeSelect() {
      return [{ code: "-1", name: "无" }, ...this.ruleGradeData];
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取规则配置列表
    getList() {
      let param = {
        type: 3,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.queryParams,
      };
      if (this.queryParams.catalog) {
        param.roleId = this.queryParams.catalog?.[0] ?? "";
        param.bizId = this.queryParams.catalog?.[1] ?? "";
        delete param.catalog;
      }
      if (this.queryTime && this.queryTime.length > 0) {
        param.startDate = this.queryTime[0];
        param.endDate = this.queryTime[1];
      }
      this.loading = true;
      getRuleConfigList(param)
        .then(({ code, result, total }) => {
          if (code === 0) {
            this.tableData = result;
            this.total = total;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 搜索
    search() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.getList();
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.queryTime = [];
      this.pageNum = 1;
      this.pageSize = 10;
      this.getList();
    },
    // 清空
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection();
    },
    // 删除
    deleteBtnClick() {
      if (this.multipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认删除选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = this.multipleSelection.map((item) => {
              return item.id;
            });
            this.delete(param);
          })
          .catch(() => {});
      }
    },
    // 行内删除
    deleteByRow(id) {
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete([id]);
        })
        .catch(() => {});
    },
    // 删除接口
    delete(p) {
      this.loading = true;
      deleteRuleConfig(p)
        .then(({ code }) => {
          if (code === 0) {
            this.getList();
            this.$message.success("删除成功");
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // table选择项发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.integrity {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
}
</style>