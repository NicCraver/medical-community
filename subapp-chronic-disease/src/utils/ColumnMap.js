let APP_HOSPITAL = window.g.VUE_APP_HOSPITAL
console.log('APP_HOSPITAL', APP_HOSPITAL)

console.log(`window.g`, window.g)
// 待审核
export function IncludedInTheManagement(val) {
  let ColumnLists = []
  switch (val) {
    // 待审核
    case 1:
      if (APP_HOSPITAL === '齐齐哈尔') {
        // 齐齐哈尔
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: true },
          { label: '门诊/住院号', prop: 'caseNo', ispass: false },
          { label: '姓名', prop: 'name', ispass: true },
          { label: '性别', prop: 'sexDesc', ispass: true },
          { label: '年龄', prop: 'age', ispass: true },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: true },
          { label: '诊断', prop: 'diagnosesStr', ispass: false },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: true },
          { label: '申请时间', prop: 'applyDate', ispass: true },
          { label: '操作', prop: 'operation', ispass: true },
        ]
      }
      if (APP_HOSPITAL === '环湖') {
        // 环湖
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: false },
          { label: '门诊/住院号', prop: 'caseNo', ispass: true },
          { label: '姓名', prop: 'name', ispass: false },
          { label: '性别', prop: 'sexDesc', ispass: false },
          { label: '年龄', prop: 'age', ispass: false },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: false },
          { label: '诊断', prop: 'diagnosesStr', ispass: true },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: false },
          { label: '申请时间', prop: 'applyDate', ispass: true },
          { label: '操作', prop: 'operation', ispass: true },
        ]
      }
      break

    // 成功列表
    case 2:
      if (APP_HOSPITAL === '齐齐哈尔') {
        // 齐齐哈尔
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: true },
          { label: '门诊/住院号', prop: 'caseNo', ispass: false },
          { label: '姓名', prop: 'name', ispass: true },
          { label: '性别', prop: 'sexDesc', ispass: true },
          { label: '年龄', prop: 'age', ispass: true },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: true },
          { label: '诊断', prop: 'diagnosesStr', ispass: false },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: true },
          { label: '申请时间', prop: 'applyDate', ispass: true },
          { label: '操作人', prop: 'modUserName', ispass: true },
          { label: '操作时间', prop: 'modDate', ispass: true },
        ]
      }
      if (APP_HOSPITAL === '环湖') {
        // 环湖
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: false },
          { label: '门诊/住院号', prop: 'caseNo', ispass: true },
          { label: '姓名', prop: 'name', ispass: false },
          { label: '性别', prop: 'sexDesc', ispass: false },
          { label: '年龄', prop: 'age', ispass: false },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: false },
          { label: '诊断', prop: 'diagnosesStr', ispass: true },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: false },
          { label: '申请时间', prop: 'applyDate', ispass: true },
          { label: '操作人', prop: 'modUserName', ispass: true },
          { label: '操作时间', prop: 'modDate', ispass: true },
        ]
      }
      break
    // 失败列表
    case 3:
      if (APP_HOSPITAL === '齐齐哈尔') {
        // 齐齐哈尔
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: true },
          { label: '门诊/住院号', prop: 'caseNo', ispass: false },
          { label: '姓名', prop: 'name', ispass: true },
          { label: '性别', prop: 'sexDesc', ispass: true },
          { label: '年龄', prop: 'age', ispass: true },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: true },
          { label: '诊断', prop: 'diagnosesStr', ispass: false },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '是否有异常点', prop: 'idNoOutlierTot', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: true },
          { label: '申请时间', prop: 'applyDate', ispass: false },
          { label: '操作人', prop: 'modUserName', ispass: true },
          { label: '操作时间', prop: 'modDate', ispass: true },
          { label: '操作', prop: 'operation', ispass: true },
        ]
      }
      if (APP_HOSPITAL === '环湖') {
        // 环湖
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: false },
          { label: '门诊/住院号', prop: 'caseNo', ispass: true },
          { label: '姓名', prop: 'name', ispass: false },
          { label: '性别', prop: 'sexDesc', ispass: false },
          { label: '年龄', prop: 'age', ispass: false },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: false },
          { label: '诊断', prop: 'diagnosesStr', ispass: true },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '是否有异常点', prop: 'idNoOutlierTot', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: false },
          { label: '申请时间', prop: 'applyDate', ispass: false },
          { label: '操作人', prop: 'modUserName', ispass: true },
          { label: '操作时间', prop: 'modDate', ispass: true },
          { label: '操作', prop: 'operation', ispass: true },
        ]
      }
      break
    // 暂不管理列表
    case 4:
      if (APP_HOSPITAL === '齐齐哈尔') {
        // 齐齐哈尔
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: true },
          { label: '门诊/住院号', prop: 'caseNo', ispass: false },
          { label: '姓名', prop: 'name', ispass: true },
          { label: '性别', prop: 'sexDesc', ispass: true },
          { label: '年龄', prop: 'age', ispass: true },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: true },
          { label: '诊断', prop: 'diagnosesStr', ispass: false },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: true },
          { label: '申请时间', prop: 'applyDate', ispass: true },
          { label: '操作人', prop: 'modUserName', ispass: true },
          { label: '操作时间', prop: 'modDate', ispass: true },
          { label: '暂不管理原因', prop: 'reason', ispass: true },
          { label: '操作', prop: 'operation', ispass: true },
        ]
      }
      if (APP_HOSPITAL === '环湖') {
        // 环湖
        ColumnLists = [
          { label: '序号', prop: 'index', ispass: true },
          { label: '申请类型', prop: 'applyTypeDesc', ispass: true },
          { label: '来源', prop: 'dataSource', ispass: false },
          { label: '门诊/住院号', prop: 'caseNo', ispass: true },
          { label: '姓名', prop: 'name', ispass: false },
          { label: '性别', prop: 'sexDesc', ispass: false },
          { label: '年龄', prop: 'age', ispass: false },
          { label: '手机号', prop: 'phoneNo', ispass: true },
          { label: '身份证号', prop: 'idNo', ispass: false },
          { label: '诊断', prop: 'diagnosesStr', ispass: true },
          { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
          { label: '申请人', prop: 'applyDrName', ispass: true },
          { label: '申请科室', prop: 'applyDeptDesc', ispass: false },
          { label: '申请时间', prop: 'applyDate', ispass: false },
          { label: '操作人', prop: 'modUserName', ispass: true },
          { label: '操作时间', prop: 'modDate', ispass: true },
          { label: '暂不管理原因', prop: 'reason', ispass: true },
          { label: '操作', prop: 'operation', ispass: true },
        ]
      }
      break
    default:
      break
  }
  return ColumnLists
}

