<template>
  <div class="emptyCom">
    <IconSvg iconClass="riFill" width="70" height="70"></IconSvg>
    <div class="descriptionCls">
      该患者近一年无慢病指标记录，您可通过
      <i @click="tixing">提醒</i>
      的方式跟患者建立连接～
    </div>
  </div>
</template>
<script>
export default {
  name: "emptyCom",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    tixing() {
      this.$emit("tixing");
    },
  },
};
</script>

<style lang="scss" scoped>
.emptyCom {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-content: center;
  .descriptionCls {
    margin-top: 40px;
    i {
      color: #4468bd;
      cursor: pointer;
    }
  }
}
</style>