<template>
  <div class="FU-PatientCenter-List">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>个人随访列表</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-select placeholder="随访计划" v-model="queryParams.planId" clearable>
              <el-option
                v-for="item in planList"
                :key="item.planId"
                :value="item.planId"
                :label="item.planName"
              />
            </el-select>
            <el-select placeholder="随访病种" v-model="queryParams.diseaseCode" clearable>
              <el-option
                v-for="(item, index) in personDiseaseList"
                :key="item.diseaseCode + index"
                :value="item.diseaseCode"
                :label="item.diseaseName"
              />
            </el-select>
            <el-select
              v-model="queryParams.followupStatus"
              clearable
              @change="handleFollowupStatusChange"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="item in followUpStatusList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
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
            <el-select
              placeholder="是否可录入"
              v-model="queryParams.isEntry"
              :disabled="queryParams.followupStatus !== '1'"
              clearable
            >
              <el-option
                v-for="item in isEntryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <OrgHosSelect
              ref="orgRef"
              v-model="queryParams.orgId"
              placeholder="集团"
            ></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="queryParams.hosId"
              :parentId="queryParams.orgId"
              placeholder="机构"
            ></OrgHosSelect>
            <el-select
              placeholder="随访人员"
              v-model="queryParams.operaterId"
              clearable
              :disabled="queryParams.followupStatus !== '2' && queryParams.followupStatus !== '3'"
            >
              <el-option
                v-for="item in operaterList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <!-- 
            <el-select
              placeholder="评估状态"
              v-model="queryParams.feedbackStatus"
              :disabled="queryParams.followupStatus !== '2'"
              clearable
            >
              <el-option label="待评估" value="0" />
              <el-option label="已评估" value="1" />
            </el-select> -->
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <component
            :is="FollowUpTypeTable"
            :pageParams="pageParams"
            :followUpList="followUpList"
            @showSuspendFollowUp="showSuspendFollowUp"
            @pageToFollowUpDetail="handleQueryParams"
          />
        </ProList>
      </template>
    </ProLayout>
    <SuspendFollowUp
      :visible="suspendFollowUpVisible"
      :closeDialog="
        () => {
          suspendFollowUpVisible = false
        }
      "
      :suspendFollowParams="suspendFollowParams"
      @terminationFollowUpSuccess="onInquire"
    />
  </div>
</template>

