<!-- 
  @description 基础平台-标准管理-交换标准-交换标准配置
  @date 2021/9/18
 -->
<template>
  <div class="exchange-config">
    <div class="protal-title">交换标准配置</div>
    <div class="protal-main">
      <el-card class="left">
        <header class="protal-header">
          <span>标准列表</span>
          <el-button type="primary" size="mini" icon="iconfont icon-plus" class="fr" @click="standardAdd"></el-button>
        </header>
        <el-input placeholder="请输入交换标准名称" v-model="listFilterText" size="small"></el-input>
        <div class="menu">
          <el-scrollbar v-loading="menuLoading">
            <el-menu class="protal-menu" :default-active="activeIndex" @select="selectMenu">
              <el-menu-item v-for="item in standardListData" :key="item.id" :index="item.id">
                {{ item.name }}
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </div>
      </el-card>
      <el-card class="info">
        <header class="protal-header">
          <span>基本信息</span>
          <el-button-group class="fr">
            <el-button type="primary" @click="infoSave">保存</el-button>
            <el-button type="primary" @click="infoDelete">删除</el-button>
            <el-button type="primary" @click="copyConfig" :disabled="infoForm.publishStatus != '1' && infoForm.publishStatus != '2'">引用</el-button>
          </el-button-group>
        </header>
        <el-form label-width="120px" ref="infoForm" size="small" :model="infoForm" :rules="infoFormRules" v-loading="infoLoading">
          <el-row>
            <el-col :span="11">
              <el-form-item label="业务分类" prop="businessId">
                <span v-if="infoForm.publishStatus == '1' || infoForm.publishStatus == '2'">{{findNameById(infoForm.businessId, 1)}}</span>
                <el-select v-else v-model="infoForm.businessId" placeholder="请选择">
                  <el-option v-for="item in works" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="活动分类" prop="activeId">
                <span v-if="infoForm.publishStatus == '1' || infoForm.publishStatus == '2'">{{findNameById(infoForm.activeId, 2)}}</span>
                <el-select v-else v-model="infoForm.activeId" placeholder="请选择">
                  <el-option v-for="item in activities" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="交换标准编码" prop="code">
                <span v-if="infoForm.publishStatus == '1' || infoForm.publishStatus == '2'">{{infoForm.code}}</span>
                <el-input v-else v-model="infoForm.code" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="交换标准名称" prop="name">
                <template v-if="infoForm.publishStatus == '1' || infoForm.publishStatus == '2'">
                  <span>{{infoForm.name}}</span>
                  <el-tooltip v-if="infoForm.publishStatus == '1'" :content="infoForm.publishDate + '发布成功'" placement="right" effect="light">
                    <i class="iconfont icon-check-circle" style="color: #00BB66"></i>
                  </el-tooltip>
                  <el-tooltip v-else :content="infoForm.deactivateDate + '被停用发布'" placement="right" effect="light">
                    <i class="iconfont icon-info-circle" style="color: #EE0C00"></i>
                  </el-tooltip>
                </template>
                <el-input v-else v-model="infoForm.name" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="表名" prop="tableName">
                <span v-if="infoForm.publishStatus == '1' || infoForm.publishStatus == '2'">{{infoForm.tableName}}</span>
                <el-input v-else v-model="infoForm.tableName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="备份表名" prop="bakTableName">
                <span v-if="infoForm.publishStatus == '1' || infoForm.publishStatus == '2'">{{infoForm.bakTableName}}</span>
                <el-input v-else v-model="infoForm.bakTableName" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="描述说明" prop="description">
                <span v-if="infoForm.publishStatus == '1' || infoForm.publishStatus == '2'">{{infoForm.description}}</span>
                <el-input v-else v-model="infoForm.description" placeholder="请输入内容" style="width:100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="list">
        <header class="protal-header">
          <span>交换数据元列表</span>
        </header>
        <el-row class="protal-row">
          <el-button type="primary" @click="templetClick">模板</el-button>
          <el-button type="primary" @click="tableAdd">添加</el-button>
          <el-button type="primary" @click="tableDel">删除</el-button>
          <span class="tip"><i class="iconfont icon-info-circle-fill"></i>已选择 {{multipleSelection.length}} 项</span>
        </el-row>
        <div class="table">
          <el-table height="100%" ref="table" size="small" v-loading="tableLoading" :data="tableData" @selection-change="tableSelectionChange" border stripe>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="fieldCode" label="数据元编码"></el-table-column>
            <el-table-column prop="fieldName" label="数据元名称"></el-table-column>
            <el-table-column label="数据类型">
              <template slot-scope="{row}">{{dataType(row.dataType)}}</template>
            </el-table-column>
            <el-table-column prop="valueDomainName" label="值域"></el-table-column>
            <el-table-column label="操作" align="center" v-if="infoForm.publishStatus == '0'">
              <template slot-scope="{row}">
                <el-button type="text" icon="iconfont icon-arrowup" @click="tableMove(row, true)"></el-button>
                <el-button type="text" icon="iconfont icon-arrowdown" @click="tableMove(row, false)"></el-button>
                <el-button type="text" icon="iconfont icon-delete" @click="tableRowDel(row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination class="fr" layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :page-sizes="[5,10, 20, 50, 100]" :page-size="pageSize" :total="tableDataLength" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </el-card>
    </div>

    <templet ref="templet" :treeData="templateTreeData" @templateAddSubmit="getTableData(infoForm.id)"></templet>
    <field-add ref="fieldAdd" @exchangeFieldAddSubmit="getTableData(infoForm.id)"></field-add>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import templet from "./exchangeStandard/ExchangeConfigTemplet";
