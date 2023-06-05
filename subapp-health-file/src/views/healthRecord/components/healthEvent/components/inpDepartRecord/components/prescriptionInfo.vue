<template>
  <div class="prescriptionInfo">医嘱信息</div>
</template>

<script>
export default {
  name: "prescriptionInfo",
  components: {},
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
    // 导航传过来的内容
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  watch: {
    personalInfos: {
      handler(val) {},
      deep: true,
      immediate: true,
    },
    navBarObj: {
      handler(val) {},
      deep: true,
      immediate: true,
    },
  },
  created() {},
  destroyed() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.prescriptionInfo {
}
</style>
