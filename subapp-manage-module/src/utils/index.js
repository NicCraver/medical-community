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
