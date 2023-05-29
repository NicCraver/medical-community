<template>
  <div class="Published">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <el-input placeholder="请出入查询标题" v-model="queryParams.newsName" clearable />
        <el-select v-model="queryParams.classifyId" placeholder="类型">
          <el-option v-for="(option, index) in typeOptions" :key="index" :label="option.label" :value="option.value" />
        </el-select>
        <el-select v-model="queryParams.status" placeholder="状态">
          <el-option v-for="(option, index) in stateOptions" :key="index" :label="option.label" :value="option.value" />
        </el-select>
        <el-date-picker
          v-model="queryParams.dateValue"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="创建开始时间"
          end-placeholder="创建结束时间"
          range-separator="至"
          clearable
          align="right"
        >
        </el-date-picker>
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire()">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <template #batchActions>
        <el-button type="primary" @click="addDirectory">新增</el-button>
        <el-button @click="onBatchClose">批量关闭</el-button>
        <div class="alert" v-if="multipleSelection.length !== 0">
          <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
          <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
          <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
        </div>
      </template>
      <el-table
        ref="singleTable"
        @selection-change="handleSelectionChange"
        row-key="id"
        v-adaptive="{ bottomOffset: 50 }"
        height="0"
        :data="tableList"
        border
        v-loading="loading"
      >
        <el-table-column type="selection" width="40" :reserve-selection="true" />
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="newsName" min-width="300" />
        <el-table-column label="类型" prop="classifyDesc" width="100" />
        <el-table-column label="发布范围" prop="publishLimitDesc" width="90" />
        <el-table-column label="发布时间" prop="publishDate" width="170" />
        <el-table-column label="关闭时间" prop="closeTime" width="170" />
        <el-table-column label="创建人" prop="writerName" width="100" />
        <el-table-column label="创建时间" prop="createDate" width="170" />
        <el-table-column label="状态" fixed="right" width="100">
          <template slot-scope="{ row }">
            <div style="display: flex; align-items: center; cursor: pointer" @click="fnSwitchState(row)">
              <el-switch :value="row.status" :active-value="1" :inactive-value="0" />
              <div style="margin-left: 10px">{{ row.status === 1 ? '开启' : '关闭' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onView(row)">查看</el-button>
            <el-button type="text" @click="onCopy(row)">复制</el-button>
            <el-button type="text" @click="onEdit(row)">编辑</el-button>
            <el-button type="text" @click="onDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg, ProDialog } from 'anx-vue'
import {
  onQueryNewsList,
  getDictionarys,
  onCopyNews,
  onDelNews,
  onOpenNews,
  onCloseNews,
} from '@/api/modules/NewsManage'
export default {
  components: { ProLayout, ProList, IconSvg, ProDialog },
  data() {
    return {
      typeOptions: [],
      stateOptions: [
        {
          label: '开启',
          value: '0',
        },
        {
          label: '关闭',
          value: '1',
        },
      ],
      DirectoryTypeList: [],
      IdcList: [],
      HosList: [],
      wrapList: [
        {
          rules: {
            icdCode: {
              required: true,
              message: '请选择ICD编码/名称',
              trigger: 'blur',
            },
            hosId: {
              required: true,
              message: '请选择医疗机构名称',
              trigger: 'blur',
            },
            hisIcdCode: {
              required: true,
              message: '请填写编码',
              trigger: 'blur',
            },
            hisIcdName: {
              required: true,
              message: '请填写名称',
              trigger: 'blur',
            },
          },
          list: [
            {
              icdCode: '',
              hosId: '',
              hisIcdCode: '',
              hisIcdName: '',
            },
          ],
        },
      ],
      loading: false,
      dialogFlag: false,
      tableList: [],
      multipleSelection: [],
      modDate: [],
      createDate: [],
      createUser: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      ruleForm: {
        directoryType: '',
        status: 'Y',
      },
      rules: {
        directoryType: [{ required: true, message: '请输入目录类型', trigger: 'change' }],
        code: [{ required: true, message: ' ', trigger: 'blur' }],
        status: [{ required: true, message: '请选择指征状态', trigger: 'blur' }],
      },
      dHeight: 80,
      formStatus: 'add',
    }
  },
  computed: {
    formStatusTitle() {
      return this.formStatus === 'add' ? '新增' : this.formStatus === 'edit' ? '编辑' : '查看'
    },
  },
  async created() {
    this.onInquire()
    this.getDictionarys()
  },
  methods: {
    async onInquire() {
      try {
        this.loading = true
        console.log('this.queryParams', this.queryParams)
        if (this.queryParams.dateValue) {
          this.queryParams.createDateS = this.queryParams.dateValue[0]
          this.queryParams.createDateE = this.queryParams.dateValue[1]
        }
        const res = await onQueryNewsList({
          isPublish: 0,
          ...this.queryParams,
          ...this.pageParams,
        })
        this.tableList = res.result.records
        this.total = res.result.total

        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error', error)
      }
    },
    // 新增
    addDirectory() {
      this.$router.push({
        name: 'AddNew',
        query: {
          status: 'add',
        },
      })
    },
    onView(row) {
      console.log(`row`, JSON.parse(JSON.stringify(row)))
      this.$router.push({
        name: 'ViewNew',
        query: {
          status: 'view',
          newID: row.nlId,
        },
      })
    },
    async onCopy(row) {
      try {
        const res = await onCopyNews({
          id: row.nlId,
        })
        this.$message.success('复制成功！')
        this.onInquire()
      } catch (error) {}
    },
    onEdit(row) {
      this.$router.push({
        name: 'EditNew',
        query: {
          status: 'edit',
          newID: row.nlId,
        },
      })
    },
    async onDel(row) {
      try {
        const res = await onDelNews({
          ids: [row.nlId],
        })
        this.$message.success('删除成功！')
        this.onInquire()
      } catch (error) {}
    },
    async fnSwitchState(row) {
      console.log(`row`, row.status)
      if (row.status === 1) {
        this.onCloseNews(row)
      } else {
        this.onOpenNews(row)
      }
    },
    async onOpenNews(row) {
      try {
        await onOpenNews({
          id: row.nlId,
        })
        this.$message.success('状态修改成功！')
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
    async onCloseNews(row) {
      try {
        await onCloseNews({
          ids: [row.nlId],
        })
        this.$message.success('状态修改成功！')
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
    // 字典
    async getDictionarys() {
      try {
        const res = await getDictionarys([
          {
            key: 'typeOptions',
            groupId: '67cc917a8e44482cb30a6f34636cedeb',
          },
        ])
        this.typeOptions = res.result.typeOptions
      } catch (error) {
        console.error(`error`, error)
      }
    },
    fnExamine(row) {
      this.formStatus = 'examine'
      console.log('row', row)
      this.ruleForm = {
        id: row.id,
        directoryType: row.directoryType,
        status: row.status,
      }
      this.wrapList = [
        {
          rules: {
            icdCode: {
              required: true,
              message: '请选择ICD编码/名称',
              trigger: 'blur',
            },
            hosId: {
              required: true,
              message: '请选择医疗机构名称',
              trigger: 'blur',
            },
            hisIcdCode: {
              required: true,
              message: '请填写编码',
              trigger: 'blur',
            },
            hisIcdName: {
              required: true,
              message: '请填写名称',
              trigger: 'blur',
            },
          },
          list: [
            {
              icdCode: row.icdCode,
              hosId: row.hosId,
              hisIcdCode: row.hisIcdCode,
              hisIcdName: row.hisIcdName,
            },
          ],
        },
      ]
      this.dialogFlag = true
    },
    fnEdit(row) {
      this.formStatus = 'edit'
      console.log('row', JSON.parse(JSON.stringify(row)))
      this.ruleForm = {
        id: row.id,
        directoryType: row.directoryType,
        status: row.status,
      }
      this.wrapList = [
        {
          rules: {
            icdCode: {
              required: true,
              message: '请选择ICD编码/名称',
              trigger: 'blur',
            },
            hosId: {
              required: true,
              message: '请选择医疗机构名称',
              trigger: 'blur',
            },
            hisIcdCode: {
              required: true,
              message: '请填写编码',
              trigger: 'blur',
            },
            hisIcdName: {
              required: true,
              message: '请填写名称',
              trigger: 'blur',
            },
          },
          list: [
            {
              icdCode: row.icdCode,
              hosId: row.hosId,
              hisIcdCode: row.hisIcdCode,
              hisIcdName: row.hisIcdName,
            },
          ],
        },
      ]
      this.dialogFlag = true
    },
    fnClose(row) {
      console.log('row', row)
    },
    fnOpen(row) {
      console.log('row', row)
    },
    // 校验表单数据
    submitAll() {
      if (this.formStatus === 'examine') {
        this.dialogFlag = false
        return
      }
      let newArr = []
      this.$refs['ruleForm'].validateField(['directoryType', 'status'], (valid) => {
        console.log('valid', valid)
        if (valid === '') {
          newArr.push(true)
        } else {
          newArr.push(false)
        }
      })
      this.wrapList.forEach((ele, index) => {
        this.$refs['indicationCodingForm'][index].validate((valid) => {
          if (valid) {
            newArr.push(true)
          } else {
            newArr.push(false)
          }
        })
      })
      console.log('newArr', newArr)
      let flag = newArr.every((val) => {
        return val == true
      })

      if (flag) {
        console.log('信息填写完整')
        console.log('this.wrapList[0].list', this.wrapList[0].list)
        this.onSaveHisIcd()
      } else {
        console.log('信息未填写完整')
      }
    },
    removeRow(item) {
      console.log('item', item)
      let index = this.wrapList[0].list.indexOf(item)
      if (index !== -1) {
        this.wrapList[0].list.splice(index, 1)
      }
      this.$nextTick(() => {
        console.log('this.$refs.rowListRef', this.$refs.rowListRef.offsetHeight)
        this.dHeight = this.$refs.rowListRef.offsetHeight + 20
      })
    },
    // 增加一列
    addRow() {
      this.wrapList[0].list.push({
        icd: '',
        hosId: '',
        code: '',
        name: '',
      })
      this.$nextTick(() => {
        console.log('this.$refs.rowListRef', this.$refs.rowListRef.offsetHeight)
        this.dHeight = this.$refs.rowListRef.offsetHeight + 20
      })
    },
    async onSaveHisIcd() {
      try {
        let tempDate = []
        this.wrapList[0].list.forEach((_) => {
          tempDate.push({
            id: this.ruleForm.id ? this.ruleForm.id : '',
            status: this.ruleForm.status,
            directoryType: this.ruleForm.directoryType,
            icdCode: _.icdCode,
            hosId: _.hosId,
            hisIcdCode: _.hisIcdCode,
            hisIcdName: _.hisIcdName,
          })
        })
        const res = await onSaveHisIcdCorrelationForReferral(tempDate)
        console.log('res', res)
        this.$message.success('保存成功')
        this.dialogFlag = false
        this.onInquire()
      } catch (error) {
        console.error('error', error)
      }
    },
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       alert("submit!");
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    async onBatchClose() {
      let tempIds = []
      this.multipleSelection.forEach((_) => {
        tempIds.push(_.nlId)
      })
      try {
        const res = await onCloseNews({ ids: tempIds })
        this.$message.success('批量关闭成功！')
        this.clearFun()
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
    handleRoleClose() {
      this.dialogFlag = false
    },
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 目录类型下拉框
    async getDirectoryTypeOptions() {
      try {
        const res = await getDirectoryTypeOptions()
        this.DirectoryTypeList = res.result
        console.log('this.DirectoryTypeList', this.DirectoryTypeList)
      } catch (error) {
        console.error('error', error)
      }
    },
    // 机构
    async getHosOptionsByUserAuth() {
      try {
        const res = await getHosOptionsByUserAuth()
        this.HosList = res.result
      } catch (error) {
        console.error('error', error)
      }
    },
    changeDType() {
      this.getIcdDic('')
    },
    // 指证编码下拉框
    async getIcdDic(value) {
      try {
        const res = await getIcdDicByDirectoryTypeForOrderBy({
          value,
          directoryType: this.ruleForm.directoryType,
        })
        this.IdcList = res.result
      } catch (error) {
        console.error('error', error)
      }
    },
    // 重置
    resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.createDate = []
      this.onInquire()
    },
  },
}
</script>

<style lang="scss" scoped>
.Published {
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
