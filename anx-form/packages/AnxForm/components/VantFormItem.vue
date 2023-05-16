<template>
  <div class="VantFormItem">
    <template v-if="formItem.type === 'h2'">
      <div class="title">
        <div class="line"></div>
        <div>{{ formItem.name }}</div>
      </div>
    </template>
    <template v-if="formItem.type === 'text' && formItem.options.showTitle">
      <van-field
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        input-align="right"
        v-model="model[formItem.model]"
        :name="formItem.model"
        :label="formItem.name"
        :disabled="disabled"
      >
      </van-field>
    </template>
    <template v-if="formItem.type === 'text' && !formItem.options.showTitle">
      <div style="padding-bottom: 8px">
        {{ model[formItem.model] }}
      </div>
    </template>
    <template v-if="formItem.type === 'input'">
      <van-field
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        input-align="right"
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        :name="formItem.model"
        :label="formItem.name"
        :rules="[
          {
            required:
              rules[formItem.model] &&
              rules[formItem.model][0] &&
              rules[formItem.model][0].required
          }
        ]"
        :disabled="disabled"
      />
    </template>
    <template v-if="formItem.type === 'textarea'">
      <van-collapse v-if="formItem.name === '健康指导'" v-model="activeNames">
        <van-collapse-item :title="formItem.name" name="1">
          <span style="color: #333">{{ model[formItem.model] }}</span>
        </van-collapse-item>
      </van-collapse>
      <van-field
        v-show="formItem.name !== '健康指导'"
        :class="isLast ? '' : 'form-cell'"
        autosize
        type="textarea"
        :label-width="labelWidth"
        input-align="right"
        v-model="model[formItem.model]"
        v-bind="formItem.options"
        :name="formItem.model"
        :label="formItem.name"
        :rules="[
          {
            required:
              rules[formItem.model] &&
              rules[formItem.model][0] &&
              rules[formItem.model][0].required
          }
        ]"
        :show-error-message="false"
        :disabled="disabled"
      />
    </template>
    <template v-if="formItem.type === 'date'">
      <van-field
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        v-bind="formItem.options"
        v-model="model[formItem.model]"
        input-align="right"
        @click="openCheckboxOther()"
        :rules="rules[formItem.model]"
        error-message-align="right"
        :disabled="disabled"
      >
        <template #input>
          <div :style="disabled ? 'color:#333' : ''">
            {{ tempCheckboxOtherVal }}
          </div>
        </template>
      </van-field>
      <van-popup
        v-model="showCheckboxOther"
        round
        position="bottom"
        :style="{ height: '40%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          title="选择年月日"
          @confirm="dateConfirm"
          @cancel="showCheckboxOther = false"
        />
      </van-popup>
    </template>
    <template
      v-if="formItem.type === 'radio' && formItem.mobileType !== 'select'"
    >
      <van-field
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        v-bind="formItem.options"
        :class="isLast ? '' : 'form-cell'"
        :rules="rules[formItem.model]"
        error-message-align="right"
        input-align="right"
        :disabled="disabled"
      >
        <template #input>
          <van-radio-group
            v-model="model[formItem.model]"
            direction="horizontal"
            :disabled="disabled"
          >
            <van-radio
              class="pb"
              v-for="(child, index) of formItem.options.options"
              :key="index"
              :name="child.value"
            >
              {{ child.label }}
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </template>
    <template
      v-if="formItem.type === 'checkbox' && formItem.mobileType !== 'select'"
    >
      <van-field
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        v-bind="formItem.options"
        :class="isLast ? '' : 'form-cell'"
        :rules="rules[formItem.model]"
        error-message-align="right"
        input-align="right"
        :disabled="disabled"
      >
        <template #input>
          <van-checkbox-group
            v-model="model[formItem.model]"
            direction="horizontal"
            :disabled="disabled"
          >
            <van-checkbox
              class="pb"
              v-for="(child, index) of formItem.options.options"
              :key="index"
              :name="child.value"
            >
              {{ child.label }}
            </van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
    </template>
    <template v-if="formItem.type === 'checkboxOther'">
      <van-field
        :class="isLast ? '' : isOther ? '' : 'form-cell'"
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        v-bind="formItem.options"
        :rules="rules[formItem.model]"
        input-align="right"
        error-message-align="right"
        @click="openCheckboxOther()"
        :disabled="disabled"
      >
        <template #input>
          <van-checkbox-group
            v-model="model[formItem.model]"
            direction="horizontal"
          >
          </van-checkbox-group>
          <div :style="disabled ? 'color:#333' : ''">
            {{ tempCheckboxOtherVal }}
          </div>
        </template>
      </van-field>
      <!-- left-icon="records" -->
      <van-field
        v-if="isOther"
        type="textarea"
        autosize
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        v-model="model[formItem.inputModel]"
        :name="formItem.inputModel"
        :placeholder="'请输入' + formItem.name"
        input-align="right"
        style="padding-top: 0"
        :rules="[{ required: true }]"
        :disabled="disabled"
      />
      <!-- <van-field
        v-if="isOther"
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        v-model="model[formItem.inputModel]"
        :name="formItem.inputModel"
        placeholder="请输入"
        input-align="right"
        style="padding-top: 0"
      /> -->
      <van-popup
        v-model="showCheckboxOther"
        round
        position="bottom"
        :style="{ height: '40%', 'overflow-y': 'hidden' }"
      >
        <van-picker
          title="请选择"
          show-toolbar
          style="height: 44px"
          item-height="0"
          @confirm="
            CheckboxOtherConfirm(
              model[formItem.model],
              formItem.options.options
            )
          "
          @cancel="showCheckboxOther = false"
        ></van-picker>
        <div
          style="
            display: flex;
            padding: 20px;
            height: calc(100% - 44px);
            box-sizing: border-box;
            overflow-y: scroll;
          "
        >
          <van-checkbox-group
            @change="checkboxOtherChange"
            ref="checkboxOtherRef"
            v-model="model[formItem.model]"
          >
            <van-checkbox
              style="padding-bottom: 10px"
              v-for="(child, index) of formItem.options.options"
              :key="index"
              :name="child.value"
            >
              {{ child.label }}
            </van-checkbox>
          </van-checkbox-group>
        </div>
      </van-popup>
    </template>
    <template
      v-if="
        (formItem.type === 'radio' && formItem.mobileType === 'select') ||
          formItem.type === 'select'
      "
    >
      <van-field
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        v-bind="formItem.options"
        :rules="rules[formItem.model]"
        input-align="right"
        @click="openRadioSelect()"
        error-message-align="right"
        :disabled="disabled"
      >
        <template #input>
          <van-radio-group
            v-show="false"
            v-model="model[formItem.model]"
            direction="horizontal"
            :disabled="disabled"
          >
          </van-radio-group>
          <div :style="disabled ? 'color:#333' : ''">
            {{ tempPickerValue }}
          </div>
        </template>
      </van-field>
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          title="请选择"
          show-toolbar
          value-key="label"
          :columns="formItem.options.options"
          @confirm="onPickerConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
    </template>
    <template
      v-if="formItem.type === 'checkbox' && formItem.mobileType === 'select'"
    >
      <van-field
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        v-bind="formItem.options"
        input-align="right"
        @click="openCheckboxOther()"
        :rules="rules[formItem.model]"
        error-message-align="right"
        :disabled="disabled"
      >
        <template #input>
          <van-checkbox-group
            v-model="model[formItem.model]"
            direction="horizontal"
          >
          </van-checkbox-group>
          <div :style="disabled ? 'color:#333' : ''">
            {{ tempCheckboxOtherVal }}
          </div>
        </template>
      </van-field>
      <van-popup
        v-model="showCheckboxOther"
        round
        position="bottom"
        :style="{ height: '40%', 'overflow-y': 'hidden' }"
      >
        <van-picker
          title="请选择"
          show-toolbar
          style="height: 44px"
          item-height="0"
          @confirm="
            CheckboxOtherConfirm(
              model[formItem.model],
              formItem.options.options
            )
          "
          @cancel="showCheckboxOther = false"
        ></van-picker>
        <div
          style="
            display: flex;
            padding: 20px;
            height: calc(100% - 44px);
            box-sizing: border-box;
            overflow-y: scroll;
          "
        >
          <van-checkbox-group
            @change="checkboxOtherChange"
            ref="checkboxOtherRef"
            v-model="model[formItem.model]"
          >
            <van-checkbox
              style="padding-bottom: 10px"
              v-for="(child, index) of formItem.options.options"
              :key="index"
              :name="child.value"
            >
              {{ child.label }}
            </van-checkbox>
          </van-checkbox-group>
        </div>
      </van-popup>
    </template>
    <template v-if="formItem.type === 'drug'">
      <van-field
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        v-bind="formItem.options"
        readonly
        input-align="right"
        @click="openCheckboxOther"
        :rules="rules[formItem.model]"
        error-message-align="right"
        :disabled="disabled"
      >
        <template #input>
          <van-checkbox-group
            v-model="model[formItem.model]"
            direction="horizontal"
          >
          </van-checkbox-group>
          <div :style="disabled ? 'color:#333' : ''">
            {{ tempCheckboxOtherVal }}
          </div>
        </template>
      </van-field>
      <van-popup
        v-model="showCheckboxOther"
        round
        position="bottom"
        :style="{ height: '80%', 'overflow-y': 'hidden' }"
      >
        <div>
          <van-picker
            title="请选择"
            show-toolbar
            style="height: 44px"
            item-height="0"
            @confirm="CheckboxOtherConfirm(model[formItem.model], endDrugList)"
            @cancel="showCheckboxOther = false"
          ></van-picker>
          <div
            style="
              height: calc(100% - 44px);
              box-sizing: border-box;
              overflow-y: scroll;
            "
          >
            <form action="/">
              <van-search
                v-model="searchValue"
                shape="round"
                show-action
                placeholder="请输入搜索关键词（例：阿莫西林或amxl）"
                @search="onSearch"
              >
                <template #action>
                  <div @click="onSearch">搜索</div>
                </template>
              </van-search>
            </form>
            <van-empty
              v-if="MedicineList.length === 0"
              image="search"
              description="请输入您要查询的药品"
            />
            <van-checkbox-group
              @change="checkboxOtherChange"
              ref="checkboxOtherRef"
              v-model="model[formItem.model]"
            >
              <div style="padding: 0 15px">
                <van-checkbox
                  style="padding-bottom: 10px"
                  v-for="(child, index) of MedicineList"
                  :key="index"
                  :name="child.value"
                >
                  {{ child.label }}
                </van-checkbox>
              </div>
            </van-checkbox-group>
          </div>
        </div>
      </van-popup>
    </template>
    <template v-if="formItem.type === 'whether'">
      <van-field
        v-bind="formItem.options"
        :label-width="labelWidth"
        :name="formItem.model"
        :label="formItem.name"
        :rules="rules[formItem.model]"
        error-message-align="right"
        :class="isLast ? '' : isYes ? '' : 'form-cell'"
        :disabled="disabled"
      >
        <template #input>
          <van-radio-group
            v-model="model[formItem.model]"
            direction="horizontal"
            :disabled="disabled"
          >
            <van-radio
              class="pb"
              v-for="(child, index) of formItem.options.options"
              :key="index"
              :name="child.value"
            >
              {{ child.label }}
            </van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <!-- left-icon="records" -->
      <van-field
        v-if="isYes && formItem.inputType === '1'"
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        v-model="model[formItem.inputModel]"
        :name="formItem.inputModel"
        :placeholder="formItem.options.placeholder"
        error-message-align="right"
        input-align="right"
        style="padding-top: 0"
        :rules="[{ required: true, message: '请填写内容！' }]"
        :disabled="disabled"
      />
      <van-field
        v-if="isYes && formItem.inputType === '2'"
        type="textarea"
        :class="isLast ? '' : 'form-cell'"
        :label-width="labelWidth"
        v-model="model[formItem.inputModel]"
        :name="formItem.inputModel"
        :placeholder="formItem.options.placeholder"
        error-message-align="right"
        input-align="right"
        autosize
        style="padding-top: 0"
        :rules="[{ required: true, message: '请填写内容！' }]"
        :disabled="disabled"
      />
    </template>
    <template v-if="formItem.type === 'BMI'">
      <van-field
        :class="isLast ? '' : 'form-cell'"
        v-model="model[formItem.heightModel]"
        label="身高（cm）"
        :label-width="80"
        placeholder="请输入身高"
        :name="formItem.heightModel"
        input-align="right"
        v-bind="formItem.options"
        @input="inputHeight"
        :rules="[
          {
            required:
              rules[formItem.model] &&
              rules[formItem.model][0] &&
              rules[formItem.model][0].required
          }
        ]"
        :disabled="disabled"
      />
      <van-field
        :class="isLast ? '' : 'form-cell'"
        v-model="model[formItem.weightModel]"
        label="体重（kg）"
        :label-width="80"
        placeholder="请输入体重"
        input-align="right"
        v-bind="formItem.options"
        :name="formItem.weightModel"
        @input="inputWeight"
        :rules="[
          {
            required:
              rules[formItem.model] &&
              rules[formItem.model][0] &&
              rules[formItem.model][0].required
          }
        ]"
        :disabled="disabled"
      />
      <van-field
        :class="isLast ? '' : 'form-cell'"
        label="BMI（kg/cm²）"
        :label-width="120"
        input-align="right"
        :name="formItem.BMIModel"
        v-model="model[formItem.BMIModel]"
        readonly
        :disabled="disabled"
      >
      </van-field>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
