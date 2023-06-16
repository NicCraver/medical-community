<template>
  <div class="TheHeader" id="TheHeader">
    <div class="icon-name">
      <a-dropdown placement="bottom">
        <template #overlay>
          <a-menu>
            <a-menu-item @click="onLogout">
              <template #icon>
                <LogoutOutlined />
              </template>
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </template>
        <div class="name">
          <a-avatar :size="24" class="icon">
            <template #icon>
              <img src="../../assets/man.png" alt="" />
            </template>
          </a-avatar>
          <div>{{ loginName }}</div>
        </div>
      </a-dropdown>
    </div>
    <div class="icon-name" v-if="allRoles.length > 0">
      <a-dropdown placement="bottom">
        <template #overlay>
          <a-menu v-model:selectedKeys="selectedKeysRole">
            <a-menu-item v-for="v in allRoles" @click="currentRoleChange(v)" :key="v.name">
              <span>{{ v.name }}</span>
            </a-menu-item>
          </a-menu>
        </template>
        <div class="name">
          <div>{{ currentRole.roleName }}</div>
        </div>
      </a-dropdown>
    </div>
    <!-- 转诊消息提示 -->
    <div class="message-tips" v-if="store.state.app.isShowMessage" @click="newsState.newsVisible = true">
      <div class="message-tips">
        <a-badge :dot="dotFlag">
          <IconFont type="icon-lingdang" style="font-size: 24px" />
        </a-badge>
      </div>
    </div>
    <ReferralNewsDrawer
      v-if="store.state.app.messageType === 'REF'"
      @changeNewsVisible="changeNewsVisible"
      :newsState="newsState"
    ></ReferralNewsDrawer>
    <FolowupDrawer
      v-if="store.state.app.messageType === 'DISE'"
      @changeNewsVisible="changeNewsVisible"
      :newsState="newsState"
    ></FolowupDrawer>
    <MdtDrawer
      v-if="store.state.app.messageType === 'MDT'"
      @changeNewsVisible="changeNewsVisible"
      :newsState="newsState"
    ></MdtDrawer>
  </div>
</template>

<script setup>
import '@/assets/abcIconFont'
import dayjs from 'dayjs'
import { LogoutOutlined, createFromIconfontCN } from '@ant-design/icons-vue'
import ReferralNewsDrawer from './NewsComponents/ReferralNewsDrawer.vue'
import FolowupDrawer from './NewsComponents/FolowupDrawer.vue'
import MdtDrawer from './NewsComponents/MdtDrawer.vue'
import { followUpAlerts, followUpAlertsList, logout } from '@/api/modules/layout'
import { useMessage } from './useMessage'
import { useCurrentRole } from './useCurrentRole'
import { useStore } from 'vuex'
import { notification } from 'ant-design-vue'

const IconFont = createFromIconfontCN({
  scriptUrl: '',
})

// 消息相关数据
const newsState = reactive({
  newsVisible: false,
  hasReviewList: false,
  hasAdmissionsList: false,
  hasFollowUpList: false,
})

const { currentRole, allRoles, selectedKeysRole, currentRoleChange } = useCurrentRole()

const changeNewsVisible = () => {
  newsState.newsVisible = false
}
const store = useStore()

const dotFlag = computed(() => {
  if (store.state.news.dotFlag) {
    return true
  } else {
    return false
  }
})

const loginName = computed(() => {
  return sessionStorage.getItem('headerLoginName') || '超级管理员'
})
const router = useRouter()
const internalInstance = getCurrentInstance()
const onLogout = async () => {
  console.log(`11111111`, 11111111)
  try {
    await logout(sessionStorage.getItem('userId'))
    sessionStorage.clear()
    notification.destroy()
    console.log(`router`, router)
    console.log(`store`, store)
    store.dispatch('app/setInitData')
    router.push('/login')
    internalInstance.appContext.config.globalProperties.$disconnect()
    // window?.location?.reload?.()
  } catch (err) {
    sessionStorage.clear()
    notification.destroy()
    window?.location?.reload?.()
    console.error(err)
  }
}

