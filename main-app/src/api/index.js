import Http from '../utils/httpCore/utils/http'
import { message } from 'ant-design-vue'
import { v4 as uuidv4 } from 'uuid'
import { encryptsm3, encryptsm4, decryptsm4 } from '../utils/utils'
import { router } from '../router'
import { envConfig } from '@/dev'

let isDev = process.env.NODE_ENV === 'development'
// 是否使用本地接口调试（不走加解密）
const LocalInterfaceDebugging = isDev ? false : false
const messageKey = 'updatable';
let baseURL = ''
if (LocalInterfaceDebugging) {
  // 静春
  // baseURL = 'http://192.168.199.243:7039'
  // 安成
  // baseURL = "http://192.168.199.24:7039";
} else {
  if (isDev) {
    console.log(`开发模式`, isDev)
    // 如果是开发模式使用envConfig函数，避免切换接口地址重启项目
    baseURL = envConfig()
    window.g = process.env
    window.g.VUE_APP_BASE_API = envConfig()
    window.g.VUE_APP_FILE_API = process.env.VUE_APP_FILE_API
    window.g.VUE_APP_PERMISSION = 2
  } else {
    if (Object.keys(window.env).length !== 0) {
      let global = window.env
      if (Object.hasOwnProperty.call(window.env, 'VUE_APP_API') && !Object.hasOwnProperty.call(window.env, 'VUE_APP_BASE_API')) {
        let host = window.location.host
        let port = window.location.port
        let http = 'http://'
        let ws = 'ws://'
        global.VUE_APP_BASE_API = http + host + window.env.VUE_APP_API
        global.VUE_APP_VIDEO_MDT_API = http + host + window.env.VUE_APP_VIDEO_MDT_API
        global.VUE_APP_DICOM_MDT_API = http + host + window.env.VUE_APP_DICOM_MDT_API
        global.VUE_APP_FILE_API = http + host + window.env.VUE_APP_FILE_API
        global.VUE_APP_WS_BASE_URL = ws + host + window.env.VUE_APP_API
      }
      window.g = Object.assign(process.env, global)
      console.log(`手动配置`, window.g)
    } else {
      // 赋值给 window.g 供子应用使用
      window.g = process.env
      console.log(`系统配置`, window.g)
    }
    baseURL = window.g.VUE_APP_BASE_API
  }
}

// 接口白名单
const whiteList = [
  '/ygt-user/user/generateKey',
  '/ygt-user/tbFilePath/uploadFiles',
  // '/ygt-user/user/login',
  // '/ygt-api/general/getToken',
  // '/ygt-user/user/logout',
  '/ips/admin/web/getCurrentUser',
  '/ygt-referral/tbRStatisticsAna/exportExcel',
  // '/ygt-user/tbMhLoginMenu/getLoginMenuById',
  // '/ygt-user/role3/getLoginOrgRoles',
  '/ygt-marketing/tbAProductRecords/exportProductCouponInfo',
  '/ygt-api/general/uploadFile',
  '/ygt-api/general/uploadPic',
  '/ygt-mdt/chatRoomController/uploadPic',
  '/ygt-mdt/tbMdtApplyUploadfileInfo/uploadFile',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatistics',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatisticsDetails',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatisticsByTeam',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatisticsByDoctor',
  '/ygt-marketing/tbPPromote/uploadLogo',
  '/ygt-marketing/upload/uploadFile',
  '/ygt-health-archive/ehrBalanceAccounts/exportExcel',
  // 黑龙江单点登录接口
  `${process.env.VUE_APP_SINGLE_API}/ips/admin/web/getCurrentUser`,
  '/ygt-referral/his/onCacheHisData',
  '/ygt-referral/his/onCheckHisDiagnoseData'
]

// 需要直接返回res 非标准接口
let returnResList = [
  '/ygt-referral/tbRStatisticsAna/exportExcel',
  '/ygt-marketing/tbAProductRecords/exportProductCouponInfo',
  '/ygt-marketing/tbPPromote/uploadLogo',
  '/ygt-marketing/upload/uploadFile',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatistics',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatisticsDetails',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatisticsByTeam',
  '/ygt-mdt/tbMdtConsultApplyInfo/exportMdtMrStatisticsByDoctor',
  '/ygt-health-archive/ehrBalanceAccounts/exportExcel',
]

