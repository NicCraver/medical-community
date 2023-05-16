import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import { router } from '../router'
export const mainGoPage = (appName, path) => {
  console.log('appName, path', appName, path)
  if (!getActiveApps().includes(appName)) {
    console.log('2222222222', 2222222222)
    // 主应用跳转
    router.push(path)
  } else {
    let childPath = null
    // path的值形式如：/app-vue2/page2，这里/app-vue2是子应用的基础路由，/page2才是页面地址，所以我们需要将/app-vue2部分删除
    childPath = path.replace(/^\/app-[^/]+/, '')
    !childPath && (childPath = '/') // 防止地址为空
    // 主应用通过下发data数据控制子应用跳转
    microApp.setData(appName, { path: childPath })
  }
}
