<!-- 
  @description 标准管理-交换标准-基础配置-字段配置-新增
  @date 2021/9/15
 -->
<template>
  <el-dialog :title="title" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false">
    <el-form label-width="100px" ref="form" size="small" :model="form" :rules="rules">
      <el-form-item :label="state==='exchangeadd' ? '数据元编码' : '字段标识'" prop="fieldCode">
        <el-autocomplete v-if="state.indexOf('add') !== -1" v-model="form.fieldCode" placeholder="请选择" :fetch-suggestions="querySearch" clearable @clear="autocompClear" value-key="fieldCode"></el-autocomplete>
        <el-input v-else v-model="form.fieldCode"></el-input>
      </el-form-item>
      <el-form-item :label="state==='exchangeadd' ? '数据元名称' : '字段名称'" prop="fieldName">
        <el-input v-model="form.fieldName" :disabled="state.indexOf('add') !== -1"></el-input>
      </el-form-item>
      <el-form-item label="字段定义" prop="fieldDefine">
        <el-input v-model="form.fieldDefine" type="textarea" maxlength="200" show-word-limit :disabled="state.indexOf('add') !== -1"></el-input>
      </el-form-item>
      <el-form-item label="数据类型" prop="dataType">
        <el-select v-model="form.dataType" :disabled="state.indexOf('add') !== -1">
          <el-option v-for="item in $store.state.dataTypeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="长度" prop="dataLength">
        <el-input v-model="form.dataLength" :disabled="state.indexOf('add') !== -1"></el-input>
      </el-form-item>
      <el-form-item label="值域" prop="valueDomainCode">
        <el-select v-model="form.valueDomainCode" filterable placeholder="请选择" :disabled="state.indexOf('add') !== -1">
          <el-option v-for="item in domainData" :key="item.code" :value="item.code" :label="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新增日期" prop="createDate" v-show="state !== '新增'">
        <el-input v-model="form.createDate" disabled></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addField,
  editField,
  getFieldData,
  addTemplateField,
  addExchangeField,
} from "api/standard.js";

export default {
  props: {
    domainData: {
      type: Array,
      default() {
        return [];
      },
    }, //值域下拉框字典
  },
  data() {
    return {
      isVisible: false,
      state: "",
      title: "新增",
      form: {
        fieldCode: "", //字段标识
        fieldName: "", //字段名称
        fieldDefine: "", //字段定义
        dataType: "", //数据类型
        dataLength: "", //长度
        valueDomainCode: "", //值域
      },
      rules: {
        fieldCode: [
          { required: true, message: "请输入字段标识", trigger: "change" },
          {
            pattern: /^[a-zA-Z][a-zA-Z_0-9]*$/,
            message: "请输入以字母开头的数字、字母或下划线",
            trigger: "blur",
          },
        ],
        fieldName: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "change" },
        ],
        dataLength: [
          { required: true, message: "请输入长度", trigger: "blur" },
          { max: 20, message: "长度在20个字符内", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        valueDomainCode: [
          { required: true, message: "请选择值域", trigger: "change" },
        ],
      },
      formIdData: [], //已维护的字段标识
      bindId: "", //模板id或交换标准id
    };
  },
  watch: {
    "form.fieldCode"(val) {
      if (this.state.indexOf("add") !== -1) {
        let code = this.formIdData.find((item) => item.fieldCode === val);
        if (code !== undefined) {
          this.form.id = code.fieldId;
          this.form.fieldName = code.fieldName;
          this.form.fieldDefine = code.fieldDefine;
          this.form.dataType = code.dataType;
          this.form.dataLength = code.dataLength;
          this.form.valueDomainCode = code.valueDomainCode;
          this.form.createDate = code.createDate;
        } else {
          this.form.fieldName = "";
          this.form.fieldDefine = "";
          this.form.dataType = "";
          this.form.dataLength = "";
          this.form.valueDomainCode = "";
          this.form.createDate = "";
        }
      }
    },
  },
  methods: {
    open(state, data, id) {
      this.state = state;
      this.title = "新增";
      this.isVisible = true;
      if (state === "编辑") {
        this.title = "编辑";
        this.$nextTick(() => {
          this.form = data;
        });
      } else if (state.indexOf("add") !== -1) {
        // add指从模板中添加字段，只能选择字段标识
        // exchangeadd从交换标准中添加字段
        this.title = "添加";
        this.bindId = id;
        getFieldData().then((res) => {
          this.formIdData = res.result;
        });
      }
    },
    close() {
      this.$refs.form.resetFields();
      this.isVisible = false;
    },
    //保存
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.state === "新增") {
            addField(this.form).then((res) => {
              if (res.code == 0) {
                this.$emit("fieldAddSubmit");
                this.$message.success("保存成功");
                this.close();
              }
            });
          } else if (this.state === "编辑") {
            editField(this.form).then((res) => {
              if (res.code == 0) {
                this.$emit("fieldAddSubmit");
                this.$message.success("保存成功");
                this.close();
              }
            });
          } else if (this.state === "add") {
            // 从模板中添加字段
            addTemplateField({
              templateId: this.bindId,
              fieldId: this.form.id,
            }).then((res) => {
              if (res.code == 0) {
                this.$emit("templateFieldAddSubmit");
                this.$message.success("添加成功");
                this.close();
              }
            });
          } else if (this.state === "exchangeadd") {
            // 从交换标准中添加字段
            addExchangeField({
              exchangeStandardId: this.bindId,
              fieldId: this.form.id,
            }).then((res) => {
              if (res.code == 0) {
                this.$emit("exchangeFieldAddSubmit");
                this.$message.success("添加成功");
                this.close();
              }
            });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    //字段标识返回输入建议的方法
    querySearch(queryString, cb) {
      let data = this.formIdData;
      let results = queryString
        ? data.filter(this.valueFilter(queryString))
        : data;
      cb(results);
    },
    //模糊匹配输入建议
    valueFilter(queryString) {
      return (data) => {
        return (
          data.fieldCode.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    autocompClear() {
      document.activeElement.blur();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input,
.el-textarea,
.el-select,
.el-autocomplete {
  width: 500px;
}
</style>