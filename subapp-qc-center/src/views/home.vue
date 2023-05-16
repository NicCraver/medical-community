<template>
  <div class="home">
    <el-input v-model="input" placeholder="Please input" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  background: #fff;
  padding: 20px;
  width: 500px;
}
</style>
