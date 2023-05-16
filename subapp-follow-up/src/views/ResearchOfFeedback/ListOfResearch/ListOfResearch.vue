<template>
  <div class="research-list">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>调研列表</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <OrgHosSelect ref="orgRef" v-model="pageParams.orgId" placeholder="集团"></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="pageParams.hosId"
              :parentId="pageParams.orgId"
              placeholder="机构"
            ></OrgHosSelect>
            <el-input placeholder="调研名称" v-model="queryParams.researchName" clearable />
            <el-input placeholder="模板名称" v-model="queryParams.templateName" clearable />
            <el-select
              placeholder="发起人"
              v-model="queryParams.researchUserId"
              clearable
              filterable
            >
              <el-option
                v-for="item in researchUserList"
                :key="item.researchUserId"
                :label="item.researchUserName"
                :value="item.researchUserId"
              />
            </el-select>
            <el-select
              placeholder="状态"
              v-model="queryParams.researchStatus"
              clearable
              filterable
              @change="handleStatusChange"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in researchStatusList"
                :key="item.value"
              />
            </el-select>
            <el-select
              placeholder="关闭人"
              v-model="queryParams.terminationUserId"
              clearable
              :disabled="!(queryParams.researchStatus === '4' || !queryParams.researchStatus)"
            >
              <el-option
                :label="item.terminationUserName"
                :value="item.terminationUserId"
                v-for="item in terminationUserList"
                :key="item.terminationUserId"
              />
            </el-select>
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="添加开启日期"
              end-placeholder="添加结束日期"
              range-separator="至"
              v-model="searchDate"
              clearable
              style="width: 410px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 75 }"
            height="0"
            ref="singleTable"
            :data="researchFormList"
            border
            v-loading="loading"
            row-key="patId"
          >
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="添加时间" prop="createDate" width="120" />
            <el-table-column label="开启时间" prop="startDate" width="120" />
            <el-table-column label="结束/关闭时间" prop="endDate" width="120" />
            <el-table-column label="调研名称" prop="researchName" width="180" />
            <el-table-column label="表单名称" prop="templateName" width="180" />
            <el-table-column prop="process" width="120">
              <template slot="header">
                <span style="margin-right: 4px">完成度</span>
                <el-tooltip effect="dark" content="完成人数/总人数" placement="top-start">
                  <i class="el-icon el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="researchStatusText">
              <template slot-scope="{ row }">
                {{ row.researchStatusText }}
                <el-tooltip
                  effect="dark"
                  :content="`关闭人：${row.terminationUserName}`"
                  placement="top-start"
                  v-if="row.researchStatusText === '已关闭'"
                >
                  <i
                    class="el-icon el-icon-warning-outline"
                    style="color: #446bbd; font-size: 12px"
                  ></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="发起人" prop="researchUserName" width="180" />
            <el-table-column label="调研机构" prop="researchHosName" width="180" />
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  v-if="row.researchStatus === '2'"
                  @click="pageToSurveyEditor(row, 'update')"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="pageToSurveyEditor(row, 'check')"
                  v-if="row.researchStatus !== '2'"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  @click="pageToResearchFeedback(row)"
                  v-if="row.researchStatus !== '2'"
                  >记录</el-button
                >
                <el-button
                  type="text"
                  v-if="row.researchStatus === '1' || row.researchStatus === '2'"
                  @click="downFollowResearch(row)"
                  >关闭</el-button
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
import {
  getResearchForm,
  getResearchUserInfo,
  downFollowResearch,
  getTerminationUser,
} from '@/api/modules/PatientCenter/index'
import { researchStatusList } from '@/utils/data-map'
export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
  },
  data() {
    return {
      loading: false,
      diseaseTypeList: [],
      searchDate: [],
      researchFormList: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      researchStatusList: researchStatusList,
      researchUserList: [],
      terminationUserList: [],
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.loading = true
    await this.getResearchUserInfo()
    await this.getTerminationUser()
    this.onInquire()
  },
  methods: {
    async getResearchUserInfo() {
      try {
        const res = await getResearchUserInfo()
        console.log('getResearchUserInfo===', res)
        this.researchUserList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async getTerminationUser() {
      try {
        const res = await getTerminationUser()
        console.log('getTerminationUser==', res)
        this.terminationUserList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    // 查询
    async onInquire(type) {
      try {
        const res = await getResearchForm({
          ...this.queryParams,
          ...this.pageParams,
          startDate: this.searchDate
            ? this.searchDate[0]
              ? `${this.searchDate[0]} 00:00:00`
              : ''
            : '',
          endDate: this.searchDate
            ? this.searchDate[1]
              ? `${this.searchDate[1]} 23:59:59`
              : ''
            : '',
        })
        console.log('getResearchForm==', res)

        const { result, total } = res
        this.total = total
        if ((!result || result.length === 0) && Object.keys(this.queryParams).length !== 0) {
          this.$message.warning('查询结果，暂无数据，请修改查询条件重试')
          setTimeout(() => {
            this.resetQueryParams()
          }, 500)
          return
        }

        this.researchFormList = res.result.map((item, index) => ({
          ...item,
          process: `${item.finishCount}/${item.totalCount}`,
          researchStatusText: researchStatusList.find(
            (researchStatus) => researchStatus.value === item.researchStatus,
          )
            ? researchStatusList.find(
                (researchStatus) => researchStatus.value === item.researchStatus,
              ).label
            : '/',
        }))
        this.researchFormList.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.loading = false
      } catch (error) {
        this.loading = false
        console.log(`error`, error)
      }
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.searchDate = []
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    pageToResearchFeedback(row) {
      this.$router.push({
        name: 'ResearchFeedback',
        query: {
          researchId: row.researchId,
        },
      })
    },
    pageToSurveyEditor(row, type) {
      this.$router.push({
        name: 'AddEditorSurvey',
        query: {
          researchId: row.researchId,
          type,
        },
      })
    },
    async downFollowResearch(row) {
      this.$confirm('确定关闭此调研？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          try {
            const res = await downFollowResearch({
              researchId: row.researchId,
              terminationUserId: sessionStorage.getItem('userId'),
              terminationUserName: sessionStorage.getItem('loginName'),
            })
            console.log('downFollowResearch', res)
            this.$message.success('关闭成功!')
            this.getTerminationUser()
            this.onInquire()
          } catch (err) {
            console.error(err)
          }
        })
        .catch(() => {})
    },
    handleStatusChange() {
      if (this.queryParams.researchStatus === '4' || !this.queryParams.researchStatus) {
      } else {
        this.$set(this.queryParams, 'terminationUserId', '')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.research-list {
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
}
</style>
