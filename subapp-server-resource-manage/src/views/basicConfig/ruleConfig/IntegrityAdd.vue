<!--
  @description 基础配置-规则配置-完整性-新增/编辑/查看
  @date 2022/03/09
-->
<template>
  <el-drawer size="50%" :visible.sync="isVisible" :before-close="closeBtnClick">
    <template #title>
      <div class="head">{{stateLabel}}完整性规则</div>
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
            <el-form-item label="" prop="ruleLevel" label-width="0" v-show="form.ruleGrade=='1'">
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
        <el-alert title="业务表" type="info" :closable="false"></el-alert>
        <template v-for="(workt,index) in form.workTables">
          <el-row type="flex" class="work" :gutter="10" :key="index+'work'">
            <el-col :span="15">
              <el-form-item label="业务表名" required>
                <el-select placeholder="请选择表名" v-model="workt.workTable" @change="tableChange($event,index)" filterable>
                  <el-option v-for="item in tables" :key="item.id" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-input size="small" placeholder="业务表名称" v-model="workt.tableName" disabled></el-input>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="1">
              <el-tooltip content="别点啦，我只是图标。" placement="top">
                <IconSvg iconClass="group" width="18" height="18"></IconSvg>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row type="flex" class="work2" :gutter=" 10" :key="index+'field'">
            <el-col :span="20">
              <el-form-item label="字段名" required>
                <el-cascader v-model="workt.fieldName" :options="workt.options" :props="props" :show-all-levels="false" :filter-method="$attrs.filterMethod" filterable clearable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="text" icon="iconfont icon-edit" :style="{color:workt.isEdit?'#F68B17':'#303133'}" @click="editConfig(workt,index)"></el-button>
              <el-button type="text" icon="iconfont icon-plus" v-show="index==form.workTables.length-1" @click="addConfig(index+1)"></el-button>
              <el-button type="text" icon="iconfont icon-close" style="color:#ff5b5c" v-show="index>0" @click="deleteConfig(index)"></el-button>
            </el-col>
          </el-row>
        </template>
        <el-alert title="规则配置" type="info" :closable="false"></el-alert>
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="字段规则" prop="variableRule">
              <el-checkbox v-model="form.variableRule" :true-label="1" :false-label="0">非空</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="时间参数" prop="timeVariable">
              <el-cascader v-model="form.timeVariable" :options="timeOptions" :props="timeParamProps" :filter-method="$attrs.filterMethod" filterable clearable></el-cascader>
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
        type: 3, //规则类型
        enableStatus: 1, //1开启 0关闭
        ruleDescription: "", //规则说明
        workTables: [
          {
            workTable: "", //业务表名
            tableName: "-", //业务表名称
            fieldName: [], //字段名
            options: [], //字段名下拉
          },
        ],
        variableRule: 1, //字段规则
        timeVariable: "", //时间参数
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
        variableRule: [
          { required: true, message: "请选择字段规则", trigger: "change" },
        ],
        timeVariable: [
          { required: true, message: "请选择时间参数", trigger: "change" },
        ],
      },
      props: {
        value: "id",
        label: "id",
        children: "fieldList",
        emitPath: false,
        multiple: true,
        expandTrigger: "hover",
      }, //字段名prop
      catalogProps: {
        value: "id",
        label: "name",
        children: "childNodes",
      }, //业务目录prop
      timeOptions: [], //时间参数下拉
      timeParamProps: {
        value: "id",
        label: "id",
        children: "fieldList",
        emitPath: false,
      }, //时间参数prop
    };
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
            // 业务表
            let arr = [];
            let index;
            let table;
            result.relationTables.forEach((item) => {
              index = arr.findIndex(
                (t) => t.workTable == item.businessTableName
              );
              if (index == -1) {
                table = this.tables.find((t) => t.id == item.businessTableName);
                arr.push({
                  workTable: item.businessTableName,
                  fieldName: [item.businessVariableName],
                  tableName: table.name,
                  options: [table],
                  fieldMap: {},
                  isEdit: false,
                });
              } else {
                arr[index].fieldName.push(item.businessVariableName);
              }
              if (item.customFlg == 1) {
                index = index == -1 ? arr.length - 1 : index;
                arr[index].isEdit = true;
                arr[index].fieldMap[item.businessVariableName] = {
                  successSql: item.successSql,
                  failSql: item.failSql,
                  totalSql: item.totalSql,
                };
              }
            });
            result.workTables = arr;
            //时间参数下拉
            table = this.tables.find(
              (t) => t.id == result.workTables[0].workTable
            );
            this.timeOptions = [table];
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
          let arr = [];
          param.workTables.forEach((t) => {
            t.fieldName.forEach((f) => {
              arr.push({
                businessTableName: t.workTable,
                businessVariableName: f,
                tableRelation: "1",
                successSql: t.isEdit ? t.fieldMap[f].successSql : "",
                failSql: t.isEdit ? t.fieldMap[f].failSql : "",
                totalSql: t.isEdit ? t.fieldMap[f].totalSql : "",
                customFlg:
                  t.isEdit &&
                  t.fieldMap[f].successSql != "" &&
                  t.fieldMap[f].failSql != "" &&
                  t.fieldMap[f].totalSql != ""
                    ? 1
                    : 0,
              });
            });
          });
          param.relationTables = arr;
          delete param.workTables;
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
      this.form.workTables = [];
      this.$nextTick(() => {
        this.form.workTables.push({ workTable: "", fieldName: [] });
      });
      this.isVisible = false;
    },
    // 规则分级 change
    ruleGradeChange(val) {
      this.rules = {
        ...this.rules,
        ruleLevel: [
          {
            required: val == "1",
            message: "请选择规则分级",
            trigger: "change",
          },
        ],
      };
    },
    // 配置-自定义
    editConfig(config, index) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (config.workTable == "" || config.fieldName.length == 0) {
            this.$message.warning("请选择业务表名和字段名");
          } else {
            let data = {
              configStr: `${config.workTable} | ${config.tableName}`,
              index: index,
              labelS: "完整语句",
              labelF: "不完整语句",
              fieldName: config.fieldName,
            };
            //获取规则配置编辑sql
            let param = { ...this.form };
            param.ruleLevel = param.ruleGrade === 0 ? -1 : param.ruleLevel; //-1代表无分级
            delete param.ruleGrade;
            param.roleId = param.catalog[0];
            param.bizId = param.catalog[1];
            delete param.catalog;
            param.relationTables = config.fieldName.map((item) => ({
              businessTableName: config.workTable,
              businessVariableName: item,
              tableRelation: "1",
            }));
            delete param.workTables;
            this.loading = true;
            getConfigEditSql(param)
              .then(({ code, result }) => {
                if (code === 0) {
                  data.fieldMap = {};
                  config.fieldName.forEach((item) => {
                    data.fieldMap[item] = result[item];
                  });
                  data.fieldMap = config.isEdit
                    ? { ...data.fieldMap, ...config.fieldMap }
                    : data.fieldMap;
                  this.$refs.edit.open(data, 3);
                }
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法自定义SQL");
        }
      });
    },
    editConfigSave(index, form) {
      this.$set(this.form.workTables, index, {
        ...this.form.workTables[index],
        fieldMap: form,
        isEdit: true,
      });
    },
    //配置-添加
    addConfig(index) {
      this.form.workTables.splice(index, 0, { workTable: "", fieldName: [] });
    },
    //配置-删除
    deleteConfig(index) {
      this.form.workTables.splice(index, 1);
    },
    // 业务表名 change
    tableChange(val, index) {
      let table = this.tables.find((item) => item.id == val);
      this.form.workTables[index].tableName = table.name;
      this.form.workTables[index].fieldName = [];
      this.$nextTick(() => {
        this.$set(this.form.workTables, index, {
          ...this.form.workTables[index],
          options: [table],
        });
      });
      if (index == 0) {
        this.form.timeVariable = "";
        this.$nextTick(() => {
          this.timeOptions = [table];
        });
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
      .el-button {
        line-height: 32px;
      }
      &.work .el-col,
      &.work2 .el-col {
        background-color: #f5f5f5;
        .el-form-item {
          margin-bottom: 5px;
        }
      }
      &.work .el-col {
        padding-top: 5px;
      }
      &.work2 .el-col {
        margin-bottom: 10px;
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