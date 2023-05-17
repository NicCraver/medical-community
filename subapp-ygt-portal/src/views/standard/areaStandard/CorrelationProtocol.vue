<!-- 
  @description 基础平台-标准管理-值域标准-关联交换协议
  @date 2021/9/8
 -->
<template>
  <el-dialog :visible.sync="isVisible" :before-close="close" :close-on-click-modal="false" class="correlation-protocol">
    <span slot="title" class="el-dialog__title">
      关联交换协议
      <el-button v-show="state && !isEdit" type="text" icon="iconfont icon-edit" @click="isEdit = true"></el-button>
    </span>
    <el-row>
      <el-col :span="4"><span class="red">*</span>交换标准名称：</el-col>
      <el-col :span="10" :offset="1">
        <el-autocomplete v-if="isEdit" v-model="name" placeholder="请选择" :fetch-suggestions="querySearch" @select="handleSelect" @clear="nameClear" clearable></el-autocomplete>
        <span v-else>{{name}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">标准编码：</el-col>
      <el-col :span="10" :offset="1">
        <el-input v-if="isEdit" v-model="code" disabled></el-input>
        <span v-else>{{code}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">标准版本：</el-col>
      <el-col :span="10" :offset="1">
        <el-input v-if="isEdit" v-model="version" disabled></el-input>
        <span v-else>{{version}}</span>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button v-show="!state" @click="close">取消</el-button>
      <el-button v-show="!state" type="primary" @click="submit" :disabled="name === ''">确定</el-button>
      <el-button v-show="state" @click="close">关闭</el-button>
      <el-button v-show="state && isEdit" type="primary" @click="save" :disabled="name === ''">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      name: "", //交换标准名称
      code: "", //标准编码
      version: "", //标准版本
      data: [],
      state: false, //是否已经关联交换协议
      isEdit: false, //是否在编辑状态
    };
  },
  mounted() {
    this.data = this.load();
  },
  methods: {
    open(state) {
      this.state = state; //state表示是否已经关联交换协议
      this.isEdit = !state;
      if (state) {
        this.getData();
      }
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
      this.name = "";
      this.code = "";
      this.version = "";
    },
    //确定button click
    submit() {
      this.$message({
        offset: 300,
        iconClass: "message-empty",
        customClass: "elmessage-empty",
        dangerouslyUseHTMLString: true,
        message: "<span style='font-size:16px'>提示</span><br>保存成功！<br>",
        onClose: () => {
          this.close();
        },
      });
    },
    //保存button click
    save() {
      this.$message({
        offset: 300,
        iconClass: "message-empty",
        customClass: "elmessage-empty",
        dangerouslyUseHTMLString: true,
        message: "<span style='font-size:16px'>提示</span><br>修改成功！<br>",
      });
    },
    //返回输入建议的方法
    querySearch(queryString, cb) {
      let data = this.data;
      let results = queryString
        ? data.filter(this.valueFilter(queryString))
        : data;
      cb(results);
    },
    //模糊匹配输入建议
    valueFilter(queryString) {
      return (data) => {
        return data.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
      };
    },
    //加载数据元标识符
    load() {
      return [
        { value: "测试1", code: "TEST_1", version: "001" },
        { value: "测试2", code: "TEST_2", version: "002" },
        { value: "测试3", code: "TEST_3", version: "003" },
        { value: "测试4", code: "TEST_4", version: "004" },
        { value: "测试5", code: "TEST_5", version: "005" },
        { value: "测试6", code: "TEST_6", version: "006" },
        { value: "测试7", code: "TEST_7", version: "007" },
      ];
    },
    //加载关联的数据元数据
    getData() {
      this.name = "测试1";
      this.code = "TEST_1";
      this.version = "001";
    },
    //数据元标识符select
    handleSelect(item) {
      this.code = item.code;
      this.version = item.version;
    },
    //在点击由 clearable 属性生成的清空按钮时触发
    nameClear() {
      this.code = "";
      this.version = "";
    },
  },
};
</script>
 
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  height: 250px;
}
.el-row {
  line-height: 40px;
  margin-bottom: 15px;
  color: #000;
  span.red {
    color: #f56c6c;
    margin-right: 4px;
  }
  .el-col:first-of-type {
    text-align: right;
    color: #7f8694;
  }
}
.el-autocomplete {
  width: 100%;
}
.el-dialog__title .el-button {
  padding: 0;
  ::v-deep .iconfont {
    font-size: 20px;
  }
}
</style>