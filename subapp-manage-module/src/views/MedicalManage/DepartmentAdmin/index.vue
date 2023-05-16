<template>
  <div class="FU-PatientCenter">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>科室管理</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <OrgHosSelect ref="orgRef" v-model="pageParams.orgId" placeholder="集团"></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="pageParams.hosId"
              :parentId="pageParams.orgId"
              placeholder="机构"
            ></OrgHosSelect>
            <el-select
              placeholder="科室类型"
              v-model="queryParams.deptType"
              clearable
              @change="initDeptCascaderOptions"
            >
              <el-option :label="item.LABLE" :value="item.VALUE" :key="item.VALUE" v-for="item in deptTypeList" />
            </el-select>
            <el-cascader
              v-model="deptCasIds"
              :options="deptCascaderOptions"
              placeholder="科室名称"
              clearable
              :disabled="!queryParams.hosId || !queryParams.deptType"
            />
            <el-select placeholder="状态" v-model="queryParams.status" clearable>
              <el-option label="已开启" value="Y" />
              <el-option label="未启用" value="N" />
            </el-select>
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="添加开始日期"
              end-placeholder="添加结束日期"
              range-separator="至"
              v-model="addDate"
              clearable
              style="width: 410px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="addDept">新增</el-button>
            <el-button @click="batchVis = true">批量新增</el-button>
            <el-button @click="delteDept">删除</el-button>
            <div class="alert" v-if="multipleSelection.length !== 0">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
              <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
            </div>
          </template>
          <el-table
            ref="singleTable"
            v-adaptive="{ bottomOffset: 65 }"
            height="0"
            :data="departmentList"
            border
            v-loading="loading"
            row-key="patId"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="40"
              :reserve-selection="true"
              :selectable="(row) => !row.switchStatus"
            />
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="科室ID" prop="code" />
            <el-table-column label="科室名称" prop="name" />
            <el-table-column label="科室类型" prop="deptTypeDesc" />
            <el-table-column label="机构名称" prop="hosName" />
            <el-table-column label="状态" width="150">
              <template slot-scope="{ row }">
                <el-switch
                  :value="row.switchStatus"
                  :active-text="row.switchStatus ? '开启' : '停用'"
                  @change="onChangeOrgStatus(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="添加时间" prop="createDate" width="160" />
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="{ row }">
                <el-button type="text" @click="pageToAddDepartment(row, 'check')">详情</el-button>
                <el-button type="text" @click="pageToAddDepartment(row, 'edit')">编辑</el-button>
                <el-button type="text" :class="[row.switchStatus ? 'grey' : '']" @click="delteDept(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
    <BatchAdd :visible.sync="batchVis" @batch-add-success="handleBatchAddSuccess" />
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg } from 'anx-vue'
import BatchAdd from './BatchAdd'
import {
  getDepartmentList,
  delDept,
  getOrgOrHosOptions,
  getDictionary,
  onChangeOrgStatus,
  batchDelDept,
} from '@/api/modules/systemAdmin'
import GroupSelect from '@/components/GroupAndHospital/GroupSelect'
import HospitalSelect from '@/components/GroupAndHospital/HospitalSelect'

