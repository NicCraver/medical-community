<template>
  <div class="DiseaseTag">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>病种标签</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="展示名称/标签名称" v-model="queryParams.tagDesc" clearable />
            <el-select placeholder="状态" v-model="queryParams.status" clearable filterable>
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <el-cascader v-model="queryParams.deptId" :options="queryDeptData" placeholder="科室名称" clearable />
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
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
            <el-button type="primary" @click="showTagDetail('add')">新增</el-button>
            <el-button @click="batchStart">批量开启</el-button>
            <div class="alert" v-if="multipleSelection.length !== 0">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
              <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
            </div>
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 60 }"
            height="100px"
            ref="singleTable"
            row-key="id"
            :data="tableData"
            border
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="40"
              :reserve-selection="true"
              :selectable="(row) => row.status === 1"
            />
            <!-- {{ scope.row.seq + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }} -->
            <el-table-column label="序号" type="seq" width="50">
              <template slot-scope="scope">
                <span>{{ scope.row.seq }}</span>
              </template>
            </el-table-column>
            <el-table-column label="展示名称" prop="tagShowDesc" />
            <el-table-column label="标签名称" prop="tagDesc" />
            <el-table-column label="所属科室" prop="allDeptName" />
            <el-table-column label="创建人" prop="createUserName" />
            <el-table-column label="创建时间" prop="createDate" min-width="120" />
            <el-table-column label="更新时间" prop="modDate" min-width="120" />
            <el-table-column label="更新人" prop="modUserName" />
            <el-table-column label="状态" width="120">
              <template slot-scope="{ row }">
                <el-switch
                  :value="row.status"
                  :active-value="0"
                  :inactive-value="1"
                  @click.native="handleSwitchChange(row)"
                ></el-switch>
                <span :class="['status', row.status === 0 ? 'active' : 'inactive']">{{
                  row.status === 0 ? '开启' : '关闭'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template slot-scope="{ row }">
                <el-button type="text" @click="showTagDetail('check', row)">查看</el-button>
                <el-button type="text" @click="showTagDetail('edit', row)">编辑</el-button>
                <!-- <el-button type="text" @click="handleDelete(row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
    <ProDrawer :visible.sync="drawerVisible" title="新增" direction="rtl" :size="600" show-close class="tag-drawer">
      <div class="title">标签信息</div>
      <TagDetailForm :mode="tagDetailMode" :tagDetail="tagDetail" ref="drawerTagDetail"></TagDetailForm>
      <template slot="footer">
        <el-button type="default" @click="drawerVisible = false">返回</el-button>
        <el-button type="primary" @click="handleSubmitTagDetail('drawerTagDetail')">保存</el-button>
      </template>
    </ProDrawer>
    <ProDialog
      :visible.sync="dialogVisible"
      :title="tagDetailMode === 'edit' ? '编辑' : '查看'"
      width="700px"
      :close-on-click-modal="false"
    >
      <TagDetailForm :mode="tagDetailMode" :tagDetail="tagDetail" ref="dialogTagDetail"></TagDetailForm>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitTagDetail('dialogTagDetail')"> 确 定 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProList, ProLayout, ProDrawer, ProDialog, IconSvg } from 'anx-vue'
import TagDetailForm from './TagDetailForm'
import {
  getDeptDictionaryForQuery,
  getDiseaseTagList,
  getDepts,
  saveDiseaseTag,
  checkTagUseStatus,
  changeStatus,
} from '@/api/modules/diseaseTag'
export default {
  components: {
    ProList,
    ProLayout,
    ProDrawer,
    ProDialog,
    IconSvg,
    TagDetailForm,
  },
  data() {
    return {
      statusList: [
        { label: '开启', value: 0 },
        { label: '关闭', value: 1 },
      ],
      deptData: [],
      addDate: [],
      multipleSelection: [],
      loading: false,
      tableData: [],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      queryDeptData: [],
      total: 0,
      drawerVisible: false,
      tagDetailMode: 'add',
      tagDetail: {},
      dialogVisible: false,
    }
  },
  mounted() {
    this.getDeptDictionaryForQuery()
    this.onInquire()
  },
  methods: {
    async getDeptDictionaryForQuery() {
      try {
        const res = await getDeptDictionaryForQuery()
        console.log('getDeptDictionaryForQuery', res)
        const deptData = res.result
        this.filterDeptData(deptData)
        this.queryDeptData = deptData
      } catch (err) {
        console.error(err)
      }
    },
    filterDeptData(deptData) {
      deptData.forEach((item) => {
        if (!item.children.length) {
          item.children = null
        } else {
          this.filterDeptData(item.children)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // console.log('this.multipleSelection', this.multipleSelection)
    },
    // 查询
    async onInquire() {
      try {
        const res = await getDiseaseTagList({
          ...this.queryParams,
          createDateS: this.addDate ? (this.addDate[0] ? this.addDate[0] + ' 00:00:00' : '') : '',
          createDateE: this.addDate ? (this.addDate[1] ? this.addDate[1] + ' 23:59:59' : '') : '',
          deptId: this.queryParams.deptId ? this.queryParams.deptId[this.queryParams.deptId.length - 1] : '',
          ...this.pageParams,
        })
        console.log('getDiseaseTagList', res)
        this.tableData = res.result.records
        this.tableData.forEach((el) => {
          for (let key in el) {
            if (el[key] === '') {
              el[key] = '/'
            }
          }
        })
        this.total = res.result.total
      } catch (err) {
        console.error('error', err)
      }
    },
    showTagDetail(mode, row) {
      this.tagDetailMode = mode
      if (mode === 'add') {
        this.tagDetail = {
          status: 0,
        }
        this.drawerVisible = true
      } else {
        this.tagDetail = {
          status: 0,
          tagShowDesc: row.tagShowDesc,
          tagDesc: row.tagDesc,
          description: row.description,
          deptId: row.deptIds,
          ids: row.ids,
        }
        this.dialogVisible = true
      }
    },
    handleDelete() {},
    handleDetail(row) {
      this.$router.push({
        name: 'ActivityAdd',
        query: {
          status: 'etails',
          activityId: row.id,
          activityPro: row.statusDesc,
        },
      })
    },
    batchStart() {
      const params = {
        ids: this.multipleSelection.map((item) => item.ids).reduce((a, b) => a.concat(b)),
        status: 0,
      }
      this.changeStatus(params, 'batchStart')
      this.clearFun()
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
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    handleSubmitTagDetail(formRefName) {
      console.log(this.$refs[formRefName])
      this.$refs[formRefName].validate(async () => {
        try {
          let visibleFlag = ''
          let msg = ''
          let params = {
            ...this.tagDetail,
            deptId: this.tagDetail.deptId[this.tagDetail.deptId.length - 1],
          }
          if (formRefName === 'drawerTagDetail') {
            msg = '标签新增成功'
            visibleFlag = 'drawerVisible'
          } else {
            visibleFlag = 'dialogVisible'
            msg = '标签修改成功'
          }
          const res = await saveDiseaseTag(params)
          console.log('saveDiseaseTag', res)
          if (res.code === 0) {
            this.$message.success(msg)
            this[visibleFlag] = false
            this.queryParams = {}
            this.pageParams = {
              pageSize: 10,
              pageNum: 1,
            }
            this.getDeptDictionaryForQuery()
          } else {
            this.$message.error(res.data.desc)
          }
          this.onInquire()
        } catch (err) {
          console.error(err)
        }
      })
    },
    async handleSwitchChange(row) {
      const params = {
        ids: row.ids,
        status: row.status === 0 ? 1 : 0,
      }
      if (row.status === 0) {
        const result = await this.checkTagUseStatus(row)
        if (!result) {
          this.changeStatus(params)
        } else {
          this.$confirm('该标签已有客户使用，停用后新客户将无法使用！确认停用吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              this.changeStatus(params)
            })
            .catch(() => {})
        }
      } else {
        this.changeStatus(params)
      }
    },
    async checkTagUseStatus(row) {
      try {
        const res = await checkTagUseStatus({
          ids: row.ids,
        })
        return res.result
      } catch (error) {
        console.log('error', error)
      }
    },
    async changeStatus(params, type) {
      try {
        const res = await changeStatus(params)
        console.log(`params`, params.status)
        if (type === 'batchStart') {
          this.$message.success(`成功开启${params.ids.length}条`)
        } else {
          this.$message.success(`操作成功`)
        }
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.DiseaseTag {
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
  .status {
    margin-left: 5px;
    &.active {
      color: #446abd;
    }
    &.inactive {
      // color: #dcdfe6;
    }
  }
  .tag-drawer {
    .title {
      background-color: #f5f5f5;
      line-height: 40px;
      padding-left: 15px;
      font-size: 14px;
      color: #101010;
    }
  }
}
</style>
