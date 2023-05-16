<template>
  <div class="HeaderView">
    <el-row :gutter="12">
      <el-col :span="8">
        <div class="boxs">
          <div class="title">
            <div class="bg">
              <img src="@/assets/home/doc.png" alt="" />
            </div>
            <div>建档人数</div>
          </div>
          <div class="box">
            <div class="text">
              <CountTo
                :startVal="0"
                :endVal="counts.patCount"
                :duration="duration"
              ></CountTo>
              <div class="title">累计</div>
            </div>
            <div class="line"></div>
            <div class="text">
              <CountTo
                :startVal="0"
                :endVal="counts.todayPatCount"
                :duration="duration"
              ></CountTo>
              <div class="title">今日新增</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="boxs">
          <div class="title">
            <div class="bg" style="background-color: #faefd3">
              <img src="@/assets/home/time.png" alt="" />
            </div>
            <div>管理状态</div>
          </div>
          <div class="box">
            <div class="text">
              <CountTo
                :startVal="0"
                :endVal="counts.waitTot"
                :duration="duration"
              ></CountTo>
              <div class="title">待完善</div>
            </div>
            <div class="line2"></div>
            <div class="text">
              <CountTo
                :startVal="0"
                :endVal="counts.manageTot"
                :duration="duration"
              ></CountTo>
              <div class="title">管理中</div>
            </div>
            <div class="line2"></div>
            <div class="text">
              <CountTo
                :startVal="0"
                :endVal="counts.closeTot"
                :duration="duration"
              ></CountTo>
              <div class="title">已结档</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="boxs">
          <div class="title">
            <div class="bg" style="background-color: #e2f0d9">
              <img src="@/assets/home/pen.png" alt="" />
            </div>
            <div>随访人次</div>
          </div>
          <div class="box">
            <div class="text">
              <CountTo
                :startVal="0"
                :endVal="counts.followTot"
                :duration="duration"
              ></CountTo>
              <div class="title">累计</div>
            </div>
            <div class="line"></div>
            <div class="text">
              <CountTo
                :startVal="0"
                :endVal="counts.todayFollowTot"
                :duration="duration"
              ></CountTo>
              <div class="title">今日新增</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHomePageData } from "../../../api/modules/Home";
import CountTo from "../../../components/CountTo/src/index.vue";
export default {
  components: {
    CountTo,
  },
  data() {
    return {
      duration: 2000,
      counts: {
        patCount: 0,
        todayPatCount: 0,
        waitTot: 0,
        manageTot: 0,
        closeTot: 0,
        followTot: 0,
        todayFollowTot: 0,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        const res = await getHomePageData({ type: "A" });
        this.counts = res.result;
      } catch (e) {
        console.log(`e`, e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.HeaderView {
  .boxs {
    text-align: center;
    background-color: #fff;
    border-radius: 2px;
    height: 106px;
    padding: 10px 0 10px 0;
    .box {
      display: flex;
      justify-content: center;
      text-align: center;
      align-items: flex-start;
      .text {
        width: 33.33%;
        font-size: 26px;
        color: #303133;
        .title {
          color: rgba(145, 145, 145, 100);
          font-size: 12px;
        }
      }
      .line {
        width: 33.33%;
        margin: 10px 40px 0 40px;
        width: 1px;
        background-color: #d9d9d9;
        height: 35px;
      }
      .text2 {
        width: 20%;
        font-size: 26px;
        color: #303133;
        .title {
          color: rgba(145, 145, 145, 100);
          font-size: 12px;
        }
      }
      .line2 {
        width: 20%;
        margin: 10px 10px 0 10px;
        width: 1px;
        background-color: #d9d9d9;
        height: 35px;
      }
    }
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      .bg {
        background-color: #cad2ea;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #303133;
        margin-right: 4px;
        img {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
}
</style>
