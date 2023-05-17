<template>
  <div class="emptyPage" v-loading="loading"></div>
</template>
<script>
import mixin from "./mixin.js";
export default {
  name: "emptyPage",
  mixins: [mixin],
  created() {
    console.log("emptyPage的路由信息：", this.$route.params);
    this.initFuc();
  },
  methods: {
    initFuc() {
      let routerParams = this.$route.params;
      let queryTime = routerParams.queryTime || [];
      let orgIdList = routerParams?.orgIdList || [];
      let queryParams = {
        name: routerParams?.name,
        orgIdList: orgIdList.length ? orgIdList.join(",") : "",
        publishStatus: 2,
        pageNum: 1,
        pageSize: 100000000,
        startDate: queryTime.length === 2 ? queryTime[0] : "",
        endDate: queryTime.length === 2 ? queryTime[1] : "",
      };
      this.getList(queryParams, (tableData) => {
        this.gotoAreaFuc(tableData, routerParams.pathName);
      });
    },
  },
};
</script>
<style scoped lang="scss">
.emptyPage {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
