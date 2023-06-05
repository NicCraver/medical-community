<template>
  <div class="layout-main">
    <div v-if="model === 'home'" class="model-home">
      <slot />
    </div>
    <div v-if="model === 'title'" class="model-title">
      <div class="title" ref="title">
        <slot name="title" />
      </div>
      <div class="layout-main-content" ref="main">
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
      <div class="layout-main-content" ref="main">
        <slot name="main" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: String,
      default: "home" | "tab" | "title" | "details",
    },
    mainBgColor: {
      type: String,
      default: "#fff",
    },
    margin: {
      type: String,
      default: "10px",
    },
    padding: {
      type: String,
      default: "10px",
    },
    navBarBgColor: {
      type: String,
      default: "#fff",
    },
  },
  mounted() {
    if (this.model !== "home") {
      // console.log(`this.margin`, this.margin)
      // console.log(`this.padding`, this.padding)
      this.$refs.main.style.backgroundColor = this.mainBgColor;
      this.$refs.main.style.margin = this.margin;
      this.$refs.main.style.padding = this.padding;
      this.$refs.title.style.backgroundColor = this.navBarBgColor;
    }
  },
};
</script>

<style lang="scss" scoped>
.layout-main {
  background-color: #f5f5f5;
  .model-home {
    height: calc(100vh - 72px);
    background-color: #fff;
    margin: 12px;
    padding: 12px;
  }
  .model-title {
    .title {
      height: 30px;
      padding: 10px;
      background-color: #fff;
      color: rgba(48, 49, 51, 100);
      font-size: 18px;
      font-weight: bold;
    }
    .layout-main-content {
      height: calc(100vh - 60px);
      background-color: #fff;
      margin: 12px;
      padding: 12px;
      min-width: 1200px;
    }
  }
  .model-tab {
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
      height: calc(100vh - 161px);
      background-color: #fff;
      margin: 12px;
      padding: 12px;
    }
  }
}
</style>
