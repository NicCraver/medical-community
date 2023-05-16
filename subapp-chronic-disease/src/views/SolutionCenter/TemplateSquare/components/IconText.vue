<!--
 * @Author: Nic
 * @Date: 2023-02-06 11:11:15
 * @LastEditTime: 2023-02-09 17:19:54
 * @LastEditors: Nic
 * @Description: IconText
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/SolutionCenter/TemplateSquare/components/IconText.vue
-->
<template>
  <div
    class="IconText"
    :class="componentActive === componentText ? 'IconText-active' : 'IconText-normal'"
  >
    <div class="ip-left-item" style="display: flex">
      <IconSvg
        :iconClass="componentActive === componentText ? 'bookmark-b' : 'bookmark-w'"
        style="margin-right: 16px"
      />
      <div>{{ text }}</div>
    </div>
    <div class="error" v-if="error">待完善</div>
  </div>
</template>

<script>
export default {
  props: {
    componentText: {
      type: String,
    },
    componentActive: {
      type: String,
    },
    text: {
      type: String,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.IconText {
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  .ip-left-item {
    display: flex;
    align-items: center;
    padding: 0 16px;
    justify-content: space-between;
  }
  .error {
    width: 50px;
    border-radius: 40px;
    line-height: 20px;
    background-color: rgba(245, 108, 108, 0.2);
    color: rgba(245, 108, 108, 1);
    font-size: 12px;
    text-align: center;
    border: 1px solid rgba(245, 108, 108, 1);
  }
}

.IconText-normal {
  color: rgba(78, 89, 105, 1);
  background-color: #fff;
}
.IconText-active {
  color: rgba(22, 93, 255, 1);
  background-color: rgba(242, 243, 245, 1);
}
</style>
