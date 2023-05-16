<template>
  <div class="DirectoryList">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>目录列表</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="指征编码/指征名称" v-model="queryParams.icdCode" clearable />
            <el-select placeholder="目录类型" v-model="queryParams.directoryType" clearable filterable>
              <el-option v-for="item in DirectoryTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="queryParams.hosId" placeholder="医疗机构名称" filterable clearable>
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in HosList" />
            </el-select>
            <!-- <el-select placeholder="机构" v-model="queryParams.createUserId" clearable>
              <el-option v-for="item in createUser" :key="item.LABEL" :label="item.LABEL" :value="item.VALUE" />
            </el-select> -->
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="创建开始日期"
              end-placeholder="创建结束日期"
              range-separator="至"
              v-model="createDate"
              clearable
              style="width: 350px"
            />
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
            v-adaptive="{ bottomOffset: 60 }"
            height="0"
            :data="tableList"
            border
            v-loading="loading"
            row-key="id"
          >
            <el-table-column type="selection" width="40" :reserve-selection="true" />
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.row.seq }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="modDate" width="180" />
            <el-table-column label="目录类型" prop="directoryTypeDesc" width="130" />
            <el-table-column label="指正编码" prop="icdCode" width="180" />
            <el-table-column label="指征名称" prop="icdName" width="150" show-overflow-tooltip />
            <el-table-column label="医疗机构名称" prop="hosName" width="180" show-overflow-tooltip />
            <el-table-column label="机构内编码" prop="hisIcdCode" width="150" show-overflow-tooltip />
            <el-table-column label="机构内名称" prop="hisIcdName" width="150" />
            <el-table-column label="状态" min-width="150">
              <template slot-scope="{ row }">
                <div style="display: flex; align-items: center; cursor: pointer" @click="fnSwitchState(row)">
                  <el-switch :value="row.status" active-value="Y" inactive-value="N" />
                  <div style="margin-left: 10px">{{ row.status === 'Y' ? '开启' : '关闭' }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="创建人" prop="createUserName" width="120" show-overflow-tooltip />
            <el-table-column label="创建时间" prop="createDate" width="180" />
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="{ row }">
                <el-button type="text" @click="fnExamine(row)">查看</el-button>
                <el-button type="text" @click="fnEdit(row)">编辑</el-button>
                <!-- <el-button type="text" @click="fnClose(row)">关闭</el-button>
                <el-button type="text" @click="fnOpen(row)">开启</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
    <ProDialog
      :visible.sync="dialogFlag"
      :title="formStatusTitle"
      width="700px"
      :before-close="handleRoleClose"
      :close-on-click-modal="false"
      top="15vh"
    >
      <div v-if="dialogFlag">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :disabled="formStatus === 'examine'">
          <el-form-item label="目录类型：" prop="directoryType">
            <el-select placeholder="目录类型" v-model="ruleForm.directoryType" filterable @change="changeDType">
              <el-option v-for="item in DirectoryTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="指征编码：" prop="code">
            <div :style="{ position: 'relative', height: dHeight + 'px' }">
              <div style="position: absolute; top: 40px; left: -95px" ref="rowListRef">
                <div v-for="(item, index) in wrapList" :key="index">
                  <el-form
                    :rules="item.rules"
                    :model="item"
                    :disabled="formStatus === 'examine' || ruleForm.directoryType === ''"
                    ref="indicationCodingForm"
                    :show-message="false"
                  >
                    <el-row :gutter="10" v-for="(v, vIndex) in item.list" :key="vIndex">
                      <el-col :span="6">
                        <el-form-item :prop="'list.' + vIndex + '.icdCode'" :rules="item.rules.icdCode">
                          <el-select
                            v-model="v.icdCode"
                            placeholder="ICD编码/名称"
                            filterable
                            remote
                            :remote-method="(value) => getIcdDic(value)"
                            clearable
                          >
                            <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in IdcList" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">
                        <el-form-item>
                          <el-input value="="></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item :prop="'list.' + vIndex + '.hosId'" :rules="item.rules.hosId">
                          <el-select v-model="v.hosId" placeholder="医疗机构名称" filterable>
                            <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in HosList" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item :prop="'list.' + vIndex + '.hisIcdCode'" :rules="item.rules.hisIcdCode">
                          <el-input v-model="v.hisIcdCode" placeholder="请输入编码"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item :prop="'list.' + vIndex + '.hisIcdName'" :rules="item.rules.hisIcdName">
                          <el-input v-model="v.hisIcdName" placeholder="请输入名称"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="1" v-if="formStatus === 'add'">
                        <el-button
                          type="text"
                          icon="el-icon-plus"
                          :disabled="ruleForm.directoryType === '' || vIndex < item.list.length - 1"
                          @click="addRow"
                        ></el-button>
                      </el-col>
                      <el-col :span="1" v-if="formStatus === 'add'">
                        <el-button
                          type="text"
                          icon="el-icon-close"
                          :disabled="ruleForm.directoryType === '' || vIndex === 0"
                          @click="removeRow(v)"
                        ></el-button>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="指征状态：" prop="status">
            <el-switch v-model="ruleForm.status" active-value="Y" inactive-value="N"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="handleRoleClose">取 消</el-button>
        <el-button type="primary" @click="submitAll()"> 确 定 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg, ProDialog } from 'anx-vue'
