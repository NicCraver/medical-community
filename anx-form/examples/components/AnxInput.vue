<template>
  <div class="anx-input" :class="{ 'anx-input--suffix': showSuffix }">
    <!-- 如果传了show-password, 判断是否需要切换 密码的显示 如果不传，不判断 -->
    <input
      class="anx-input__inner"
      :class="{ 'is-disabled': disabled }"
      :placeholder="placeholder"
      :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
      :name="name"
      :disabled="disabled"
      :value="value"
      @input="handleInput"
    />
    <span class="anx-input__suffix" v-if="showSuffix">
      <i
        class="anx-input__icon hm-icon-circle-close"
        v-if="clearable && value"
        @click="clear"
      ></i>
      <i
        class="anx-input__icon hm-icon-view"
        v-if="showPassword"
        @click="handlePassword"
        :class="{ 'hm-icon-view-active': passwordVisible }"
      ></i>
    </span>
  </div>
</template>

<script>
export default {
  name: "AnxInput",
  data() {
    return {
      // 用于控制是否显示密码框
      passwordVisible: false
    };
  },
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    showPassword: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    showSuffix() {
      return this.clearable || this.showPassword;
    }
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.target.value);
    },
    clear() {
      // 把内容清空
      this.$emit("input", "");
    },
    handlePassword() {
      this.passwordVisible = !this.passwordVisible;
    }
  }
};
</script>

<style lang="scss">
.anx-input {
  width: 100%;
  position: relative;
  font-size: 14px;
  display: inline-block;
  .anx-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;

    &:focus {
      outline: none;
      border-color: #409eff;
    }
    &.is-disabled {
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
}

.anx-input--suffix {
  .anx-input__inner {
    padding-right: 30px;
  }
  .anx-input__suffix {
    position: absolute;
    height: 100%;
    right: 10px;
    top: 0;
    line-height: 40px;
    text-align: center;
    color: #c0c4cc;
    transition: all 0.3s;
    z-index: 900;
    i {
      color: #c0c4cc;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    .hm-icon-view-active {
      color: blue;
    }
  }
}
</style>
