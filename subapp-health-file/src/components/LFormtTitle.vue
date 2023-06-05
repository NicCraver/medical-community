<template>
  <div :class="wrapperCls()" ref="inputWrap">
    <div class="l-input-body">
      <div class="l-input-body-left" :class="{'mult': isMultiRow}" v-if="showLeftFlag">
        <div class="l-input-title" ref="title">{{ label }}</div>
        <div class="l-input-gap"></div>
      </div>
      <div class="l-input-body-main">
        <slot></slot>
      </div>
      <div class="l-input-body-right" :class="{'mult': isMultiRow}" v-if="showRightFlag">
        <div class="l-input-gap"></div>
        <div class="l-input-title" ref="title">{{ label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LFormtTitle",
  props: {
    label: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    displayMode: {
      type: String,
      default: "left",
    },
    // 组件高度高于1行时传true(比如多行文本框)
    isMultiRow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    showLeftFlag() {
      return this.displayMode === "left" && this.label !== "";
    },
    showRightFlag() {
      return this.displayMode === "right" && this.label !== "";
    },
  },
  methods: {
    wrapperCls() {
      return {
        "l-input-wrap": true,
        required: this.required,
        disabled: this.disabled,
      };
    },
  },
};
</script>

<style scoped lang="scss">

// @import "@/assets/css/variables/variables.scss";

$color: rgba(148, 157, 163, 1);
$titleColor: #666c70;
$border: #e4e4e4;
$inputContainText: #2e323a;

.l-input-wrap {
  line-height: 32px;
  display: inline-block;
  white-space: nowrap;
  background: #fff;
  border: 1px solid $border;
  color: $color;
  box-sizing: border-box;
  transition: 0.1s;
  border-radius: $l-bg-radius-bg;
  // width: 100%;
  text-align: left;
  overflow: hidden;
  vertical-align: top;
  
  .l-input-body {
    width: 100%;
    height: 100%;
    position: relative;
    display: inline-flex;
    font-size: 0;

    .l-input-body-main {
      position: relative;
      flex: 1;
      font-size: $l-font-size;
      padding: 0 8px;
      > div {
        width: 100%;
      }

      // 多行文本
      ::v-deep .el-textarea__inner {
        border: 0;
      }
      ::v-deep .el-input__inner {
        color: $inputContainText;
        border: 0;
      }
    }
    .l-input-body-left,
    .l-input-body-right {
      display: inline-flex;
      align-items: center;
      font-size: $l-font-size;
    }
    .mult {
      max-height: $l-height-common-5;
    }
    .l-input-title {
      font-size: $l-font-size;
      font-weight: 400;
      color: $titleColor;
      padding: 0 $l-padding-default-4;
    }

    .l-input-gap {
      width: 1px;
      height: 14px;
      background: $l-color-bgcolor-11;
    }
  }
}

.required {
  .l-input-title:after {
    content: "*";
    width: 7px;
    height: 14px;
    font-size: $l-font-size;
    padding-left: $l-padding-default-2;
    vertical-align: middle;
    font-weight: bolder;
    color: $l-color-important;
  }
}

.disabled {
  background-color: $l-color-bgcolor-1 !important;
}
</style>
