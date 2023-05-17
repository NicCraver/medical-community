<!-- 
  @description 标准管理-值域标准
  @date 2021/8/20
 -->
<template>
  <div class="area-standard">
    <div class="protal-title">值域标准</div>
    <div class="protal-main">
      <!-- 左侧树 -->
      <el-card class="left-tree">
        <el-scrollbar v-loading="treeLoading">
          <el-tree ref="tree" node-key="id" :data="treeData" :props="treeProps" :expand-on-click-node="false" :default-expanded-keys="treeNodeExpand" @node-click="treeNodeClick" highlight-current default-expand-all>
          </el-tree>
        </el-scrollbar>
      </el-card>
      <!-- 值域表 -->
      <el-card class="area">
        <header>
          <span>值域表</span>
          <el-button-group class="fr">
            <el-button icon="iconfont icon-plus" @click="$refs.add.open('新增')">新增</el-button>
            <el-button icon="iconfont icon-edit" @click="areaEdit">编辑</el-button>
            <el-button icon="iconfont icon-delete" @click="areaDelete">删除</el-button>
          </el-button-group>
          <el-button type="primary" class="fr corr-data" @click="correlationDataClick">关联数据元</el-button>
        </header>
        <div class="data" v-loading="areaLoading">
          <el-row>
            <el-col :span="12">
              <span class="title">标准类型：</span>
              {{ getStandardTypeName(areaData.standardType) }}
            </el-col>
            <el-col :span="12">
              <span class="title">标准名称：</span>
              {{ areaData.standardName }}
              <el-tag effect="plain" size="small" v-if="areaData.status == '1'">已启用</el-tag>
              <el-tag effect="plain" size="small" type="info" v-else-if="areaData.status == '0'">已关闭</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="title">所属目录：</span>
              {{ areaData.catalog }}
            </el-col>
            <el-col :span="12">
              <span class="title">目录子类：</span>
              {{ areaData.subCatalog }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="title">值域名称：</span>
              {{ areaData.valueDomainName }}
            </el-col>
            <el-col :span="12">
              <span class="title">值域代码：</span>
              {{ areaData.valueDomainCode }}
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 值域项列表 -->
      <el-card class="area-item">
        <header>
          <span>值域项列表</span>
        </header>
        <!-- 搜索行 -->
        <el-row class="search">
          <el-input placeholder="值域项/值域项名称" size="small" v-model="areaItemInput" clearable></el-input>
          <el-button type="primary" @click="searchAreaItem">搜索</el-button>
        </el-row>
        <!-- 操作行 -->
        <el-row class="operate">
          <el-button icon="iconfont icon-plus" :disabled="areaItemButtonState" @click="areaItemAdd">新增</el-button>
        </el-row>
        <div class="table" v-clickoutside="tableOutsideClick">
          <el-table border stripe size="small" height="100%" ref="itemTable" :data="areaItemData" :highlight-current-row="true" @current-change="itemCurrentchange" v-loading="itemTableLoading" element-loading-text="加载中...">
            <el-table-column prop="value" label="值域项" width="120">
              <template slot-scope="{ row }">
                <el-input v-if="row.edit === true" v-model="row.value" size="mini" class="blue-input" placeholder="必填项"></el-input>
                <span v-else>{{ row.value }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="值域项名称">
              <template slot-scope="{ row }">
                <el-input v-if="row.edit === true" v-model="row.name" size="mini" class="blue-input" placeholder="必填项"></el-input>
                <span v-else>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="值说明">
              <template slot-scope="{ row }">
                <el-input v-if="row.edit === true" v-model="row.desc" size="mini"></el-input>
                <span v-else>{{ row.desc }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="parentValueId" label="父值域">
              <template slot-scope="{ row }">
                <el-select v-if="row.edit === true" v-model="row.parentValueId" size="mini">
                  <el-option v-for="item in parentAreaData" :key="item.id" :value="item.id" :label="item.label"></el-option>
                </el-select>
                <span v-else>{{ row.parentValueName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="{ row, $index }">
                <template v-if="row.edit === true">
                  <el-button type="text" icon="iconfont icon-save" @click="areaItemSave(row)"></el-button>
                  <el-button v-if="row.operate && row.operate==='edit'" type="text" icon="iconfont icon-delete" @click="areaItemDel(row)"></el-button>
                  <el-button v-else type="text" icon="iconfont icon-close" @click="areaItemClose($index)"></el-button>
                </template>
                <template v-else>
                  <el-button type="text" icon="iconfont icon-edit" @click="areaItemEdit(row)" :disabled="areaItemButtonState"></el-button>
                  <el-button type="text" icon="iconfont icon-delete" :disabled="areaItemButtonState" @click="areaItemDel(row)"></el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination class="fr" layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="areaItemDataLength" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </el-card>
    </div>

    <!-- 值域表新增/编辑弹窗 -->
    <add ref="add" :formType="formType" @areaChange="areaChange"></add>
    <!-- 关联数据元弹窗 -->
    <correlation-data ref="correlationData" :selectData="dataElementSelect" @correDataElement="correDataElement"></correlation-data>
    <!-- 关联交换协议弹窗 -->
    <correlation-protocol ref="correlationProtocol"></correlation-protocol>
  </div>
</template>

<script>
import Clickoutside from "element-ui/src/utils/clickoutside";

import Add from "./areaStandard/Add.vue";
import CorrelationData from "./areaStandard/CorrelationData.vue";
import CorrelationProtocol from "./areaStandard/CorrelationProtocol.vue";

import {
  getAreaTree,
  getAreaTableById,
  getAreaStandardType,
  getAreaOption,
  deleteAreaTable,
  addAreaOption,
  editAreaOption,
  deleteAreaOption,
  getDataElementSelect,
} from "api/standard.js";

export default {
  components: {
    Add,
    CorrelationData,
    CorrelationProtocol,
  },
  directives: { Clickoutside },
  data() {
    return {
      treeProps: {
        children: "childNodes",
        label: "name",
      },
      treeData: [], //左侧树
      treeNodeExpand: [], //左侧树默认展开的节点
      treeLoading: false,
      areaData: {
        standardType: "", //标准类型
        standardName: "", //标准名称
        catalog: "", //所属目录
        subCatalog: "", //目录子类
        valueDomainName: "", //值域名称
        valueDomainCode: "", //值域代码
        version: "", //版本号
        publishDate: "", //发布时间
        linkedDataElement: false, //是否关联了数据元
        dataElementCode: "", //关联的数据元标识符
      }, // 值域表
      formType: [], //值域表-标准类型
      areaLoading: false,
      areaItemInput: "", //值域项列表-搜索-值域项/值域项名称
      areaItemData: [], // 值域项列表
      areaItemButtonState: false, //值域项列表操作列按钮状态(是否置灰)
      parentAreaData: [], //值域项列表-父值域下拉选项
      itemTableLoading: false, //值域项列表-加载
      areaItemDataLength: 0,
      currentPage: 1, //当前页
      pageSize: 10, //每页多少条
      dataElementSelect: [], //数据元标识符下拉选项
    };
  },
  mounted() {
    this.getTree(); //获取左侧树

    // 获取值域表标准类型
    getAreaStandardType().then((res) => {
      this.formType = res.result;
    });

    //加载数据元标识符下拉选项
    getDataElementSelect().then((res) => {
      this.dataElementSelect = res.result;
    });
  },
  computed: {},
  methods: {
    //树节点点击事件
    treeNodeClick(data, node) {
      if (node.level === 3) {
        this.areaItemInput = ""; //清空搜索条件
        this.areaItemButtonState = false; //操作按钮不置灰
        this.getAreaTableById(data.id); //获取值域表
        this.getAreaItem(data.id); //获取值域项列表
      }
    },

    /* 值域表 */
    //值域表-编辑button click
    areaEdit() {
      if (this.areaData.id) {
        this.$refs.add.open("编辑", JSON.parse(JSON.stringify(this.areaData)));
      } else {
        this.$message("请选择一条值域标准");
      }
    },
    //值域表-删除button click
    areaDelete() {
      if (this.areaData.id) {
        this.$confirm("是否确认删除值域表?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (this.areaData.linkedDataElement) {
              this.$message.warning("已关联数据元，无法删除");
            } else {
              deleteAreaTable(this.areaData.id).then((res) => {
                if (res.code == 0) {
                  this.getTree();
                  this.areaData = {};
                  this.areaItemData = [];
                  this.$message.success("删除值域表成功");
                }
              });
            }
          })
          .catch(() => {});
      } else {
        this.$message("请选择一条值域标准");
      }
    },
    //值域表-新增/编辑成功
    // params id：值域id; isadd:true新增,false编辑
    areaChange(id, isadd) {
      this.getTree(id);
      this.getAreaTableById(id);
      if (isadd) {
        this.areaItemData = [];
      }
    },

    /* 值域项列表 */
    // 根据搜索条件获取值域项列表
    searchAreaItem() {
      if (this.areaData.id) {
        this.getAreaItem(this.areaData.id);
      } else {
        this.$message("请选择一条值域标准");
      }
    },
    //值域项列表-add
    areaItemAdd() {
      if (this.areaData.id) {
        this.areaItemData.unshift({
          value: "",
          name: "",
          desc: "",
          parentValueId: "",
          edit: true,
          operate: "add",
        });
        this.areaItemButtonState = true;
        this.$refs.itemTable.setCurrentRow(this.areaItemData[0]);
      } else {
        this.$message("请选择一条值域标准");
      }
    },
    //值域项列表-edit
    areaItemEdit(row) {
      row.edit = true;
      row.operate = "edit";
      this.areaItemButtonState = true;
    },
    //值域项列表-save
    areaItemSave(row) {
      let param = {
        valueDomainId: this.areaData.id,
        value: row.value,
        name: row.name,
        desc: row.desc,
        parentValueId: row.parentValueId,
      };
      if (row.value === "" || row.name === "") {
        this.$message.warning("缺少必填项，无法保存");
      } else if (row.operate && row.operate === "add") {
        // 新增值域项
        addAreaOption(param).then((res) => {
          if (res.code == 0) {
            row.edit = false;
            this.areaItemButtonState = false;
            this.$message.success("新增值域项成功");
            this.getAreaItem(this.areaData.id);
          }
        });
      } else {
        // 编辑值域项
        param.id = row.id;
        editAreaOption(param).then((res) => {
          if (res.code == 0) {
            row.edit = false;
            this.areaItemButtonState = false;
            this.$message.success("编辑值域项成功");
            this.getAreaItem(this.areaData.id);
          }
        });
      }
    },
    //值域项列表-delete
    areaItemDel(row) {
      this.$confirm("是否确认删除值域项列表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (row.edit === true) {
            row.edit = false;
            this.areaItemButtonState = false;
          }
          deleteAreaOption(row.id).then((res) => {
            if (res.code == 0) {
              this.$message.success("删除值域项成功");
              this.getAreaItem(this.areaData.id);
            }
          });
        })
        .catch(() => {});
    },
    // 值域项列表 新增时取消button
    areaItemClose(index) {
      this.areaItemButtonState = false;
      this.areaItemData.splice(index, 1);
    },
    //值域项列表-当表格的当前行发生变化 todo点击其他地方保存本行
    itemCurrentchange(currentRow, oldCurrentRow) {
      if (oldCurrentRow && oldCurrentRow.edit) {
        // this.areaItemSave(oldCurrentRow);
        // console.log("aaaa");
      }
    },
    // 点击值域项列表之外的地方触发 todo点击其他地方保存本行
    tableOutsideClick() {
      if (this.areaItemButtonState) {
        // console.log("提示是否保存");
      }
    },

    /* 关联数据元 */
    //关联数据元 button click
    correlationDataClick() {
      if (this.areaData.id == undefined) {
        this.$message("请选择一条值域标准");
      } else if (this.areaData.status !== "1") {
        this.$message.warning("值域表已关闭，无法关联数据元");
      } else {
        this.$refs.correlationData.open(
          this.areaData.id,
          this.areaData.linkedDataElement,
          this.areaData.dataElementCode
        );
      }
    },
    // 关联数据元成功
    correDataElement() {
      this.getAreaTableById(this.areaData.id);
    },

    //关联交换协议 button click
    correlationProtocolClick() {
      this.$refs.correlationProtocol.open(this.areaData.isCorrelationProtocol);
    },

    // 获取左侧树
    getTree(id) {
      this.treeLoading = true;
      getAreaTree()
        .then((res) => {
          if (res.code == 0) {
            this.treeData = res.result;
            if (id) {
              this.treeNodeExpand = [id];
              this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(id);
              });
            }
          }
          this.treeLoading = false;
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    // 获取值域表
    getAreaTableById(id) {
      this.areaLoading = true;
      getAreaTableById({ id: id })
        .then((res) => {
          if (res.code == 0) this.areaData = res.result;
          this.areaLoading = false;
        })
        .catch(() => {
          this.areaLoading = false;
        });
    },
    // 获取值域项列表
    getAreaItem(id) {
      this.itemTableLoading = true;
      //获取值域项列表
      getAreaOption({
        valueDomainId: id,
        content: this.areaItemInput,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      })
        .then(({ code, result, total }) => {
          if (code == 0) {
            this.areaItemData = result;
            this.areaItemDataLength = total;
          }
          this.itemTableLoading = false;
        })
        .catch((err) => {
          this.itemTableLoading = false;
        });
      //获取父值域下拉选项
      getAreaOption({ valueDomainId: id }).then(({ code, result }) => {
        if (code === 0) {
          this.parentAreaData = [{ id: "", label: "-" }];
          result.forEach((item) => {
            this.parentAreaData.push({
              id: item.id,
              label: `${item.value}-${item.name}`,
            });
          });
        }
      });
    },
    // 获取标准类型 name by id
    getStandardTypeName(id) {
      if (id) {
        return this.formType.filter((item) => {
          return item.id == id;
        })[0]?.name;
      }
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getAreaItem(this.areaData.id);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getAreaItem(this.areaData.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.area-standard {
  height: 100%;
}
.left-tree {
  float: left;
  width: 20%;
  height: 100%;
  margin-right: 16px;
}
header {
  position: relative;
  height: 50px;
  line-height: 50px;
  padding: 0 16px;
  &::before {
    content: "";
    position: absolute;
    top: 15px;
    left: 0;
    width: 3px;
    height: 20px;
    background-color: #134796;
  }
  span {
    font-size: 16px;
    font-weight: 700;
  }
  .el-button-group {
    margin-top: 8px;
  }
  .corr-data {
    margin-top: 9px;
    margin-right: 10px;
  }
}
.area {
  height: 212px;
  margin-bottom: 16px;
  ::v-deep .el-card__body {
    padding: 0;
  }
  header {
    border-bottom: 1px solid #dfe4eb;
  }
  .data {
    padding: 16px 16px 0 16px;
    .el-row {
      height: 32px;
      line-height: 32px;
      margin-bottom: 16px;
      .title {
        color: #909399;
        width: 100px;
      }
      .el-tag {
        margin-left: 16px;
      }
    }
  }
}
.area-item {
  height: calc(100% - 212px - 16px);
  ::v-deep .el-card__body {
    padding: 0;
  }
  .el-row {
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    margin-bottom: 16px;
  }
  .search {
    .el-input {
      width: 220px;
      margin-right: 32px;
    }
  }
  .table {
    padding: 0 16px;
    height: calc(100% - 146px - 58px);
    .el-input,
    .el-select {
      width: 100%;
    }
    .blue-input ::v-deep .el-input__inner {
      border: 1px solid #134796;
    }
  }
  .el-pagination {
    margin: 16px 16px 0 0;
  }
}
</style>