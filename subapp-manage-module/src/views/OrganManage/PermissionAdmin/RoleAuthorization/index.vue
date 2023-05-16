<template>
  <div class="RoleAuthorization">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="15">
      <template #title>角色授权</template>
      <template #main>
        <div class="main">
          <div class="box-card-left">
            <header class="header">角色列表</header>
            <section class="body">
              <div class="sousuo">
                <div style="width: 130px">
                  <el-select v-model="authId" placeholder="请选择" @change="authChange()">
                    <el-option v-for="(item, index) in typeOptions" :key="item.value + index" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </div>
                <div style="margin-left: 4px">
                  <el-input v-model="roleName" placeholder="角色名称" @input="inputRoleName" suffix-icon="el-icon-search" clearable />
                </div>
              </div>
              <!-- <div class="radios"> -->
              <el-scrollbar style="height: calc(100vh - 240px)">
                <el-radio-group v-model="roleRadio" @change="roleRadioChange" style="width: 100%">
                  <div v-for="v in roleList" :key="v.id" class="radios-box">
                    <el-radio :label="v.id" style="padding-left: 10px; width: 100%; height: 30px; line-height: 30px">
                      <span class="name">{{ v.name }}</span>
                      <span style="float: right; padding-right: 10px">
                        <span :class="v.status === 'Y' ? 'green' : 'red'">{{ v.status === 'Y' ? '启用' : '停用' }}</span>
                        <span v-if="v.modifyFlg" class="modifyFlg">可编辑</span>
                      </span>
                    </el-radio>
                  </div>
                </el-radio-group>
              </el-scrollbar>
              <!-- </div> -->
            </section>
          </div>
          <div class="box-card-right" ref="rightHeight">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="菜单授权" name="activeMenu">
                <section class="name-box">
                  <span>角色模板名称：{{ menuNameObj.name }}</span>
                  <span style="margin-left: 30px">数据权限：{{ menuNameObj.authDesc }}</span>
                </section>
                <section class="alert">
                  <div class="left-icon">
                    <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
                    <div style="margin: 0 0 0 5px">共{{ menuObj.tot }}项，</div>
                    <div style="margin: 0 5px 0 0">本次已选中{{ multipleSelection.length }}项</div>
                    <el-button type="text" @click="resetChecked" style="margin: 0 5px 0 5px" v-if="modifyFlg"> 重置 </el-button>
                  </div>
                  <el-button type="primary" @click="onSaveRoleMenus"> 保存 </el-button>
                </section>

                <section class="title">
                  <div style="margin-left: 20px">模块名称</div>
                  <!-- <div style="margin-left: 317px">模块路径</div> -->
                </section>
                <section>
                  <el-scrollbar :style="{ height: scrollbarHeight }">
                    <el-radio-group v-model="indexId" style="width: 100%; padding-right: 10px">
                      <el-tree
                        ref="tree"
                        @check-change="checkChange"
                        :data="menuObj.menus"
                        show-checkbox
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false"
                        :props="defaultProps"
                        @check="handleCheck"
                      >
                        <div class="custom-tree-node" slot-scope="{ node, data }">
                          <div>{{ node.label }}</div>
                          <el-radio :label="data.id" v-if="node.checked && data.children && data.children.length === 0">设置首页</el-radio>
                          <!-- {{node.children}} -->
                          <!-- <div style="margin-right:200px">{{ node.label }}</div> -->
                          <!-- <div>
                          <el-button type="text" size="mini" @click="() => append(data)"> {{ data }} </el-button>
                          <el-button type="text" size="mini" @click="() => remove(node, data)"> Delete </el-button>
                        </div> -->
                        </div>
                      </el-tree>
                    </el-radio-group>
                  </el-scrollbar>
                  <!-- <el-tree :data="treeData" default-expand-all show-checkbox node-key="id" :props="defaultProps"> </el-tree> -->
                </section>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import { getRoleOptionsList, getRoleMenus, onSaveRoleMenus, onQueryRoleList } from '@/api/modules/systemAdmin'
