<template>
  <div class="ProDrawer">
    <el-drawer
      :visible.sync="visibleDrawer"
      :append-to-body="false"
      :with-header="false"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div class="ProDrawer-wrapper">
        <div class="ProDrawer-top">
          <div class="ProDrawer-header" v-if="!noHeader">
            <div class="line"></div>
            <div class="title" v-if="title !== ''">{{ title }}</div>
            <slot name="title"></slot>
          </div>
          <div class="ProDrawer-main">
            <slot></slot>
          </div>
        </div>
        <footer class="ProDrawer-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    noHeader: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visibleDrawer: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.ProDrawer {
  .ProDrawer-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .ProDrawer-top {
      .ProDrawer-header {
        display: flex;
        height: 48px;
        align-items: center;
        border-bottom: 1px solid #e9e9e9;
        .line {
          width: 3px;
          height: 16px;
          border-radius: 1px;
          background-color: rgba(19, 71, 150, 100);
        }
        .title {
          font-size: 16px;
          font-weight: bold;
          margin-left: 10px;
          margin-right: 15px;
        }
      }
    }
    .ProDrawer-footer {
      border-top: 1px solid #e9e9e9;
      text-align: right;
      height: 55px;
      line-height: 55px;
      padding-right: 10px;
    }
  }
}
</style>
