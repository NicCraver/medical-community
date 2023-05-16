<!--
 * @Author: Nic
 * @Date: 2023-01-31 17:34:59
 * @LastEditTime: 2023-03-24 16:16:12
 * @LastEditors: Nic
 * @Description: 模板广场
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/index.vue
-->
<template>
  <div class="TemplateSquare">
    <div v-if="type === 1">
      <header class="TemplateSquare-header" ref="TemplateSquareHeaderRef">
        <div class="title">方案中心</div>
        <div style="color: rgba(145, 145, 145, 1); font-size: 14px; margin-bottom: 10px">
          针对疾病不同分期的管理方案集合。支持复制方案到草稿栏，个人发布的方案需通过审核发布后流入模版广场公开使用。
        </div>
        <div class="form">
          <div style="min-width: 180px; max-width: 350px; width: 100%; margin-right: 22px; margin-top: 10px">
            <el-input placeholder="方案集/子方案名称" suffix-icon="el-icon-search" v-model="queryParams.name" clearable>
            </el-input>
          </div>

          <div style="min-width: 180px; width: 100%; max-width: 350px; margin-right: 22px; margin-top: 10px">
            <el-select
              v-model="queryParams.tagDiseaseDeptIds"
              @change="handleDiseaseChange"
              multiple
              clearable
              placeholder="适配病种"
              style="width: 100%; max-width: 350px"
            >
              <el-option v-for="item in diseasesOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="min-width: 180px; width: 100%; max-width: 350px; margin-right: 22px; margin-top: 10px">
            <el-select
              v-model="queryParams.createUserIds"
              :disabled="activeComponent === 'PlatformTemplate' || activeComponent === 'DraftColumn'"
              multiple
              clearable
              placeholder="创建人"
              style="width: 100%; max-width: 350px"
            >
              <el-option v-for="item in createUserOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="width: 100%; max-width: 400px; margin-right: 22px; margin-top: 10px">
            <el-date-picker
              style="width: 100%"
              v-model="queryParams.dateValue"
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="创建开始时间"
              end-placeholder="创建结束时间"
              range-separator="至"
              clearable
              align="right"
            >
            </el-date-picker>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-right: 22px; align-items: center">
          <div style="color: rgba(16, 16, 16, 1); font-size: 14px">
            <span v-if="isShowCount && !loading">共检索到</span>
            <span v-if="isShowCount && !loading" style="margin-left: 5px; color: #f56c6c; font-weight: bold">{{
              total
            }}</span>
            <span v-if="isShowCount && !loading" style="margin-left: 5px">项</span>
          </div>
          <div style="display: flex; justify-content: flex-end">
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </div>
        </div>

        <el-tabs v-model="activeComponent" :stretch="false" @tab-click="handleClick" :before-leave="beforeLeave">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label">
            <span slot="label">
              {{ item.label }}
              ({{ item.Qty }})
              <el-badge v-if="item.RedDot === 1" is-dot></el-badge>
            </span>
          </el-tab-pane>
        </el-tabs>
      </header>
      <el-scrollbar :style="`height: calc(100vh - ${tsHeaderOffsetHeight}px);`">
        <!-- <div style="height: calc(100vh - 330px)"> -->
        <router-view
          :style="`height: calc(100vh - ${tsHeaderOffsetHeight + 10}px);`"
          v-loading="loading"
          @quoteTemplateSuccess="quoteTemplateSuccess"
          @refreshData="onInquire"
        />
        <!-- </div> -->
      </el-scrollbar>
    </div>
    <div v-else style="background-color: #fff; height: 100%">
      <router-view />
    </div>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import { onQueryJmPlans, getCreateUserOptions, getTagDiseases } from '../../../api/modules/SolutionCenter'

