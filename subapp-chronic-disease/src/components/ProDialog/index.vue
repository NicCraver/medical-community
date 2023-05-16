<template>
  <div class="ProDialog" :class="longContent ? 'longContent' : ''">
    <el-dialog :visible.sync="visibleDialog" v-bind="$attrs" v-on="$listeners" :class="wordResultCut ? 'wordResultCut' : ''">
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
    noFooter: {
      type: Boolean,
      default: false,
    },
    longContent: {
      type: Boolean,
      default: false,
    },
    wordResultCut: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visibleDialog: {
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

<style lang="scss">
.wordResultCut{
  .el-dialog{
    .el-dialog__header{
      display: none;
    } 
    .el-dialog__footer{
      text-align: center;
      border:none;
    }   
  }
}
</style>
<style lang="scss" scoped>
.ProDialog {
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
