/*
 * @Author: Nic
 * @Date: 2023-03-31 09:38:48
 * @LastEditTime: 2023-04-12 16:47:54
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/api/modules/BasicArchives/index.js
 */
import http from '../../index'

//   查询患者提交信息
// /ygt-richdiseases/tbMbMobilePat/getPatSubmitMes 
// 入参
// patId : 患者id
// type : 0 - 基本信息，1 - 个人情况，2 - 个人史，3 - 生活方式，4 - 就医记录
// syncStatus : 就医记录同步状态 : unFinish - 待处理，finish - 已同步
// 回参
// patBaseMes : {//基本信息
//     patId : 患者id
//     patName : 姓名
// 		idType : 证件类型
//     idNo : 证件号码
//     sex : 性别: 0:未知 1:男 2:女 9: 未说明
//     birthday : 出生日期
//     submitDate : 提交时间
//     syncDate : 同步时间
//     syncBtnFlg : 同步按钮是否显示 : true - 显示，false - 否
// }
// patInfo : {//个人情况
//     patId : 患者id
//     bloodType : 血型
//     maritalStatus : 婚姻状况
//     patType : 常住类型
//     address : []所在地区
//     street : 详细地址(街道)
//     eduLevel : 文化程度
//     careerCode : 职业类型(职业代码)
//     workUnits : 工作单位
//     payType : 医疗费用支付方式(支付方式)
//     submitDate : 提交时间
//     syncDate : 同步时间
//     syncBtnFlg : 同步按钮是否显示 : true - 显示，false - 否
// }
// patFamilyDisease : {//个人史
//     patId : 患者id
//     familyDiseasesDesc : 家族史拼接
//     drugAllergyDesc : 药物过敏史拼接
//     exposureHistoryDesc : 暴露史拼接
//     submitDate : 提交时间
//     syncDate : 同步时间
//     syncBtnFlg : 同步按钮是否显示 : true - 显示，false - 否
// }
// patLife : {//生活方式
//     patId : 患者id
//     smokeDesc : 吸烟拼接
//     sportDesc : 每周运动拼接
//     drinkDesc : 饮酒拼接
//     submitDate : 提交时间
//     syncDate : 同步时间
//     syncBtnFlg : 同步按钮是否显示 : true - 显示，false - 否
// }
// patPastHistorys : [{//就医记录
//     id : 就医记录id
// 		patId : 患者id
// 		medName : 疾病名称
// 		medDesc : 疾病描述
// 		admType : 就诊类型 : I- 住院，O - 门诊
// 		confirmTime : 确诊时间 yyyy - MM - dd
// 		fileQty : 资料数量
// 		confirmFlg : 是否确认 : 0 - 是，1 - 否，2 - 暂存
// 		quickUpload : 是否为快捷上传 : true - 是，false - 否
// 		submitDate : 提交时间
// 		syncDate : 同步时间
// 		syncBtnFlg : 同步按钮是否显示 : true - 显示，false - 否
// 	}]
export const getPatSubmitMes = (data) =>
    http.post({
        url: `/ygt-richdiseases/tbMbMobilePat/getPatSubmitMes`,
        data,
    })


// 比对同步信息
// patId:患者id
// type:0-基本信息，1-个人情况，2-个人史，3-生活方式
export const onCompareSyncData = (params) =>
    http.get({
        url: `/ygt-richdiseases/syncPatData/onCompareSyncData`,
        params,
    })


// 提交同步信息
// /ygt-richdiseases/syncPatData/onSyncPatData post
// 入参
// patId:患者id
// type:提交模块:0-基本信息，1-个人情况，2-个人史，3-生活方式，4-就医记录
// syncFields:同步字段(比对同步信息接口返回的比对字段参数)
// originalId:就医记录id(同步就医记录时使用)
// syncFlg:提交状态:0-同步，2-暂存
// patSyncPastHistorys:[{//就医记录(同步就医记录时使用)
// 	recordType:记录类型:0-门诊，1-住院，2-手术
// 	patId:患者id
// 	icdId:疾病编码
// 	medName:疾病名称
// 	medDesc:疾病描述
// 	confirmTime:确诊时间 yyyy-MM-dd
// 	fileIds:[] 关联资料ID
// }]
export const onSyncPatData = (data) =>
    http.post({
        url: `/ygt-richdiseases/syncPatData/onSyncPatData`,
        data,
    })

// 根据id获取就医记录(医生同步时使用)
// /ygt-richdiseases/tbMbMobilePastHistory/getPatPastHistoryByIdForPC get
// id :就医记录id
// fileBaseUrl :文件浏览地址
// 回参
// id :
// recordType :记录类型 :0 - 门诊，1 - 住院，2 - 手术
// patId :患者id
// medName :疾病名称
// medDesc :疾病描述
// admType :就诊类型 :I - 住院，O - 门诊
// confirmTime :确诊时间 yyyy - MM - dd
// files :[{
//     文件详细信息
//     fileNo :文件编号 :用于医生分辨图片(2022- 03 - 31 - 1)
//     mobilePhFileId :就医记录资料存储表id(提交时的fileIds)
//     fileUrl :文件浏览链接
//     thumbnailFileUrl :缩略图浏览链接
//     }]
// confirmFlg: 是否确认 :0 - 是，1 - 否
// confirmDate: 确认时间
// createDate: 创建时间
// quickUpload: 是否为快捷上传: true - 是，false - 否
export const getPatPastHistoryByIdForPC = (params) =>
    http.get({
        url: `/ygt-richdiseases/tbMbMobilePastHistory/getPatPastHistoryByIdForPC`,
        params,
    })

// 获取文件识别结果
// /ygt-user/tbFileOrcTextResult/getFileOcrResult
// ?filePathId=
export const getFileOcrResult = (params) =>
    http.get({
        url: `/ygt-user/tbFileOrcTextResult/getFileOcrResult`,
        params,
    })