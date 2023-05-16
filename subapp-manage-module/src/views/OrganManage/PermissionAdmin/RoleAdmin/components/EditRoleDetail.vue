<template>
  <div>
    <el-form
      :disabled="rootFormState === 'view'"
      :model="editData"
      :rules="rules"
      ref="editData"
      label-width="100px"
    >
      <el-form-item label="角色ID" prop="code">
        <el-input v-model="editData.code" disabled></el-input>
      </el-form-item>
      <el-form-item label="数据权限" prop="authId">
        <div style="display: flex">
          <div v-for="v in createRoleList" :key="v.id" style="margin-right: 20px">
            <el-radio v-model="editData.authId" :label="v.authId">{{ v.authDesc }}</el-radio>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        label="机构层级"
        prop="orgLevel"
        v-if="editData.authId === '12e1c7ef650f44ae9ca08fe17ea81c7f'"
      >
        <el-tree
          style="margin-top: 7px"
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
      <el-form-item label="角色标签">
        <el-select
          style="width: 100%"
          v-model="editData.roleTagCodes"
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
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="editData.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单授权">
        <el-button type="text" @click="viewRole()">查看</el-button>
      </el-form-item>
      <el-form-item label="角色模板" prop="isTemplate">
        <el-radio-group v-model="editData.isTemplate">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
        <div v-if="editData.isTemplate === 'Y'">
          <div v-if="roles.length === 0">暂无数据</div>
          <div v-else>
            <div>
              <el-checkbox-group v-model="editData.roleTemplateIds">
                <el-checkbox v-for="v in roles" :label="v.id" :key="v.id">{{ v.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="定义">
        <el-input type="textarea" v-model="editData.description"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <div style="display: flex; align-items: center; cursor: pointer">
          <el-switch v-model="editData.status" active-value="Y" inactive-value="N"></el-switch>
          <div style="margin-left: 10px">{{ editData.status === 'Y' ? '启用' : '停用' }}</div>
        </div>
      </el-form-item>
    </el-form>
    <el-dialog
      width="30%"
      :visible.sync="innerDialog"
      append-to-body
      title="预览"
      :before-close="handleClose"
      top="10vh"
    >
      <div>
        <div>角色名称：{{ editData.name }}</div>
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
    </el-dialog>
  </div>
</template>

<script>
import {
  onInitCreateRole,
  getRoleTags,
  getRoleMenus,
  onSaveRoleOrg,
} from '@/api/modules/systemAdmin'
export default {
  props: {
    rootFormState: {
      type: String,
    },
    editData: {
      type: Object,
    },
  },
  data() {
    return {
      roles: [],
      roleTags: [],
      orgLevels: [],
      createRoleList: [],
      menus: [],
      innerDialog: false,
      scrollbarHeight: 0,
      rules: {
        code: [{ required: true, message: '请输入角色ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        authId: [{ required: true, message: '请选择数据权限', trigger: 'change' }],
        orgLevel: [{ required: true, message: '请选择系统机构层级', trigger: 'blur' }],
        roleTagCodes: [{ required: true, message: '请选择角色标签', trigger: 'change' }],
        isTemplate: [{ required: true, message: '请选择角色模板', trigger: 'change' }],
        menu: [{ required: true }],
      },
    }
  },
  inject: ['setRoleFlag', 'onInquire'],
  created() {},
  async mounted() {
    await this.getRoleTags()
    await this.onInitCreateRole()
    this.editData.orgLevel = [this.editData.orgLevel]
    if (this.editData.orgLevel[0] !== '/') {
      this.$nextTick(() => {
        this.$refs.instLevelTree.setCheckedKeys(this.editData.orgLevel, false)
        this.parentNodes(this.$refs.instLevelTree.getNode(this.editData.orgLevel[0]))
      })
    }
  },
  methods: {
    submitForm() {
      if (this.rootFormState === 'view') {
        this.setRoleFlag(false)
        return
      }
      console.log(`this.editData.orgLevel`, this.editData.orgLevel)
      this.$refs.editData.validate((valid) => {
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
        console.log(`this.editData`, this.editData)
        if (this.editData.authId === '12e1c7ef650f44ae9ca08fe17ea81c7f') {
          this.editData.orgLevel = this.$refs.instLevelTree.getCheckedKeys()
          if (this.editData.orgLevel.length === 0) {
            this.$message.error('请选择机构层级！')
            return
          }
        } else {
          this.editData.orgLevel = []
        }
        console.log(`this.editData.orgLevel`, this.editData.orgLevel)
        const res = await onSaveRoleOrg(this.editData)
        this.$message.success('修改成功！')
        this.setRoleFlag(false)
        this.onInquire()
        console.log(`res`, res)
      } catch (error) {
        console.log('error', error)
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getCurrentNode(data) {
      this.editData.orgLevel = this.$refs.instLevelTree.getCheckedKeys()
      console.log(`this.editData.orgLevel`,this.editData.orgLevel)
      console.log(`data`, data)
      let node = this.$refs.instLevelTree.getNode(data)
      console.log(`node`, node)
      this.childNodes(node)
      this.parentNodes(node)
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
    // 数据权限
    async onInitCreateRole() {
      try {
        const res = await onInitCreateRole()
        this.createRoleList = res.result.authMap
        if (this.rootFormState === 'add') {
          this.editData.authId = res.result.defaultAuthId
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
    async viewRole() {
      this.$router.push({
        name: 'roleAuthorization',
        query: {
          name: this.editData.name,
        },
      })
    },
    handleClose() {
      this.innerDialog = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
