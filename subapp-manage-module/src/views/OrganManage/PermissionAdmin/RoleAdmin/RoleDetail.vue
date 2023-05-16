<template>
  <div class="UserDetail" v-if="!model">
    <header class="flex">
      <div class="flex">
        <div>
          <div class="num-icon" :class="stepState === '1' ? 'num-icon-color1' : 'num-icon-color2'">
            1
          </div>
        </div>
        <div :class="stepState === '1' ? 'num-text-color1' : 'num-text-color2'">数据权限</div>
      </div>
      <div class="line"></div>
      <div class="flex">
        <div>
          <div class="num-icon" :class="stepState === '2' ? 'num-icon-color1' : 'num-icon-color2'">
            2
          </div>
        </div>
        <div :class="stepState === '2' ? 'num-text-color1' : 'num-text-color2'">授权角色</div>
      </div>
      <div class="line"></div>
      <div class="flex">
        <div>
          <div class="num-icon" :class="stepState === '3' ? 'num-icon-color1' : 'num-icon-color2'">
            3
          </div>
        </div>
        <div :class="stepState === '3' ? 'num-text-color1' : 'num-text-color2'">创建完成</div>
      </div>
    </header>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="130px"
      class="demo-ruleForm"
    >
      <div class="content" v-show="stepState === '1'">
        <div class="title">数据权限</div>
        <div style="padding: 30px 30px 30px 10px">
          <el-form-item label="数据权限：" label-width="100px" prop="type">
            <div v-for="v in createRoleList" :key="v.id">
              <el-radio v-model="ruleForm.authId" :label="v.authId">{{ v.authDesc }}</el-radio>
              <div style="margin-left: 23px; color: rgba(145, 145, 145, 100); font-size: 14px">
                {{ v.description }}
              </div>
              <el-button v-if="v.authDesc === '机构'" @click="viewInstLevel"
                >查看机构层级</el-button
              >
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="content" v-show="stepState === '2'">
        <div class="title" style="display: flex; justify-content: space-between">
          <div>角色信息</div>
          <div style="color: rgba(68, 104, 189, 100); font-size: 12px">
            数据权限：{{ dataTypeDesc }}
          </div>
        </div>
        <div style="margin-top: 30px; padding-right: 20px">
          <el-form-item label="存为模板：" prop="isTemplate">
            <el-radio-group v-model="ruleForm.isTemplate">
              <el-radio label="Y">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色标签：">
            <el-select
              style="width: 100%"
              v-model="ruleForm.roleTagCodes"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择角色标签"
            >
              <el-option
                v-for="item in roleTags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色模板：">
            <div v-if="roles.length === 0">暂无数据</div>
            <div v-else>
              <div>
                <el-button type="text" @click="viewRole">预览角色授权</el-button>
              </div>
              <div>
                <el-checkbox-group v-model="ruleForm.roleTemplateIds">
                  <el-checkbox v-for="v in roles" :label="v.id" :key="v.id">{{
                    v.name
                  }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="定义：">
            <el-input type="textarea" v-model="ruleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <div style="display: flex; align-items: center; cursor: pointer">
              <el-switch v-model="ruleForm.status" active-value="Y" inactive-value="N"></el-switch>
              <div style="margin-left: 10px">{{ ruleForm.status === 'Y' ? '启用' : '停用' }}</div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="content" v-show="stepState === '3'">
        <div class="success" style="margin-top: 80px">
          <i class="el-icon-success" style="color: #4a8c2c; font-size: 24px"></i>
          角色创建成功！
        </div>
        <div
          style="
            text-align: center;
            color: rgba(145, 145, 145, 100);
            font-size: 14px;
            margin-top: 17px;
          "
        >
          {{
            ruleForm.roleTemplateIds.length !== 0
              ? '如需调整角色的菜单授权，请点击下方按钮'
              : '为确保角色的正常使用，建议您继续为此角色添加权限'
          }}
        </div>
        <div class="success">
          <el-button type="primary" @click="goPage()">{{
            ruleForm.roleTemplateIds.length !== 0 ? '调整角色授权项' : '为角色授权'
          }}</el-button>
        </div>
      </div>
    </el-form>
    <el-drawer
      title="预览"
      :append-to-body="true"
      :before-close="handleClose"
      :visible.sync="innerDrawer"
    >
      <div>
        <div>角色名称：{{ ruleForm.name }}</div>
        <div>
          <el-scrollbar :style="{ height: scrollbarHeight }">
            <el-tree
              ref="tree"
              :data="menus"
              show-checkbox
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
            >
              <div class="custom-tree-node" slot-scope="{ node }">
                <div>{{ node.label }}</div>
              </div>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :visible.sync="instLevelFlag"
      title="机构层级"
      width="600px"
      :before-close="handleInstLevelClose"
      :close-on-click-modal="false"
      top="20vh"
      append-to-body
    >
      <div v-if="instLevelFlag">
        <el-form :model="instLevelForm" :rules="rules" ref="instLevelForm" label-width="100px">
          <el-form-item label="系统机构层级" prop="instLevel">
            <el-tree
              ref="instLevelTree"
              default-expand-all
              check-strictly
              :data="orgLevels"
              show-checkbox
              node-key="id"
              @check="getCurrentNode"
            >
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="instLevelSubmitForm()"> 保 存 </el-button>
        <el-button @click="handleInstLevelClose">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ProDrawer, ProDialog } from 'anx-vue'
