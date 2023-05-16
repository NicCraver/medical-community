<template>
  <div class="MainView">
    <div>
      <el-row :gutter="12">
        <el-col :span="16">
          <div class="main-left">
            <!-- <ServiceTrendStatistics></ServiceTrendStatistics> -->
            <TabsCharts></TabsCharts>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="main-right">
            <div class="tabs">
              <div class="selected" ref="selectedRef"></div>
              <div
                class="tab-left"
                :class="selected === 1 ? 'selected-color' : ''"
                ref="tableftRef"
                @click="select(1)"
              >
                按病种统计建档人数
              </div>
              <div
                class="tab-right"
                :class="selected === 2 ? 'selected-color' : ''"
                @click="select(2)"
              >
                按科室统计建档人数
              </div>
            </div>
            <div class="tab-content">
              <DiseaseStatistics v-if="selected === 1" />
              <transition name="el-fade-in-linear">
                <DepartmentStatistics v-if="selected === 2" />
              </transition>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <footer class="MainView-footer">
      <el-row :gutter="12">
        <el-col :span="16">
          <div class="footer-left" ref="footerLeftRef" :style="{ height: tableHeight + 'px' }">
            <Tables :tableHeight="tableHeight" />
          </div>
        </el-col>
        <el-col :span="8">
          <div ref="footerRightRef" class="footer-right">
            <Archives />
          </div>
        </el-col>
      </el-row>
    </footer>
  </div>
</template>

<script>
import HeadAction from './HeadAction.vue'
// 服务趋势统计
import ServiceTrendStatistics from './charts/ServiceTrendStatistics.vue'
// 按病种统计建档人数
import DiseaseStatistics from './charts/DiseaseStatistics.vue'
// 按科室统计建档人数
import DepartmentStatistics from './charts/DepartmentStatistics.vue'
// 档案相关
import Archives from './charts/Archives.vue'
import Tables from './Tables/index.vue'
import TabsCharts from './charts/TabsCharts.vue'
export default {
  components: {
    HeadAction,
    ServiceTrendStatistics,
    DiseaseStatistics,
    DepartmentStatistics,
    Archives,
    Tables,
    TabsCharts,
  },
  data() {
    return {
      value: '1',
      selected: 1,
      translateX: 0,
      tableHeight: 0,
    }
  },
  mounted() {
    this.translateX = this.$refs['tableftRef'].clientWidth
    this.$refs['selectedRef'].style.width = this.$refs['tableftRef'].clientWidth + 'px'
    this.tableHeight = this.$refs['footerRightRef'].clientHeight
    console.log('this.tableHeight', this.tableHeight)
    console.log(
      "this.$refs['footerRightRef'].clientHeight",
      this.$refs['footerRightRef'].clientHeight,
    )
    this.$refs['footerLeftRef'].style.height = this.$refs['footerRightRef'].clientHeight
    window.addEventListener('resize', this.fn)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fn)
  },
  methods: {
    fn() {
      console.log(`MainView 监听窗口大小`)
      this.translateX = this.$refs['tableftRef'].clientWidth
      this.$refs['selectedRef'].style.width = this.$refs['tableftRef'].clientWidth + 'px'
      if (this.selected === 1) {
        this.$refs['selectedRef'].style.transform = `translateX(0px)`
      } else {
        this.$refs['selectedRef'].style.transform = `translateX(${this.translateX - 8}px)`
      }
    },
    select(val) {
      if (val === 1) {
        this.$refs['selectedRef'].style.transform = `translateX(0px)`
      } else {
        this.$refs['selectedRef'].style.transform = `translateX(${this.translateX - 8}px)`
      }
      this.selected = val
    },
    handleClick(row) {
      console.log(row)
    },
  },
}
</script>

<style lang="scss" scoped>
.MainView {
  margin-top: 10px;
  .main-left {
    border-radius: 2px;
    background-color: #fff;
    height: 350px;
    padding: 16px;
  }
  .main-right {
    border-radius: 2px;
    background-color: #fff;
    height: 350px;
    padding: 10px 15px;
    box-sizing: border-box;
    .tabs {
      margin-bottom: 20px;
      position: relative;
      // transition: transform 0.3s;
      width: 100%;
      background-color: #f4f4f4;
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 36px;
      padding: 5px 7px;
      border-radius: 60px;
      color: #757575;
      text-align: center;
      font-size: 14px;
      .tab-left {
        cursor: pointer;
        width: 50%;
        z-index: 1;
      }
      .tab-right {
        cursor: pointer;
        width: 50%;
        z-index: 1;
      }
      .selected-color {
        color: #fff;
        transition: all 0.5s;
      }
      .selected {
        height: 26px;
        position: absolute;
        right: 0px;
        left: 0px;
        width: 50%;
        left: 10px;
        background-color: #5d76d9;
        border-radius: 60px;
        transition: all 0.5s;
      }
    }
  }
  .MainView-footer {
    margin-top: 10px;
    background-color: #f5f4f6;
    .footer-left {
      border-radius: 2px;
      background-color: #fff;
      padding: 16px;
      height: calc(100vh - 545px);
    }
    .footer-right {
      padding: 16px;
      background-color: #fff;
      // height: calc(100vh - 545px);
    }
  }
}
</style>
