<template>
  <div class="Iframe360 longContent">
    <el-dialog
      :visible.sync="visibleDialog"
      no-footer
      title="360视图"
      width="1440px"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <iframe
        ref="iframe"
        :src="`http://10.10.254.234:8080/system/view?userName=systemview&cardType=1&patientSn=${pid}&idCard=${idNo}`"
        :style="`width: 100%; height: 800px; border: none`"
      ></iframe>
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
    pid: {
      type: String,
    },
    idNo: {
      type: String,
    },
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
  data() {
    return {
      offsetHeight: 0,
    };
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.Iframe360 {
  ::v-deep.el-dialog__body {
    overflow: auto;
    padding: 10px;
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
