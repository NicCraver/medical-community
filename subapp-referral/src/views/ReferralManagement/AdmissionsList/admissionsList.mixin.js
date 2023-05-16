import queryListReferralSelectMixin from '@/mixins/queryListReferralSelect.mixin'
import { getAdmissionsInfo } from '@/api/modules/admissions'

export default {
  mixins: [queryListReferralSelectMixin],
  props: {
    activeComponent: String,
  },
  data() {
    return {
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      loading: false,
      admissionsList: [],
      resetParamsMap: {
        0: ['searchValue', 'outHosId', 'outDept', 'applyDate'],
        1: [
          'searchValue',
          'outHosId',
          'outDept',
          'applyDrId',
          'applyDate',
          'admReceiveDrId',
          'applyStatus',
          'admDate',
        ],
      },
      listenerParams: [''],
      emptyText: ' ',
      time: null,
      DEPT_IN_disabled: false,
    }
  },
  computed: {
    inDeptId() {
      const deptId = this.admStatus === '0' ? 'auditDeptId' : 'inDept'
      if (this.queryParams[deptId]) {
        if (Array.isArray(this.queryParams[deptId]) && this.queryParams[deptId].length > 1) {
          return this.queryParams[deptId][this.queryParams[deptId].length - 1]
        } else {
          return ''
        }
        // return this.queryParams[deptId][this.queryParams[deptId].length - 1]
      }
      return ''
    },
    inDeptType() {
      const deptId = this.admStatus === '0' ? 'auditDeptId' : 'inDept'
      if (this.queryParams[deptId]) {
        if (Array.isArray(this.queryParams[deptId]) && this.queryParams[deptId].length === 1) {
          return this.queryParams[deptId][0]
        } else {
          return ''
        }
        // return this.queryParams[deptId][0]
      }
      return ''
    },
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.DEPT_IN_disabled = this.$refs.hosRef.getHosLength() === 1 ? true : false
    // this.queryParams.auditDeptId = JSON.parse(sessionStorage.getItem('deptObject')).deptId
    // this.queryParams.inDept = JSON.parse(sessionStorage.getItem('deptObject')).deptId
    console.log(`this.DEPT_IN_disabled`, this.DEPT_IN_disabled)
    this.onInquire()
  },
  // let listenerParams = []
  // if (this.admStatus === '0') {
  //   if (this.$IS_ORI_ADMIN) {
  //     listenerParams = ['orgId', 'admHosId', 'auditDeptId', 'auditReceiveDrId']
  //   } else if (this.$IS_ORG_ADMIN) {
  //     listenerParams = ['orgId']
  //   }
  // } else {
  //   if (this.$IS_ORI_ADMIN) {
  //     listenerParams = ['orgId', 'admHosId', 'inDept', 'admReceiveDrId']
  //   } else if (this.$IS_ORG_ADMIN) {
  //     listenerParams = ['orgId']
  //   }
  // }
  // console.log('listenerParams', listenerParams)
  // if (!listenerParams.length) {
  //   this.onInquire()
  // } else {
  //   this.time = setInterval(() => {
  //     let flag = true
  //     for (let i = 0; i < listenerParams.length; i++) {
  //       if (listenerParams[i] !== 'auditReceiveDrId' && listenerParams[i] !== 'admReceiveDrId') {
  //         flag = flag && !!this.queryParams[listenerParams[i]]
  //       } else {
  //         console.log('this.queryParams[listenerParams[i]]', this.queryParams[listenerParams[i]])
  //         flag = flag && this.queryParams[listenerParams[i]] !== undefined
  //         //  && this.queryParams[listenerParams[i]] !== ''
  //       }
  //     }
  //     console.log('flag', flag)
  //     if (flag) {
  //       console.log('this.queryParams.admReceiveDrId', this.queryParams.admReceiveDrId)
  //       clearInterval(this.time)
  //       this.onInquire()
  //     }
  //   }, 100)
  // }
  beforeDestroy() {
    if (this.time) {
      clearInterval(this.time)
    }
  },
  methods: {
    async onInquire() {
      try {
        this.loading = true
        this.emptyText = '暂无数据'
        const params = {
          ...this.queryParams,
          ...this.pageParams,
          admStatus: this.admStatus,
          outDeptId: this.outDeptId,
          outDeptType: this.outDeptType,
          applyDateS: this.queryParams.applyDate
            ? `${this.queryParams.applyDate[0]} 00:00:00` || ''
            : '',
          applyDateE: this.queryParams.applyDate
            ? `${this.queryParams.applyDate[1]} 23:59:59` || ''
            : '',
          admDateS: this.queryParams.admDate ? `${this.queryParams.admDate[0]} 00:00:00` || '' : '',
          admDateE: this.queryParams.admDate ? `${this.queryParams.admDate[1]} 23:59:59` || '' : '',
        }

        if (this.admStatus === '0') {
          params.auditDeptId = this.inDeptId
          params.auditDeptType = this.inDeptType
        } else {
          params.admDeptId = this.inDeptId
          params.admDeptType = this.inDeptType
        }
        delete params.inDept
        const res = await getAdmissionsInfo(params)
        console.log(`res.result`,res)
        this.admissionsList = res.result?.map((item) => ({
          ...item,
          referralTypeDesc: item.referralType === 'A' ? '上转' : '下转',
        }))
        this.admissionsList.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.total = res.total
        this.loading = false
        if (this.time) {
          clearInterval(this.time)
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 重置
    resetQueryParams() {
      if (this.$IS_ORI_ADMIN) {
        for (let i = 0; i < this.resetParamsMap[this.admStatus].length; i++) {
          this.$set(this.queryParams, this.resetParamsMap[this.admStatus][i], '')
        }
      } else if (this.$IS_ORG_ADMIN) {
        for (let i = 0; i < this.resetParamsMap[this.admStatus].length; i++) {
          this.$set(this.queryParams, this.resetParamsMap[this.admStatus][i], '')
        }
        this.$set(this.queryParams, 'admHosId', '')
      } else {
        this.queryParams = {}
      }
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.onInquire()
    },
    pageToAdmissionsListDetail(mode, row) {
      window.sessionStorage.setItem('activeTab', this.activeComponent)
      this.$router.push({
        name: 'AdmissionsListDetail',
        query: {
          status: mode,
          referralId: row.applyId,
          admissionsId: row.id,
        },
      })
    },
  },
}
