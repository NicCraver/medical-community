<template>
  <div class="FU-PatientCenter">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>医生管理</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <OrgHosSelect ref="orgRef" v-model="pageParams.orgCode" placeholder="集团"></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="pageParams.hosCode"
              :parentId="pageParams.orgCode"
              placeholder="机构"
            ></OrgHosSelect>
            <el-input placeholder="姓名/账号" v-model="queryParams.searchValue" clearable />
            <el-select placeholder="类型-职称" v-model="queryParams.professional" clearable>
              <el-option
                :label="item.titleName"
                :value="item.titleTypeCode"
                v-for="item in professionalList"
                :key="item.titleTypeCode"
              />
            </el-select>
            <el-select placeholder="状态" v-model="queryParams.status" clearable>
              <el-option label="开启" value="1" />
              <el-option label="停用" value="0" />
            </el-select>
            <el-select placeholder="来源" v-model="queryParams.dataSource" clearable>
              <el-option label="HIS同步" value="HIS同步" />
              <el-option label="自建" value="自建" />
            </el-select>
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="添加开始日期"
              end-placeholder="添加结束日期"
              range-separator="至"
              v-model="addDate"
              clearable
              style="width: 410px"
            />
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="更新开始日期"
              end-placeholder="更新结束日期"
              range-separator="至"
              v-model="updateDate"
              clearable
              style="width: 410px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="pageToDoctorDetail('add')">添加医务人员</el-button>
            <el-button @click="syncHospitalData" icon="el-icon-sort">同步HIS数据</el-button>
            <el-button @click="batchStopDoctor" icon="el-icon-sort">批量停用</el-button>
            <span class="tips">*批量停用不可同时勾选已建账号和未建账号的医生</span>
            <div class="alert" v-if="multipleSelection.length !== 0">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
              <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px">
                清空
              </el-button>
            </div>
          </template>
          <el-table
            ref="singleTable"
            :data="doctorList"
            border
            v-loading="loading"
            row-key="userId"
            @selection-change="handleSelectionChange"
            v-adaptive="{ bottomOffset: 65 }"
            height="0"
          >
            <el-table-column
              type="selection"
              width="40"
              :reserve-selection="true"
              :selectable="(row) => row.status"
            />
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="医生Id" prop="doctorCode" width="110px" show-overflow-tooltip />
            <el-table-column label="来源" prop="dataSource" />
            <el-table-column
              label="医生HIS编号"
              prop="hisNum"
              width="110px"
              show-overflow-tooltip
            />
            <el-table-column label="姓名" prop="name" width="140px" show-overflow-tooltip />
            <el-table-column label="性别" prop="sex" />
            <el-table-column label="职称" prop="titleName" width="220px" show-overflow-tooltip />
            <el-table-column
              label="科室"
              prop="departMentName"
              width="200px"
              show-overflow-tooltip
            />
            <el-table-column label="科室类型" prop="deptTypeDesc" width="100px" show-overflow-tooltip />
            <el-table-column label="机构名称" prop="hosName" width="160px" show-overflow-tooltip />
            <el-table-column label="手机号" prop="phone" width="140px" />
            <el-table-column label="添加时间" prop="createDate" width="160" />
            <el-table-column label="更新时间" prop="modDate" width="160" />
            <el-table-column label="排序" width="100">
              <template slot-scope="{ row }">
                <el-input v-model="row.serialNum" :disabled="row.serialNumReadonly">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-edit-outline"
                    v-if="row.serialNumReadonly"
                    @click="handleEditClick(row)"
                  ></i>
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-check"
                    v-else
                    @click="updateSerialNum(row)"
                  ></i>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150">
              <template slot-scope="{ row }">
                <el-switch
                  :value="row.status"
                  :active-text="row.status ? '开启' : '停用'"
                  @change="batchStopDoctor(row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="{ row }">
                <el-button type="text" @click="pageToDoctorDetail('check', row.userId)"
                  >详情</el-button
                >
                <el-button type="text" @click="pageToDoctorDetail('edit', row.userId)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="deleteDoctor(row)"
                  :class="[row.status ? 'grey' : '']"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg } from 'anx-vue'
import GroupSelect from '@/components/GroupAndHospital/GroupSelect'
import HospitalSelect from '@/components/GroupAndHospital/HospitalSelect'
import {
  getDoctorList,
  updateSerialNum,
  batchStopDoctor,
  deleteDoctor,
  getOrgOrHosOptions,
  getTitleDownBox,
} from '@/api/modules/systemAdmin'

