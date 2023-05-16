<!--
 * @Author: Nic
 * @Date: 2022-12-06 14:54:12
 * @LastEditTime: 2023-03-13 18:04:43
 * @LastEditors: Nic
 * @Description: 登录
 * @FilePath: /medical-community/main-app/src/views/login/login.vue
-->
<template>
  <LoginLayout :title="loginLayoutState.title" :backgroundImage="loginLayoutState.backgroundImage">
    <a-form class="anx-login-ruleForm" ref="formRef" :model="formState" :rules="rules">
      <a-form-item ref="account" name="account">
        <a-input placeholder="账号" v-model:value="formState.account" allow-clear @pressEnter="onSubmit()" />
      </a-form-item>
      <a-form-item ref="userRoleRefId" name="userRoleRefId" v-if="!isMenHu()">
        <a-select
          ref="select"
          v-model:value="formState.userRoleRefId"
          :loading="roleLoading"
          placeholder="请选择组织/机构"
        >
          <a-select-option v-for="v in roleOptions" :key="v.VALUE" :value="v.VALUE">{{ v.LABEL }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item ref="password" name="password">
        <a-input-password
          v-model:value="formState.password"
          placeholder="密码"
          allow-clear
          style="margin-top: 5px"
          @pressEnter="onSubmit()"
          autocomplete="off"
        />
      </a-form-item>
      <a-form-item>
        <a-button style="width: 100%; margin-top: 10px" type="primary" :loading="loading" @click="onSubmit"
          >登录</a-button
        >
      </a-form-item>
    </a-form>
  </LoginLayout>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoginLayout from './components/LoginLayout.vue'
import { notification, message } from 'ant-design-vue'
import { CheckCircleFilled } from '@ant-design/icons-vue'
import { userLogin, getToken, getLoginMenus, getLoginMenuById, generateKey } from '@/api/modules/login/index'
import { logout } from '@/api/modules/layout'
import { encryptsm3 } from '@/utils/utils'
import { isBackstage, isHei, isMenHu, menuHei } from '@/dev'
import { useLoginForm, useSystemConfig } from './hooks'
import { useLoginMessage } from '@/hooks/useLoginMessage'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const store = useStore()
const router = useRouter()

// 表单相关逻辑
const { formState, rules, roleOptions, roleLoading, formRef, loading } = useLoginForm()

// 设置系统配置

const { loginLayoutState } = useSystemConfig()

// 判断环境是否为后台管理
const build_env = computed(() => {
  // 开发环境 - 以开发环境为准
  if (process.env.NODE_ENV === 'development') {
    return isBackstage()
  }
  // 否则 判断VUE_APP_BUILD_ENV是否为后台管理
  return window.g.VUE_APP_BUILD_ENV === 'backstage'
})

// 获取密文key
const getGenerateKey = async () => {
  try {
    const fpPromise = FingerprintJS.load()
    const fp = await fpPromise
    const { visitorId } = await fp.get()
    // console.log(`visitorId`, visitorId)
    const res = await generateKey({ id: visitorId })
    const { key } = res.result
    sessionStorage.setItem('ct', visitorId)
    sessionStorage.setItem('secretKey', key)
  } catch (error) {
    // console.log(`error`, error)
  }
}

// 登录提交校验
const onSubmit = () => {
  formRef.value.validate().then(() => {
    // console.log(`校验通过`)
    onLogin()
  })
}

// 登录 - 获取token - 获取菜单
const onLogin = async () => {
  try {
    loading.value = true
    const loginRes = await userLogin({
      loginName: formState.account,
      pwd: encryptsm3(formState.password),
      loginType: '1',
    })
    if (loginRes.code === 0) {
      // 存储 角色id 用户id 用户名称
      sessionStorage.setItem('roleIds', loginRes.result.roleIds)
      sessionStorage.setItem('userId', loginRes.result.userId)
      sessionStorage.setItem('username', loginRes.result.loginName)
      onGetToken(loginRes)
    } else {
      loading.value = false
      message.error(loginRes.data.desc)
    }
  } catch (error) {
    // console.error(`error`, error)
    loading.value = false
  }
}

// 获取token
const onGetToken = async (loginRes) => {
  try {
    const tokenRes = await getToken({ userId: loginRes.result.userId })
    sessionStorage.setItem('token', tokenRes.result.token)
    // sessionStorage.setItem('secretKey', tokenRes.result.secretKey)
    onGetLoginMenus(loginRes)
  } catch (error) {
    // console.error(`onGetToken - error`, error)
    loading.value = false
  }
}

// 获取菜单、角色等信息
const onGetLoginMenus = async (loginRes) => {
  try {
    let appIds = []
    if (isHei()) {
      // console.log(`是否是黑龙江环境`)
      appIds = ['c9981569b299440dac08fd1d76559dc8', '747daaf979f14c6bb332cfccb1b724cb', '7686eb68fe3b4242a5991e681f865d95', '8cc41399417548408d2c6b28c7213f4c']
    } else if (isMenHu()) {
      appIds = ['c9981569b299440dac08fd1d76559dc8', '8cc41399417548408d2c6b28c7213f4c']
    } else {
      // console.log(`是否是后台管理环境`, build_env.value)
      appIds = build_env.value ? ['c9981569b299440dac08fd1d76559dc8'] : []
    }
    // console.log(`appIds`, appIds)
    const menusRes = await getLoginMenus({
      userRoleRefId: formState.userRoleRefId,
      appIds: appIds,
    })
    // console.log(`menusRes`, menusRes)
    if (menusRes.code === -1) {
      loading.value = false
      message.error(menusRes.desc)
      onLogout()
      return
    }
    // 科室等信息
    let deptObject = {
      deptIds: menusRes.result.currentRole.deptIds,
      deptId: menusRes.result.currentRole.deptId,
      deptTypeAndDeptIds: menusRes.result.currentRole.deptTypeAndDeptIds,
      deptName: menusRes.result.currentRole.deptName,
      hosId: menusRes.result.currentRole.hosId,
      hosName: menusRes.result.currentRole.hosName,
      orgId: menusRes.result.currentRole.orgId,
      deptTelephone: menusRes.result.currentRole.deptTelephone,
    }

    sessionStorage.setItem('deptObject', JSON.stringify(deptObject))
    sessionStorage.setItem('currentRole', JSON.stringify(menusRes.result.currentRole))
    sessionStorage.setItem('allRoles', JSON.stringify(menusRes.result.roles))
    sessionStorage.setItem('orgId', menusRes.result.currentRole.orgId)

    let headerLoginName = ''
    // 判断是否为管理员、集团、机构
    if (menusRes.result.currentRole.authType === '9999') {
      sessionStorage.setItem('isRootAdmin', true)
    } else if (menusRes.result.currentRole.authType === '3fad093759674f539d5910a29b45ae4c') {
      sessionStorage.setItem('isOrgAdmin', true)
      // console.log(`loginRes.result.orgName`, loginRes.result.orgName)
      headerLoginName = `${menusRes.result.currentRole.orgName}-${loginRes.result.name}`
      // console.log(`headerLoginName`, headerLoginName)
    } else if (menusRes.result.currentRole.authType === '12e1c7ef650f44ae9ca08fe17ea81c7f') {
      sessionStorage.setItem('isOriAdmin', true)
      headerLoginName = `${loginRes.result.name}${
        menusRes.result.currentRole.deptName ? '-' + menusRes.result.currentRole.deptName : ''
      }${menusRes.result.currentRole.hosName ? '-' + menusRes.result.currentRole.hosName : ''}`
    }
    // console.log(`headerLoginName`, headerLoginName)
    //组装header医生名称
    sessionStorage.setItem('headerLoginName', headerLoginName)
    sessionStorage.setItem('loginName', loginRes.result.name)
    // 完成后跳转到首页
    getApplicationData(menusRes.result.currentRole.menus, menusRes.result.currentRole.basePage)
  } catch (error) {
    // console.error(`onGetLoginMenus - error`, error)
    loading.value = false
    message.error(error.desc)
    onLogout()
  }
}

// 保存菜单数据及跳转首页
const getApplicationData = (menus, basePage) => {
  let tempMeuns = menus
  // console.log(`getApplicationData`)
  // 判断是否是 数据治理-黑龙江环境
  if (isHei()) {
    tempMeuns = menuHei(menus)
  }
  // 保存菜单数据
  sessionStorage.setItem('menuDataKeys', JSON.stringify(tempMeuns))
  setTimeout(() => {
    loading.value = false
    // console.log(`!isHei()`, !isHei())
    if (!isHei()) {
      // console.log(`success`)
      notification['success']({
        message: '成功',
        description: '验证成功，即将跳转到首页',
        icon: h(CheckCircleFilled, { style: 'color: #72C140' }),
        duration: 2,
        top: '55px',
      })
    }
    // 判断系统是否有登录消息的逻辑
    if (store.state.app.isOpenMessageFunc) {
      useLoginMessage()
    }
    // 设置系统消息类型
    // setSystemMessageType(menus)

    if (build_env.value) {
      if (!isNaN(parseFloat(basePage))) {
        router.push(basePage)
      } else {
        router.push('/app-manageModule/organAdmin')
      }
    } else {
      // 如果没有basePage 则获取菜单数据第一项
      router.push(basePage || tempMeuns[0].path)
    }
  }, 500)
}

// 退出登录
const onLogout = async () => {
  try {
    await logout(sessionStorage.getItem('userId'))
    sessionStorage.clear()
  } catch (err) {
    // console.error(err)
  }
}

const currentTime = ref(new Date().toLocaleTimeString())

let timer = null

const startTimer = () => {
  timer = setInterval(() => {
    // 定时4分钟刷新这个方法
    getGenerateKey()
  }, 240000)
}

const stopTimer = () => {
  clearInterval(timer)
  timer = null
}

onMounted(() => {
  getGenerateKey()
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})
</script>
