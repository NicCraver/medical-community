<!--
  @description 采集监控-基础配置-质控方案-新增
  @date 2022/03/15
-->
<template>
  <div class="quality-control-add">
    <div class="protitle">{{title}}</div>
    <div class="promain">
      <el-card>
        <el-form ref="form" size="small" label-width="80px" :model="form" :rules="rules" v-loading="loading">
          <el-scrollbar>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="1">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="方案名称" prop="name">
                      <el-input v-model="form.name" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="发布机构" prop="publishOrgId">
                      <el-cascader v-model="form.publishOrgId" :options="publishOrgOptions" :props="{label: 'label',value: 'id',children: 'children',emitPath: false,checkStrictly: true }"></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="方案来源" prop="source">
                      <el-select v-model="form.source">
                        <el-option :value="1" label="内部"></el-option>
                        <el-option :value="2" label="国家标准"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="16">
                    <el-form-item label="方案说明" prop="description">
                      <el-input v-model="form.description" placeholder="请输入对本方案的说明" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="方案状态" prop="enableStatus">
                      <el-switch v-model="form.enableStatus" active-text="开启" inactive-text="关闭" :active-value="1" :inactive-value="0"></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="规则信息" name="2">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="机构范围" prop="orgIds">
                      <!-- :disabled="state==='add'" -->
                      <el-button type="text" @click="addshowChange">查看</el-button>
                      <el-button type="text" v-if="state==='add'" @click="$refs.orgNameEdit.open(form.orgTree)">添加</el-button>
                      <el-button type="text" v-else @click="$refs.orgNameEdit.open(form.orgTree)">编辑</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <el-form-item label="规则设置" style="margin-bottom:0" required></el-form-item>
                <ProTable>
                  <template #header>
                    <el-input size="small" placeholder="规则编号/规则名称" v-model="ruleQueryParams.content" clearable></el-input>
                    <el-select size="small" placeholder="请选择分级" v-model="ruleQueryParams.grade" clearable>
                      <el-option v-for="(item, index) in ruleGradeSelectData" :key="index" :value="item.code"></el-option>
                    </el-select>
                    <el-select size="small" placeholder="规则类型" v-model="ruleQueryParams.type" clearable>
                      <el-option v-for="item in $store.state.ruleConfigTypeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                  </template>
                  <template #actions>
                    <el-button size="small" type="primary" @click="search">搜索</el-button>
                    <el-button size="small" @click="reset">重置</el-button>
                  </template>
                  <template #batchActions>
                    <el-button size="small" icon="iconfont icon-plus" @click="ruleQuote">引用</el-button>
                    <el-button size="small" icon="iconfont icon-delete" @click="ruleDelete">删除</el-button>
                    <div class="tip">
                      <i class="iconfont icon-info-circle-fill"></i>
                      <span>已选择 {{ruleMultipleSelection.length}} 项</span>
                      <el-button type="text" @click="clearSelection">清空</el-button>
                    </div>
                    <div class="ruleTotal">共{{ruleConfigTotal}}条</div>
                  </template>
                  <el-table ref="table" size="small" height="300" :data="ruleConfigList" @selection-change="handleSelectionChange" border stripe>
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="序号" type="index" width="50"></el-table-column>
                    <el-table-column label="规则类型" min-width="100">
                      <template slot-scope="{row}">{{ruleConfigType(row.type)}}</template>
                    </el-table-column>
                    <el-table-column label="规则分级" min-width="100">
                      <template slot-scope="{row}">{{row.ruleLevel=='-1'?'无':row.ruleLevel}}</template>
                    </el-table-column>
                    <el-table-column label="业务目录" prop="roleBizName" min-width="170"></el-table-column>
                    <el-table-column label="规则编号" prop="code" min-width="120"></el-table-column>
                    <el-table-column label="规则名称" prop="name" min-width="180"></el-table-column>
                    <el-table-column label="计算方式" prop="computeMode" min-width="100">
                      <template slot-scope="{row}">{{getComputeMode(row)}}</template>
                    </el-table-column>
                    <el-table-column label="规则权重(%)" prop="ruleWeight" min-width="80" align="center">
                      <template slot-scope="{row}">
                        <el-input v-model="row.ruleWeight" size="mini" :class="{'red': !row.ruleWeight}" @change="ruleWeightChange($event, row.ruleConfigId)"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="80" align="center">
                      <template slot-scope="{row}">
                        <el-button type="text" icon="iconfont icon-delete" @click="ruleDeleteByRow(row.ruleConfigId)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </ProTable>
              </el-collapse-item>
              <el-collapse-item title="得分信息" name="3">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="得分设置" prop="score">
                      <el-radio-group v-model="form.score">
                        <el-radio :label="1">小数</el-radio>
                        <el-tooltip content="质控得分将直接使用质量指数(满分为1 .00), 非满分展示如0.85。" placement="bottom">
                          <i class="iconfont icon-info-circle"></i>
                        </el-tooltip>
                        <el-radio :label="2">整数</el-radio>
                        <el-tooltip content="质控得分将使用质量指数乘以100，如0.85展示为85.00。" placement="bottom">
                          <i class="iconfont icon-info-circle"></i>
                        </el-tooltip>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </el-form>
        <footer>
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button size="small" type="primary" @click="save">确认</el-button>
        </footer>
      </el-card>
    </div>

    <OrgNameEdit ref="orgNameEdit" :orgNameData="orgRangeData" @orgNameSave="orgNameSave"></OrgNameEdit>
    <OrgNameShow ref="orgNameShow"></OrgNameShow>
    <Quote ref="quote" :ruleGradeData="ruleGradeData" :publishOrgOptions="publishOrgOptions" :catalogOptions="catalogOptions" @quoteSave="quoteSave"></Quote>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import OrgNameEdit from "./OrgNameEdit.vue";
