<!-- 
  @description 标准管理-交换标准-基础配置
  @date 2021/9/13
 -->
<template>
  <div class="basic-config">
    <div class="protal-title">基础配置</div>
    <el-tabs v-model="activeTabName" @tab-click="tabClick">
      <el-tab-pane label="业务分类" name="work" class="work">
        <el-card class="left">
          <header>
            <span>业务分类树</span>
          </header>
          <div class="tree">
            <el-scrollbar v-loading="workTreeLoading">
              <el-tree ref="workTree" node-key="id" :data="workTreeData" :props="treeProps" :expand-on-click-node="false" :default-expanded-keys="workTreeNodeExpand" highlight-current default-expand-all>
                <span slot-scope="{node}" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button type="text" icon="iconfont icon-plus" v-show="node.level !== 3" @click="workAdd(node)"></el-button>
                    <el-button type="text" icon="iconfont icon-edit" @click="workEdit(node)"></el-button>
                    <el-button type="text" icon="iconfont icon-delete" v-show="node.level !== 1" @click="workDelete(node.data)"></el-button>
                  </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-card>
        <el-card class="right">
          <header>
            <span>基本信息</span>
          </header>
          <el-form label-width="120px" ref="workForm" :model="workForm" :rules="workFormRules" v-loading="workFormLoading">
            <el-form-item label="上级业务名称" prop="parentName">
              <el-input v-model="workForm.parentName" disabled></el-input>
            </el-form-item>
            <el-form-item label="业务分类代码" prop="code">
              <el-input v-model="workForm.code" placeholder="请输入合法代码"></el-input>
            </el-form-item>
            <el-form-item label="业务分类名称" prop="name">
              <el-input v-model="workForm.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="节点" prop="currentNodeLevel">
              <el-select v-model="workForm.currentNodeLevel" disabled>
                <el-option :value="1" label="一级"></el-option>
                <el-option :value="2" label="二级"></el-option>
                <el-option :value="3" label="三级"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="workSave">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="活动分类" name="activity" class="activity">
        <el-card class="left">
          <header>
            <span>活动分类树</span>
          </header>
          <div class="tree">
            <el-scrollbar v-loading="activityTreeLoading">
              <el-tree ref="activityTree" node-key="id" :data="activityTreeData" :props="treeProps" :default-expanded-keys="activityTreeNodeExpand" :expand-on-click-node="false" highlight-current default-expand-all>
                <span slot-scope="{node}" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button type="text" icon="iconfont icon-plus" v-show="node.level !== 3" @click="activityAdd(node)"></el-button>
                    <el-button type="text" icon="iconfont icon-edit" @click="activityEdit(node)"></el-button>
                    <el-button type="text" icon="iconfont icon-delete" v-show="node.level !== 1" @click="activityDelete(node.data)"></el-button>
                  </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-card>
        <el-card class="right">
          <header>
            <span>基本信息</span>
          </header>
          <el-form label-width="120px" ref="activityForm" :model="activityForm" :rules="activityFormRules" v-loading="activityFormLoading">
            <el-form-item label="上级业务名称" prop="parentName">
              <el-input v-model="activityForm.parentName" disabled></el-input>
            </el-form-item>
            <el-form-item label="活动分类代码" prop="code">
              <el-input v-model="activityForm.code" placeholder="请输入合法代码"></el-input>
            </el-form-item>
            <el-form-item label="活动分类名称" prop="name">
              <el-input v-model="activityForm.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="节点" prop="currentNodeLevel">
              <el-select v-model="activityForm.currentNodeLevel" disabled>
                <el-option :value="1" label="一级"></el-option>
                <el-option :value="2" label="二级"></el-option>
                <el-option :value="3" label="三级"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="activitySave">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="字段配置" name="field" class="field">
        <el-card class="left">
          <header>
            <span>模板</span>
          </header>
          <div class="tree">
            <el-scrollbar v-loading="templateTreeLoading">
              <el-tree ref="templateTree" node-key="id" :data="templateTreeData" :props="treeProps" :default-expanded-keys="templateTreeNodeExpand" :expand-on-click-node="false" highlight-current default-expand-all>
                <span slot-scope="{node}" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button type="text" icon="iconfont icon-plus" v-show="node.level !== 3" @click="templateAdd(node)"></el-button>
                    <el-button type="text" icon="iconfont icon-edit" @click="templateEdit(node)"></el-button>
                    <el-button type="text" icon="iconfont icon-delete" v-show="node.level !== 1" @click="templateDelete(node.data)"></el-button>
                  </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-card>
        <!-- 模板信息 -->
        <div v-if="showTemplet" class="templet">
          <el-card class="templet-info right">
            <header>
              <span>模板信息</span>
              <el-button type="primary" @click="showTemplet=false">返回列表</el-button>
            </header>
            <el-form label-width="100px" size="small" ref="templateForm" :model="templateForm" :rules="templateFormRules" v-loading="templateFormLoading">
              <el-form-item label="模板名称" prop="name">
                <el-input v-model="templateForm.name" placeholder="请输入模板名称"></el-input>
              </el-form-item>
              <el-form-item label="父级模板" prop="parentName">
                <el-input v-model="templateForm.parentName" disabled></el-input>
              </el-form-item>
              <el-form-item label="节点" prop="currentNodeLevel">
                <el-select v-model="templateForm.currentNodeLevel" disabled>
                  <el-option label="一级" :value="1"></el-option>
                  <el-option label="二级" :value="2"></el-option>
                  <el-option label="三级" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="templateFormSave">保存</el-button>
                <el-button @click="templateFormCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="templet-list right">
            <header><span>字段列表</span></header>
            <el-row>
              <el-button @click="fieldTempletTableAdd">添加</el-button>
              <el-button @click="fieldTempletTableDel">删除</el-button>
              <span class="tip"><i class="iconfont icon-info-circle-fill"></i>已选择 {{fieldTempletMultipleSelection.length}} 项</span>
            </el-row>
            <div class="table">
              <el-table height="100%" ref="fieldTempletTable" size="small" :data="fieldTempletTableData" @selection-change="fieldTempletTableSelectionChange" stripe border v-loading="templetFieldTableLoading">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="fieldCode" label="字段标识"></el-table-column>
                <el-table-column prop="fieldName" label="字段名称"></el-table-column>
                <el-table-column label="数据类型">
                  <template slot-scope="{row}">{{dataType(row.dataType)}}</template>
                </el-table-column>
                <el-table-column prop="dataLength" label="长度"></el-table-column>
                <el-table-column prop="valueDomainName" label="值域"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="{row}">
                    <el-button type="text" icon="iconfont icon-arrowup" @click="fieldTempletTableMove(row, true)"></el-button>
                    <el-button type="text" icon="iconfont icon-arrowdown" @click="fieldTempletTableMove(row, false)"></el-button>
                    <el-button type="text" icon="iconfont icon-delete" @click="fieldTempletTableRowDel(row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
        <!-- 字段列表 -->
        <el-card v-else class="list right">
          <header>
            <span>字段列表</span>
          </header>
          <!-- 搜索行 -->
          <el-row class="search">
            <el-input placeholder="字段标识/字段名称" size="small" v-model="fieldSearchContent" clearable></el-input>
            <el-button type="primary" @click="fieldSearch">搜索</el-button>
          </el-row>
          <!-- 操作行 -->
          <el-row class="operate">
            <el-button icon="iconfont icon-plus" @click="$refs.fieldAdd.open('新增')">新增</el-button>
            <el-button icon="iconfont icon-edit" @click="fieldEdit">编辑</el-button>
            <el-button icon="iconfont icon-delete" @click="fieldDelete">删除</el-button>
          </el-row>
          <div class="table">
            <el-table height="100%" ref="fieldTable" size="small" v-loading="fieldTableLoading" :data="fieldTableData" :highlight-current-row="true" @row-click="fieldTableRowClick" @selection-change="fieldTableSelectionChange" stripe border>
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="fieldCode" label="字段标识"></el-table-column>
              <el-table-column prop="fieldName" label="字段名称"></el-table-column>
              <el-table-column label="数据类型">
                <template slot-scope="{row}">{{dataType(row.dataType)}}</template>
              </el-table-column>
              <el-table-column prop="dataLength" label="长度"></el-table-column>
              <el-table-column prop="valueDomainName" label="值域"></el-table-column>
            </el-table>
          </div>
          <el-pagination class="fr" layout="total, sizes, prev, pager, next, jumper" :current-page="fieldTableCurrentPage" :page-sizes="[10, 20, 50, 100]" :page-size="fieldTablePageSize" :total="fieldTableTotal" @size-change="fieldTableSizeChange" @current-change="fieldTableCurrentChange">
          </el-pagination>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <field-add ref="fieldAdd" :domainData="domainData" @fieldAddSubmit="getFieldList" @templateFieldAddSubmit="getTemplateField(templateForm.id)"></field-add>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fieldAdd from "./exchangeStandard/BasicConfigAdd.vue";

