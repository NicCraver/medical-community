<template>
  <ProLayout mainBgColor="#F5F5F5" padding="0">
    <template #title>查看调研记录</template>
    <template #main>
      <div class="container" v-loading="loading">
        <div class="content">
          <PatientInfoCard
            :patientInfo="patientInfo"
            style="margin-bottom: 0"
            @open360View="open360View"
          />
          <el-tabs v-model="activeTabForm">
            <el-tab-pane
              v-for="item in formTabDatas"
              :key="item.label"
              :name="item.name"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
          <div class="form-container">
            <anx-form
              :anxFormData="anxFormData"
              :disabled="isDisabed"
              ref="anxForm"
              :baseUrl="baseUrl"
              :echoData="echoData"
            />
          </div>
        </div>
        <!-- 操作按钮 -->
        <div class="actions">
          <el-button @click="$router.go(-1)" id="baccccck">返回</el-button>
        </div>
      </div>
    </template>
  </ProLayout>
</template>

<script>
import { AnxForm } from 'anx-form';
import { ProLayout } from 'anx-vue';
import { PatientInfoCard } from 'anx-vue';
import { getResearchRecordInfo, getPatientInfo, getInfoParams } from '@/api/modules/PatientCenter';
import { onQueryTemplateById } from '@/api/modules/FormDesign';
import { sexMap, paymentList } from '@/utils/data-map';

