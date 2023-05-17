<!--
  @description 采集监控-基础配置-质控方案-引用
  @date 2022/03/21
-->
<template>
  <el-dialog width="520px" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" :show-close="false" :modal="false">
    <div slot="title" class="head">引用</div>
    <el-form ref="form" size="small" label-width="80px" :model="form" :rules="rules" v-loading="loading">
      <el-alert title="基本信息" type="info" :closable="false"></el-alert>
      <el-row>
        <el-col :span="18">
          <el-form-item label="方案名称" prop="schemeName">
            <el-input v-model="form.name" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="发布机构" prop="publishOrgId">
            <el-cascader v-model="form.publishOrgId" :options="publishOrgOptions" :props="{label: 'name',value: 'id',children: 'childNodes',emitPath: false,checkStrictly: true }" disabled></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-alert title="引用规则信息" type="info" :closable="false"></el-alert>
      <el-row>
        <el-col :span="18">
          <el-form-item label="规则类型" prop="type">
            <el-select v-model="form.type">
              <el-option v-for="item in ruleTypeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="规则分级" prop="level">
            <el-select v-model="form.level">
              <el-option v-for="(item, index) in gradeData" :key="index" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <el-form-item label="业务目录" prop="catalog">
            <el-cascader placeholder="角色/业务项目" v-model="form.catalog" :options="catalogOptions" :props="{label: 'name',value: 'id',children: 'childNodes',checkStrictly: true }" filterable clearable></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button size="small" type="primary" @click="save">一键引用</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { quote } from "api/basicConfig";

export default {
  props: {
    ruleGradeData: Array,
    publishOrgOptions: Array,
    catalogOptions: Array,
  },
  data() {
    return {
      isVisible: false,
      form: {
        name: "", //方案名称
        publishOrgId: "",
        type: "0", //规则类型
        level: "全部", //规则分级
        catalog: [],
      },
      rules: {
        type: [
          { required: true, message: "请选择规则类型", trigger: "change" },
        ],
        level: [
          { required: true, message: "请选择规则分级", trigger: "change" },
        ],
      },
      ruleTypeData: [
        { value: "0", label: "全部" },
        ...this.$store.state.ruleConfigTypeData,
      ], //规则类型下拉
      loading: false,
    };
  },
  computed: {
    gradeData() {
      return [{ code: "全部" }, ...this.ruleGradeData];
    },
  },
  methods: {
    // 保存
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          quote({
            ruleLevel: this.form.level == "全部" ? "-1" : this.form.level,
            type: this.form.type,
            roleId: this.form.catalog?.[0] ?? "",
            bizId: this.form.catalog?.[1] ?? "",
          })
            .then(({ code, result, total }) => {
              if (code === 0) {
                this.$emit("quoteSave", { result, total });
                this.$message.success("引用成功");
                this.close();
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$message.warning("缺少必填项内容，无法保存");
        }
      });
    },
    open(data) {
      this.form = data;
      this.isVisible = true;
    },
    close() {
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-dialog__header {
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
.el-form {
  .el-alert {
    color: #101010;
    margin-bottom: 10px;
  }
  .el-form-item {
    margin-bottom: 16px;
    ::v-deep .el-input.is-disabled .el-input__inner {
      color: #919191;
    }
    .el-select,
    .el-cascader {
      width: 100%;
    }
  }
}
::v-deep .el-dialog__footer {
  padding: 10px;
  border-top: 1px solid #e9e9e9;
  margin-top: 100px;
}
</style>