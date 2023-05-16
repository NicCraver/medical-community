<template>
  <div>
    <!-- {{ rules }} -->
    <div v-for="(item, i) in formComponentList" :key="i">
      <template v-if="item.type === 'grid'">
        <div
          class="typeGrid"
          v-for="(columnsItem, columnsIndex) in item.columns"
          :key="columnsIndex"
        >
          <div
            v-for="(cusComponentItem, cusComponentIndex) in columnsItem.list"
            :key="cusComponentIndex"
          >
            <VantFormItem
              :baseUrl="baseUrl"
              :disabled="disabled"
              :formItem="cusComponentItem"
              :rules="rules"
              :model="model"
              :isLast="cusComponentIndex === columnsItem.list.length - 1"
            />
          </div>
        </div>
      </template>
      <template v-else-if="item.type === 'cusComponent'">
        <div
          v-for="(cusComponentItem, cusComponentIndex) in item.list"
          :key="cusComponentIndex"
        >
          <VantFormItem
            :baseUrl="baseUrl"
            :disabled="disabled"
            :formItem="cusComponentItem"
            :rules="rules"
            :model="model"
          />
        </div>
      </template>
      <template v-else>
        <VantFormItem
          :baseUrl="baseUrl"
          :disabled="disabled"
          :formItem="item"
          :rules="rules"
          :model="model"
        />
      </template>
    </div>
    <div style="margin: 16px;">
      <van-button
        v-if="!disabled"
        :disabled="entryStatus === '3'"
        round
        block
        type="info"
        native-type="submit"
      >
        提交
      </van-button>
    </div>
  </div>
</template>

<script>
import VantFormItem from './VantFormItem.vue';
export default {
  props: {
    baseUrl: String,
    disabled: Boolean,
    entryStatus: String,
    model: Object,
    formItem: Object,
    formComponentList: Array,
    updateFormItem: Function,
    parentId: String,
    rules: Object
  },
  components: {
    VantFormItem
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.typeGrid {
  padding: 10px 10px 0 10px;
  border-radius: 8px !important;
  background-color: #fff;
  margin-bottom: 10px;
}
</style>
