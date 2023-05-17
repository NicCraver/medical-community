
<!-- 
  @description 数据资源-概览
  @date 2022/2/9
 -->
<template>
  <div class="dataResource">
    <div class="protitle">概览</div>
    <div class="promain">
      <el-card class="left">
        <header>目录列表</header>
        <el-input placeholder="目录名称" v-model="filterText" size="small"></el-input>
        <div class="tree" v-loading="treeLoading">
          <el-scrollbar>
            <el-tree ref="tree" node-key="id" :data="resourceTreeData" :props="treeProps" highlight-current default-expand-all :filter-node-method="filterNode" @node-click="treeNodeClick"></el-tree>
          </el-scrollbar>
        </div>
      </el-card>
      <el-card class="right">
        <header class="head">数据资源</header>
        <div class="query-condition">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-cascader v-model="searchValue.direId" placeholder="目录" size="small" :options="catalogData" :props="cascaderProps" :show-all-levels="false" clearable></el-cascader>
            </el-col>
            <el-col :span="8">
              <el-date-picker size="small" v-model="searchValue.queryTime" type="daterange" start-placeholder="发布开始日期" end-placeholder="发布结束日期" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
            </el-col>
          </el-row>
          <div class="actions">
            <el-button size="small" type="primary" @click="search">搜索</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </div>
        </div>
      </el-card>
      <section v-loading="loading">
        <el-scrollbar v-if="serviceData?.length">
          <div class="service" v-for="item in serviceData" :key="item.id">
            <span class="icon">
              <IconSvg iconClass="database" style="color: #fff" width="20" height="20"></IconSvg>
            </span>
            <span class="name">{{ item.name }}</span>
            <p>发布方：{{ item.publishOrg }}</p>
            <p class="bottom">发布时间：{{ item.publishTime }}</p>
            <!-- <p>调阅：{{ item.read }}</p> -->
            <el-button type="text" class="fr" @click="showDetail(item)">查看</el-button>
          </div>
        </el-scrollbar>
        <div v-else class="empty">
          <el-empty
            :image="require('@/assets/img/empty.png')"
            :image-size="150"
            description="数据资源为空～"
          ></el-empty>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getResourceCatalog, getDatabases } from "api/dataResource.js";
export default {
  name: "dataResource",
  data() {
    return {
      filterText: "", //左侧资源名称搜索input
      treeProps: {
        label: "name",
        children: "childNodes",
      },
      cascaderProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "childNodes",
        checkStrictly: true,
        emitPath: false,
      },
      resourceTreeData: [], //资源列表树
      treeLoading: false,
      serviceTotal: 80, //服务总数
      searchValue: {
        direId: "",
        queryTime: [], //发布日期
      },
      catalogData: [],
      serviceData: [],
      loading: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.searchTree();
    this.search();
  },
  methods: {
    // 树过滤方法
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 查询目录树
    async searchTree() {
      try {
        this.treeLoading = true;
        let { result, code } = await getResourceCatalog();
        if (code === 0) {
          // console.log("目录树", result);
          this.resourceTreeData = result;
          this.catalogData = result;
        }
      } catch (error) {
      } finally {
        this.treeLoading = false;
      }
    },
    // 点击树节点
    treeNodeClick(data, node) {
      this.searchValue.direId = data.id;
    },
    // 查询概览
    async search() {
      try {
        if (this.searchValue.direId) {
          this.$refs.tree.setCurrentKey(this.searchValue.direId);
        } else {
          this.$refs.tree.setCurrentKey(null);
        }
      } catch (error) {}
      try {
        this.loading = true;
        let startDate =
          this.searchValue.queryTime && this.searchValue.queryTime.length
            ? this.searchValue.queryTime[0]
            : "";
        let endDate =
          this.searchValue.queryTime && this.searchValue.queryTime.length
            ? this.searchValue.queryTime[1]
            : "";
        let params = {
          direId: this.searchValue.direId || "",
          startDate,
          endDate,
        };
        let { result, code } = await getDatabases(params);
        if (code === 0) {
          // console.log("数据资源概览", result);
          this.serviceData = result;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 重置
    reset() {
      this.searchValue = {
        direId: "",
        queryTime: [],
      };
      this.search();
    },
    // 查看
    showDetail(row) {
      this.$router.push({
        name: "dataResourceDetail",
        params: { name: row.name, id: row.id },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.dataResource {
  height: 100%;
  .el-card ::v-deep .el-card__body {
    padding: 0;
  }
  header {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dfe4eb;
    font-size: 16px;
    padding: 0 10px;
  }
  .left {
    float: left;
    width: 20%;
    height: 100%;
    margin-right: 10px;
    .el-input {
      margin: 10px 0 0 10px;
      width: calc(100% - 20px);
    }
    .tree {
      height: calc(100% - 82px);
      padding: 10px;
    }
  }
  .right {
    // height: 100%;
    header span {
      font-weight: 400;
    }
    .query-condition {
      display: flex;
      justify-content: space-between;
      margin: 10px;
      .actions {
        display: flex;
      }
    }
  }
  section {
    float: left;
    width: calc(80% - 10px);
    height: calc(100% - 90px);
    padding-top: 10px;
    .empty {
      height: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .service {
      width: 300px;
      // height: 100px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      margin: 0 20px 20px 0;
      border: 1px solid #e7edf5;
      border-radius: 2px;
      float: left;
      padding: 10px;
      .icon {
        float: left;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background-color: #6b73ca;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .name {
        line-height: 26px;
        font-weight: 700;
      }
      p {
        padding-left: 36px;
        line-height: 20px;
      }
      .bottom {
        padding-bottom: 10px;
      }
    }
  }
}
</style>