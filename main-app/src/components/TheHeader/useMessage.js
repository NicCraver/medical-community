import { onQueryReferralMessage } from '@/api/modules/referralMessage'
import { followUpAlertsList } from "@/api/modules/layout";
import store from '@/store/index'
// 判断是否显示消息红点提示  并  查询
export function useMessage() {
  const getQueryReferralMessage = async () => {
    try {
      const res = await onQueryReferralMessage({
        pageNum: 1,
        pageSize: 10,
      })
      if (res.result.records.length > 0) {
        store.dispatch('news/setDotFlag', true)
      } else {
        store.dispatch('news/setDotFlag', false)
      }
    } catch (error) {
      console.error('error', error)
    }
  }
  const getFollowUpAlertsList = async () => {
    try {
      const res = await followUpAlertsList({
        terminalCode: "PC",
        userId: window.sessionStorage.getItem("userId"),
      })
      // newsMessageList.value = res.result.records
      if (res.result.length > 0) {
        store.dispatch('news/setDotFlag', true)
      } else {
        store.dispatch('news/setDotFlag', false)
      }
    } catch (error) {
      console.error('error', error)
    }
  };
  // 转诊
  if (store.state.app.messageType === 'REF') {
    getQueryReferralMessage()
  }
  // 慢病
  if (store.state.app.messageType === 'DISE') {
    getFollowUpAlertsList()
  }
}
