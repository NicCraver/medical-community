<!--
  @description 基础配置-规则配置-整合性-新增/编辑/查看
  @date 2022/03/09
-->
<template>
  <el-drawer size="50%" :visible.sync="isVisible" :before-close="closeBtnClick">
    <template #title>
      <div class="head">{{stateLabel}}{{proEnv==='heilongjiang'?'合法性':'整合性'}}规则</div>
    </template>
    <div class="main" v-loading="loading">
      <el-form ref="form" size="small" label-width="80px" :model="form" :rules="rules" :disabled="state=='show'" :validate-on-rule-change="false">
        <el-alert title="基本信息" type="info" :closable="false"></el-alert>
        <el-row class="rule-grade" :gutter="10">
          <el-col>
            <el-form-item label="规则分级" prop="ruleGrade">
              <el-radio-group v-model="form.ruleGrade" @change="ruleGradeChange">
                <el-radio :label="0">无</el-radio>
                <el-radio :label="1">有</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="ruleLevel" label-width="0" v-show="form.ruleGrade===1">
              <el-select placeholder="请选择分级" v-model="form.ruleLevel">
                <el-option v-for="(item, index) in ruleGradeData" :key="index" :value="parseInt(item.code)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="15">
            <el-form-item label="业务目录" prop="catalog">
              <el-cascader placeholder="角色/业务项目" size="small" v-model="form.catalog" :options="catalogOptions" :props="catalogProps" filterable></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="15">
            <el-form-item label="规则名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-select size="small" v-model="form.type" disabled>
              <el-option v-for="item in $store.state.ruleConfigTypeData" :key="item.value" :value="parseInt(item.value)" :label="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-switch v-model="form.enableStatus" active-text="开启" inactive-text="关闭" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="规则说明" prop="ruleDescription">
              <el-input type="textarea" placeholder="请输入内容" v-model="form.ruleDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert title="规则配置" type="info" :closable="false"></el-alert>
        <el-row>
          <el-form-item label="配置主键" required style="margin-bottom:0"></el-form-item>
        </el-row>
        <el-row :gutter="10" class="config" v-for="(config, index) in form.configData" :key="'key'+index">
          <el-col :span="9">
            <el-cascader placeholder="业务表/业务字段" size="small" v-model="config.workField" :options="index==0?tables:configLeftOptions" :props="props" :disabled="index!=form.configData.length-1" :filter-method="$attrs.filterMethod" @change="keyChange($event,index,1)" filterable></el-cascader>
          </el-col>
          <el-col :span="3">
            <el-input size="small" v-model="config.relation" readonly></el-input>
          </el-col>
          <el-col :span="9">
            <el-cascader placeholder="关联表/关联字段" size="small" v-model="config.relateField" :options="index==0?tables:configRightOptions" :props="props" :disabled="index!=form.configData.length-1" @change="keyChange($event,index,2)" :filter-method="$attrs.filterMethod" filterable></el-cascader>
          </el-col>
          <el-col :span="3">
            <el-button type="text" icon="iconfont icon-plus" v-show="index==form.configData.length-1" @click="addKeyConfig(index+1)"></el-button>
            <el-button type="text" icon="iconfont icon-close" style="color:#ff5b5c" v-show="index>0&&index==form.configData.length-1" @click="deleteKeyConfig(index)"></el-button>
          </el-col>
        </el-row>
        <el-row></el-row>
        <el-row>
          <el-form-item label="规则关系" required style="margin-bottom:0"></el-form-item>
        </el-row>
        <el-row :gutter="10" class="config" v-for="(config, index) in form.ruleRelations" :key="'config'+index">
          <el-col :span="9">
            <el-cascader placeholder="业务表/业务字段" size="small" v-model="config.workField" :options="configLeftOptions" :props="props" :disabled="index!=form.ruleRelations.length-1" :filter-method="$attrs.filterMethod" @change="formulaChange()" filterable></el-cascader>
          </el-col>
          <el-col :span="3">
            <el-input size="small" v-model="config.relation" readonly></el-input>
          </el-col>
          <el-col :span="9">
            <el-cascader placeholder="关联表/关联字段" size="small" v-model="config.relateField" :options="configRightOptions" :props="props" :disabled="index!=form.ruleRelations.length-1" @change="formulaChange()" :filter-method="$attrs.filterMethod" filterable></el-cascader>
          </el-col>
          <el-col :span="3">
            <el-button type="text" icon="iconfont icon-edit" :style="{color:config.customFlg&&config.customFlg==1?'#F68B17':'#303133'}" @click="editConfig(config,index)"></el-button>
            <el-button type="text" icon="iconfont icon-plus" v-show="index==form.ruleRelations.length-1" @click="addConfig(index+1)"></el-button>
            <el-button type="text" icon="iconfont icon-close" style="color:#ff5b5c" v-show="index>0&&index==form.ruleRelations.length-1" @click="deleteConfig(index)"></el-button>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="时间参数" prop="timeVariable">
              <el-cascader v-model="form.timeVariable" :options="timeOptions" :props="timeParamProps" :filter-method="$attrs.filterMethod" filterable></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="规则公式" prop="ruleExpression">
              <el-input type="textarea" placeholder="依照规则生成的规则公式" v-model="form.ruleExpression" :autosize="{ minRows: 5, maxRows: 10}" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <footer>
        <el-button size="small" @click="closeBtnClick">返回</el-button>
        <el-button size="small" @click="save('preview')">预览</el-button>
        <el-button size="small" type="primary" @click="save" v-show="state !== 'show'">保存</el-button>
      </footer>
    </div>

    <EditConfig ref="edit" @save="editConfigSave"></EditConfig>
  </el-drawer>