import OrgNameShow from "./OrgNameShow.vue";
import Quote from "./Quote.vue";
import { mapGetters } from "vuex";
import {
  getDictList,
  getOrgNames,
  addQualityControl,
  editQualityControl,
  getQualityControlDetail,
  getCatalogSelect,
} from "api/basicConfig";
import { deepClone } from "utils/utils";

export default {
  components: {
    ProTable,
    OrgNameEdit,
    OrgNameShow,
    Quote,
  },
  data() {
    return {
      activeNames: ["1", "2", "3"], //展开的折叠面板
      state: "add",
      title: "新增",
      form: {
        name: "", //方案名称
        publishOrgId: "", //发布机构
        source: 1, //方案来源
        description: "", //方案说明
        enableStatus: 1, //方案状态
        orgIds: [], //机构范围
        score: 1, //得分设置
      },
      rules: {
        name: [{ required: true, message: "请填写方案名称", trigger: "blur" }],
        publishOrgId: [
          { required: true, message: "请选择发布机构", trigger: "change" },
        ],
        enableStatus: [
          { required: true, message: "请选择方案状态", trigger: "change" },
        ],
        score: [
          { required: true, message: "请选择得分设置", trigger: "change" },
        ],
        orgIds: [
          { required: true, message: "请添加机构范围", trigger: "change" },
        ],
      },
      publishOrgOptions: [], //发布机构下拉
      orgRangeData: [], //机构范围data
      ruleQueryParams: {}, //规则设置过滤条件
      ruleGradeData: [], //规则分级
      catalogOptions: [], //业务目录下拉
      ruleGradeSelectData: [], //分级下拉
      ruleConfigList: [], //规则设置-列表数据
      ruleConfigListMap: new Map(), //规则设置-列表数据-原始数据
      ruleMultipleSelection: [], //规则设置-被选中的内容
      ruleConfigTotal: 0, //规则设置-总条数
      loading: false,
    };
  },
  computed: { ...mapGetters(["ruleConfigType"]) },
  mounted() {
    this.state = this.$route.params.state;
    if (this.state == "add") {
      this.title = "新增";
    } else {
      this.title = "编辑";
      // 获取详情
      getQualityControlDetail({ id: this.$route.params.id }).then(
        ({ code, result }) => {
          if (code === 0) {
            this.form = result;
            let rulePlanConfigList = result.rulePlanConfigList.map((item) => ({
              ...item,
              ruleWeight: item.ruleWeight == "-1" ? "--" : item.ruleWeight,
            }));
            this.getRuleConfigListMap(rulePlanConfigList);
            this.ruleConfigList = deepClone(rulePlanConfigList);
            this.ruleConfigTotal = rulePlanConfigList.length;
          }
        }
      );
    }

    // 获取规则分级下拉
    getDictList({ codes: "RULE_LEVEL" }).then(({ code, result }) => {
      if (code === 0) {
        this.ruleGradeData = result;
        this.ruleGradeSelectData = [{ code: "无" }, ...result];
      }
    });
    // 获取业务目录下拉
    getCatalogSelect().then(({ code, result }) => {
      if (code === 0) {
        this.catalogOptions = result;
      }
    });
    // 获取机构范围data
    getOrgNames().then(({ code, result }) => {
      if (code === 0) {
        this.orgRangeData = deepClone(result.treeData);
        this.publishOrgOptions = result.treeData
      }
    });
  },
  methods: {
    addshowChange(){    
      let orgTree = this.form.orgTree;
      let list = [];
      if(this.state==='add' && orgTree && orgTree.length){
        orgTree.forEach(el => {
          if(el.children && el.children.length){
            el.children.forEach(et => {
              et.name = et.label;
              list.push(et)
            })           
          } 
        })      
      }
      let param = this.state==='add'?list:orgTree;
      this.$refs.orgNameShow.open(param)
    },
    // 确认
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let ruleArr = [...this.ruleConfigListMap.values()];
          if (this.form.orgIds.length == 0) {
            this.$message.warning("请添加机构范围");
          } else if (ruleArr.length == 0) {
            this.$message.warning("请引用规则设置");
          } else {
            /* 规则权重校验start */
            let [type1, type2, type3, type4] = [false, false, false, false]; //默认4种规则类型都没有使用权重
            let [sum1, sum2, sum3, sum4] = [0, 0, 0, 0];
            for (let i = 0; i < ruleArr.length; i++) {
              let weight = ruleArr[i].ruleWeight;
              if (!weight) {
                this.$message.warning(`请填写【${ruleArr[i].name}】的规则权重`);
                return;
              } else if (weight !== "--") {
                if (isNaN(weight)) {
                  this.$message.warning(
                    `【${ruleArr[i].name}】的规则权重只能填写‘--’或数字`
                  );
                  return;
                } else if (weight < 0 || weight > 100) {
                  this.$message.warning(
                    `【${ruleArr[i].name}】的规则权重只能填写[0,100]之间的数字`
                  );
                  return;
                } else if (ruleArr[i].type == 1) {
                  type1 = true;
                  sum1 += parseInt(weight);
                } else if (ruleArr[i].type == 2) {
                  type2 = true;
                  sum2 += parseInt(weight);
                } else if (ruleArr[i].type == 3) {
                  type3 = true;
                  sum3 += parseInt(weight);
                } else if (ruleArr[i].type == 4) {
                  type4 = true;
                  sum4 += parseInt(weight);
                }
              } else if (
                (ruleArr[i].type == 1 && type1) ||
                (ruleArr[i].type == 2 && type2) ||
                (ruleArr[i].type == 3 && type3) ||
                (ruleArr[i].type == 4 && type4)
              ) {
                this.$message.warning("同一规则类型需要全部赋予权重");
                return;
              }
            }
            if (type1 && sum1 !== 100) {
              this.$message.warning(
                "【" + this.ruleConfigType(1) + "】权重和应为100"
              );
              return;
            } else if (type2 && sum2 !== 100) {
              this.$message.warning(
                "【" + this.ruleConfigType(2) + "】权重和应为100"
              );
              return;
            } else if (type3 && sum3 !== 100) {
              this.$message.warning(
                "【" + this.ruleConfigType(3) + "】权重和应为100"
              );
              return;
            } else if (type4 && sum4 !== 100) {
              this.$message.warning(
                "【" + this.ruleConfigType(4) + "】权重和应为100"
              );
              return;
            }
            /* 规则权重校验end */
            this.form.rulePlanConfigList = ruleArr;
            this.loading = true;
            // 数据下发新增|编辑
            if (this.state == "add") {
              addQualityControl(this.form)
                .then(({ code }) => {
                  if (code === 0) {
                    this.$message.success("新增成功");
                    this.cancel();
                  }
                  this.loading = false;
                })
                .catch(() => {
                  this.loading = false;
                });
            } else {
              editQualityControl(this.form)
                .then(({ code }) => {
                  if (code === 0) {
                    this.$message.success("编辑成功");
                    this.cancel();
                  }
                  this.loading = false;
                })
                .catch(() => {
                  this.loading = false;
                });
            }
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    // 取消
    cancel() {
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.$router.push({ name: "configQualityControl" });
    },
    // 机构范围编辑保存
    orgNameSave(data, tree) {
      this.form.orgIds = data;
      this.form.orgTree = tree;
    },
    // 规则设置-搜索
    search() {
      let { content, grade, type } = this.ruleQueryParams;
      let arr = [...this.ruleConfigListMap.values()];
      this.ruleConfigList = arr.filter((item) => {
        return (
          (!content ||
            item.code.indexOf(content) !== -1 ||
            item.name.indexOf(content) !== -1) &&
          (!grade ||
            (grade == "无" && item.ruleLevel == -1) ||
            grade == item.ruleLevel) &&
          (!type || type == item.type)
        );
      });
      this.ruleConfigTotal = this.ruleConfigList.length;
    },
    // 规则设置-重置
    reset() {
      this.ruleQueryParams = {};
      this.ruleConfigList = [...this.ruleConfigListMap.values()];
      this.ruleConfigTotal = this.ruleConfigList.length;
    },
    // 规则设置-引用
    ruleQuote() {
      if (this.form.name == "") {
        this.$message.warning("请先填写方案名称");
      } else {
        this.$refs.quote.open({
          name: this.form.name,
          publishOrgId: this.form.publishOrgId,
        });
      }
    },
    // 规则设置-引用保存
    quoteSave({ result, total }) {
      result.forEach((item) => {
        item.ruleWeight = "--";
      });
      this.getRuleConfigListMap(result);
      this.ruleConfigList = deepClone(result);
      this.ruleConfigTotal = total;
    },
    // 设置map
    getRuleConfigListMap(arr) {
      this.ruleConfigListMap = new Map();
      arr.forEach((item) => {
        this.ruleConfigListMap.set(item.ruleConfigId, item);
      });
    },
    // 规则设置-删除
    ruleDelete() {
      if (this.ruleMultipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认删除选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.ruleMultipleSelection.forEach((item) => {
              this.ruleConfigListMap.delete(item.ruleConfigId); //前端删除
            });
            this.search();
          })
          .catch(() => {});
      }
    },
    ruleWeightChange(val, id) {
      this.ruleConfigListMap.get(id).ruleWeight = val;
    },
    // 规则设置-行内删除
    ruleDeleteByRow(id) {
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.ruleConfigListMap.delete(id); //前端删除
          this.search();
        })
        .catch(() => {});
    },
    // 规则设置-清空
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection();
    },
    // 规则设置-table选择项发生变化
    handleSelectionChange(val) {
      this.ruleMultipleSelection = val;
    },
    // 规则设置-计算方式
    getComputeMode(row) {
      row.computeMode = 1;
      return "自动计算";
    },
    //格式化组织名称下拉选项: 去掉空的childNodes 20230215废除
    // formatOrgNames(data) {
    //   data.forEach((item) => {
    //     if (item.childNodes.length == 0) {
    //       delete item.childNodes;
    //     } else {
    //       this.formatOrgNames(item.childNodes);
    //     }
    //   });
    //   return data;
    // },
  },
};
</script>