import {
  getBasicconfigTree,
  getBasicconfigInfo,
  addBasicconfig,
  editBasicconfig,
  deleteBasicconfig,
  getTemplateTree,
  getTemplateInfo,
  addTemplate,
  editTemplate,
  deleteTemplate,
  getFieldData,
  getDomainSelect,
  deleteField,
  deleteTemplateField,
  sortTemplateField,
} from "api/standard.js";

export default {
  components: {
    fieldAdd,
  },
  computed: {
    ...mapGetters(["dataType"]),
  },
  data() {
    return {
      activeTabName: "work", //当前标签页名
      treeProps: {
        label: "name",
        children: "childNodes",
      },
      workTreeData: [], //业务分类树
      workTreeNodeExpand: [], //业务分类树默认展开的节点
      workTreeLoading: false,
      workForm: {
        parentName: "", //上级业务名称
        code: "", //业务分类代码
        name: "", //业务分类名称
        currentNodeLevel: "", //节点
      }, //业务分类-基本信息表单
      workFormRules: {
        code: [
          { required: true, message: "请输入业务分类代码", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入业务分类名称", trigger: "blur" },
        ],
      }, //业务分类-基本信息表单-验证规则
      workFormLoading: false,
      activityTreeData: [], //活动分类树
      activityTreeNodeExpand: [], //活动分类树默认展开的节点
      activityTreeLoading: false,
      activityForm: {
        parentName: "", //上级业务名称
        code: "", //活动分类代码
        name: "", //活动分类名称
        currentNodeLevel: "", //节点
      }, //活动分类-基本信息表单
      activityFormRules: {
        code: [
          { required: true, message: "请输入活动分类代码", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入活动分类名称", trigger: "blur" },
        ],
      }, //活动分类-基本信息表单-验证规则
      activityFormLoading: false,
      templateTreeData: [], //模板树
      templateTreeNodeExpand: [], //模板树默认展开的节点
      templateTreeLoading: false,
      fieldSearchContent: "", //字段配置-字段列表-搜索条件
      fieldTableData: [], //字段配置-字段列表-表格
      fieldMultipleSelection: [], // 字段配置-字段列表-被选中的内容
      fieldTableCurrentPage: 1, // 字段配置-字段列表-当前页
      fieldTablePageSize: 10, // 字段配置-字段列表-每页多少条
      fieldTableLoading: false,
      fieldTableTotal: 0,
      showTemplet: false, //true:模板页面; false:字段列表
      templateForm: {
        name: "", //模板名称
        parentName: "", //父级模板
        currentNodeLevel: "", //节点
      }, // 字段配置-模板信息
      templateFormRules: {
        name: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          { max: 50, message: "长度在50个字符内", trigger: "blur" },
        ],
      }, //字段配置-模板信息-验证规则
      templateFormLoading: false,
      fieldTempletTableData: [], //字段配置-模板-字段列表
      fieldTempletMultipleSelection: [], // 字段配置-字段列表-被选中的内容
      templetFieldTableLoading: false,
      domainData: [], //值域下拉选项
    };
  },
  mounted() {
    // 获取值域下拉选项
    getDomainSelect().then((res) => {
      this.domainData = res.result;
    });
    this.gerWorkTree(); // 获取业务分类树
  },
  methods: {
    tabClick(tab) {
      if (tab.name === "work") {
        this.gerWorkTree();
      } else if (tab.name === "activity") {
        this.getActivityTree();
      } else if (tab.name === "field") {
        this.getFieldList();
        this.getTemplateTree();
      }
    },
    /* 业务分类 */
    // 获取业务分类树
    gerWorkTree(id) {
      this.workTreeLoading = true;
      getBasicconfigTree({ type: "1" })
        .then((res) => {
          if (res.code == 0) {
            this.workTreeData = res.result;
            if (id) {
              this.workTreeNodeExpand = [id];
              this.$nextTick(() => {
                this.$refs.workTree.setCurrentKey(id);
              });
            } else {
              this.workTreeNodeExpand = [];
            }
          }
          this.workTreeLoading = false;
        })
        .catch(() => {
          this.workTreeLoading = false;
        });
    },
    // 获取基本信息
    getWorkInfo(id, level) {
      this.workFormLoading = true;
      getBasicconfigInfo({ id: id })
        .then((res) => {
          if (res.code == 0) {
            this.workForm = res.result;
            this.workForm.state = "edit";
            this.workForm.currentNodeLevel = level;
          }
          this.workFormLoading = false;
        })
        .catch(() => {
          this.workFormLoading = false;
        });
    },
    // 新增
    workAdd(node) {
      let data = node.data;
      this.$refs.workForm.resetFields();
      this.workForm = {
        parentName: data.name,
        code: "",
        name: "",
        currentNodeLevel: node.level + 1,
        state: "add",
        parentId: data.id,
      };
    },
    // 编辑
    workEdit(node) {
      this.$refs.workForm.resetFields();
      this.getWorkInfo(node.data.id, node.level);
    },
    //保存
    workSave() {
      this.$refs.workForm.validate((valid) => {
        if (valid) {
          if (this.workForm.state == undefined) {
            this.$message.warning("请选择业务分类");
          } else if (this.workForm.state === "add") {
            this.workFormLoading = true;
            addBasicconfig({
              type: "1",
              code: this.workForm.code,
              name: this.workForm.name,
              parentId: this.workForm.parentId,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("新增成功");
                  this.gerWorkTree(res.result);
                  this.getWorkInfo(res.result, this.workForm.currentNodeLevel);
                } else {
                  this.workFormLoading = false;
                }
              })
              .catch(() => {
                this.workFormLoading = false;
              });
          } else {
            //编辑
            this.workFormLoading = true;
            editBasicconfig({
              code: this.workForm.code,
              name: this.workForm.name,
              id: this.workForm.id,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("保存成功");
                  this.gerWorkTree(res.result);
                  this.getWorkInfo(res.result, this.workForm.currentNodeLevel);
                } else {
                  this.workFormLoading = false;
                }
              })
              .catch(() => {
                this.workFormLoading = false;
              });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    //删除
    workDelete(data) {
      this.$confirm("是否确认删除该业务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.workFormLoading = true;
          deleteBasicconfig({ id: data.id })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("删除成功");
                this.gerWorkTree();
                this.$refs.workForm.resetFields();
                this.workForm = {};
              }
              this.workFormLoading = false;
            })
            .catch(() => {
              this.workFormLoading = false;
            });
        })
        .catch(() => {});
    },

    /* 活动分类 */
    // 获取活动分类树
    getActivityTree(id) {
      this.activityTreeLoading = true;
      getBasicconfigTree({ type: "2" })
        .then((res) => {
          if (res.code == 0) {
            this.activityTreeData = res.result;
            if (id) {
              this.activityTreeNodeExpand = [id];
              this.$nextTick(() => {
                this.$refs.activityTree.setCurrentKey(id);
              });
            } else {
              this.activityTreeNodeExpand = [];
            }
          }
          this.activityTreeLoading = false;
        })
        .catch(() => {
          this.activityTreeLoading = false;
        });
    },
    // 获取基本信息
    getActivityInfo(id, level) {
      this.activityFormLoading = true;
      getBasicconfigInfo({ id: id })
        .then((res) => {
          if (res.code == 0) {
            this.activityForm = res.result;
            this.activityForm.state = "edit";
            this.activityForm.currentNodeLevel = level;
          }
          this.activityFormLoading = false;
        })
        .catch(() => {
          this.activityFormLoading = false;
        });
    },
    // 新增
    activityAdd(node) {
      let data = node.data;
      this.$refs.activityForm.resetFields();
      this.activityForm = {
        parentName: data.name,
        code: "",
        name: "",
        currentNodeLevel: node.level + 1,
        state: "add",
        parentId: data.id,
      };
    },
    // 编辑
    activityEdit(node) {
      this.$refs.activityForm.resetFields();
      this.getActivityInfo(node.data.id, node.level);
    },
    //保存
    activitySave() {
      this.$refs.activityForm.validate((valid) => {
        if (valid) {
          if (this.activityForm.state == undefined) {
            this.$message.warning("请选择活动分类");
          } else if (this.activityForm.state === "add") {
            this.activityFormLoading = true;
            addBasicconfig({
              type: "2",
              code: this.activityForm.code,
              name: this.activityForm.name,
              parentId: this.activityForm.parentId,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("新增成功");
                  this.getActivityTree(res.result);
                  this.getActivityInfo(
                    res.result,
                    this.activityForm.currentNodeLevel
                  );
                } else {
                  this.activityFormLoading = false;
                }
              })
              .catch(() => {
                this.activityFormLoading = false;
              });
          } else {
            //编辑
            this.activityFormLoading = true;
            editBasicconfig({
              id: this.activityForm.id,
              code: this.activityForm.code,
              name: this.activityForm.name,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("保存成功");
                  this.getActivityTree(res.result);
                  this.getActivityInfo(
                    res.result,
                    this.activityForm.currentNodeLevel
                  );
                } else {
                  this.activityFormLoading = false;
                }
              })
              .catch(() => {
                this.activityFormLoading = false;
              });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    //删除
    activityDelete(data) {
      this.$confirm("是否确认删除该活动?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.activityFormLoading = true;
          deleteBasicconfig({ id: data.id })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("删除成功");
                this.getActivityTree();
                this.$refs.activityForm.resetFields();
                this.activityForm = {};
              }
              this.activityFormLoading = false;
            })
            .catch(() => {
              this.activityFormLoading = false;
            });
        })
        .catch(() => {});
    },

    /* 字段配置 */
    // 获取模板树
    getTemplateTree(id) {
      this.templateTreeLoading = true;
      getTemplateTree()
        .then((res) => {
          if (res.code == 0) {
            this.templateTreeData = res.result;
            if (id) {
              this.templateTreeNodeExpand = [id];
              this.$nextTick(() => {
                this.$refs.templateTree.setCurrentKey(id);
              });
            } else {
              this.templateTreeNodeExpand = [];
            }
          }
          this.templateTreeLoading = false;
        })
        .catch(() => {
          this.templateTreeLoading = false;
        });
    },
    // 模板-新增
    templateAdd(node) {
      let data = node.data;
      this.templateForm = {
        name: "",
        parentName: data.name,
        currentNodeLevel: node.level + 1,
        state: "add",
        parentId: data.id,
      };
      this.fieldTempletTableData = [];
      this.showTemplet = true;
    },
    // 模板-编辑
    templateEdit(node) {
      this.showTemplet = true;
      this.getTemplateInfo(node.data.id, node.level);
      this.getTemplateField(node.data.id);
    },
    // 模板-删除
    templateDelete(data) {
      this.$confirm("是否确认删除模板" + data.name + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTemplate({ id: data.id }).then((res) => {
            if (res.code == 0) {
              this.$message.success("删除成功");
              this.getTemplateTree();
              this.showTemplet = false;
              this.templateForm = [];
              this.fieldTempletTableData = [];
            }
          });
        })
        .catch(() => {});
    },
    // 模板信息-保存
    templateFormSave() {
      this.$refs.templateForm.validate((valid) => {
        if (valid) {
          if (this.templateForm.state == undefined) {
            this.$message.warning("请选择模板");
          } else if (this.templateForm.state === "add") {
            this.templateFormLoading = true;
            addTemplate({
              name: this.templateForm.name,
              parentId: this.templateForm.parentId,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("保存成功，请添加模板字段");
                  this.getTemplateTree(res.result);
                  this.getTemplateInfo(
                    res.result,
                    this.templateForm.currentNodeLevel
                  );
                } else {
                  this.templateFormLoading = false;
                }
              })
              .catch(() => {
                this.templateFormLoading = false;
              });
          } else {
            // 编辑
            this.templateFormLoading = true;
            editTemplate({
              id: this.templateForm.id,
              name: this.templateForm.name,
            })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success("保存成功");
                  this.getTemplateTree(res.result);
                  this.getTemplateInfo(
                    res.result,
                    this.templateForm.currentNodeLevel
                  );
                } else {
                  this.templateFormLoading = false;
                }
              })
              .catch(() => {
                this.templateFormLoading = false;
              });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    // 模板信息-取消
    templateFormCancel() {
      this.showTemplet = false;
      this.templateForm = [];
      this.fieldTempletTableData = [];
    },

    //获取字段列表
    getFieldList() {
      this.fieldTableLoading = true;
      getFieldData({
        content: this.fieldSearchContent,
        pageNum: this.fieldTableCurrentPage,
        pageSize: this.fieldTablePageSize,
      })
        .then((res) => {
          if (res.code == 0) {
            this.fieldTableData = res.result;
            this.fieldTableTotal = res.total;
          }
          this.fieldTableLoading = false;
        })
        .catch(() => {
          this.fieldTableLoading = false;
        });
    },
    // 字段列表-搜索
    fieldSearch() {
      this.fieldTableCurrentPage = 1;
      this.fieldTablePageSize = 10;
      this.getFieldList();
    },
    // 字段列表-编辑
    fieldEdit() {
      if (this.fieldMultipleSelection.length === 1) {
        this.$refs.fieldAdd.open(
          "编辑",
          JSON.parse(JSON.stringify(this.fieldMultipleSelection[0]))
        );
      } else {
        this.$message("请选择一条数据");
      }
    },
    // 字段列表-删除
    fieldDelete() {
      if (this.fieldMultipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认删除选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = [];
            this.fieldMultipleSelection.forEach((item) => {
              param.push(item.fieldId);
            });
            deleteField(param).then((res) => {
              if (res.code == 0) {
                this.getFieldList();
                this.$message.success("删除成功");
              }
            });
          })
          .catch(() => {});
      }
    },
    // 字段列表-table行点击事件
    fieldTableRowClick(row) {
      this.$refs.fieldTable.toggleRowSelection(row);
    },
    // 字段列表-table选择项发生变化事件
    fieldTableSelectionChange(selection) {
      this.fieldMultipleSelection = selection;
    },
    // 字段列表-分页
    fieldTableSizeChange(val) {
      this.fieldTablePageSize = val;
      this.getFieldList();
    },
    fieldTableCurrentChange(val) {
      this.fieldTableCurrentPage = val;
      this.getFieldList();
    },

    // 获取模板信息
    getTemplateInfo(id, level) {
      this.templateFormLoading = true;
      getTemplateInfo({ id: id })
        .then((res) => {
          if (res.code == 0) {
            this.templateForm = res.result;
            this.templateForm.state = "edit";
            this.templateForm.currentNodeLevel = level;
          }
          this.templateFormLoading = false;
        })
        .catch(() => {
          this.templateFormLoading = false;
        });
    },
    // 获取模板字段列表
    getTemplateField(id) {
      this.templetFieldTableLoading = true;
      getFieldData({ templateId: id })
        .then((res) => {
          if (res.code == 0) this.fieldTempletTableData = res.result;
          this.templetFieldTableLoading = false;
        })
        .catch(() => {
          this.templetFieldTableLoading = false;
        });
    },
    // 模板字段列表-添加
    fieldTempletTableAdd() {
      if (this.templateForm.state == "edit") {
        this.$refs.fieldAdd.open("add", "", this.templateForm.id);
      } else {
        this.$message("请先保存新增的模板信息");
      }
    },
    // 模板字段列表-删除
    fieldTempletTableDel() {
      if (this.fieldTempletMultipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认删除选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = [];
            this.fieldTempletMultipleSelection.forEach((item) => {
              param.push(item.relationId);
            });
            this.fieldTempletTableDelete(param);
          })
          .catch(() => {});
      }
    },
    // 模板字段列表-行内删除
    fieldTempletTableRowDel(row) {
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.fieldTempletTableDelete([row.relationId]);
        })
        .catch(() => {});
    },
    // 模板字段列表删除接口
    fieldTempletTableDelete(param) {
      deleteTemplateField(param).then((res) => {
        if (res.code == 0) {
          this.getTemplateField(this.templateForm.id);
          this.$message.success("删除成功");
        }
      });
    },
    // 模板字段列表-上移/下移
    // moveUp true:上移 false:下移
    fieldTempletTableMove(row, moveUp) {
      let o = moveUp ? "上移" : "下移";
      this.$confirm("该数据将" + o + "一行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sortTemplateField({
            relationId: row.relationId,
            moveUp: moveUp,
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.getTemplateField(this.templateForm.id);
            }
          });
        })
        .catch(() => {});
    },
    // 字段配置-模板字段列表-table选择项发生变化事件
    fieldTempletTableSelectionChange(selection) {
      this.fieldTempletMultipleSelection = selection;
    },
  },
};
</script>

