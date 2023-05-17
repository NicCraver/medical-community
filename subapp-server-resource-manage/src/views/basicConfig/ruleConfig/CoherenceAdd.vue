<!--
  @description 基础配置-规则配置-一致性-新增/编辑/查看
  @date 2022/03/08
-->
<template>
  <el-drawer size="50%" :visible.sync="isVisible" :before-close="closeBtnClick">
    <template #title>
      <div class="head">{{stateLabel}}一致性规则</div>
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
          <el-form-item label="一致性配置" label-width="95px" required style="margin-bottom:0"></el-form-item>
        </el-row>
        <div class="infinite-list" v-infinite-scroll="configDataLoad" :infinite-scroll-disabled="configDataShowNum==form.configData.length">
          <el-row :gutter="10" class="config" v-for="(i,index) in configDataShowNum" :key="index">
            <el-col :span="8">
              <el-cascader placeholder="业务表/业务字段" size="small" v-model="form.configData[index].workField" :options="tables" :props="props" :disabled="index!=form.configData.length-1" :filter-method="$attrs.filterMethod" @change="formulaChange($event,index,1)" filterable></el-cascader>
            </el-col>
            <el-col :span="2">
              <el-input size="small" v-model="form.configData[index].relation" readonly></el-input>
            </el-col>
            <el-col :span="7">
              <el-cascader placeholder="字典表/字典字段" size="small" v-model="form.configData[index].dicField" :options="dicTables" :props="props" :disabled="index!=form.configData.length-1" :filter-method="$attrs.filterMethod" @change="formulaChange($event,index,2)" filterable></el-cascader>
            </el-col>
            <el-col :span="4">
              <el-select placeholder="字典名称" size="small" v-model="form.configData[index].dictId" :disabled="index!=form.configData.length-1" filterable>
                <el-option v-for="item in dicTableSelection" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button type="text" icon="iconfont icon-edit" :style="{color:form.configData[index].customFlg&&form.configData[index].customFlg==1?'#F68B17':'#303133'}" @click="editConfig(form.configData[index],index)"></el-button>
              <el-button type="text" icon="iconfont icon-plus" v-show="index==form.configData.length-1" @click="addConfig(index+1)"></el-button>
              <el-button type="text" icon="iconfont icon-close" style="color:#ff5b5c" v-show="index>0&&index==form.configData.length-1" @click="deleteConfig(index)"></el-button>
            </el-col>
          </el-row>
          <p v-if="configDataShowNum!=form.configData.length">加载中...</p>
        </div>
        <!-- <div class="infinite-list">
          <el-row :gutter="10" class="config" v-for="(config, index) in form.configData" :key="index">
            <el-col :span="8">
              <el-cascader placeholder="业务表/业务字段" size="small" v-model="config.workField" :options="tables" :props="props" :disabled="index!=form.configData.length-1" :filter-method="$attrs.filterMethod" @change="formulaChange($event,index,1)" filterable></el-cascader>
            </el-col>
            <el-col :span="2">
              <el-input size="small" v-model="config.relation" readonly></el-input>
            </el-col>
            <el-col :span="7">
              <el-cascader placeholder="字典表/字典字段" size="small" v-model="config.dicField" :options="dicTables" :props="props" :disabled="index!=form.configData.length-1" :filter-method="$attrs.filterMethod" @change="formulaChange($event,index,2)" filterable></el-cascader>
            </el-col>
            <el-col :span="4">
              <el-select placeholder="字典名称" size="small" v-model="config.dictId" :disabled="index!=form.configData.length-1" filterable>
                <el-option v-for="item in dicTableSelection" :key="item.id" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button type="text" icon="iconfont icon-edit" :style="{color:config.customFlg&&config.customFlg==1?'#F68B17':'#303133'}" @click="editConfig(config,index)"></el-button>
              <el-button type="text" icon="iconfont icon-plus" v-show="index==form.configData.length-1" @click="addConfig(index+1)"></el-button>
              <el-button type="text" icon="iconfont icon-close" style="color:#ff5b5c" v-show="index>0&&index==form.configData.length-1" @click="deleteConfig(index)"></el-button>
            </el-col>
          </el-row>
        </div> -->
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
  getDictTables,
  getDictTableSelect,
  addRuleConfig,
  editRuleConfig,
  getRuleConfigDetail,
  getConfigEditSql,
} from "api/basicConfig";
import { getLabelByKey } from "utils/utils";

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
        type: 1, //规则类型
        enableStatus: 1, //1开启 0关闭
        ruleDescription: "", //规则说明
        configData: [
          { workField: [], dicField: [], relation: "=", dictId: "" },
        ], //一致性配置
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
      // configLeftOptions: [], //规则配置左边下拉
      // configRightOptions: [], //规则配置右边下拉
      dicTables: [], //字典表下拉
      dicTableSelection: [], //字典名称的下拉
      configDataShowNum: 0, //在页面中展示的配置数量
    };
  },
  mounted() {
    //获取字典表
    getDictTables().then(({ code, result }) => {
      if (code === 0) {
        this.dicTables = result;
      }
    });
    //获取字典名称下拉
    getDictTableSelect().then(({ code, result }) => {
      if (code === 0) {
        this.dicTableSelection = result;
      }
    });
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
            result.configData = result.relationTables.map((item) => {
              return {
                workField: [item.businessTableName, item.businessVariableName],
                dicField: [item.targetTableName, item.targetVariableName],
                relation: "=",
                dictId: item.dictId,
                successSql: item.successSql,
                failSql: item.failSql,
                totalSql: item.totalSql,
                customFlg: item.customFlg,
              };
            });
            // this.$nextTick(() => {
            //   this.getConfigLeftOptions();
            // });
            //时间参数下拉
            let table = this.tables.find(
              (t) => t.id == result.relationTables[0].businessTableName
            );
            this.timeOptions = [table];
            //规则配置左右下拉
            // this.configLeftOptions = [table];
            // let table2 = this.dicTables.find(
            //   (t) => t.id == result.relationTables[0].targetTableName
            // );
            // this.configRightOptions = [table2];
            delete result.relationTables;
            this.configDataShowNum =
              result.configData.length > 10 ? 10 : result.configData.length;
            this.form = result;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    configDataLoad() {
      let num = this.configDataShowNum + 5;
      this.configDataShowNum =
        this.form.configData.length > num ? num : this.form.configData.length;
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
          param.relationTables = param.configData.map((item) => {
            return {
              businessTableName: item.workField[0],
              businessVariableName: item.workField[1],
              targetTableName: item.dicField[0],
              targetVariableName: item.dicField[1],
              variableRelation: 1,
              dictId: item.dictId,
              tableRelation: "1",
              successSql: item.successSql,
              failSql: item.failSql,
              totalSql: item.totalSql,
              customFlg: item.customFlg, //0:系统自动生成；1:用户自定义
            };
          });
          delete param.configData;
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
        { workField: [], dicField: [], relation: "=", dictId: "" },
      ];
      this.configDataShowNum = 0;
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
    // 一致性配置-自定义
    editConfig(config, index) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (
            config.workField.length == 0 ||
            config.dicField.length == 0 ||
            config.dictId == ""
          ) {
            this.$message.warning("请完善当前行规则配置");
          } else {
            let data = {
              configStr: `${config.workField.join(
                "/"
              )} | = | ${config.dicField.join("/")} | ${getLabelByKey(
                config.dictId,
                this.dicTableSelection,
                "id",
                "name"
              )}`,
              index: index,
              labelS: "一致语句",
              labelF: "不一致语句",
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
              param.relationTables = [
                {
                  businessTableName: config.workField[0],
                  businessVariableName: config.workField[1],
                  targetTableName: config.dicField[0],
                  targetVariableName: config.dicField[1],
                  variableRelation: 1,
                  dictId: config.dictId,
                  tableRelation: "1",
                },
              ];
              delete param.configData;
              this.loading = true;
              getConfigEditSql(param)
                .then(({ code, result }) => {
                  if (code === 0) {
                    result = Object.values(result)[0];
                    data.successSql = result.successSql;
                    data.failSql = result.failSql;
                    (data.totalSql = result.totalSql),
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
      this.$set(this.form.configData, index, {
        ...this.form.configData[index],
        ...form,
        customFlg:
          form.successSql == "" || form.failSql == "" || form.totalSql == ""
            ? 0
            : 1,
      });
    },
    //一致性配置-添加
    addConfig(index) {
      this.form.configData.splice(index, 0, {
        workField: [],
        dicField: [],
        relation: "=",
        dictId: "",
      });
      this.configDataShowNum++;
    },
    //一致性配置-删除
    deleteConfig(index) {
      this.form.configData.splice(index, 1);
      this.formulaChange();
      this.configDataShowNum--;
    },
    // 一致性配置-上移
    // configUp(row, index) {
    //   this.form.configData.splice(index, 1); //删掉当前行
    //   this.form.configData.splice(index - 1, 0, row); //把当前行加到上一行
    //   this.formulaChange(row.workField, index - 1);
    // },
    // 一致性配置-下移
    // configDown(row, index) {
    //   this.form.configData.splice(index, 1); //删掉当前行
    //   this.form.configData.splice(index + 1, 0, row); //把当前行加到下一行
    //   if (index === 0) {
    //     this.formulaChange(this.form.configData[0].workField, index);
    //   } else {
    //     this.formulaChange();
    //   }
    // },
    //生成规则公式
    formulaChange(val, index, type) {
      let config = this.form.configData.filter((item) => {
        return item.workField.length > 0 && item.dicField.length > 0;
      });
      if (config.length == 0) {
        this.form.ruleExpression = "";
      } else {
        let arr = [];
        // 原来的规则公式
        // config.forEach((item) => {
        //   let work = item.workField.join(".");
        //   let dic = item.dicField.join(".");
        //   arr.push(`(${work} = ${dic}) ÷ ${work}`);
        // });
        // this.form.ruleExpression = `(${arr.join(" + ")}) ÷ ${arr.length}`;
        // 2022.6.24改
        config.forEach((item, index) => {
          // arr.push(
          //   `${index + 1}、${index == 0 ? "" : "并且"}${item.workField[0]}表的${
          //     item.workField[1]
          //   }字段 等于 ${item.dicField[0]}表的${item.dicField[1]}字段`
          // );
          // 2022.7.26 去掉并且
          arr.push(
            `${index + 1}、${item.workField[0]}表的${
              item.workField[1]
            }字段 等于 ${item.dicField[0]}表的${item.dicField[1]}字段`
          );
        });
        this.form.ruleExpression = arr.join("\n");
      }
      // 时间参数只能选择第一张业务表的字段
      if (index === 0 && type === 1) {
        let table = this.tables.find((t) => t.id == val[0]);
        this.form.timeVariable = "";
        this.$nextTick(() => {
          this.timeOptions = [table];
        });
        // 2022.7.26: 业务表第二行之后只能选择第一张业务表的字段 20220810去掉这个逻辑
        // this.configLeftOptions = [table];
      }
      // 字典表第二行之后只能选择第一张字典表的字段 20220810去掉这个逻辑
      // if (index === 0 && type === 2) {
      //   let table2 = this.dicTables.find((t) => t.id == val[0]);
      //   this.configRightOptions = [table2];
      // }
      // if (index < 2) {
      //   this.getConfigLeftOptions();
      // }
    },
    // 获取规则配置左侧下拉：业务表只能选择前3张表 20220726去掉这个逻辑
    // getConfigLeftOptions() {
    //   this.configLeftOptions = [];
    //   let arr = [];
    //   let data = this.form.configData;
    //   if (data[0].workField.length > 0) {
    //     arr.push(data[0].workField[0]);
    //     this.configLeftOptions.push(
    //       this.tables.find((item) => item.id == data[0].workField[0])
    //     );
    //   }
    //   if (data[0].dicField.length > 0 && !arr.includes(data[0].dicField[0])) {
    //     arr.push(data[0].dicField[0]);
    //     this.configLeftOptions.push(
    //       this.tables.find((item) => item.id == data[0].dicField[0])
    //     );
    //   }
    //   if (
    //     data.length > 1 &&
    //     data[1].dicField.length > 0 &&
    //     !arr.includes(data[1].dicField[0])
    //   ) {
    //     this.configLeftOptions.push(
    //       this.tables.find((item) => item.id == data[1].dicField[0])
    //     );
    //   }
    // },
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
    height: calc(100%-50px);
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
    .infinite-list {
      overflow-x: hidden;
      overflow-y: auto;
      height: 250px;
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