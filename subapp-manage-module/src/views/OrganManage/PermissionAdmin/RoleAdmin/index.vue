<template>
  <div class="RoleAdmin">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>角色管理</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="角色名称/角色ID" v-model="queryParams.name" clearable />
            <!-- <el-select placeholder="角色名称" v-model="queryParams.roleId" clearable filterable>
              <el-option
                v-for="item in characterLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-select placeholder="数据权限" v-model="queryParams.authId" clearable filterable>
              <el-option label="集团" value="3fad093759674f539d5910a29b45ae4c" />
              <el-option label="机构" value="12e1c7ef650f44ae9ca08fe17ea81c7f" />
            </el-select>
            <el-select
              v-if="$IS_ORG_ADMIN || $IS_ORI_ADMIN"
              placeholder="角色类型"
              v-model="queryParams.type"
              clearable
              filterable
            >
              <el-option label="平台创建" value="ROOT" />
              <el-option label="集团创建" value="ORG" />
              <el-option label="机构创建" value="HOS" />
            </el-select>
            <el-select placeholder="状态" v-model="queryParams.status" clearable filterable>
              <el-option label="开启" value="Y" />
              <el-option label="停用" value="N" />
            </el-select>
            <el-select placeholder="菜单授权" v-model="queryParams.authorizeStatus" clearable filterable>
              <el-option label="已授权" value="1" />
              <el-option label="未授权" value="0" />
            </el-select>
            <!-- <el-select
              v-if="$IS_ORG_ADMIN || $IS_ORI_ADMIN"
              placeholder="全部机构"
              v-model="queryParams.authorizeStatus"
              clearable
              filterable
            >
              <el-option label="已授权" value="Y" />
              <el-option label="未授权" value="N" />
            </el-select> -->
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="添加开始日期"
              end-placeholder="添加结束日期"
              range-separator="至"
              v-model="joinDate"
              clearable
              style="width: 410px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="fnTheNewRole()">新增</el-button>
            <el-button @click="fnBatchOutage(multipleSelection)">批量停用</el-button>
            <div class="alert" v-if="multipleSelection.length !== 0">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
              <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
            </div>
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 59 }"
            height="0"
            ref="singleTable"
            :data="tableDataList"
            border
            v-loading="loading"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="40"
              :reserve-selection="true"
              :selectable="(row) => row.type !== 'S' && row.status === 'Y'"
            />
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="角色ID" prop="code" show-overflow-tooltip />
            <el-table-column label="数据权限" prop="authDesc" />
            <el-table-column v-if="$IS_ORG_ADMIN || $IS_ORI_ADMIN" label="角色类型" prop="typeDesc" />
            <el-table-column v-if="$IS_ORG_ADMIN || $IS_ORI_ADMIN" label="角色名称" prop="name" min-width="160" />
            <el-table-column v-if="$IS_ORG_ADMIN || $IS_ORI_ADMIN" label="角色模板" prop="isTemplateDesc" />
            <el-table-column label="角色模板名称" prop="templateName" min-width="160" show-overflow-tooltip />
            <el-table-column label="定义" prop="description" width="140" show-overflow-tooltip />
            <!-- <el-table-column label="菜单授权" prop="authorizeStatusDesc" /> -->
            <el-table-column label="菜单授权">
              <template slot-scope="{ row }">
                <div class="link" v-if="row.authorizeStatusDesc === '待授权'" @click="goPage(row)">
                  {{ row.authorizeStatusDesc }}
                </div>
                <div v-else>{{ row.authorizeStatusDesc }}</div>
              </template>
            </el-table-column>
            <el-table-column label="添加人" prop="createUserName" width="120" show-overflow-tooltip />
            <el-table-column label="添加时间" prop="createDate" width="200" />
            <el-table-column label="状态" width="100" fixed="right">
              <template slot-scope="{ row }">
                <el-switch
                  v-model="row.status"
                  :disabled="row.modifyFlg !== true || row.stopFlg !== true"
                  active-value="Y"
                  inactive-value="N"
                  :active-text="row.status === 'Y' ? '启用' : '停用'"
                  @change="fnBatchOutage(row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="160">
              <template slot-scope="{ row }">
                <el-button type="text" @click="onDetails(row)">详情</el-button>
                <el-button type="text" @click="onEdit(row)" :disabled="row.modifyFlg !== true" v-if="row.type !== 'S'"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="onDelete(row)"
                  :disabled="row.modifyFlg !== true"
                  v-if="row.type !== 'S'"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
    <ProDrawer
      :visible.sync="roleDetailVis"
      :wrapperClosable="false"
      :title="rootFormState === 'add' ? '新增角色' : rootFormState === 'edit' ? '编辑角色' : '查看角色'"
      :size="540"
      @close="onDetailsClose"
      :show-close="true"
    >
      <div class="details-dialog">
        <RoleDetail
          v-if="roleDetailVis"
          ref="roleDetailRef"
          :editData="editData"
          :stepState="stepState"
          :rootFormState="rootFormState"
        ></RoleDetail>
      </div>
      <template #footer>
        <el-button type="primary" v-if="stepState !== '2' && stepState !== '3'" @click="onNextStep()">下一步</el-button>
        <el-button type="primary" v-if="stepState !== '1' && stepState !== '3'" @click="onLastStep()">上一步</el-button>
        <el-button type="primary" v-if="stepState === '2' && stepState !== '3'" @click="submitForm()">完成</el-button>
        <el-button @click="roleDetailVis = false">{{ stepState !== '3' ? '取 消' : '关 闭' }}</el-button>
      </template>
    </ProDrawer>
    <ProDialog
      :visible.sync="roleFlag"
      :title="rootFormState === 'add' ? '新增角色' : rootFormState === 'edit' ? '编辑角色' : '查看角色'"
      width="600px"
      :before-close="handleRoleClose"
      :close-on-click-modal="false"
      top="10vh"
    >
      <div v-if="roleFlag">
        <EditRoleDetail
          ref="editRoleDetail"
          :roleFlag="roleFlag"
          :editData="editData"
          :rootFormState="rootFormState"
        ></EditRoleDetail>
      </div>
      <template #footer>
        <el-button @click="handleRoleClose">取 消</el-button>
        <el-button type="primary" @click="onEditRoleDetailSubmitForm()"> 确 定 </el-button>
      </template>
    </ProDialog>
    <!-- root 新增 -->
    <ProDialog
      :visible.sync="rootFormFlag"
      :title="rootFormState === 'add' ? '新增角色模板' : rootFormState === 'edit' ? '编辑角色模板' : '查看角色模板'"
      width="600px"
      :before-close="handleRootClose"
      :close-on-click-modal="false"
      top="20vh"
    >
      <RootForm v-if="rootFormFlag" ref="RootFormRef" :editData="editData" :rootFormState="rootFormState"></RootForm>
      <template #footer>
        <el-button @click="handleRootClose">取 消</el-button>
        <el-button type="primary" @click="submitForm()"> 确 定 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProList, ProLayout, ProDrawer, ProDialog } from 'anx-vue'
