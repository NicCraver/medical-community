/*
 * @Author: Nic
 * @Date: 2023-02-20 09:19:32
 * @LastEditTime: 2023-02-24 13:56:21
 * @LastEditors: Nic
 * @Description: 权限控制 指令
 * @FilePath: /medical-community/subapp-chronic-disease/src/directives/permission.js
 */
function checkArray(level) {
    if (window.g.VUE_APP_PERMISSION >= level) {
        return true // 有权限
    } else {
        return false // 无权限
    }
}

const permission = {
    inserted: function (el, binding) {
        let permission = binding.value // 获取到 v-permission的值
        if (permission) {
            let hasPermission = checkArray(permission)
            if (!hasPermission) {
                console.log(`权限不足 v-permission`)
                // 没有权限 移除Dom元素
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    },
}

export default permission