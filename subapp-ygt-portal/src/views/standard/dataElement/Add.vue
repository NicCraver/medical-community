<!-- 
  @description 基础平台-标准管理-数据元标准-新增/编辑
  @date 2021/9/9
 -->
<template>
  <el-dialog :title="state" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false">
    <el-form label-width="120px" ref="form" size="small" :model="form" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="标准类型" prop="standardType">
            <el-select v-model="form.standardType">
              <el-option v-for="item in standardTypeData" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="标准名称" prop="standardName">
            <el-input v-model="form.standardName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="所属目录" prop="catalog">
            <el-input v-model="form.catalog"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="数据元标识符" prop="dataElementCode">
            <el-input v-model="form.dataElementCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="自定义标识符" prop="customCode">
            <el-input v-model="form.customCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="数据元名称" prop="dataElementName">
            <el-input v-model="form.dataElementName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="定义" prop="defineDesc">
            <el-input v-model="form.defineDesc" type="textarea" placeholder="请输入内容" :rows="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="数据类型" prop="dataType">
            <el-select v-model="form.dataType">
              <el-option v-for="item in $store.state.dataTypeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="表示格式" prop="representationFormat">
            <el-input v-model="form.representationFormat"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="允许值类型" prop="allowValueType">
            <el-select v-model="form.allowValueType">
              <el-option value="1" label="可枚举值域"></el-option>
              <el-option value="2" label="不可枚举值域"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="值域" prop="valueDomainCode">
            <el-select v-model="form.valueDomainCode" filterable placeholder="请选择" :disabled="domainDisabled">
              <el-option v-for="item in domainData" :key="item.code" :value="item.code" :label="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="允许值" prop="allowValue">
            <el-input v-model="form.allowValue" :disabled="domainValueDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="状态" prop="status">
            <el-switch v-model="form.status" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addDataElement, editDataElement } from "api/standard.js";

export default {
  props: {
    standardTypeData: {
      type: Array,
      default() {
        return [];
      },
    }, //标准类型下拉框字典
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
      state: "新增",
      form: {
        standardType: "", //标准类型
        version: "", //版本号
        standardName: "", //标准名称
        catalog: "", //所属目录
        dataElementCode: "", //数据元标识符
        customCode: "", //自定义标识符
        dataElementName: "", //数据元名称
        defineDesc: "", //定义
        dataType: "", //数据类型
        representationFormat: "", //表示格式
        allowValueType: "", //允许值类型
        valueDomainCode: "", //值域名称
        allowValue: "", //允许值
        status: "1", //状态
      },
      rules: {
        standardType: [
          { required: true, message: "请选择标准类型", trigger: "change" },
        ],
        version: [
          {
            pattern: /^[a-zA-Z0-9]+(\.\d{0,2})?$/,
            message: "支持英文、小数点后两位数字输入",
            trigger: "blur",
          },
        ],
        standardName: [
          { required: true, message: "请输入标准名称", trigger: "blur" },
          { max: 50, message: "长度在50个字符内", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
            message: "支持中英文、字母、数字输入",
            trigger: "blur",
          },
        ],
        catalog: [{ max: 50, message: "长度在50个字符内", trigger: "blur" }],
        dataElementCode: [
          { required: true, message: "请输入数据元标识符", trigger: "blur" },
          { max: 20, message: "长度在20个字符内", trigger: "blur" },
        ],
        customCode: [{ max: 20, message: "长度在20个字符内", trigger: "blur" }],
        dataElementName: [
          { required: true, message: "请输入数据元名称", trigger: "blur" },
          { max: 50, message: "长度在50个字符内", trigger: "blur" },
        ],
        defineDesc: [
          { max: 500, message: "长度在500个字符内", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "change" },
        ],
        representationFormat: [
          { required: true, message: "请输入表示格式", trigger: "blur" },
          { max: 20, message: "长度在20个字符内", trigger: "blur" },
        ],
        allowValueType: [
          { required: true, message: "请选择允许值类型", trigger: "change" },
        ],
        allowValue: [
          { max: 500, message: "长度在500个字符内", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    domainValueDisabled() {
      if (
        this.form.allowValueType === "1" &&
        this.form.valueDomainCode !== ""
      ) {
        this.form.allowValue = "";
        return true;
      }
      return false;
    },
    domainDisabled() {
      if (this.form.status === "0") {
        this.form.valueDomainCode = "";
        return true;
      }
      return false;
    },
  },
  methods: {
    open(state, data) {
      this.state = state;
      this.isVisible = true;
      if (state !== "新增") {
        this.$nextTick(() => {
          this.form = data;
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
            addDataElement(this.form).then((res) => {
              if (res.code == 0) {
                this.$emit("addSubmit");
                this.$message.success("保存成功");
                this.close();
              }
            });
          } else {
            editDataElement(this.form).then((res) => {
              if (res.code == 0) {
                this.$emit("addSubmit");
                this.$message.success("保存成功");
                this.close();
              }
            });
          }
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    cancel() {
      this.$confirm("此操作将不保存当前内容并返回上一级, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.close();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.el-col {
  .el-select {
    width: 100%;
  }
}
</style>