import RoleDetail from './RoleDetail.vue'
import RootForm from './components/RootForm.vue'
import EditRoleDetail from './components/EditRoleDetail.vue'
import { onQueryRoles } from '@/api/modules/authority'
import {
  onQueryRole,
  getAllRoleOptions,
  onSaveRole,
  deleteRole,
  updateRoleStatus,
  getRoleDetailById,
} from '@/api/modules/systemAdmin'
export default {
  components: {
    ProDialog,
    ProList,
    ProLayout,
    RoleDetail,
    ProDrawer,
    RootForm,
    EditRoleDetail,
  },
  data() {
    return {
      rootFormState: 'add',
      rootFormFlag: false,
      roleFlag: false,
      stepState: '1',
      loading: false,
      tableDataList: [],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      // 角色级别
      characterLevelList: [],
      // 状态
      stateList: [],
      // 授权状态
      authorizationStatusList: [],
      // 添加时间
      joinDate: [],
      // 多选
      multipleSelection: [],
      roleDetailVis: false,
      nextStepFlag: false,
      editData: {},
      RoleDetailDisabled: false,
    }
  },
  computed: {
    model() {
      let temp = ''
      if (this.$IS_ROOT_ADMIN) {
        temp = 'root'
      } else if (this.$IS_ORG_ADMIN) {
        temp = 'noRoot'
      }
      return temp
    },
  },
  provide() {
    return {
      getRootFormFlag: this.getRootFormFlag,
      setRootFormFlag: this.setRootFormFlag,
      setRoleFlag: this.setRoleFlag,
      onInquire: this.onInquire,
      onNextStep: this.onNextStep,
      setRoleDetailVis: this.setRoleDetailVis,
    }
  },
  created() {
    this.getAllRoleOptions()
    this.onInquire()
  },
  methods: {
    goPage(row) {
      this.$router.push({
        name: 'roleAuthorization',
        query: {
          name: row.name,
        },
      })
    },
    getRootFormFlag() {
      return this.rootFormFlag
    },
    setRoleFlag(data) {
      this.roleFlag = data
    },
    setRoleDetailVis(data) {
      this.roleDetailVis = data
    },
    setRootFormFlag(data) {
      this.rootFormFlag = data
    },
    handleRoleClose() {
      this.roleFlag = false
      this.editData = {}
    },
    onNextStep() {
      console.log('this.refs.roleDetailRef', this.$refs.roleDetailRef)
      if (this.stepState === '1') {
        if (this.$refs.roleDetailRef.isAllowed()) {
          this.stepState = '2'
        } else {
          this.$message.error('请选择机构层级！')
        }
      } else {
        this.stepState = '3'
      }
    },
    onLastStep() {
      this.stepState = '1'
    },
    submitForm() {
      if (this.$IS_ROOT_ADMIN) {
        if (this.rootFormState === 'view') {
          this.rootFormFlag = false
        }
        // console.log('this.$refs.RootFormRef', this.$refs.RootFormRef)
        this.$refs.RootFormRef.submitForm()
      } else {
        // 111111111111111111111111
        let flag = this.$refs.roleDetailRef.submitForm()
        if (flag) {
          this.onNextStep()
        }
      }
    },
    onEditRoleDetailSubmitForm() {
      this.$refs.editRoleDetail.submitForm()
    },
    async onInquire() {
      try {
        this.loading = true
        const res = await onQueryRoles({
          ...this.queryParams,
          ...this.pageParams,
          createDateS: this.joinDate ? (this.joinDate[0] ? this.joinDate[0] + ' 00:00:00' : '') : '',
          createDateE: this.joinDate ? (this.joinDate[1] ? this.joinDate[1] + ' 23:59:59' : '') : '',
        })

        const { total, records } = JSON.parse(JSON.stringify(res.result))
        this.total = total
        records.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.tableDataList = records
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log('error', error)
      }
    },

    onDelete(row) {
      this.$confirm('确定要删除该角色吗', '提示', {}).then(async () => {
        try {
          const res = await deleteRole({ id: row.id })
          console.log('deleteRole==', res)
          if (res.code === -1) {
            console.log('22222222', 22222222)
            this.$message.error(res.desc)
          } else {
            this.$message.success('角色删除成功')
          }
          this.onInquire()
        } catch (error) {
          console.error(error)
        }
      })
    },
    // 关闭操作事件
    onDetailsClose() {
      this.editData = {}
      this.stepState = '1'
      this.roleDetailVis = false
      this.onInquire()
    },
    async getAllRoleOptions() {
      try {
        const res = await getAllRoleOptions()
        this.characterLevelList = res.result
      } catch (error) {
        console.log('error', error)
      }
    },
    resetQueryParams() {
      this.queryParams = {}
      this.joinDate = []
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.multipleSelection = []
      this.onInquire()
    },
    // 新增角色
    fnTheNewRole() {
      this.rootFormState = 'add'
      this.editData = {}
      if (this.$IS_ROOT_ADMIN) {
        this.rootFormFlag = true
      } else {
        this.stepState = '1'
        this.roleDetailVis = true
      }
    },
    // 编辑返显
    // async
    onEdit(row) {
      console.log(`onEdit`, JSON.parse(JSON.stringify(row)))
      this.rootFormState = 'edit'
      this.editData = JSON.parse(JSON.stringify(row))
      if (this.$IS_ROOT_ADMIN) {
        this.rootFormFlag = true
      } else {
        this.roleFlag = true
      }
    },
    onDetails(row) {
      console.log(`onDetails`, JSON.parse(JSON.stringify(row)))
      this.rootFormState = 'view'
      this.editData = JSON.parse(JSON.stringify(row))
      if (this.$IS_ROOT_ADMIN) {
        this.rootFormFlag = true
      } else {
        this.roleFlag = true
      }
    },
    // 批量停用
    async fnBatchOutage(row) {
      let ids = []
      if (row.id) {
        ids = [row.id]
      } else {
        ids = this.multipleSelection.map((item) => item.id)
      }
      if (ids.length === 0) {
        this.$message.error('请选择角色')
        return
      }
      try {
        const res = await updateRoleStatus({ ids })
        console.log('updateRoleStatus==', res)
        if (ids.length > 1) {
          this.$message.success('批量修改成功')
        } else {
          this.$message.success('修改成功')
        }
        if (!row.id) {
          this.clearFun()
        }
        this.onInquire()
      } catch (err) {
        console.error(err)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleRootClose() {
      this.rootFormFlag = false
    },
    clearFun() {
      this.multipleSelection = []
      this.$refs.singleTable.clearSelection()
    },
  },
}
</script>

<style lang="scss" scoped>
.RoleAdmin {
  .link {
    color: #446abd;
    text-decoration: underline;
    text-decoration-color: #446abd;
    cursor: pointer;
  }
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px !important;
  }

  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }

  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }

  .ProList {
    border-radius: 2px;
    // margin-top: 10px !important;
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
}
</style>