export default {
  components: {
    ProLayout,
  },
  data() {
    return {
      menuNameObj: {},
      typeOptions: [],
      authId: '',
      indexId: '',
      form: {
        authId: '3fad093759674f539d5910a29b45ae4c',
      },
      roleName: '',
      roleRadio: '',
      roleList: [],
      menuObj: [],
      activeName: 'activeMenu',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      scrollbarHeight: '',
      multipleSelection: [],
      modifyFlg: false,
      defaultProps: {
        disabled: this.isdisabledFn,
      },
    }
  },
  mounted() {
    console.log('this.$route.query', this.$route.query)
    const { name } = this.$route.query
    if (name !== undefined) {
      this.roleName = name
    }
    this.setAuthIdDefaultValue()
    this.getRoleOptionsList()
    console.log('this.$refs.rightHeight', this.$refs.rightHeight.clientHeight)
    this.scrollbarHeight = this.$refs.rightHeight.clientHeight - 200 + 'px'
  },
  methods: {
    authChange() {
      this.getRoleOptionsList()
    },
    inputRoleName() {
      this.getRoleOptionsList()
    },
    isdisabledFn() {
      return !this.modifyFlg
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async onSaveRoleMenus() {
      console.log(this.$refs.tree.getCheckedKeys())
      if (this.$refs.tree.getCheckedKeys().length === 0) {
        this.$message.error('请选择菜单')
        return
      }
      if (!this.indexId) {
        this.$message.error('请设置跳转首页')
        return
      }
      let menuIds = this.$refs.tree.getCheckedNodes(false, true).map((_) => _.id)
      try {
        const res = await onSaveRoleMenus({
          selectedMenuIds: this.$refs.tree.getCheckedKeys(),
          roleId: this.roleRadio,
          menuIds: menuIds,
          authId: this.form.authId,
          indexId: this.indexId,
        })
        // 成功
        this.$message.success('保存成功')
        this.getRoleMenus([this.roleRadio])
        this.activeName = 'activeMenu'
      } catch (error) {
        console.log(error)
      }
    },
    async getRoleMenus(roleId) {
      try {
        const res = await getRoleMenus(roleId)
        this.menuObj = res.result
        console.log('getRoleMenus====', this.menuObj)
        this.form.authId = res.result.authId
        this.indexId = res.result.indexId || ''
        this.$refs.tree.setCheckedKeys(res.result.selectedIds)
        this.$nextTick(() => {
          this.multipleSelection = this.$refs.tree.getCheckedNodes(true, true)
        })
      } catch (error) {
        console.log(error)
      }
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    roleRadioChange(e, i) {
      console.log(
        'this.roleRadio=========',
        this.roleList.find((_) => _.id === this.roleRadio),
      )
      this.menuNameObj = this.roleList.find((_) => _.id === this.roleRadio)
      this.modifyFlg = this.roleList.find((_) => _.id === this.roleRadio).modifyFlg
      this.getRoleMenus([this.roleRadio])
    },
    async getRoleOptionsList() {
      try {
        const res = await onQueryRoleList({
          roleName: this.roleName,
          authId: this.authId,
        })
        this.roleList = res.result
        if (res.result.length === 0) {
          this.menuObj = {}
          this.menuNameObj = {}
          return
        }
        this.roleRadio = this.roleList[0].id
        this.menuNameObj = this.roleList[0]
        this.modifyFlg = this.roleList.find((_) => _.id === this.roleRadio).modifyFlg
        this.getRoleMenus([this.roleRadio])
      } catch (error) {
        console.log(error)
      }
    },
    checkChange() {
      this.multipleSelection = this.$refs.tree.getCheckedNodes(true, true)
    },
    handleCheck(node) {
      console.log(node)
    },
    setAuthIdDefaultValue() {
      if (this.$IS_ROOT_ADMIN || this.$IS_ORG_ADMIN) {
        this.typeOptions = [
          {
            value: '',
            label: '全部',
          },
          {
            value: '3fad093759674f539d5910a29b45ae4c',
            label: '集团',
          },
          {
            value: '12e1c7ef650f44ae9ca08fe17ea81c7f',
            label: '机构',
          },
        ]
        this.authId = ''
      } else {
        this.typeOptions = [
          {
            value: '12e1c7ef650f44ae9ca08fe17ea81c7f',
            label: '机构',
          },
        ]
        this.authId = '12e1c7ef650f44ae9ca08fe17ea81c7f'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.RoleAuthorization {
  .main {
    background: #f5f5f5;
    // padding: 10px;
    display: flex;
    height: calc(100% - 8px);
    .box-card-left {
      width: 400px;
      margin-right: 18px;
      background: #fff;
      // 圆角
      border-radius: 8px;
      .red {
        color: #909399;
      }
      .green {
        color: rgba(68, 104, 189, 100);
      }
      // box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      .header {
        padding: 10px;
        color: rgba(48, 49, 51, 100);
        font-size: 16px;
        border-bottom: 1px solid rgba(233, 233, 233, 100);
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
      background: #fff;
      border-radius: 8px;
      // box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      flex: 1;
      padding: 0 10px 10px 10px;
      ::v-deep.el-tree-node__content {
        display: flex;
        align-items: center;
        height: 36px !important;
        cursor: pointer;
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
      margin: 10px 0;
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
