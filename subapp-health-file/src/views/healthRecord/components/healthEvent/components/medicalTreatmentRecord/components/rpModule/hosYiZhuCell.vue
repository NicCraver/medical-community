<template>
  <div class="page">
    <span> showMethods() </span>
  </div>
</template>

<script type="text/ecmascript-6">
// 1	长期（在院）
// 2	临时（在院）
// 3	出院带药
// 9	其他

export default {
  props: {
    // 健康档案
    code: {
      type: [String, Number],
      default() {
        return "99999";
      }
    },
    value: {
      type:  [String, Number],
      default() {
        return "99999";
      }
    }
  },
  data() {
    return {
      yzlbList: [
        {
          code: 1,
          value: "长期（在院）"
        },
        {
          code: 2,
          value: "临时（在院）"
        },
        {
          code: 3,
          value: "出院带药"
        },
        {
          code: 9,
          value: "其他"
        }
      ]
    };
  },
  components: {},
  methods: {
    showMethods() {
      if (code == "yzlb") {
          if (this.value !== "99999") {
            //   this.yzlbList.find(item)
          }
          
      } else {
        
      }
    }
  }
};
</script>

<style scoped lang="scss">
</style>
