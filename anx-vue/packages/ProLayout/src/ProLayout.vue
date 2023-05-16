<template>
  <div class="layout-main">
    <div v-if="model === 'home'" class="model-home">
      <slot />
    </div>
    <div v-if="model === 'title'" class="model-title">
      <div class="title">
        <slot name="title" />
      </div>
      <div class="layout-main-content" :class="overflow ? 'overflow-y' : 'overflow'" ref="main">
        <slot name="main" />
      </div>
    </div>
    <div v-if="model === 'tab'" class="model-tab">
      <div class="title">
        <slot name="title" />
        <div class="tab">
          <slot name="tab" />
        </div>
      </div>
      <div class="layout-main-content" :class="overflow ? 'overflow-y' : 'overflow'" ref="main">
        <slot name="main" />
      </div>
      <div class="footer" v-if="footer">
        <slot name="footer" />
      </div>
    </div>
    <div v-if="model === 'content-footer'" class="model-tab">
      <div class="title">
        <slot name="title" />
      </div>
      <div class="layout-main-content" :class="overflow ? 'overflow-y' : 'overflow'" ref="main">
        <slot name="main" />
      </div>
      <div class="footer" v-if="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProLayout',
  props: {
    model: {
      type: String,
      default: 'title',
    },
    mainBgColor: {
      type: String,
      default: '#fff',
    },
    margin: {
      type: String,
      default: '10',
    },
    padding: {
      type: String,
      default: '10',
    },
    overflow: {
      type: Boolean,
      default: false,
    },
    footer: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    if (this.model !== 'home') {
      // console.log(`this.margin`, this.margin);
      // console.log(`this.padding`, this.padding);
      this.$refs.main.style.backgroundColor = this.mainBgColor
      this.$refs.main.style.margin = this.margin + 'px'
      this.$refs.main.style.padding = this.padding + 'px'
    }
  },
}
</script>

<style lang="scss" scoped>
.layout-main {
  height: calc(100vh - 48px);
  .model-home {
    height: calc(100vh - 72px);
    background-color: #fff;
    margin: 12px;
    padding: 12px;
  }
  .model-title {
    .title {
      padding: 10px;
      background-color: #fff;
      color: rgba(48, 49, 51, 100);
      font-size: 18px;
      font-weight: bold;
    }
    .layout-main-content {
      height: calc(100vh - 118px);
      background-color: #fff;
      margin: 12px;
      padding: 12px;
    }
  }
  .model-tab {
    display: flex;
    flex-direction: column;
    height: 100%;
    .title {
      padding: 10px 10px 1px 10px;
      background-color: #fff;
      color: rgba(48, 49, 51, 100);
      font-size: 18px;
      font-weight: bold;
      .tab {
        margin-top: 10px;
      }
    }
    .layout-main-content {
      flex: 1;
      margin: 12px;
      padding: 12px;
    }
    .footer {
      height: 45px;
      background-color: #fff;
      border-top: 1px solid #f5f5f5;
      display: flex;
      justify-content: right;
      align-items: center;
      padding-right: 10px;
    }
  }
  .overflow {
    overflow: hidden;
  }
  .overflow-y {
    overflow-y: auto;
  }
  .overflow-y::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .overflow-y::-webkit-scrollbar-thumb {
    background-color: #dddee0;
    border-radius: 8px;
  }
}
</style>
<style lang="scss">
.layout-main {
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 !important;
  }
  .el-tabs__nav,
  .el-tabs__nav-scroll {
    background-color: #fff !important;
  }
  .el-tabs__item.is-top.is-active {
    border-bottom: none !important;
  }
  .el-tabs__item.is-active {
    color: #134796 !important;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #949da3 !important;
  }
  .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: #134796 !important;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    border-radius: 4px !important;
  }
  .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
  }
}
</style>
