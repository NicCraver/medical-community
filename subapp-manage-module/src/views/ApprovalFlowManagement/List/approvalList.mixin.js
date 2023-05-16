export default {
  data() {
    return {
      pageParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      loading: false,
      approvalList: [],
      queryParams: {}
    }
  },
	methods: {
    onInquire() {},
		pageToApprovalFlowDetail(mode) {
      this.$router.push({
        name: 'ApprovalFlowDetail',
        query: {
          mode
        }
      })
    },
    batchStart() {},
    resetQueryParams() {},
    clearFun() {}
	}
}