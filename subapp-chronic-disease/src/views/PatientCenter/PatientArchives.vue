<template>
  <div class="PatientArchives">
    <ProLayout model="tab" mainBgColor="#F5F5F5" margin="0">
      <template #title>
        <div class="pa-header-layer" :style="{ height: paHeaderHeight }">
          <div class="pa-header" ref="paHeader">
            <div class="pa-header-portrait" :class="!cardState ? 'pa-header-portrait2' : ''">
              <img src="@/assets/women.png" v-if="patientInfo.sex === '女'" />
              <img src="@/assets/man.png" v-else />
            </div>
            <div class="pa-header-info" :class="!cardState ? 'pa-header-info-flex' : ''">
              <div class="pa-header-name">
                <span> {{ patientInfo.name }}</span>
                <span>{{ patientInfo.sex }}</span>
                <span>{{ patientInfo.age }}</span>
              </div>
              <div class="pa-header-birthday" v-if="cardState">
                <span>{{ patientInfo.birthday }} /</span>
                <span>{{ patientInfo.phoneNo }}</span>
                <span>{{ patientInfo.addressDetail }}</span>
              </div>
              <div class="pa-header-tags">
                <!-- <div v-for="v in tags" :key="v.name" class="pa-header-tag pa-header-tag2">
                  {{ v.name }}
                </div> -->
                <div v-for="v in patientInfo.patientRichDiseaseList" :key="v.richDiseaseCode" class="pa-header-tag">
                  {{ v.richDiseaseName }}
                </div>
                <div class="pa-header-tag" style="cursor: pointer" @click="getPatientInfo(true)">
                  <i class="el-icon-plus"></i>
                </div>
              </div>
            </div>
            <div class="pa-header-btn" @click="onCardUnfoldedAndFolded()">
              <i class="el-icon-arrow-up" v-show="cardState"></i>
              <i class="el-icon-arrow-down" v-show="!cardState"></i>
            </div>
          </div>
        </div>
      </template>
      <template #tab>
        <el-tabs v-model="activeComponent" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabDatas"
            :key="item.label"
            :name="item.component"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <div style="background-color: #fff; height: 100%">
          <router-view ref="routerView" />
        </div>
      </template>
    </ProLayout>
    <el-drawer title="更新慢病标签" :visible.sync="drawer" direction="rtl" :size="380">
      <ChronicTag
        :hasedTagList="hasedTagList"
        @saveDiseaseTagSuccess="getPatientInfo"
        :patientInfo="patientInfo"
        @cancelDrawer="drawer = false"
      />
    </el-drawer>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import ChronicTag from './ChronicTag.vue'
import { getPatientInfo } from '@/api/modules/PatientCenter'
import { getKeyByValue, sexMap, paymentList } from './data-map'

