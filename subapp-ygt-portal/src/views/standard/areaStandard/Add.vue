<!-- 
  @description 基础平台-标准管理-值域标准-新增
  @date 2021/9/7
 -->
<template>
  <el-dialog :title="state" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" class="add">
    <el-form :model="form" :rules="rules" label-width="100px" size="small" ref="form">
      <el-row>
        <el-col :span="10">
          <el-form-item label="标准类型" prop="standardType">
            <el-select v-model="form.standardType">
              <el-option v-for="item in formType" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="标准名称" prop="standardName">
            <el-input v-model="form.standardName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="所属目录" prop="catalog">
            <el-input v-model="form.catalog"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="目录子类" prop="subCatalog">
            <el-input v-model="form.subCatalog"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="值域名称" prop="valueDomainName">
            <el-input v-model="form.valueDomainName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="值域代码" prop="valueDomainCode">
            <el-input v-model="form.valueDomainCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21">
          <el-form-item label="状态" prop="status">
            <el-switch v-model="form.status" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="state === '编辑'">
        <el-col :span="21">
          <el-form-item label="发布日期" prop="publishDate">
            <el-input v-model="form.publishDate" disabled></el-input>
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
import { addAreaTable, updateAreaTable } from "api/standard.js";

export default {
  props: {
    formType: {
      type: Array,
      default() {
        return [];
      },
    },
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
        subCatalog: "", //目录子类
        valueDomainName: "", //值域名称
        valueDomainCode: "", //值域代码
        publishDate: "", //发布日期
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
        catalog: [
          { max: 50, message: "长度在50个字符内", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9]*$/,
            message: "支持中英文、字母、数字输入",
            trigger: "blur",
          },
        ],
        subCatalog: [
          { max: 50, message: "长度在50个字符内", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9]*$/,
            message: "支持中英文、字母、数字输入",
            trigger: "blur",
          },
        ],
        valueDomainName: [
          { required: true, message: "请输入值域名称", trigger: "blur" },
          { max: 50, message: "长度在50个字符内", trigger: "blur" },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/,
            message: "支持中英文字符输入",
            trigger: "blur",
          },
        ],
        valueDomainCode: [
          { required: true, message: "请输入值域代码", trigger: "blur" },
          { max: 50, message: "长度在50个字符内", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    open(state, data) {
      this.state = state;
      this.isVisible = true;
      if (state !== "新增") {
        // 点编辑时在渲染好对话框之后再给表单赋值
        // 如果先赋值，再创建form，表单的初始值是编辑的值
        // 先点编辑再点新建时会显示编辑的值(resetFields不能把表单置空)
        this.$nextTick(() => {
          this.form = data;
        });
      }
    },
    close() {
      this.$refs.form.resetFields();
      this.form = { status: "1" };
      this.isVisible = false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.state === "新增") {
            addAreaTable(this.form).then((res) => {
              if (res.code == 0) {
                this.$emit("areaChange", res.result, true);
                this.$message.success("新增值域表成功");
                this.close();
              }
            });
          } else {
            updateAreaTable(this.form).then((res) => {
              if (res.code == 0) {
                this.$emit("areaChange", res.result);
                this.$message.success("修改值域表成功");
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