export default {
  components: {
    ProLayout,
  },
  provide: function () {
    return {
      resetInitIndex: this.resetInitIndex,
      templateData: () => this.templateData,
      onInquire: this.onInquire,
    }
  },
  data() {
    return {
      total: 0,
      isQuery: false,
      fn: null,
      initIndex: 0,
      tsHeaderOffsetHeight: 0,
      loading: false,
      type: 1,
      templateData: {},
      activeComponent: 'InnerTemplate',
      queryParams: {
        name: '',
        tagDiseaseDeptIds: [],
        createUserIds: [],
        dateValue: [],
        // 模板类型 :0 - 平台模板，1 - 院内模板，2 - 草稿栏
        planType: 1,
      },
      // 适配病种
      diseasesOptions: [],
      // 创建人
      createUserOptions: [],
      tabDatas: [
        {
          label: '院内模版',
          component: 'InnerTemplate',
          Qty: 0,
          RedDot: 0,
        },
        {
          label: '草稿栏',
          component: 'DraftColumn',
          Qty: 0,
          RedDot: 0,
        },
        {
          label: '平台模版',
          component: 'PlatformTemplate',
          Qty: 0,
          RedDot: 0,
        },
      ],
    }
  },
  watch: {
    '$route.name': {
      immediate: true,
      handler(n, o) {
        console.group('路由跳转信息')
        console.log(`$route.name`, n)
        console.log(`o============`, o)
        console.groupEnd()
        // type类型控制页面显示内容 2为详情页 1为方案中心
        if (
          n === 'AddPlan' ||
          n === 'EditPlan' ||
          n === 'BasicInformation' ||
          n === 'DiseaseStage' ||
          n === 'SchemeConfiguration' ||
          n === 'SchemePreview'
        ) {
          this.type = 2
        } else {
          this.activeComponent = this.$route.name
          this.type = 1
          if (o === 'EditPlan') {
            // this.activeComponent = 'DraftColumn'
            // this.$router.push({
            //   name: this.activeComponent,
            //   query: this.$route.query,
            // })
            this.onInquire()
          }
        }
        // if (this.type === 1 && this.$route.name !== this.activeComponent) {
        //   console.log(`0000000000`, )
        //   this.$router.push({
        //     name: this.activeComponent,
        //     query: this.$route.query,
        //   })
        // }
      },
    },
  },
  computed: {
    // 是否显示检索项数
    isShowCount() {
      // 判断queryParams.tagDiseaseDeptIds,queryParams.createUserIds,queryParams.dateValue,queryParams.tagDiseaseDeptIds 是否为空
      if (this.examineFiledIsChanged() && this.isQuery) {
        return true
      }
    },
  },
  created() {
    this.onInquire()
    this.getCreateUserOptions()
    this.getTagDiseases()
  },
  mounted() {
    this.$nextTick(() => {
      this.fn = this.resizeHandler()
      this.fn()
      window.addEventListener('resize', this.fn)
    })
  },
  methods: {
    async onInquire() {
      console.log(`onInquire`, JSON.parse(JSON.stringify(this.queryParams)))
      console.log(`this.initIndex`, this.initIndex)
      this.queryParams.startDate = this.queryParams.dateValue?.length > 0 ? this.queryParams.dateValue[0] : ''
      this.queryParams.endDate = this.queryParams.dateValue?.length > 0 ? this.queryParams.dateValue[1] : ''
      this.loading = true
      this.isQuery = this.examineFiledIsChanged()
      try {
        const res = await onQueryJmPlans(this.queryParams)
        this.templateData = res.result
        if (this.initIndex === 0) {
          if (res.result.hosQty === 0 && res.result.draftQty === 0) {
            this.queryParams.planType = 0
            this.activeComponent = 'PlatformTemplate'
          }
          if (res.result.draftQty === 0 && res.result.hosQty !== 0) {
            this.queryParams.planType = 0
            this.activeComponent = 'InnerTemplate'
          }
          // 判断是否为当前路由
          if (this.$route.name !== this.activeComponent) {
            this.$router.push({
              name: this.activeComponent,
              query: this.$route.query,
            })
          }
        }
        this.total = res.result.hosQty + res.result.draftQty + res.result.rootQty
        this.initIndex++
        this.tabDatas.forEach((el) => {
          if (el.component === 'InnerTemplate') {
            el.Qty = res.result.hosQty
            el.RedDot = res.result.hosRedDot
          }
          if (el.component === 'DraftColumn') {
            el.Qty = res.result.draftQty
            el.RedDot = res.result.draftRedDot
          }
          if (el.component === 'PlatformTemplate') {
            el.Qty = res.result.rootQty
            el.RedDot = res.result.rootRedDot
          }
        })
        console.log(`this.tabDatas`, this.tabDatas)
        this.loading = false
        // tabDatas
      } catch (error) {
        this.loading = false
        console.log(`error`, error)
      }
    },
    // 获取创建人
    async getCreateUserOptions() {
      try {
        const res = await getCreateUserOptions()
        this.createUserOptions = res.result
        console.log(`res`, res)
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 获取病种
    async getTagDiseases() {
      try {
        const res = await getTagDiseases()
        console.log(`res`, res.result)
        this.diseasesOptions = res.result
        setTimeout(() => {}, 1000)
      } catch (error) {
        console.error(`error`, error)
      }
    },
    async handleClick(e) {
      this.activeComponent = e.name
      this.queryParams.planType = e.name === 'InnerTemplate' ? 1 : e.name === 'DraftColumn' ? 2 : 0
      if (e.name === 'PlatformTemplate' || e.name === 'DraftColumn') {
        this.resizeHandler()
        this.queryParams.createUserIds = []
      }
      this.tabDatas.find((el) => el.component === e.name).RedDot = 0
      if (this.$route.name !== this.activeComponent) {
        this.$router.push({
          name: this.activeComponent,
          query: this.$route.query,
        })
      }
      this.onInquire()
    },
    // 重置initIndex
    resetInitIndex() {
      this.initIndex = 0
    },
    peopleTypeChange() {
      this.queryParams.userId = ''
    },
    dateTypeChange() {
      this.queryParams.dateValue = []
    },
    // 引用成功后跳转到院内模板
    quoteTemplateSuccess() {
      this.queryParams.planType = 1
      this.activeComponent = 'InnerTemplate'
      this.$router.push({
        name: this.activeComponent,
        query: this.$route.query,
      })
    },
    async beforeLeave() {
      // let canLealve = false
      // if (this.$refs.tabComponent.examineFiledIsChanged) {
      //   canLealve = await this.$refs.tabComponent.examineFiledIsChanged()
      // }
      // return canLealve
    },
    resetQueryParams() {
      this.queryParams = {
        name: '',
        tagDiseaseDeptIds: [],
        createUserIds: [],
        dateValue: [],
        // 模板类型 :0 - 平台模板，1 - 院内模板，2 - 草稿栏
        planType: 1,
      }
      this.resetInitIndex()
      this.onInquire()
    },
    resizeHandler() {
      let timer
      return () => {
        if (timer) {
          window.clearTimeout(timer)
        }
        timer = window.setTimeout(() => {
          this.$nextTick(() => {
            if (this.$refs.TemplateSquareHeaderRef) {
              this.tsHeaderOffsetHeight = this.$refs.TemplateSquareHeaderRef.offsetHeight + 60
            }
          })
        }, 100)
      }
    },
    handleDiseaseChange() {
      console.log(`handleDiseaseChange`)
      this.resetInitIndex()
    },
    // 判断参数是否填写
    examineFiledIsChanged() {
      if (
        this.queryParams.tagDiseaseDeptIds.length > 0 ||
        this.queryParams.createUserIds.length > 0 ||
        this.queryParams.dateValue.length > 0 ||
        this.queryParams.name
      ) {
        return true
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fn)
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
.TemplateSquare {
  height: 100%;
  padding: 10px;
  .TemplateSquare-header {
    background-color: #fff;
    padding: 15px 0 0 20px;
    .title {
      color: rgba(16, 16, 16, 1);
      font-size: 20px;
      margin-bottom: 10px;
    }
    .form {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .combination-form {
        border: 1px solid rgba(217, 217, 217, 1);
        display: flex;
        align-items: center;
        border-radius: 3px;

        ::v-deep .el-input__inner {
          border: 0 !important;
          height: 30px;
        }
        .line {
          background: #d9d9d9;
          height: 20px;
          width: 1px;
        }
      }
      .combination-form:hover {
        border-color: #446bbd;
      }
    }
  }
  ::v-deep .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #fff;
    z-index: 1;
  }
  ::v-deep .el-badge__content.is-dot {
    height: 10px;
    width: 10px;
    padding: 0;
    right: 0;
    top: -12px;
    border-radius: 50%;
  }
  ::v-deep .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0;
  }
  ::v-deep .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    border-radius: 1px;
    background-color: #134796;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    // max-width: 58px;
  }
}
</style>