import {
  getSysDefaultRole,
  onInitCreateRole,
  onSaveRoleOrg,
  getRoleMenus,
  getDoctorOptions,
  getDoctorDetailById,
  getRoleTags,
} from '@/api/modules/systemAdmin'
import { getEncryptsm3 } from '@/utils'

export default {
  components: { ProDrawer, ProDialog },
  props: {
    stepState: {
      type: String,
    },
    model: {
      type: String,
    },
    rootFormState: {
      type: String,
    },
    editData: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      roleTags: [],
      orgLevels: [],
      instLevelForm: {},
      scrollbarHeight: 0,
      menus: [],
      instLevelFlag: false,
      innerDrawer: false,
      createRoleList: [],
      roleLevelsList: [],
      roles: [],
      ruleForm: {
        name: '',
        description: '',
        status: 'Y',
        authId: '',
        isTemplate: 'N',
        roleTemplateIds: [],
        orgLevel: [],
      },
      rules: {
        isTemplate: [{ required: true, message: '请选择是否存为模板', trigger: 'blur' }],
        name: [{ required: true, message: '请选择角色名称', trigger: 'blur' }],
      },
      theLastCheckArray: [],
    }
  },
  inject: ['setRoleDetailVis', 'onNextStep'],
  computed: {
    dataTypeDesc() {
      return JSON.parse(sessionStorage.getItem('currentRole')).authTypeDesc
    },
    authTypeDesc() {
      return JSON.parse(sessionStorage.getItem('currentRole')).authTypeDesc
    },
  },
  watch: {
    stepState(newValue, oldValue) {
      if (oldValue === '1') {
        if (this.rootFormState === 'add') {
          this.$refs['ruleForm'].resetFields()
        }
      }
    },
  },
  created() {},
  async mounted() {
    await this.getRoleTags()
    await this.onInitCreateRole()
    await this.getSysDefaultRole()
    console.log(`this.editData`, this.editData)
    if (this.rootFormState !== 'add') {
      for (const key in this.editData) {
        if (Object.hasOwnProperty.call(this.editData, key)) {
          const el = this.editData[key]
          if (key === 'orgLevel') {
            this.ruleForm.orgLevel.push(el)
            // this.$set(this.ruleForm, key, [el])
          } else {
            this.ruleForm[key] = el
            this.$set(this.ruleForm, key, el)
          }
        }
      }
      console.log(`this.ruleForm0000000000`, this.ruleForm)
    }
  },
  methods: {
    isAllowed() {
      let flag = true
      if (
        this.ruleForm.authId === '12e1c7ef650f44ae9ca08fe17ea81c7f' &&
        this.ruleForm.orgLevel.length === 0
      ) {
        flag = false
      }
      return flag
    },
    getCurrentNode(data) {
      console.log(`data`, data)
      let node = this.$refs.instLevelTree.getNode(data)
      console.log(`node`, node)
      this.childNodes(node)
      this.parentNodes(node)
      // //是否编辑的表示
      // // this.ruleForm.isEditorFlag = true
      // //编辑时候使用
      // this.ruleForm.orgLevel = this.$refs.instLevelTree.getCheckedKeys()
      // //无论编辑和新增点击了就传到后台这个值
      // this.ruleForm.orgLevel = this.$refs.instLevelTree
      //   .getCheckedKeys()
      //   .concat(this.$refs.instLevelTree.getHalfCheckedKeys())
    },
    //具体方法可以看element官网api
    childNodes(node) {
      if (node.checked === false) {
        let len = node.childNodes.length
        for (let i = 0; i < len; i++) {
          node.childNodes[i].checked = node.checked
          this.childNodes(node.childNodes[i])
        }
      }
    },
    parentNodes(node) {
      if (node.parent) {
        for (let key in node) {
          if (key == 'parent') {
            node[key].checked = true
            this.parentNodes(node[key])
          }
        }
      }
    },
    instLevelSubmitForm() {
      console.log(`this.$refs.instLevelTree`, this.$refs.instLevelTree)
      this.ruleForm.orgLevel = this.$refs.instLevelTree.getCheckedKeys()
      console.log(`this.ruleForm.orgLevel`, this.ruleForm.orgLevel)
      this.instLevelFlag = false
    },
    viewInstLevel() {
      this.instLevelFlag = true
      this.ruleForm.authId = this.createRoleList[1].authId
      if (this.rootFormState !== 'add') {
        this.$nextTick(() => {
          this.$refs.instLevelTree.setCheckedKeys(this.ruleForm.orgLevel, false)
          console.log(
            `this.$refs.instLevelTree.getNode(this.ruleForm.orgLevel[0])`,
            this.$refs.instLevelTree.getNode(this.ruleForm.orgLevel[0]),
          )
          this.parentNodes(this.$refs.instLevelTree.getNode(this.ruleForm.orgLevel[0]))
        })
      }
    },
    handleInstLevelClose() {
      this.instLevelFlag = false
    },
    async onInitCreateRole() {
      try {
        const res = await onInitCreateRole()
        this.createRoleList = res.result.authMap
        if (this.rootFormState === 'add') {
          this.ruleForm.authId = res.result.defaultAuthId
        }
        this.roles = res.result.roles
        this.orgLevels = res.result.orgLevels
        console.log(`this.orgLevels`, this.orgLevels)
      } catch (error) {
        console.log(`error`, error)
      }
    },
    async getRoleTags() {
      try {
        const res = await getRoleTags()
        this.roleTags = res.result
      } catch (error) {
        console.log(`error`, error)
      }
    },
    initRoleCheckedChange(data) {
      let temp = []
      data.forEach((el) => {
        if (this.roleLevelsList.find((_) => _.value === el)) {
          temp.push(this.roleLevelsList.find((_) => _.value === el).mutexRoleIds[0])
        }
      })
      temp.filter(Boolean).forEach((el) => {
        this.roleLevelsList.forEach((_) => {
          if (_.value === el) {
            _.disabled = true
          }
        })
      })
    },
    handleRoleCheckedChange(value) {
      console.log('value', value)
      if (value.length) {
        if (value.length >= this.theLastCheckArray.length) {
          let endCheck = value[value.length - 1]
          let temp = this.roleLevelsList.find((_) => _.value === endCheck)
          console.log('temp', temp)
          if (temp.disabledKey === '') {
            this.theLastCheckArray = value
            return
          }
          let temp2 = this.roleLevelsList.find((_) => _.value === temp.disabledKey)
          temp2.disabled = !temp2.disabled
          this.theLastCheckArray = value
        } else {
          let beNotCheck = this.theLastCheckArray.filter(
            (item) => !value.some((ele) => ele === item),
          )
          console.groupEnd()
          let temp = this.roleLevelsList.find((_) => _.value === beNotCheck[0])
          if (temp.disabledKey === '') {
            this.theLastCheckArray = value
            return
          }
          let temp2 = this.roleLevelsList.find((_) => _.value === temp.disabledKey)
          temp2.disabled = !temp2.disabled
          this.theLastCheckArray = value
        }
      } else {
        this.roleLevelsList.forEach((el) => {
          el.disabled = false
        })
        this.theLastCheckArray = value
      }
    },
    goPage() {
      this.$router.push({
        name: 'roleAuthorization',
        query: {
          name: this.ruleForm.name,
        },
      })
    },
    async getSysDefaultRole() {
      try {
        const res = await getSysDefaultRole()
        // let tempAllRoles = res.result
        // tempAllRoles.forEach((_) => {
        //   _.disabled = false
        //   _.disabledKey = _.mutexRoleIds[0] || ''
        // })
        // console.log('tempAllRoles', tempAllRoles)
        // this.roleLevelsList = tempAllRoles
        this.roleLevelsList = res.result
      } catch (error) {
        console.log('error', error)
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.onSaveRoleOrg()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async onSaveRoleOrg() {
      try {
        const res = await onSaveRoleOrg(this.ruleForm)
        this.$message.success(this.rootFormState === 'add' ? '创建成功！' : '修改成功！')
        console.log(`res`, res)
        this.onNextStep()
      } catch (error) {
        console.log('error', error)
      }
    },
    checkOnSubmitForm() {
      let flag = true
      let checkingRule = ['name']
      if (this.ruleForm.type === 'Q') {
        checkingRule.push('systemRoleIds')
      }
      console.log('checkingRule', checkingRule)
      this.$refs['ruleForm'].validateField(checkingRule, (valid) => {
        if (valid !== '') {
          flag = false
        }
      })
      if (flag) {
        return { flag, ruleForm: this.ruleForm }
      }
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    handleClose() {
      this.innerDrawer = false
    },
    async viewRole() {
      if (this.ruleForm.roleTemplateIds.length > 0) {
        this.innerDrawer = true
        this.$nextTick(() => {
          this.scrollbarHeight = document.body.clientHeight - 200 + 'px'
        })
        try {
          const res = await getRoleMenus(this.ruleForm.roleTemplateIds)
          this.menus = res.result.menus
          this.$refs.tree.setCheckedKeys(res.result.selectedIds)
          console.log(`res`, res)
        } catch (error) {}
      } else {
        this.$message.error('请选择角色模板')
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
  .success {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 25px;
  }
  .footer {
    position: absolute;
    bottom: 0;
    text-align: right;
    width: 100%;
    padding: 10px;
    border-top: 1px solid #e9e9e9;
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
