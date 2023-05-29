import {
  userLogin,
  getToken,
  getLoginMenus,
  getLoginMenuById,
  getLoginOrgRoles,
} from '@/api/modules/login/index'
import { isBackstage, systemName } from '@/dev'
import { debounce } from '@/utils'
import { useStore } from 'vuex'

export const useLoginForm = () => {
  // 登录表单
  const formState = reactive({
    account: '',
    password: '',
    userRoleRefId: null,
  })
  // 表单规则
  const rules = {
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    userRoleRefId: [{ required: true, message: '请选择组织/机构', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  }
  const formRef = ref()
  const loading = ref(false)
  const roleOptions = ref([])
  const roleLoading = ref(false)
  const onGetLoginOrgRoles = async () => {
    try {
      const res = await getLoginOrgRoles({ loginname: formState.account })
      if (res.result.length > 0) {
        roleOptions.value = res.result
        res.result.forEach((el) => {
          if (el.DEFAULT_FLG === 'Y') {
            formState.userRoleRefId = el.VALUE
          }
        })
      } else {
        formState.userRoleRefId = null
        roleOptions.value = []
      }
      roleLoading.value = false
    } catch (error) {
      console.error(`error`, error)
      roleLoading.value = false
    }
  }

  const inputchange = debounce(() => {
    onGetLoginOrgRoles()
  }, 500)

  // 监听账号变化 调用组织机构下拉框接口
  watch(
    () => formState.account,
    (newValue) => {
      if (newValue === '') {
        formState.userRoleRefId = null
        roleOptions.value = []
      } else {
        roleLoading.value = true
        inputchange()
      }
    },
  )
  return {
    formState,
    rules,
    roleOptions,
    roleLoading,
    formRef,
    loading,
  }
}

export const useSystemConfig = () => {
  const store = useStore()
  const loginLayoutState = reactive({
    // backstage default qiqihaer
    backgroundImage: 'default',
  })
  let appName = window.g.VUE_APP_BROWSER_TITLE
  if (process.env.NODE_ENV === 'development') {
    appName = systemName()
  }
  function initConfig(appName) {
    let appTitle = '慢病管理平台'
    let menuTitle = ''
    let hosName = ''
    // 是否显示菜单logo
    let isShowMenuLogo = true
    // 是否显示登录页logo
    let isShowLoginLogo = true
    // 是否执行登录消息方法及实时消息方法
    let isOpenMessageFunc = true
    // 是否显示消息图标
    let isShowMessage = true
    // 消息类型 会诊、慢病、转诊、活动
    let messageType = ''
    const map = {
      齐齐哈尔: () => {
        loginLayoutState.backgroundImage = 'qiqihaer'
        hosName = '齐齐哈尔'
        appTitle = '慢病管理中心'
        menuTitle = '慢病管理中心'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'DISE'
      },
      '鹰眼观谱科技-慢病管理平台': () => {
        hosName = '鹰眼观谱科技'
        loginLayoutState.backgroundImage = '鹰眼观谱科技'
        appTitle = '慢病管理平台'
        menuTitle = '慢病管理平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'DISE'
      },
      '鹰眼观谱科技-多学科会诊平台': () => {
        hosName = '鹰眼观谱科技'
        loginLayoutState.backgroundImage = '鹰眼观谱科技'
        appTitle = '多学科会诊平台'
        menuTitle = '多学科会诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'MDT'
      },
      '鹰眼观谱科技-双向转诊平台': () => {
        hosName = '鹰眼观谱科技'
        loginLayoutState.backgroundImage = '鹰眼观谱科技'
        appTitle = '双向转诊平台'
        menuTitle = '双向转诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'REF'
      },
      慢病管理平台: () => {
        appTitle = '慢病管理平台'
        menuTitle = '慢病管理平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'DISE'
      },
      多学科会诊平台: () => {
        appTitle = '多学科会诊平台'
        menuTitle = '多学科会诊平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'MDT'
      },
      双向转诊平台: () => {
        appTitle = '双向转诊平台'
        menuTitle = '双向转诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'REF'
      },
      服务资源管理: () => {
        // browserTitle = '服务资源管理'
        appTitle = '医共体信息平台'
        menuTitle = '医共体信息平台门户'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      质量控制中心平台: () => {
        appTitle = '质量控制中心平台'
        menuTitle = '质量控制中心平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      黑龙江电子病历: () => {
        hosName = '黑龙江'
        // browserTitle = '服务资源管理'
        appTitle = '电子病历信息平台'
        menuTitle = '黑龙江电子病历门户'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      阿克苏: () => {
        loginLayoutState.backgroundImage = 'akesu'
        hosName = '阿克苏'
        appTitle = '双向转诊平台'
        menuTitle = '双向转诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'REF'
      },
      医共体信息平台: () => {
        appTitle = '医共体信息平台'
        menuTitle = '医共体信息平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      后台管理: () => {
        appTitle = '后台管理'
        menuTitle = '后台管理'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = false
        isShowMessage = false
      },
    }
    if (isDev()) {
      appName = '后台管理'
    }
    if (map[appName]) {
      map[appName]()
      //  存储到vuex
      store.dispatch('app/setAppTitle', appTitle)
      store.dispatch('app/setMenuTitle', menuTitle)
      store.dispatch('app/setIsShowMenuLogo', isShowMenuLogo)
      store.dispatch('app/setIsShowLoginLogo', isShowLoginLogo)
      store.dispatch('app/setIsOpenMessageFunc', isOpenMessageFunc)
      store.dispatch('app/setIsShowMessage', isShowMessage)
      store.dispatch('app/setMessageType', messageType)
      store.dispatch('app/setHosName', hosName)
      menuTitle = menuTitle === '' ? appTitle : menuTitle
      // browserTitle = browserTitle === '' ? appTitle : browserTitle
      // document.title = window.sessionStorage.getItem('browserTitle')
      // window.sessionStorage.setItem('browserTitle', browserTitle)
    }
  }

  function isDev() {
    if (process.env.NODE_ENV === 'development') {
      return isBackstage()
    }
    return window.g.VUE_APP_BUILD_ENV === 'backstage'
  }

  initConfig(appName)
  return { loginLayoutState }
}
