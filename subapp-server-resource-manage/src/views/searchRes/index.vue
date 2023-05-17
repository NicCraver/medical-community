<template>
  <div class="searchRes">
    <div class="protitle">搜索结果</div>
    <div class="promain">
      <el-card>
        <ProTable>
          <template #header>
            <el-select
              placeholder="集团"
              v-model="queryParams.groupId"
              disabled
            >
              <el-option
                v-for="(item, index) in groupList"
                :key="index"
                :value="item.id"
                :label="item.label"
              ></el-option>
            </el-select>
            <el-select
              placeholder="机构"
              multiple
              v-model="queryParams.orgIdList"
              filterable
              collapse-tags
              :disabled="isOriAdmin === 'true'"
              style="width: 260px"
            >
              <el-option
                v-for="(item, index) in hosList"
                :key="index"
                :value="item.id"
                :label="item.label"
                v-show="item.parentId === queryParams.groupId"
              ></el-option>
            </el-select>
            <el-input
              size="small"
              placeholder="方案名称"
              v-model="queryParams.name"
              clearable
            ></el-input>
            <el-date-picker
              size="small"
              v-model="queryTime"
              type="daterange"
              start-placeholder="发布开始日期"
              end-placeholder="发布结束日期"
              range-separator="至"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </template>
          <template #actions>
            <el-button size="small" type="primary" @click="search"
              >搜索</el-button
            >
            <el-button size="small" @click="reset">重置</el-button>
            <el-button
              size="small"
              @click="gotoAreaFuc(multipleSelection, 'areaQuality')"
            >
              返回
            </el-button>
          </template>
          <template #batchActions>
            <div class="tip">
              <i class="iconfont icon-info-circle-fill"></i>
              <span>已选择 {{ multipleSelection?.length || 0 }} 项</span>
              <el-button type="text" @click="allSelection">
                <span class="selectAllCls">
                  勾选"搜索结果"全部{{ tableData?.length || 0 }}项
                </span>
              </el-button>
              <el-button type="text" @click="clearSelection">清空</el-button>
            </div>
          </template>
          <el-table
            ref="table"
            tooltip-effect="light"
            height="0"
            v-adaptive="{ bottomOffset: 105 }"
            v-loading="loading"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
            stripe
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="{ $index }">
                <span>{{ $index + 1 + (pageNum - 1) * pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="方案名称"
              prop="name"
              min-width="180"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="发布机构"
              prop="publishOrgName"
              min-width="120"
            ></el-table-column>
            <el-table-column label="方案来源">
              <template slot-scope="{ row }">{{
                row.source === 1 ? "内部" : "国家标准"
              }}</template>
            </el-table-column>
            <el-table-column
              label="机构范围"
              min-width="180"
              show-overflow-tooltip
            >
              <template slot-scope="{ row }">
                {{ row.orgNames.toString() }}
              </template>
            </el-table-column>
            <el-table-column label="发布状态">
              <template slot-scope="{ row }">{{
                row.publishStatus === 2 ? "已发布" : "已停止"
              }}</template>
            </el-table-column>
            <el-table-column
              label="发布人员"
              prop="updateByName"
            ></el-table-column>
            <el-table-column
              label="发布时间"
              prop="publishTime"
              min-width="170"
              sortable
            ></el-table-column>
            <el-table-column
              label="创建人员"
              prop="createByName"
            ></el-table-column>
            <el-table-column
              label="创建时间"
              prop="createTime"
              min-width="170"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="150"
              align="center"
              fixed="right"
            >
              <template slot-scope="{ row }">
                <el-button type="text" @click="showScheme(row.id)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </ProTable>
      </el-card>
    </div>
  </div>
</template>
<script>
import ProTable from "components/ProTable";
import { getQualityControlList, getOrgNames } from "api/basicConfig";
import mixin from "./mixin.js";
export default {
  name: "searchRes",
  mixins: [mixin],
  components: {
    ProTable,
  },
  data() {
    return {
      routerParams: {},
      currentRole: {},
      isOriAdmin: "",
      groupList: [],
      hosList: [],
      queryParams: {
        groupId: "",
        orgIdList: [],
        name: "",
      }, // 查询请求参数
      queryTime: [], //创建日期
      // tableData: [], //列表数据
      multipleSelection: [], //列表被选中的内容
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      // total: 0, //总条数
    };
  },
  created() {
    this.getRouterParams();
    this.initFuc();
  },
  mounted() {
    this.getListParams();
  },
  methods: {
    getRouterParams() {
      this.routerParams = this.$route.query;
      this.queryParams = {
        name: this.routerParams?.name,
        orgIdList: this.routerParams?.orgIdList
          ? this.routerParams?.orgIdList.split(",")
          : [],
      };
      this.queryTime = this.routerParams.queryTime
        ? this.routerParams?.queryTime.split(",")
        : [];
    },
    initFuc() {
      this.currentRole = JSON.parse(sessionStorage.getItem("currentRole"));
      this.isOriAdmin = sessionStorage.getItem("isOriAdmin");
      this.queryParams.groupId = this.currentRole.orgId;
      if (this.isOriAdmin && !this.routerParams.orgIdList) {
        // 机构
        this.queryParams.orgIdList = [this.currentRole.hosId];
      }
      this.getOrgNamesFuc();
    },
    // 查询机构
    getOrgNamesFuc() {
      getOrgNames().then(({ code, result }) => {
        if (code === 0) {
          if (this.isOriAdmin) {
            // 集团账户
            this.groupList = [
              {
                id: this.currentRole.orgId,
                label: this.currentRole.orgName,
              },
            ];
            this.hosList = result.treeData.map((item) => {
              return {
                parentId: this.currentRole.orgId,
                id: item.id,
                label: item.label,
              };
            });
          } else {
            this.handleOrgData(result.treeData);
          }
        }
      });
    },
    handleOrgData(list) {
      let hosList = [];
      let groupList = list.map((item) => {
        let children = item.children.map((vv) => {
          return {
            parentId: item.id,
            id: vv.id,
            label: vv.label,
          };
        });
        hosList = hosList.concat(children);
        return {
          id: item.id,
          label: item.label,
        };
      });
      console.log("groupList:", groupList);
      console.log("hosList:", hosList);
      this.groupList = groupList;
      this.hosList = hosList;
    },
    getListParams() {
      let param = {
        publishStatus: 2,
        runLogFlg: 1,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.queryParams?.name || "",
        orgIdList: this.queryParams.orgIdList?.length
          ? this.queryParams.orgIdList.join(",")
          : "",
      };
      if (this.queryTime && this.queryTime.length > 0) {
        param.startDate = this.queryTime[0];
        param.endDate = this.queryTime[1];
      }
      this.getList(param);
    },
    // 搜索
    search() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.getListParams();
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.queryTime = [];
      this.pageNum = 1;
      this.pageSize = 10;
      this.getListParams();
    },
    // 清空
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection();
    },
    // 全选
    allSelection() {
      if (this.tableData?.length === this.multipleSelection?.length) {
        return;
      }
      this.$refs.table && this.$refs.table.toggleAllSelection(true);
    },
    // 查看
    showScheme(id) {
      this.$router.push({
        name: "configQualityControlShow",
        params: { id: id, projectState: "searchRes" },
      });
    },
    // table选择项发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getListParams();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListParams();
    },
  },
};
</script>

<style lang="scss" scoped>
.searchRes {
  .el-card {
    height: 100%;
    width: 100%;
    .selectAllCls {
      text-decoration: underline;
    }
  }
}
</style>
