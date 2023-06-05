<template>
  <div class="emrCom">
    <template v-if="contList && contList.length">
      <div class="title-cont">
        <el-row :gutter="20">
          <el-col
            :span="item.span || 8"
            class="overflow-point"
            v-for="(item, index) in titleList"
            :key="index"
          >
            <span class="labelCls">{{ item.label }}</span>
            <span class="valueCls" :title="item.value">
              {{ item.value }}
            </span>
          </el-col>
        </el-row>
      </div>
      <div class="cont">
        <div class="cont-item" v-for="(item, index) in contList" :key="index">
          <div class="title-name">{{ item.title }}</div>
          <el-row class="detail-list">
            <el-col
              :span="val.span"
              class="detail-item"
              :class="{ 'overflow-point': val.span != 24 }"
              :style="val.style"
              v-for="(val, key) in item.children"
              :key="key"
            >
              <span class="labelCls">{{ val.label }}</span>
              <span class="valueCls" :title="val.value">
                {{ val.value || "--" }}
              </span>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="emptyBox">
        <IconSvg
          iconClass="empty-box"
          style="color: #cacdd4"
          width="80"
          height="80"
        ></IconSvg>
        <div class="emptyText">暂无数据</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "emrCom",
  props: {
    titleList: {
      type: Array,
      default() {
        return [];
      },
    },
    contList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {},
  data() {
    return {};
  },
  watch: {
    aaa: {
      handler(val) {},
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.emrCom {
  height: 100%;
  .title-cont {
    padding: 0 8px;
    line-height: 40px;
  }
  .cont {
    .cont-item {
      .title-name {
        height: 40px;
        padding-left: 8px;
        line-height: 40px;
        background-color: rgba(247, 247, 247, 100);
        color: #333;
        font-weight: 600;
        font-size: 16px;
        font-family: SourceHanSansSC-medium;
      }
      .detail-list {
        padding: 0 10px;
        font-size: 14px;
        font-family: SourceHanSansSC-regular;
        .detail-item {
          padding: 10px 0;
          border-bottom: 1px dashed rgba(233, 233, 233, 100);
        }
      }
    }
  }
  .labelCls {
    color: rgba(145, 145, 145, 100);
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
  }
  .valueCls {
    color: #333333;
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
  }
  .emptyBox {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .emptyText {
      color: #88898e;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
    }
  }
}
</style>