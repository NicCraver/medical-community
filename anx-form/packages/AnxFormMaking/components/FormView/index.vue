<template>
  <div class="form-view">
    <ul class="form-component-list" :style="{ width: formConfig.width }">
      <el-form
        label-suffix=""
        :label-width="`${formConfig.labelWidth}px`"
        :label-position="formConfig.labelPosition"
        :size="formConfig.size"
      >
        <draggable
          :list="formComponentList"
          v-bind="{ group: 'people', ghostClass: 'ghost' }"
          style="min-height: 600px"
          @add="handleAdd"
        >
          <template v-for="(formItem, formItemIndex) in formComponentList">
            <template v-if="formItem.type === 'grid'">
              <div
                :class="['anx-col', { active: activeCom.key === formItem.key }]"
                :key="formItemIndex"
                @click="setActiveCom(formItem)"
              >
                <el-row :gutter="formItem.options.gutter">
                  <el-col
                    v-for="(colItem, colIndex) in formItem.columns"
                    :span="colItem.span"
                    :key="colIndex"
                  >
                    <div class="anx-form-col">
                      <draggable
                        :list="colItem.list"
                        v-bind="{
                          group: 'people',
                          ghostClass: 'ghost'
                        }"
                        class="draggable"
                        @add="handleColAdd($event, colItem, formItem, colIndex)"
                        style="min-height: 60px"
                      >
                        <form-item
                          v-for="colFormItem in colItem.list"
                          :formItem="colFormItem"
                          :key="colFormItem.key"
                          :activeList="colItem.list"
                        />
                      </draggable>
                    </div>
                  </el-col>
                </el-row>
                <div
                  class="operate"
                  v-if="activeCom.key === formItem.key"
                  @click="deleteCurr($event)"
                >
                  <i class="icon el-icon-delete"></i>
                </div>
              </div>
            </template>
            <template v-else-if="formItem.type === comTypeMap.customer">
              <div
                :class="['anx-col', { active: activeCom.key === formItem.key }]"
                :key="formItemIndex"
                @click="setActiveCom(formItem)"
              >
                <template
                  v-for="(cusComponentItem, cusComponentIndex) in formItem.list"
                >
                  <template v-if="cusComponentItem.type === 'grid'">
                    <el-row
                      :gutter="cusComponentItem.options.gutter"
                      :key="cusComponentIndex"
                    >
                      <el-col
                        v-for="(colItem, colIndex) in cusComponentItem.columns"
                        :span="colItem.span"
                        :key="colIndex"
                      >
                        <div class="anx-form-col">
                          <form-item
                            v-for="colFormItem in colItem.list"
                            :formItem="colFormItem"
                            :key="colFormItem.key"
                            :comType="comTypeMap.customer"
                          />
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                  <template v-else>
                    <form-item
                      :formItem="cusComponentItem"
                      :key="cusComponentItem.key"
                      :comType="comTypeMap.customer"
                    />
                  </template>
                </template>

                <div
                  class="operate"
                  v-if="activeCom.key === formItem.key"
                  @click="deleteCurr($event)"
                >
                  <i class="icon el-icon-delete"></i>
                </div>
              </div>
            </template>
            <template v-else>
              <form-item
                :formItem="formItem"
                :key="formItem.key"
                :activeList="formComponentList"
              />
            </template>
          </template>
        </draggable>
      </el-form>
    </ul>
    <Preview :anxFormData="anxFormData" />
    <CusCom @create-cus-com="createCusCom" />
    <!-- <JsCode @save-code="saveCode" /> -->
    <api-fun />
  </div>
</template>

<script>
import { judgeIsGrid, extendExtraKeys } from 'utils';
import draggable from 'vuedraggable';
import FormItem from '../FormItem';
import Preview from './Preview';
// import JsCode from './JsCode';
import CusCom from './CusCom';
import ApiFun from './ApiFun';