import { onQueryPatients } from '@/api/modules/patientCenter'
import {
  onSaveHisIcdCorrelationForReferral,
  getDirectoryTypeOptions,
  getIcdDicByDirectoryTypeForOrderBy,
  getHosOptionsByUserAuth,
  onQueryHisIcdCorrelation,
  onChangeStatus,
  onBatchClose,
} from '../../../api/modules/directoryList'
export default {
  components: { ProLayout, ProList, IconSvg, ProDialog },
  data() {
    return {
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
    let DirectoryListQueryParams = window.sessionStorage.getItem('DirectoryListQueryParams')
    if (DirectoryListQueryParams) {
      this.queryParams = JSON.parse(DirectoryListQueryParams).queryParams
      this.modDate = JSON.parse(DirectoryListQueryParams).modDate
      this.createDate = JSON.parse(DirectoryListQueryParams).createDate
      this.$set(this.pageParams, 'pageNum', JSON.parse(DirectoryListQueryParams).pageParams.pageNum)
      this.$set(this.pageParams, 'pageSize', JSON.parse(DirectoryListQueryParams).pageParams.pageSize)
    }
    this.onInquire()
    this.getDirectoryTypeOptions()
    this.getHosOptionsByUserAuth()
  },
  methods: {
    async fnSwitchState(row) {
      try {
        const res = await onChangeStatus({
          id: row.id,
        })
        this.$message.success('状态修改成功！')
        this.onInquire()
      } catch (error) {
        console.log('error', error)
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
    // 新增
    addDirectory() {
      this.formStatus = 'add'
      this.dialogFlag = true
      this.ruleForm = {
        directoryType: '',
        status: 'Y',
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
              icdCode: '',
              hosId: '',
              hisIcdCode: '',
              hisIcdName: '',
            },
          ],
        },
      ]
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
        tempIds.push(_.id)
      })
      try {
        const res = await onBatchClose(tempIds)
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
    async onInquire() {
      try {
        // {
        // "icdCode"：指征编码/名称
        // "modDateS":：更新开始时间(yyyy-MM-dd HH:mm:ss)
        // "modDateE"：更新结束时间(yyyy-MM-dd HH:mm:ss)
        // "directoryType"：目录类型
        // "createDateS"：创建开始时间(yyyy-MM-dd HH:mm:ss)
        // "createDateE"：创建结束时间(yyyy-MM-dd HH:mm:ss)
        // "pageNum"：页数
        // "pageSize"：每页条数
        // }
        this.loading = true
        console.log('this.queryParams', this.queryParams)
        const res = await onQueryHisIcdCorrelation({
          ...this.queryParams,
          ...this.pageParams,
          createDateS: this.createDate ? (this.createDate[0] ? this.createDate[0] + ' 00:00:00' : '') : '',
          createDateE: this.createDate ? (this.createDate[1] ? this.createDate[1] + ' 23:59:59' : '') : '',
          modDateS: this.modDate ? (this.modDate[1] ? this.modDate[1] + ' 23:59:59' : '') : '',
          modDateE: this.modDate ? (this.modDate[0] ? this.modDate[0] + ' 00:00:00' : '') : '',
        })
        window.sessionStorage.setItem(
          'DirectoryListQueryParams',
          JSON.stringify({
            queryParams: this.queryParams,
            pageParams: this.pageParams,
            modDate: this.modDate,
            createDate: this.createDate,
          })
        )
        const { total, records } = res.result
        if (records.length === 0 && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum = 1
          this.onInquire()
          return
        }
        this.total = total
        records.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.tableList = records
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error', error)
      }
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
.DirectoryList {
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
