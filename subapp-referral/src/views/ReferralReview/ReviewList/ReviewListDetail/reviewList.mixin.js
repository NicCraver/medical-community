import queryListReferralSelectMixin from '@/mixins/queryListReferralSelect.mixin.js'

import { getAuditListInfo } from '@/api/modules/ReferralReview'

export default {
  mixins: [queryListReferralSelectMixin],
  data() {
    return {
      queryParams: {},
      pageParams: {
        pageSize: 10,
        pageNum: 1,
      },
      loading: false,
      reviewList: [], // 审核列表数据
      total: 0,
      resetParamsMap: {
        0: [
          'searchValue',
          'outHosId',
          'outDept',
          'referralType',
          'applyDate',
          'inDept',
          'receiveDrId',
          'auditDate',
        ],
        1: [
          'searchValue',
          'outHosId',
          'outDept',
          'referralType',
          'auditUserId',
          'applyDate',
          'clearable',
          'inDept',
          'auditDate',
          'auditDeptId',
          'auditReceiveDrId',
        ],
        2: [
          'searchValue',
          'outHosId',
          'outDept',
          'referralType',
          'outDept',
          'returnReasonCode',
          'applyDate',
          'inDept',
          'auditReturnDate',
        ],
      },
      emptyText: ' ',
    }
  },
  methods: {
    async onInquire() {
      // 查询时 调用一下转出机构的初始化方法 --- 解决有不同机构数据时，下拉框没更新的bug
      await this.$refs?.outHosRef?.getDataDownInit()
      this.loading = true

      try {
        console.log('this.queryParams.outDept', this.queryParams.outDept)
        const params = {
          ...this.queryParams,
          ...this.pageParams,
          auditStatus: this.auditStatus,
          outDeptId: this.outDeptId,
          outDeptType: this.outDeptType,
          inDeptId: this.inDeptId,
          inDeptType: this.inDeptType,
          auditDeptId: this.queryParams.auditDeptId
            ? this.queryParams.auditDeptId[this.queryParams.auditDeptId.length - 1]
            : '',
          auditDeptType: this.auditDeptType,
          applyDateS: this.queryParams.applyDate
            ? `${this.queryParams.applyDate[0]} 00:00:00` || ''
            : '',
          applyDateE: this.queryParams.applyDate
            ? `${this.queryParams.applyDate[1]} 23:59:59` || ''
            : '',
          auditDateS: this.queryParams.auditDate
            ? `${this.queryParams.auditDate[0]} 00:00:00` || ''
            : '',
          auditDateE: this.queryParams.auditDate
            ? `${this.queryParams.auditDate[1]} 23:59:59` || ''
            : '',
          auditReturnDateS: this.queryParams.auditReturnDate
            ? `${this.queryParams.auditReturnDate[0]} 00:00:00` || ''
            : '',
          auditReturnDateE: this.queryParams.auditReturnDate
            ? `${this.queryParams.auditReturnDate[1]} 23:59:59` || ''
            : '',
        }
        if (this.queryParams.auditDeptId && this.queryParams.auditDeptId.length === 1) {
          delete params.auditDeptId
        }
        if (this.auditStatus === '1') {
          delete params.inDeptId
          delete params.inDeptType
        }
        delete params.applyDate
        delete params.auditDate
        delete params.outDept
        delete params.inDept
        delete params.auditReturnDate
        let res = await getAuditListInfo(params)
        console.log('getAuditListInfo', res)
        if (res.code === 0) {
          console.log('待审核列表数据：', res)
          this.reviewList = res.result.map((item) => ({
            ...item,
          }))
          this.reviewList.forEach((el) => {
            for (let key in el) {
              if (!el[key]) {
                el[key] = '/'
              }
            }
          })
          this.total = res.total
          this.loading = false
          this.emptyText = '暂无数据'
        }
      } catch (error) {
        console.error(error)
      }
    },
    async resetQueryParams() {
      this.queryParams = {}
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.onInquire()
    },
    // resetQueryParams() {
    //   if (this.$IS_ORI_ADMIN) {
    //     for (let i = 0; i < this.resetParamsMap[this.auditStatus].length; i++) {
    //       this.$set(this.queryParams, this.resetParamsMap[this.auditStatus][i], '')
    //     }
    //   } else if (this.$IS_ORG_ADMIN) {
    //     for (let i = 0; i < this.resetParamsMap[this.auditStatus].length; i++) {
    //       this.$set(this.queryParams, this.resetParamsMap[this.auditStatus][i], '')
    //     }
    //     this.$set(this.queryParams, 'inHosId', '')
    //   } else {
    //     this.queryParams = {}
    //   }
    //   this.pageParams = {
    //     pageNum: 1,
    //     pageSize: 10,
    //   }
    //   this.onInquire()
    // },
    openReferDetailDrawer(row) {
      this.$emit('openReferDetailDrawer', row)
    },
    reload() {
      this.$set(this.queryParams, 'searchValue', '')
      this.onInquire()
      this.$emit('closeDrawer')
    },
  },
}
