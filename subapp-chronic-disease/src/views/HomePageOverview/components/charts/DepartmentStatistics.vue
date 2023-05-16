<template>
  <div class="DepartmentStatistics" v-loading="loading">
    <div :class="`Department${index + 1}`" v-for="(v, index) in data">
      <div class="text1">{{ v.value }}</div>
      <div class="text2">{{ v.name }}</div>
    </div>
  </div>
</template>

<script>
import { getHomePageData } from "@/api/modules/Home";
export default {
  data() {
    return {
      loading: true,
      data: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        const res = await getHomePageData({
          type: "F",
        });
        console.log(`FFFFFFFF`);
        const mockData = [
          {
            value: "54",
            name: "内分泌科",
          },
          {
            value: "32",
            name: "心血管内科",
          },
          {
            value: "27",
            name: "神经内科",
          },
          {
            value: "9",
            name: "肾内科",
          },
        ];
        this.loading = false;
        // // mock
        // this.data = mockData;
        this.data = res.result;
      } catch (error) {
        this.loading = false;
        console.log(`error`, error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.DepartmentStatistics {
  height: 280px;
  position: relative;
  .text1 {
    font-size: 32px;
    font-weight: 500;
    color: #fff;
  }
  .text2 {
    color: #fff;
    font-size: 12px;
  }
  .Department1 {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 150px;
    height: 150px;
    background-color: #4469bd;
    top: 0px;
    left: 100px;
    z-index: 13;
  }
  .Department2 {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 120px;
    height: 120px;
    background-color: #6fbf4c;
    top: 40px;
    left: 230px;
    z-index: 12;
  }
  .Department3 {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 100px;
    height: 100px;
    background-color: #f4c759;
    top: 140px;
    left: 205px;
    z-index: 11;
  }
  .Department4 {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    width: 90px;
    height: 90px;
    background-color: #75bddb;
    top: 180px;
    left: 130px;
    z-index: 10;
  }
}
</style>