export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
    BatchAdd,
    GroupSelect,
    HospitalSelect,
  },
  data() {
    return {
      loading: false,
      orgOptionsList: [],
      hosOptionsList: [],
      deptTypeList: [],
      deptCasIds: [],
      deptCascaderOptions: [],
      departmentList: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      multipleSelection: [],
      addDate: [],
      batchVis: false,
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
    await this.getDictionary()
  },
  methods: {
    // 获取科室类型
    async getDictionary() {
      try {
        const res = await getDictionary({ code: 'DEPT_CLASSIFY' })
        console.log('getDictionary==', res)
        this.deptTypeList = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 初始化科室级联名称
    async initDeptCascaderOptions() {
      this.deptCasIds = []
      if (!this.queryParams.hosId || !this.queryParams.deptType) {
        return
      }
      try {
        const res = await getOrgOrHosOptions({
          parentId: this.queryParams.hosId,
          deptType: this.queryParams.deptType,
        })
        this.deptCascaderOptions = res.result
      } catch (err) {
        console.error(err)
      }
    },

    async onInquire() {
      this.loading = true
      try {
        const res = await getDepartmentList({
          ...this.queryParams,
          ...this.pageParams,
          createDateS: this.addDate ? (this.addDate[0] ? this.addDate[0] : '') : '',
          createDateE: this.addDate ? (this.addDate[1] ? this.addDate[1] : '') : '',
          id: this.deptCasIds.length ? this.deptCasIds[this.deptCasIds.length - 1] : '',
        })
        if (res.result.records) {
          res.result.records.forEach((recordItem) => {
            for (const key in recordItem) {
              if (!recordItem[key]) {
                recordItem[key] = '/'
              }
            }
          })
        }
        this.departmentList = res.result.records.map((item) => ({
          ...item,
          switchStatus: item.status === 'Y',
        }))
        this.total = res.result.total
        this.loading = false
        console.log('getDepartmentList', res)
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async resetQueryParams() {
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.queryParams = {}
      this.addDate = []

      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    addDept() {
      this.$router.push({
        name: 'AddDepartment',
        query: {
          mode: 'add',
        },
      })
    },
    pageToAddDepartment(row, mode) {
      this.$router.push({
        name: 'AddDepartment',
        query: {
          mode,
          deptId: row.id,
        },
      })
    },

    // 删除科室
    // delDept(row) {
    //   this.$confirm('确定要删除该科室吗', '提示', {}).then(async () => {
    //     try {
    //       const res = await delDept({ id: row.id });
    //       console.log('delDept==', res);
    //       this.onInquire();
    //     } catch(err) {
    //       console.error(err);
    //     }
    //   })
    // },

    // 科室删除
    delteDept(row) {
      if (row.switchStatus) {
        this.$message.warning('该科室状态为启用，不予删除')
        return
      }
      let orgIds = []
      let msg = ''
      if (row.id) {
        orgIds = [row.id]
        msg = '确定要删除该科室吗'
      } else {
        orgIds = this.multipleSelection.map((item) => item.id)
        if (!orgIds.length) {
          this.$message.warning('请勾选需要删除的科室')
          return
        }
        msg = '确定要删除选中科室吗'
      }
      this.$confirm(msg, '提示', {}).then(async () => {
        try {
          const res = await batchDelDept({ orgIds })
          this.clearFun()
          console.log('batchDelDept==', res)
          this.onInquire()
        } catch (err) {
          console.error(err)
        }
      })
    },

    // 批量删除科室
    // async delteDept() {
    //   const orgIds = this.multipleSelection.map(item => item.id);
    //   if (!orgIds.length) {
    //     this.$message.warning('请勾选需要删除的科室');
    //     return;
    //   }
    //   this.$confirm('确定要删除选中科室吗', '提示', {}).then(async () => {
    //     try {
    //       const res = await delteDept({ orgIds });
    //       this.clearFun();
    //       console.log('delteDept==', res);
    //       this.onInquire()
    //     } catch(err) {
    //       console.error(err);
    //     }
    //   });
    // },

    // 批量新增成功
    handleBatchAddSuccess() {
      this.batchVis = false
      this.pageParams.pageNum = 1
      this.onInquire()
    },

    // 科室启用/停用
    async onChangeOrgStatus(row) {
      try {
        const res = await onChangeOrgStatus({ orgId: row.id })
        console.log('onChangeOrgStatus==', res)
        if (res.code === 0) {
          row.switchStatus = !row.switchStatus
          this.onInquire()
        }
      } catch (err) {
        console.log(err)
      }
    },
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
.FU-PatientCenter {
  .header {
    .bolck {
      border-radius: 2px;
      font-size: 16px;
      color: #101010;
      text-align: center;
      background-color: #fff;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-div {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        line-height: 24px;
        margin-right: 5px;
        &.user {
          background-color: rgba(106, 140, 215, 0.3);
          color: #6a8cd7;
        }
        &.time {
          background-color: rgba(244, 199, 89, 0.3);
          color: #f4c759;
        }
        &.document {
          background-color: rgba(146, 206, 117, 0.3);
          color: #92ce75;
        }
      }
    }
  }
  .middle {
    margin-left: 20px;
    margin-right: 10px;
    ::v-deep.el-checkbox__label {
      padding-left: 3px;
      font-size: 14px;
    }
  }
  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
  .ProList {
    border-radius: 2px;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
  }
  .grey {
    color: #919191;
  }
}
</style>
