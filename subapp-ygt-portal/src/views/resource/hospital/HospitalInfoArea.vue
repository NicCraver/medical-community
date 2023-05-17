<!-- 
  @description 统一资源管理后台-医院管理-医院信息-院区
  @date 2021/10/19
 -->
<template>
  <el-drawer title="院区" :visible.sync="isVisible" :before-close="close" :size="900" :wrapperClosable="false">
    院区
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      form: {},
      rules: {},
    };
  },
  methods: {
    open(data) {
      this.isVisible = true;
      this.form = data;
    },
    close() {
      this.isVisible = false;
      this.form = {};
    },
  },
};
</script>