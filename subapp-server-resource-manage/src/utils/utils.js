import {
  getDictSimpleByCodes
} from "api/dictCodes.js";


//防抖
export function debounce(func, delay = 100) {
  let timer = null;
  return function (...args) {
    let context = this
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  }
};

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source && source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

//日期格式转换
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

// 字典反显方法
export async function getDictCodesList(list) {
  let codeInit = ["BIZ_TYPE"];
  let codeList = list ? list.join(",") : codeInit.join(",");
  try {
    let res = await getDictSimpleByCodes({
      codes: codeList
    });
    if (res.code === 0) {
      console.log("获取缓存字典列表信息:", res);
      localStorage.setItem("dictCodes", JSON.stringify(res.result));
    }
  } catch (error) { }
}

// 字典反显方法
export async function getPCodesList(list, fn) {
  let codeList = list ? list.join(",") : "";
  try {
    let res = await getDictSimpleByCodes({
      codes: codeList
    });
    if (res.code === 0) {
      console.log("获取某个类型的字典列表信息:" + codeList, res);
      let list = JSON.parse(localStorage.getItem("dictCodes")) || [];
      let newList = res.result;
      let allList = list.concat(newList);
      localStorage.setItem("dictCodes", JSON.stringify(allList));
      fn && fn(newList)
    }
  } catch (error) { }
}

// 寻找parentCode数据
export function getCodesListFuc(code) {
  let dictCodesList = JSON.parse(localStorage.getItem("dictCodes")) || [];
  // 查询有没有包含code的数据
  let pCodeArr = dictCodesList.filter((item) => {
    return item && item.partentCode === code;
  });
  if (!pCodeArr || !pCodeArr.length) {
    getPCodesList([code], (list) => {
      pCodeArr = deepClone(list);
    })
    return;
  }
  return pCodeArr || [];
}

// 根据value查label值
// key:value arr:要查的数组 keyField:数组中的value字段 labelField:数组中的label字段
export function getLabelByKey(key, arr, keyField, labelField) {
  return (arr.find(item => item[keyField] == key)?.[labelField]) ?? '--'
}