export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
    GroupSelect,
    HospitalSelect,
  },
  data() {
    return {
      orgOptionsList: [],
      hosOptionsList: [],
      professionalList: [],
      loading: false,
      doctorList: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      multipleSelection: [],
      addDate: [],
      updateDate: [],
    }
  },
  async mounted() {
    await this.getTitleDownBox()
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  methods: {
    /*
      获取集团或者医院下拉列表
      parentId为空时查询集团
      parentId为机构ID时查询机构下的医院
      传入deptType查询科室级联
    */
    async getOrgOrHosOptions(parentId, deptType) {
      try {
        const res = await getOrgOrHosOptions({
          parentId: parentId || '',
          deptType: deptType || '',
        })
        console.log('getOrgOrHosOptions===', res)
        return res.result
      } catch (err) {
        console.error(err)
      }
    },
    /*
      初始化集团下拉
      1.获取集团下拉列表
      2.如果不是超级管理员，默认选中第一项也是仅有的一项，并且不可选择
    */
    async initOrgOptions() {
      this.orgOptionsList = await this.getOrgOrHosOptions()
      console.log('集团下拉列表==', this.orgOptionsList)
      if (!this.$IS_ROOT_ADMIN) {
        this.$set(this.queryParams, 'orgCode', this.orgOptionsList[0].value)
      }
    },

    /*
      初始化机构下拉
      2.获取集团下拉列表
      3.如果是机构级别的账号，机构默认选中当前机构，并且不可选
    */
    async initHosOptions() {
      this.$set(this.queryParams, 'hosCode', '')
      this.hosOptionsList = await this.getOrgOrHosOptions(this.queryParams.orgCode)
      console.log('机构下拉列表==', this.orgOptionsList)
      if (this.$IS_ORI_ADMIN) {
        this.$set(this.queryParams, 'hosCode', this.hosOptionsList[0].value)
      }
    },

    // 获取职称下拉
    async getTitleDownBox() {
      try {
        const res = await getTitleDownBox()
        console.log('getTitleDownBox==', res)
        this.professionalList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async onInquire() {
      try {
        const titleCombine = this.queryParams.professional
          ? this.queryParams.professional.split('-')
          : []
        const res = await getDoctorList({
          ...this.queryParams,
          titleType: titleCombine[0] || '',
          titleCode: titleCombine[1] || '',
          addSDate: this.addDate ? (this.addDate[0] ? `${this.addDate[0]} 00:00:00` : '') : '',
          addEdate: this.addDate ? (this.addDate[1] ? `${this.addDate[1]} 23:59:59` : '') : '',
          updateSDate: this.updateDate
            ? this.updateDate[0]
              ? `${this.updateDate[0]} 00:00:00`
              : ''
            : '',
          updateEDate: this.updateDate
            ? this.updateDate[1]
              ? `${this.updateDate[1]} 23:59:59`
              : ''
            : '',
          ...this.pageParams,
        })
        console.log('getDoctorList==', res)
        if (res.result) {
          res.result.forEach((recordItem) => {
            for (const key in recordItem) {
              if (!recordItem[key]) {
                recordItem[key] = '/'
              }
            }
          })
        }
        this.doctorList = res.result.map((item) => ({
          ...item,
          serialNumReadonly: true,
          status: item.status === '1',
        }))
        this.total = res.total
      } catch (err) {
        console.error(err)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.addDate = []
      this.updateDate = []

      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    syncHospitalData() {},
    pageToDoctorDetail(mode, id) {
      const query = {
        mode,
      }
      id && (query.id = id)
      this.$router.push({
        name: 'DoctorDetail',
        query,
      })
    },
    // 更新排序
    async updateSerialNum(row) {
      row.serialNumReadonly = true
      try {
        const res = await updateSerialNum({ userId: row.userId, serialNum: row.serialNum })
        console.log('updateSerialNum==', res)
        this.onInquire()
      } catch (err) {
        console.error(err)
      }
    },

    // 停用医生
    async batchStopDoctor(row) {
      let userIds = []
      if (row.userId) {
        userIds = [row.userId]
        if (!row.status && row.deptRelatedStatus === '0') {
          this.$message.warning('关联科室已被删除，请先完善医生科室信息')
          return
        }
        if (row.status && row.loginStatus === '1') {
          this.$confirm('当前医生已创建系统帐号，确认同步修改其帐号状态至停用？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              row.status = !row.status
              this.batchStopDoctorSubmit(userIds)
            })
            .catch(() => {})
          return
        }
        row.status = !row.status
        this.batchStopDoctorSubmit(userIds)
      } else {
        userIds = this.multipleSelection.map((item) => item.userId)
        if (!userIds.length) {
          this.$message.warning('请勾选需要停用的医务人员')
          return
        }
        this.$confirm('已建账号医生，账号将被一同停用，是否继续该操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.batchStopDoctorSubmit(userIds)
          })
          .catch(() => {})
      }
    },
    async batchStopDoctorSubmit(userIds) {
      try {
        const res = await batchStopDoctor(userIds)
        console.log('batchStopDoctor==', res)
        this.clearFun()
        this.onInquire()
      } catch (err) {
        console.error(err)
      }
    },

    // 删除医生
    deleteDoctor(row) {
      if (row.status) {
        this.$message.warning('该医生状态为启用，不予删除')
        return
      }
      this.$confirm('确定要删除该医生吗', '提示', {}).then(async () => {
        try {
          const res = await deleteDoctor({ userId: row.userId })
          console.log('deleteDoctor==', res)
          this.$message.success('医生删除成功')
          this.onInquire()
        } catch (err) {
          console.error(err)
        }
      })
    },
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    handleEditClick(row) {
      const doctor = this.doctorList.find((item) => !item.serialNumReadonly)
      if (doctor) {
        this.$message.warning('不可同时编辑2个医生的排序')
      } else {
        row.serialNumReadonly = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.FU-PatientCenter {
  .header {
    .bolck {
      border-radius: 2px;
      font-size: 16px;
      color: #101010;
      text-align: center;
      background-color: #fff;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-div {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        line-height: 24px;
        margin-right: 5px;
        &.user {
          background-color: rgba(106, 140, 215, 0.3);
          color: #6a8cd7;
        }
        &.time {
          background-color: rgba(244, 199, 89, 0.3);
          color: #f4c759;
        }
        &.document {
          background-color: rgba(146, 206, 117, 0.3);
          color: #92ce75;
        }
      }
    }
  }
  .middle {
    margin-left: 20px;
    margin-right: 10px;
    ::v-deep.el-checkbox__label {
      padding-left: 3px;
      font-size: 14px;
    }
  }
  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
  .ProList {
    border-radius: 2px;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
  }
  .grey {
    color: #919191;
  }
  .tips {
    font-size: 12px;
    color: #919191;
  }
}
</style>
