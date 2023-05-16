<template>
  <div class="UserDetail">
    <header class="flex">
      <div class="flex">
        <div>
          <div class="num-icon" :class="stepState === '1' ? 'num-icon-color1' : 'num-icon-color2'">1</div>
        </div>
        <div :class="stepState === '1' ? 'num-text-color1' : 'num-text-color2'">添加信息</div>
      </div>
      <div class="line"></div>
      <div class="flex">
        <div>
          <div class="num-icon" :class="stepState === '2' ? 'num-icon-color1' : 'num-icon-color2'">2</div>
        </div>
        <div :class="stepState === '2' ? 'num-text-color1' : 'num-text-color2'">配置角色</div>
      </div>
    </header>
    <div class="content" v-show="stepState === '1'">
      <div class="title">基本信息</div>
      <el-form
        :model="accountDetail"
        :rules="accountRules"
        ref="accountDetailForm"
        status-icon
        label-position="left"
        label-width="100px"
        class="el-from"
        :disabled="stateOfTheForm === 'toView'"
      >
        <el-form-item label="登录名：" prop="loginName">
          <el-input placeholder="请输入登录名" v-model="accountDetail.loginName" clearable />
        </el-form-item>
        <el-form-item label="所属组织：" prop="orgIds">
          <el-cascader
            ref="cascaderRef"
            :title="cascaderTitle()"
            v-model="accountDetail.orgIds"
            @change="orgIdChange"
            :options="orgTreeList"
            :props="{
              value: 'value',
              checkStrictly: true,
            }"
            clearable
            :disabled="stateOfTheForm !== 'add'"
          />
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input placeholder="请输入登录名" v-model="accountDetail.name" clearable />
          <!-- <el-select
            v-model="accountDetail.name"
            :disabled="editTheData && editTheData.userType === '1'"
            filterable
            allow-create
            placeholder="请输入姓名"
            @change="nameChange"
          >
            <el-option v-for="item in nameList" :key="item.LABEL" :label="item.LABEL" :value="item.VALUE"> </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select
            v-model="accountDetail.sex"
            :disabled="(editTheData && editTheData.userType === '1') || associatedUser"
            clearable
          >
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
            <el-option label="未知" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期：">
          <el-date-picker
            v-model="accountDetail.birthday"
            :disabled="(editTheData && editTheData.userType === '1') || associatedUser"
            type="date"
            value-format="yyyy-MM-dd"
            editable
            placeholder="选择选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="手机号码："
          prop="telephone"
          :rules="[{ required: true, validator: validatorPhone, trigger: 'blur' }]"
        >
          <el-input
            placeholder="请输入手机号码"
            :disabled="(editTheData && editTheData.userType === '1') || associatedUser"
            v-model="accountDetail.telephone"
            maxlength="11"
            show-word-limit
            clearable
          />
        </el-form-item>
        <!-- validator:
                accountDetail.certificateType === '1'
                  ? validatorAccountBook
                  : accountDetail.certificateType === '2'
                  ? validatorID
                  : validatorPassport, -->
        <!-- prop="certificateNum"
          :rules="[
            {
              required: accountDetail.certificateType !== undefined && accountDetail.certificateType !== '',
              message: '请输入证件号',
              trigger: 'blur',
            },
          ]" -->
        <el-form-item label="证件号码：">
          <el-select
            v-model="accountDetail.certificateType"
            :disabled="(editTheData && editTheData.userType === '1') || associatedUser"
            class="id-type"
          >
            <el-option v-for="v in certificateTypeList" :key="v.VALUE" :value="v.VALUE" :label="v.LABLE" />
          </el-select>
          <el-input
            placeholder="请输入证件号码"
            v-model="accountDetail.certificateNum"
            :disabled="(editTheData && editTheData.userType === '1') || associatedUser"
            clearable
            class="id-no"
          />
        </el-form-item>
        <el-form-item
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
          <el-input
            placeholder="请输入邮箱地址"
            v-model="accountDetail.email"
            :disabled="editTheData && editTheData.userType === '1'"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="isEdit" label="登录密码：">
          <el-button type="text" @click="parentResetPassword">重置密码</el-button>
        </el-form-item>
        <el-form-item
          label="登录密码："
          prop="passwordType"
          :show-message="false"
          v-if="stateOfTheForm === 'add' && !associatedUser"
        >
          <el-radio v-model="accountDetail.passwordType" label="1">系统生成</el-radio>
          <el-radio v-model="accountDetail.passwordType" label="2">人工设置</el-radio>
        </el-form-item>
        <el-form-item
          label="登录密码："
          prop="passwordType"
          :show-message="false"
          v-if="stateOfTheForm === 'edit' && associatedUser"
        >
          <el-button @click="parentResetPassword">重置密码</el-button>
        </el-form-item>
        <el-form-item
          label="密码："
          prop="loginPwd"
          v-if="accountDetail.passwordType === '2' && stateOfTheForm === 'add'"
          :rules="[{ required: accountDetail.passwordType === '2', validator: checkPassword, trigger: 'change' }]"
        >
          <el-input
            v-model="accountDetail.loginPwd"
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
        <el-form-item label="用户状态" prop="status">
          <el-switch v-model="accountDetail.status" :active-value="1" :inactive-value="0" />
          <span style="margin-left: 10px">{{ accountDetail.status === 1 ? '启用' : '停用' }}</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="content" v-show="stepState === '2'">
      <div class="title">角色信息</div>
      <el-form
        ref="roleDetailRef"
        :model="roleDetail"
        :rules="roleRules"
        status-icon
        label-position="left"
        label-width="130px"
        class="el-from"
        :disabled="stateOfTheForm === 'toView'"
      >
        <el-form-item label="配置角色：" prop="roleIds">
          <el-checkbox-group v-model="roleDetail.roleIds" @change="handleRoleCheckedChange">
            <el-checkbox v-for="v in allRoles" :label="v.value" :key="v.value">{{ v.label }} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="默认登录角色：" prop="defaultRoleId">
          <el-select v-model="roleDetail.defaultRoleId">
            <el-option v-for="v in defaultRoleList" :key="v.value" :value="v.value" :label="v.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            placeholder="请输入备注"
            v-model="roleDetail.roleDescribe"
            clearable
            type="textarea"
            maxlength="200"
            :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import validateMixin from './validate'
