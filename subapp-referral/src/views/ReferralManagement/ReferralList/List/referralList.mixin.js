import queryListReferralSelectMixin from '@/mixins/queryListReferralSelect.mixin'
import { getReferralListInfo } from '@/api/modules/referralList'

export default {
  props: {
    activeComponent: String,
  },
  data() {
    return {
      hospitalList: [],
      diagnosisList: [],
      rollInOrgList: [],
      rollOutOrgList: [],
      rollInDeptList: [],
      rollOutDeptList: [],
      referralDoctorList: [],
      referralList: [],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      multipleSelection: [],
      resetParamsMap: {
        0: [
          'searchValue',
          'diagnoseCode',
          'referralType',
          'applyStatus',
          'applyDrId',
          'applyDate',
          'icdName',
        ],
        1: ['searchValue', 'inHosId', 'inDept', 'auditDate', 'outDept', 'applyDrId', 'applyDate'],
        2: [
          'searchValue',
          'inHosId',
          'inDept',
          'applyStatus',
          'admApplyDate',
          'outDept',
          'applyDrId',
          'applyDate',
        ],
        3: [
          'searchValue',
          'diagnoseCode',
          'abortReasonCode',
          'abortDate',
          'outDept',
          'applyDrId',
          'applyDate',
          'icdName',
        ],
      },
      emptyText: ' ',
    }
  },
  mixins: [queryListReferralSelectMixin],
  methods: {
    async onInquire() {
      try {
        this.emptyText = '暂无数据'
        this.loading = true
        const params = {
          ...this.queryParams,
          ...this.pageParams,
          referralStatus: this.referralStatus,
          outDeptId: this.outDeptId,
          outDeptType: this.outDeptType,
          inDeptId: this.inDeptId,
          inDeptType: this.inDeptType,
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
          admApplyDateS: this.queryParams.admApplyDate
            ? `${this.queryParams.admApplyDate[0]} 00:00:00` || ''
            : '',
          admApplyDateE: this.queryParams.admApplyDate
            ? `${this.queryParams.admApplyDate[1]} 23:59:59` || ''
            : '',
          abortDateS: this.queryParams.abortDate
            ? `${this.queryParams.abortDate[0]} 00:00:00` || ''
            : '',
          abortDateE: this.queryParams.abortDate
            ? `${this.queryParams.abortDate[1]} 23:59:59` || ''
            : '',
        }
        delete params.applyDate
        delete params.auditDate
        delete params.outDept
        delete params.inDept
        delete params.admApplyDate
        delete params.abortDate
        const res = await getReferralListInfo(params)
        console.log('getReferralListInfo==', res)
        this.referralList = res.result.map((item) => ({
          ...item,
          referralTypeDesc: item.referralType === 'A' ? '上转' : '下转',
        }))
        this.referralList.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.total = res.total
        this.loading = false
      } catch (err) {
        console.error(err)
      }
    },
    async resetQueryParams() {
      this.queryParams = {};
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.onInquire()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    pageToReferralDetail(mode, row) {
      window.sessionStorage.setItem('activeTab', this.activeComponent)
      this.$router.push({
        name: 'ReferralListDetail',
        query: {
          status: mode,
          referralId: row.id,
        },
      })
    },
  },
}
