export const followPlanList = [
  { label: '治疗随访', value: '1' },
  { label: '管理随访', value: '2' },
  { label: '关怀随访', value: '3' },
]

export const unitList = [
  { label: '日', value: '1' },
  { label: '月', value: '2' },
  { label: '年', value: '3' },
]

export const frequencyUnitList = [
  { label: '日/1次', value: '1' },
  { label: '月/1次', value: '2' },
  { label: '年/1次', value: '3' },
]

export const followUpTypeList =  [
  { label: '电话', value: '1' },
  { label: '网络', value: '2' },
  { label: '面访', value: '3' },
  { label: '不限', value: '4' }
]

export const warnList = [
  { label: '当天', value: '1' },
  { label: '提前', value: '2' },
  { label: '超期', value: '3' },
]

export const followUpStatusList = [
  { label: '待随访', value: '1' },
  { label: '已随访', value: '2' },
  { label: '已中止', value: '3' },
  { label: '已关闭', value: '4' }
]

export const sexList = [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
  { label: '未知', value: '0' }
]

// 是否超期
export const overdueFlgList = [
  { label: '超期', value: '1' },
  { label: '正常', value: '0' },
]

// 是否可录入
export const isEntryList = [
  { label: '可录入', value: '1' },
  { label: '不可录入', value: '0' },
]

// 是否暂存
export const isTemporaryList = [
  { label: '暂存', value: '1' },
  { label: '非暂存', value: '0' },
]


// 是否有开启中的随访
export const isStartFollowupList = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
]

export const sexMap = {
  '1': '男',
  '2': '女',
  '9': '未说明',
  '0': '未知'
}

export const suspendReasons = [
  { label: '无法联络当事人', value: '01' },
  { label: '本次拒绝随访', value: '02' },
  { label: '其他', value: '09' },
]

export const planReasonList = [
  { label: '死亡', value: '03' },
  { label: '迁出', value: '04' },
  { label: '失访', value: '05' },
  { label: '拒绝', value: '06' },
  { label: '其他', value: '09' }
]

export const planTypeList = [
  { label: '治疗随访', value: '1' },
  { label: '管理随访', value: '2' },
  { label: '关怀随访', value: '3' }
]

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

export const researchStatusList = [
  {
    label: '进行中',
    value: '1'
  },
  {
    label: '未开始',
    value: '2'
  },
  {
    label: '已结束',
    value: '3'
  },
  {
    label: '已关闭',
    value: '4'
  }
]

export const timeTypeList = [ 
  {
    label: '开启时间后的',
    value: 'afterStartTime'
  },
  {
    label: '上一次时间后',
    value: 'afterLastTime'
  },
  {
    label: '自选日期',
    value: 'customTime'
  }
]

export const monthList = [ 
  {
    label: "当月",
    code: "currentMonth",
  },
  {
    label: "隔月",
    code: "nextMonth",
  }
]
