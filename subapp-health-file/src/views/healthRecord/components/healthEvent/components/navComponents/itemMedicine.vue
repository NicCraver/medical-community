<template>
  <div class="itemMedicine height100">
    <div
      class="second-cont height100"
      v-show="secondData.length"
      v-infinite-scroll="secondLoadMore"
      infinite-scroll-disabled="secondDisabled"
    >
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(item, index) in secondData"
          :key="index"
          :name="index"
          :class="{ selected: currentSecondIndex === index }"
        >
          <template slot="title">
            <div
              class="title-cont"
              :class="{ selected: currentSecondIndex === index }"
              @click="secondItemClick(item, index)"
            >
              <div class="title-left">
                <i
                  class="icon-cont"
                  :class="{
                    'el-icon-caret-right': activeNames.indexOf(index) == -1,
                    'el-icon-caret-bottom': activeNames.indexOf(index) > -1,
                  }"
                ></i
                >{{ item.groupTitle || "--" }}
              </div>
              <div class="title-right">{{ item.groupDesc || "" }}</div>
            </div>
          </template>
          <div class="detail-cont" @click="secondItemClick(item, index)">
            <div v-for="(val, key) in item.items" :key="key">
              <span class="circle-item"></span>
              <span class="name-item">{{ val.itemName || "--" }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="second-emptyBox height100" v-show="!secondData.length">
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
  name: "itemMedicine",
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
      activeNames: [],
      currentSecondIndex: -1,
    };
  },
  computed: {},
  watch: {
    activeNames: {
      handler(val) {},
      immediate: true,
      deep: true,
    },
    secondData: {
      handler(val) {
        this.activeNames = [];
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 下拉加载事件
    secondLoadMore() {
      this.$emit("secondLoadMore");
    },
    // 点击某一个导航
    secondItemClick(item, index) {
      if (item.hasOwnProperty("isPrivacy") && item.isPrivacy === "0") {
        this.$message.warning("该数据为隐私数据，无法查看。");
        return;
      }

      this.currentSecondIndex = index;
      let advicesItem = item.items.length ? item.items[0] : {};
      this.$emit("loadEventFuc", {
        item: {
          ...item,
          serialNumber: advicesItem.groupId,
          groupType: item.type || "",
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
.itemMedicine {
  .second-cont {
    margin-top: 10px;
    overflow-y: auto;
    .el-collapse {
      margin-right: 10px;
      border: none;
      .el-collapse-item {
        margin-bottom: 10px;
        .el-collapse-item__header {
          background-color: #eff2f9;
          height: 33px;
          line-height: 33px;
          color: #333;
          font-family: SourceHanSansSC-regular;
          align-items: center;
          .title-cont {
            width: 100%;
            height: 100%;
            background-color: #eff2f9;
            color: #333;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            .icon-cont {
              margin: 0 13px 0 5px;
            }
            .title-right {
              margin-right: 5px;
            }
          }
          .title-cont.selected {
            background-color: #5e84d7;
            color: #fff;
          }
          .el-collapse-item__arrow {
            display: none;
          }
        }
        .el-collapse-item__content {
          padding: 0;
          border: 1px solid #eff2f9;
          border-top: none;
          cursor: pointer;
          .detail-cont {
            padding: 10px 25px;
            .circle-item {
              width: 8px;
              height: 8px;
              margin-right: 20px;
              border-radius: 4px;
              background-color: #919191;
              display: inline-block;
            }
            .name-item {
              line-height: 20px;
              color: rgba(51, 51, 51, 100);
              font-size: 14px;
              text-align: left;
              font-family: SourceHanSansSC-regular;
            }
          }
        }
      }
      .el-collapse-item.is-active {
        border: none;
      }
      .el-collapse-item.selected {
        .el-collapse-item__content {
          border: 1px solid #5e84d7;
          border-top: none;
          .detail-cont .circle-item {
            background-color: #5e84d7;
          }
        }
      }
    }
  }
  .second-emptyBox {
    margin-top: 10px;
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