const options = {
  axiosOptions: {
    baseURL,
    retry: 0,
    timeout: 60000,
  },
  // 请求拦截器
  requestInterceptorSuccessCb: (config) => {
    // // 黑龙江单点的登录请求的ip更改 ehr
    // if (
    //   config.url === '/ips/admin/web/getCurrentUser' ||
    //   config.url === '/ips/admin/web/beforeFact'
    // ) {
    //   let configs = {
    //     ...config,
    //     baseURL: window.g.APP_SINGEL_BASE_URL || '',
    //   }
    //   return configs
    // }
    // if (window.g.APP_HOSPITAL === '黑龙江') {
    //   return config
    // }

    if (LocalInterfaceDebugging) {
      // 如果是本地调试 接口去掉ygt前缀
      config.url = config.url.replace(
        /(\/ygt-richdiseases|\/ygt-registry-manage|\/ygt-health-archive)/g,
        '',
      )
      return config
    } else {
      // 参数加密
      return encryption(config)
    }
  },
  // 响应拦截器
  responseInterceptorSuccessCb: (res) => {
    // console.log(`responseInterceptorSuccessCb响应拦截器`, res)
    if (LocalInterfaceDebugging) {
      consoleRes(res)
      return res.data
    }
    // 没在白名单接口 进行解密
    if (whiteList.indexOf(res.config.url) === -1) {
      res.data = JSON.parse(decryptsm4(res.data))
    }
    // code = -1
    // if (res?.data?.code === -1) {
    //   console.log('请求失败：11111', res)
    //   message.error({
    //     content: res?.data?.desc || '操作失败!',
    //   })
    // }
    // code = 0 并且不在returnResList的接口
    if (res.data.code === 0 && returnResList.indexOf(res.config.url) === -1) {
      consoleRes(res)
      return res.data
    }
    // 在returnResList的接口
    else if (returnResList.indexOf(res.config.url) !== -1) {
      consoleRes(res)
      return res
    } else if (res?.data?.code === -1) {
      consoleErr(res)
      throw res.data
    } else {
      consoleErr(res)
      throw res.data
    }
  },
  // 错误拦截器
  responseInterceptorErrorCb: (error, code, msg) => {
    // console.log(`responseInterceptorErrorCb错误拦截器`, error)
    if (code === 401 || error.config.url === '/ygt-user/user/logout') {
      message.destroy()
      message.error({
        key: messageKey,
        content: 'token失效,请重新登录',
      })
      sessionStorage.clear()
      consoleErr(error)
      const internalInstance = getCurrentInstance()
      internalInstance.appContext.config.globalProperties.$disconnect()
      router.push('/login')
      // window?.location?.reload?.()
      return
    }
    if (
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      error.message.includes('timeout')
    ) {
      message.error(`请求错误，请稍后重试,错误代码：${error.code}`)
    }
    consoleErr(error, msg)
    return error.response ? error.response : msg
  },
}

const encryption = (config) => {
  // console.log(`config`, config)
  if (whiteList.indexOf(config.url) === -1) {
    //将appkey、token、timestamp、nonce、signature放入请求头中
    const appkey = sessionStorage.getItem('secretKey')
    const token = sessionStorage.getItem('token')
    const ct = sessionStorage.getItem('ct')
    const timestamp = new Date().getTime()
    // const timestamp = dayjs().unix()
    const nonce = uuidv4()
    config.headers.appkey = appkey
    if (token) {
      config.headers.token = token
    }
    config.headers.ct = ct
    config.headers.timestamp = timestamp
    config.headers.nonce = nonce
    let p = ''
    if (config.data) {
      p = encryptsm4(config.data)
    } else if (config.params) {
      // console.log("config.params :>> ", config.params);
      // if (config.params.pageNum) {
      //   config.params.pageNum = JSON.stringify(config.params.pageNum)
      // }
      // if (config.params.pageSize) {
      //   config.params.pageSize = JSON.stringify(config.params.pageSize)
      // }
      for (let i in config.params) {
        config.params[i] = config.params[i] + ''
      }
      // console.log('params1 -> ', config.params)
      p = encryptsm4(config.params)
      // console.log('params2 -> ', p)
    }
    let signature = encryptsm3(
      (
        config.url +
        'appkey=' +
        appkey +
        'ct=' +
        ct +
        'timestamp=' +
        timestamp +
        'nonce=' +
        nonce +
        p
      ).toLowerCase(),
    ).toUpperCase()
    config.headers.signature = signature
  }
  // console.log('config===========', config)
  return config
}
// 成功log
const consoleRes = (res) => {
  setTimeout(() => {
    console.log(
      `%c${'/' + res.config.url.split('/')[res.config.url.split('/').length - 1]}`,
      'font-weight:bold',
      JSON.parse(JSON.stringify(res.data)),
    )
  }, 0)
}
// 失败log
const consoleErr = (error, msg) => {
  const errLog = (row) => {
    console.error(
      `%c${'/' + error.config.url.split('/')[error.config.url.split('/').length - 1]}`,
      'font-weight:bold',
      row,
    )
  }
  if (error.status) {
    message.error((error?.data?.desc || '服务器错误，操作失败!'))
    errLog(error.data)
    // console.error(`__http__error`, error.data)
  } else if (error.response === undefined) {
    errLog(error.response ? error.response : msg)
    // console.error(`__http__error`, error.response ? error.response : msg)
  } else {
    message.error(
      (error?.response?.data?.desc || '服务器错误，操作失败!'),
    )
    errLog(error.response)
  }
}
// 实例化http
const http = new Http(options)

export default http