// 成功列表
export function ChronicDiseaseCenter() {
  let ColumnLists = []
  if (APP_HOSPITAL === '齐齐哈尔') {
    // 齐齐哈尔
    ColumnLists = [
      { label: '序号', prop: 'index', ispass: true },     
      { label: '来源', prop: 'dataSource', ispass: true },
      { label: '档案编号', prop: 'patCode', ispass: true },
      { label: '门诊/住院号', prop: 'caseNo', ispass: false },
      { label: '姓名', prop: 'name', ispass: true },
      { label: '性别', prop: 'sexDesc', ispass: true },
      { label: '年龄', prop: 'age', ispass: true },
      { label: '手机号', prop: 'phoneNo', ispass: true },
      { label: '身份证号', prop: 'idNo', ispass: true },
      { label: '状态', prop: 'recordStatus', ispass: true },
      { label: '诊断', prop: 'diagnosesStr', ispass: true },
      { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
      { label: '责任医生', prop: 'doctorUserName', ispass: false },
      { label: '建档人', prop: 'archiveUserName', ispass: true },       
      { label: '建档时间', prop: 'archiveDate', ispass: true },
      //{ label: '是否参与注册活动', prop: 'joinRegActivityFlg', ispass: true },
      { label: '最后修改人', prop: 'modUserName', ispass: true },
      { label: '最后修改时间', prop: 'modDate', ispass: true },
      { label: '操作', prop: 'operation', ispass: true },
    ]
  }
  if (APP_HOSPITAL === '环湖') {
    // 环湖
    ColumnLists = [
      { label: '序号', prop: 'index', ispass: true },
      { label: '来源', prop: 'dataSource', ispass: true },
      { label: '档案编号', prop: 'patCode', ispass: true },
      { label: '门诊/住院号', prop: 'caseNo', ispass: true },
      { label: '姓名', prop: 'name', ispass: false },
      { label: '性别', prop: 'sexDesc', ispass: false },
      { label: '年龄', prop: 'age', ispass: false },
      { label: '手机号', prop: 'phoneNo', ispass: true },
      { label: '身份证号', prop: 'idNo', ispass: false },
      { label: '状态', prop: 'recordStatus', ispass: true },
      { label: '诊断', prop: 'diagnosesStr', ispass: true },
      { label: '慢病种类', prop: 'richDiseaseName', ispass: true },
      { label: '责任医生', prop: 'doctorUserName', ispass: false },
      { label: '建档人', prop: 'archiveUserName', ispass: true },     
      { label: '建档时间', prop: 'archiveDate', ispass: true },
      //{ label: '是否参与注册活动', prop: 'joinRegActivityFlg', ispass: true },
      { label: '最后修改人', prop: 'modUserName', ispass: true },
      { label: '最后修改时间', prop: 'modDate', ispass: true },
      { label: '操作', prop: 'operation', ispass: true },
    ]
  }
  return ColumnLists
}
