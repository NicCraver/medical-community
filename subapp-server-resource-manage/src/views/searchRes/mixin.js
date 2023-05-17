import { getQualityControlList } from "api/basicConfig";
export default {
  data() {
    return {
      tableData: [],
      total: 0,
    };
  },
  methods: {
    // 获取质控方案列表
    getList(param, fn) {
      this.loading = true;
      getQualityControlList(param)
        .then(({ code, result, total }) => {
          if (code === 0) {
            this.tableData = result;
            this.total = total;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      fn && fn(this.tableData);
    },
    // 去往区域质控界面
    gotoAreaFuc(arr, pathName) {
      let planIdArr = arr.map((item) => {
        return item.id;
      });
      planIdArr = planIdArr ? planIdArr : [];
      this.$store.commit("SET_RULEPLANIDLIST", planIdArr.join(","));
      this.$router.push({
        path: `/${pathName}/overview`,
      });
    },
  },
};
