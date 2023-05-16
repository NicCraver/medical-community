<template>
  <div class="FU-PatientCenter">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>医院管理</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <OrgHosSelect ref="orgRef" v-model="pageParams.orgId" placeholder="集团"></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="pageParams.id"
              :parentId="pageParams.orgId"
              placeholder="机构"
            ></OrgHosSelect>
            <!-- <GroupSelect v-model="queryParams.orgId"></GroupSelect>
            <HospitalSelect v-model="queryParams.id" :groupId="queryParams.orgId"></HospitalSelect> -->
            <el-select placeholder="状态" v-model="queryParams.status" clearable>
              <el-option label="开启" value="Y" />
              <el-option label="停用" value="N" />
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
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button @click="syncHospitalData" icon="el-icon-sort">同步数据</el-button>
          </template>
          <el-table
            ref="singleTable"
            :data="hospitalList"
            border
            v-loading="loading"
            v-adaptive="{ bottomOffset: 65 }"
            height="0"
          >
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="机构Id" prop="code" />
            <el-table-column label="机构名称" prop="name" />
            <el-table-column label="机构类型" prop="orgTypeDesc" />
            <el-table-column label="机构等级" prop="hosLevelDesc" />
            <el-table-column label="集团" prop="orgName" />
            <el-table-column label="状态" width="150">
              <template slot-scope="{ row }">
                <div
                  style="display: flex; align-items: center; cursor: pointer"
                  @click="onChangeOrgStatus(row)"
                >
                  <el-switch :value="row.status" :active-value="true" :inactive-value="false" />
                  <div style="margin-left: 10px">
                    {{ row.status ? '启用' : '停用' }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="添加时间" prop="createDate" width="160" :resizable="false" />
            <el-table-column label="操作" fixed="right" width="100">
              <template slot-scope="{ row }">
                <el-button type="text" @click="pageTohospitalDetail(row, 'check')">详情</el-button>
                <el-button type="text" @click="pageTohospitalDetail(row, 'edit')">完善</el-button>
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
import { getHospitalList, getOrgOrHosOptions, onChangeOrgStatus } from '@/api/modules/systemAdmin'
import GroupSelect from '@/components/GroupAndHospital/GroupSelect'
import HospitalSelect from '@/components/GroupAndHospital/HospitalSelect'

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
      loading: false,
      hospitalList: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      addDate: [],
      userDetailVis: true,
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  methods: {
    async onInquire() {
      try {
        const res = await getHospitalList({
          ...this.queryParams,
          ...this.pageParams,
          createDateS: this.addDate ? (this.addDate[0] ? `${this.addDate[0]} 00:00:00` : '') : '',
          createDateE: this.addDate ? (this.addDate[1] ? `${this.addDate[1]} 23:59:59` : '') : '',
        })
        console.log('getHospitalList==', res)
        this.total = res.result.total
        if (res.result.records) {
          res.result.records.forEach((recordItem) => {
            for (const key in recordItem) {
              if (!recordItem[key]) {
                recordItem[key] = '/'
              }
            }
          })
        }
        this.hospitalList = res.result.records.map((item) => ({
          ...item,
          status: item.status === 'Y',
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageSize: 10,
        pageNum: 1,
      }
      this.addDate = []
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    syncHospitalData() {},
    pageTohospitalDetail(row, mode) {
      this.$router.push({
        name: 'HospitalDetail',
        query: {
          id: row.id,
          mode,
        },
      })
    },
    // 医院启用/停用
    async onChangeOrgStatus(row) {
      try {
        const res = await onChangeOrgStatus({ orgId: row.id })
        console.log('onChangeOrgStatus==', res)
        this.$message.success('操作成功')
        this.onInquire()
      } catch (err) {
        console.log(err)
      }
    },
  },
  watch: {},
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
    padding: 10px;
    background-color: #fff;
  }
  .grey {
    color: #919191;
  }
}
</style>