import fieldAdd from "./exchangeStandard/BasicConfigAdd.vue";

import {
  getExchangeStandardList,
  getExchangeDataelementList,
  getBasicconfigSelect,
  addExchangeStandard,
  editExchangeStandard,
  getExchangeStandardInfo,
  deleteExchangeStandard,
  deleteExchangeField,
  sortExchangeField,
  getTemplate,
  quoteExchangeStandard,
} from "api/standard.js";

export default {
  components: {
    templet,
    fieldAdd,
  },
  computed: {
    ...mapGetters(["dataType"]),
  },
  data() {
    return {
      listFilterText: "", //标准列表搜索input
      activeIndex: "", //当前激活菜单
      menuLoading: false,
      standardList: [], //标准列表
      standardListData: [], //过滤后的标准列表
      infoForm: {
        businessId: "", //业务分类
        activeId: "", //活动分类
        code: "", //交换标准编码
        name: "", //交换标准名称
        tableName: "系统自动生成", //表名
        bakTableName: "系统自动生成", //备份表名
        description: "", //描述说明
      }, //基本信息表单
      infoFormRules: {
        businessId: [
          { required: true, message: "请选择业务分类", trigger: "blur" },
        ],
        activeId: [
          { required: true, message: "请选择活动分类", trigger: "blur" },
        ],
        code: [
          { required: true, message: "请输入交换标准编码", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入交换标准名称", trigger: "blur" },
          { max: 30, message: "长度在30个字符内", trigger: "blur" },
          {
            pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z_\u4e00-\u9fa50-9]*$/,
            message: "请输入以字母或汉字开头的数字、字母、下划线或汉字",
            trigger: "blur",
          },
        ],
      }, //基本信息表单-验证规则
      works: [], //业务分类下拉选项
      activities: [], //活动分类下拉选项
      infoLoading: false,
      tableData: [], //交换数据元列表数据
      tableDataLength: 0,
      multipleSelection: [], //交换数据元列表被选中的内容
      currentPage: 1, //当前页
      pageSize: 10, //每页多少条
      tableLoading: false,
      templateTreeData: [],
    };
  },
  mounted() {
    this.getStandardList();
    getBasicconfigSelect({ type: "1" }).then((res) => {
      this.works = res.result;
    });
    getBasicconfigSelect({ type: "2" }).then((res) => {
      this.activities = res.result;
    });
    getTemplate().then((res) => {
      this.templateTreeData = this.formatTreeData(res.result);
    });
  },
  watch: {
    listFilterText(val) {
      if (val) {
        this.standardListData = this.standardList.filter((item) => {
          return item.name.indexOf(val) !== -1;
        });
      } else {
        this.standardListData = this.standardList;
      }
    },
  },
  methods: {
    // 菜单激活回调
    selectMenu(index) {
      this.activeIndex = index;
      this.getInfo(index);
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData(index);
    },
    // 获取标准列表
    getStandardList(id) {
      this.menuLoading = true;
      getExchangeStandardList()
        .then((res) => {
          if (res.code == 0) {
            this.standardList = res.result;
            this.standardListData = res.result;
            if (id) {
              this.$nextTick(() => {
                this.activeIndex = id;
              });
            }
          }
          this.menuLoading = false;
        })
        .catch((err) => {
          this.menuLoading = false;
        });
    },
    // 获取基本信息
    getInfo(id) {
      this.$refs.infoForm.resetFields();
      this.infoLoading = true;
      getExchangeStandardInfo({ id: id })
        .then((res) => {
          if (res.code == 0) {
            this.infoForm = res.result;
            this.infoForm.state = "edit";
          }
          this.infoLoading = false;
        })
        .catch((err) => {
          this.infoLoading = false;
        });
    },
    // 获取交换数据元列表
    getTableData(id) {
      this.tableLoading = true;
      getExchangeDataelementList({
        exchangeStandardId: id,
        pageNum: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
      })
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.result;
            this.tableDataLength = res.total;
          }
          this.tableLoading = false;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    // 标准列表-新增
    standardAdd() {
      this.activeIndex = "";
      this.$refs.infoForm.resetFields();
      this.infoForm = {
        tableName: "系统自动生成",
        bakTableName: "系统自动生成",
        state: "add",
      };
      // 清空交换数据元列表
      this.currentPage = 1;
      this.pageSize = 10;
      this.tableData = [];
      this.tableDataLength = 0;
    },
    // 保存
    infoSave() {
      if (this.infoForm.state == undefined) {
        this.$message("请选择交换标准或新增");
      } else if (this.infoForm.publishStatus == "1") {
        this.$message("已发布的交换标准不可编辑");
      } else if (this.infoForm.publishStatus == "2") {
        this.$message("已停用的交换标准不可编辑");
      } else {
        this.$refs.infoForm.validate((valid) => {
          if (valid) {
            this.infoLoading = true;
            if (this.infoForm.state === "add") {
              // 新增
              addExchangeStandard(this.infoForm)
                .then((res) => {
                  if (res.code == 0) {
                    this.$message.success("新增成功");
                    this.getStandardList(res.result);
                    this.getInfo(res.result);
                  }
                  this.infoLoading = false;
                })
                .catch(() => {
                  this.infoLoading = false;
                });
            } else {
              // 编辑
              editExchangeStandard(this.infoForm)
                .then((res) => {
                  if (res.code == 0) {
                    this.$message.success("保存成功");
                    this.getStandardList(res.result);
                    this.getInfo(res.result);
                  }
                  this.infoLoading = false;
                })
                .catch(() => {
                  this.infoLoading = false;
                });
            }
          } else {
            this.$message.warning("缺少必填项内容，无法保存");
          }
        });
      }
    },
    // 删除
    infoDelete() {
      if (this.infoForm.state !== "edit") {
        this.$message("请选择交换标准");
      } else if (this.infoForm.publishStatus == "1") {
        this.$message("已发布的交换标准不可删除");
      } else {
        this.$confirm("此操作将删除该交换标准, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.infoLoading = true;
            deleteExchangeStandard({ id: this.infoForm.id })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("删除成功");
                  this.getStandardList();
                  this.activeIndex = "";
                  this.$refs.infoForm.resetFields();
                }
                this.infoLoading = false;
              })
              .catch(() => {
                this.infoLoading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 引用
    copyConfig() {
      let s = this.infoForm.publishStatus == "1" ? "发布" : "停用";
      this.$confirm(
        "交换标准已" + s + "。系统将以此信息为您新增。您是否要继续新增？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.infoLoading = true;
          this.tableLoading = true;
          quoteExchangeStandard({ id: this.infoForm.id })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("引用成功");
                this.getStandardList(res.result);
                this.getInfo(res.result);
              }
              this.infoLoading = false;
              this.tableLoading = false;
            })
            .catch(() => {
              this.infoLoading = false;
              this.tableLoading = false;
            });
        })
        .catch(() => {});
    },
    // 交换数据元列表-模板
    templetClick() {
      if (this.infoForm.state !== "edit") {
        this.$message("请选择交换标准");
      } else if (this.infoForm.publishStatus == "1") {
        this.$message("已发布的交换标准不可编辑");
      } else if (this.infoForm.publishStatus == "2") {
        this.$message("已停用的交换标准不可编辑");
      } else {
        this.$refs.templet.open(this.infoForm.id);
      }
    },
    // 交换数据元列表-添加
    tableAdd() {
      if (this.infoForm.state !== "edit") {
        this.$message("请选择交换标准");
      } else if (this.infoForm.publishStatus == "1") {
        this.$message("已发布的交换标准不可编辑");
      } else if (this.infoForm.publishStatus == "2") {
        this.$message("已停用的交换标准不可编辑");
      } else {
        this.$refs.fieldAdd.open("exchangeadd", "", this.infoForm.id);
      }
    },
    // 交换数据元列表-删除
    tableDel() {
      if (this.multipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else if (this.infoForm.publishStatus == "1") {
        this.$message("已发布的交换标准不可编辑");
      } else if (this.infoForm.publishStatus == "2") {
        this.$message("已停用的交换标准不可编辑");
      } else {
        this.$confirm("是否确认删除选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = [];
            this.multipleSelection.forEach((item) => {
              param.push(item.relationId);
            });
            this.exchangeFieldDelete(param);
          })
          .catch(() => {});
      }
    },
    // 交换数据元列表-行内删除
    tableRowDel(row) {
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exchangeFieldDelete([row.relationId]);
        })
        .catch(() => {});
    },
    // 交换数据元列表删除接口
    exchangeFieldDelete(param) {
      this.tableLoading = true;
      deleteExchangeField(param)
        .then((res) => {
          if (res.code == 0) {
            this.getTableData(this.infoForm.id);
            this.$message.success("删除成功");
          } else {
            this.tableLoading = false;
          }
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 交换数据元列表-上移/下移
    // moveUp true:上移 false:下移
    tableMove(row, moveUp) {
      let o = moveUp ? "上移" : "下移";
      this.$confirm("该数据将" + o + "一行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableLoading = true;
          sortExchangeField({
            relationId: row.relationId,
            moveUp: moveUp,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("操作成功");
                this.getTableData(this.infoForm.id);
              } else {
                this.tableLoading = false;
              }
            })
            .catch(() => {
              this.tableLoading = false;
            });
        })
        .catch(() => {});
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData(this.infoForm.id);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData(this.infoForm.id);
    },
    // 交换数据元列表-table选择项发生变化事件
    tableSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 格式化模板树: 把fieldList放到infoDtoList里面
    formatTreeData(data) {
      data.forEach((item) => {
        if (item.fieldList.length > 0) {
          // 字段id=模板名+字段id,避免id重复
          item.fieldList.forEach((field) => {
            field.realId = field.id;
            field.id = item.name + field.id;
          });
          item.infoDtoList = [...item.infoDtoList, ...item.fieldList];
        }
        delete item.fieldList;
        if (item.infoDtoList.length > 0) {
          item.infoDtoList = this.formatTreeData(item.infoDtoList);
        } else {
          delete item.infoDtoList;
        }
      });
      return data;
    },
    // 根据id查找业务/活动分类名称
    // type 1:业务分类 2:活动分类
    findNameById(id, type) {
      let arr = type == 1 ? this.works : this.activities;
      let name = arr.find((item) => item.id == id)?.name;
      return name ? name : id;
    },
  },
};
</script>

