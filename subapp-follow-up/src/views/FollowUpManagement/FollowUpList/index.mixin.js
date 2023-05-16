import dayjs from 'dayjs'
import {
  getOrgDiseaseTypes,
  getPersonFollowUpList,
  getFollowupUserIdAndName,
  getFollowupIncludeUserList,
} from '@/api/modules/PatientCenter'
import { suspendReasons } from '@/utils/data-map'
import {
  followUpTypeList,
  followUpStatusList,
  sexList,
  overdueFlgList,
  unitList,
} from '@/utils/data-map'

export default {
  data() {
    return {
      queryParams: {},
      diseaseTypeList: [],
      followupIncludeUserList: [],
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 1,
      followUpList: [],
      dateSelectList: [
        { label: '今日', value: '1' },
        { label: '本周', value: '2' },
        { label: '本月', value: '3' },
      ],
      overdueFlgList: overdueFlgList,
      followerList: [],
      suspendReasons: suspendReasons,
      isFirstRequest: true,
      loading: false,
      statusQueryParamsMap: {
        1: 'loadFollowupQueryParams',
        2: 'hasFollowupQueryParams',
        3: 'hasSuspendQueryParams',
        4: 'hasClosedQueryParams',
      },
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    window.addEventListener('beforeunload', () => {
      window.sessionStorage.removeItem('systemCall')
      window.sessionStorage.removeItem('followupId')
    })
    this.loading = true
    await this.getOrgDiseaseTypes()
    await this.getFollowupUserIdAndName()
    await this.getFollowupIncludeUserList()
    this.setInitParams()
    this.onInquire()
  },
  methods: {
    setInitParams() {
      if (
        this.followupIncludeUserList.find((_) => _.userInfoId === sessionStorage.getItem('userId'))
      ) {
        this.$set(this.queryParams, 'followupIncludeUserId', sessionStorage.getItem('userId'))
      } else {
        this.$set(this.queryParams, 'followupIncludeUserId', '')
      }
      // 判断是否丛其他页面带着条件跳转过来的（如果是并且是第一次进入搜索则赋值queryParams, 否则从缓存获取queryParams）
      const pageChangeType = window.sessionStorage.getItem('pageChangeType')
      console.log('pageChangeType=====', pageChangeType)
      if (pageChangeType === 'first') {
        const {
          searchValue = '',
          followupStartTime = '',
          followupEndTime = '',
          diseaseCode = '',
          overdueFlg = '',
          initCode = '',
          isEntry = '',
        } = this.$route.query

        this.$set(this.queryParams, 'searchValue', searchValue)
        this.$set(this.queryParams, 'overdueFlg', overdueFlg)
        this.$set(this.queryParams, 'diseaseCode', diseaseCode)
        this.$set(this.queryParams, 'initCode', initCode)

        if (this.followupStatus === '1') {
          this.$set(this.queryParams, 'isEntry', isEntry)
        }

        if (followupStartTime && followupEndTime) {
          this.$set(this.queryParams, 'followupTime', [
            dayjs(new Date(followupStartTime)).format('YYYY-MM-DD'),
            dayjs(new Date(followupEndTime)).format('YYYY-MM-DD'),
          ])
        } else {
          this.$set(this.queryParams, 'followupTime', null)
        }
        // 设置额外请求参数
        if (
          this.followupIncludeUserList.find(
            (_) => _.userInfoId === sessionStorage.getItem('userId'),
          )
        ) {
          this.$set(this.queryParams, 'followupIncludeUserId', sessionStorage.getItem('userId'))
        } else {
          this.$set(this.queryParams, 'followupIncludeUserId', '')
        }
        this.$set(this.queryParams, 'followupId', window.sessionStorage.getItem('followupId') || '')
        this.$set(this.queryParams, 'systemCall', window.sessionStorage.getItem('systemCall') || '')
        this.$set(
          this.queryParams,
          'isNotNet',
          window.sessionStorage.getItem('isNotNet') === '1' ? '1' : '0',
        )
        this.$set(
          this.queryParams,
          'isAlerts',
          window.sessionStorage.getItem('pageFrom') === 'msgBTips' ? '1' : '0',
        )
        window.sessionStorage.removeItem('followupId')
        window.sessionStorage.removeItem('systemCall')
        window.sessionStorage.removeItem('isNotNet')
        window.sessionStorage.removeItem('pageFrom')
        // 修改缓存，改为不是第一次进入了
        window.sessionStorage.setItem('pageChangeType', 'notFirst')
      } else if (pageChangeType === 'notFirst') {
        this.queryParams = {}
        if (
          this.followupIncludeUserList.find(
            (_) => _.userInfoId === sessionStorage.getItem('userId'),
          )
        ) {
          this.$set(this.queryParams, 'followupIncludeUserId', sessionStorage.getItem('userId'))
        } else {
          this.$set(this.queryParams, 'followupIncludeUserId', '')
        }
      } else {
        const followupListQueryParams = window.sessionStorage.getItem(
          this.statusQueryParamsMap[this.followupStatus],
        )
        if (followupListQueryParams) {
          this.queryParams = JSON.parse(followupListQueryParams).queryParams
          this.pageParams = JSON.parse(followupListQueryParams).pageParams
        }
      }
    },
    async getFollowupIncludeUserList() {
      try {
        const res = await getFollowupIncludeUserList()
        console.log('getFollowupIncludeUserList====', res)
        this.followupIncludeUserList = res.result
        if (
          this.followupIncludeUserList.find(
            (_) => _.userInfoId === sessionStorage.getItem('userId'),
          )
        ) {
          this.$set(this.queryParams, 'followupIncludeUserId', sessionStorage.getItem('userId'))
        } else {
          this.$set(this.queryParams, 'followupIncludeUserId', '')
        }
      } catch (err) {
        console.error(err)
      }
    },
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
    async getFollowupUserIdAndName() {
      try {
        const res = await getFollowupUserIdAndName()
        console.log('getFollowupUserIdAndName====', res)
        this.followerList = res.result.map((item) => ({
          ...item,
          label: item.followupUserName,
          value: item.followupUserId,
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async onInquire(type) {
      if (type === 'btn-search') {
        this.pageParams.pageNum = 1
      }
      this.loading = true
      try {
        const pageFrom = window.sessionStorage.getItem('pageFrom')
        const queryParams = {
          followupStatus: this.followupStatus,
          ...this.queryParams,
          findDateS:
            this.queryParams.followupTime && this.queryParams.followupTime.length
              ? `${this.queryParams.followupTime[0]} 00:00:00`
              : '',
          findDateE:
            this.queryParams.followupTime && this.queryParams.followupTime.length
              ? `${this.queryParams.followupTime[1]} 23:59:59`
              : '',
          ...this.pageParams,
          terminalCode: 'PC',
        }
        delete queryParams.followupTime

        const res = await getPersonFollowUpList(queryParams)

        // 非消息提示进入随访页面的缓存查询数据
        if (!window.sessionStorage.getItem('pageChangeType')) {
          window.sessionStorage.setItem(
            this.statusQueryParamsMap[this.followupStatus],
            JSON.stringify({ queryParams: this.queryParams, pageParams: this.pageParams }),
          )
        }

        this.loading = false
        const { result, total } = res
        this.total = total
        if (!result || !result.length) {
          if (this.pageParams.pageNum === 1) {
            this.followUpList = []
          } else {
            this.pageParams.pageNum = 1
            this.onInquire()
          }
          return
        }

        result.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        console.log('followUpTypeList====', result)
        this.followUpList = result.map((item) => {
          const disease = this.diseaseTypeList.find(
            (diseaseType) => diseaseType.value === item.diseaseCode,
          )
          return {
            ...item,
            initDate: item.initDate.split(' ')[0],
            followUpTypeText: followUpTypeList.find(
              (followType) => followType.value === item.followupType,
            )?.label,
            sexText: sexList.find((sex) => sex.value === item.sex)
              ? sexList.find((sex) => sex.value === item.sex)?.label
              : item.sex,
            diseaseTypeText: disease ? disease?.label : '/',
            overdueFlgText: overdueFlgList.find(
              (overdueFlg) => overdueFlg.value === item.overdueFlg,
            )?.label,
            followStartAndEndTime: `${item.followupStartTime}至${item.followupEndTime}`,
            frequencyText:
              item.followupTypeAssess === '1'
                ? item.frequencyRule ? item.frequencyTimesContent : `${item.followTimes}${
                    unitList.find((unit) => unit.value === item.frequencyUnit)?.label || ""
                  }1次`
                : '1次',
          }
        })
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    },
    pageToFollowUpDetail(row) {
      if (row.isEntry === '0') {
        this.$message.warning(`${row.canEntryTime}可录入`)
        return
      }
      window.sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
      window.sessionStorage.setItem('followupStatus', this.followupStatus)

      // 录入的话时间为当前时间，补录的的话是任务截止时间
      this.$router.push({
        name: 'FollowUpDetail',
        query: {
          followupId: row.followupId,
          planId: row.planId,
        },
      })
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageSize: 10,
        pageNum: 1,
      }
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
  },
  watch: {
    $route() {
      this.setInitParams()
      this.onInquire()
    },
  },
}
