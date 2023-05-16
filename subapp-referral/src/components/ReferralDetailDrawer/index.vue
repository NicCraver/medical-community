<template>
  <ProDrawer
    :visible="visible"
    :wrapperClosable="false"
    title="查看"
    :size="700"
    @close="handleClose"
    show-close
    class="drawer"
  >
    <div class="patient-info">
      <div class="basic-info">
        <div class="avatar">
          <img src="@/assets/women.png" alt="" v-if="referralDetail.sexDesc === '女'">
          <img src="@/assets/man.png" alt="" v-else>
        </div>
        <div class="info">
          <div class="title">
            <span class="name after-line">{{ referralDetail.name }}</span>
            <span class="sex after-line">{{ referralDetail.sexDesc }}</span>
            <span class="age">{{ referralDetail.refAge }}岁</span>
          </div>
          <div class="desc">
            <span>
              门诊/住院号：{{ referralDetail.caseNo }}<span class="after-line small"></span>身份证号：{{ referralDetail.idNo }}<span class="after-line small"></span>医保类型：{{ referralDetail.medicareTypeName }}<span class="after-line small"></span>联系地址：{{ referralDetail.addressName }}
            </span>
          </div>
        </div>
      </div>
      <div
        :class="['status-tag', currentReferralStatus.className]"
      >{{ currentReferralStatus.statusText }}</div>
      <div class="actions" v-if="currentReferralStatus.statusText === '待审核' && showReviewAction">
        <el-button type="primary" @click="$emit('reviewPass', referralDetail)">审核通过</el-button>
        <el-button @click="$emit('reviewRefuse', referralDetail)">审核退回</el-button>
      </div>
    </div>
    <div class="tab-container">
      <div class="tab-list">
        <div
          :class="['tab-item', { active: activeTab === 'referral' }]"
          @click="activeTab = 'referral'"
        >转诊信息</div>
        <div
          :class="['tab-item', { active: activeTab === 'illlness' }]"
          @click="activeTab = 'illlness'"
        >病情记录</div>
      </div>
    </div>
    <div class="tab-content-container">
      <div class="tab-content" v-show="activeTab === 'referral'">
        <ReferralForm
          :referralDetail="referralDetail"
          v-if="referralDetail.applyStatus === '5'"
          :admissionsInfo="admissionsInfo"
        ></ReferralForm>
        <el-collapse v-model="referralCollapse">
          <el-collapse-item title="接诊信息：" name="admisssionForm" v-if="showAdmissionsForm">
            <AdmisssionForm :referralId="referralId" @getAdmissionsInfoSuccess="handleSuccess"></AdmisssionForm>
          </el-collapse-item>
          <el-collapse-item title="审核信息：" name="reviewForm" v-if="showReviewForm">
            <ReviewForm :referralId="referralId"></ReviewForm>
          </el-collapse-item>
          <el-collapse-item title="申请信息：" name="applyForm">
            <ApplyForm :applyDetail="referralDetail"></ApplyForm>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="tab-content"  v-show="activeTab === 'illlness'">
        <IllnessForm :illnessInfo="illnessInfo"></IllnessForm>
      </div>
    </div>
  </ProDrawer>
</template>

<script>
import { ProDrawer } from 'anx-vue';
import ApplyForm from './ApplyForm';
import ReviewForm from './ReviewForm';
import AdmisssionForm from './AdmisssionForm';
import ReferralForm from './ReferralForm';
import IllnessForm from './IllnessForm';
import { getReferralInfoById, getIllnessState } from '@/api/modules/patientCenter'

