<!-- 
  @description 服务资源-概览
  @date 2022/1/27
 -->
<template>
  <div class="overview">
    <div class="protitle">概览</div>
    <div class="promain">
      <el-card class="left">
        <header>
          <span>目录列表</span>
          <el-dropdown class="fr" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="iconfont icon-ellipsis"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="true">展开全部</el-dropdown-item>
              <el-dropdown-item :command="false">折叠全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </header>
        <el-input placeholder="目录名称" v-model="filterText" size="small"></el-input>
        <div class="tree" v-loading="treeLoading">
          <el-scrollbar>
            <el-tree ref="tree" node-key="id" :data="resourceTreeData" :props="treeProps" :expand-on-click-node="false" :default-expanded-keys="treeNodeExpand" :filter-node-method="filterNode" @node-click="treeNodeClick" highlight-current default-expand-all></el-tree>
          </el-scrollbar>
        </div>
      </el-card>
      <el-card class="right">
        <header class="head">服务资源
          <span class="fr">服务总数 {{serviceTotal}}</span>
        </header>
        <div class="query-condition">
          <div class="query">
            <el-cascader size="small" placeholder="目录名称" v-model="catalog" :options="catalogData" :props="cascaderProps" :show-all-levels="false" clearable></el-cascader>
            <el-select size="small" placeholder="状态" v-model="queryStatus" clearable>
              <el-option v-for="item in statusData" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
            <el-date-picker size="small" v-model="queryTime" type="daterange" start-placeholder="发布开始日期" end-placeholder="发布结束日期" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
          </div>
          <div class="actions">
            <el-button size="small" type="primary" @click="search">搜索</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </div>
        </div>
      </el-card>
      <section v-loading="mainLoading">
        <el-scrollbar v-if="serviceData?.length">
          <div style="padding:0 10px">
            <el-row :gutter="20">
              <el-col :span="6" v-for="item in serviceData" :key="item.id">
                <div class="service" :style="getServiceColor(item.status)">
                  <span class="icon">
                    <el-image :src="require('img/service/service.png')"></el-image>
                  </span>
                  <span class="name">{{item.name}}</span>
                  <p>发布方：{{item.publishOrg}}</p>
                  <p>发布时间：{{item.publishTime | showDate}}</p>
                  <p>状态：{{getStatus(item.status)}}</p>
                  <p>调阅：{{item.callNum}}</p>
                  <el-button type="text" @click="showDetail(item)">查看</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-scrollbar>
        <div v-else class="empty">
          <el-empty
            :image="require('@/assets/img/empty.png')"
            :image-size="150"
            description="服务资源为空～"
          ></el-empty>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getCatalog, getOverviewService } from "api/serviceResource";

