<!--
  @description 基础配置-规则配置-及时性-新增/编辑/查看
  @date 2022/03/09
-->
<template>
  <el-drawer size="50%" :visible.sync="isVisible" :before-close="closeBtnClick">
    <template #title>
      <div class="head">{{stateLabel}}{{proEnv==='heilongjiang'?'时效性':'及时性'}}规则</div>
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
        <el-row :gutter="10" class="config" v-for="(config, index) in form.configData" :key="index">
          <el-col :span="9">
            <el-tooltip effect="light" :content="config.workField.join('/')" :disabled="config.workField.length==0">
              <el-cascader placeholder="业务表/业务字段" size="small" v-model="config.workField" :options="index==0?tables:configLeftOptions" :props="props" @change="tableConfigChange($event,index)" @focus="cascaderFocus(config.workField)" :disabled="index!=form.configData.length-1" :filter-method="$attrs.filterMethod" filterable></el-cascader>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-input size="small" v-model="config.relation" readonly></el-input>
          </el-col>
          <el-col :span="9">
            <el-tooltip effect="light" :content="config.targetField.join('/')" :disabled="config.targetField.length==0">
              <el-cascader placeholder="目标表/字段" size="small" v-model="config.targetField" :options="tables" :props="props" @change="tableConfigChange($event,index)" @focus="cascaderFocus(config.targetField)" :disabled="index!=form.configData.length-1" :filter-method="$attrs.filterMethod" filterable></el-cascader>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-button type="text" icon="iconfont icon-plus" v-show="index==form.configData.length-1" @click="addConfig(index+1)"></el-button>
            <el-button type="text" icon="iconfont icon-close" style="color:#ff5b5c" v-show="index>0&&index==form.configData.length-1" @click="deleteConfig(index,config)"></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="规则关系" required style="margin-bottom:0"></el-form-item>
        </el-row>
        <el-row :gutter="10" class="config" v-for="(rule,index) in form.ruleRelations" :key="'rule'+index">
          <el-col :span="9">
            <el-tooltip effect="light" :content="rule.workField.join('/')" :disabled="rule.workField.length==0">
              <el-cascader placeholder="业务表/字段" size="small" v-model="rule.workField" :options="fieldNameOptions" :props="props" @change="formulaChange($event, index)" :filter-method="$attrs.filterMethod" filterable></el-cascader>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-select size="small" placeholder="关系" v-model="rule.relation" @change="formulaChange">
              <el-option v-for="r in ruleRelationData" :key="r.value" :value="r.value" :label="r.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="9">
            <el-tooltip effect="light" :content="rule.targetField.join('/')" :disabled="rule.targetField.length==0">
              <el-cascader placeholder="目标表/字段" size="small" v-model="rule.targetField" :options="fieldNameOptions" :props="props" :filter-method="$attrs.filterMethod" @change="formulaChange" filterable></el-cascader>
            </el-tooltip>
          </el-col>
          <el-col :span="3">
            <el-button type="text" icon="iconfont icon-plus" @click="addRule(index+1)"></el-button>
            <el-button type="text" icon="iconfont icon-close" style="color:#ff5b5c" v-show="index>0" @click="deleteRule(index)"></el-button>
            <el-button type="text" icon="iconfont icon-arrowup" v-show="index>0" @click="configUp(rule,index)"></el-button>
            <el-button type="text" icon="iconfont icon-arrowdown" v-show="index<form.ruleRelations.length-1" @click="configDown(rule,index)"></el-button>
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
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="SQL公式" prop="sqlExpression">
              <el-input v-if="state == 'show'" type="textarea" v-model="form.sqlExpression" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
              <el-button v-else type="text" @click="sqlConfig">配置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <footer>
        <el-button size="small" @click="close">返回</el-button>
        <el-button size="small" @click="save('preview')">预览</el-button>
        <el-button size="small" type="primary" @click="save" v-show="state !== 'show'">保存</el-button>
      </footer>
    </div>

    <SqlConfig ref="sql" @sqlEdit="sqlEdit"></SqlConfig>
  </el-drawer>
</template>

<script>
import SqlConfig from "./SqlConfig.vue";
import {
  addRuleConfig,
  editRuleConfig,
  getRuleConfigDetail,
} from "api/basicConfig";

