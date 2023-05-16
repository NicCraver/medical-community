import { getLoginMenus } from '@/api/modules/login/index'
import { useRouter } from 'vue-router'
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import store from '../../store/index'
import useIndex from '../../layouts/index'
import { notification } from 'ant-design-vue'
const { fnDisposeChildPath } = useIndex()
export function useCurrentRole() {
  const router = useRouter()
  const selectedKeysRole = ref([])
  const currentRole = ref({})
  const allRoles = ref([])
  currentRole.value = JSON.parse(sessionStorage.getItem('currentRole'))
  allRoles.value = JSON.parse(sessionStorage.getItem('allRoles'))
  selectedKeysRole.value.push(currentRole.value.roleName)
  // console.log('selectedKeysRole', selectedKeysRole)
  // console.log('currentRole.value', currentRole.value)
  // console.log('allRoles.value', allRoles.value)

  const currentRoleChange = (val) => {
    if (val.name === currentRole.value.roleName) return
    // console.log('val.id', JSON.parse(JSON.stringify(val)))
    getLoginMenusData(val.id)
  }
  const getLoginMenusData = async (roleId) => {
    try {
      const res = await getLoginMenus({
        userId: sessionStorage.getItem('userId'),
        roleId,
      })
      // sessionStorage.clear()
      notification.destroy()
      const { menus, basePage } = res.result.currentRole
      let deptObject = {
        deptIds: res.result.deptIds,
        deptId: res.result.deptId,
        deptName: res.result.deptName,
        hosId: res.result.hosId,
        hosName: res.result.hosName,
        orgId: res.result.orgId,
        deptTelephone: res.result.deptTelephone,
      }
      // console.log('deptObject', deptObject)
      sessionStorage.setItem('deptObject', JSON.stringify(deptObject))
      sessionStorage.setItem('currentRole', JSON.stringify(res.result.currentRole))
      sessionStorage.setItem('allRoles', JSON.stringify(res.result.roles))
      currentRole.value = res.result.currentRole
      allRoles.value = res.result.roles
      selectedKeysRole.value = []
      selectedKeysRole.value.push(currentRole.value.roleName)
      store.dispatch('app/setPath', '/')
      setTimeout(() => {
        getApplicationData(menus, basePage)
      }, 100)
    } catch (error) {
      console.error('error', error)
    }
  }

  function getApplicationData(menus, basePage) {
    let appName = basePage.split('/')[1]
    sessionStorage.setItem('menuDataKeys', JSON.stringify(menus))
    store.dispatch('app/setPath', basePage)
    if (!getActiveApps().includes(appName)) {
      // console.log('if================')
      // 主应用跳转内部
      router.push(basePage)
    } else {
      // console.log('else================', fnDisposeChildPath(basePage))
      microApp.setData(appName, { basePath: '/' + appName, path: fnDisposeChildPath(basePage) })
    }
  }
  return {
    selectedKeysRole,
    currentRole,
    allRoles,
    currentRoleChange,
  }
}
