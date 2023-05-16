export default {
  computed: {
    outDeptId() {
      if (this.queryParams.outDept && this.queryParams.outDept.length > 1) {
        return this.queryParams.outDept[this.queryParams.outDept.length - 1]
      }
      return ''
    },
    outDeptType() {
      if (this.queryParams.outDept && this.queryParams.outDept.length === 1) {
        return this.queryParams.outDept[0]
      }
      return ''
    },
    inDeptId() {
      if (this.queryParams.inDept && this.queryParams.inDept.length > 1) {
        return this.queryParams.inDept[this.queryParams.inDept.length - 1]
      }
      return ''
    },
    inDeptType() {
      if (this.queryParams.inDept && this.queryParams.inDept.length === 1) {
        return this.queryParams.inDept[0]
      }
      return ''
    },
    auditDeptType() {
      if (this.queryParams.auditDeptId && this.queryParams.auditDeptId.length === 1) {
        console.log('this.queryParams.auditDeptId', this.queryParams.auditDeptId)
        return this.queryParams.auditDeptId[0]
      }
      return ''
    },
  },
  // mounted() {
  //   if (this.$route.name !== 'AdmissionsList') {
  //     this.$nextTick(() => {
  //       this.$EVENT_BUS.$on('referralSelectReady', () => {
  //         if (this.setRECDefault && this.$IS_ORI_ADMIN) {
  //           this.$set(this.queryParams, 'auditReceiveDrId', window.sessionStorage.getItem('userId'))
  //           console.log('queryParams====', this.queryParams)
  //           debugger
  //         }
  //         this.onInquire()
  //       })
  //     })
  //   }
  // },
  beforeDestroy() {
    this.$EVENT_BUS.$off('referralSelectReady')
  },
}