import ProTransfer from '../../../components/ProTransfer/ProTransfer.vue'
import { getRoleOptions, getDoctorOptions, getDoctorDetailById, getRolesByOrgId } from '@/api/modules/systemAdmin'
import { getEncryptsm3 } from '@/utils'

export default {
  mixins: [validateMixin],
  components: {
    ProTransfer,
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
      // 步骤状态
      stepState: '1',
      activeTab: 'account',
      accountDetail: {
        status: 1,
        loginPwd: '1111',
        passwordType: '1',
      },
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
        orgIds: [{ required: true, message: '请选择所属组织', trigger: 'change' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        passwordType: [{ required: true, message: '请选择登录密码类型', trigger: 'blur' }],
        status: [{ required: true, message: '请确定用户状态', trigger: 'blur' }],
      },
      roleDetail: {
        roleIds: [],
      },
      roleRules: {
        roleIds: [{ required: true, message: '请至少勾选一个角色', trigger: 'blur' }],
        defaultRoleId: [{ required: true, message: '请选择默认登录角色', trigger: 'blur' }],
      },
      allRoles: [],
      // 记录上一次左侧选中的数据
      theLastCheckArray: [],
      // 穿梭框左侧选中
      leftDefaultChecked: ['111'],
      checkAll: false,
      cities: [
        { id: '111', name: '系统管理员', disabled: false, disabledKey: '3' },
        { id: '2', name: '医院管理员', disabled: false, disabledKey: '' },
        { id: '3', name: '数据库管理员', disabled: true, disabledKey: '111' },
        { id: '4', name: '慢病主任', disabled: false, disabledKey: '' },
        { id: '5', name: '随访人员', disabled: false, disabledKey: '' },
      ],
      isIndeterminate: false,
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
  watch: {
    stepState(newValue, oldValue) {
      console.log(`this.accountDetail`, this.accountDetail)
      console.log(`newValue`, newValue)
    },
    'roleDetail.roleIds'(newValue, oldValue) {
      console.log('this.roleDetail.roleIds', this.roleDetail.roleIds)
      this.setDefaultRoleList()
    },
    'accountDetail.passwordType'(newValue, oldValue) {
      console.log('newValue', newValue)
      if (newValue === '2') {
        this.accountDetail.loginPwd = ''
      } else {
        this.accountDetail.loginPwd = '1111'
      }
    },
  },
  mounted() {
    console.log('this.editTheData', JSON.parse(JSON.stringify(this.editTheData)))
    // this.editTheData不等于{}
    if (Object.keys(this.editTheData).length !== 0) {
      this.isEdit = true
      console.log('111111', 111111)
      this.accountDetail = this.editTheData
      this.roleDetail = this.editTheData
      this.stepState = '1'
      console.log('this.roleDetail', this.roleDetail)

      this.$set(this.accountDetail, 'orgIds', this.editTheData.orgIds)
      if (this.editTheData.userType === '1') {
        let certificateType = '2c60fe69aedc45d9b192d4455a8fec03'
        this.$set(this.accountDetail, 'certificateType', certificateType)
      }
      console.log('this.accountDetail', this.accountDetail.orgIds)
    }
    console.log('this.orgTreeList', this.orgTreeList)
  },
  methods: {
    cascaderTitle() {
      return this.$refs.cascaderRef ? this.$refs.cascaderRef.inputValue : ''
    },
    setDefaultRoleList() {
      this.defaultRoleList = []
      console.log(`this.allRoles`, this.allRoles)
      console.log(`this.roleDetail.roleIds`, this.roleDetail.roleIds)
      this.allRoles.forEach((el) => {
        this.roleDetail.roleIds.forEach((item) => {
          if (item === el.value) {
            this.defaultRoleList.push(el)
          }
        })
      })
      if (this.defaultRoleList.length !== 0 && this.roleDetail.defaultRoleId !== '') {
        // this.roleDetail.defaultRoleId = this.defaultRoleList[0].value
        this.$set(this.roleDetail, 'defaultRoleId', this.defaultRoleList[0].value)
      }
    },
    nameChange() {
      if (this.stateOfTheForm === 'add' && this.nameList.find((_) => _.VALUE === this.accountDetail.name)) {
        this.accountDetail.id = this.accountDetail.name
        this.associatedUser = true
        this.getDoctorDetailById()
        console.log('22222222222222', 22222222222222)
      } else {
        this.associatedUser = false
      }
    },
    // 下一步 校验部分字段
    nextStep() {
      let flag = true
      let checkingRule = this.getCheckingRule()
      this.$refs['accountDetailForm'].validateField(checkingRule, (valid) => {
        if (valid !== '') {
          flag = false
        }
      })
      if (flag) {
        this.getRoleOptions()
        this.stepState = '2'
      }
      return flag
    },
    onRootSubmitForm() {
      let flag = true

      this.$refs['roleDetailRef'].validate((valid) => {
        if (valid) {
          flag = true
        } else {
          flag = false
          return false
        }
      })

      if (flag) {
        if (this.stateOfTheForm === 'edit') {
          this.accountDetail.loginPwd = ''
        } else {
          if (this.accountDetail.loginPwd !== '') {
            let onEncryptsm3 = getEncryptsm3()
            // this.accountDetail.loginPwd = onEncryptsm3(this.accountDetail.loginPwd)
          }
        }
        return { ...this.roleDetail, ...this.accountDetail }
      }
    },
    parentResetPassword() {
      this.openResetPasswordDialog({ id: this.editTheData.id })
    },
    handleRoleCheckedChange(value) {
      // if (value.length) {
      //   if (value.length >= this.theLastCheckArray.length) {
      //     let endCheck = value[value.length - 1]
      //     let temp = this.allRoles.find((_) => _.value === endCheck)
      //     if (temp.disabledKey === '') {
      //       this.theLastCheckArray = value
      //       return
      //     }
      //     let temp2 = this.allRoles.find((_) => _.value === temp.disabledKey)
      //     temp2.disabled = !temp2.disabled
      //     this.theLastCheckArray = value
      //   } else {
      //     let beNotCheck = this.theLastCheckArray.filter((item) => !value.some((ele) => ele === item))
      //     console.groupEnd()
      //     let temp = this.allRoles.find((_) => _.value === beNotCheck[0])
      //     if (temp.disabledKey === '') {
      //       this.theLastCheckArray = value
      //       return
      //     }
      //     let temp2 = this.allRoles.find((_) => _.value === temp.disabledKey)
      //     temp2.disabled = !temp2.disabled
      //     this.theLastCheckArray = value
      //   }
      // } else {
      //   this.allRoles.forEach((el) => {
      //     el.disabled = false
      //   })
      // this.theLastCheckArray = value
      // }
    },
    // 动态修改需要校验的字段
    getCheckingRule() {
      let temp_cr = ['loginName', 'orgIds', 'name', 'telephone']
      if (this.stateOfTheForm === 'add') {
        temp_cr.push('passwordType')
      }
      if (this.certificateNumRequired) {
        temp_cr.push('certificateNum')
      }
      if (this.accountDetail.email !== undefined && this.accountDetail.email !== '') {
        temp_cr.push('email')
      }
      if (this.accountDetail.age !== undefined && this.accountDetail.age !== '') {
        temp_cr.push('age')
      }
      if (this.accountDetail.certificateType !== undefined && this.accountDetail.certificateType !== '') {
        temp_cr.push('certificateType')
      }
      if (this.accountDetail.passwordType !== undefined && this.accountDetail.passwordType !== '') {
        temp_cr.push('loginPwd')
        temp_cr.push('confirmPassword')
      }
      return temp_cr
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
      if (value != this.accountDetail.loginPwd) {
        return callback('两次密码输入不一致，请重新输入')
      }
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
        // this.getDoctorOptions()
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

  .show_pwd {
    cursor: pointer;
    user-select: none;
    padding-right: 5px;
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
}

::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}

::v-deep .el-tag.el-tag--info {
  color: #606266;
}
</style>
