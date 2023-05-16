<template>
  <div class="anx-form-container">
    <div class="anx-form-header">
      <div class="name">
        <svg
          t="1593592594351"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3475"
          width="40"
          height="40"
          style="vertical-align: middle;margin-right: 5px"
        >
          <path
            d="M512 512m-490.666667 0a490.666667 490.666667 0 1 0 981.333334 0 490.666667 490.666667 0 1 0-981.333334 0Z"
            fill="#E9F4FF"
            p-id="3476"
          ></path>
          <path
            d="M332.8 746.666667h290.133333l119.466667-119.466667V268.8a34.133333 34.133333 0 0 0-34.133333-34.133333H332.8a34.133333 34.133333 0 0 0-34.133333 34.133333v443.733333a34.133333 34.133333 0 0 0 34.133333 34.133334z"
            fill="#00A1FF"
            p-id="3477"
          ></path>
          <path
            d="M589.162667 450.56l-183.573334 183.573333 2.56 45.738667 45.717334 2.538667 183.552-183.573334-48.256-48.256z m12.053333-12.053333l48.277333 48.277333 24.128-24.149333a16.896 16.896 0 0 0 0-24.128l-24.106666-24.128a16.896 16.896 0 0 0-24.149334 0l-24.149333 24.106666z"
            fill="#E9F4FF"
            p-id="3478"
          ></path>
          <path
            d="M622.933333 746.666667l119.466667-119.466667h-76.8a42.666667 42.666667 0 0 0-42.666667 42.666667V746.666667z"
            fill="#96D8FF"
            p-id="3479"
          ></path>
          <path
            d="M362.666667 298.666667m21.333333 0l192 0q21.333333 0 21.333333 21.333333l0 0q0 21.333333-21.333333 21.333333l-192 0q-21.333333 0-21.333333-21.333333l0 0q0-21.333333 21.333333-21.333333Z"
            fill="#E9F4FF"
            p-id="3480"
          ></path>
          <path
            d="M362.666667 384m21.333333 0l106.666667 0q21.333333 0 21.333333 21.333333l0 0q0 21.333333-21.333333 21.333334l-106.666667 0q-21.333333 0-21.333333-21.333334l0 0q0-21.333333 21.333333-21.333333Z"
            fill="#E9F4FF"
            p-id="3481"
          ></path>
        </svg>
        表单设计器
      </div>
      <div class="form-operate">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          size="mini"
          v-if="showBack"
          @click="goBack"
          >返回</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-view"
          size="mini"
          @click="showPriview"
          >预览</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-document"
          size="mini"
          @click="createJson"
          >保存模板</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-document-checked"
          size="mini"
          @click="showCusCom"
          >业务组件保存</el-button
        >
        <!-- <el-button
            type="primary"
            icon="el-icon-edit-outline"
            size="mini"
            @click="showJsCode"
            >JS代码编写</el-button
          > -->
        <el-button
          type="primary"
          icon="el-icon-delete"
          size="mini"
          @click="clearForm"
          >清空</el-button
        >
      </div>
    </div>
    <div class="anx-form-body">
      <form-catalog
        @addFormItem="handleItemClick"
        :basicComponents="basicComponents"
        :layoutComponents="layoutComponents"
      />
      <form-view
        :clearForm="clearForm"
        @create-cus-com="createCusCom"
        @save-code="saveCode"
      />
      <config-container />
    </div>
  </div>
</template>
<script>
import {
  extendExtraKeys,
  judgeIsGrid
  // createScript
} from 'utils';
import {
  defaultFormConfig,
  basicComponents,
  layoutComponents,
  comTypeMap
} from 'utils/config';
import eventBus from 'utils/event-bus';
import FormCatalog from './components/FormCatalog';
import FormView from './components/FormView';
import ConfigContainer from './components/ConfigContainer';

// const cdnSrc = [
//   'https://cdn.bootcdn.net/ajax/libs/ace/1.4.6/ace.js',
//   'https://cdn.bootcdn.net/ajax/libs/ace/1.4.6/ext-beautify.js',
//   'https://cdn.bootcdn.net/ajax/libs/ace/1.4.6/ext-language_tools.js',
//   'https://cdn.bootcdn.net/ajax/libs/ace/1.4.6/mode-javascript.js',
//   'https://cdn.bootcdn.net/ajax/libs/ace/1.4.6/theme-xcode.js'
// ];

