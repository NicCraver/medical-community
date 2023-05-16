export const getKeyByValue = (obj, value) => {
  for(const key in obj) {
    if (obj[key] === value) {
      return key
    }
  }
}

export const sexMap = {
  '男': '1',
  '女': '2',
  '未说明':'9',
  '未知': '0'
}

export const paymentList = [
  {
    label: '城镇职工基本医疗保险',
    value: '1',
  },
  {
    label: '城镇居民基本医疗保险',
    value: '2',
  },
  {
    label: '新型农村合作医疗',
    value: '3',
  },
  {
    label: '贫困救助',
    value: '4',
  },
  {
    label: '商业医疗保险',
    value: '5',
  },
  {
    label: '全公费',
    value: '6',
  },
  {
    label: '全自费',
    value: '7',
  },
  {
    label: '其他',
    value: '8',
  },
]

// 是否超期
export const overdueFlgList = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
]

export const followUpTypeList =  [
  { label: '电话', value: '1' },
  { label: '网络', value: '2' },
  { label: '面访', value: '3' },
  { label: '不限', value: '4' }
]

export const followUpStatusList = [
  { label: '待随访', value: '1' },
  { label: '已随访', value: '2' },
  { label: '已中止', value: '3' },
  { label: '已关闭', value: '4' }
]


export const sexList = [
  { label: '男', value: '1' },
  { label: '女', value: '2' }
]


export const unitList = [
  { label: '日', value: '1' },
  { label: '月', value: '2' },
  { label: '年', value: '3' },
]
