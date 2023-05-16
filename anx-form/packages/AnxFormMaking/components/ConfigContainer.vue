<template>
  <div class="config-container" ref="configContainer">
    <div class="border-left" @mousedown="handleMouseDown"></div>
    <el-tabs v-model="activeName" stretch>
      <el-tab-pane label="字段属性" name="first">
        <form-item-config />
      </el-tab-pane>
      <el-tab-pane label="表单属性" name="second">
        <form-config />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import FormItemConfig from './FormItemConfig';
import FormConfig from './FormConfig';
export default {
  name: 'ConfigContainer',
  data() {
    return { activeName: 'first', startX: 975, startWidth: 100 };
  },
  methods: {
    handleMouseDown(e) {
      this.startX = e.pageX;
      this.startWidth = this.$refs.configContainer.clientWidth;
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseMove(e) {
      document.body.style.cursor = 'e-resize';
      const x = this.startX - e.pageX;
      this.$refs.configContainer.style.width = this.startWidth + x + 'px';
    },
    handleMouseUp() {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mousemove', this.handleMouseUp);
    }
  },
  components: {
    FormItemConfig,
    FormConfig
  }
};
</script>
<style lang="scss" scoped>
.config-container {
  width: 300px;
  min-width: 100px;
  padding: 0 10px;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
  .border-left {
    position: absolute;
    width: 3px;
    left: 0;
    top: 0;
    bottom: 0;
    border-left: 1px solid #e1e1e1;
    cursor: e-resize;
  }
}
</style>
