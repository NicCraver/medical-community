<!--
 * @Author: Nic
 * @Date: 2022-10-18 17:11:13
 * @LastEditTime: 2022-12-28 14:58:48
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-manage-module/src/views/OrganManage/PermissionAdmin/RoleAdmin/components/RootForm.vue
-->
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      :disabled="rootFormState === 'view'"
    >
      <el-form-item label="数据权限:" prop="authId">
        <el-radio-group v-model="ruleForm.authId">
          <el-radio label="3fad093759674f539d5910a29b45ae4c">集团</el-radio>
          <!-- <el-radio label="12e1c7ef650f44ae9ca08fe17ea81c7f">机构</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色名称:" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="定义:">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-switch
          v-model="ruleForm.status"
          :active-text="ruleForm.status ? '开启' : '停用'"
          active-value="Y"
          inactive-value="N"
        ></el-switch>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { onSaveRoleRoot } from "@/api/modules/authority";
export default {
  props: {
    editData: {
      type: Object,
    },
    rootFormState: {
      type: String,
    },
  },
  inject: ["getRootFormFlag", "setRootFormFlag", "onInquire"],
  data() {
    return {
      ruleForm: {
        name: "",
        authId: "3fad093759674f539d5910a29b45ae4c",
        description: "",
        status: "Y",
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        authId: [
          { required: true, message: "请选择数据权限", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    if (this.rootFormState !== "add") {
      this.ruleForm = this.editData;
      console.log(`this.ruleForm`, this.ruleForm);
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            delete this.ruleForm['orgLevel']
            const res = await onSaveRoleRoot(this.ruleForm);
            this.$message.success("修改成功");
            this.setRootFormFlag(false);
            this.onInquire();
            // console.log('res', res)
            // console.log('this.$parent', this.$parent)
          } catch (error) {}
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
