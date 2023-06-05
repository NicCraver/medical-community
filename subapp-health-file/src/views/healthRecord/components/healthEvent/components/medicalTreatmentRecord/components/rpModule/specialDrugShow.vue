<template>
  <div class="page">
    <!-- 非抗菌药物编码为0的时候不显示 -->
    <span
      v-if="
        data.kjywdj !== undefined && data.kjywdj != 0 && drugShow(data.kjywdj)
      "
      class="cionCls"
      >{{ drugShow(data.kjywdj) }}</span
    >
    <span v-if="data.jbywbz == 1" class="cionCls">基</span>
    <!-- <span class="cionCls">毒</span> -->
    <span v-if="data.mzywbz == 1" class="cionCls">麻</span>
    <span v-if="data.jsywbz == 1" class="cionCls">精</span>
  </div>
</template>

<script type="text/ecmascript-6">
// 0非抗菌药物，11一级,12二级，13三级
const drug = [
  {
    code: 0,
    value: "非抗菌药物",
  },
  {
    code: 11,
    value: "一级",
  },
  {
    code: 12,
    value: "二级",
  },
  {
    code: 13,
    value: "三级",
  },
];

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    drugShow(value) {
      let result = drug.find((item) => item.code == value);
      result = result ? result.value : "";
      return result;
    },
  },
};
</script>

<style scoped lang="scss">
.cionCls {
  height: 16px;
  line-height: 17px;
  border-radius: 3px;
  color: #5e84d7;
  font-size: 12px;
  text-align: center;
  font-family: Roboto;
  border: 1px solid rgba(94, 132, 215, 100);
  padding: 0 8px;
}

.cionCls + .cionCls {
  margin-left: 5px;
}
</style>