<style lang="scss" scoped>
.basic-config {
  height: 100%;
}

.el-tabs {
  height: calc(100% - 50px);
  width: 100%;
  background-color: #fff;
  ::v-deep .el-tabs__header {
    padding: 0 16px;
    margin: 0;
  }
  ::v-deep .el-tabs__item {
    height: 50px;
    line-height: 50px;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 50px);
    padding: 16px;
    background-color: #f5f5f5;
  }
  .el-tab-pane {
    height: 100%;
  }
  header {
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
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
      font-size: 16px;
      border-bottom: 1px solid #dfe4eb;
    }
    .tree {
      height: calc(100% - 50px);
      padding: 10px;
    }
  }
  .right {
    height: 100%;
    header {
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
        font-size: 16px;
        font-weight: 700;
      }
    }
    .el-form {
      padding: 16px;
    }
  }
  .work .right header,
  .activity .right header,
  .field .templet-info header {
    border-bottom: 1px solid #dfe4eb;
  }
  .field {
    .right {
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
      }
      .el-pagination {
        margin: 16px 16px 0 0;
      }
    }
    .list {
      .table {
        height: calc(100% - 146px - 64px);
      }
    }
    .templet {
      height: 100%;
      .templet-info {
        height: 260px;
        margin-bottom: 16px;
        header .el-button {
          margin-left: 16px;
        }
      }
      .templet-list {
        height: calc(100% - 276px);
        .el-row {
          .tip {
            box-sizing: border-box;
            display: inline-block;
            height: 32px;
            line-height: 32px;
            background-color: #e7edf5;
            color: #134796;
            margin-left: 16px;
            width: calc(100% - 146px);
            padding: 0 16px;
            vertical-align: bottom;
            i {
              margin-right: 10px;
            }
          }
        }
        .table {
          height: calc(100% - 114px);
        }
      }
    }
  }
}

.el-input,
.el-select {
  width: 500px;
}
</style>