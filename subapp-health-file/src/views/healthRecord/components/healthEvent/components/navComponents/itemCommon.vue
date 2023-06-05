<template>
  <div class="itemCommon height100">
    <div
      class="second-cont height100"
      v-if="secondData.length"
      v-infinite-scroll="secondLoadMore"
      infinite-scroll-disabled="secondDisabled"
    >
      <div
        class="second-item"
        :class="{ 'activity-item': currentSecondIndex === index }"
        v-for="(item, index) in secondData"
        :key="index"
        @click="secondItemClick(item, index)"
      >
        <div class="second-item-type">
          <IconSvg
            :iconClass="currentSecondType.logo || 'empty-box'"
            style="color: #5e84d7"
            width="30"
            height="30"
          ></IconSvg>
        </div>
        <div class="second-item-right">
          <div class="second-item-right-item">
            <div class="title overflow-point" :title="item.itemName || ''">
              {{ item.itemName || "--" }}
            </div>
            <div class="date" v-if="item.itemDate">
              {{
                item.itemDate && item.itemDate.indexOf(" ") > -1
                  ? item.itemDate.split(" ")[0]
                  : item.itemDate || ""
              }}
            </div>
          </div>
          <div class="second-item-right-item">
            <!-- 转诊 -->
            <div
              class="detail overflow-point"
              v-html="item.organizationName || ''"
              v-if="currentSecondType.type === 'tranTreat'"
            ></div>
            <!-- 其他 -->
            <div
              class="detail overflow-point"
              v-else
              :title="item.organizationName || ''"
            >
              {{ item.organizationName || "" }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="second-emptyBox" v-else>
      <IconSvg
        iconClass="empty-box"
        style="color: #cacdd4"
        width="80"
        height="80"
      ></IconSvg>
      <div class="emptyText">暂无数据</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "itemCommon",
  components: {},
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
    currentSecondType: {
      type: Object,
      default() {
        return {};
      },
    },
    secondData: {
      type: Array,
      default() {
        return [];
      },
    },
    secondDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentSecondIndex: -1,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 下拉加载事件
    secondLoadMore() {
      this.$emit("secondLoadMore");
    },
    // 点击某一个导航
    secondItemClick(item, index) {
      if (item.hasOwnProperty("isPrivacy") &&item.isPrivacy === "0") {
        this.$message.warning("该数据为隐私数据，无法查看。");
        return;
      }

      this.currentSecondIndex = index;
      this.$emit("loadEventFuc", {
        item: {
          ...item,
          activeName: "second",
          type: this.currentSecondType.component,
        },
        index,
      });
    },
  },
  // 销毁定时器
  beforeDestroy() {},
};
</script>

<style lang="scss">
.itemCommon {
  .second-cont {
    margin-top: 10px;
    overflow-y: auto;
    .second-item {
      background-color: #fff;
      border: 1px solid transparent;
      border-bottom: 1px solid #e5e5e5;
      margin-right: 10px;
      padding: 8px 10px 9px 10px;
      border-radius: 2px;
      font-size: 14px;
      font-family: Roboto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      .second-item-type {
        width: 30px;
        display: flex;
        justify-content: center;
      }
      .second-item-right {
        width: calc(100% - 40px);
        .second-item-right-item {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .title {
            width: calc(100% - 80px);
            line-height: 24px;
            color: #5e84d7;
            font-size: 16px;
            font-family: SourceHanSansSC-medium;
          }
          .date {
            width: 80px;
            line-height: 24px;
            opacity: 0.85;
            color: #919191;
            font-size: 14px;
            font-family: SourceHanSansSC-medium;
          }
          .detail {
            line-height: 17px;
            opacity: 0.85;
            color: #333;
            font-size: 12px;
            text-align: left;
            font-family: SourceHanSansSC-regular;
          }
        }
      }
    }
    .activity-item {
      background-color: #f5f8ff;
      border: 1px solid #5e84d7;
      .second-item-right {
        .second-item-right-item {
          .date {
            color: #5e84d7;
          }
        }
      }
    }
  }
  .second-emptyBox {
    margin-top: 10px;
    height: calc(100% - 144px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .emptyText {
      color: #88898e;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
    }
  }
}
</style>