// import pinyinFun from 'js-pinyin';
export default {
  props: {
    baseUrl: String,
    disabled: Boolean,
    model: Object,
    formItem: Object,
    rules: Object,
    isLast: Boolean
  },
  data() {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2100, 0, 1),
      currentDate: new Date(),
      searchValue: '',
      activeNames: [],
      showCheckboxOther: false,
      showPicker: false,
      tempCheckboxOtherVal: '请选择',
      tempPickerValue: '请选择',
      oldVal: [],
      // 药品
      endDrugList: [],
      MedicineList: []
    };
  },
  computed: {
    labelWidth() {
      var len = 0;
      for (var i = 0; i < this.formItem.name.length; i++) {
        var c = this.formItem.name.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        } else {
          len += 2;
        }
      }
      let width = len * 8.5;
      if (len > 20) {
        width = 20 * 8;
      }
      if (width < 100) {
        width = 100;
      }
      return `${width}px`;
    },
    isOther() {
      return this.tempCheckboxOtherVal === '其他';
    },
    isYes() {
      return this.model[this.formItem.model] === '1';
    }
  },
  watch: {
    showCheckboxOther: {
      handler(newVal) {
        if (!newVal) {
          this.searchValue = '';
          this.MedicineList = [];
        } else {
          for (let i = 0; i < this.model[this.formItem.model].length; i++) {
            const el = this.model[this.formItem.model][i];
            this.MedicineList.push(
              this.endDrugList.filter(item => item.value === el)[0]
            );
          }
        }
      }
    },
    formItem: {
      immediate: true,
      deep: true,
      handler() {
        if (this.formItem.type === 'date') {
          if (this.model[this.formItem.model] !== '') {
            this.tempCheckboxOtherVal = this.model[this.formItem.model];
            return;
          }
          if (typeof this.model[this.formItem.model] === 'string') {
            this.currentDate = new Date();
            return;
          }
        }
        if (this.formItem.type === 'drug') {
          if (this.model[this.formItem.model].length !== 0) {
            this.CheckboxOtherConfirm(
              this.model[this.formItem.model],
              this.endDrugList
            );
          }
        }
        if (
          this.formItem.type === 'radio' ||
          this.formItem.mobileType === 'select'
        ) {
          this.formItem.options.options.forEach(el => {
            if (el.value === this.model[this.formItem.model]) {
              this.tempPickerValue = el.label;
            }
          });
        }
        if (
          this.formItem.type === 'checkbox' &&
          this.formItem.mobileType === 'select'
        ) {
          this.CheckboxOtherConfirm(
            this.model[this.formItem.model],
            this.formItem.options.options
          );
        }
        if (this.formItem.type === 'checkboxOther') {
          // const isExitNone = this.formItem.options.options.find(
          //   item => item.label === '无'
          // );
          // const isExitOther = this.formItem.options.options.find(
          //   item => item.label === '其他'
          // );
          // if (!isExitNone) {
          //   this.formItem.options.options.push({ label: '无', value: '无' });
          // }
          // if (!isExitOther) {
          //   this.formItem.options.options.push({
          //     label: '其他',
          //     value: '其他'
          //   });
          // }
          if (this.model[this.formItem.model].length !== 0) {
            this.CheckboxOtherConfirm(
              this.model[this.formItem.model],
              this.formItem.options.options
            );
          }
        }
      }
    }
  },
  mounted() {
    this.indexListFun();
  },
  methods: {
    formatter(type, val) {
      // console.log('type', type);
      // console.log('val', val);
      return val;
      // return this.dateFormat('YYYY-mm-dd', val);
    },
    dateConfirm(val) {
      this.tempCheckboxOtherVal = this.dateFormat('YYYY-mm-dd', val);
      this.model[this.formItem.model] = this.dateFormat('YYYY-mm-dd', val);
      console.log('this.formItem.model', this.formItem.model);
      console.log(
        'this.model[this.formItem.model]',
        this.model[this.formItem.model]
      );
      this.showCheckboxOther = false;
    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          );
        }
      }
      return fmt;
    },
    openCheckboxOther() {
      console.log(`this.disabled`, this.disabled);
      if (this.disabled) {
        return;
      }
      this.showCheckboxOther = true;
    },
    openRadioSelect() {
      console.log(`this.disabled`, this.disabled);
      if (this.disabled) {
        return;
      }
      this.showPicker = true;
    },
    inputHeight() {
      if (
        this.model[this.formItem.weightModel] === '' ||
        this.model[this.formItem.heightModel] === ''
      ) {
        return '';
      }
      let a =
        this.model[this.formItem.weightModel] /
        ((this.model[this.formItem.heightModel] / 100) *
          (this.model[this.formItem.heightModel] / 100));
      let temp = Math.round(a * Math.pow(10, 1)) / Math.pow(10, 1);
      let bmi = isNaN(temp) ? 0 : temp;
      // console.log(`bmi`, bmi);
      this.model[this.formItem.BMIModel] = JSON.stringify(bmi);
      // console.log(
      //   `this.formItem[this.formItem.BMIModel]`,
      //   this.formItem[this.formItem.BMIModel]
      // );
    },
    inputWeight() {
      if (
        this.model[this.formItem.weightModel] === '' ||
        this.model[this.formItem.heightModel] === ''
      ) {
        return '';
      }
      let a =
        this.model[this.formItem.weightModel] /
        ((this.model[this.formItem.heightModel] / 100) *
          (this.model[this.formItem.heightModel] / 100));
      let temp = Math.round(a * Math.pow(10, 1)) / Math.pow(10, 1);
      let bmi = isNaN(temp) ? 0 : temp;
      console.log(`bmi`, bmi);
      this.model[this.formItem.BMIModel] = JSON.stringify(bmi);
      console.log(
        `this.formItem[this.formItem.BMIModel]`,
        this.model[this.formItem.BMIModel]
      );
    },
    // comBMI() {
    //   console.log(`weightModel]`, this.formItem[this.formItem.weightModel]);
    //   console.log(`heightModel]`, this.formItem[this.formItem.heightModel]);
    //   if (
    //     this.formItem[this.formItem.weightModel] === '' ||
    //     this.formItem[this.formItem.heightModel] === ''
    //   ) {
    //     return '';
    //   }
    //   let a =
    //     this.formItem[this.formItem.weightModel] /
    //     ((this.formItem[this.formItem.heightModel] / 100) *
    //       (this.formItem[this.formItem.heightModel] / 100));
    //   let temp = Math.round(a * Math.pow(10, 1)) / Math.pow(10, 1);
    //   let bmi = isNaN(temp) ? 0 : temp;
    //   console.log(`bmi`, bmi);
    //   this.formItem[this.formItem.BMIModel] = JSON.stringify(bmi);
    //   console.log(
    //     `this.formItem[this.formItem.BMIModel]`,
    //     this.formItem[this.formItem.BMIModel]
    //   );
    //   return bmi;
    // },
    checkboxOtherChange(arr) {
      console.log(`arr`, arr);
      let flag = JSON.stringify(arr) === JSON.stringify(this.oldVal);
      let last = arr[arr.length - 1];
      let isWu = last === '无';
      let isOther = last === '其他';
      if (!flag) {
        if (isWu) {
          this.model[this.formItem.model] = ['无'];
        } else if (isOther) {
          this.model[this.formItem.model] = ['其他'];
        } else {
          let tempArr = [];
          for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (el !== '无' && el !== '其他') {
              tempArr.push(el);
            }
          }
          console.log(`tempArr`, tempArr);
          this.model[this.formItem.model] = tempArr;
        }
      }
      this.oldVal = JSON.parse(JSON.stringify(arr));
    },
    CheckboxOtherConfirm(val, arr) {
      // console.log(`CheckboxOtherConfirm`, val, arr);
      let tempArr = JSON.parse(JSON.stringify(arr));
      // console.log(`val`, val);

      let str = '';
      for (let i = 0; i < tempArr.length; i++) {
        const _ = tempArr[i];
        // console.log(`_`, _);
        for (let j = 0; j < val.length; j++) {
          const el = val[j];
          if (_.value === el) {
            if (str === '') {
              str += `${_.label}`;
            } else {
              str += `、${_.label}`;
            }
          }
        }
      }
      // console.log(`str`, str);
      if (str === '') {
        str = '请选择';
      }
      // console.log(`arr`, arr);
      this.model[this.formItem.model] = val;
      this.tempCheckboxOtherVal = str;
      // console.log(`this.tempCheckboxOtherVal`, this.tempCheckboxOtherVal);
      this.showCheckboxOther = false;
    },
    onPickerConfirm(value) {
      // console.log(`this.formItem.model`, this.formItem.model);
      // console.log(`value`, value);
      this.tempPickerValue = value.label;
      // console.log(
      //   `this.model[this.formItem.model] `,
      //   this.model[this.formItem.model]
      // );
      this.model[this.formItem.model] = value.value;
      this.showPicker = false;
    },
    indexListFun() {
      if (this.formItem.type === 'drug') {
        console.log(
          `this.baseUrl + this.formItem.options.remoteURL`,
          this.baseUrl + this.formItem.options.remoteURL
        );
        let url =
          // 'http://124.196.7.86:7000/ygt-followup/tbMbFollowOrder/getOrdersForSelect?orderDesc=&orderCode=';
          this.baseUrl + this.formItem.options.remoteURL;
        // console.log(`url`, url);
        if (this.formItem.options.remote) {
          axios.get(url).then(res => {
            this.endDrugList = res.data;
            if (this.formItem.type === 'drug') {
              if (this.model[this.formItem.model].length !== 0) {
                this.CheckboxOtherConfirm(
                  this.model[this.formItem.model],
                  this.endDrugList
                );
              }
            }
          });
        }
      }
    },
    onSearch() {
      this.MedicineList = this.fuzzyQuery(this.endDrugList, this.searchValue);
    },
    fuzzyQuery(list, keyWord) {
      if (keyWord === '') {
        return [];
      }
      var reg = new RegExp(keyWord.toLowerCase());
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (reg.test(list[i].label.toLowerCase())) {
          arr.push(list[i]);
        }
      }
      return arr;
    }
  }
};
</script>
<style lang="scss" scoped>
.VantFormItem {
  background-color: #fff;
  .pb {
    padding-bottom: 2px;
  }
  .title {
    display: flex;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #f7f7f7;
    padding-bottom: 10px;
    font-weight: bold;
    // .line {
    //   width: 4px;
    //   border-radius: 2px;
    //   background-color: rgba(83, 129, 227, 100);
    //   margin-right: 4px;
    // }
  }
  .form-cell {
    border-bottom: 1px solid #f7f7f7;
    padding-bottom: 10px;
  }
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border-width: 0px 0;
  }
  ::v-deep .van-field__label {
    font-size: 14px;
    color: #919191;
  }
  ::v-deep .van-field__control--custom {
    justify-content: flex-end;
  }

  ::v-deep .van-field__body input::-webkit-input-placeholder {
    font-size: 14px;
    // color: #4e4e4e !important;
  }
  ::v-deep .van-field__body textarea::-webkit-input-placeholder {
    font-size: 14px;
    // color: #4e4e4e !important;
  }

  ::v-deep .van-field__control--right {
    font-size: 14px;
    // color: #4e4e4e !important;
  }
  // ::v-deep .van-field__body textarea {
  //   font-size: 14px;
  //   padding-right: 16px !important;
  //   color: #4e4e4e !important;
  // }
  // ::v-deep .van-cell__title {
  //   font-size: 14px;
  //   color: rgba(145, 145, 145, 100);
  // }
  ::v-deep .van-cell::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #fff;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .extra {
    position: absolute;
    right: 15px;
    color: #4e4e4e;
    font-size: 14px;
  }
}
</style>
