<template>
  <div class="OperationalTag">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>运营标签</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="展示名称/标签名称" v-model="queryParams.activityDesc" clearable />
            <el-select placeholder="状态" v-model="queryParams.status" clearable filterable>
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              placeholder="更新类型"
              v-model="queryParams.status"
              clearable
            >
              <el-option label="系统更新" value="1" />
              <el-option label="手工更新" value="2" />
            </el-select>
            <el-date-picker
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="创建开始日期"
              end-placeholder="创建结束日期"
              range-separator="至"
              v-model="addDate"
              clearable
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="handleAdd()">新建标签</el-button>
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 60 }"
            height="100px"
            ref="singleTable"
            row-key="id"
            :data="tableData"
            border
            v-loading="loading"
          >
            <!-- {{ scope.row.seq + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }} -->
            <el-table-column label="序号" type="seq" width="50">
              <template slot-scope="scope">
                <span>{{ scope.row.seq }}</span>
              </template>
            </el-table-column>
            <el-table-column label="展示名称" prop="showName" />
            <el-table-column label="标签名称" prop="tagName" />
            <el-table-column label="更新类型" prop="updateType" />
            <el-table-column label="创建人" prop="createPerson" />
            <el-table-column label="创建时间" prop="createTime" />
            <el-table-column label="更新时间" prop="updateTime" />
            <el-table-column label="更新人" prop="updatePerson" min-width="250" />
            <el-table-column label="最近计算 "prop="calTime" width="160">
              <template slot-scope="{ row }">
                <span v-if="row.calStatus === '2'" class="fail">
                  执行失败
                  <el-tooltip placement="top">
                    <i :class="['el-icon', 'el-icon-warning', row.status ? 'start' : '']"></i>
                    <div slot="content">
                      <div style="color: #F77601;font-size: 14px;text-align: center;margin-bottom: 10px;">
                        请重新执行
                      </div>
                      <span>计算时间：{{ row.calTime }}</span>
                    </div>
                  </el-tooltip>
                </span>
                <span v-else>{{ row.calTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户数量" prop="cusCount" />
            <el-table-column label="状态">
              <template slot-scope="{ row }">
                <el-switch v-model="row.status"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template slot-scope="{ row }">
                <el-button type="text" @click="handleDetail(row)">详情</el-button>
                <el-button
                  type="text"
                >编辑</el-button>
                <el-button
                  type="text"
                  v-if="row.updateType === '手工更新'"
                  :disabled="!row.status"
                >更新</el-button>
                <el-button
                  type="text"
                  v-if="row.calTime !== '/'"
                >数据</el-button>
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProList, ProLayout, ProDrawer, ProDialog, IconSvg } from 'anx-vue'

export default {
  components: {
    ProList,
    ProLayout,
    ProDialog,
    IconSvg,
  },
  data() {
    return {
      statusList: [
        { label: '开启', value: 'WAIT' },
        { label: '关闭', value: 'IN_PROGRESS' },
      ],
      addDate: [],
      loading: false,
      tableData: [
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '手工更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '/',
          updatePerson: '常建',
          calStatus: '0',
          calTime: '/',
          cusCount: '/',
          status: true
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '手工更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '2021-01-02 10:12',
          updatePerson: '常建',
          calStatus: '0',
          calTime: '/',
          cusCount: '/',
          status: true
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '手工更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '2021-01-02 10:12',
          updatePerson: '常建',
          calStatus: '1',
          calTime: '2021-01-02 10:20',
          cusCount: '20',
          status: true
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '手工更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '2021-01-02 10:12',
          updatePerson: '常建',
          calStatus: '0',
          calTime: '/',
          cusCount: '/',
          status: false
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '手工更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '2021-01-02 10:12',
          updatePerson: '常建',
          calStatus: '1',
          calTime: '2021-01-02 10:20',
          cusCount: '20',
          status: false
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '系统更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '/',
          updatePerson: '常建',
          calStatus: '1',
          calTime: '2020-12-28  09:00',
          cusCount: '0',
          status: true
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '系统更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '/',
          updatePerson: '常建',
          calStatus: '2',
          calTime: '2020-12-28  09:00',
          cusCount: '--',
          status: true
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '系统更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '/',
          updatePerson: '常建',
          calStatus: '2',
          calTime: '2020-12-28  09:00',
          cusCount: '--',
          status: false
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '系统更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '/',
          updatePerson: '/',
          calStatus: '0',
          calTime: '/',
          cusCount: '/',
          status: false
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '系统更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '2021-01-03  00:00',
          updatePerson: '常建',
          calStatus: '1',
          calTime: '2021-01-03  00:00',
          cusCount: '100',
          status: true
        },
        {
          showName:  '核心客户',
          tagName: '注册1周年',
          updateType: '系统更新',
          createPerson: '袁术',
          crateTime: '2020-12-28 09:00',
          updateTime: '2021-01-03  00:00',
          updatePerson: '常建',
          calStatus: '1',
          calTime: '2021-01-03  00:00',
          cusCount: '100',
          status: false
        }
      ],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      multipleSelection: [],
    }
  },
  mounted() {
    this.onInquire()
  },
  methods: {
    async selectData() {},
    // 查询
    async onInquire() {},
    // 跳转新增
    handleAdd() {
      this.$router.push({
        name: 'operateAdd',
        query: {
          status: 'add',
        },
      })
    },
    // 跳转详情
    handleDetail() {
      this.$router.push({
        name: 'operateDetails',
        query: {
          status: 'etails',
          // activityId: row.id,
          // activityPro: row.statusDesc,
        },
      })
    },
    // 操作编辑
    handleEdit(row) {
      this.$router.push({
        name: 'ActivityAdd',
        query: {
          status: 'edit',
          activityId: row.id,
          activityPro: row.statusDesc,
        },
      })
    },
    // 操作数据
    handleData(row) {
      this.$router.push({
        name: 'ActivityAdd',
        query: {
          status: 'dataInfo',
          activityId: row.id,
          activityPro: row.statusDesc,
        },
      })
    },
    // 操作关闭
    handleClose(row) {
      this.activiCloseId = row.id
      this.dialogReasonClose = true
    },
    // 重置
    resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageSize: 10,
        pageNum: 1,
      }
      this.addDate = []
      this.onInquire()
    },
  },
}
</script>

<style lang="scss" scoped>
.OperationalTag {
  .serviceStyle {
    font-size: 14px;
    color: #ffffff;
    background-color: rgba(17, 17, 17, 0.6);
    padding: 10px 80px 10px 10px;
    border-radius: 5px;
  }
  .warin {
    color: #919191;
  }
  .ProList {
    border-radius: 2px;
    padding: 10px;
    background-color: #fff;
  }

  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
  span.fail {
    color: #F73501;
    text-decoration: underline;
    cursor: pointer;
    .el-icon {
      color: rgba(247, 118, 1, 0.46);
      &.start {
        color: #F77601;
      }
    }
  }
}
</style>