onMounted(() => {
  // console.log('store================', store.state.app.isOpenMessageFunc)
  // useLoginMessage()
  // 判断是否需要消息系统
  if (store.state.app.isOpenMessageFunc) {
    // 消息红点状态更新
    useMessage()
    // VueNativeSock 连接 （类型为REF 转诊系统是 开启）
    if (
      store.state.app.messageType === 'REF' ||
      store.state.app.messageType === 'DISE' ||
      store.state.app.messageType === 'MDT'
    ) {
      console.log('VueNativeSock 连接', window.g.VUE_APP_WS_BASE_URL)
      internalInstance.appContext.config.globalProperties.$connect(
        `${window.g.VUE_APP_WS_BASE_URL}/ygt-message-server/message/${sessionStorage.getItem('userId')}`,
        // `ws://124.196.7.86:7001/ygt-message-server/message/${sessionStorage.getItem('userId')}`
      )
    }
  }

  let menuData = JSON.parse(sessionStorage.getItem('menuDataKeys'))

  const treeFindFn = (tree, func) => {
    for (let node of tree) {
      if (func(node)) return node
      if (node.children) {
        let result = treeFindFn(node.children, func)
        if (result) return result
      }
    }
    return false
  }
  let reviewList = '/app-referral/reviewList'
  let admissionsList = '/app-referral/admissionsList'
  let followUpList = '/app-followup/FollowUpList'
  let findFlag1 = treeFindFn(menuData, (node) => node.path === reviewList)
  let findFlag2 = treeFindFn(menuData, (node) => node.path === admissionsList)
  let findFlag3 = treeFindFn(menuData, (node) => node.path === followUpList)
  newsState.hasReviewList = findFlag1 ? true : false
  newsState.hasAdmissionsList = findFlag2 ? true : false
  newsState.hasFollowUpList = findFlag3 ? true : false
})
</script>

<style lang="less" scoped>
.TheHeader {
  display: flex;
  align-items: center;
  .icon-name {
    padding: 0 10px;
    cursor: pointer;
    .name {
      font-size: 14px;
      color: #595959;
      .icon {
        margin-right: 10px;
      }
      display: flex;
      align-items: center;
    }
  }
  .icon-name:hover {
    background: #f6f6f6;
  }
  .setting {
    cursor: pointer;
    padding: 0 10px;
  }
  .setting:hover {
    background: #f6f6f6;
  }
  .undeal-list {
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 50%;
    .msg-div {
      display: flex;
      align-items: center;
      height: 36px;
      color: #85888e;
      padding: 0 14px;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0px 2px 2px 1px rgba(155, 155, 155, 40);
      margin-bottom: 38px;
      &:last-child {
        margin-bottom: 0;
      }
      .el-icon-warning {
        margin-right: 14px;
        &.orange {
          color: #ffa940;
          font-size: 16px;
        }
        &.red {
          color: #ff4d4f;
          font-size: 16px;
        }
      }
      .msg {
        flex: 1;
        .text-button {
          color: #446bbd;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .el-icon-close {
        cursor: pointer;
      }
    }
  }
  .message-tips {
    cursor: pointer;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 0 10px;
    // position: relative;
    // .circle {
    //   position: absolute;
    //   display: inline-block;
    //   width: 8px;
    //   height: 8px;
    //   background: rgba(255, 77, 79, 100);
    //   border-radius: 50%;
    //   top: 15px;
    //   right: 0;
    // }
  }
  .message-tips:hover {
    background: #f6f6f6;
  }
  .temp-list {
    min-width: 360px;
    min-height: 500px;
    background: #f6f6f6;
  }
  .message-list {
    position: fixed;
    right: 52px;
    width: 360px;
    background: #fff;
    top: 65px;
    border-radius: 4px;
    box-shadow: 0px 1px 4px -1px rgba(0, 0, 0, 0.4);
    height: 650px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    .title {
      line-height: 30px;
      text-align: center;
      font-size: 16px;
      padding-top: 10px;
    }
    .list {
      flex: 1;
      overflow: auto;
      .message {
        display: flex;
        padding: 15px;
        .avatar {
          line-height: 35px;
          text-align: center;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          color: #fff;
          &.exceed {
            background: rgba(255, 77, 79, 100);
          }
          &.load {
            background: rgba(255, 169, 64, 100);
          }
        }
        .content {
          flex: 1;
          margin-left: 11px;
          line-height: 1;
          display: flex;
          flex-direction: column;
          .date,
          .tips {
            font-size: 12px;
            color: rgba(117, 117, 117, 100);
          }
          .msg {
            padding: 5px 0;
            .text-button {
              color: #446bbd;
              text-decoration: underline;
              cursor: pointer;
              float: right;
            }
          }
        }
      }
    }
    .check-all {
      font-size: 12px;
      color: rgba(117, 117, 117, 100);
      text-decoration: underline;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