export default {
  data() {
    return {
      mainLoading: false,
      filterText: "", //左侧资源名称搜索input
      treeProps: {
        label: "name",
        children: "childNodes",
      },
      resourceTreeData: [], //资源列表树
      treeNodeExpand: [], //树默认展开的节点
      treeLoading: false,
      serviceTotal: 0, //服务总数
      catalog: "", //目录名称
      catalogData: [], //所属目录下拉
      cascaderProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "childNodes",
        checkStrictly: true,
        emitPath: false,
      },
      queryStatus: "", //状态
      statusData: [
        { value: 1, label: "已发布" },
        { value: 2, label: "暂存" },
        { value: 3, label: "停用" },
        { value: 4, label: "已到期" },
        { value: 5, label: "访问异常" },
      ],
      queryTime: [], //发布日期
      serviceData: [], //服务
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  filters: {
    showDate(value) {
      if (value) return value.toString().split(" ")[0];
    },
  },
  mounted() {
    this.getResourceTree();
    this.getServiceData();
  },
  methods: {
    // 目录展开/折叠
    handleCommand(command) {
      this.$refs.tree.store
        ._getAllNodes()
        .forEach((item) => (item.expanded = command));
    },
    // 树过滤方法
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取目录列表
    getResourceTree() {
      this.treeLoading = true;
      getCatalog()
        .then((res) => {
          this.resourceTreeData = this.formatCatalog(res.result);
          this.catalogData = this.resourceTreeData;
          this.treeLoading = false;
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    // 获取服务
    getServiceData() {
      let p = { direId: this.catalog ?? "", status: this.queryStatus };
      if (this.queryTime?.length > 0) {
        p.startDate = this.queryTime[0];
        p.endDate = this.queryTime[1];
      }
      this.mainLoading = true;
      getOverviewService(p)
        .then((res) => {
          this.mainLoading = false;
          this.serviceData = res.result;
          this.serviceTotal = res.total;
        })
        .catch(() => {
          this.mainLoading = false;
        });
    },
    //树节点点击事件
    treeNodeClick(data, node) {
      this.catalog = data.id;
      this.queryTime = [];
      this.getServiceData();
    },
    // 搜索
    search() {
      if (this.catalog == null || this.catalog == "") {
        this.treeNodeExpand = [];
        this.$refs.tree.setCurrentKey();
      } else {
        this.treeNodeExpand = [this.catalog];
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.catalog);
        });
      }
      this.getServiceData();
    },
    // 重置
    reset() {
      this.catalog = "";
      this.queryStatus = "";
      this.queryTime = [];
      this.getServiceData();
    },
    // 查看
    showDetail(row) {
      this.$router.push({
        name: "overviewShow",
        params: { from: "overview", id: row.id },
      });
    },
    // 服务显示颜色
    getServiceColor(status) {
      // 1:发布 2:暂存 3:停用 4:到期 5:异常
      switch (status) {
        case 1:
          return { "--color": "#6b73ca" };
        case 2:
          return { "--color": "#606266" };
        case 3:
          return { "--color": "#dfdfdf" };
        case 4:
          return { "--color": "#919191" };
        case 5:
          return { "--color": "#E6A23C" };
        default:
          return { "--color": "#606266" };
      }
    },
    // 获取状态
    getStatus(val) {
      return this.statusData.find((item) => item.value == val)?.label;
    },
    //格式化目录列表: 去掉空的childNodes
    formatCatalog(data) {
      data.forEach((item) => {
        if (item.childNodes.length == 0) {
          delete item.childNodes;
        } else {
          this.formatCatalog(item.childNodes);
        }
      });
      return data;
    },
  },
};
</script>

<style lang="less" scoped>
.overview {
  height: 100%;
  .el-card ::v-deep .el-card__body {
    padding: 0;
    height: 100%;
  }
  header {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dfe4eb;
    font-size: 16px;
    padding: 0 10px;
  }
  .left {
    header {
      .el-dropdown {
        height: 40px;
        margin-left: 5px;
        .el-dropdown-link {
          cursor: pointer;
          .iconfont {
            font-size: 18px;
            &::before {
              display: inline-block;
              transform: rotate(90deg);
            }
          }
        }
      }
    }
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
    header span {
      font-weight: 400;
    }
    .query-condition {
      display: flex;
      justify-content: space-between;
      margin: 10px;
      .query {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        .el-cascader,
        .el-select {
          margin-right: 10px;
          width: 200px;
        }
      }
      .actions {
        display: flex;
        .el-button {
          height: 32px;
        }
      }
    }
  }
  section {
    float: left;
    width: calc(80% - 10px);
    height: calc(100% - 94px);
    padding-top: 10px;
    .empty {
      height: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .service {
      width: 100%;
      height: 130px;
      background-color: #fff;
      margin-bottom: 25px;
      border: 1px solid #e7edf5;
      border-radius: 2px 2px 8px 8px;
      float: left;
      padding: 10px;
      position: relative;
      &::after {
        position: absolute;
        content: "";
        bottom: 0;
        left: 0;
        right: 0;
        height: 8px;
        border-radius: 0 0 8px 8px;
        background-color: var(--color);
      }
      .icon {
        float: left;
        position: relative;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background-color: var(--color);
        margin-right: 10px;
        .el-image {
          position: absolute;
          top: 5px;
          left: 5px;
        }
      }
      .name {
        line-height: 26px;
        font-weight: 700;
        width: calc(100% - 36px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        margin-bottom: -5px;
      }
      p {
        padding-left: 36px;
        line-height: 20px;
      }
      .el-button {
        position: absolute;
        right: 10px;
        bottom: 10px;
      }
    }
  }
}
</style>