export default {
  components: { SqlConfig },
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
        type: 4, //规则类型
        enableStatus: 1, //1开启 0关闭
        ruleDescription: "", //规则说明
        configData: [{ workField: [], targetField: [], relation: "=" }], //(及时性配置)配置主键
        ruleRelations: [{ workField: [], targetField: [], relation: "" }], //规则关系
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
      configLeftOptions: [], //及时性配置左边下拉
      fieldNameOptions: [], //规则关系字段下拉
      ruleRelationData: [
        { value: 1, label: "=", text: "等于" },
        { value: 2, label: ">", text: "大于" },
        { value: 3, label: "<", text: "小于" },
        { value: 4, label: ">=", text: "大于等于" },
        { value: 5, label: "<=", text: "小于等于" },
      ], //规则关系下拉
      timeParamProps: {
        value: "id",
        label: "id",
        children: "fieldList",
        emitPath: false,
      }, //时间参数prop
      timeOptions: [], //时间参数下拉
      configTable: "", //记录规则配置表名改变前的值
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
            result.ruleGrade = result.ruleLevel === -1 ? 0 : 1;
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
                //及时性配置
                result.configData.push({
                  workField: [
                    item.businessTableName,
                    item.businessVariableName,
                  ],
                  targetField: [item.targetTableName, item.targetVariableName],
                  relation: "=",
                });
              } else {
                //规则关系
                result.ruleRelations.push({
                  workField: [
                    item.businessTableName,
                    item.businessVariableName,
                  ],
                  targetField: [item.targetTableName, item.targetVariableName],
                  relation: item.variableRelation,
                });
              }
            });
            //规则配置左侧下拉
            this.$nextTick(() => {
              this.getConfigLeftOptions();
            });
            //规则关系字段下拉
            result.configData.map((item, index) => {
              this.tableConfigChange(item.workField, index);
              this.tableConfigChange(item.targetField, index);
            });
            //时间参数下拉
            let table = this.tables.find(
              (t) => t.id == result.relationTables[0].businessTableName
            );
            this.timeOptions = table ? [table] : [];
            delete result.relationTables;

            this.form = { ...result };
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
              targetTableName: item.targetField[0],
              targetVariableName: item.targetField[1],
              variableRelation: 1,
              tableRelation: "0",
            };
          });
          let arr2 = param.ruleRelations.map((item) => {
            return {
              businessTableName: item.workField[0] || "",
              businessVariableName: item.workField[1] || "",
              targetTableName: item.targetField[0],
              targetVariableName: item.targetField[1],
              variableRelation: item.relation,
              tableRelation: "1",
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
        { workField: [], targetField: [], relation: "=" },
      ];
      this.form.ruleRelations = [
        { workField: [], targetField: [], relation: "" },
      ];
      this.$nextTick(() => {
        this.fieldNameOptions = [];
      });
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
    // 及时性配置-change
    tableConfigChange(val, index) {
      //把新的表加到规则关系下拉中
      if (val.length > 0) {
        let cTable = val[0];
        let bool =
          this.fieldNameOptions.findIndex((item) => item.id == cTable) === -1;
        if (bool) {
          let t = this.tables.find((item) => item.id == cTable);
          this.fieldNameOptions.push(t);
        }
      }
      //oldvalue从规则关系下拉中去掉
      if (this.configTable) {
        this.deleteFieldNameOption();
      }
      // 及时性配置左侧下拉由前两行决定
      if (index < 2) {
        this.getConfigLeftOptions();
      }
    },
    //oldvalue从规则关系下拉中去掉
    deleteFieldNameOption() {
      let bool =
        this.form.configData.findIndex(
          (item) =>
            item.workField[0] == this.configTable ||
            item.targetField[0] == this.configTable
        ) === -1; //规则配置中是否还有oldtable,如果没有就要删掉
      if (bool) {
        //从规则关系中删掉选择了oldtable的字段
        this.form.ruleRelations.forEach((item) => {
          if (item.workField[0] == this.configTable) {
            item.workField = [];
          } else if (item.targetField[0] == this.configTable) {
            item.targetField = [];
          }
        });
        //从规则配置中删掉oldtable
        this.$nextTick(() => {
          let index = this.fieldNameOptions.findIndex(
            (item) => item.id == this.configTable
          );
          this.fieldNameOptions.splice(index, 1);
        });
      }
    },
    // 获取规则配置左侧下拉
    getConfigLeftOptions() {
      this.configLeftOptions = [];
      let arr = [];
      let data = this.form.configData;
      if (data[0].workField.length > 0) {
        arr.push(data[0].workField[0]);
        this.configLeftOptions.push(
          this.tables.find((item) => item.id == data[0].workField[0])
        );
      }
      if (
        data[0].targetField.length > 0 &&
        !arr.includes(data[0].targetField[0])
      ) {
        arr.push(data[0].targetField[0]);
        this.configLeftOptions.push(
          this.tables.find((item) => item.id == data[0].targetField[0])
        );
      }
      if (
        data.length > 1 &&
        data[1].targetField.length > 0 &&
        !arr.includes(data[1].targetField[0])
      ) {
        this.configLeftOptions.push(
          this.tables.find((item) => item.id == data[1].targetField[0])
        );
      }
    },
    cascaderFocus(val) {
      if (val.length > 0) this.configTable = val[0];
      else this.configTable = "";
    },
    //及时性配置-添加
    addConfig(index) {
      this.form.configData.splice(index, 0, {
        workField: [],
        targetField: [],
        relation: "=",
      });
    },
    //及时性配置-删除
    deleteConfig(index, config) {
      this.form.configData.splice(index, 1);

      if (config.workField.length > 0) {
        this.configTable = config.workField[0];
        this.deleteFieldNameOption();
      }
      if (config.targetField.length > 0) {
        this.configTable = config.targetField[0];
        this.deleteFieldNameOption();
      }
    },
    // 规则关系-添加
    addRule(index) {
      this.form.ruleRelations.splice(index, 0, {
        workField: [],
        targetField: [],
        relation: "",
      });
    },
    // 规则关系-删除
    deleteRule(index) {
      this.form.ruleRelations.splice(index, 1);
      this.formulaChange();
    },
    // 规则关系-上移
    configUp(row, index) {
      this.form.ruleRelations.splice(index, 1);
      this.form.ruleRelations.splice(index - 1, 0, row);
      this.formulaChange(row.workField, index - 1);
    },
    // 规则关系-下移
    configDown(row, index) {
      this.form.ruleRelations.splice(index, 1);
      this.form.ruleRelations.splice(index + 1, 0, row);
      if (index === 0) {
        this.formulaChange(this.form.ruleRelations[0].workField, index);
      } else {
        this.formulaChange();
      }
    },
    //生成规则公式
    formulaChange(val, index) {
      let relationData = this.form.ruleRelations.filter((item) => {
        return (
          item.workField.length > 1 &&
          item.targetField.length > 1 &&
          item.relation
        );
      });
      if (relationData.length == 0) {
        this.form.ruleExpression = "";
      } else {
        let arr = [];
        relationData.forEach((item, index) => {
          let relation = this.ruleRelationData.find(
            (r) => r.value == item.relation
          ).text;
          arr.push(
            `${index + 1}、${index == 0 ? "" : "并且"}${item.workField[0]}表的${
              item.workField[1]
            }字段 ${relation} ${item.targetField[0]}表的${
              item.targetField[1]
            }字段`
          );
        });
        this.form.ruleExpression = arr.join("\n");
      }
      // 时间参数只能选择第一张业务表的字段
      if (index === 0) {
        let table = this.tables.find((t) => t.id == val[0]);
        this.form.timeVariable = "";
        this.$nextTick(() => {
          this.timeOptions = table ? [table] : [];
        });
      }
    },
    // SQL公式配置
    sqlConfig() {
      this.$refs.sql.open({
        name: this.form.name,
        type: "整合性",
        enableStatus: this.form.enableStatus,
        sqlExpression: this.form.sqlExpression,
      });
    },
    sqlEdit(val) {
      this.form.sqlExpression = val;
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
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: auto;
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
      .el-button {
        height: 32px;
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
      ::v-deep .el-input.is-disabled .el-input__inner {
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