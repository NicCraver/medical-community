/**
 * 加载指定目录下的文件模块
 * @param contxt require.context只支持静态路径
 * @returns {*} 文件模块
 */
export function loadModules(context) {
  const load = (context) => context.keys().map(context)
  return load(context)
    .filter((e) => e.default)
    .map((e) => e.default)
}

export function loadResource(context) {
  const load = (context) => context.keys().map(context)
  return load(context)
}

export function loadStoreModules(context, ext = 'js') {
  const ms = {}
  context.keys().map((key) => {
    const pathname = key.split('/')
    let propName = pathname[pathname.length - 1].replace(`.${ext}`, '')
    if (propName === 'index') {
      const prev = pathname[pathname.length - 2]
      if (prev && (prev !== '.' || prev !== '..')) {
        propName = prev
      }
    }
    ms[propName] = context(key).default
  })
  return ms
}

/**
 * 生成唯一ID
 * @param prefix
 * @return {string}
 */
export function uuid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2)}`
}

/**
 * 获取浏览器地址里的参数
 * @param url
 * @return {{}}
 */
export function getQueryObject(url = window.location.href) {
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 获取格式化后的时间字符串
 * 默认为当前时间的yyyy-MM-dd hh:mm:ss
 * @param fmt
 * @param date
 * @return {string}
 */
export function getDateFormat(fmt = 'yyyy-MM-dd hh:mm:ss', date = new Date()) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
  }

  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      )
    }
  }
  return fmt
}

export function sequencePromises(promiseFns, ...args) {
  promiseFns.unshift(Promise.resolve())
  return new Promise((resolve, reject) => {
    iterator(promiseFns[0], 0, resolve, reject)
  })

  function iterator(promise, cursor, resolve, reject) {
    promise
      .then((data) => {
        const next = cursor + 1
        const nextPFn = promiseFns[next]
        if (nextPFn) {
          iterator(nextPFn.apply(nextPFn, [data, ...args]), next, resolve, reject)
        } else {
          resolve(data)
        }
      })
      .catch((err) => {
        reject(err)
      })
  }
}

// 简单深度拷贝
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && source[keys] instanceof File) {
      targetObj[keys] = source[keys]
    } else if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 处理文件下载
 * @param filename
 * @param blob
 */
export function handleDownload(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', false, false)
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }
}

export function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const debounce = (fun, delay) => {
  let t = ''
  return (args) => {
    let that = this
    let _args = args
    clearTimeout(t)
    t = setTimeout(function () {
      fun.call(that, _args)
    }, delay)
  }
}
