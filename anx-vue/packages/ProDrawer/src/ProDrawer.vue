<template>
  <div class="ProDrawer">
    <el-drawer :visible.sync="visibleDrawer" :append-to-body="false" v-bind="$attrs" v-on="$listeners" :show-close="true">
      <template #title>
        <div class="title">{{ title }}</div>
      </template>
      <div class="ProDrawer-wrapper">
        <div class="ProDrawer-main">
          <slot></slot>
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
  name: 'ProDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    noHeader: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visibleDrawer: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.ProDrawer {
  .title {
    color: rgba(48, 49, 51, 100);
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    position: relative;
  }
  .title::before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
  ::v-deep .el-drawer__header {
    line-height: 20px;
    padding: 15px;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(233, 233, 233, 100);
  }
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
