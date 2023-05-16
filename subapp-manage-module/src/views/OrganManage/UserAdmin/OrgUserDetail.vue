<template>
  <div class="UserDetail">
    <header class="flex">
      <div class="flex">
        <div>
          <div class="num-icon" :class="stepState === '1' ? 'num-icon-color1' : 'num-icon-color2'">1</div>
        </div>
        <div :class="stepState === '1' ? 'num-text-color1' : 'num-text-color2'">配置角色</div>
      </div>
      <div class="line"></div>
      <div class="flex">
        <div>
          <div class="num-icon" :class="stepState === '2' ? 'num-icon-color1' : 'num-icon-color2'">2</div>
        </div>
        <div :class="stepState === '2' ? 'num-text-color1' : 'num-text-color2'">添加信息</div>
      </div>
    </header>
    <el-form
      ref="accountDetailRef"
      :model="accountDetail"
      :rules="accountRules"
      status-icon
      label-position="left"
      class="el-from"
      :disabled="stateOfTheForm === 'toView'"
    >
      <div class="content" v-show="stepState === '1'">
        <div class="title">用户角色</div>
        <div style="padding: 10px 20px">
          <el-form-item label="登录名：" label-width="90px" prop="loginName">
            <el-input placeholder="请输入登录名" v-model="accountDetail.loginName" clearable />
          </el-form-item>
          <el-form-item label="所属组织及组织角色：" label-width="170px" prop="orgRole3Dtos">
            <el-button type="text" @click="addRole()">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-table
              :data="accountDetail.orgRole3Dtos"
              border
              style="width: 100%"
              height="0"
              v-adaptive="{ bottomOffset: 400 }"
            >
              <el-table-column label="序号" type="index" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="orgDesc" label="组织"> </el-table-column>
              <el-table-column prop="roleName" label="组织角色"> </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="onDel(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="默认登录：" label-width="100px" prop="defaultOrgRoleId">
            <el-select v-model="accountDetail.defaultOrgRoleId" style="width: 100%">
              <el-option v-for="v in defaultRoleList" :key="v.value" :value="v.value" :label="v.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态" label-width="100px" prop="status">
            <el-switch v-model="accountDetail.status" :active-value="1" :inactive-value="0" />
            <span style="margin-left: 10px">{{ accountDetail.status === 1 ? '启用' : '停用' }}</span>
          </el-form-item>
          <el-form-item v-if="isEdit" label-width="100px" label="登录密码：">
            <el-button type="text" @click="parentResetPassword">重置密码 </el-button>
          </el-form-item>
          <el-form-item
            label="登录密码："
            label-width="100px"
            :show-message="false"
            v-if="stateOfTheForm === 'add' && !associatedUser"
          >
            <el-radio v-model="accountDetail.passwordType" label="1">系统生成 </el-radio>
            <el-radio v-model="accountDetail.passwordType" label="2">人工设置 </el-radio>
          </el-form-item>
          <el-form-item
            label="登录密码："
            label-width="100px"
            :show-message="false"
            v-if="stateOfTheForm === 'edit' && associatedUser"
          >
            <el-button @click="parentResetPassword">重置密码</el-button>
          </el-form-item>
          <el-form-item
            label="密码："
            prop="loginPwdNoSm3"
            v-if="accountDetail.passwordType === '2' && stateOfTheForm === 'add'"
            :rules="[{ required: accountDetail.passwordType === '2', validator: checkPassword, trigger: 'change' }]"
          >
            <el-input
              v-model="accountDetail.loginPwdNoSm3NoSm"
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
            v-if="accountDetail.passwordType === '2' && stateOfTheForm === 'add'"
            :rules="[
              {
                required: accountDetail.passwordType === '2',
                validator: checkConfirmPassword,
                trigger: 'blur',
              },
            ]"
          >
            <el-input
              placeholder="请输入密码"
              v-model="accountDetail.confirmPassword"
              type="password"
              autoComplete="new-password"
              clearable
              show-password
            />
          </el-form-item>
        </div>
      </div>
      <div class="content" v-show="stepState === '2'">
        <div class="title">基本信息</div>
        <div style="padding: 10px 20px">
          <el-form-item label="所属组织：" label-width="100px" prop="orgIds">
            <el-cascader
              ref="cascaderRef"
              :title="cascaderTitle()"
              v-model="accountDetail.orgIds"
              @change="orgIdChange"
              :options="newOrgList"
              :props="{
                value: 'value',
                checkStrictly: true,
              }"
              clearable
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="姓名：" label-width="100px" prop="name">
            <el-select
              v-model="accountDetail.name"
              filterable
              allow-create
              placeholder="请输入姓名"
              @change="nameChange"
              style="width: 100%"
            >
              <el-option
                v-for="item in nameList"
                :key="item.LABEL"
                :label="item.LABEL"
                :value="item.VALUE"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别：" label-width="100px" prop="sex">
            <el-select v-model="accountDetail.sex" :disabled="associatedUser" clearable style="width: 100%">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
              <el-option label="未知" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期：" label-width="100px">
            <el-date-picker
              style="width: 100%"
              v-model="accountDetail.birthday"
              :disabled="associatedUser"
              type="date"
              value-format="yyyy-MM-dd"
              editable
              placeholder="选择选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label-width="100px"
            label="手机号码："
            prop="telephone"
            :rules="[{ required: true, validator: validatorPhone, trigger: 'blur' }]"
          >
            <el-input
              placeholder="请输入手机号码"
              :disabled="associatedUser"
              v-model="accountDetail.telephone"
              maxlength="11"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item label="证件号码：" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-select style="height: 32px" v-model="accountDetail.certificateType" :disabled="associatedUser">
                  <el-option v-for="v in certificateTypeList" :key="v.VALUE" :value="v.VALUE" :label="v.LABLE" />
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-input
                  style="padding-left: 10px"
                  placeholder="请输入证件号码"
                  v-model="accountDetail.certificateNum"
                  :disabled="associatedUser"
                  clearable
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label-width="100px"
            label="邮箱地址："
            prop="email"
            :rules="[
              {
                required: accountDetail.email !== undefined && accountDetail.email !== '',
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: 'blur',
              },
            ]"
          >
            <el-input placeholder="请输入邮箱地址" v-model="accountDetail.email" :disabled="associatedUser" clearable />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <ProDialog
      :visible.sync="orgDialogFlag"
      title="重置密码"
      width="600px"
      :before-close="handleResetClose"
      :close-on-click-modal="false"
      top="30vh"
    >
      <div>
        <el-form :model="orgDialog" ref="orgDialogRef" label-position="left" label-width="130px">
          <el-form-item label="登录密码：" prop="passwordType">
            <el-radio v-model="orgDialog.passwordType" label="2">人工设置</el-radio>
            <el-radio v-model="orgDialog.passwordType" label="1">系统生成</el-radio>
          </el-form-item>
          <el-form-item
            v-if="orgDialog.passwordType === '2'"
            prop="password"
            label="人工设置密码："
            :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
          >
            <el-input v-model="orgDialog.password" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item
            v-else
            prop="password"
            label="系统设置密码："
            :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
          >
            <el-input
              v-model="orgDialog.password"
              style="width: 400px"
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
    <el-dialog width="35%" title="添加" :visible.sync="roleDialogFlag" append-to-body>
      <div>
        <div>登录名：{{ accountDetail.loginName }}</div>

        <el-form ref="addForm" :model="addForm" label-width="80px">
          <el-form-item label="所属组织">
            <el-cascader
              ref="addCascaderRef"
              @change="addFormOrgIdChange"
              v-model="addForm.orgIds"
              :options="addFormOrgList"
              clearable
              :props="{
                value: 'value',
                checkStrictly: true,
              }"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="组织角色">
            <div v-if="addForm.orgIds.length === 0">请选择所属组织</div>
            <div v-else>
              <el-checkbox-group v-model="addForm.roles">
                <el-checkbox v-for="v in addFormRoles" :key="v.value" :label="v.value">{{ v.label }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="addRoles()"> 完 成 </el-button>
        <el-button @click="handleAddFormClose">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ProDialog } from 'anx-vue'
