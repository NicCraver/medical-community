<template>
  <div class="lifecycle">
    <el-row :gutter="0" class="lifecycle-cont">
      <el-col
        :span="4"
        v-for="(item, index) in lifecycleData"
        :key="index"
        class="lc-modules"
      >
        <div
          class="span"
          :class="{
            isData: item.visitCount || item.interveneCount,
            isAfter: item.isAfter,
            isCurrent: currentIndex == index,
          }"
          @click="lcItemClick(item, index)"
        >
          <template v-if="item.title">{{
            item.title.indexOf(" ") > -1 ? item.title.split(" ")[0] : item.title
          }}</template>
          <template v-if="item.title"></template>
        </div>
      </el-col>
    </el-row>
    <div class="ruler">
      <div class="ruler-before" :style="rulerBeforeSyl"></div>
      <div class="ruler-slider" :style="rulerSliderSyl">
        <div class="ruler-slider-title">
          <template
            v-if="currentIndex > -1 && lifecycleData[currentIndex].title"
          >
            <div
              class="empty-circle"
              :class="{
                isAfter:
                  currentIndex > -1 && lifecycleData[currentIndex].isAfter,
              }"
            ></div>
            <div>
              {{
                lifecycleData[currentIndex].title.indexOf(" ") > -1
                  ? lifecycleData[currentIndex].title.split(" ")[1] + "期"
                  : lifecycleData[currentIndex].title
              }}
            </div>
          </template>
        </div>
        <div>
          <template
            v-if="currentIndex > -1 && lifecycleData[currentIndex].isAfter"
          >
            当前年龄未达到
          </template>
          <template
            v-else-if="
              currentIndex > -1 &&
              (lifecycleData[currentIndex].visitCount ||
                lifecycleData[currentIndex].interveneCount)
            "
            ><span
              class="text-underline"
              v-if="lifecycleData[currentIndex].visitCount"
              @click="visitClick(lifecycleData[currentIndex])"
            >
              就诊{{ lifecycleData[currentIndex].visitCount || 0 }}次
            </span>
            <span
              class="text-underline"
              style="margin-left: 5px"
              v-if="lifecycleData[currentIndex].interveneCount"
            >
              干预{{ lifecycleData[currentIndex].interveneCount || 0 }}次
            </span>
          </template>
          <template
            v-else-if="
              currentIndex > -1 &&
              !lifecycleData[currentIndex].visitCount &&
              !lifecycleData[currentIndex].interveneCount
            "
            >暂无健康记录</template
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLifeCycle } from "@/api/modules/healthRecord/index.js";
import { mapActions } from "vuex";

export default {
  name: "lifecycle",
  props: {
    personalArchiveInfo: {
      type: Object,
      default() {
        return {
          pAId: "",
          birthday: 0,
        };
      },
    },
  },
  data() {
    return {
      // 生命周期数据
      lifecycleData: [],
      currentIndex: -1,
      rulerBeforeSyl: {
        width: 0,
      },
      rulerSliderSyl: { width: 0, left: 0 },
    };
  },
  computed: {
    pAId() {
      return this.personalArchiveInfo.pAId;
    },
  },
  watch: {
    pAId: {
      handler(val) {
        if (val) {
          // 生命周期
          this.getLifeCycle();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      setJumpToData: "base/setJumpToData",
    }),
    // 查询生命周期
    async getLifeCycle() {
      try {
        let { result, code } = await getLifeCycle({
          fAId: this.pAId,
        });
        if (code === 0) {
          console.log("生命周期数据：", result);
          this.lifecycleData = result;
          this.getAfterLifecycle();
        }
      } catch (error) {}
    },
    // 获取已发生的生命周期长度
    getAfterLifecycle() {
      let currentIndex = -1;
      let width = 0;
      for (let i in this.lifecycleData) {
        let item = this.lifecycleData[i];
        if (item.isCurrent) {
          currentIndex = Number(i);
          width = Math.floor((100 / 6) * (currentIndex + 1)) + "%";
        }
        if (i > currentIndex && currentIndex != -1) {
          this.$set(this.lifecycleData, i, {
            ...this.lifecycleData[i],
            isAfter: true,
          });
        }
      }
      this.$set(this.rulerBeforeSyl, "width", width);
      this.lcItemClick(this.lifecycleData[currentIndex], currentIndex);
    },
    // 点击某一个周期
    lcItemClick(item, index) {
      this.currentIndex = index;
      this.$set(this.rulerSliderSyl, "left", (100 / 6) * index + "%");
      this.$set(this.rulerSliderSyl, "width", 100 / 6 + "%");
      if (item.isAfter) {
        this.$set(this.rulerSliderSyl, "backgroundColor", "transparent");
        this.$set(this.rulerSliderSyl, "color", "rgba(106, 140, 215, 50)");
      } else {
        this.$set(this.rulerSliderSyl, "backgroundColor", "rgba(255, 255, 255, 0.25)");
        this.$set(this.rulerSliderSyl, "color", "#fff");
      }
    },
    // 就诊跳转
    visitClick(item) {
      this.setJumpToData({
        firstLevelName: "two",
        healthEventName: "first",
        healthEventItem: {
          flag: "year",
          year: item.recentYear,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.lifecycle {
  border-radius: 4px 4px 30px 30px;
  background-color: #f9f9f9;
  box-shadow: 0px 2px 2px 2px  #c6c6c6;
  .lifecycle-cont {
    height: 30px;
    overflow: hidden;
    .lc-modules {
      height: 100%;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      .span {
        margin-top: 2px;
        padding: 0 3px;
        color: rgba(145, 145, 145, 100);
        font-size: 12px;
        font-family: SourceHanSansSC-regular;
        border-left: 2px solid transparent;
        border-radius: 4px;
        background-color: #f2f2f2;
        font-weight: 600;
      }
      .span.isData {
        background-color: #e7ebf3;
        border-left: 2px solid #446bbd;
        color: #446bbd;
        border-radius: 0;
      }
      .span.isAfter {
        background-color: transparent;
      }
      .span.isCurrent {
        background-color: #446bbd;
        color: #fff;
        border-radius: 4px;
      }
    }
  }
  .ruler {
    height: 30px;
    margin-bottom: 10px;
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    background-color: #e7ebf3;
    .ruler-before {
      height: 100%;
      width: 70%;
      border-radius: 30px;
      position: absolute;
      top: 0;
      left: 0;
      background-image: linear-gradient(to right, #519dec, #456dbf);
    }
    .ruler-slider {
      height: 100%;
      border-radius: 30px;
      position: absolute;
      top: 0;
      left: 0;
      transition-duration: 100ms;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-weight: 600;
      font-size: 12px;
      .ruler-slider-title {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 14px;
        .empty-circle {
          width: 8px;
          height: 8px;
          border-radius: 18px;
          margin-right: 10px;
          border: 5px solid #afcff3;
          background-color: #fff;
        }
        .empty-circle.isAfter {
          border: 5px solid #bfcdeb;
          background-color: #94ace1;
        }
      }
    }
    .text-underline {
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>