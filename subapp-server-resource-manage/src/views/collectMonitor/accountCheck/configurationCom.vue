<template>
  <el-dialog v-bind="$attrs" width="520px">
    <template slot="title">
      <div class="head">{{ $attrs.title }}</div>
    </template>
    <div class="configurationCom" v-loading="loading">
      <div class="configurationCom-main">
        <el-form :model="formData" :rules="rules" label-position="left" ref="ruleForm" size="small" class="demo-ruleForm">
          <el-row :gutter="10" class="el-row-class">
            <el-col v-for="(value, key) in formList" :key="key" :span="value.span">
              <el-form-item :label="value.label || ''" :label-width="value.labelWidth" :prop="value.prop" :required="value.required">
                <template v-if="value.type === 'input'">
                  <el-input v-model="formData[value.prop]" :placeholder="value.placeholder" :disabled="value.disabled" clearable @change="changeFuc"></el-input>
                </template>
                <template v-else-if="value.type === 'textarea'">
                  <el-input type="textarea" v-model="formData[value.prop]" show-word-limit :placeholder="value.placeholder" :disabled="value.disabled" :maxlength="value.maxlength" :autosize="value.autosize" clearable @change="changeFuc"></el-input>
                </template>
                <template v-else-if="value.type === 'select'">
                  <el-select v-model="formData[value.prop]" :placeholder="value.placeholder" :disabled="value.disabled" @change="changeFuc(formData[value.prop], value)" clearable :filterable="value.filterable || false" style="width: 100%">
                    <el-option v-for="(item, index) in value.options" :key="index" :label="item[value.optionObj.label]" :value="item[value.optionObj.value]"></el-option>
                  </el-select>
                </template>
                <template v-else-if="value.type === 'switch'">
                  <el-switch v-model="formData[value.prop]" :disabled="value.disabled" active-color="#446ABD" active-text="" inactive-text="">
                  </el-switch>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="configurationCom-footer">
        <el-button size="small" @click="cancelFuc">取消</el-button>
        <el-button size="small" :disabled="this.editData.flag === '1'" type="primary" @click="sureFuc">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { saveDockBizIndicator } from "api/indicator.js";
import { deepClone } from "utils/utils";

export default {
  name: "configurationCom",
  props: {
    editData: {
      type: Object,
      default() {
        return {};
      },
    },
    bizTypeOptions: {
      type: Array,
      default() {
        return [];
      },
    },
    bizTbEnOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,
      isChange: false,
      formList: [
        {
          label: "指标名称",
          labelWidth: "100px",
          prop: "indicatorName",
          type: "input",
          placeholder: "指标名称",
          required: true,
          disabled: this.editData.flag === "1",
          span: 16,
        },
        {
          label: "",
          labelWidth: "0",
          prop: "bizType",
          type: "select",
          placeholder: "业务分类",
          options: this.bizTypeOptions,
          optionObj: {
            label: "name",
            value: "code",
          },
          required: true,
          disabled: this.editData.flag === "1",
          span: 8,
        },
        {
          label: "业务表名",
          labelWidth: "100px",
          prop: "bizTbEn",
          type: "select",
          placeholder: "业务表名",
          filterable: true,
          options: this.bizTbEnOptions,
          optionObj: {
            label: "tableComment",
            value: "tableName",
          },
          required: true,
          disabled: this.editData.flag === "1",
          span: 24,
        },
        {
          label: "计算公式",
          labelWidth: "100px",
          prop: "ruleExpression",
          type: "textarea",
          placeholder: "计算公式",
          required: true,
          disabled: this.editData.flag === "1",
          span: 24,
          autosize: { minRows: 4, maxRows: 6 },
        },
        {
          label: "备注",
          labelWidth: "100px",
          prop: "remark",
          type: "textarea",
          placeholder: "备注",
          required: false,
          disabled: this.editData.flag === "1",
          span: 24,
          autosize: { minRows: 2, maxRows: 4 },
          maxlength: 200,
        },
        {
          label: "状态",
          labelWidth: "100px",
          prop: "status",
          type: "switch",
          placeholder: "状态",
          required: true,
          disabled: this.editData.flag === "1",
          span: 24,
        },
      ],
      rules: {
        indicatorName: [
          {
            required: true,
            message: "请填写指标名称",
            trigger: "blur",
          },
        ],
        bizType: [
          {
            required: true,
            message: "请选择业务分类",
            trigger: "change",
          },
        ],
        bizTbEn: [
          {
            required: true,
            message: "请填写业务表名",
            trigger: "change",
          },
        ],
        ruleExpression: [
          {
            required: true,
            message: "请填写计算公式",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
      },
      formData: {},
    };
  },
  watch: {
    editData: {
      handler(val) {
        this.formData = {
          ...deepClone(val),
          status: val.status === "1",
        };
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
  },
  methods: {
    // 表单有改动
    changeFuc(val, value) {
      this.isChange = true;
      if (value.prop === "bizTbEn") {
        let obj = this.bizTbEnOptions.find((item) => {
          return item[value.optionObj.value] === val;
        });
        this.formData.bizTbCn = obj[value.optionObj.label];
      }
    },
    // 取消
    cancelFuc() {
      if (this.isChange) {
        this.$confirm("您有未保存的记录，确认要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$message.info("取消");
          this.$emit("closeFuc", false);
        });
        return;
      }
      this.$message.info("取消");
      this.$emit("closeFuc", false);
    },
    // 暂存
    sureFuc() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // 授权接口
          this.loading = true;
          try {
            let params = {
              ...this.formData,
              status: this.formData.status ? "1" : "0",
            };
            let { result, code } = await saveDockBizIndicator(params);
            if (code === 0) {
              this.$message.success("操作成功");
              this.$emit("closeFuc", true);
            }
          } catch (error) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog__header {
  padding: 0;
  border-bottom: 1px solid #e9e9e9;
  color: #303133;
  font-size: 16px;
  font-weight: bold;
  font-family: SourceHanSansSC-bold;
}
::v-deep .el-dialog__body {
  padding: 0;
}
.configurationCom {
  height: 450px;
  overflow-y: auto;
  .configurationCom-main {
    height: calc(100% - 53px);
    padding: 20px;
    overflow-y: auto;
  }
  .configurationCom-footer {
    height: 53px;
    padding: 10px;
    border-top: 1px solid #e9e9e9;
    display: flex;
    justify-content: right;
  }
}
</style>>