<!--
 * @Author: Nic
 * @Date: 2023-02-01 14:56:37
 * @LastEditTime: 2023-02-01 15:01:30
 * @LastEditors: Nic
 * @Description: PlanHeader
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/PlanHeader.vue
-->
<template>
  <div class="PlanHeader">
    <div>
      <div class="title">{{ title }}</div>
      <div class="introduce">{{ introduce }}</div>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    introduce: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.PlanHeader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 15px 20px;
  .title {
    font-size: 20px;
    color: #4e5969;
    margin-bottom: 5px;
  }
  .introduce {
    color: rgba(153, 153, 153, 1);
    font-size: 14px;
  }
}
</style>