import validateMixin from './validate'
import ProTransfer from '../../../components/ProTransfer/ProTransfer.vue'
import {
  getRoleOptions,
  getDoctorOptions,
  getDoctorDetailById,
  getRolesByOrgId,
  getOrgForCreateUser,
  onSaveUserForOrg,
} from '@/api/modules/systemAdmin'
import { getEncryptsm3 } from '@/utils'

export default {
  mixins: [validateMixin],
  components: {
    ProTransfer,
    ProDialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    stateOfTheForm: {
      type: String,
    },
    editTheData: {
      type: Object,
    },
    orgTreeList: {
      type: Array,
    },
    certificateTypeList: {
      type: Array,
    },
    openResetPasswordDialog: {
      type: Function,
    },
  },
  data() {
    return {
      level: [],
      orgDialog: {},
      orgDialogFlag: false,
      roleDialogFlag: false,
      // 步骤状态
      stepState: '1',
      activeTab: 'account',
      accountDetail: {
        status: 1,
        loginPwdNoSm3: '1111',
        passwordType: '1',
      },
      addForm: {
        orgIds: [],
        roles: [],
      },
      newOrgList: [],
      addFormOrgList: [],
      addFormRoles: [],
      accountRules: {
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur',
          },
        ],
        orgRole3Dtos: [{ required: true, message: '请选择所属组织及组织角色', trigger: 'blur' }],
        roleIds: [{ required: true, message: '请至少勾选一个角色', trigger: 'blur' }],
        defaultOrgRoleId: [{ required: true, message: '请选择默认登录角色', trigger: 'blur' }],
        orgIds: [{ required: true, message: '请选择所属组织', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        passwordType: [{ required: true, message: '请选择登录密码类型', trigger: 'blur' }],
        status: [{ required: true, message: '请确定用户状态', trigger: 'blur' }],
      },
      accountDetail: {
        loginName: '',
        roleIds: [],
        orgRole3Dtos: [],
        status: 1,
        loginPwdNoSm3: '1111',
        passwordType: '1',
        defaultOrgRoleId: '',
      },
      allRoles: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      nameList: [],
      associatedUser: false,
      defaultRoleList: [],
      isEdit: false,
    }
  },
  inject: ['setUserDetailVis', 'onInquire', 'setBtnLoading'],
  watch: {
    'accountDetail.roleIds'(newValue, oldValue) {
      console.log('this.accountDetail.roleIds', this.accountDetail.roleIds)
      this.setDefaultRoleList()
    },
    'accountDetail.passwordType'(newValue, oldValue) {
      console.log('newValue', newValue)
      if (newValue === '2') {
        this.accountDetail.loginPwdNoSm3 = ''
      } else {
        this.accountDetail.loginPwdNoSm3 = '1111'
      }
    },
  },
  async mounted() {
    await this.getOrgForCreateUser()
    let tempEdit = JSON.parse(JSON.stringify(this.editTheData))
    console.log('this.editTheData', JSON.parse(JSON.stringify(this.editTheData)))
    // this.editTheData不等于{}
    if (Object.keys(tempEdit).length !== 0) {
      this.isEdit = true
      console.log('1122', 111111)
      // this.accountDetail = tempEdit
      this.accountDetail = JSON.parse(JSON.stringify(tempEdit))
      this.stepState = '1'
      this.accountDetail.orgRole3Dtos = tempEdit.orgRole3Dtos

      let tempIds = new Set()
      console.log('this.accountDetail', this.accountDetail)
      console.log(`this.accountDetail.orgRole3Dtos`, this.accountDetail.orgRole3Dtos)
      this.accountDetail.orgRole3Dtos.forEach((el) => {
        el.parentIds.forEach((id) => {
          tempIds.add(id)
        })
      })
      this.$set(this.accountDetail, 'defaultOrgRoleId', tempEdit.defaultOrgId + tempEdit.defaultRoleId)
      console.log(`tempIds`, tempIds)
      this.newOrgList = this.filterTreeArray(this.addFormOrgList, [...tempIds])
      console.log(`this.newOrgList`, this.newOrgList)
      this.$set(this.accountDetail, 'orgIds', tempEdit.orgIds)
      if (tempEdit.userType === '1') {
        let certificateType = '2c60fe69aedc45d9b192d4455a8fec03'
        this.$set(this.accountDetail, 'certificateType', certificateType)
      }
      console.log('this.accountDetail===', this.accountDetail.orgIds)
      this.getDoctorOptions()
      if (tempEdit.userType === '1') {
        this.associatedUser = true
      }
    }
    console.log('this.orgTreeList', this.orgTreeList)
  },
  methods: {
    addRoles() {
      let temp = []
      this.addFormRoles.forEach((_) => {
        this.addForm.roles.forEach((el) => {
          if (_.value === el) {
            console.log(`_`, _)
            temp.push({
              ..._,
              setId: this.addForm.orgIds[this.addForm.orgIds.length - 1] + _.value,
            })
          }
        })
      })
      this.accountDetail.orgRole3Dtos.forEach((_) => {
        _.setId = _.orgId + _.roleId
      })
      function isRepeat(arr) {
        var hash = {}
        for (var i in arr) {
          if (hash[arr[i].setId]) {
            return true
          } else {
            hash[arr[i].setId] = true
          }
        }
        return false
      }
      let tempArr = temp.concat(this.accountDetail.orgRole3Dtos)
      if (isRepeat(tempArr)) {
        this.$message.error('已有相同的机构角色，请重新选择！')
        return
      }
      temp.forEach((el) => {
        this.accountDetail.orgRole3Dtos.push({
          orgDesc: this.$refs.addCascaderRef.inputValue,
          orgId: this.addForm.orgIds[this.addForm.orgIds.length - 1],
          roleId: el.value ? el.value : el.roleId,
          roleName: el.label ? el.label : el.roleName,
          parentIds: this.addForm.orgIds,
        })
      })
      let a = []
      let tempIds = new Set()
      this.accountDetail.orgRole3Dtos.forEach((el) => {
        if (Object.prototype.toString.call(el.parentIds) === '[object Array]') {
          el.parentIds.forEach((id) => {
            tempIds.add(id)
          })
          a = a.concat(el.parentIds)
        } else {
          a = a.concat([el.roleId])
        }
      })
      this.newOrgList = this.filterTreeArray(this.addFormOrgList, [...tempIds])
      this.setDefaultRoleList()
      this.handleAddFormClose()
    },
    filterTreeArray(tree, bList) {
      return tree
        .filter((item) => {
          return bList.indexOf(item.value) > -1
        })
        .map((item) => {
          item = Object.assign({}, item)
          if (item.children) {
            item.children = this.filterTreeArray(item.children, bList)
          }
          return item
        })
    },
    setDefaultRoleList() {
      let temp = JSON.parse(JSON.stringify(this.defaultRoleList))
      let temp2 = []
      console.log(`this.accountDetail.orgRole3Dtos`, this.accountDetail.orgRole3Dtos)
      this.accountDetail.orgRole3Dtos.forEach((_) => {
        console.log(`_`, _)
        temp2.push({
          defaultRoleId: _.roleId,
          defaultOrgId: _.orgId,
          value: _.orgId + _.roleId,
          label: _.orgDesc + ' - ' + _.roleName,
        })
      })
      temp = temp.concat(temp2)
      // console.log(`temp`, temp)
      console.log(`temp2`, temp2)
      this.defaultRoleList = []
      let map = new Map()
      for (let item of temp) {
        map.set(item.value, item)
      }
      // console.log(`map`, [...map.values()])
      let mapList = [...map.values()]
      mapList.forEach((el) => {
        this.defaultRoleList.push(el)
      })
      console.log(`this.defaultRoleList`, this.defaultRoleList)
      console.log(`this.accountDetail.defaultOrgRoleId`, this.accountDetail.defaultOrgRoleId)
      if (this.defaultRoleList.length !== 0 && this.accountDetail.defaultOrgRoleId === '') {
        console.log(`this.accountDetail.defaultOrgRoleId`, this.accountDetail.defaultOrgRoleId)
        // this.accountDetail.defaultOrgRoleId = this.defaultRoleList[0].value
        this.$set(this.accountDetail, 'defaultOrgRoleId', this.defaultRoleList[0].value)
      }
      if (this.defaultRoleList.length === 0) {
        this.accountDetail.defaultOrgRoleId = ''
      }
    },
    async getOrgForCreateUser() {
      try {
        const res = await getOrgForCreateUser()
        this.addFormOrgList = res.result
        // console.log(`this.addFormOrgList`, JSON.stringify(this.addFormOrgList))
      } catch (error) {
        console.log(`error`, error)
      }
    },
    async addFormOrgIdChange(e) {
      console.log(`e`, e)
      console.log(`this.addForm.orgIds`, this.addForm.orgIds)
      let node = this.$refs.addCascaderRef.getCheckedNodes()

      // console.log(`this.addFormOrgList`, this.addFormOrgList)
      console.log(`node`, node)
      if (this.addForm.orgIds.length) {
        this.$refs.addCascaderRef.dropDownVisible = false
        try {
          const res = await getRolesByOrgId({
            orgId: this.addForm.orgIds[this.addForm.orgIds.length - 1],
          })
          this.addFormRoles = res.result
          console.log(`this.addFormRoles`, this.addFormRoles)
        } catch (error) {
          console.log('error', error)
        }
      }
    },
    addRole() {
      this.roleDialogFlag = true
    },
    handleAddFormClose() {
      this.roleDialogFlag = false
      this.addForm = {
        orgIds: [],
        roles: [],
      }
    },
    handleResetClose() {},
    cascaderTitle() {
      return this.$refs.cascaderRef ? this.$refs.cascaderRef.inputValue : ''
    },
    nameChange() {
      if (this.stateOfTheForm === 'add' && this.nameList.some((_) => this.accountDetail.name === _.VALUE)) {
        this.accountDetail.id = this.accountDetail.name
        this.associatedUser = true
        this.getDoctorDetailById()
      }
      if (this.stateOfTheForm === 'edit') {
        if (this.nameList.some((_) => this.accountDetail.name === _.VALUE)) {
          this.$set(this.accountDetail, 'oldId', JSON.parse(JSON.stringify(this.accountDetail.id)))
          this.accountDetail.id = this.accountDetail.name
          if (this.accountDetail.oldId === this.accountDetail.id) {
            this.$set(this.accountDetail, 'oldId', '')
          }
          this.associatedUser = true
          this.getDoctorDetailById()
        } else {
          this.$set(this.accountDetail, 'oldId', JSON.parse(JSON.stringify(this.accountDetail.id)))
          this.$set(this.accountDetail, 'id', '')
          this.$set(this.accountDetail, 'sex', '')
          this.$set(this.accountDetail, 'birthday', '')
          // this.$set(this.accountDetail, 'telephone', '')
          this.$set(this.accountDetail, 'certificateType', '')
          this.$set(this.accountDetail, 'certificateNum', '')
          this.$set(this.accountDetail, 'email', '')
          // this.accountDetail.id = ''
          // this.accountDetail.sex = ''
          // this.accountDetail.birthday = ''
          // this.accountDetail.telephone = ''
          // this.accountDetail.certificateType = ''
          // this.accountDetail.certificateNum = ''
          // this.accountDetail.email = ''
          console.log(`this.accountDetail`, this.accountDetail)
          this.associatedUser = false
        }
      }
    },
    onDel(index) {
      // if (this.accountDetail.orgRole3Dtos.length===1) {
      //   this.$message.error('')
      // }
      this.accountDetail.orgRole3Dtos.splice(index, 1)
      let tempIds = new Set()
      this.accountDetail.orgRole3Dtos.forEach((el) => {
        el.parentIds.forEach((id) => {
          tempIds.add(id)
        })
      })

      // this.defaultRoleList.forEach((el, i) => {
      //   console.log(`el`, JSON.parse(JSON.stringify(el)))
      //   if (el.value === ) {
      //     this.defaultRoleList.splice(i, 1)
      //   }
      //   // el.parentIds.forEach((id) => {
      //   //   tempIds.add(id)
      //   // })
      // })
      this.defaultRoleList = []
      this.setDefaultRoleList()
      console.log(`tempIds`, tempIds)
      this.newOrgList = this.filterTreeArray(this.addFormOrgList, [...tempIds])
      // this.defaultRoleList = this.filterTreeArray(this.addFormOrgList, [...tempIds])
    },
    // 下一步 校验部分字段
    nextStep() {
      let flag = true
      // this.stepState = '2'
      // return flag
      let checkingRule = this.getCheckingRule()
      // this.$refs.accountDetailRef.validate((valid) => {
      //   console.log(`valid`, valid)
      //   if (!valid) {
      //     flag = false
      //   }
      // })
      this.$refs['accountDetailRef'].validateField(checkingRule, (valid) => {
        if (valid !== '') {
          flag = false
        }
      })
      if (flag) {
        // this.getRoleOptions()
        this.stepState = '2'
      }
      return flag
    },
    async onSubmitForm() {
      let flag = true
      let checkingRule = this.getCheckingRule()
      this.$refs['accountDetailRef'].validateField(checkingRule, (valid) => {
        if (valid !== '') {
          flag = false
        }
      })
      if (flag) {
        this.onSaveUserForOrg()
      }
    },
    async onSaveUserForOrg() {
      let orgRoles = []
      this.accountDetail.orgRole3Dtos.forEach((el) => {
        orgRoles.push({
          orgId: el.orgId,
          roleId: el.roleId,
        })
      })
      let onEncryptsm3 = getEncryptsm3() // 加密
      this.$set(this.accountDetail, 'orgRoles', orgRoles)
      this.$set(this.accountDetail, 'loginPwd', onEncryptsm3(this.accountDetail.loginPwdNoSm3))
      // 2022 10 18 新增
      this.defaultRoleList.forEach((el) => {
        if (el.value === this.accountDetail.defaultOrgRoleId) {
          this.$set(this.accountDetail, 'defaultRoleId', el.defaultRoleId)
          this.$set(this.accountDetail, 'defaultOrgId', el.defaultOrgId)
        }
      })
      console.log(`this.accountDetail`, this.accountDetail)

      try {
        const res = await onSaveUserForOrg(this.accountDetail)
        this.$message.success(this.stateOfTheForm === 'add' ? '创建成功！' : '修改成功！')
        this.setUserDetailVis(false)
        this.setBtnLoading(false)
        this.onInquire()
      } catch (error) {
        console.log(`error`, error)
        this.setBtnLoading(false)
        this.$set(this.accountDetail, 'loginPwd', onEncryptsm3(this.accountDetail.loginPwdNoSm3))
      }
    },
    parentResetPassword() {
      this.openResetPasswordDialog({ id: this.editTheData.id })
    },
    // 动态修改需要校验的字段
    getCheckingRule() {
      let temp_cr = ['loginName', 'orgRole3Dtos', 'defaultOrgRoleId', 'status', 'passwordType']
      if (this.stepState === '2') {
        temp_cr.push('orgIds')
        temp_cr.push('name')
        temp_cr.push('telephone')
      }

      // if (this.stateOfTheForm === 'add') {
      //   temp_cr.push('passwordType')
      // }
      // if (this.certificateNumRequired) {
      //   temp_cr.push('certificateNum')
      // }
      // if (this.accountDetail.email !== undefined && this.accountDetail.email !== '') {
      //   temp_cr.push('email')
      // }
      // if (this.accountDetail.age !== undefined && this.accountDetail.age !== '') {
      //   temp_cr.push('age')
      // }
      // if (
      //   this.accountDetail.certificateType !== undefined &&
      //   this.accountDetail.certificateType !== ''
      // ) {
      //   temp_cr.push('certificateType')
      // }
      if (this.accountDetail.passwordType !== undefined && this.accountDetail.passwordType !== '') {
        temp_cr.push('loginPwdNoSm3')
        temp_cr.push('confirmPassword')
      }
      return temp_cr
    },
    // 密码强度
    passwordTest(szPwd) {
      let num = 0
      let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》./~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      if (szPwd.match(/\d/g)) {
        num++
      }
      if (szPwd.match(/[a-z]/gi)) {
        num++
      }
      if (pattern.test(szPwd)) {
        num++
      }
      return num
    },
    resetFormValidate(formName) {
      this.$refs[formName].clearValidate()
    },
    validatePassword(rule, value, callback) {
      if (this.activeName === 'first') {
        if (value.length < 6 || value.length > 16) {
          this.$refs.tip.style.display = 'none'
          callback(new Error('密码位数为6位 ~ 16位'))
        } else if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (validate.PASSOWRD_REG_WEEK.test(value)) {
          this.$refs.level.innerText = '弱'
          this.$refs.tip.style.display = 'block'
          callback()
        } else if (validate.PASSOWRD_REG_MIDDLE.test(value)) {
          this.$refs.level.innerText = '中'
          this.$refs.tip.style.display = 'block'
          callback()
        } else if (validate.PASSOWRD_REG_POWER.test(value)) {
          this.$refs.level.innerText = '强'
          this.$refs.tip.style.display = 'block'
          callback()
        }
      } else {
        if (value.length < 6 || value.length > 16) {
          this.$refs.tip2.style.display = 'none'
          callback(new Error('密码位数为6位 ~ 16位'))
        } else if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (validate.PASSOWRD_REG_WEEK.test(value)) {
          this.$refs.level2.innerText = '弱'
          this.$refs.tip2.style.display = 'block'
          callback()
        } else if (validate.PASSOWRD_REG_MIDDLE.test(value)) {
          this.$refs.level2.innerText = '中'
          this.$refs.tip2.style.display = 'block'
          callback()
        } else if (validate.PASSOWRD_REG_POWER.test(value)) {
          this.$refs.level2.innerText = '强'
          this.$refs.tip2.style.display = 'block'
          callback()
        }
      }
    },
    orgIdChange() {
      if (this.accountDetail.orgIds.length) {
        this.$refs.cascaderRef.dropDownVisible = false
        console.log('this.accountDetail.orgIds', this.accountDetail.orgIds)
        this.getDoctorOptions()
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
      if (value != this.accountDetail.loginPwdNoSm3) {
        return callback('两次密码输入不一致，请重新输入')
      }
    },
    // 获取医生信息
    async getDoctorDetailById() {
      try {
        const res = await getDoctorDetailById({
          userId: this.accountDetail.id,
        })
        const { phone, birthday, identityNum, sex } = res.result
        let certificateType = '2c60fe69aedc45d9b192d4455a8fec03'
        this.$set(this.accountDetail, 'sex', sex)
        this.$set(this.accountDetail, 'birthday', birthday)
        this.$set(this.accountDetail, 'telephone', phone)
        this.$set(this.accountDetail, 'certificateNum', identityNum)
        this.$set(this.accountDetail, 'certificateType', certificateType)
        console.log('this.accountDetail', this.accountDetail)
      } catch (error) {
        console.log('error', error)
      }
    },
    // 获取姓名下拉框
    async getDoctorOptions(orgIds) {
      try {
        const res = await getDoctorOptions({
          orgIds: this.accountDetail.orgIds,
          status: this.stateOfTheForm === 'add' ? 'Y' : '',
        })
        this.nameList = res.result
      } catch (error) {
        console.log('error', error)
      }
    },
    async getRoleOptions() {
      let orgId = this.accountDetail.orgIds[this.accountDetail.orgIds.length - 1]
      try {
        const res = await getRolesByOrgId({ orgId })
        // let tempAllRoles = res.result;
        // tempAllRoles.forEach((_) => {
        //   _.disabled = false;
        //   _.disabledKey = _.mutexRoleIds[0] || "";
        // });
        // // console.log('tempAllRoles', tempAllRoles)
        this.allRoles = res.result
        this.setDefaultRoleList()
      } catch (error) {
        console.log('error', error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.UserDetail {
  margin-top: 20px;

  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .line {
    width: 76px;
    height: 1px;
    background: #bfbfbf;
    margin: 0 10px;
  }

  .num-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    line-height: 17px;
    font-size: 12px;
    text-align: center;
    border-radius: 15px;
  }

  .num-text-color1 {
    color: #303133;
    margin-left: 10px;
  }

  .num-text-color2 {
    color: #bfbfbf;
    margin-left: 10px;
  }

  .num-icon-color1 {
    color: #fff;
    border: 1px solid rgba(68, 104, 189, 100);
    background: #4468bd;
  }

  .num-icon-color2 {
    color: #bfbfbf;
    border: 1px solid #bfbfbf;
    background: #fff;
  }

  .tab {
    width: 260px;
    height: 32px;
    line-height: 32px;
    margin: 14px auto;
    border-radius: 16px;
    background: #f7f7f7;
    display: flex;

    .tab-item {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #333333;
      cursor: pointer;

      &.active {
        background: #4469bd;
        color: #fff;
        font-weight: bold;
        border-radius: 16px;
      }
    }
  }

  .content {
    margin-top: 20px;
    .title {
      padding: 0 13px;
      line-height: 40px;
      background: #f5f5f5;
      color: #101010;
    }

    .el-from {
      padding: 20px 13px;

      ::v-deep.el-select {
        width: 100%;
      }

      ::v-deep.el-cascader {
        width: 100%;
      }

      .id-type {
        width: 150px;
      }

      .id-no {
        width: 250px;
        margin-left: 12px;
      }

      ::v-deep.el-transfer-panel {
        width: 176px;

        .el-checkbox__label {
          font-size: 14px;
        }
      }

      ::v-deep.el-transfer__buttons {
        padding: 0 5px;

        button {
          display: block;
          margin: 5px 0;
          width: 24px;
          height: 24px;
          padding: 0;
        }
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    text-align: right;
    width: 100%;
    padding: 10px;
    border-top: 1px solid #e9e9e9;
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
<style lang="scss">
.UserDetail {
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: #606266 !important;
    // -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
  }

  input {
    background-color: transparent;
  }

  input:-webkit-autofill {
    // -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-text-fill-color: #606266 !important;
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
  height: 32px !important;
}

::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}

::v-deep .el-tag.el-tag--info {
  color: #606266;
}
</style>
