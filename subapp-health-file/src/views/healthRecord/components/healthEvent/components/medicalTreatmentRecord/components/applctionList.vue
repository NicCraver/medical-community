<template>
  <div class="page">
    <div class="title">
      <div class="right">申请列表</div>
      <div class="left">共 {{ total }} 项</div>
    </div>
    <div class="content">
      <div
        class="noneData"
        v-if="list.length == 0"
      > 暂无数据 </div>
      <div
        :class="itemCls(item, index)"
        v-for="(item, index) in list"
        :key="index"
        @click="itemClick(index, item)"
        v-else
      >
        <div class="itemTop">
          <div class="itemTopLeft overflow-point" :title="item.itemName">
            {{ item.itemName }}
          </div>
          <div class="itemTopRight overflow-point" :title="item.simpleName">
            {{ item.simpleName }}
          </div>
        </div>
        <div class="itemBottom">
          报告时间：{{ item.reportTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    total: {},
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      currentActive: -1
      // list:[{
      //   a:111
      // },{
      //   a:111
      // },{
      //   a:111
      // },]
    };
  },
  components: {},
  methods: {
    itemClick(idx, item) {
      this.currentActive = idx;
      this.$emit("clickItem", item);
    },
    itemCls(item, index) {
      return {
        item: true,
        firstItem: index == 0,
        active: this.currentActive == index
      };
    },
    setFirst() {
      if (this.list.length > 0) {
        this.itemClick(0, this.list[0]);
      }
    }
  },
  mounted() {
    this.setFirst();
  }
};
</script>

<style scoped lang="scss">
.page {
  height: calc(100% - 2px);
  border: 1px solid rgba(217, 217, 217, 100);

  display: flex;
  flex-direction: column;
  .title {
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    line-height: 40px;
    border-bottom: 1px solid rgba(217, 217, 217, 100);
    background-color: rgba(247, 247, 247, 100);
    .right {
      text-align: left;
      flex: 1;
    }
    .left {
      text-align: right;
      width: auto;
    }
  }
  .content {
    flex: 1;
    padding: 7px;
    height: 100%;
    overflow-y: auto;
    .active {
      background-color: rgba(255, 255, 255, 100) !important;
      border: 1px solid rgba(94, 132, 215, 100) !important;
      .itemTopLeft {
        color: rgba(94, 132, 215, 100) !important;
      }
      .itemTopRight {
        color: rgba(94, 132, 215, 100) !important;
        border: 1px solid rgba(94, 132, 215, 100) !important;
      }
    }

    .item {
      height: 58px;
      line-height: 20px;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 100);
      text-align: center;
      border: 1px solid rgba(217, 217, 217, 100);
      padding: 0px 11px;
      margin: 11px 0;
      box-sizing: border-box;
      .itemTop {
        display: flex;
        height: 30px;
        /* line-height: 34px; */
        align-items: center;
        .itemTopLeft {
          flex: 1;
          font-size: 16px;
          text-align: left;
          font-family: SourceHanSansSC-medium;
          line-height: 24px;
          margin-right: 10px;
        }
        .itemTopRight {
          height: 16px;
          line-height: 17px;
          border-radius: 2px;
          background-color: rgba(255, 255, 255, 100);
          border: 1px solid rgba(217, 217, 217, 100);
          color: rgba(145, 145, 145, 100);
          font-size: 12px;
          text-align: center;
          font-family: Roboto;
          // margin-top: 11px;
        }
      }
      .itemBottom {
        text-align: left;
        opacity: 0.85;
        color: rgba(51, 51, 51, 100);
        font-size: 12px;
        font-family: SourceHanSansSC-regular;
      }
    }
    .firstItem {
      margin-top: 0px;
    }
  }
}

.noneData {
  margin-top: 20vh;
  text-align: center;
}
</style>