export default {
  name: 'AnxFormMaking',
  components: {
    FormCatalog,
    FormView,
    ConfigContainer
  },
  props: {
    width: String,
    size: String,
    labelPosition: String,
    labelWidth: String,
    anxFormData: Object,
    cusComponents: Array,
    showBack: {
      type: Boolean,
      default: false
    },
    jsCode: {
      type: String,
      default: ''
    },
    linkHrefList: {
      type: Array,
      default() {
        return [];
      }
    },
    baseUrl: {
      type: String
    },
    httpDomain: {
      type: String,
      // required: true,
      default: ''
    },
    scriptSrcList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  provide() {
    return {
      activeItemInfo: this.activeItemInfo,
      formConfig: this.formConfig,
      formComponentList: this.formComponentList,
      cusComponents: this.selfCusComponents,
      comTypeMap: this.comTypeMap,
      httpDomain: this.httpDomain,
      baseUrl: this.baseUrl
    };
  },
  data() {
    return {
      activeItemInfo: {
        activeCom: null,
        setActiveCom: formItem => {
          console.log('formItem1111111111', formItem);
          this.activeItemInfo.activeCom = formItem;
        },
        deleteActiveCom: (activeList, activeCom) => {
          const index = activeList.findIndex(
            item => item.key === activeCom.key
          );
          activeList.splice(index, 1);
          if (activeList.length === 0) {
            this.activeItemInfo.setActiveCom(null);
            return;
          } else if (activeList.length === index) {
            this.activeItemInfo.setActiveCom(activeList[index - 1]);
          } else {
            this.activeItemInfo.setActiveCom(activeList[index]);
          }
        }
      },
      formComponentList: [],
      formConfig: defaultFormConfig,
      basicComponents,
      layoutComponents,
      comTypeMap,
      selfCusComponents: [],
      returnList: []
    };
  },
  mounted() {
    // cdnSrc.forEach(item => {
    //   createScript({
    //     src: item
    //   });
    // });
    console.log(
      `%c${process.env.UPDATE_VERSION}`,
      'font-size:20px;color:#f5222d;'
    );
    this.createFormData();
  },
  methods: {
    goBack() {
      this.$router && this.$router.go(-1);
    },
    // 创建 需要返回的字段
    createReturnList(callback) {
      this.returnList = [];
      for (let i = 0; i < this.formComponentList.length; i++) {
        const el = this.formComponentList[i];
        if (el.type === 'cusComponent') {
          el.list.forEach(_ => {
            console.log('_', JSON.parse(JSON.stringify(_)));
            this.returnList.push({
              name: _.name,
              key: _.model
            });
          });
        } else if (el.type === 'grid') {
          for (let j = 0; j < el.columns.length; j++) {
            const grids = el.columns[j];
            for (let k = 0; k < grids.list.length; k++) {
              const grid = grids.list[k];
              this.returnList.push({
                name: grid.name,
                key: grid.model
              });
            }
          }
        } else if (el.type === 'BMI') {
          console.log('BMI', JSON.parse(JSON.stringify(el)));
          this.returnList.push({
            name: '身高',
            key: el.heightModel
          });

          this.returnList.push({
            name: '体重',
            key: el.weightModel
          });

          this.returnList.push({
            name: 'BMI',
            key: el.BMIModel
          });
        } else if (el.type === 'h1') {
        } else {
          this.returnList.push({
            name: el.name,
            key: el.model
          });
        }
      }
      console.log(
        'this.returnList',
        JSON.parse(JSON.stringify(this.returnList))
      );
      callback();
    },
    createFormData() {
      if (this.anxFormData && Object.keys(this.anxFormData).length) {
        this.anxFormData.formComponentList.forEach(item => {
          this.formComponentList.push(item);
        });
        for (const key in this.anxFormData.formConfig) {
          this.formConfig[key] = this.anxFormData.formConfig[key];
        }
      }
      for (const key in this.formConfig) {
        this.formConfig[key] = this[key] ? this[key] : this.formConfig[key];
      }
    },
    handleItemClick({ formItem }) {
      if (formItem.type === this.comTypeMap.customer) {
        // 如果是自定义的业务组件存在key值相同的问题，这里重新赋值key
        judgeIsGrid(formItem.list, item => {
          item.key += new Date().getTime();
        });
      }
      let activeIndex = -1;
      if (this.activeItemInfo.activeCom) {
        activeIndex = this.formComponentList.findIndex(
          item => item.key === this.activeItemInfo.activeCom.key
        );
      }
      const extra = extendExtraKeys(formItem.type);
      console.log('extra', extra);
      this.activeItemInfo.setActiveCom({
        ...JSON.parse(JSON.stringify(formItem)),
        ...extra
      });
      this.formComponentList.splice(
        activeIndex + 1,
        0,
        this.activeItemInfo.activeCom
      );
    },

    createCusCom(cusComData) {
      this.$emit('createCusCom', cusComData);
    },
    saveCode(codeInfo) {
      this.$emit('save-code', codeInfo);
    },
    showPriview() {
      eventBus.$emit('[global/showPriview]');
    },
    createJson() {
      this.createReturnList(() => {
        this.$emit('create-json', {
          formComponentList: this.formComponentList,
          formConfig: this.formConfig,
          returnList: this.returnList
        });
      });
    },
    showCusCom() {
      eventBus.$emit('[global/showCusCom]');
    },
    showJsCode() {
      eventBus.$emit('[global/showJsCode]', {
        jsCode: this.jsCode,
        linkHrefList: this.linkHrefList,
        scriptSrcList: this.scriptSrcList
      });
    },
    clearForm() {
      this.formComponentList.splice(0, this.formComponentList.length);
      this.activeItemInfo.setActiveCom(null);
    }
  },
  watch: {
    anxFormData() {
      this.createFormData();
    },
    cusComponents: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log('newVal', newVal);
        this.selfCusComponents.splice(
          0,
          this.selfCusComponents.length,
          ...newVal
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.anx-form-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .anx-form-header {
    border-bottom: 1px solid #e1e1e1;
    height: 60px;
    display: flex;
    line-height: 60px;

    .name {
      width: 240px;
      padding-left: 20px;
      box-sizing: border-box;
      font-size: 18px;
    }

    .form-operate {
      padding-right: 20px;
      flex: 1;
      text-align: right;
    }
  }

  .anx-form-body {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
  }
}
</style>
