<template>
  <el-row
    class="row"
    :style="{ 'white-space': isCollpase ? 'nowrap' : 'wrap' }"
  >
    <div class="row-title">
      <template v-if="titleCode">
        <!-- 需要数据字典反显 -->
        <span v-for="(item, index) in titleList" :key="index">
          <span v-codeTransform :code="titleCode" :val="item"></span>
          <span v-if="index !== titleList.length - 1">,</span>
        </span>
        {{ connectMark }}
      </template>
      <template v-else>{{ title }}{{ connectMark }}</template>
      <slot name="title"></slot>
    </div>
    <div :class="valueCls()">
      <template v-if="code">
        <!-- 需要数据字典反显 -->
        <span v-for="(item, index) in valueList" :key="index">
          <span v-codeTransform :code="code" :val="item"></span>
          <span v-if="index !== valueList.length - 1">,</span>
        </span>
      </template>
      <template v-else>
        <span :title="isCollpase ? value : ''">{{ valueShow(value) }}</span>
      </template>
      <slot name="value"></slot>
    </div>
  </el-row>
</template>

<script type="text/ecmascript-6">
export default {
  name: "dispalyCell",
  props: {
    title: {
      default: "",
    },
    value: {
      default: "",
    },
    titleCode: {
      default: "",
    },
    code: {
      default: "",
    },
    // 连接符号
    connectMark: {
      default: "",
    },
    specialMark: {
      type: Boolean,
      default: false,
    },
    isCollpase: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    valueList() {
      let value = this.value;
      if (value.indexOf(",") < -1) {
        return [value];
      }
      return value.split(",");
    },
    titleList() {
      let value = this.title;
      if (value.indexOf(",") < -1) {
        return [value];
      }
      return value.split(",");
    },
  },
  methods: {
    valueCls() {
      return {
        textEllipsis: this.isCollpase ? true : false,
        "row-value": true,
        specialMark: this.specialMark,
      };
    },
    valueShow(value) {
      if (value === "") {
        return "";
      } else if (value === null || value === undefined) {
        return "--";
      } else {
        return value;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.row {
  display: flex;
  // white-space: nowrap;
  .row-title {
    color: $l-color-fontcolor-4;
  }
  .row-value {
    flex: 1;
    padding-right: 5px;
    color: #333333;
  }
  .specialMark {
    color: $l-color-fontcolor-5;
  }
  .textEllipsis {
    overflow: hidden;
    text-overflow: ellipsis; //文本溢出显示省略号
    white-space: nowrap; //文本不会换行
  }
}
</style>