export default {
  name: 'ResearchDetail',
  data() {
    return {
      researchId: '',
      patId: '',
      formTemplateId: '',
      followupId: '',
      hisPatientId: '',
      patientInfo: {},
      anxFormData: {},
      echoData: {},
      formTabDatas: [],
      activeTabForm: '',
      isDisabed: true,
      loading: true,
      baseUrl: '',
    };
  },
  async mounted() {
    this.baseUrl = window.g.VUE_APP_BASE_API + '/ygt-followup'
    this.patId = this.$route.query.patId;
    this.researchId = this.$route.query.researchId;

    this.getPatientInfo();
    await this.getInfoParams();
    await this.getFormTemplate();
    await this.getResearchRecordInfo();
    this.loading = false;
  },
  methods: {
    // 获取头部患者卡片信息
    async getPatientInfo() {
      try {
        const res = await getPatientInfo({ patId: this.patId });
        this.patientInfo = {
          ...res.result,
          sex: sexMap[res.result.sex],
          payment: paymentList.find((item) => item.value === res.result.payType)
            ? paymentList.find((item) => item.value === res.result.payType).label
            : '',
          addressDetail: res.result.addressText + res.result.street,
        };
        console.log('this.patientInfo===', this.patientInfo);
      } catch (err) {
        console.log(err);
      }
    },

    // 获取页面所需元素
    async getInfoParams() {
      try {
        const res = await getInfoParams({
          researchId: this.researchId,
          patId: this.patId
        });
        console.log('getInfoParams===', res);
        this.formTemplateId = res.result.templateId;
        this.resEntryId = res.result.resEntryId;
        this.hisPatientId = res.result.hisPatientId;
        this.formTabDatas = [{ label: res.result.researchName, name: res.result.researchName }];
        this.activeTabForm = res.result.researchName;
      } catch(err) {
        console.error(err);
      }
    },

    // 获取表单模板
    async getFormTemplate() {
      try {
        const res = await onQueryTemplateById({ id: this.formTemplateId });
        this.anxFormData = JSON.parse(res.result.templateData);
        console.log('getFormTemplate==', res)
      } catch (err) {
        console.error(err);
      }
    },

    // 获取表单回显数据
    async getResearchRecordInfo() {
      try {
        const res = await getResearchRecordInfo({ resEntryId: this.resEntryId });
        console.log('getResearchRecordInfo======', res);
        this.entryId = res.result.entryId;
        this.echoData = JSON.parse(res.result.templateData);
      } catch (err) {
        console.error(err);
      }
    },

    // 打开360视图
    open360View() {
      window.open(`http://10.10.254.234:8080/share/timeline?patientsn=${this.hisPatientId}`);
    },
  },
  watch: {
    $route(newRoute) {
      if (newRoute.name === 'FollowUpDetail') {
        this.initPage();
      }
    },
  },
  components: {
    ProLayout,
    PatientInfoCard,
    AnxForm
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  .followup-list {
    width: 220px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 12px 0px 12px 8px;
    margin-right: 15px;
    overflow: hidden;
    height: 100%;
    .followup-item {
      position: relative;
      padding-left: 22px;
      padding-bottom: 20px;
      cursor: pointer;
      &:hover {
        background: #f7f7f7;
      }
      &.active {
        color: #4468bd;
        font-weight: bold;
      }
      &:before {
        content: ' ';
        position: absolute;
        display: inline-block;
        width: 2px;
        top: 12px;
        left: 5px;
        bottom: -6px;
        background: #e8e8e8;
      }
      &:last-child {
        &:before {
          display: none;
        }
      }
      .time-icon {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 6px;
        box-sizing: border-box;
        background: #fff;
        &.load-followup {
          border: 2px solid #4468bd;
        }
        &.has-followuped-normal {
          background: #4468bd;
        }
        &.has-followuped-timeout {
          background: #f3666c;
        }
        &.load-followup-timeout {
          border: 2px solid #f3666c;
        }
        &.temp-save {
          border: 1px solid #4468bd;
          &:before {
            display: inline-block;
            content: ' ';
            position: absolute;
            top: -1px;
            width: 7px;
            height: 12px;
            border-radius: 7px 0 0 7px;
            transform: translate(-1px, 0);
            background: #4468bd;
          }
        }
        &.suspened {
          background: #919191;
        }
        &.closed {
          background: #919191;
        }
      }
      .el-icon-question {
        color: #4468bd;
        margin-left: 2px;
      }
      .extra-time {
        font-size: 12px;
      }
    }
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .form-container {
      flex: 1;
      background-color: #fff;
      margin-bottom: 45px;
      overflow: auto;
      .assessment {
        position: absolute;
        right: 10px;
        top: 280px;
        width: 100px;
        height: 36px;
        line-height: 36px;
        border-radius: 20px 0px 0px 20px;
        background-color: rgba(159, 157, 157, 100);
        color: #fff;
        font-size: 14px;
        text-align: center;
        z-index: 2;
      }
    }
    .form-container::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    .form-container::-webkit-scrollbar-thumb {
      background-color: #dedde3;
      border-radius: 8px;
    }
  }
  .actions {
    position: fixed;
    left: 208px;
    bottom: 0;
    right: 0;
    height: 46px;
    line-height: 46px;
    background-color: #fff;
    box-shadow: 0px -1px 3px 0px rgba(204, 204, 204, 80);
    text-align: right;
    padding-right: 25px;
    z-index: 1000;
  }
}
</style>

<style scoped>
::v-deep .el-timeline-item__node {
  background-color: #fff;
  border: 2px solid #446abd;
}
::v-deep.el-timeline-item__node--primary {
  background-color: #446bbd !important;
}
::v-deep .el-tabs__header {
  padding-left: 8px;
  background-color: #fff;
}

::v-deep.el-timeline-item.supply-active .el-timeline-item__node {
  background-color: #fff;
  border: 2px solid red;
}
::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #606266;
  border-color: #606266;
}
::v-deep .el-radio__input.is-disabled.is-checked + span.el-radio__label {
  color: #606266;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #606266;
  border-color: #606266;
}
::v-deep .el-checkbox__input.is-disabled.is-checked + span.el-checkbox__label {
  color: #606266;
}
::v-deep .el-input.is-disabled .el-input__inner {
  color: #606266;
}
::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}
::v-deep .el-tag.el-tag--info {
  color: #606266;
}
</style>

<style>
.el-scrollbar__thumb {
  background-color: #aaa !important;
}
</style>
