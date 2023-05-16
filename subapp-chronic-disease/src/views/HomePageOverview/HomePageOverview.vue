<template>
  <div class="HomePageOverview">
    <HeaderView ref="HeaderViewRef" />
    <MainView ref="MainViewRef" />
  </div>
</template>

<script>
import HeaderView from './components/HeaderView.vue'
import MainView from './components/MainView.vue'
export default {
  components: { HeaderView, MainView },
}
</script>

<style lang="scss" scoped>
.HomePageOverview {
  padding: 10px;
  background-color: #f5f4f6;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 40px);
}
</style>
