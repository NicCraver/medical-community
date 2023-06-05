import http from '../../index'

let commonUrl = "/ygt-health-archive";

// 门诊-查询患者档案信息
export const OpMedicalRecords = (params) =>
    http.get({
        url: `${commonUrl}/tbOpMedicalRecords/OpMedicalRecords`,
        params,
    });

// 门诊-检查
export const getRisExamRecordByOpVisit = (params) =>
    http.get({
        url: `${commonUrl}/risExamRecord/getRisExamRecordByOpVisit`,
        params,
    });
// 住院-检查
export const getRisExamRecordByIpReg = (params) =>
    http.get({
        url: `${commonUrl}/risExamRecord/getRisExamRecordByIpReg`,
        params,
    });
//住院-病案首页
export const getIpMainMrById = (params) =>
    http.get({
        url: `${commonUrl}/ipMainMrhp/getIpMainMrById`,
        params,
    });

//根据住院记录查询麻醉列表
export const getEsthesiaList = (params) =>
    http.get({
        url: `${commonUrl}/ipEsthesiaReport/getEsthesiaListByInp`,
        params,
    });
//根据住院输血记录列表
export const bloodTransfusionsByInp = (params) =>
    http.get({
        url: `${commonUrl}/bloodTrsfusionsRecord/bloodTransfusionsByInp`,
        params,
    });
//根据住院手术记录列表
export const listSurgeryOpLog = (params) =>
    http.get({
        url: `${commonUrl}/ipMrhpSurgeryOpLog/listSurgeryOpLog`,
        params,
    });
//根据住院的某一次手术记录
export const listSurgeryOpLogItem = (params) =>
    http.get({
        url: `${commonUrl}/ipMrhpSurgeryOpLog/getSurgeryOpLog`,
        params,
    });
//查询体检信息
export const getMedicalExamRecordById = (params) =>
    http.get({
        url: `${commonUrl}/medicalExamRecord/getMedicalExamRecordById`,
        params,
    });
// 卫生服务活动头部方块是否有数据查询
export const getHealthEventTypeCount = (params) =>
    http.get({
        url: `${commonUrl}/personalArchiveMainInfo/getHealthEventTypeCount`,
        params,
    });
//卫生服务活动导航查询
export const getVisitRecords = (params) =>
    http.get({
        url: `${commonUrl}/personalArchiveMainInfo/getVisitRecord`,
        params,
    });
//卫生服务活动导航（用药）查询
// 1.根据患者id查询
export const getRecentAdviceByPaId = (params) =>
    http.get({
        url: `${commonUrl}/tbHeAdviceDetail/getRecentAdviceByPaId`,
        params,
    });
// 2.根据诊断查询
export const queryAdviceGroupByDiag = (params) =>
    http.get({
        url: `${commonUrl}/tbHeAdviceDetail/queryAdviceGroupByDiag`,
        params,
    });
// 3.根据记录查询
export const queryAdviceGroupByTreat = (params) =>
    http.get({
        url: `${commonUrl}/tbHeAdviceDetail/queryAdviceGroupByTreat`,
        params,
    });
// 查询诊断下的医嘱信息
export const queryAdviceLisgByDiag = (params) =>
    http.get({
        url: `${commonUrl}/tbHeAdviceDetail/queryAdviceLisgByDiag`,
        params,
    });
// 查询检验报告
export const queryLisReport = (params) =>
    http.get({
        url: `${commonUrl}/lisReport/queryLisReport`,
        params,
    })
// 查询检查报告
export const listSameRisRecord = (params) =>
    http.get({
        url: `${commonUrl}/risExamRecord/listSameRisRecord`,
        params,
    });
// 查询相同类型的检查
export const queryRisExamRecord = (params) =>
    http.get({
        url: `${commonUrl}/risExamRecord/queryRisExamRecord`,
        params,
    });

// 查询同类型检验报告
export const listSameLisWithDetails = (params) =>
    http.get({
        url: `${commonUrl}/lisReport/listSameLisWithDetails`,
        params,
    });
// 查询转诊记录
export const referralListQuery = (params) =>
    http.get({
        url: `${commonUrl}/referralController/referralListQuery`,
        params,
    });
// 查询转诊详情
export const getReferralListById = (params) =>
    http.get({
        url: `${commonUrl}/referralController/getReferralListById`,
        params,
    });
// 查询病历文书
export const emrFileListByTreat = (params) =>
    http.get({
        url: `${commonUrl}/tbHeEmrFile/emrFileListByTreat`,
        params,
    });
/* 病例文书（黑龙江） */
// 入院记录查询
export const getIpInHosRecord = (params) =>
    http.get({
        url: `${commonUrl}/ipInHosRecord/getIpInHosRecord`,
        params,
    });
// 病程记录查询
export const getIpFirstProgressNotes = (params) =>
    http.get({
        url: `${commonUrl}/ipFirstProgressNotes/getIpFirstProgressNotes`,
        params,
    });
// 抢救记录查询
export const getIpRescueRecord = (params) =>
    http.get({
        url: `${commonUrl}/ipRescueRecord/getIpRescueRecord`,
        params,
    });
// 死亡记录查询
export const getIpDeathRecord = (params) =>
    http.get({
        url: `${commonUrl}/ipDeathRecord/getIpDeathRecord`,
        params,
    });
// 出院小结查询
export const getIpOutHosSummary = (params) =>
    http.get({
        url: `${commonUrl}/ipOutHosSummary/getIpOutHosSummary`,
        params,
    });
// 护理操作记录
export const listIpNursingSigns = (params) =>
    http.get({
        url: `${commonUrl}/ipNursingVistalSigns/listIpNursingSigns`,
        params,
    });