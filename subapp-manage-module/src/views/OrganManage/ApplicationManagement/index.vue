<template>
  <div class="ApplicationManagement">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="15">
      <template #title>应用管理</template>
      <template #main>
        <div class="main">
          <div class="box-card-left">
            <header class="header">
              <div>应用列表</div>
              <div><el-button type="primary" size="mini" icon="el-icon-plus" @click="applicationAdd">新增</el-button></div>
            </header>
            <section class="body">
              <div>
                <div style="padding: 10px 10px 20px 10px">
                  <el-input v-model="filterText" placeholder="应用名称" suffix-icon="el-icon-search" style="margin-top: 10px" clearable />
                </div>
                <div class="menu">
                  <el-scrollbar v-loading="menuLoading">
                    <el-radio-group v-model="activeIndex" @change="selectMenu" style="width: 100%">
                      <div v-for="v in applicationListData" :key="v.id" class="radios-box">
                        <el-radio :label="v.id" style="padding-left: 10px; width: 100%; height: 30px; line-height: 30px">
                          <span>{{ v.name }}</span>
                        </el-radio>
                      </div>
                    </el-radio-group>
                  </el-scrollbar>
                </div>
              </div>
            </section>
          </div>
          <div class="box-card-right" ref="rightHeight">
            <header class="header">
              <div>基本信息</div>
            </header>
            <el-form label-width="100px" ref="infoForm" v-loading="infoLoading" :model="infoForm" :rules="infoFormRules">
              <el-form-item label="应用名称" prop="name">
                <el-input v-model="infoForm.name"></el-input>
              </el-form-item>
              <el-form-item label="应用编码" prop="code">
                <el-input v-model="infoForm.code" placeholder="根据规则自动生成" disabled></el-input>
              </el-form-item>
              <el-form-item label="应用类型" prop="appType">
                <el-select v-model="infoForm.appType">
                  <el-option value="1" label="技术应用"></el-option>
                  <el-option value="2" label="业务协同"></el-option>
                  <el-option value="3" label="创新应用"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序">
                <el-input v-model="infoForm.seq" placeholder="排序"></el-input>
              </el-form-item>
              <el-form-item label="启用状态" prop="enableStatus">
                <el-col :span="2">
                  <el-switch v-model="infoForm.enableStatus" :active-value="1" :inactive-value="0"></el-switch>
                </el-col>
                <el-col :span="2">
                  <el-tooltip effect="light" placement="right" content='开启则在门户的"第三方快捷入口"处展示'>
                    <i class="iconfont icon-info-circle"></i>
                  </el-tooltip>
                </el-col>
              </el-form-item>
              <!-- <el-form-item label="外网路径" prop="extranetPath">
                <el-input v-model="infoForm.extranetPath"></el-input>
              </el-form-item>
              <el-form-item label="内网路径" prop="intranetPath">
                <el-input v-model="infoForm.intranetPath"></el-input>
              </el-form-item>
              <el-form-item label="描述信息" prop="description">
                <el-input v-model="infoForm.description" type="textarea" maxlength="200" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="应用图标" prop="logoPath" class="upload">
                <el-upload
                  :action="uploadUrl"
                  :file-list="fileList"
                  list-type="picture"
                  accept=".jpg,.png,.JPG"
                  :on-success="iconUpload"
                  :on-remove="iconRemove"
                >
                  <el-button size="small" type="primary" plain>点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="新建日期" prop="createTime">
                <el-input v-model="infoForm.createTime" disabled></el-input>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="infoSave">保存</el-button>
                <el-button @click="infoDelete">删除</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import { getApplicationList, getApplicationInfo, addApplication, updateApplication, deleteApplication } from '@/api/modules/authority.js'
