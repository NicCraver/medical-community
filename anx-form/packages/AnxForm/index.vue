<template>
  <div class="anxForm" :style="{ width: formConfig.width, margin: '0 auto' }">
    <el-form
      v-if="!isMobile"
      label-suffix=""
      :label-width="`${formConfig.labelWidth}px`"
      :label-position="formConfig.labelPosition"
      :size="formConfig.size"
      :rules="rules"
      :model="model"
      ref="anxForm"
      :disabled="disabled"
      @submit.native.prevent
      id="anx-form-container"
    >
      <template v-for="item in formComponentList">
        <template v-if="item.type === 'grid'">
          <el-row :gutter="item.options.gutter" :key="item.key">
            <el-col
              v-for="(colItem, colIndex) in item.columns"
              :span="colItem.span"
              :key="colIndex"
            >
              <div class="anx-form-col">
                <el-form-item
                  v-for="colFormItem in colItem.list"
                  :key="colFormItem.key"
                  :label="createFormItemAttr(colFormItem).labelText"
                  :label-width="createFormItemAttr(colFormItem).labelWidth"
                  :prop="colFormItem.model"
                >
                  <form-item
                    :formItem="colFormItem"
                    :model="model"
                    :formComponentList="formComponentList"
                    :updateFormItem="updateFormItem"
                  />
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-else-if="item.type === comTypeMap.customer">
          <template v-for="(cusComponentItem, cusComponentIndex) in item.list">
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
                    <el-form-item
                      :label="createFormItemAttr(colFormItem).labelText"
                      :label-width="createFormItemAttr(colFormItem).labelWidth"
                      :prop="colFormItem.model"
                    >
                      <form-item
                        :formItem="colFormItem"
                        :model="model"
                        :formComponentList="formComponentList"
                        :updateFormItem="updateFormItem"
                      />
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </template>

            <template v-else>
              <el-form-item
                :key="cusComponentItem.key"
                :label="createFormItemAttr(cusComponentItem).labelText"
                :label-width="createFormItemAttr(cusComponentItem).labelWidth"
                :prop="cusComponentItem.model"
              >
                <form-item
                  :formItem="cusComponentItem"
                  :model="model"
                  :formComponentList="formComponentList"
                  :updateFormItem="updateFormItem"
                />
              </el-form-item>
            </template>
          </template>
        </template>
        <template v-else-if="item.type === 'BMI'">
          <el-form-item
            :key="item.heightModel"
            :prop="item.heightModel"
            :label="'身高（cm）'"
          >
            <div>
              <el-input
                oninput="value=value.replace(/^\D*([1-9]\d*\.?\d{0,2})?.*$/,'$1')"
                style="width:200px;"
                v-model.number="model[item.heightModel]"
              />
            </div>
          </el-form-item>
          <el-form-item
            :key="item.weightModel"
            :prop="item.weightModel"
            :label="'体重（kg）'"
          >
            <div>
              <el-input
                style="width:200px;"
                oninput="value=value.replace(/^\D*([1-9]\d*\.?\d{0,2})?.*$/,'$1')"
                v-model.number="model[item.weightModel]"
              />
            </div>
          </el-form-item>
          <el-form-item :key="item.BMIModel" :label="'BMI（kg/cm²）'">
            <div style="padding-left:10px">
              {{
                comBMI(item.weightModel, item.heightModel, item.BMIModel)
                  ? comBMI(item.weightModel, item.heightModel, item.BMIModel)
                  : 0
              }}
            </div>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item
            :key="item.key"
            :label="createFormItemAttr(item).labelText"
            :label-width="createFormItemAttr(item).labelWidth"
            :prop="item.model"
            :id="item.id"
            :val="model[item.model]"
          >
            <form-item
              :formItem="item"
              :model="model"
              :formComponentList="formComponentList"
              :updateFormItem="updateFormItem"
              :parentId="item.id"
            />
          </el-form-item>
        </template>
      </template>
    </el-form>

    <van-form @submit="onSubmit" v-else>
      <VantForm
        :baseUrl="baseUrl"
        :disabled="disabled"
        :rules="rules"
        :model="model"
        :formComponentList="formComponentList"
        :updateFormItem="updateFormItem"
        :entryStatus="entryStatus"
      />
    </van-form>
    <div style="text-align: center;" v-if="formConfig.showNativeSave">
      <el-button type="primary" @click="formSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  judgeIsGrid,
  createLink,
  // createScript,
  loadAllScripts,
  removeScriptById,
  removeScriptBySrc,
  removeLinkByHref
} from 'utils';
import { comTypeMap } from 'utils/config';
import FormItem from './components/FormItem';
import VantForm from './components/VantForm';
import axios from 'axios';
export default {
  name: 'AnxForm',
  props: {
    entryStatus: {
      type: String,
      default: ''
    },
    // 远程下拉框接口baseUrl
    baseUrl: {
      type: String,
      default: ''
    },
    isMobile: {
      type: Boolean,
      required: false
    },
    anxFormData: {
      type: Object,
      required: true
    },
    echoData: Object,
    disabled: {
      type: Boolean,
      default: false
    },
    jsCode: String,
    scriptSrcList: {
      type: Array,
      default() {
        return [];
      }
    },
    apiFunSrc: String,
    linkHrefList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      rules: {},
      model: {},
      modelRepeatFlag: true,
      modelRepeatMsg: '',
      formComponentList: [],
      comTypeMap
    };
  },
  computed: {
    formConfig() {
      return JSON.parse(JSON.stringify(this.anxFormData.formConfig || {}));
    }
  },
  mounted() {
    // console.log(`this.baseUrl`, this.baseUrl);
    this.anxFormInit();
    // 页面插入link对应外链
    // this.linkHrefList
    //   .filter(item => item)
    //   .forEach(item => {
    //     createLink({
    //       href: item
    //     });
    //   });
    // this.insertScript();
    this.$nextTick(() => {
      this.tabInputFocus();
    });
    setTimeout(() => {
      this.getFormInitData();
      console.log('this.formComponentList', this.formComponentList);
    }, 1000);
  },
  beforeDestroy() {
    removeScriptById('CUS_JAVASCRTPT_CODE');
    this.scriptSrcList.forEach(item => {
      removeScriptBySrc(item);
    });
    this.linkHrefList.forEach(item => {
      removeLinkByHref(item);
    });
  },
  methods: {
    fnKeydownNative(e) {
      console.log('e', e);
    },
    onSubmit(values) {
      // let arr = [];
      // for (const key in values) {
      //   if (Object.hasOwnProperty.call(values, key)) {
      //     if (key === 'undefined') {
      //       arr.push(key);
      //     }
      //   }
      // }
      // arr.forEach(el => {
      //   console.log(`el`, el);
      //   delete values[el];
      // });
      console.log('submit', values);
      this.$emit('on-mobile-submit', values);
    },
    clearValidateForm() {
      this.$refs.anxForm.clearValidate();
    },
    getFormInitData() {
      let data = {};
      this.judgeFormItemType(formItem => {
        if (formItem.type === 'checkboxOther' || formItem.type === 'whether') {
          data[formItem.inputModel] = this.model[formItem.inputModel];
          data[formItem.model] = this.model[formItem.model];
        } else if (formItem.type === 'BMI') {
          data[formItem.heightModel] = this.model[formItem.heightModel] || '';
          data[formItem.weightModel] = this.model[formItem.weightModel] || '';
          data[formItem.BMIModel] = this.model[formItem.BMIModel];
        } else {
          data[formItem.model] = this.model[formItem.model];
        }
      });
      // console.log(`data`, data);
      return data;
    },
    // 保存提交
    formSubmit() {
      if (!this.modelRepeatFlag) {
        this.$message.error(this.modelRepeatMsg);
        return null;
      }
      // if (
      //   window.extraFormValidate &&
      //   typeof window.extraFormValidate === 'function'
      // ) {
      //   const result = window.extraFormValidate();
      //   if (!result.validate) {
      //     this.$message.error(result.msg || '校验信息不存在');
      //     return null;
      //   }
      // }
      let data = null;
      this.$refs.anxForm.validate(valid => {
        if (valid) {
          data = this.getFormInitData();
          this.$emit('form-submit', data);
        }
      });
      return data;
    },
    anxFormInit() {
      this.formComponentList = JSON.parse(
        JSON.stringify(this.anxFormData.formComponentList || [])
      );

      console.log('this.formComponentList', this.formComponentList);
      this.validateRepeatModel();
      if (this.modelRepeatFlag) {
        this.getRemoteOptions();
        this.echoFormByData();
        this.createModelAndRules();
      }
    },
    // 循环判断fromItem每一项，不同type做不同操作
    judgeFormItemType(cb) {
      this.formComponentList.forEach(item => {
        if (item.type === this.comTypeMap.customer) {
          judgeIsGrid(item.list, formItem => {
            cb(formItem);
          });
        } else {
          if (item.type === 'grid') {
            item.columns.forEach(colItem => {
              colItem.list.forEach(innerFormItem => {
                cb(innerFormItem);
              });
            });
          } else {
            cb(item);
          }
        }
      });
    },
    // 获取远程数据
    getRemoteOptions() {
      this.judgeFormItemType(formItem => {
        if (
          (formItem.type === 'select' || formItem.type === 'drug') &&
          !this.isMobile &&
          formItem.options.remote &&
          formItem.options.remoteURL &&
          !formItem.options.casModel.trim()
        ) {
          axios.get(this.baseUrl + formItem.options.remoteURL).then(res => {
            const options = res.data;
            formItem.options.remoteOptions = options.map(resItem => ({
              value: resItem[formItem.options.props.value],
              label: resItem[formItem.options.props.label]
            }));
          });
        }
      });
    },
    // 回填数据
    echoFormByData() {
      // console.log(`echoFormByData === this.echoData`, this.echoData);
      if (this.echoData && Object.keys(this.echoData).length) {
        this.judgeFormItemType(formItem => {
          const { model } = formItem;
          if (formItem.type === 'upload') {
            formItem.options.defaultValue = this.echoData[model] || [];
          } else if (
            formItem.type === 'checkboxOther' ||
            formItem.type === 'whether'
          ) {
            formItem.options.defaultValue = this.echoData[model] || [];
            formItem.inputDefaultValue =
              this.echoData[formItem.inputModel] || '';
          } else if (formItem.type === 'BMI') {
            formItem[formItem.heightModel] = this.echoData[
              formItem.heightModel
            ];
            formItem[formItem.weightModel] = this.echoData[
              formItem.weightModel
            ];
            formItem[formItem.BMIModel] = this.echoData[formItem.BMIModel];
          } else if (formItem.type === 'checkbox') {
            console.group('checkbox === ');
            // console.log('model', JSON.parse(JSON.stringify(model)));
            // console.log('formItem', JSON.parse(JSON.stringify(formItem)));
            // console.log('this.echoData[model]', this.echoData[model]);
            formItem.options.defaultValue = this.echoData[model] || [];
          } else {
            console.groupEnd();
            formItem.options.defaultValue =
              this.echoData[model] || formItem.options.defaultValue || '';
          }
        });
      }
    },
    // 创建form的model和rules
    createModelAndRules() {
      this.judgeFormItemType(formItem => {
        // console.log(`formItem`, formItem);
        if (formItem.type === 'checkboxOther' || formItem.type === 'whether') {
          this.$set(
            this.model,
            formItem.inputModel,
            formItem.inputDefaultValue
          );
        }
        if (formItem.type === 'BMI') {
          this.$set(this.model, formItem.BMIModel, formItem[formItem.BMIModel]);
          this.$set(
            this.model,
            formItem.heightModel,
            formItem[formItem.heightModel] || ''
          );
          this.$set(
            this.model,
            formItem.weightModel,
            formItem[formItem.weightModel] || ''
          );
          if (formItem.options.required) {
            this.rules[formItem.heightModel] = [
              {
                required: true,
                message: formItem.options.errorTips || formItem.name || '',
                trigger: 'change'
              }
            ];
            this.rules[formItem.weightModel] = [
              {
                required: true,
                message: formItem.options.errorTips || formItem.name || '',
                trigger: 'change'
              }
            ];
          }
        }
        this.$set(this.model, formItem.model, formItem.options.defaultValue);
        // console.log(
        //   `formItem.options.defaultValue`,
        //   formItem.options.defaultValue
        // );
        // console.log(`this.model`, this.model);
        if (formItem.type !== 'BMI' && formItem.options.required) {
          this.rules[formItem.model] = [
            {
              required: true,
              message: formItem.options.errorTips || formItem.name || '',
              trigger: 'change'
            }
          ];
        }
      });
    },
    // 页面加载成功后插入已经编写好的JS代码
    insertScript() {
      // this.$nextTick(() => {
      //   loadAllScripts(
      //     this.scriptSrcList.concat([this.apiFunSrc]).filter(item => item),
      //     () => {
      //       createScript({
      //         text: this.jsCode,
      //         id: 'CUS_JAVASCRTPT_CODE'
      //       });
      //     }
      //   );
      // });
    },
    // 校验是否存在重复字段
    validateRepeatModel() {
      // 创建检验是否字段重复的对象，以字段名为key，value为具有相同标题组成的数组
      const data = {};
      this.judgeFormItemType(formItem => {
        if (Object.prototype.hasOwnProperty.call(data, formItem.model)) {
          data[formItem.model].push(formItem.name);
        } else {
          data[formItem.model] = [formItem.name];
        }
      });
      for (const key in data) {
        if (data[key].length > 1) {
          this.modelRepeatFlag = false;
          this.modelRepeatMsg = `${data[key].join(',')}字段标识重复`;
          this.$message.error(this.modelRepeatMsg);
          break;
        }
      }
    },
    // 重新更新当前表单，主要用于关联下拉框改变时重新渲染
    updateFormItem(formComponentList) {
      this.formComponentList = formComponentList;
    },
    // 回车切换下一个输入框
    tabInputFocus() {
      const inputs = document.querySelectorAll(
        `#anx-form-container input[type='text'], #anx-form-container textarea`
      );
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].onkeydown = e => {
          if (e.keyCode === 13) {
            e.preventDefault();
          }
        };
        inputs[i].onkeyup = e => {
          if (e.keyCode === 13) {
            if (e.ctrlKey) {
              // 光标起始位置
              let pos = e.target.selectionStart;
              const newStr =
                e.target.value.slice(0, pos) + '\n' + e.target.value.slice(pos);
              e.target.value = newStr;
              e.target.blur();
              setTimeout(() => {
                e.target.focus();
                e.target.selectionStart = pos + 1;
                e.target.selectionEnd = pos + 1;
              });
            } else if (e.shiftKey && i !== 0) {
              inputs[i - 1].focus();
            } else if (!e.shiftKey && i + 1 !== inputs.length) {
              inputs[i + 1].focus();
            }
          }
        };
      }
    },
    // form-item样式
    createFormItemAttr(formItem) {
      const titleList = ['h1', 'h2', 'h3'];
      const noLabel =
        titleList.indexOf(formItem.type) > -1 ||
        (formItem.type === 'text' && !formItem.options.showTitle);
      return {
        labelText: noLabel ? '' : formItem.name,
        labelWidth: noLabel ? '0px' : formItem.width
      };
    },
    comBMI(weightModel, heightModel, BMIModel) {
      if (this.model[weightModel] === '' || this.model[heightModel] === '') {
        return '';
      }
      let a =
        this.model[weightModel] /
        ((this.model[heightModel] / 100) * (this.model[heightModel] / 100));
      let temp = Math.round(a * Math.pow(10, 1)) / Math.pow(10, 1);

      let bmi = isNaN(temp) ? 0 : temp;
      this.model[BMIModel] = JSON.stringify(bmi);

      return bmi;
    }
  },
  watch: {
    anxFormData() {
      this.anxFormInit();
    },
    echoData() {
      this.echoFormByData();
      this.createModelAndRules();
    },
    jsCode() {
      removeScriptById('CUS_JAVASCRTPT_CODE');
      // createScript({
      //   text: this.jsCode,
      //   id: 'CUS_JAVASCRTPT_CODE'
      // });
    },
    scriptSrcList(newVal, oldVal) {
      oldVal.forEach(item => {
        removeScriptBySrc(item);
      });
      loadAllScripts(
        this.scriptSrcList.filter(item => item),
        () => {}
      );
    },
    apiFunSrc(newVal, oldVal) {
      removeScriptBySrc(oldVal);
      // createScript({
      //   src: newVal
      // });
    },
    linkHrefList(newVal, oldVal) {
      oldVal.forEach(item => {
        removeLinkByHref(item);
      });
      this.linkHrefList
        .filter(item => item)
        .forEach(item => {
          createLink({
            href: item
          });
        });
    }
  },
  components: {
    FormItem,
    VantForm
  }
};
</script>

<style lang="scss" scoped>
.anxForm {
  padding: 20px;
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