</template>

<script>
import EditConfig from "./EditConfig.vue";
import {
  addRuleConfig,
  editRuleConfig,
  getRuleConfigDetail,
  getConfigEditSql,
} from "api/basicConfig";

export default {
  components: { EditConfig },
  props: {
    ruleGradeData: Array,
    tables: Array,
    catalogOptions: Array,
  },
  data() {
    return {
      isVisible: false,
      state: "add",
      stateLabel: "新增",
      loading: false,
      form: {
        ruleGrade: 0, //规则分级
        ruleLevel: 0, //规则等级
        catalog: [], //业务目录
        name: "", //规则名称
        type: 2, //规则类型
        enableStatus: 1, //1开启 0关闭
        ruleDescription: "", //规则说明
        configData: [{ workField: [], relateField: [], relation: "=" }], //配置主键
        ruleRelations: [{ workField: [], relateField: [], relation: "=" }], //规则关系
        timeVariable: "", //时间参数
        ruleExpression: "", //规则公式
        sqlExpression: "",
      },
      rules: {
        ruleGrade: [
          { required: true, message: "请选择规则分级", trigger: "change" },
        ],
        catalog: [
          { required: true, message: "请选择业务目录", trigger: "change" },
        ],
        name: [{ required: true, message: "请填写规则名称", trigger: "blur" }],
        timeVariable: [
          { required: true, message: "请选择时间参数", trigger: "change" },
        ],
      },
      props: {
        value: "id",
        label: "id",
        children: "fieldList",
      },
      catalogProps: {
        value: "id",
        label: "name",
        children: "childNodes",
      }, //业务目录prop
      timeParamProps: {
        value: "id",
        label: "id",
        children: "fieldList",
        emitPath: false,
      }, //时间参数prop
      timeOptions: [], //时间参数下拉
      configLeftOptions: [], //规则配置左边下拉
      configRightOptions: [], //规则配置右边下拉
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  methods: {
    // state: add edit show
    open(state, id) {
      if (state === "add") {
        this.stateLabel = "新增";
      } else if (state === "edit") {
        this.stateLabel = "编辑";
        this.getDetail(id);
      } else {
        this.stateLabel = "查看";
        this.getDetail(id);
      }
      this.state = state;
      this.isVisible = true;
    },
    // 获取详情
    getDetail(id) {
      this.loading = true;
      getRuleConfigDetail({ id: id })
        .then(({ code, result }) => {
          if (code === 0) {
            if (result.ruleLevel === -1) {
              result.ruleGrade = 0;
              result.ruleLevel = 0;
            } else {
              result.ruleGrade = 1;
            }
            result.catalog = [result.roleId, result.bizId];
            delete result.roleId;
            delete result.bizId;
            result.configData = [];
            result.ruleRelations = [];
            result.relationTables.forEach((item) => {
              if (item.tableRelation == 0) {
                //配置主键
                result.configData.push({
                  workField: [
                    item.businessTableName,
                    item.businessVariableName,
                  ],
                  relateField: [item.targetTableName, item.targetVariableName],
                  relation: "=",
                });
              } else {
                //规则关系
                result.ruleRelations.push({
                  workField: [
                    item.businessTableName,
                    item.businessVariableName,
                  ],
                  relateField: [item.targetTableName, item.targetVariableName],
                  relation: "=",
                  successSql: item.successSql,
                  failSql: item.failSql,
                  totalSql: item.totalSql,
                  customFlg: item.customFlg,
                });
              }
            });

            //时间参数下拉
            let table = this.tables.find(
              (t) => t.id == result.relationTables[0].businessTableName
            );
            this.timeOptions = [table];
            //规则配置左右下拉
            this.configLeftOptions = [table];
            let table2 = this.tables.find(
              (t) => t.id == result.relationTables[0].targetTableName
            );
            this.configRightOptions = [table2];
            delete result.relationTables;

            this.form = result;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    save(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let param = { ...this.form };
          param.ruleLevel = param.ruleGrade === 0 ? -1 : param.ruleLevel; //-1代表无分级
          delete param.ruleGrade;
          param.roleId = param.catalog[0];
          param.bizId = param.catalog[1];
          delete param.catalog;
          let arr1 = param.configData.map((item) => {
            return {
              businessTableName: item.workField[0] || "",
              businessVariableName: item.workField[1] || "",
              targetTableName: item.relateField[0],
              targetVariableName: item.relateField[1],
              variableRelation: 1,
              tableRelation: "0",
            };
          });
          let arr2 = param.ruleRelations.map((item) => {
            return {
              businessTableName: item.workField[0] || "",
              businessVariableName: item.workField[1] || "",
              targetTableName: item.relateField[0],
              targetVariableName: item.relateField[1],
              variableRelation: 1,
              tableRelation: "1",
              successSql: item.successSql,
              failSql: item.failSql,
              totalSql: item.totalSql,
              customFlg: item.customFlg, //0:系统自动生成；1:用户自定义
            };
          });
          param.relationTables = [...arr1, ...arr2];
          delete param.configData;
          delete param.ruleRelations;
          this.loading = true;
          if (type == "preview") {
            this.$attrs.preview(param, this);
          } else if (this.state === "add") {
            addRuleConfig(param)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success("新增成功");
                  this.$emit("save");
                  this.close();
                }
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else if (this.state === "edit") {
            editRuleConfig(param)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success("编辑成功");
                  this.$emit("save");
                  this.close();
                }
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    closeBtnClick() {
      if (this.state === "show") {
        this.close();
      } else {
        this.$confirm("您有未保存的记录，确认要离开吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.close();
          })
          .catch(() => {});
      }
    },
    close() {
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.form.configData = [
        { workField: [], relateField: [], relation: "=" },
      ];
      this.form.ruleRelations = [
        { workField: [], relateField: [], relation: "=" },
      ];
      this.isVisible = false;
    },
    // 规则分级 change
    ruleGradeChange(val) {
      this.rules = {
        ...this.rules,
        ruleLevel: [
          {
            required: val === 1,
            message: "请选择规则分级",
            trigger: "change",
          },
        ],
      };
    },
    //配置主键添加
    addKeyConfig(index) {
      this.form.configData.splice(index, 0, {
        workField: [],
        relateField: [],
        relation: "=",
      });
    },
    //配置主键删除
    deleteKeyConfig(index) {
      this.form.configData.splice(index, 1);
    },
    // 整合性配置-自定义
    editConfig(config, index) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (config.workField.length == 0 || config.relateField.length == 0) {
            this.$message.warning("请完善当前行规则配置");
          } else {
            let data = {
              configStr: `${config.workField.join(
                "/"
              )} | = | ${config.relateField.join("/")}`,
              index: index,
              labelS: "可对照语句",
              labelF: "不可对照语句",
            };
            if (config.customFlg && config.customFlg == 1) {
              data.successSql = config.successSql;
              data.failSql = config.failSql;
              data.totalSql = config.totalSql;
              this.$refs.edit.open(data);
            } else {
              //获取规则配置编辑sql
              let param = { ...this.form };
              param.ruleLevel = param.ruleGrade === 0 ? -1 : param.ruleLevel; //-1代表无分级
              delete param.ruleGrade;
              param.roleId = param.catalog[0];
              param.bizId = param.catalog[1];
              delete param.catalog;
              let arr1 = param.configData.map((item) => {
                return {
                  businessTableName: item.workField[0] || "",
                  businessVariableName: item.workField[1] || "",
                  targetTableName: item.relateField[0],
                  targetVariableName: item.relateField[1],
                  variableRelation: 1,
                  tableRelation: "0",
                };
              });
              param.relationTables = [
                ...arr1,
                {
                  businessTableName: config.workField[0],
                  businessVariableName: config.workField[1],
                  targetTableName: config.relateField[0],
                  targetVariableName: config.relateField[1],
                  variableRelation: 1,
                  tableRelation: "1",
                },
              ];
              delete param.configData;
              delete param.ruleRelations;
              this.loading = true;
              getConfigEditSql(param)
                .then(({ code, result }) => {
                  if (code === 0) {
                    result = Object.values(result)[0];
                    data.successSql = result.successSql;
                    data.failSql = result.failSql;
                    data.totalSql = result.totalSql;
                    this.$refs.edit.open(data);
                  }
                  this.loading = false;
                })
                .catch(() => {
                  this.loading = false;
                });
            }
          }
        } else {
          this.$message.warning("缺少必填项内容，无法自定义SQL");
        }
      });
    },
    editConfigSave(index, form) {
      this.$set(this.form.ruleRelations, index, {
        ...this.form.ruleRelations[index],
        ...form,
        customFlg:
          form.successSql == "" || form.failSql == "" || form.totalSql == ""
            ? 0
            : 1,
      });
    },
    //配置添加
    addConfig(index) {
      this.form.ruleRelations.splice(index, 0, {
        workField: [],
        relateField: [],
        relation: "=",
      });
    },
    //配置删除
    deleteConfig(index) {
      this.form.ruleRelations.splice(index, 1);
      this.formulaChange();
    },
    // 配置主键change
    keyChange(val, index, type) {
      if (index === 0) {
        this.form.ruleRelations = [
          { workField: [], relateField: [], relation: "=" },
        ];
        this.formulaChange();
        if (type === 1) {
          // 时间参数只能选择第一张业务表的字段
          let table = this.tables.find((t) => t.id == val[0]);
          this.form.timeVariable = "";
          this.$nextTick(() => {
            this.timeOptions = table ? [table] : [];
            //业务表第二行之后只能选择第一张业务表的字段
            this.configLeftOptions = [table];
          });
        } else {
          // 关联表第二行之后只能选择第一张关联表的字段
          let table2 = this.tables.find((t) => t.id == val[0]);
          this.$nextTick(() => {
            this.configRightOptions = [table2];
          });
        }
      }
    },
    //生成规则公式
    formulaChange() {
      let config = this.form.ruleRelations.filter((item) => {
        return item.workField.length > 0 && item.relateField.length > 0;
      });
      if (config.length == 0) {
        this.form.ruleExpression = "";
      } else {
        let arr = [];
        config.forEach((item, index) => {
          arr.push(
            `${index + 1}、${item.workField[0]}表的${
              item.workField[1]
            }字段 等于 ${item.relateField[0]}表的${item.relateField[1]}字段`
          );
        });
        this.form.ruleExpression = arr.join("\n");
      }
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-drawer__header {
  padding: 5px 10px 5px 0;
  margin-bottom: 0;
  border-bottom: 1px solid #e9e9e9;
  color: #303133;
}
::v-deep .el-drawer__body {
  overflow: hidden;
}
.main {
  position: relative;
  height: 100%;
  .el-form {
    .el-alert {
      color: #101010;
      margin-bottom: 10px;
    }
    .el-row {
      padding: 0 10px;
      .el-form-item {
        margin-bottom: 16px;
      }
      .el-select,
      .el-cascader {
        width: 100%;
      }
      .el-switch {
        height: 32px;
        ::v-deep .el-switch__label--left {
          margin-right: 5px;
        }
        ::v-deep .el-switch__label--right {
          margin-left: 5px;
        }
      }
      ::v-deep .el-input.is-disabled .el-input__inner,
      ::v-deep .el-textarea.is-disabled .el-textarea__inner {
        color: #303133;
      }
    }
    .rule-grade {
      .el-form-item {
        display: inline-block;
        margin-right: 16px;
        .el-select {
          width: 120px;
        }
      }
    }
    .config {
      margin-bottom: 16px;
      span {
        line-height: 32px;
      }
      .el-button--text {
        line-height: 32px;
      }
    }
  }
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    border-top: 1px solid #e9e9e9;
    .el-button {
      float: right;
      margin-top: 9px;
      &:first-child {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
</style>