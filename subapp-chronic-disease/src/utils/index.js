/*
 * @Author: Nic
 * @Date: 2022-04-11 11:43:34
 * @LastEditTime: 2023-04-06 21:21:15
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/utils/index.js
 */
export const getHttp = () => {
  let http = null
  if (window.__MICRO_APP_ENVIRONMENT__) {
    const masterDatas = window.microApp.getGlobalData()
    // console.log('masterDatas', masterDatas.async)
    http = masterDatas.async[1].content.default
    // console.log('http', http)
  }

  return http
}

export const getEncryptsm3 = () => {
  let temp = null
  if (window.__MICRO_APP_ENVIRONMENT__) {
    const masterDatas = window.microApp.getGlobalData()
    // console.log('masterDatas', masterDatas.async[2].content.encryptsm3)
    temp = masterDatas.async[2].content.encryptsm3
  }
  return temp
}

export const permissionFun = (level, callback) => {
  if (window.g.VUE_APP_PERMISSION >= level) {
    callback()
  } else {
    console.log(`权限不足`)
  }
}
// const fun = () => {

// };
// permissionFun(3,fun)
export const isPermission = (level) => {
  if (window.g.VUE_APP_PERMISSION >= level) {
    return true
  } else {
    console.log(`权限不足`)
    return false
  }
}
export const isEmpty = (val) => {
  if (!val) { // 先判断传入参数是否存在
    return true;
  }
  // 判断字符串类型
  if (typeof val === 'string') {
    return val.trim().length === 0;
  }
  // 如果是数组，则返回数组长度是否为0；否则返回对象属性长度是否为0
  return Array.isArray(val) ? val.length === 0 : Object.keys(val).length === 0;
};

// // 示例
// const obj1 = {};
// console.log(isEmpty(obj1)); // true

// const obj2 = {name: 'John', age: 30};
// console.log(isEmpty(obj2)); // false

// const arr1 = [];
// console.log(isEmpty(arr1)); // true

// const arr2 = [1, 2, 3];
// console.log(isEmpty(arr2)); // false

// console.log(isEmpty(null)); // true
// console.log(isEmpty(undefined)); // true

// const str1 = '';
// console.log(isEmpty(str1)); // true

// const str2 = '   ';
// console.log(isEmpty(str2)); // true

// const str3 = 'hello';
// console.log(isEmpty(str3)); // false