export default {
  components: {
    ProLayout,
  },
  data() {
    return {
      uploadUrl: window.g.VUE_APP_BASE_API + '/ygt-api/general/uploadPic',
      filterText: '', //应用列表搜索input
      menuLoading: false,
      activeIndex: '', //当前激活菜单
      applicationList: [], //应用列表
      applicationListData: [], //过滤后的应用列表
      infoForm: {
        seq: '',
        name: '', //应用名称
        code: '', //应用编码
        appType: '', //应用类型
        extranetPath: '', //外网路径
        intranetPath: '', //内网路径
        description: '', //描述信息
        logoPath: '', //应用图标
        createTime: '', //新建日期
        enableStatus: 0, //启用状态
      }, //基本信息
      fileList: [],
      infoFormRules: {
        name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
      }, //基本信息-规则
      infoLoading: false,
      scrollbarHeight: '',
    }
  },
  mounted() {
    console.log('this.$refs.rightHeight', this.$refs.rightHeight.clientHeight)
    this.scrollbarHeight = this.$refs.rightHeight.clientHeight - 200 + 'px'
    this.getList()
  },
  watch: {
    filterText(val) {
      this.getListData(val)
    },
  },
  methods: {
    // 菜单激活回调
    selectMenu(index) {
      this.activeIndex = index
      this.getInfo(index)
    },
    // 获取应用列表
    getList(id) {
      this.menuLoading = true
      getApplicationList()
        .then((res) => {
          if (res.code == 0) {
            this.applicationList = res.result
            this.getListData(this.filterText)
            if (id) {
              this.$nextTick(() => {
                this.activeIndex = id
              })
            }
          }
          this.menuLoading = false
        })
        .catch((err) => {
          this.menuLoading = false
        })
    },
    // 获取基本信息
    getInfo(id) {
      console.log('id', id)
      this.$refs.infoForm.resetFields()
      this.infoLoading = true
      getApplicationInfo({ id: id })
        .then((res) => {
          if (res.code == 0) {
            this.infoForm = res.result
            this.fileList = res.result.logoPath == '' ? [] : [{ url: res.result.logoPath }]
            this.infoForm.state = 'edit'
          }
          this.infoLoading = false
        })
        .catch((err) => {
          this.infoLoading = false
        })
    },
    // 新增
    applicationAdd() {
      this.activeIndex = ''
      this.$refs.infoForm.resetFields()
      this.infoForm = {
        enableStatus: 1,
        state: 'add',
      }
      this.fileList = []
    },
    // 保存
    infoSave() {
      this.$refs.infoForm.validate((valid) => {
        if (valid) {
          if (this.infoForm.state == undefined) {
            this.$message('请选择应用或点击新增')
          } else if (this.infoForm.state === 'add') {
            // 新增
            this.infoLoading = true
            addApplication(this.infoForm)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success('新增成功')
                  this.getList(res.result)
                  this.getInfo(res.result)
                } else {
                  this.infoLoading = false
                }
              })
              .catch(() => {
                this.infoLoading = false
              })
          } else {
            // 编辑
            this.infoLoading = true
            updateApplication(this.infoForm)
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success('保存成功')
                  this.getList(res.result)
                  this.getInfo(res.result)
                } else {
                  this.infoLoading = false
                }
              })
              .catch(() => {
                this.infoLoading = false
              })
          }
        } else {
          this.$message.warning('缺少必填项内容，无法保存')
        }
      })
    },
    // 删除
    infoDelete() {
      if (this.infoForm.state === 'edit') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.infoLoading = true
            deleteApplication({ id: this.infoForm.id })
              .then((res) => {
                if (res.code == 0) {
                  this.$message.success('删除成功')
                  this.getList()
                  this.activeIndex = ''
                  this.$refs.infoForm.resetFields()
                  this.infoForm = {}
                  this.fileList = []
                }
                this.infoLoading = false
              })
              .catch(() => {
                this.infoLoading = false
              })
          })
          .catch(() => {})
      } else {
        this.$message('请选择交换标准')
      }
    },
    // 获取过滤后的应用列表
    getListData(val) {
      if (val) {
        this.applicationListData = this.applicationList.filter((item) => {
          return item.name.indexOf(val) !== -1
        })
      } else {
        this.applicationListData = this.applicationList
      }
    },
    // 文件上传成功
    iconUpload(res, file, fileList) {
      this.infoForm.logoPath = res.result
      this.fileList = [file]
    },
    // 文件列表移除
    iconRemove(file, fileList) {
      this.infoForm.logoPath = ''
      this.fileList = []
    },
  },
}
</script>

<style lang="scss" scoped>
.ApplicationManagement {
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
      border-radius: 8px;
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        color: rgba(48, 49, 51, 100);
        font-size: 16px;
        border-bottom: 1px solid rgba(233, 233, 233, 100);
      }
      .body {
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
      box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
      flex: 1;
      padding: 0 10px 10px 10px;
      ::v-deep.el-tree-node__content {
        display: flex;
        align-items: center;
        height: 36px !important;
        cursor: pointer;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        color: rgba(48, 49, 51, 100);
        font-size: 16px;
        position: relative;
        // border-bottom: 1px solid rgba(233, 233, 233, 100);
      }
      .header:before {
        width: 4px;
        height: 18px;
        background: #446abd;
        position: absolute;
        content: '';
        left: -4px;
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
    .menu {
      height: calc(100% - 130px);
    }
    ::v-deep.el-button--mini {
      padding: 7px 10px;
      font-size: 12px;
      border-radius: 3px;
    }
    ::v-deep.el-radio__input {
      display: none;
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
