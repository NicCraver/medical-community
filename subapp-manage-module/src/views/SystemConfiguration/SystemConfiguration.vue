<template>
  <div class="SystemConfiguration">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>系统配置</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="登录名/姓名" v-model="queryParams.name" clearable />
            <el-select placeholder="状态" v-model="queryParams.status" clearable>
              <el-option label="已开启" value="1" />
              <el-option label="未启用" value="0" />
            </el-select>
            <el-date-picker type="daterange" value-format="yyyy-MM-dd" start-placeholder="添加开始日期"
              end-placeholder="添加结束日期" range-separator="至" v-model="addDate" clearable style="width: 410px" />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </template>
          <el-table ref="singleTable" v-adaptive="{ bottomOffset: 60 }" height="0" :data="tableList" border
            v-loading="loading" row-key="id">
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="浏览器页签名称" prop="browserPageSignature" width="140" />
            <el-table-column label="登录页系统名称" prop="loginPageSystemName" width="140" />
            <el-table-column label="菜单栏名称" prop="menuBarName" width="140" />
            <el-table-column label="是否显示消息" width="120">
              <template slot-scope="{ row }">
                {{ row.showMessage ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="消息类型" width="120">
              <template slot-scope="{ row }">
                {{ row.messageType === 'DISE' ? '慢病' : '双转' }}
              </template>
            </el-table-column>
            <el-table-column label="消息类型" prop="messageType" width="200" />
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="{ row }">
                <el-button type="text" @click="onEdit(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>

    <ProDrawer :visible.sync="configDetailVis" :wrapperClosable="false" :title="stateOfTheForm === 'add' ? '新增' : '编辑'"
      :size="540" @close="onDetailsClose" :show-close="true">
      <div class="details-dialog" v-if="configDetailVis">
        <el-form ref="form" :model="configForm" label-width="120px">
          <el-form-item label="浏览器页签名称">
            <el-input v-model="configForm.browserPageSignature"></el-input>
          </el-form-item>
          <el-form-item label="登录页系统名称">
            <el-input v-model="configForm.loginPageSystemName"></el-input>
          </el-form-item>
          <el-form-item label="菜单栏名称">
            <el-input v-model="configForm.menuBarName"></el-input>
          </el-form-item>
          <el-form-item label="是否显示消息">
            <el-switch v-model="configForm.showMessage"></el-switch>
          </el-form-item>
          <el-form-item label="消息类型" v-if="configForm.showMessage">
            <el-select v-model="configForm.messageType">
              <el-option label="慢病" value="DISE"></el-option>
              <el-option label="双转" value="REF"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录页logo">
            <span class="upload-img-container" v-show="configForm.loginPageLogoId" style="margin-top: 0">
              <img :src="configForm.loginPageLogoUrl" alt="" height="68px" />
              <span class="img-actions">
                <i class="el-icon el-icon-delete" @click="deleleOneImage('loginPageLogo')"></i>
              </span>
            </span>
            <el-upload action="#" :multiple='false' :limit='1' :show-file-list="false"
              :http-request="(file) => uploadFiles(file.file, 'loginPageLogo')" style="display: inline-block"
              v-show="!configForm.loginPageLogoId" accept="image/*">
              <div class="upload-container large" slot="default">
                <i class="el-icon el-icon-plus"></i>
              </div>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="消息类型">
            <el-select v-model="configForm.region" placeholder="请选择消息类型">
              <el-option label="慢病" value="DISE"></el-option>
              <el-option label="转诊" value="REF"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录背景图">
            <el-input v-model="configForm.name"></el-input>
          </el-form-item>
          <el-form-item label="ico图片">
            <el-select v-model="configForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="医院Logo">
            <span class="upload-img-container" v-show="configForm.logoUrl" style="margin-top: 0">
              <img :src="configForm.logoUrl" alt="" height="68px" />
              <span class="img-actions">
                <i class="el-icon el-icon-delete" @click="deleleOneImage('logoId', 'logoUrl')"></i>
              </span>
            </span>
            <el-upload action="#" :http-request="(file) => uploadFiles(file.file, 'logoId', 'logoUrl')"
              :show-file-list="false" style="display: inline-block" v-show="!configForm.logoUrl" accept="image/*">
              <div class="upload-container large" slot="default">
                <i class="el-icon el-icon-plus"></i>
              </div>
            </el-upload>
          </el-form-item> -->
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="submitForm()"> 保存 </el-button>
        <el-button @click="configDetailVis = false">取 消</el-button>
      </template>
    </ProDrawer>
  </div>
</template>

<script>
import { ProList, ProLayout, ProDrawer } from 'anx-vue'
import { addLoginMenu, getLoginMenuData, updateLoginMenu } from '../../api/modules/systemConfig'
import { getEncryptsm3 } from '@/utils'
import {
  onQueryAccountList,
  onBatchStopAccounts,
  onSaveUserAccount,
  updateStatus,
  getOrgCascaderOptions,
  getDictionary,
  getUserAccountMes,
  onResetPassword,
  uploadFiles,
} from '@/api/modules/systemAdmin'
// import UserDetail from './UserDetail'
export default {
  components: { ProList, ProLayout, ProDrawer },
  data () {
    return {
      loading: false,
      tableList: [],
      addDate: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      configDetailVis: false,
      stateOfTheForm: 'add',
      configForm: {
        // 浏览器页签名称
        browserPageSignature: '',
        // 登录页系统名称
        loginPageSystemName: '',
        // 菜单栏名称
        menuBarName: '',
        // 是否显示消息
        showMessage: true,
        // 消息类型
        messageType: '',//消息类型 慢病 DISE  转诊 REF 
        // 登录页logo
        loginPageLogoId: '',
        loginPageLogoUrl: '',
        // 菜单栏logo
        menuBarLogo: '',
        // 登录页背景图
        loginPageBackgroundImage: '',
      },
    }
  },
  async created () {
    // this.getOrgCascaderOptions();
    // this.getDictionary();
    this.onInquire()
  },
  methods: {
    onAdd () {
      this.configDetailVis = true
    },
    async onInquire () {
      try {
        this.loading = true
        const res = await getLoginMenuData({
          ...this.queryParams,
          ...this.pageParams,
        })

        const { total, result } = res
        this.total = total
        result.forEach((el) => {
          el.jsonData = JSON.parse(el.jsonData)
          for (const key in el.jsonData) {
            if (el.jsonData.hasOwnProperty.call(el.jsonData, key)) {
              const item = el.jsonData[key];
              el[key] = item
            }
          }
        })
        this.tableList = result
        console.log('this.tableList', JSON.parse(JSON.stringify(this.tableList)))
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log('error', error)
      }
    },
    // 上传图片
    async uploadFiles (file, name) {
      console.log('file==', file)
      if (file.size > 500 * 1024) {
        this.$message.warning('图片大于500kb')
        return
      }
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await uploadFiles(formData)

        this.$set(this.configForm, `${name}Id`, res.result.id)
        this.$set(this.configForm, `${name}Url`, res.result.url)
      } catch (err) {
        console.error(err)
      }
    },
    onDetails (row) {
      this.onEdit(row, true)
    },
    onEdit (row) {
      console.log('row', row)
      this.editId = row.id
      let maps = [
        'browserPageSignature',
        'loginPageSystemName',
        'menuBarName',
        'showMessage',
        'messageType',
        'loginPageLogoId',
        'loginPageLogoUrl',
        'menuBarLogo',
        'loginPageBackgroundImage',
      ]
      maps.forEach(map => {
        // console.log('map', map)
        for (const key in row) {
          if (Object.hasOwnProperty.call(row, key)) {
            const el = row[key];
            if (key === map) {
              this.$set(this.configForm, key, el)
              // this.configForm[key] = el
              // console.log('el', el)
            }
          }
        }
      });
      this.stateOfTheForm = 'edit'
      console.log('this.configForm', this.configForm)
      console.log('this.editId', this.editId)
      // this.configForm = row
      this.configDetailVis = true
    },
    async onEditUpdateLoginMenu () {
      try {
        const res = await updateLoginMenu({
          id: this.editId,
          jsonData: this.configForm,
        })
        this.$message.success('更新成功！')
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
    async onAddLoginMenu () {
      try {
        const res = await addLoginMenu({
          jsonData: this.configForm,
        })
        this.$message.success('创建成功！')
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
    // 提交表单
    submitForm () {
      console.log('configForm', this.configForm)
      if (this.stateOfTheForm === 'add') {
        this.onAddLoginMenu()
      } else {
        this.onEditUpdateLoginMenu()
      }

    },
    deleleOneImage () { },
    resetQueryParams () {
      this.queryParams = {}
      this.pageParams.pageNum = 1
      this.pageParams.pageSize = 10
      this.addDate = []
      this.editTheData = {}
      this.stateOfTheForm = 'add'
      this.onInquire()
    },
    onDetailsClose () {
      this.configForm = {}
      this.stateOfTheForm = 'add'
      this.configDetailVis = false
    },
  },
}
</script>

<style lang="scss" scoped>
.SystemConfiguration {
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
    margin-top: 10px !important;
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

  .details-dialog {
    padding: 20px 20px 20px 10px;
  }

  .upload-container {
    width: 34px;
    height: 34px;
    font-size: 18px;
    line-height: 34px;
    text-align: center;
    border: 1px solid #d9d9d9;

    &.inline-block {
      cursor: pointer;
      display: inline-block;
    }

    &.large {
      width: 68px;
      height: 68px;
      font-size: 36px;
      line-height: 68px;
    }
  }

  .upload-img-container {
    display: inline-block;
    vertical-align: middle;
    margin-top: -20px;
    margin-right: 10px;
    border: 1px solid #ccc;
    height: 68px;
    position: relative;

    .img-actions {
      display: none;
    }


  }

  .upload-img-container:hover {
    .img-actions {
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      line-height: 68px;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
    }
  }

}
</style>
