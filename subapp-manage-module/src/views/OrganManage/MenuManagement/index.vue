<template>
  <div class="MenuManagement">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="0">
      <template #title>菜单管理</template>
      <template #main>
        <div class="menu-manage">
          <!-- 选择应用 -->
          <div class="application">
            <el-select v-model="applicationValue" placeholder="请选择应用" @change="appChange">
              <el-option
                v-for="item in applicationData"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <!-- <el-button type="primary" size="small" @click="appChange">搜索</el-button> -->
          </div>
          <!-- 菜单列表 -->
          <el-card class="menu">
            <header class="card-menu-header">
              <div style="display: flex; justify-content: space-between">
                <div>
                  <div v-if="applicationId == ''">菜单列表</div>
                  <el-tag v-else>{{ getAppById(applicationId) }}</el-tag>
                </div>
                <!-- <el-button type="primary" icon="el-icon-plus" plain></el-button> -->
                <div>
                  <el-button type="primary" icon="el-icon-plus" @click="addMenu1"></el-button>
                </div>
              </div>
            </header>
            <div class="tree">
              <el-scrollbar v-loading="menuLoading" style="height: 800px">
                <el-tree
                  ref="tree"
                  node-key="path"
                  :data="menuData"
                  :props="treeProps"
                  :expand-on-click-node="false"
                  :default-expanded-keys="treeNodeExpand"
                  highlight-current
                  default-expand-all
                >
                  <span slot-scope="{ node }" class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button
                        type="text"
                        icon="el-icon-plus"
                        @click="menuAdd(node.data)"
                      ></el-button>
                      <el-button
                        type="text"
                        icon="el-icon-edit-outline"
                        @click="menuEdit(node.data)"
                      ></el-button>
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        @click="onDeleteMenu(node.data)"
                      ></el-button>
                    </span>
                  </span>
                </el-tree>
              </el-scrollbar>
            </div>
          </el-card>
          <!-- 基本信息 -->
          <el-card class="info">
            <header class="card-menu-header">基本信息</header>
            <el-form
              label-width="100px"
              ref="infoForm"
              :model="infoForm"
              :rules="infoFormRules"
              v-loading="infoLoading"
            >
              <el-form-item label="父节点">
                {{ applicationName }}
                <!-- <el-input v-model="applicationName" readonly></el-input> -->
              </el-form-item>
              <el-form-item label="菜单标题" prop="title">
                <el-input v-model="infoForm.title"></el-input>
              </el-form-item>
              <el-form-item label="app名称" prop="name">
                <el-input v-model="infoForm.name"></el-input>
              </el-form-item>
              <el-form-item label="菜单路径" prop="path">
                <el-input v-model="infoForm.path"></el-input>
              </el-form-item>
              <el-form-item label="seq" prop="seq">
                <el-input v-model="infoForm.seq"></el-input>
              </el-form-item>
              <el-form-item label="icon">
                <el-input v-model="infoForm.icon"></el-input>
                <el-alert
                  title="https://www.iconfont.cn 医共体/医联体菜单图标"
                  type="success"
                  :closable="false"
                >
                </el-alert>
              </el-form-item>
              <el-form-item label="面包屑">
                <el-switch
                  v-model="infoForm.breadcrumb"
                  active-value="Y"
                  inactive-value="N"
                ></el-switch>
                <span style="position: relative">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="面包屑是否可点击跳转"
                    placement="top"
                  >
                    <IconSvg
                      iconClass="prompt"
                      width="18"
                      style="position: absolute; top: -1px; left: 10px; cursor: pointer"
                    />
                  </el-tooltip>
                </span>
              </el-form-item>
              <el-form-item label="lastNode">
                <el-switch
                  v-model="infoForm.lastNode"
                  active-value="Y"
                  inactive-value="N"
                ></el-switch>
                <span style="position: relative">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="是否为最后一个节点，最后节点下菜单不显示在侧边栏菜单中"
                    placement="top"
                  >
                    <IconSvg
                      iconClass="prompt"
                      width="18"
                      style="position: absolute; top: -1px; left: 10px; cursor: pointer"
                    />
                  </el-tooltip>
                </span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="infoSave">保存</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg } from 'anx-vue'
import {
  getApplicationList,
  getMenuList,
  getMenuInfo,
  addMenu,
  updateMenu,
  deleteMenu,
} from '@/api/modules/authority'
import { getAllMenu, onSaveMenu, onDeleteMenu } from '@/api/modules/systemAdmin'

