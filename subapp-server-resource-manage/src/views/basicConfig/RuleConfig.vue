<!--
  @description 基础配置-规则配置
  @date 2022/03/07
-->
<template>
  <div class="rule-config">
    <div class="protitle">规则配置</div>
    <div class="promain">
      <el-tabs v-model="activeTabName" @tab-click="tabClick">
        <el-tab-pane label="一致性" name="coherence">
          <Coherence :ruleGradeData="ruleGradeData" :tables="tables" :catalogOptions="catalogOptions" :preview="preview" :filterMethod="filterMethod"></Coherence>
        </el-tab-pane>
        <el-tab-pane :label="proEnv==='heilongjiang'?'合法性':'整合性'" name="integrated">
          <Integrated :ruleGradeData="ruleGradeData" :tables="tables" :catalogOptions="catalogOptions" :preview="preview" :filterMethod="filterMethod"></Integrated>
        </el-tab-pane>
        <el-tab-pane label="完整性" name="integrity">
          <Integrity :ruleGradeData="ruleGradeData" :tables="tables" :catalogOptions="catalogOptions" :preview="preview" :filterMethod="filterMethod"></Integrity>
        </el-tab-pane>
        <el-tab-pane :label="proEnv==='heilongjiang'?'时效性':'及时性'" name="timeliness">
          <Timeliness :ruleGradeData="ruleGradeData" :tables="tables" :catalogOptions="catalogOptions" :preview="preview" :filterMethod="filterMethod"></Timeliness>
        </el-tab-pane>
      </el-tabs>
    </div>

    <Preview ref="preview"></Preview>
  </div>
</template>

<script>
import Coherence from "./ruleConfig/Coherence.vue";
import Integrated from "./ruleConfig/Integrated.vue";
import Integrity from "./ruleConfig/Integrity.vue";
import Timeliness from "./ruleConfig/Timeliness.vue";
import Preview from "./ruleConfig/Preview.vue";
import {
  getDictList,
  getTableField,
  getPreviewSql,
  getCatalogSelect,
} from "api/basicConfig";

export default {
  components: { Coherence, Integrated, Integrity, Timeliness, Preview },
  data() {
    return {
      activeTabName: "coherence", //当前标签页名
      ruleGradeData: [], //规则分级下拉
      tables: [], //表和字段下拉
      catalogOptions: [], //业务目录下拉
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  mounted() {
    // 获取规则分级下拉
    getDictList({ codes: "RULE_LEVEL" }).then(({ code, result }) => {
      if (code === 0) {
        this.ruleGradeData = result;
      }
    });
    // 获取数据库的表和字段
    getTableField().then(({ code, result }) => {
      if (code === 0) {
        this.tables = result;
      }
    });
    // 获取业务目录下拉(编辑)
    getCatalogSelect().then(({ code, result }) => {
      if (code === 0) {
        this.catalogOptions = result;
      }
    });
  },
  methods: {
    tabClick(tab) {},
    // 预览
    preview(param, _this) {
      let name = param.name;
      getPreviewSql(param)
        .then(({ code, result }) => {
          if (code === 0) {
            this.$refs.preview.open({
              name: name,
              ...result,
            });
          }
          _this.loading = false;
        })
        .catch(() => {
          _this.loading = false;
        });
    },
    // 过滤忽略大小写
    filterMethod(node, keyword) {
      return (
        node.text.indexOf(keyword) !== -1 ||
        node.text.toUpperCase().indexOf(keyword.toUpperCase()) !== -1
      );
    },
  },
};
</script>

<style lang="less" scoped>
.promain {
  padding: 0;
}
.rule-config {
  height: 100%;
}
.el-tabs {
  height: 100%;
  width: 100%;
  background-color: #fff;
  ::v-deep .el-tabs__header {
    padding: 0 16px;
    margin: 0;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
    padding: 10px;
    background-color: #f5f5f5;
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>