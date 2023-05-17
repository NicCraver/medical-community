<template>
  <el-dialog v-bind="$attrs" :width="isCollapse ? '50%' : 'calc(50% - 250px)'">
    <template slot="title">
      <div class="title-cont">
        <div class="title-cont-left">
          {{ editData.status != "0" ? "编辑" : "配置" }}
        </div>
        <div class="title-cont-right" v-if="isCollapse">
          <i
            class="iconfont"
            :class="{
              'icon-outdent': this.isCollapse ? 'icon-indent' : 'icon-outdent',
            }"
            @click="collapseFuc(isCollapse)"
          >
            <span> 证书KEY</span></i
          >
          <!-- @click="copyFuc" -->
          <el-button
            type="text"
            v-clipboard:copy="formData.certKey"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            >复制</el-button
          >
        </div>
      </div>
    </template>
    <div class="configurationCom" v-loading="loading">
      <div class="configurationCom-left">
        <div class="configurationCom-main">
          <el-form
            :model="formData"
            :rules="rules"
            label-position="left"
            ref="ruleForm"
            size="small"
            class="demo-ruleForm"
          >
            <el-row :gutter="10" class="el-row-class">
              <el-col
                v-for="(value, key) in formList"
                :key="key"
                :span="value.span"
              >
                <el-form-item
                  :label="value.label || ''"
                  :label-width="value.labelWidth"
                  :prop="value.prop"
                  :required="value.required"
                >
                  <template v-if="value.type === 'input'">
                    <el-input
                      v-model="formData[value.prop]"
                      :placeholder="value.placeholder"
                      :disabled="value.disabled"
                      @change="changeFuc"
                    ></el-input>
                  </template>
                  <template v-else-if="value.type === 'textarea'">
                    <el-input
                      type="textarea"
                      v-model="formData[value.prop]"
                      show-word-limit
                      :placeholder="value.placeholder"
                      :disabled="value.disabled"
                      :maxlength="value.maxlength"
                      :autosize="value.autosize"
                      @change="changeFuc"
                    ></el-input>
                  </template>
                  <template v-else-if="value.type === 'button'">
                    <el-button
                      type="text"
                      @click="makeLicensensKey"
                      :disabled="editData.status != 0"
                      >生成</el-button
                    >
                    <el-button type="text" @click="showLicensensKey"
                      >查看</el-button
                    >
                  </template>
                </el-form-item>
              </el-col>
            </el-row></el-form
          >
        </div>
        <div class="configurationCom-table" v-if="isCollapse">
          <el-table
            ref="singleTable"
            highlight-current-row
            border
            stripe
            height="100%"
            :data="tableData"
          >
            <el-table-column
              class="overflow-point"
              v-for="(item, index) in tableColumn"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :fixed="item.fixed"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'timestamp'">
                  {{
                    dayjs(scope.row[item.prop] || "").format(
                      "YYYY-MM-DD HH:mm:ss"
                    )
                  }}
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="configurationCom-footer">
          <el-button size="small" @click="sureFuc('1')">暂存</el-button>
          <el-button size="small" @click="cancelFuc">取消</el-button>
          <el-button size="small" type="primary" @click="sureFuc('2')"
            >配置发布</el-button
          >
        </div>
      </div>
      <div class="configurationCom-right" v-if="isCollapse">
        {{ formData.certKey }}
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  saveDockIpWhiteList,
  getCertKey,
  getWhiteListLog,
} from "api/serviceEmpower.js";

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
  },
  data() {
    return {
      loading: false,
      isCollapse: true,
      isChange: false,
      formList: [
        {
          label: "机构名称",
          labelWidth: "100px",
          prop: "orgDesc",
          type: "input",
          placeholder: "机构名称",
          required: true,
          disabled: true,
          span: 16,
        },
        {
          label: "",
          labelWidth: "0",
          prop: "orgCode",
          type: "input",
          placeholder: "机构编码",
          required: true,
          disabled: true,
          span: 8,
        },
        {
          label: "白名单地址",
          labelWidth: "100px",
          prop: "sIp",
          type: "input",
          placeholder: "白名单地址",
          required: true,
          disabled: false,
          span: 24,
        },
        {
          label: "证书KEY",
          labelWidth: "100px",
          prop: "certKey",
          type: "button",
          placeholder: "证书KEY",
          required: true,
          disabled: false,
          span: 24,
        },
        {
          label: "备注",
          labelWidth: "100px",
          prop: "sDescription",
          type: "textarea",
          placeholder: "备注",
          required: false,
          disabled: false,
          span: 24,
          autosize: { minRows: 2, maxRows: 4 },
          maxlength: 200,
        },
      ],
      rules: {
        orgDesc: [
          {
            required: true,
            message: "",
            trigger: "blur",
          },
        ],
        orgCode: [
          {
            required: true,
            message: "",
            trigger: "blur",
          },
        ],
        sIp: [
          {
            required: true,
            message: "请填写白名单地址",
            trigger: "blur",
          },
        ],
        certKey: [
          {
            required: true,
            message: "请生成证书KEY",
            trigger: "blur",
          },
        ],
      },
      formData: {},
      tableColumn: [
        { prop: "timestamp", label: "操作时间", width: "180" },
        { prop: "operatorName", label: "操作人", width: "100" },
        { prop: "content", label: "操作内容", width: "180" },
      ],
      tableData: [],
    };
  },
  watch: {
    editData: {
      handler(val) {
        this.formData = deepClone(val);
        if (val.status == 0) {
          this.isCollapse = false;
        }
        if (this.editData.sId) {
          this.getWhiteListLog();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
  },
  methods: {
    // 折叠方法
    collapseFuc(flag) {
      this.isCollapse = !flag;
    },
    // 表单有改动
    changeFuc() {
      this.isChange = true;
    },
    // 查询操作日志
    async getWhiteListLog() {
      try {
        let { code, result } = await getWhiteListLog({
          objId: this.editData.sId,
        });
        if (code === 0) {
          console.log("查询操作日志:", result);
          this.tableData = result;
        }
      } catch (error) {}
    },
    // 取消
    cancelFuc() {
      if (this.isChange) {
        this.$confirm("您有未保存的记录，确认要离开吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$message.info("取消配置");
          this.$emit("closeFuc", false);
        });
        return;
      }
      this.$message.info("取消配置");
      this.$emit("closeFuc", false);
    },
    // 暂存
    sureFuc(status) {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // 授权接口
          this.loading = true;
          try {
            let params = {
              ...this.formData,
              status,
            };
            let { result, code } = await saveDockIpWhiteList(params);
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
    // 复制
    copyFuc() {
      let range = document.createRange();
      let referenceNode = document.getElementsByClassName(
        "configurationCom-right"
      )[0];
      range.selectNodeContents(referenceNode);
      let selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("Copy", "false", null);
    },
    // 生成key
    async makeLicensensKey() {
      this.isCollapse = true;
      try {
        let { result, code } = await getCertKey();
        if (code === 0) {
          this.formData.certKey = result;
          this.changeFuc();
        }
      } catch (error) {}
    },
    // 查看key
    showLicensensKey() {
      this.isCollapse = true;
    },
    onCopy() {
      this.$message.success("复制成功");
    },
    onError() {
      this.$message.error("复制失败");
    },
  },
};
</script>

<style lang="less" scoped>
.title-cont {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .title-cont-left {
    width: calc(100% - 35px);
    margin: 10px 10px 10px 2px;
    padding-left: 10px;
    border-left: 3px solid #134796;
  }
  .title-cont-right {
    width: 250px;
    padding-right: 10px;
    border-left: 1px solid #e9e9e9;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .iconfont {
      color: #134796;
      span {
        color: #303133;
      }
    }
  }
}
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .configurationCom-left {
    // width: calc(100% - 250px);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .configurationCom-main {
      height: calc(100% - 203px);
      padding: 10px;
      overflow-y: auto;
    }
    .configurationCom-table {
      height: 150px;
      padding: 10px;
      border-top: 1px solid #e9e9e9;
    }
    .configurationCom-footer {
      height: 53px;
      padding: 10px;
      border-top: 1px solid #e9e9e9;
      display: flex;
      justify-content: right;
    }
  }
  .configurationCom-right {
    width: 250px;
    height: 100%;
    padding: 10px;
    border-left: 1px solid #e9e9e9;
  }
}
</style>>