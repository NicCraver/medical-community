<template>
  <div class="main">
    <transition name="zoom" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
// .main {
//   height: calc(100vh - 48px);
// }
</style>
