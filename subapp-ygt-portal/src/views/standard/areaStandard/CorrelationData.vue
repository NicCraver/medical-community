<!-- 
  @description 基础平台-标准管理-值域标准-关联数据元
  @date 2021/9/7
 -->
<template>
  <el-dialog :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" class="correlation-data">
    <span slot="title" class="el-dialog__title">
      关联数据元
      <el-button v-show="state && !isEdit" type="text" icon="iconfont icon-edit" @click="isEdit = true"></el-button>
      <el-button v-show="state && !isEdit" type="text" icon="iconfont icon-delete" @click="cancelCorr"></el-button>
    </span>
    <div v-loading="loading">
      <el-row>
        <span class="title fill">数据元标识符：</span>
        <el-autocomplete v-if="isEdit" size="small" v-model="dataElementCode" placeholder="请选择" ref="autocomplete" :fetch-suggestions="querySearch" clearable @clear="autocompClear" value-key="id"></el-autocomplete>
        <span v-else>{{dataElementCode}}</span>
      </el-row>
      <el-row>
        <span class="title">数据元名称：</span>
        <el-input v-if="isEdit" size="small" v-model="dataElementName" disabled></el-input>
        <span v-else>{{dataElementName}}</span>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="!state" type="primary" @click="submit" :disabled="dataElementName === ''">确定</el-button>
      <el-button v-show="state && isEdit" type="primary" @click="submit" :disabled="dataElementName === ''">保存</el-button>
      <el-button v-show="!state" @click="close">取消</el-button>
      <el-button v-show="state" @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  saveDataElementRelation,
  cancelDataElementRelation,
} from "api/standard.js";

export default {
  props: {
    selectData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      isVisible: false,
      dataElementCode: "", //数据元标识符
      dataElementName: "", //数据元名称
      state: false, //是否已经关联数据元
      isEdit: false, //是否在编辑状态
      domainId: "", //值域id
      loading: false,
    };
  },
  watch: {
    dataElementCode(val) {
      let dataElement = this.selectData.filter((item) => item.id === val);
      this.dataElementName = dataElement[0]?.name ?? "";
    },
  },
  methods: {
    open(id, state, code) {
      this.domainId = id;
      this.state = state; //state表示是否已经关联数据元
      this.isEdit = !state;
      if (state) {
        this.dataElementCode = code;
      }
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
      this.dataElementCode = "";
      this.dataElementName = "";
    },
    //确定button click
    submit() {
      saveDataElementRelation({
        valueDomainId: this.domainId,
        dataElementCode: this.dataElementCode,
      }).then((res) => {
        if (res.code == 0) {
          this.$emit("correDataElement");
          this.$message.success("关联数据元保存成功");
          this.close();
        }
      });
    },
    // 取消关联数据元
    cancelCorr() {
      this.$confirm("此操作将取消关联数据元, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          cancelDataElementRelation({
            dataElementCode: this.dataElementCode,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$emit("correDataElement");
                this.$message.success("取消数据元保存成功");
                this.close();
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    //返回输入建议的方法
    querySearch(queryString, cb) {
      let data = this.selectData;
      let results = queryString
        ? data.filter(this.valueFilter(queryString))
        : data;
      cb(results);
    },
    //模糊匹配输入建议
    valueFilter(queryString) {
      return (data) => {
        return data.id.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
      };
    },
    autocompClear() {
      // 在点击由 clearable 属性生成的清空按钮时，主动触发失去焦点，解决‘fetch-suggestions’输入建议不提示的bug
      // document.activeElement获得了DOM中被聚焦的元素
      document.activeElement.blur();
    },
  },
};
</script>
 
<style lang="scss" scoped>
.el-dialog__title .el-button {
  ::v-deep .iconfont {
    font-size: 20px;
  }
}
::v-deep .el-dialog__body {
  height: 250px;
}

.el-row {
  position: relative;
  line-height: 32px;
  margin-bottom: 16px;
  .title {
    display: inline-block;
    width: 120px;
    text-align: right;
    margin-right: 16px;
  }
  .fill::before {
    content: "*";
    position: absolute;
    top: 2px;
    left: 10px;
    color: #ee0c00;
  }
  .el-autocomplete,
  .el-input {
    width: 500px;
  }
}
</style>