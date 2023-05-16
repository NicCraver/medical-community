<template>
  <div class="ReviewInclusion">
    <IusionTable joinFlg="U" :isNot="false" />
  </div>
</template>

<script>
import IusionTable from "../components/IusionTable.vue";
export default {
  components: {
    IusionTable,
  },
};
</script>

<style lang="scss" scoped></style>
