<!--
  @description 基础配置-规则配置-规则配置编辑
  @date 2022/08/11
-->
<template>
  <el-dialog :width="needTab?'800px':'700px'" :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" :show-close="false" append-to-body>
    <div slot="title" class="head">编辑</div>
    <el-tooltip :content="data.configStr" placement="top" effect="light">
      <div class="config overflow-point">{{data.configStr}}</div>
    </el-tooltip>
    <el-tabs tab-position="left" v-if="needTab" v-model="activeName">
      <el-tab-pane v-for="(field,index) in data.fieldName" :key="index" :label="field" :name="field">
        <el-form size="small" label-width="100px" :model="form[field]">
          <el-form-item :label="data.labelS" prop="successSql">
            <el-input type="textarea" v-model="form[field].successSql" :rows="5"></el-input>
          </el-form-item>
          <el-form-item :label="data.labelF" prop="failSql">
            <el-input type="textarea" v-model="form[field].failSql" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="总条数语句" prop="totalSql">
            <el-input type="textarea" v-model="form[field].totalSql" :rows="5"></el-input>
          </el-form-item>
          <el-button type="text" v-clipboard:copy="copyStr" v-clipboard:success="onCopy" v-clipboard:error="onError">一键复制</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-form ref="form" size="small" label-width="100px" v-else :model="form">
      <el-form-item :label="data.labelS" prop="successSql">
        <el-input type="textarea" v-model="form.successSql" :rows="5"></el-input>
      </el-form-item>
      <el-form-item :label="data.labelF" prop="failSql">
        <el-input type="textarea" v-model="form.failSql" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="总条数语句" prop="totalSql">
        <el-input type="textarea" v-model="form.totalSql" :rows="5"></el-input>
      </el-form-item>
      <el-button type="text" v-clipboard:copy="copyStr" v-clipboard:success="onCopy" v-clipboard:error="onError">一键复制</el-button>
    </el-form>
    <div slot="footer">
      <el-popover placement="bottom-start" title="提示" :width="needTab?'800':'700'" :offset="-10" trigger="manual" v-model="popVisible" :visible-arrow="false">
        <i :class="result.code==0?'el-icon-success':'el-icon-warning'" :style="{color:result.code==0?'#67C23A':'#e29836'}"></i>
        <p>{{result.code==0?'成功提示':'错误提示'}}</p>
        <p>{{result.desc}}</p>
        <div>
          <el-button class="fr" size="small" @click="popVisible=false">收起</el-button>
        </div>
        <el-button slot="reference" type="text" v-show="validBtnShow" @click="popVisible = !popVisible">校验结果</el-button>
      </el-popover>
      <el-button size="small" @click="close">返回</el-button>
      <el-button size="small" @click="valid">校验</el-button>
      <el-button size="small" type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validSql } from "api/basicConfig";

export default {
  data() {
    return {
      isVisible: false,
      validBtnShow: false,
      data: {},
      form: { successSql: "", failSql: "", totalSql: "" },
      result: {},
      popVisible: false,
      needTab: false,
      activeName: "",
    };
  },
  computed: {
    copyStr() {
      if (this.needTab) {
        return (
          this.data.labelS +
          "：" +
          this.form[this.activeName].successSql +
          "\n" +
          this.data.labelF +
          "：" +
          this.form[this.activeName].failSql +
          "\n总条数语句：" +
          this.form[this.activeName].totalSql
        );
      } else {
        return (
          this.data.labelS +
          "：" +
          this.form.successSql +
          "\n" +
          this.data.labelF +
          "：" +
          this.form.failSql +
          "\n总条数语句：" +
          this.form.totalSql
        );
      }
    },
  },
  methods: {
    open(data, type) {
      this.data = data;
      this.needTab = type == 3;
      if (this.needTab) {
        this.activeName = data.fieldName[0];
        this.form = data.fieldMap;
      } else {
        this.form = {
          successSql: data.successSql,
          failSql: data.failSql,
          totalSql: data.totalSql,
        };
      }
      this.isVisible = true;
    },
    close() {
      this.result = {};
      this.validBtnShow = false;
      this.popVisible = false;
      this.isVisible = false;
    },
    // 校验
    valid() {
      let param;
      if (this.needTab) {
        param = this.form[this.activeName];
      } else {
        param = this.form;
      }
      validSql(param).then(({ code, result }) => {
        if (code === 0) {
          this.$message("校验完成");
          this.validBtnShow = true;
          this.result = result;
        }
      });
    },
    // 保存
    save() {
      this.$emit("save", this.data.index, this.form);
      this.$message.success("保存成功");
      this.close();
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
::v-deep .el-dialog__header {
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
::v-deep .el-dialog__footer {
  padding: 10px;
  border-top: 1px solid #e9e9e9;
  .el-button--text {
    float: left;
    text-decoration: underline;
    line-height: 32px;
  }
}
.config {
  height: 32px;
  line-height: 32px;
  background-color: #f5f5f5;
  color: #303133;
  padding: 0 10px;
  margin-bottom: 10px;
}
.el-form .el-button {
  margin-left: 100px;
}
.el-popover {
  i {
    float: left;
    font-size: 20px;
  }
  p {
    margin-left: 30px;
    line-height: 20px;
  }
  div {
    margin-top: 10px;
    height: 32px;
  }
}
</style>