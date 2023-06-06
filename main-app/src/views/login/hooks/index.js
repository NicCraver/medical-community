import {
  getLoginOrgRoles,
} from '@/api/modules/login/index'
import { debounce } from '@/utils'

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