export default {
  name: 'MenuManagement',
  components: { ProLayout },
  data() {
    return {
      applicationName: '',
      applicationValue: '', //菜单下拉框id
      applicationId: '', //当前选择的菜单id
      applicationData: [], //应用列表
      menuData: [], //菜单列表
      treeNodeExpand: [], //菜单默认展开的节点
      menuLoading: false,
      treeProps: {
        label: (data) => {
          return data.meta.title
        },
      },
      parentId: '',
      infoForm: {
        parentId: '',
        name: '',
        path: '',
        title: '',
        icon: '',
        breadcrumb: 'N',
        lastNode: 'N',
        seq: '',
      }, //基本信息
      fileList: [],
      infoFormRules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
        path: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        seq: [{ required: true, message: '请输入菜单顺序', trigger: 'blur' }],
      }, //基本信息-规则
      infoLoading: false,
    }
  },
  mounted() {
    this.getApplicationList()
  },
  methods: {
    infoSave() {
      this.$refs['infoForm'].validate(async (valid) => {
        if (valid) {
          console.log('this.infoForm', this.infoForm)
          const res = await onSaveMenu({ ...this.infoForm })
          this.$message.success('保存成功')
          this.getAllMenu()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // // 新增
    menuAdd(data) {
      console.log('data', data)
      this.$refs.infoForm.resetFields()
      this.applicationName = data.meta.title
      this.infoForm = {
        parentId: data.id,
        name: data.name ? data.name : '',
        path: data.path,
        title: '',
        icon: '',
        breadcrumb: 'N',
        lastNode: 'N',
        seq: '',
      }
      console.log('this.infoForm', this.infoForm)
      // this.$message('请在基本信息中编辑  ' + data.meta.title + '  下的子菜单')
    },
    // 编辑
    menuEdit(data) {
      this.$refs.infoForm.resetFields()
      this.applicationName = data.parentName
      // console.log('data', data)
      this.infoForm = {
        id: data.id,
        parentId: data.parentId,
        name: data.name,
        path: data.path,
        title: data.meta.title,
        icon: data.meta.icon,
        breadcrumb: data.meta.breadcrumb === false ? 'N' : 'Y',
        lastNode: data.meta.lastNode === false ? 'N' : 'Y',
        seq: data.seq,
      }
      // console.log('menuEdit', JSON.parse(JSON.stringify(this.infoForm)))
    },
    // // 添加一级菜单
    addMenu1() {
      if (this.applicationValue == '') {
        this.$message.warning('请选择应用')
      } else {
        this.$refs.infoForm.resetFields()
        this.infoForm = {
          parentId: this.parentId,
          name: '',
          path: '',
          title: '',
          icon: '',
          breadcrumb: 'N',
          lastNode: 'N',
          seq: '',
        }
        this.applicationName = this.applicationData.filter((_) => {
          return this.applicationValue === _.id
        })[0].name
        console.log('this.infoForm', this.infoForm)
        // this.fileList = []
        // let name = this.getAppById(this.applicationId)
        // this.$message('请在基本信息中编辑 ' + this.applicationName + ' 下的一级菜单')
      }
    },
    async getAllMenu() {
      try {
        const res = await getAllMenu({
          appId: this.applicationValue,
        })
        this.parentId = this.applicationValue
        // 过滤 名字
        this.applicationName = this.applicationData.filter((_) => {
          return this.applicationValue === _.id
        })[0].name
        this.menuData = res.result
        this.addMenu1()
      } catch (error) {
        console.log('error', error)
      }
    },
    onDeleteMenu(data) {
      console.log('data', data.id)
      this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          try {
            const res = await onDeleteMenu({ id: data.id })
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getAllMenu()
          } catch (error) {
            console.log('error', error)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async getApplicationList() {
      try {
        const res = await getApplicationList()
        this.applicationData = res.result
        if (!this.applicationValue) {
          console.log('22222222222', 22222222222)
          this.applicationValue = res.result[0].id
          this.applicationName = res.result[0].name
          this.parentId = res.result[0].id
        }
        this.getAllMenu()
      } catch (error) {
        console.log('error', error)
      }
    },
    // 选择应用
    appChange() {
      if (this.applicationValue === '') {
        this.$message('请选择应用')
      } else {
        // this.$store.commit('menuManageIdChange', this.applicationValue)
        // this.applicationId = this.applicationValue
        this.getAllMenu()
      }
    },
    // // 获取菜单列表
    // getMenu(appId, menuId) {
    //   this.menuLoading = true
    //   getMenuList({ parentId: appId })
    //     .then((res) => {
    //       if (res.code == 0) {
    //         this.menuData = res.result
    //         if (menuId) {
    //           this.treeNodeExpand = [menuId]
    //           this.$nextTick(() => {
    //             this.$refs.tree.setCurrentKey(menuId)
    //           })
    //         } else {
    //           this.treeNodeExpand = []
    //         }
    //       }
    //       this.menuLoading = false
    //     })
    //     .catch(() => {
    //       this.menuLoading = false
    //     })
    // },
    // // 获取基本信息
    // getInfo(id) {
    //   this.infoLoading = true
    //   getMenuInfo({ id: id })
    //     .then((res) => {
    //       if (res.code == 0) {
    //         this.infoForm = res.result
    //         this.fileList = res.result.logoPath == '' ? [] : [{ url: res.result.logoPath }]
    //         this.infoForm.state = 'edit'
    //       }
    //       this.infoLoading = false
    //     })
    //     .catch(() => {
    //       this.infoLoading = false
    //     })
    // },

    // // 删除
    // menuDelete(data) {
    //   this.$confirm('是否确认删除菜单' + data.name + '?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   })
    //     .then(() => {
    //       this.infoLoading = true
    //       deleteMenu({ id: data.id })
    //         .then((res) => {
    //           if (res.code == 0) {
    //             this.$message.success('删除成功')
    //             this.getMenu(this.applicationId)
    //             this.$refs.infoForm.resetFields()
    //             this.infoForm = {}
    //             this.fileList = []
    //           }
    //           this.infoLoading = false
    //         })
    //         .catch(() => {
    //           this.infoLoading = false
    //         })
    //     })
    //     .catch(() => {})
    // },
    // // 保存
    // infoSave() {
    //   this.$refs.infoForm.validate((valid) => {
    //     if (valid) {
    //       if (this.infoForm.state == undefined) {
    //         this.$message.warning('请选择上级菜单或应用')
    //       } else if (this.infoForm.state === 'add') {
    //         this.infoLoading = true
    //         addMenu(this.infoForm)
    //           .then((res) => {
    //             if (res.code == 0) {
    //               this.$message.success('新增成功')
    //               this.getMenu(this.applicationId, res.result)
    //               this.getInfo(res.result)
    //             } else {
    //               this.infoLoading = false
    //             }
    //           })
    //           .catch(() => {
    //             this.infoLoading = false
    //           })
    //       } else {
    //         // 编辑
    //         this.infoLoading = true
    //         updateMenu(this.infoForm)
    //           .then((res) => {
    //             if (res.code == 0) {
    //               this.$message.success('保存成功')
    //               this.getMenu(this.applicationId, res.result)
    //               this.getInfo(res.result)
    //             } else {
    //               this.infoLoading = false
    //             }
    //           })
    //           .catch(() => {
    //             this.$message.error('保存失败')
    //             this.infoLoading = false
    //           })
    //       }
    //     } else {
    //       this.$message.warning('缺少必填项内容，无法保存')
    //     }
    //   })
    // },
    // // 文件上传成功
    // iconUpload(res, file, fileList) {
    //   this.infoForm.logoPath = res.result
    //   this.fileList = [file]
    //   this.$refs.infoForm.clearValidate('logoPath')
    // },
    // // 文件列表移除
    // iconRemove(file, fileList) {
    //   this.infoForm.logoPath = ''
    //   this.fileList = []
    // },
    // // 获取应用名称
    // getAppById(id) {
    //   return this.applicationData.find((item) => item.id == id)?.name
    // },
  },
}
</script>

<style lang="scss" scoped>
.MenuManagement {
  // background-color: #fff;
  .card-menu-header {
    position: relative;
    border-bottom: 1px solid #dfe4eb;
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
    font-size: 16px;
    &::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 0;
      width: 3px;
      height: 20px;
      background-color: #446bbd;
    }
    .el-button {
      padding: 2px;
      margin-top: 16px;
    }
  }

  .menu-manage {
    height: calc(100vh - 115px);
  }
  .application {
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
    background-color: #fff;
    .el-select {
      width: 220px;
      margin-right: 32px;
    }
  }
  .el-card ::v-deep .el-card__body {
    padding: 0;
  }

  .menu {
    float: left;
    width: 20%;
    height: calc(100% - 75px);
    margin: 16px;
    .tree {
      height: calc(100% - 50px);
      padding: 10px;
    }
  }

  .info {
    height: calc(100% - 75px);
    margin: 16px 16px 0 0;
    .el-form {
      padding: 16px;
      .el-row {
        height: 40px;
        padding: 0;
      }
      .upload {
        height: auto;
        margin-bottom: 0;
        ::v-deep .el-form-item__content {
          line-height: normal;
        }
      }
      .el-input,
      .el-textarea,
      ::v-deep .el-upload-list {
        width: 500px;
      }
    }
  }
  ::v-deep .el-alert {
    padding: 0 5px !important;
  }
}
</style>