<script>
import {
  getPersonFollowUpList,
  getFollowupDiseaseCodeAndName,
  getPlanName,
  getFollowupUserIdAndName,
  getFollowUpSuspendList,
} from '@/api/modules/PatientCenter'
import { ProList, ProLayout, IconSvg } from 'anx-vue'
import LoadFollowUp from './LoadFollowUp'
import AllFollowUp from './AllFollowUp'
import HasFollowUped from './HasFollowUped'
import EndedFollowUp from './EndedFollowUp'
import ClosedFollowUp from './ClosedFollowUp'
import SuspendFollowUp from '@/components/SuspendFollowUp/SuspendFollowUp'
import {
  followUpTypeList,
  followUpStatusList,
  sexList,
  overdueFlgList,
  unitList,
  isEntryList,
} from '@/utils/data-map'
export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
    LoadFollowUp,
    AllFollowUp,
    HasFollowUped,
    EndedFollowUp,
    ClosedFollowUp,
    SuspendFollowUp,
  },
  data() {
    return {
      FollowUpTypeTable: 'LoadFollowUp',
      patId: '',
      followUpStatusList: followUpStatusList,
      planList: [],
      personDiseaseList: [],
      operaterList: [],
      // table
      followUpList: [],
      // 查询请求参数
      queryParams: {},
      // 总数
      total: 0,
      // 分页请求删除
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      suspendFollowUpVisible: false,
      suspendFollowParams: {},
      overdueFlgList: overdueFlgList,
      isEntryList: isEntryList,
    }
  },
  async mounted() {
    const { patId, planId = '', diseaseCode = '', overdueFlg = '' } = this.$route.query

    this.patId = patId
    await this.getPlanName()
    await this.getFollowupUserIdAndName()
    await this.getFollowupDiseaseCodeAndName()

    if (
      window.sessionStorage.getItem('queryParams') &&
      window.sessionStorage.getItem('isBackFromDetail') &&
      window.sessionStorage.getItem('pageParams')
    ) {
      this.queryParams = JSON.parse(window.sessionStorage.getItem('queryParams'))
      this.pageParams = JSON.parse(window.sessionStorage.getItem('pageParams'))
      window.sessionStorage.removeItem('queryParams')
      window.sessionStorage.removeItem('pageParams')
      window.sessionStorage.removeItem('isBackFromDetail')
      await this.onInquire()
      return
    }
    this.$set(this.queryParams, 'followupStatus', '1')
    this.$set(this.queryParams, 'isEntry', '1')
    this.queryParams = {
      followupStatus: '1',
      planId: planId,
      diseaseCode: diseaseCode,
      overdueFlg: overdueFlg,
    }
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    await this.onInquire()
  },
  methods: {
    async getPlanName() {
      try {
        const res = await getPlanName({ patId: this.patId, isPerson: '1' })
        console.log('getPlanName====', res)
        this.planList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async getFollowupUserIdAndName() {
      try {
        const res = await getFollowupUserIdAndName({ patId: this.patId })
        console.log('getFollowupUserIdAndName====', res)
        this.operaterList = res.result.map((item) => ({
          value: item.followupUserId,
          label: item.followupUserName,
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async getFollowUpSuspendList() {
      try {
        const res = await getFollowUpSuspendList({ patId: this.patId })
        console.log('getFollowUpSuspendList====', res)
        this.operaterList = res.result.map((item) => ({
          value: item.terminationUserId,
          label: item.terminationUserName,
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async getFollowupDiseaseCodeAndName() {
      try {
        const res = await getFollowupDiseaseCodeAndName({ patId: this.patId })
        console.log('getFollowupDiseaseCodeAndName==', res)
        this.personDiseaseList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async onInquire() {
      if (this.queryParams.followupStatus === '') {
        this.FollowUpTypeTable = 'AllFollowUp'
      } else if (this.queryParams.followupStatus === '1') {
        this.FollowUpTypeTable = 'LoadFollowUp'
      } else if (this.queryParams.followupStatus === '2') {
        this.FollowUpTypeTable = 'HasFollowUped'
      } else if (this.queryParams.followupStatus === '3') {
        this.FollowUpTypeTable = 'EndedFollowUp'
      } else if (this.queryParams.followupStatus === '4') {
        this.FollowUpTypeTable = 'ClosedFollowUp'
      }

      try {
        const res = await getPersonFollowUpList({
          ...this.queryParams,
          ...this.pageParams,
          patId: this.patId,
          followupUserId:
            this.queryParams.followupStatus === '2' ? this.queryParams.operaterId : '',
          terminationUserId:
            this.queryParams.followupStatus === '3' ? this.queryParams.operaterId : '',
        })
        const { result, total } = res
        if (
          (!result || result.length === 0) &&
          Object.keys(this.queryParams).length !== 0 &&
          this.queryParams.followupStatus !== '1'
        ) {
          this.$message.warning('查询结果，暂无数据，请修改查询条件重试')
          setTimeout(() => {
            this.resetQueryParams()
          }, 500)
          return
        }
        if (!result) {
          this.followUpList = []
          return
        }
        this.total = total
        result.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.followUpList = result.map((item) => {
          const disease = this.personDiseaseList.find(
            (diseaseType) => diseaseType.diseaseCode === item.diseaseCode,
          )
          return {
            ...item,
            followUpTypeText: followUpTypeList.find(
              (followType) => followType.value === item.followupType,
            )?.label,
            followUpStatusText: followUpStatusList.find(
              (followUpStatus) => followUpStatus.value === item.followupStatus,
            )?.label,
            sexText: sexList.find((sex) => sex.value === item.sex)?.label,
            diseaseTypeText: disease ? disease.diseaseName : '/',
            overdueFlgText: overdueFlgList.find(
              (overdueFlg) => overdueFlg.value === item.overdueFlg,
            )?.label,
            followStartAndEndTime: `${item.followupStartTime}至${item.followupEndTime}`,
            frequencyText:
              item.followupTypeAssess === '1'
                ? item.frequencyRule ? item.frequencyTimesContent : `${item.followTimes}${
                    unitList.find((unit) => unit.value === item.frequencyUnit)?.label
                  }1次`
                : '1次',
          }
        })
      } catch (error) {
        console.log(`error`, error)
      }
    },
    showSuspendFollowUp(row) {
      this.suspendFollowParams = row
      this.suspendFollowUpVisible = true
    },
    handleFollowupStatusChange(val) {
      if (val === '2') {
        this.getFollowupUserIdAndName()
      } else if (val === '3') {
        this.getFollowUpSuspendList()
      } else {
        this.$set(this.queryParams, 'operaterId', '')
      }
      if (val !== '1') {
        this.$set(this.queryParams, 'isEntry', '')
      }
      this.onInquire()
    },
    async resetQueryParams() {
      this.queryParams = { followupStatus: '1' }
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.onInquire()
    },
    handleQueryParams() {
      console.log('this.queryParams===', this.queryParams)
      window.sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
      window.sessionStorage.setItem('pageParams', JSON.stringify(this.pageParams))
    },
  },
}
</script>

<style lang="scss" scoped>
.FU-PatientCenter-List {
  .ProList {
    border-radius: 2px;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
  }
  ::v-deep .pro-table .query-conditions .actions {
    margin-top: 10px !important;
  }
}
</style>
