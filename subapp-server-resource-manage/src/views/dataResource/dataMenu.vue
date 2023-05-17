<!-- 
  @description 数据资源-资源目录
  @date 2022/2/9
 -->
<template>
  <div class="dataMenu">
    <div class="protitle">资源目录</div>
    <div class="promain">
      <el-card class="left">
        <header>
          <span>目录列表</span>
          <el-dropdown class="fr" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="iconfont icon-ellipsis"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="true">展开全部</el-dropdown-item>
              <el-dropdown-item :command="false">折叠全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button class="fr" icon="iconfont icon-plus" type="primary" @click="resourceAdd"></el-button>
        </header>
        <el-input placeholder="目录名称" v-model="filterText" size="small"></el-input>
        <div class="tree" v-loading="treeLoading">
          <el-scrollbar>
            <el-tree ref="tree" node-key="id" :data="resourceTreeData" :props="treeProps" :expand-on-click-node="false" :default-expanded-keys="treeNodeExpand" :filter-node-method="filterNode" @node-click="treeNodeClick" highlight-current default-expand-all>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-card>
      <el-card class="right">
        <header class="head">目录详情</header>
        <el-form size="small" label-width="80px" ref="form" :model="form" :rules="formRules" v-loading="infoLoading">
          <el-form-item label="目录编码" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="目录名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="上级目录" prop="highLevel">
            <el-cascader v-model="form.parentId" :options="catalogData" :props="cascaderProps" :show-all-levels="false" clearable></el-cascader>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input show-word-limit type="textarea" maxlength="200" v-model="form.description" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resourceSave">保存</el-button>
            <el-button @click="resourceDelete">删除</el-button>
            <el-button @click="resourceCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getResourceCatalog,
  getResourceCatalogInfo,
  addResourceCatalog,
  updateResourceCatalog,
  deleteResourceCatalog,
} from "api/dataResource";

export default {
  name: "dataMenu",
  data() {
    return {
      filterText: "", //左侧资源名称搜索input
      treeProps: {
        label: "name",
        children: "childNodes",
      },
      cascaderProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "childNodes",
        checkStrictly: true,
        emitPath: false,
      },
      resourceTreeData: [], //资源列表树
      treeNodeExpand: [], //树默认展开的节点
      treeLoading: false,
      form: {
        code: "", //目录编码
        name: "", //目录名称
        parentId: "", //上级目录
        description: "", //备注
      }, //基本信息表单
      formRules: {
        code: [{ required: true, message: "请输入目录编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入目录名称", trigger: "blur" }],
        parentId: [
          { required: true, message: "请选择上级目录", trigger: "change" },
        ],
      },
      catalogData: [], //上级目录下拉
      infoLoading: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getResourceTree();
  },
  methods: {
    // 目录展开/折叠
    handleCommand(command) {
      this.$refs.tree.store
        ._getAllNodes()
        .forEach((item) => (item.expanded = command));
    },
    // 树过滤方法
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取目录列表
    getResourceTree(id) {
      this.treeLoading = true;
      getResourceCatalog()
        .then((res) => {
          this.resourceTreeData = this.formatCatalog(res.result);
          this.catalogData = [
            { id: "0001", name: "一级目录", childNodes: this.resourceTreeData },
          ];
          if (id) {
            this.treeNodeExpand = [id];
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(id);
            });
          }
          this.treeLoading = false;
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    // 获取目录详情
    getCatalogInfo(id) {
      this.infoLoading = true;
      getResourceCatalogInfo({ id: id })
        .then((res) => {
          this.form = res.result;
          this.form.state = "edit";
          this.infoLoading = false;
        })
        .catch(() => {
          this.infoLoading = false;
        });
    },
    //树节点点击事件-编辑
    treeNodeClick(data, node) {
      this.$refs.form.resetFields();
      this.getCatalogInfo(data.id);
    },
    // 新增
    resourceAdd() {
      this.$refs.form.resetFields();
      this.$refs.tree.setCurrentKey();
      this.form = { state: "add" };
    },
    // 保存
    resourceSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.state == undefined) {
            this.$message.warning("请选择目录");
          } else if (this.form.state === "add") {
            this.infoLoading = true;
            addResourceCatalog(this.form)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("新增成功");
                  this.getResourceTree(res.result);
                  this.getCatalogInfo(res.result);
                } else {
                  this.infoLoading = false;
                }
              })
              .catch(() => {
                this.infoLoading = false;
              });
          } else {
            // 编辑
            this.infoLoading = true;
            updateResourceCatalog(this.form)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("保存成功");
                  this.getResourceTree(res.result);
                  this.getCatalogInfo(res.result);
                } else {
                  this.infoLoading = false;
                }
              })
              .catch(() => {
                this.infoLoading = false;
              });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    // 删除
    resourceDelete() {
      if (this.form.state === "edit") {
        this.$confirm("是否确认删除资源" + this.form.name + "?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.infoLoading = true;
            deleteResourceCatalog(this.form.id)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("删除成功");
                  this.getResourceTree();
                  this.$refs.form.resetFields();
                  this.form = {};
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
    // 取消
    resourceCancel() {
      this.$refs.form.clearValidate();
      if (this.form.state === "edit") {
        this.getCatalogInfo(this.form.id);
      } else {
        this.$refs.form.resetFields();
      }
    },
    //格式化目录列表: 去掉空的childNodes
    formatCatalog(data) {
      data.forEach((item) => {
        if (item.childNodes.length == 0) {
          delete item.childNodes;
        } else {
          this.formatCatalog(item.childNodes);
        }
      });
      return data;
    },
  },
};
</script>

<style lang="less" scoped>
.dataMenu {
  height: 100%;
  .el-card ::v-deep .el-card__body {
    padding: 0;
  }
  header {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dfe4eb;
    font-size: 16px;
    padding: 0 10px;
  }
  .left {
    float: left;
    width: 20%;
    height: 100%;
    margin-right: 10px;
    header {
      .el-button {
        padding: 2px;
        margin-top: 11px;
      }
      .el-dropdown {
        height: 40px;
        margin-left: 5px;
        .el-dropdown-link {
          cursor: pointer;
          .iconfont {
            font-size: 18px;
            &::before {
              display: inline-block;
              transform: rotate(90deg);
            }
          }
        }
      }
    }
    .el-input {
      margin: 10px 0 0 10px;
      width: calc(100% - 20px);
    }
    .tree {
      height: calc(100% - 92px);
      padding: 10px;
    }
  }
  .right {
    height: 100%;
    .el-form {
      width: 580px;
      margin: 20px auto;
      .el-input,
      .el-cascader,
      .el-textarea {
        width: 500px;
      }
    }
  }
}
</style>