export default {
  props: {
    referralId: String,
    visible: Boolean,
    showReviewAction: Boolean
  },
  data() {
    return {
      // applyStatus 当前状态
      // 已退回 "0";
      // 待提交 "1";
      // 待审核 "2";
      // 待接诊 "3";
      // 已接诊 "4";
      // 已完成 "5";
      // 已关闭 "6";
      statusTagMap: {
        '0': {
          className:'review-refused',
          statusText: '审核退回'
        },
        '1': {
          className:'load-submit',
          statusText: '待提交'
        },
        '2': {
          className:'load-review',
          statusText: '待审核'
        },
        '3': {
          className:'review-passed',
          statusText: '审核通过'
        },
        '4': {
          className:'admissions-completed',
          statusText: '接诊完成'
        },
        '5': {
          className:'referral-completed',
          statusText: '转诊完成'
        },
        '6': {
          className:'has-suspened',
          statusText: '已关闭'
        }
      },
      referralDetail: {},
      activeTab: 'referral',
      referralCollapse: ['applyForm'],
      illnessInfo: {},
      admissionsInfo: {}
    }
  },
  computed: {
    // 转诊当前状态
    currentReferralStatus() {
      // 先注释增加已关闭状态后发现这里写的有问题，但是想不起来为什么这么写了
      // if (this.referralDetail.auditStatus === '2') {
      //   return {
      //     className:'review-refused',
      //     statusText: '审核退回'
      //   }
      // }
      return this.referralDetail.applyStatus ? this.statusTagMap[this.referralDetail.applyStatus] : {}
    },
    // 是否显示接诊信息折叠面板
    showAdmissionsForm() {
      return this.referralDetail.applyStatus === '4' || this.referralDetail.applyStatus === '5';
    },
    // 是否显示审核信息折叠面板
    showReviewForm() {
      return this.showAdmissionsForm || this.referralDetail.applyStatus === '3' || this.referralDetail.status === '5'
    }
  },
  mounted() {
    this.getReferralInfoById();
    this.getIllnessState();
  },
  methods: {
    async getIllnessState() {
      if (!this.referralId) {
        return;
      }
      try {
        const res = await getIllnessState({
          referralId: this.referralId
        });
        console.log('getIllnessState==', res);
        this.illnessInfo = {
          ...res.result,
          initDiagnosis: res.result.diagnose.map(item => ({
            ...item,
            text1: `${item.text1}-${item.text2}`
          })),
          initDiagnosisModel: res.result.diagnose.length ? 'Y' : 'N',
          allergyModel: res.result.allergy ? 'Y' : 'N',
          hisIllDiagnosis: res.result.pastHistory.map(item => ({
            ...item,
            text1: `${item.text1}-${item.text2}`
          })),
          hisIllDiagnosisModel: res.result.pastHistory.length ? 'Y' : 'N',
          examineResult: res.result.check,
          examineResultModel: res.result.check.length ? 'Y' : 'N',
          operateRecords: res.result.operation.map(item => ({
            ...item,
            text1: `${item.text1}-${item.text2}`
          })),
          operateRecordsModel: res.result.operation.length ? 'Y' : 'N',
        }
        console.log('this.illnessInfo', this.illnessInfo)
      } catch(err) {
        console.error(err);
      }
    },
    // 获取转诊申请信息
    async getReferralInfoById() {
      if (!this.referralId) {
        return;
      }
      try {
        const res = await getReferralInfoById({ id: this.referralId });
        console.log('getReferralInfoById==', res);
        this.referralDetail = {
          ...res.result, referralTypeDesc: res.result.referralType === 'A' ? '上转' : '下转'
        };
      } catch (error) {
        console.error('error', error)
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSuccess(admissionsInfo) {
      this.admissionsInfo = admissionsInfo
    }
  },
  watch: {
    visible() {
      this.getReferralInfoById();
      this.getIllnessState();
      this.activeTab = 'referral';
    }
  },
  components: {
    ProDrawer,
    ApplyForm,
    ReviewForm,
    AdmisssionForm,
    ReferralForm,
    IllnessForm
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  ::v-deep.el-drawer__body {
      // overflow: hidden;
      .ProDrawer-main {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }
  .patient-info {
    padding: 10px 15px 10px 15px;
    background-color: #F5F5F5;
    position: relative;
    .basic-info {
      display: flex;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        flex: 1;
        margin-left: 13px;
        .after-line {
          display: inline-block;
          &:after {
            content: ' ';
            display: inline-block;
            width: 1px;
            height: 16px;
            background-color: #919191;
            vertical-align: middle;
            margin: -4px 10px 0 10px;
          }
          &.small {
            &:after {
              height: 12px;
              margin-top: -3px
            }
          }
        }
        .title {
          color: #919191;
          font-size: 18px;
          .name {
            font-weight: bold;
            color: #303133
          }
        }
        .desc {
          font-size: 14px;
          color: #919191
        }
      }
    }
    .actions {
      text-align: right;
    }
    .status-tag {
      position: absolute;
      top: -20px;
      right: 43px;
      width: 60px;
      height: 60px;
      border-style: solid;
      border-width: 1px;
      border-radius: 50%;
      line-height: 60px;
      text-align: center;
      font-size: 13px;
      transform: rotate(-15deg);
      &.load-submit {
        color: #FFA940;
        border-color: #FFA940
      }
      &.load-review {
        color: #FFA940;
        border-color: #FFA940
      }
      &.review-passed {
        color: #4468BD;
        border-color: #4468BD;
      }
      &.review-refused {
        color: #E33D20;
        border-color: #E33D20;
      }
      &.admissions-completed {
        color: #4468BD;
        border-color: #4468BD
      }
      &.referral-completed {
        color: #44AE2E;
        border-color: #44AE2E
      }
      &.has-suspened {
        color: #E33D20;
        border-color: #E33D20
      }
    }
  }
  .tab-container {
    margin: 20px 0;
    text-align: center;
    height: 32px;
    .tab-list {
      display: inline-block;
      background-color: #f7f7f7;
      overflow: hidden;
      border-radius: 32px;
    }
    .tab-item {
      width: 110px;
      line-height: 32px;
      height: 32px;
      color: #919191;
      text-align: center;
      font-size: 12px;
      float: left;
      cursor: pointer;
      &:first-child {
        border-radius: 32px 0 0 32px;
      }
      &:last-child {
        border-radius: 0 32px 32px 0;
      }
      &.active {
        color: #fff;
        background-color: #4468BD;
        border-radius: 32px;
      }
    }
  }
  .tab-content-container {
    padding: 0 10px;
    height: calc(100vh - 282px);
    overflow: auto;
  }
  ::v-deep.el-collapse-item__content {
    padding-bottom: 0
  }
  .el-collapse-item {
    margin-top: 20px;
    ::v-deep.el-collapse-item__content {
      padding-top: 0;
      overflow-x: auto;
    }
  }
}
</style>
