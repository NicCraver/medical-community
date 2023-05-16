<template>
  <div class="FollowUpRecords">
    <ProTable>
      <template #header>
        <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="queryParams.hosId"
          :parentId="queryParams.orgId"
          placeholder="机构"
        ></OrgHosSelect>
        <el-select placeholder="随访计划" v-model="queryParams.planId" clearable>
          <el-option
            v-for="item in planList"
            :key="item.planId"
            :value="item.planId"
            :label="item.planName"
          />
        </el-select>

        <el-select placeholder="随访人员" v-model="queryParams.followupUserId" clearable>
          <el-option
            v-for="item in followerList"
            :key="item.followupUserId"
            :value="item.followupUserId"
            :label="item.followupUserName"
          />
        </el-select>

        <el-select placeholder="是否超期" v-model="queryParams.overdueFlg" clearable>
          <el-option
            v-for="item in overdueFlgList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <el-select placeholder="评估状态" v-model="queryParams.feedbackStatus" clearable>
          <el-option label="待评估" value="0" />
          <el-option label="已评估" value="1" />
        </el-select> -->
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <el-table
        ref="singleTable"
        v-adaptive="{ bottomOffset: 75 }"
        height="0"
        :data="followUpList"
        border
        v-loading="loading"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="性别" prop="sexText" />
        <el-table-column label="年龄" prop="age" />
        <el-table-column label="联系电话" prop="phone" width="120px" />
        <el-table-column label="随访病种" prop="diseaseTypeText" min-width="120" />
        <el-table-column label="随访方式" prop="followUpTypeText" />
        <el-table-column label="随访状态" prop="followUpStatusText" width="100">
          <template slot-scope="{ row }">
            <span v-if="row.followupStatus === '3'">
              {{ row.followUpStatusText }}
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.terminationReason"
                placement="top-start"
              >
                <img src="./tips.png" alt="" width="15" />
              </el-tooltip>
            </span>
            <span v-else>{{ row.followUpStatusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否超期">
          <template slot-scope="{ row }">
            <span v-if="row.overdueFlgText === '超期'" style="color: #cf1322">
              {{ row.overdueFlgText }}
            </span>
            <span v-if="row.overdueFlgText === '正常'" style="color: #389e0d">
              {{ row.overdueFlgText }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="任务随访（截止）关闭时间" prop="nextFollowTime" width="200" />
        <el-table-column label="随访频率" prop="frequencyText" />
        <el-table-column label="随访计划起止时间" prop="followStartAndEndTime" width="220" />
        <el-table-column label="任务实际随访时间" prop="followupDate" min-width="180" />
        <el-table-column label="任务实际中止时间" min-width="180">
          <template slot-scope="{ row }">
            <span>{{ row.followupStatus === '3' ? row.terminationDate : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="随访人员" prop="followupUserName" />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              v-if="row.followupStatus === '2'"
              @click="pageToFollowUpDetail(row)"
              >查看</el-button
            >
            <span v-else>/</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 15px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNum"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </ProTable>
  </div>
</template>

<script>
import ProTable from '../../components/ProTable/index.vue'
import {
  getPersonFollowUpRecord,
  getPlanName,
  getFollowupUserIdAndName,
  getOrgDiseaseTypes,
} from '@/api/modules/PatientCenter'
import { overdueFlgList, followUpTypeList, followUpStatusList, sexList, unitList } from './data-map'

export default {
  data() {
    return {
      loading: false,
      queryParams: {},
      planList: [],
      doctorList: [],
      followUpList: [],
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },

      total: 0,
      followerList: [],
      overdueFlgList: overdueFlgList,
      diseaseTypeList: [],
    }
  },
  async mounted() {
    this.loading = true
    if (
      window.sessionStorage.getItem('queryParams') &&
      window.sessionStorage.getItem('pageParams')
    ) {
      this.queryParams = JSON.parse(window.sessionStorage.getItem('queryParams'))
      this.pageParams = JSON.parse(window.sessionStorage.getItem('pageParams'))
      window.sessionStorage.removeItem('queryParams')
      window.sessionStorage.removeItem('pageParams')
    }
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    await this.getOrgDiseaseTypes()
    await this.getPlanName()
    await this.getFollowupUserIdAndName()
    this.onInquire()
  },
  methods: {
    async getOrgDiseaseTypes() {
      try {
        const res = await getOrgDiseaseTypes()
        let diseaseTypeList = []
        res.result.forEach((item) => {
          diseaseTypeList = diseaseTypeList.concat(item.tagList)
        })
        this.diseaseTypeList = diseaseTypeList
      } catch (err) {
        console.error(err)
      }
    },
    async getPlanName() {
      try {
        const res = await getPlanName({ patId: this.$route.query.patId, isPerson: '0' })
        console.log('getPlanName====', res)
        this.planList = res.result
        if (this.planList.length) {
          this.$set(this.queryParams, 'planId', this.planList[0].planId)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getFollowupUserIdAndName() {
      try {
        const res = await getFollowupUserIdAndName({
          patId: this.$route.query.patId,
        })
        console.log('getFollowupUserIdAndName====', res)
        this.followerList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async onInquire() {
      this.loading = true
      try {
        const res = await getPersonFollowUpRecord({
          ...this.queryParams,
          ...this.pageParams,
          patId: this.$route.query.patId,
        })
        window.sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
        window.sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
        window.sessionStorage.setItem('pageParams', JSON.stringify(this.pageParams))
        console.log('getPersonFollowUpRecord==', res)
        this.loading = false
        // if (
        //   (!res.result || res.result.length === 0) &&
        //   Object.keys(this.queryParams).length !== 0
        // ) {
        //   this.$message.warning('查询结果，暂无数据，请修改查询条件重试')
        //   setTimeout(() => {
        //     this.resetQueryParams()
        //   }, 500)
        //   return
        // }
        if (!res.result) {
          return
        }
        this.followUpList = res.result.map((item) => ({
          ...item,
          initDate: item.initDate,
          followUpTypeText: followUpTypeList.find(
            (followType) => followType.value === item.followupType,
          ).label,
          followUpStatusText: followUpStatusList.find(
            (followUpStatus) => followUpStatus.value === item.followupStatus,
          ).label,
          sexText: sexList.find((sex) => sex.value === item.sex).label,
          diseaseTypeText: this.diseaseTypeList.find(
            (diseaseType) => diseaseType.value === item.diseaseCode,
          )
            ? this.diseaseTypeList.find((diseaseType) => diseaseType.value === item.diseaseCode)
                .label
            : '/',
          overdueFlgText: overdueFlgList.find((overdueFlg) => overdueFlg.value === item.overdueFlg)
            .label,
          followStartAndEndTime: `${item.followupStartTime}至${item.followupEndTime}`,
          frequencyText:
            item.followupTypeAssess === '1'
              ? `${item.followTimes}${
                  unitList.find((unit) => unit.value === item.frequencyUnit).label
                }1次`
              : '1次',
        }))
        this.total = res.total
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val
      this.onInquire()
    },
    handleSizeChange(val) {
      this.pageParams.pageNum = 1
      this.pageParams.pageSize = val
      this.onInquire()
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.followupTime = []
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    pageToFollowUpDetail(row) {
      const url = `/app-followup/FollowUpDetail?followupId=${row.followupId}&planId=${row.planId}`
      window.sessionStorage.setItem('activeComponent', 'FollowUpRecords')
      // window.history.pushState("", "", url);
      window.history.pushState(history.state, '', url)
      window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }))
    },
  },
  components: {
    ProTable,
  },
}
</script>

<style lang="scss" scoped>
.FollowUpRecords {
  padding: 10px;
}
.no-dialog {
  .title {
    padding: 0 10px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: rgba(245, 245, 245, 100);
    color: #303133;
    font-size: 16px;
  }
  .form {
    padding: 10px 20px 10px 0;
  }
  .el-input {
    width: 228px;
  }
}
</style>