export default {
  name: 'FormView',
  props: {
    clearForm: Function
  },
  inject: [
    'formConfig',
    'activeItemInfo',
    'formComponentList',
    'cusComponents',
    'comTypeMap'
  ],
  computed: {
    activeCom() {
      return this.activeItemInfo.activeCom || {};
    },
    anxFormData() {
      return JSON.parse(
        JSON.stringify({
          formComponentList: this.formComponentList,
          formConfig: this.formConfig
        })
      );
    }
  },
  methods: {
    setActiveCom(formItem) {
      this.activeItemInfo.setActiveCom(formItem);
    },
    // 表单组件外层拖动新增后的回调（更新formComponentList)
    handleAdd(evt) {
      const newIndex = evt.newIndex;
      // 如果是自定义的业务组件存在key值相同的问题，这里重新赋值key
      if (evt.clone.className.indexOf('cus-components') > -1) {
        const assignComponentList = this.formComponentList[newIndex].list;
        judgeIsGrid(assignComponentList, item => {
          item.key += new Date().getTime();
        });
      }
      const newFormItem = JSON.parse(
        JSON.stringify({
          ...this.formComponentList[newIndex],
          ...extendExtraKeys(this.formComponentList[newIndex].type)
        })
      );
      this.activeItemInfo.setActiveCom(newFormItem);
      this.$set(this.formComponentList, newIndex, newFormItem);
      console.log('this.formComponentList', this.formComponentList);
    },
    // 表单组件栅格拖动新增后的回调（更新formComponentList)
    handleColAdd($event, colItem, row, colIndex) {
      const newIndex = $event.newIndex;
      const newFormItem = {
        ...JSON.parse(JSON.stringify(row.columns[colIndex].list[newIndex])),
        ...extendExtraKeys(row.columns[colIndex].list[newIndex].type)
      };
      this.activeItemInfo.setActiveCom(newFormItem);
      this.$set(row.columns[colIndex].list, newIndex, newFormItem);
    },
    // 删除当前选中组件
    deleteCurr(e) {
      e.stopPropagation();
      this.activeItemInfo.deleteActiveCom(
        this.formComponentList,
        this.activeCom
      );
    },
    // 中间传递一层save-code事件
    saveCode(codeInfo) {
      this.$emit('save-code', codeInfo);
    },
    // 中间传递一层create-cus-com事件
    createCusCom(cusComData) {
      this.$emit('create-cus-com', cusComData);
    }
  },
  components: {
    draggable,
    FormItem,
    Preview,
    // JsCode,
    CusCom,
    ApiFun
  }
};
</script>

<style lang="scss" scoped>
.form-view {
  overflow: hidden;
  flex: 1;
  background: #eee;
  .form-component-list {
    margin: 10px auto;
    background: #fff;
    height: 100%;
    padding: 10px 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    box-shadow: 0 0 10px #ddd;
    overflow: auto;
    .anx-col {
      padding: 10px;
      position: relative;
      &.active {
        border: 1px solid #e6a23c;
      }
      .operate {
        position: absolute;
        bottom: 0;
        right: 0;
        background: #e6a23c;
        color: #fff;
        cursor: pointer;
        padding: 1px 10px;
        z-index: 2;
      }
      .anx-form-col {
        box-sizing: border-box;
        min-height: 200px;
        border: 1px dashed #ccc;
      }
    }
  }

  ::v-deep h1 {
    font-size: 30px !important;
    font-weight: 550;
    margin-bottom: 10px;
  }
  ::v-deep h2 {
    border-left: 3px solid #446abd;
    padding-left: 5px;
    font-size: 18px !important;
    font-weight: 550;
    height: 20px;
    line-height: 20px;
  }
  // ::v-deep.el-input {
  //   width: 200px;
  // }
  // ::v-deep.el-select {
  //   width: 200px;
  // }
  ::v-deep.el-date-editor {
    width: 300px;
  }
  ::v-deep.el-form-item__label {
    background: #f1f4f6;
    width: 100%;
    padding-left: 5px;
    line-height: 30px;
    height: 30px;
    margin-bottom: 5px;
    color: #000;
  }
  ::v-deep.el-col-24 {
    padding: 10px 10px 5px 10px;
    border: 1px solid #f1f4f6;
    margin-bottom: 20px;
  }
}
</style>
