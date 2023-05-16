<template>
  <div class="RoleAuthorization">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="15">
      <template #title>用户管理</template>
      <template #main>
        <div class="main">
          <div class="box-card-left">
            <header class="header">
              <div style="display: flex; justify-content: space-between; align-items: center">
                <div>组织目录</div>
                <i
                  class="el-icon-refresh"
                  style="color: #446abd; cursor: pointer; padding-left: 10px"
                  @click="getOrgTreev3"
                ></i>
                <span class="text">{{ directoryTot }}条</span>
              </div>
              <div>
                <el-dropdown placement="bottom">
                  <div>
                    <IconSvg iconClass="more" width="18" style="padding-top: 5px; cursor: pointer" />
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="buildData(true)"> 展开全部 </el-dropdown-item>
                    <el-dropdown-item @click.native="buildData(false)"> 折叠全部 </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </header>
            <section class="body">
              <div class="sousuo">
                <div>
                  <el-input
                    v-model="name"
                    placeholder="请输入目录名称"
                    suffix-icon="el-icon-search"
                    clearable
                    @input="nameChange"
                  />
                </div>
              </div>
              <div>
                <el-scrollbar :style="{ height: scrollbarHeight }">
                  <el-tree
                    ref="treeNode"
                    :data="treeData"
                    default-expand-all
                    node-key="id"
                    @node-click="handleNodeClick"
                    style="padding: 0 15px 0 0"
                    :expand-on-click-node="false"
                  >
                    <span
                      :title="node.label"
                      style="width: 100%; overflow: hidden; text-overflow: ellipsis"
                      slot-scope="{ node }"
                    >
                      <span>{{ node.label }}</span>
                    </span>
                  </el-tree>
                </el-scrollbar>
              </div>
            </section>
          </div>
          <div class="box-card-right" ref="rightHeight">
            <div class="header">用户列表</div>
            <main style="width: 100%">
              <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
                <template #header>
                  <el-input placeholder="登录名/姓名" v-model="queryParams.name" clearable />
                  <el-select placeholder="状态" v-model="queryParams.status" clearable>
                    <el-option label="已开启" value="1" />
                    <el-option label="未启用" value="0" />
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
                  <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
                  <OrgHosSelect
                    ref="hosRef"
                    v-model="queryParams.hosId"
                    :parentId="queryParams.orgId"
                    placeholder="机构"
                  ></OrgHosSelect>
                </template>
                <template #actions>
                  <el-button type="primary" @click="onInquire()">搜索</el-button>
                  <el-button @click="resetQueryParams">重置</el-button>
                </template>
                <template #batchActions>
                  <el-button type="primary" @click="addUser">新增</el-button>
                  <el-button @click="onResearchPrestore">批量停用</el-button>
                  <div class="alert" v-if="multipleSelection.length !== 0">
                    <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
                    <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
                    <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
                  </div>
                </template>

                <el-table
                  ref="singleTable"
                  v-adaptive="{ bottomOffset: 60 }"
                  height="0"
                  :data="userList"
                  border
                  v-loading="loading"
                  row-key="id"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="40" :reserve-selection="true" />
                  <el-table-column type="expand" v-if="!$IS_ROOT_ADMIN">
                    <template slot-scope="props">
                      <div v-for="(v, index) in props.row.orgRole3Dtos" :key="v.roleId" style="padding-left: 100px">
                        <span style="font-weight: bold">组织角色{{ index + 1 }}</span>
                        <span style="padding-left: 10px">{{ v.orgDesc }} - {{ v.roleName }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="序号" type="index" width="50">
                    <template slot-scope="scope">
                      <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="登录名" prop="loginName" width="110" />
                  <el-table-column label="姓名" prop="name" min-width="160" show-overflow-tooltip />
                  <el-table-column label="性别" prop="sexDesc" width="50" />
                  <el-table-column label="手机号码" prop="telephone" width="130" />
                  <el-table-column label="证件号码" prop="certificateNum" width="190" />
                  <el-table-column
                    v-if="$IS_ROOT_ADMIN"
                    label="角色"
                    prop="roleName"
                    width="150"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    v-if="$IS_ROOT_ADMIN"
                    label="所属组织"
                    prop="orgDesc"
                    width="150"
                    show-overflow-tooltip
                  />
                  <el-table-column label="添加人" prop="createUserName" show-overflow-tooltip />
                  <el-table-column label="添加时间" prop="createDate" width="180" />
                  <el-table-column label="状态" width="100" fixed="right">
                    <template slot-scope="{ row }">
                      <div style="display: flex; align-items: center; cursor: pointer" @click="fnSwitchState(row)">
                        <el-switch
                          :value="row.status"
                          :disabled="row.modifyFlg !== true"
                          :active-value="1"
                          :inactive-value="0"
                        />
                        <div style="margin-left: 10px">
                          {{ row.status === 1 ? '启用' : '停用' }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="{ row }">
                      <el-button type="text" @click="onDetails(row)">详情</el-button>
                      <el-button type="text" @click="onEdit(row)" :disabled="row.modifyFlg !== true">编辑</el-button>
                      <el-button type="text" @click="openResetPasswordDialog(row)">重置密码</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </ProList>
            </main>
          </div>
        </div>
      </template>
    </ProLayout>
    <!-- 重置密码弹窗 -->
    <ProDialog
      :visible.sync="resetPasswordFlag"
      title="重置密码"
      width="600px"
      :before-close="handleResetClose"
      :close-on-click-modal="false"
      top="30vh"
    >
      <div v-if="resetPasswordFlag">
        <el-form :model="resetPasswordForm" ref="resetPasswordFormRef" label-position="left" label-width="130px">
          <el-form-item label="登录密码：" prop="passwordType">
            <el-radio v-model="resetPasswordForm.passwordType" label="2">人工设置</el-radio>
            <el-radio v-model="resetPasswordForm.passwordType" label="1">系统生成</el-radio>
          </el-form-item>
          <el-form-item
            v-if="resetPasswordForm.passwordType === '2'"
            prop="password"
            label="人工设置密码："
            :rules="[{ required: true, validator: checkPassword, trigger: 'change' }]"
          >
            <el-input
              v-model="resetPasswordForm.password"
              placeholder="8-16位密码，区分大小写"
              autoComplete="new-password"
              clearable
              show-password
            ></el-input>
            <div class="intensity">
              <span class="psdText">密码强度</span>
              <span class="line" :class="[level.includes('low') ? 'low' : '']"></span>
              <span class="line" :class="[level.includes('middle') ? 'middle' : '']"></span>
              <span class="line" :class="[level.includes('high') ? 'high' : '']"></span>
              <div class="warningtext">密码应由8-16位数字、字母、符号组成。请不要使用容易被猜到的密码</div>
            </div>
          </el-form-item>
          <el-form-item
            label="确认密码："
            prop="confirmPassword"
            v-if="resetPasswordForm.passwordType === '2'"
            :rules="[
              {
                required: true,
                validator: checkConfirmPassword,
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              placeholder="请输入密码"
              v-model="resetPasswordForm.confirmPassword"
              type="password"
              autoComplete="new-password"
              clearable
              show-password
            />
          </el-form-item>
          <el-form-item
            v-if="resetPasswordForm.passwordType === '1'"
            prop="password"
            label="系统设置密码："
            :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
          >
            <el-input
              v-model="resetPasswordForm.password"
              style="width: 400px"
              disabled
              show-password
              type="password"
              autoComplete="new-password"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="handleResetClose">取 消</el-button>
        <el-button type="primary" @click="resetPasswordSubmitForm()"> 确 定 </el-button>
      </template>
    </ProDialog>
    <!-- 新增编辑 抽屉 -->
    <ProDrawer
      :visible.sync="userDetailVis"
      :wrapperClosable="false"
      :title="stateOfTheForm === 'add' ? '新增用户' : stateOfTheForm === 'edit' ? '编辑用户' : '用户详情'"
      :size="540"
      @close="onDetailsClose"
      :show-close="true"
    >
      <div class="details-dialog" v-if="userDetailVis">
        <el-scrollbar style="height: calc(100vh - 110px)">
          <UserDetail
            v-if="modifyPageType === 'ROOT'"
            ref="userDetailRef"
            :openResetPasswordDialog="openResetPasswordDialog"
            :editTheData="editTheData"
            :stateOfTheForm="stateOfTheForm"
            :certificateTypeList="certificateTypeList"
            :orgTreeList="orgTreeList"
          ></UserDetail>
          <OrgUserDetail
            v-else
            ref="userDetailRef"
            :openResetPasswordDialog="openResetPasswordDialog"
            :editTheData="editTheData"
            :stateOfTheForm="stateOfTheForm"
            :certificateTypeList="certificateTypeList"
            :orgTreeList="orgTreeList"
          ></OrgUserDetail>
        </el-scrollbar>
      </div>
      <template #footer>
        <el-button type="primary" v-if="!nextStepFlag" @click="nextStep()">下一步</el-button>
        <el-button type="primary" v-if="nextStepFlag" @click="lastStep()">上一步</el-button>
        <el-button
          type="primary"
          v-if="nextStepFlag && stateOfTheForm !== 'toView'"
          :loading="btnLoading"
          @click="submitForm()"
          >完成</el-button
        >
        <el-button @click="userDetailVis = false">取 消</el-button>
        <!-- <el-button type="primary" @click="submitForm('noFormRef')"> 确 定 </el-button> -->
      </template>
    </ProDrawer>
  </div>
</template>

<script>
import { ProLayout, ProList, ProDialog, ProDrawer } from 'anx-vue'
import UserDetail from './UserDetail.vue'
import OrgUserDetail from './OrgUserDetail.vue'
import {
  onQueryAccountList,
  onBatchStopAccounts,
  onSaveUserAccount,
  updateStatus,
  getOrgCascaderOptions,
  getDictionary,
  getUserAccountMes,
  onResetPassword,
  onSaveUserForRoot,
  onQueryUserMes,
  getOrgTreev3,
  getOrgForCreateUser,
  getRolesByOrgId,
  onSaveUserForOrg,
} from '@/api/modules/systemAdmin'
import { getEncryptsm3 } from '@/utils'

export default {
  components: {
    ProLayout,
    ProList,
    ProDialog,
    ProDrawer,
    UserDetail,
    OrgUserDetail,
  },
  data() {
    return {
      level: [],
      loading: false,
      directoryTot: 0,
      treeData: [],
      scrollbarHeight: 0,
      name: '',
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      multipleSelection: [],
      addDate: [],
      userList: [],
      // 重置密码表单
      resetPasswordForm: {
        passwordType: '2',
        password: '',
        confirmPassword: '',
      },
      resetPasswordFlag: false,
      userDetailVis: false,
      editTheData: {},
      stateOfTheForm: 'add',
      certificateTypeList: [],
      orgTreeList: [],
      nextStepFlag: false,
      modifyPageType: '',
      btnLoading: false,
    }
  },
  provide() {
    return {
      setUserDetailVis: this.setUserDetailVis,
      onInquire: this.onInquire,
      setBtnLoading: this.setBtnLoading,
    }
  },
  watch: {
    'resetPasswordForm.passwordType'(newValue, oldValue) {
      if (newValue === '1') {
        this.resetPasswordForm.password = '1111'
      } else {
        this.resetPasswordForm.password = ''
        this.resetPasswordForm.confirmPassword = ''
      }
    },
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
    if (this.$IS_ROOT_ADMIN) {
      this.getOrgCascaderOptions()
    }
    this.getDictionary()
    this.getOrgTreev3()
    this.scrollbarHeight = this.$refs.rightHeight.clientHeight - 120 + 'px'
  },
  methods: {
    nameChange() {
      this.getOrgTreev3()
    },
    setUserDetailVis(data) {
      this.userDetailVis = data
    },
    setBtnLoading(data) {
      this.btnLoading = data
    },
    // 提交表单
    async submitForm() {
      this.btnLoading = true
      if (this.$IS_ROOT_ADMIN) {
        // 由于一开始 userDetailRef 这个ref定义重名了，也是为了方便上一步下一步的操作
        // 这里onRootSubmitForm 是返回数据后调用保存接口 有这个方法说明是root创建的用户
        if (this.$refs.userDetailRef.onRootSubmitForm) {
          let data = JSON.parse(JSON.stringify(this.$refs.userDetailRef.onRootSubmitForm()))
          // }
          // if (Object.keys(data).length > 0) {
          console.log(`data`, JSON.parse(JSON.stringify(data)))
          if (data) {
            try {
              let onEncryptsm3 = getEncryptsm3() // 加密
              data.loginPwd = onEncryptsm3(data.loginPwd)
              await onSaveUserForRoot(data)
              this.$message.success('创建成功！')
              this.userDetailVis = false
              this.nextStepFlag = false
              this.onInquire()
              this.btnLoading = false
            } catch (error) {
              console.log('error', error)
              this.btnLoading = false
            }
          }
        } else {
          this.$refs.userDetailRef.onSubmitForm()
        }
      } else {
        this.$refs.userDetailRef.onSubmitForm()
      }
    },
    async resetPasswordSubmitForm() {
      console.log(`this.$refs.resetPasswordFormRef`, this.$refs.resetPasswordFormRef)
      console.log(`this.resetPasswordForm.passwordType`, this.resetPasswordForm.passwordType)

      const onSave = async () => {
        let onEncryptsm3 = getEncryptsm3() // 加密
        let tempLoginPwd = JSON.parse(JSON.stringify(this.resetPasswordForm.password))
        try {
          await onResetPassword({
            id: this.resetPasswordForm.id,
            loginPwd: onEncryptsm3(tempLoginPwd),
          })
          this.$message.success('密码重置成功！')
          this.handleResetClose()
        } catch (error) {
          console.log('error', error)
        }
      }
      // if (this.resetPasswordForm.passwordType !== undefined && this.resetPasswordForm.passwordType !== '') {
      //   temp_cr.push('loginPwd')
      //   temp_cr.push('confirmPassword')
      // }
      let flag = false
      if (this.resetPasswordForm.passwordType === '2') {
        this.$refs['resetPasswordFormRef'].validateField(['password', 'confirmPassword'], (valid) => {
          if (valid !== '') {
            flag = false
          } else {
            flag = true
          }
        })
      }
      if (flag) {
        onSave()
        return
      }
      this.$refs.resetPasswordFormRef.validate(async (valid) => {
        if (valid) {
          onSave()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addUser() {
      if (this.$IS_ROOT_ADMIN) {
        this.modifyPageType = 'ROOT'
      } else {
        this.modifyPageType = ''
      }
      this.userDetailVis = true
    },
    onDetailsClose() {
      this.editTheData = {}
      this.stateOfTheForm = 'add'
      this.nextStepFlag = false
      this.userDetailVis = false
    },
    nextStep() {
      if (this.$refs.userDetailRef.nextStep()) {
        this.nextStepFlag = true
      }
    },
    lastStep() {
      this.$refs.userDetailRef.stepState = '1'
      this.nextStepFlag = false
    },
    async fnSwitchState(row) {
      console.log(`row`, row.status)
      if (row.modifyFlg !== true) {
        return
      }
      try {
        const res = await updateStatus({
          userId: row.id,
          status: row.status === 1 ? 0 : 1,
        })
        this.$message.success('状态修改成功！')
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
    onDetails(row) {
      this.onEdit(row, true)
    },
    onEdit(row, flag) {
      for (let key in row) {
        if (row[key] === '/') {
          row[key] = ''
        }
      }
      this.stateOfTheForm = flag ? 'toView' : 'edit'
      this.editTheData = row
      this.modifyPageType = row.modifyPageType
      this.userDetailVis = true
    },
    onResearchPrestore() {},
    openResetPasswordDialog(row) {
      console.log('row', row)
      this.resetPasswordForm.passwordType = '2'
      this.resetPasswordForm.password = ''
      this.resetPasswordForm.id = row.id
      this.resetPasswordFlag = true
    },
    handleResetClose() {
      this.resetPasswordForm = { passwordType: '2', password: '' }
      this.resetPasswordFlag = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async onResearchPrestore() {
      if (!this.multipleSelection.length) {
        this.$message.error('请选择用户！')
        return
      }
      console.log('first', this.multipleSelection.length)
      let userIds = []
      userIds = this.multipleSelection.map((_) => _.id)
      console.log('userIds', userIds)
      try {
        const res = await onBatchStopAccounts({ userIds })
        this.$message.success('批量停用成功！')
        this.clearFun()
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
    // 组织 tree
    async getOrgCascaderOptions() {
      try {
        const res = await getOrgCascaderOptions()
        this.orgTreeList = res.result
      } catch (error) {
        console.log('error', error)
      }
    },
    async onInquire() {
      try {
        this.loading = true
        const res = await onQueryUserMes({
          // const res = await onQueryAccountList({
          ...this.queryParams,
          ...this.pageParams,
          createDateS: this.addDate ? (this.addDate[0] ? this.addDate[0] + ' 00:00:00' : '') : '',
          createDateE: this.addDate ? (this.addDate[1] ? this.addDate[1] + ' 23:59:59' : '') : '',
        })

        const { total, records } = res.result
        this.total = total
        records.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.userList = records
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log('error', error)
      }
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.pageParams.pageNum = 1
      this.pageParams.pageSize = 10
      this.addDate = []
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    async handleNodeClick(data) {
      if (data.orgId) {
        this.$set(this.queryParams, 'orgId', data.orgId)
        await this.$refs.orgRef.init()
        this.$set(this.queryParams, 'hosId', data.id)
        await this.$refs.hosRef.init()
      } else {
        this.$set(this.queryParams, 'orgId', data.id)
        await this.$refs.orgRef.init()
      }
      this.onInquire()
      console.log('handleNodeClick', JSON.parse(JSON.stringify(data)))
    },
    clearFun() {
      this.multipleSelection = []
      this.$refs.singleTable.clearSelection()
    },
    // 证件类型字典
    async getDictionary() {
      try {
        const res = await getDictionary({ code: 'CERTIFICATE_TYPE' })
        this.certificateTypeList = res.result
      } catch (error) {
        console.log('error', error)
      }
    },
    async getOrgTreev3() {
      console.log(`this.name`, this.name)
      try {
        const res = await getOrgTreev3({
          status: 'Y',
          name: this.name,
        })
        console.log('getOrgTreev3', res)
        this.treeData = res.result.treeData
        this.directoryTot = res.result.tot
        this.buildData()
      } catch (error) {
        console.error(`error`, error)
      }
    },
    buildData(flag) {
      const nodes = this.$refs.treeNode.store._getAllNodes()
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].expanded = flag
      }
    },
    // 校验密码
    checkPassword(rule, value, callback) {
      this.level = []
      if (!value) {
        return callback('密码不能为空')
      }
      if (value.length < 8) {
        return callback('密码不少于8位')
      }
      if (value.length > 20) {
        return callback('密码不大于16位')
      }
      // 校验是数字
      const regex1 = /^\d+$/
      // 校验字母
      const regex2 = /^[A-Za-z]+$/
      // 校验符号
      const regex3 = /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]+$/
      if (regex1.test(value)) {
        this.level.push('low')
        return callback('密码强度不足')
      } else if (regex2.test(value)) {
        this.level.push('low')
        return callback('密码强度不足')
      } else if (regex3.test(value)) {
        this.level.push('low')
        return callback('密码强度不足')
      } else if (/^[A-Za-z\d]+$/.test(value)) {
        this.level.push('low')
        this.level.push('middle')
        return callback('密码强度不足')
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\d]+$/.test(value)
      ) {
        this.level.push('low')
        this.level.push('middle')
        return callback('密码强度不足')
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z]+$/.test(
          value,
        )
      ) {
        this.level.push('low')
        this.level.push('middle')
        return callback('密码强度不足')
      } else if (
        /^[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、A-Za-z\d]+$/.test(
          value,
        )
      ) {
        this.level.push('low')
        this.level.push('middle')
        this.level.push('high')
      }
      return callback()
    },
    // 确认密码
    checkConfirmPassword(rule, value, callback) {
      if (!value) {
        return callback('请输入确认密码')
      }
      if (value != this.resetPasswordForm.password) {
        return callback('两次密码输入不一致，请重新输入')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.RoleAuthorization {
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px !important;
  }
  .main {
    background: #f5f5f5;
    // padding: 10px;
    display: flex;
    height: calc(100% - 8px);

    .box-card-left {
      width: 230px;
      margin-right: 18px;
      background: #fff;
      // 圆角
      border-radius: 4px;
      // box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      .header {
        padding: 10px;
        color: rgba(48, 49, 51, 100);
        font-size: 16px;
        border-bottom: 1px solid rgba(233, 233, 233, 100);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-button {
          padding: 4px !important;
        }

        .text {
          color: rgba(148, 148, 148, 100);
          font-size: 12px;
          padding-left: 10px;
        }
      }

      .body {
        .sousuo {
          padding: 10px 10px 20px 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .radios-box {
          // width: 100%;
          // height: 30px;
          // line-height: 30px;
          ::v-deep.is-checked {
            background: #f3f6ff;
          }
        }

        .modifyFlg {
          margin-left: 10px;
          padding: 0 3px 1px 3px;
          // line-height: 30px;
          border-radius: 2px;
          background-color: rgba(255, 255, 255, 100);
          color: rgba(68, 104, 189, 100);
          font-size: 10px;
          text-align: center;
          border: 1px solid rgba(68, 104, 189, 100);
        }
      }
    }

    .box-card-right {
      width: 1px;
      background: #fff;
      border-radius: 4px;
      // box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      flex: 1;
      // padding: 0 10px 10px 10px;

      ::v-deep.el-tree-node__content {
        display: flex;
        align-items: center;
        height: 36px !important;
        cursor: pointer;
      }

      .header {
        padding: 10px 10px;
        color: rgba(48, 49, 51, 100);
        font-size: 16px;
        border-bottom: 1px solid rgba(233, 233, 233, 100);
        position: relative;
      }

      .header:before {
        content: '';
        position: absolute;
        left: 0px;
        top: 15px;
        width: 4px;
        border-radius: 0 1px 1px 0;
        height: 16px;
        background-color: #134796;
      }

      // ::v-deep.el-tree-node:nth-child(even) {
      //   background-color: #f2f2f2;
      // }
      .title {
        display: flex;
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
        background-color: #f2f2f2;
        height: 36px;
        line-height: 36px;
      }

      .name-box {
        height: 40px;
        line-height: 40px;
        background-color: rgba(245, 245, 245, 100);
        color: rgba(48, 49, 51, 100);
        font-size: 14px;
        padding: 0 10px;
      }

      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
      }

      .flex-box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40px;
      }
    }

    .alert {
      display: flex;
      align-items: center;
      // margin: 10px 0;

      .left-icon {
        margin-right: 10px;
        display: flex;
        align-items: center;
        background-color: #ebf1fd;
        width: 100%;
        height: 32px;
        border: 1px solid #446abd;
      }
    }
  }
  .ProList {
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
  ::v-deep.ProDialog .title {
    padding-left: 10px;
  }
  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: 0;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }

  .intensity {
    .psdText {
      font-size: 14px;
      margin-right: 10px;
    }
    .line {
      display: inline-block;
      width: 48px;
      height: 4px;
      background: #d8d8d8;
      border-radius: 3px;
      margin-right: 8px;
      &.low {
        background: #f4664a;
      }
      &.middle {
        background: #ffb700;
      }
      &.high {
        background: #2cbb79;
      }
    }
    .level {
      margin: 0 16px 0 8px;
    }
    .warningtext {
      color: #5a5a5a;
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
</style>
<style scoped>
::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #606266;
  border-color: #606266;
}

::v-deep .el-radio__input.is-disabled.is-checked + span.el-radio__label {
  color: #606266;
}

::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #606266;
  border-color: #606266;
}

::v-deep .el-checkbox__input.is-disabled.is-checked + span.el-checkbox__label {
  color: #606266;
}

::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}

::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}

::v-deep .el-tag.el-tag--info {
  color: #606266;
}
</style>
