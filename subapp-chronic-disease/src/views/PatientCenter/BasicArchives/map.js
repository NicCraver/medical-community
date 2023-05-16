/*
 * @Author: Nic
 * @Date: 2023-03-31 16:35:06
 * @LastEditTime: 2023-03-31 17:07:48
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/PatientCenter/BasicArchives/map.js
 */
export const patBaseMap = {
    patName: '姓名',
    idNo: '身份证号',
    sexDesc: '性别',
    birthday: '出生日期',
    phoneNo: '手机号',
}

export const patFamilyDiseaseMap = {
    drugAllergyDesc: '过敏史',
    exposureHistoryDesc: '暴露史',
    familyDiseasesDesc: '家族病史',
}

export const patLifeMap = {
    drinkDesc: '是否饮酒',
    smokeDesc: '是否吸烟',
    sportDesc: '每周运动情况',
}

export const patInfoMap = {
    bloodType: '血型',
    maritalStatus: '婚姻状况',
    patType: '常住类型',
    addressText: '所在地区',
    street: '详细地址',
    eduLevel: '文化程度',
    careerCode: '职业类型',
    workUnits: '工作单位',
    payType: '医疗费用支付方式',
}

export const patPastHistorysMap = {
    //   id : 就医记录id
    // patId : 患者id
    medName: '疾病名称',
    medDesc: '疾病描述',
    confirmTime: '确诊时间',
    fileQty: '资料数量',
    // 		admType : 就诊类型 : I- 住院，O - 门诊
    // 		confirmFlg : 是否确认 : 0 - 是，1 - 否，2 - 暂存
    // 		quickUpload : 是否为快捷上传 : true - 是，false - 否
}

// patInfo
// patLife
// patPastHistorys