<style lang="less" scoped>
.quality-control-add {
  height: 100%;
}
.el-card {
  position: relative;
  height: 100%;
  width: 100%;
  .el-form {
    height: calc(100% - 40px);
    .el-form-item {
      margin-bottom: 16px;
      .el-select,
      .el-cascader {
        width: 100%;
      }
    }
    .el-col .el-button--text {
      line-height: 32px;
      padding: 0;
    }
    .el-divider {
      margin: 0;
    }
    .ruleTotal {
      height: 32px;
      line-height: 32px;
      margin-left: 10px;
    }
    .el-table {
      margin-bottom: 10px;
      .el-input-number {
        width: 120px;
        &.red {
          ::v-deep .el-input__inner {
            border: 1px solid #ff5b5c;
          }
        }
      }
      // .el-input {
      //   font-size: 14px;
      //   ::v-deep .el-input__inner {
      //     border: none;
      //     &:focus,
      //     &:hover {
      //       border: 1px solid #134796;
      //     }
      //   }
      //   &.red {
      //     ::v-deep .el-input__inner {
      //       border: 1px solid #ff5b5c;
      //     }
      //   }
      // }
    }
    .el-radio {
      margin-right: 5px;
    }
    .el-tooltip.iconfont {
      color: #446abd;
      margin-right: 30px;
    }
  }
  .el-collapse {
    height: 100%;
    border-top: none;
    .el-collapse-item {
      &:not(.is-active) {
        margin-bottom: 10px;
      }
      ::v-deep .el-collapse-item__header {
        border-bottom: none;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        background-color: #f5f5f5;
        font-weight: 700;
        margin-bottom: 10px;
      }
      ::v-deep .el-collapse-item__wrap {
        border-bottom: none;
        .el-collapse-item__content {
          padding: 0;
        }
      }
    }
  }
  footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    .el-button {
      float: right;
      margin-top: 9px;
      margin-right: 10px;
    }
  }
}
</style>