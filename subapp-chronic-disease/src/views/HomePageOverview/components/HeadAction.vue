<template>
  <div class="head-action">
    <div>{{ title }}</div>
    <div class="actions">
      <el-radio-group v-model="radioGroup" v-if="hasBtn">
        <el-radio-button label="1" @change="radioChange">科室</el-radio-button>
        <el-radio-button label="2" @change="radioChange">病种</el-radio-button>
      </el-radio-group>

      <el-select
        v-model="value"
        clearable
        @change="dateChange"
        v-if="hasSelect"
      >
        <el-option label="本周" value="1"> </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    hasBtn: {
      type: Boolean,
      default: false,
    },
    hasSelect: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      value: "1",
      radioGroup: "1",
    };
  },
  methods: {
    dateChange(e) {
      console.log(`dateChange`, e);
    },
    checkboxChange(e) {
      console.log(`checkboxChange`, e);
    },
  },
};
</script>

<style lang="scss" scoped>
.head-action {
  display: flex;
  justify-content: space-between;
  color: rgba(16, 16, 16, 100);
  align-items: center;
  font-size: 16px;
  .el-select {
    margin-left: 20px;
    width: 120px;
  }
  .actions {
    display: flex;
    align-items: center;
  }
  ::v-deep.el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    background-color: #5D76D9;
    border-color: #5D76D9;
    box-shadow: -1px 0 0 0 #5D76D9;
  }
}
</style>