<style lang="scss" scoped>
.exchange-config {
  height: 100%;
}

.el-card ::v-deep .el-card__body {
  padding: 0;
}

.left {
  float: left;
  width: 20%;
  height: 100%;
  margin-right: 16px;
  header {
    border-bottom: 1px solid #dfe4eb;
    .el-button {
      padding: 2px;
      margin-top: 14px;
    }
  }
  .el-input {
    margin: 16px 0 0 16px;
    width: calc(100% - 32px);
  }
  .menu {
    height: calc(100% - 98px);
    padding: 10px 10px 10px 5px;
    .el-menu {
      border-right: none;
    }
  }
}

.info header,
.list header {
  position: relative;
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
    font-weight: 700;
  }
}
.info {
  height: 248px;
  margin-bottom: 16px;
  header {
    border-bottom: 1px solid #dfe4eb;
    .el-button {
      margin-top: 9px;
    }
  }
  .el-form {
    padding: 16px;
    .el-row {
      height: 32px;
      line-height: 32px;
      padding: 0;
      margin-bottom: 12px;
      .el-form-item {
        margin-bottom: 12px;
        ::v-deep .el-form-item__error {
          padding: 0;
        }
      }
    }
    .el-input,
    .el-select {
      width: 100%;
    }
    i {
      font-size: 20px;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}

.list {
  height: calc(100% - 264px);
  .el-row {
    height: 32px;
    line-height: 32px;
    margin-bottom: 16px;
    padding: 0 16px;
    .tip {
      width: calc(100% - 216px);
    }
  }
  .table {
    padding: 0 16px;
    height: calc(100% - 114px - 48px);
  }
  .el-pagination {
    margin: 16px 16px 0 0;
  }
}
</style>