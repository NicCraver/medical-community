<template>
  <div class="ProDialog" :class="longContent ? 'longContent' : ''">
    <el-dialog :visible.sync="visibleDialog" v-bind="$attrs" v-on="$listeners">
      <template #title>
        <div class="title">{{ title }}</div>
      </template>
      <slot></slot>
      <div slot="footer" v-if="!noFooter">
        <slot name="footer"></slot>
      </div>
    </el-dialog>
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
      default: '',
    },
    noFooter: {
      type: Boolean,
      default: false,
    },
    longContent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visibleDialog: {
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
.ProDialog {
  .title {
    color: rgba(48, 49, 51, 100);
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    position: relative;
    padding-left: 5px;
  }
  .title::before {
    content: '';
    position: absolute;
    left:-15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
  ::v-deep.el-dialog__header {
    line-height: 20px;
    padding: 15px;
    margin-bottom: 0;
    border-bottom: 1px solid rgba(233, 233, 233, 100);
  }
  ::v-deep.el-dialog__headerbtn {
    position: absolute;
    top: 17px;
    right: 10px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
  }
  ::v-deep.el-dialog__body {
    overflow: auto;
  }
  ::v-deep.el-dialog__body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::v-deep.el-dialog__body::-webkit-scrollbar-thumb {
    background-color: #dddee0;
    border-radius: 8px;
  }
}
.longContent {
  ::v-deep.el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    /** 这 0.5px加或者减都可以 */
    transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
    // transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }
}
</style>