export default {
  components: { ChronicTag, ProLayout },
  // 提供依赖注入者
  provide() {
    return {
      getPatientInfo: this.getPatientInfo,
    }
  },
  data() {
    return {
      drawer: false,
      paHeaderHeight: '120px',
      cardState: true,
      patientInfo: {},
      hasedTagList: [],
      tags: [
        {
          name: '偶尔吸烟',
          type: 'lifeStyle',
        },
        {
          name: '经常饮酒',
          type: 'lifeStyle',
        },
        {
          name: 'BMI 24.1',
          type: 'lifeStyle',
        },
      ],
      activeComponent: 'BasicArchives',
      tabDatas: [
        {
          label: '基本档案',
          component: 'BasicArchives',
        },
        {
          label: '随访记录',
          component: 'FollowUpRecords',
        },
        // {
        //   label: '纳入记录',
        //   component: 'JoinRecords',
        // },
      ],
    }
  },
  created() {
    // 获取卡片状态 如果缓存没有就设置为true
    this.cardState = window.localStorage.getItem('cardState') === 'false' ? false : true
    this.onPermissionControl()
  },
  mounted() {
    this.patId = this.$route.query.patId
    this.hisPatientId = this.$route.query.hisPatientId
    this.getPatientInfo(false)
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(n, o) {
        if (n !== o) {
          console.log(`n`, n)
          if (n === 'FullInformation' || n === 'PatientSubmission') {
            this.activeComponent = 'BasicArchives'
          } else {
            this.activeComponent = n
          }
        }
      },
    },
  },
  methods: {
    Open360Frame() {
      if (this.patientInfo.applyType !== 'HIS') {
        return
      }
      window.open(`http://10.10.254.234:8080/share/timeline?patientsn=${this.hisPatientId}`)
    },
    getPatientInfo(drawer) {
      getPatientInfo({ patId: this.patId }).then((res) => {
        console.log('res.result---', res.result)
        this.patientInfo = {
          ...res.result,
          sex: getKeyByValue(sexMap, res.result.sex),
          payment: paymentList.find((item) => item.value === res.result.payType)
            ? paymentList.find((item) => item.value === res.result.payType).label
            : '',
          addressDetail: res.result.addressText + res.result.street,
        }
        this.hasedTagList = this.patientInfo.patientRichDiseaseList.map((item) => ({
          label: item.richDiseaseName,
          orgCode: item.orgCode,
          value: item.richDiseaseCode,
        }))
        this.drawer = drawer
        // 调用子组件 获取操作记录
        const routerView = this.$refs.routerView
        if (routerView.getLogList) {
          routerView.getLogList()
        }
        this.$nextTick(() => {
          const paHeader = this.$refs.paHeader
          console.log(`paHeader.offsetHeight`, paHeader.offsetHeight)
          this.paHeaderHeight = paHeader.offsetHeight + 'px'
        })
      })
    },
    // tab切换
    handleClick(e) {
      if (this.$route.name === e.name) {
        return
      }

      this.$router.push({
        name: e.name,
        query: this.$route.query,
      })
    },
    // 权限控制
    onPermissionControl(type) {
      this.tabDatas = this.$isP(2)
        ? [
            {
              label: '基本档案',
              component: 'BasicArchives',
            },
            {
              label: '随访记录',
              component: 'FollowUpRecords',
            },
          ]
        : [
            {
              label: '基本档案',
              component: 'BasicArchives',
            },
            {
              label: '随访记录',
              component: 'FollowUpRecords',
            },
          ]
    },
    // 卡片展开收起
    onCardUnfoldedAndFolded() {
      // ref paHeader 获取高度
      const paHeader = this.$refs.paHeader
      this.paHeaderHeight = paHeader.offsetHeight
      console.log(`paHeaderHeight`, this.paHeaderHeight)
      this.cardState = !this.cardState
      this.$nextTick(() => {
        this.paHeaderHeight = paHeader.offsetHeight + 'px'
      })
      // if (this.cardState) {
      //   this.paHeaderHeight = '120px'
      // } else {
      //   this.paHeaderHeight = '60px'
      // }

      // 缓存卡片状态
      window.localStorage.setItem('cardState', this.cardState)
    },
  },
  // async beforeRouteLeave(to, from, next) {
  //   console.log('to====', to)
  //   console.log('form===', from)
  //   if (window.sessionStorage.getItem('hasChanged') === 'false') {
  //     next()
  //     return
  //   }
  //   let canLealve = false
  //   if (this.$refs.tabComponent.examineFiledIsChanged) {
  //     canLealve = await this.$refs.tabComponent.examineFiledIsChanged()
  //   }
  //   if (canLealve) {
  //     next()
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.PatientArchives {
  .pa-header-layer {
    transition: height 0.3s;
    .pa-header {
      font-size: 14px;
      font-weight: 400;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid rgba(240, 240, 240, 1);
      padding: 7px 10px 15px 10px;
      position: relative;
      .pa-header-portrait {
        min-width: 100px;
        min-height: 100px;
        border-radius: 6px;
        img {
          border-radius: 6px;
          width: 100%;
          height: 100%;
          // background: #919191;
        }
      }
      .pa-header-portrait2 {
        min-width: 40px;
        max-width: 40px;
        min-height: 40px;
        max-height: 40px;
      }
      .pa-header-info {
        margin-left: 15px;
        .pa-header-name {
          color: rgba(51, 51, 51, 1);
          font-size: 20px;
          span {
            margin-right: 6px;
          }
        }
        .pa-header-birthday {
          margin-top: 3px;
          margin-bottom: 10px;
          color: rgba(91, 91, 91, 1);
          font-size: 14px;
          span {
            margin-right: 6px;
          }
        }
        .pa-header-tags {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: -10px;
          // max-width: 500px;
          .pa-header-tag {
            padding: 0 10px;
            margin-bottom: 10px;
            height: 30px;
            line-height: 30px;
            background-color: rgba(238, 243, 253, 1);
            color: rgba(68, 104, 189, 1);
            font-size: 14px;
            text-align: center;
            border-radius: 2px;
            margin-right: 10px;
          }
          .pa-header-tag2 {
            background-color: rgba(231, 253, 250, 1);
            color: rgba(27, 196, 177, 1);
          }
        }
      }
      .pa-header-info-flex {
        display: flex;
        align-items: center;
      }
      .pa-header-btn {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        user-select: none;
      }
    }
  }
  ::v-deep .el-drawer__header {
    border-left: 2px solid #134796;
    padding-top: 0;
    font-weight: bold;
    color: #000;
    font-size: 16px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 0;
  }
  ::v-deep .el-drawer__body {
    padding: 0 12px;
  }
  // ::v-deep .layout-main .model-tab .title {
  //   padding: 10px 10px 1px 10px;
  //   background-color: #fff;
  //   color: #303133;
  //   font-size: 18px;
  //   font-weight: 400;
  // }
}
</style>
