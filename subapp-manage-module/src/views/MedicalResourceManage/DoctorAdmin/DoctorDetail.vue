<template>
  <div class="doctor-detail">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0" overflow>
      <template #title>{{ modeMap[mode] }}</template>
      <template #tab>
        <el-tabs v-model="activeComponent" :before-leave="handleBeforeLeave">
          <el-tab-pane
            v-for="item in tabDatas"
            :key="item.label"
            :name="item.component"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component
          :is="activeComponent"
          :doctorDetail="doctorDetail"
          :mode="mode"
          v-if="doctorDetailInfoIsReady"
          @saveBasicInfoSuccess="handleSaveBasicInfoSuccess"
          @bindUserId="bindUserId"
          :acceptImage="acceptImage"
        />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import BasicInfo from './BasicInfo.vue'
import LicenceInfo from './LicenceInfo.vue'
import AccountInfo from './AccountInfo.vue'
import { getDoctorDetailById } from '@/api/modules/systemAdmin'

export default {
  data() {
    return {
      modeMap: {
        add: '添加医务人员',
        check: '医生详情',
        edit: '医生编辑',
      },
      activeComponent: '',
      tabDatas: [
        {
          label: '基本信息',
          component: 'BasicInfo',
        },
        {
          label: '资质信息',
          component: 'LicenceInfo',
        },
        {
          label: '账号管理',
          component: 'AccountInfo',
        },
      ],
      doctorDetail: {
        mainImageId: '',
        mainImageUrl: '',
        eSignatureImageId: '',
        eSignatureImageUrl: '',
        status: true,
      },
      doctorDetailInfoIsReady: false,
      mode: 'add',
      acceptImage: ['image/jpeg', 'image/png'],
    }
  },
  created() {
    const id = this.$route.query.id
    this.mode = this.$route.query.mode
    this.activeComponent = this.tabDatas[0].component
    if (this.mode === 'add') {
      this.doctorDetailInfoIsReady = true
    } else {
      this.getDoctorDetailById(id)
    }
  },
  methods: {
    async getDoctorDetailById(userId) {
      try {
        const res = await getDoctorDetailById({ userId, fileBaseUrl: window.g.VUE_APP_FILE_API })
        console.log('getDoctorDetailById==', res)
        this.doctorDetail = {
          ...res.result,
          status: res.result.status === '1',
        }
        this.doctorDetailInfoIsReady = true
      } catch (err) {
        console.error(err)
      }
    },
    handleSaveBasicInfoSuccess(userId) {
      console.log('userId==', userId)
      this.mode = 'edit'
      this.getDoctorDetailById(userId)
    },
    bindUserId(userId) {
      console.log('userId==', userId)
      this.mode = 'edit'
    },
    handleBeforeLeave() {
      if (!this.doctorDetail.userId) {
        this.$message.warning('请先保存基本信息')
        return false
      }
    },
  },
  components: {
    ProLayout,
    BasicInfo,
    LicenceInfo,
    AccountInfo,
  },
}
</script>

<style lang="scss" scoped>
.doctor-detail {
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 !important;
  }
  .el-tabs__nav,
  .el-tabs__nav-scroll {
    background-color: #fff !important;
  }
  .el-tabs__item.is-top.is-active {
    border-bottom: none !important;
  }
  .el-tabs__item.is-active {
    color: #134796 !important;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #949da3 !important;
  }
  .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: #134796 !important;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    border-radius: 4px !important;
  }
  .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
  }
}
</style>

<style>
.el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #606266;
  border-color: #606266;
}
.el-radio__input.is-disabled.is-checked + span.el-radio__label {
  color: #606266;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #606266;
  border-color: #606266;
}
.el-checkbox__input.is-disabled.is-checked + span.el-checkbox__label {
  color: #606266;
}
.el-input.is-disabled .el-input__inner {
  color: #606266;
}
.el-textarea.is-disabled .el-textarea__inner {
  color: #606266;
}
.el-tag.el-tag--info {
  color: #606266;
}
</style>
