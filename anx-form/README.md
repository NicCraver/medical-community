# anx-form-making

```
安装

npm i --save anx-form-making
or
yarn add anx-form-making
```


```js
如何使用
# main.js

import anxFormMaking from 'anx-form-making'
import 'anx-form-making/dist/anx-form-making.css'
Vue.use(anxFormMaking)

```

创建自定义表单
``` vue
<template>
  <div id="app">
    <AnxFormMaking @create-json="createJson()" />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    createJson(row) {
      console.log('createJson', row);
    },
  }
};
</script>

<style lang="scss">
html {
  height: 100%;
  body {
    height: 100%;
  }
}
#app {
  height: 100%;
}
</style>

```
使用Json生成表单
``` vue
<template>
  <div id="app">
    <!-- <AnxFormMaking
      @create-json="createJson"
      width="90%"
      size="small"
      :anxFormData="anxFormData"
      :cusComponents="cusComponents"
      @saveCode="saveCode"
    /> -->
    <anx-form
      :anxFormData="anxFormData"
      @form-submit="handleSubmit"
      ref="anxForm"
      :echoData="echoData"
      :jsCode="jsCode"
      :scriptSrcList="scriptSrcList"
      :linkHrefList="linkHrefList"
      @saveCode="saveCode"
    />
    <button @click="aclick">提交</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      echoData: {
        checkbox_1591941133001: ['Option 1', 'Option 2', 'Option 3'],
        date_1591941134545: '2020-06-12',
        date_1591941146156: '2020-06-11',
        input_1591941129225: '单行文本',
        input_1591941141834: '单行文本2',
        radio_1591941132531: 'Option 1',
        select_1591941135242: 'Option 1',
        textarea_1591941129693: '多行文本'
      },
      anxFormData: {
        formComponentList: [
          {
            type: 'input',
            icon: 'anx-icon-danhangwenben',
            key: 1591941129225,
            model: 'input_1591941129225',
            name: '单行文本',
            isFormComponent: true,
            options: {
              dataType: 'string',
              defaultValue: '',
              disabled: false,
              placeholder: '',
              remoteFunc: 'func_1591941122766',
              required: false,
              errorTips: '',
              width: '100%'
            },
            remoteFunc: 'func_1591941129225'
          },
          {
            type: 'textarea',
            icon: 'anx-icon-duohangwenben',
            key: 1591941129693,
            model: 'textarea_1591941129693',
            name: '多行文本',
            isFormComponent: true,
            options: {
              defaultValue: '',
              disabled: false,
              placeholder: '',
              remoteFunc: 'func_1591941122766',
              required: false,
              errorTips: '',
              width: '100%'
            },
            remoteFunc: 'func_1591941129693'
          },
          {
            type: 'radio',
            icon: 'anx-icon-danxuankuangxuanzhong',
            key: 1591941132531,
            model: 'radio_1591941132531',
            name: '单选框组',
            isFormComponent: true,
            options: {
              defaultValue: '',
              disabled: false,
              inline: false,
              options: [
                { label: 'Option 1', value: 'Option 1' },
                { label: 'Option 2', value: 'Option 2' },
                { label: 'Option 3', value: 'Option 3' }
              ],
              props: { label: 'label', value: 'value' },
              remote: false,
              remoteFunc: 'func_1591941122766',
              remoteOptions: [],
              required: false,
              errorTips: '',
              showLabel: false,
              width: '100%'
            },
            remoteFunc: 'func_1591941132531'
          },
          {
            type: 'checkbox',
            icon: 'anx-icon-duoxuankuang1',
            key: 1591941133001,
            model: 'checkbox_1591941133001',
            name: '多选框组',
            isFormComponent: true,
            options: {
              defaultValue: [],
              disabled: false,
              inline: false,
              options: [
                { value: 'Option 1', label: 'Option 1' },
                { value: 'Option 2', label: 'Option 2' },
                { value: 'Option 3', label: 'Option 3' }
              ],
              props: { label: 'label', value: 'value' },
              remote: false,
              remoteFunc: 'func_1591941122766',
              remoteOptions: [],
              required: false,
              errorTips: '',
              showLabel: false,
              width: '100%'
            },
            remoteFunc: 'func_1591941133001'
          },
          {
            type: 'date',
            icon: 'anx-icon-riqi1',
            key: 1591941134545,
            model: 'date_1591941134545',
            name: '日期选择器',
            isFormComponent: true,
            options: {
              clearable: true,
              defaultValue: '',
              disabled: false,
              editable: true,
              endPlaceholder: '',
              format: 'yyyy-MM-dd',
              readonly: false,
              remoteFunc: 'func_1591941122766',
              required: false,
              errorTips: '',
              startPlaceholder: '',
              timestamp: false,
              type: 'date',
              width: '100%'
            },
            remoteFunc: 'func_1591941134545'
          },
          {
            type: 'select',
            icon: 'anx-icon-xialakuang',
            key: 1591941135242,
            model: 'select_1591941135242',
            name: '下拉选择框',
            isFormComponent: true,
            options: {
              clearable: true,
              defaultValue: '',
              disabled: false,
              filterable: false,
              multiple: false,
              options: [
                { label: 'Option 1', value: 'Option 1' },
                { label: 'Option 2', value: 'Option 2' },
                { label: 'Option 3', value: 'Option 3' }
              ],
              placeholder: '',
              props: { label: 'label', value: 'value' },
              remote: false,
              remoteFunc: 'func_1591941122766',
              casModel: '',
              requestParam: '',
              remoteURL: '',
              remoteOptions: [],
              required: false,
              errorTips: '',
              showLabel: false,
              width: '100%'
            },
            remoteFunc: 'func_1591941135242'
          },
          {
            type: 'grid',
            name: '栅格布局',
            icon: 'anx-icon-H-',
            columns: [
              {
                list: [
                  {
                    type: 'input',
                    icon: 'anx-icon-danhangwenben',
                    key: 1591941141834,
                    model: 'input_1591941141834',
                    name: '单行文本',
                    isFormComponent: true,
                    options: {
                      dataType: 'string',
                      defaultValue: '',
                      disabled: false,
                      placeholder: '',
                      remoteFunc: 'func_1591941122766',
                      required: false,
                      errorTips: '',
                      width: '100%'
                    },
                    remoteFunc: 'func_1591941141834'
                  }
                ],
                span: 12
              },
              {
                list: [
                  {
                    type: 'date',
                    icon: 'anx-icon-riqi1',
                    key: 1591941146156,
                    model: 'date_1591941146156',
                    name: '日期选择器',
                    isFormComponent: true,
                    options: {
                      clearable: true,
                      defaultValue: '',
                      disabled: false,
                      editable: true,
                      endPlaceholder: '',
                      format: 'yyyy-MM-dd',
                      readonly: false,
                      remoteFunc: 'func_1591941122766',
                      required: false,
                      errorTips: '',
                      startPlaceholder: '',
                      timestamp: false,
                      type: 'date',
                      width: '100%'
                    },
                    remoteFunc: 'func_1591941146156'
                  }
                ],
                span: 12
              }
            ],
            options: { gutter: 0, justify: 'start', align: 'top' },
            key: 1591941138317,
            model: 'grid_1591941138317',
            remoteFunc: 'func_1591941138317'
          }
        ],
        formConfig: {
          width: '90%',
          size: 'small',
          labelPosition: 'right',
          labelWidth: 100,
          showNativeSave: false
        }
      },
      cusComponents: [
        {
          category: '心脏科',
          components: [
            {
              name: '组件名称',
              type: 'cusComponent',
              list: [
                {
                  type: 'input',
                  icon: 'anx-icon-danhangwenben',
                  key: 1591941129225,
                  model: 'input_1591941129225',
                  name: '单行文本',
                  isFormComponent: true,
                  options: {
                    dataType: 'string',
                    defaultValue: '',
                    disabled: false,
                    placeholder: '',
                    remoteFunc: 'func_1591941122766',
                    required: false,
                    errorTips: '',
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941129225'
                },
                {
                  type: 'textarea',
                  icon: 'anx-icon-duohangwenben',
                  key: 1591941129693,
                  model: 'textarea_1591941129693',
                  name: '多行文本',
                  isFormComponent: true,
                  options: {
                    defaultValue: '',
                    disabled: false,
                    placeholder: '',
                    remoteFunc: 'func_1591941122766',
                    required: false,
                    errorTips: '',
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941129693'
                },
                {
                  type: 'radio',
                  icon: 'anx-icon-danxuankuangxuanzhong',
                  key: 1591941132531,
                  model: 'radio_1591941132531',
                  name: '单选框组',
                  isFormComponent: true,
                  options: {
                    defaultValue: '',
                    disabled: false,
                    inline: false,
                    options: [
                      { label: 'Option 1', value: 'Option 1' },
                      { label: 'Option 2', value: 'Option 2' },
                      { label: 'Option 3', value: 'Option 3' }
                    ],
                    props: { label: 'label', value: 'value' },
                    remote: false,
                    remoteFunc: 'func_1591941122766',
                    remoteOptions: [],
                    required: false,
                    errorTips: '',
                    showLabel: false,
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941132531'
                },
                {
                  type: 'date',
                  icon: 'anx-icon-riqi1',
                  key: 1591941134545,
                  model: 'date_1591941134545',
                  name: '日期选择器',
                  isFormComponent: true,
                  options: {
                    clearable: true,
                    defaultValue: '',
                    disabled: false,
                    editable: true,
                    endPlaceholder: '',
                    format: 'yyyy-MM-dd',
                    readonly: false,
                    remoteFunc: 'func_1591941122766',
                    required: false,
                    errorTips: '',
                    startPlaceholder: '',
                    timestamp: false,
                    type: 'date',
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941134545'
                },
                {
                  type: 'select',
                  icon: 'anx-icon-xialakuang',
                  key: 1591941135242,
                  model: 'province',
                  name: '省',
                  isFormComponent: true,
                  options: {
                    clearable: true,
                    defaultValue: '',
                    disabled: false,
                    filterable: false,
                    multiple: false,
                    options: [
                      { label: 'Option 1', value: 'Option 1' },
                      { label: 'Option 2', value: 'Option 2' },
                      { label: 'Option 3', value: 'Option 3' }
                    ],
                    placeholder: '',
                    props: { label: 'label', value: 'value' },
                    remote: false,
                    remoteFunc: 'func_1591941122766',
                    casModel: '',
                    requestParam: '',
                    remoteURL: '',
                    remoteOptions: [],
                    required: false,
                    errorTips: '',
                    showLabel: false,
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941135242'
                },
                {
                  type: 'grid',
                  name: '栅格布局',
                  icon: 'anx-icon-H-',
                  columns: [
                    {
                      list: [
                        {
                          type: 'input',
                          icon: 'anx-icon-danhangwenben',
                          key: 1591941141834,
                          model: 'input_1591941141834',
                          name: '单行文本',
                          isFormComponent: true,
                          options: {
                            dataType: 'string',
                            defaultValue: '',
                            disabled: false,
                            placeholder: '',
                            remoteFunc: 'func_1591941122766',
                            required: false,
                            errorTips: '',
                            width: '100%'
                          },
                          remoteFunc: 'func_1591941141834'
                        }
                      ],
                      span: 12
                    },
                    {
                      list: [
                        {
                          type: 'date',
                          icon: 'anx-icon-riqi1',
                          key: 1591941146156,
                          model: 'date_1591941146156',
                          name: '日期选择器',
                          isFormComponent: true,
                          options: {
                            clearable: true,
                            defaultValue: '',
                            disabled: false,
                            editable: true,
                            endPlaceholder: '',
                            format: 'yyyy-MM-dd',
                            readonly: false,
                            remoteFunc: 'func_1591941122766',
                            required: false,
                            errorTips: '',
                            startPlaceholder: '',
                            timestamp: false,
                            type: 'date',
                            width: '100%'
                          },
                          remoteFunc: 'func_1591941146156'
                        }
                      ],
                      span: 12
                    }
                  ],
                  options: { gutter: 0, justify: 'start', align: 'top' },
                  key: 1591941138317,
                  model: 'grid_1591941138317',
                  remoteFunc: 'func_1591941138317'
                },
                {
                  type: 'grid',
                  name: '栅格布局',
                  icon: 'anx-icon-H-',
                  columns: [
                    {
                      list: [
                        {
                          type: 'select',
                          icon: 'anx-icon-xialakuang',
                          key: 1592535245117,
                          model: 'select_1592535245117',
                          name: '下拉选择框',
                          isFormComponent: true,
                          options: {
                            clearable: true,
                            defaultValue: '',
                            disabled: false,
                            filterable: false,
                            multiple: false,
                            options: [
                              { label: 'Option 1', value: 'Option 1' },
                              { label: 'Option 2', value: 'Option 2' },
                              { label: 'Option 3', value: 'Option 3' }
                            ],
                            placeholder: '',
                            props: { label: 'text', value: 'id' },
                            remote: true,
                            remoteFunc: 'func_1592535213983',
                            casModel: 'province',
                            requestParam: '',
                            remoteURL: 'http://192.168.198.166:3000/api/data',
                            remoteOptions: [],
                            required: false,
                            errorTips: '',
                            showLabel: false,
                            width: '100%'
                          },
                          remoteFunc: 'func_1592535245117'
                        }
                      ],
                      span: 12
                    },
                    { list: [], span: 12 }
                  ],
                  options: { gutter: 0, justify: 'start', align: 'top' },
                  key: 1592535228516,
                  model: 'grid_1592535228516',
                  remoteFunc: 'func_1592535228516'
                }
              ]
            },
          ]
        },
        {
          category: '心脏科2',
          components: [
            {
              name: '组件名称',
              type: 'cusComponent',
              list: [
                {
                  type: 'input',
                  icon: 'anx-icon-danhangwenben',
                  key: 1591941129225,
                  model: 'input_1591941129225',
                  name: '单行文本',
                  isFormComponent: true,
                  options: {
                    dataType: 'string',
                    defaultValue: '',
                    disabled: false,
                    placeholder: '',
                    remoteFunc: 'func_1591941122766',
                    required: false,
                    errorTips: '',
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941129225'
                },
                {
                  type: 'textarea',
                  icon: 'anx-icon-duohangwenben',
                  key: 1591941129693,
                  model: 'textarea_1591941129693',
                  name: '多行文本',
                  isFormComponent: true,
                  options: {
                    defaultValue: '',
                    disabled: false,
                    placeholder: '',
                    remoteFunc: 'func_1591941122766',
                    required: false,
                    errorTips: '',
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941129693'
                },
                {
                  type: 'radio',
                  icon: 'anx-icon-danxuankuangxuanzhong',
                  key: 1591941132531,
                  model: 'radio_1591941132531',
                  name: '单选框组',
                  isFormComponent: true,
                  options: {
                    defaultValue: '',
                    disabled: false,
                    inline: false,
                    options: [
                      { label: 'Option 1', value: 'Option 1' },
                      { label: 'Option 2', value: 'Option 2' },
                      { label: 'Option 3', value: 'Option 3' }
                    ],
                    props: { label: 'label', value: 'value' },
                    remote: false,
                    remoteFunc: 'func_1591941122766',
                    remoteOptions: [],
                    required: false,
                    errorTips: '',
                    showLabel: false,
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941132531'
                },
                {
                  type: 'date',
                  icon: 'anx-icon-riqi1',
                  key: 1591941134545,
                  model: 'date_1591941134545',
                  name: '日期选择器',
                  isFormComponent: true,
                  options: {
                    clearable: true,
                    defaultValue: '',
                    disabled: false,
                    editable: true,
                    endPlaceholder: '',
                    format: 'yyyy-MM-dd',
                    readonly: false,
                    remoteFunc: 'func_1591941122766',
                    required: false,
                    errorTips: '',
                    startPlaceholder: '',
                    timestamp: false,
                    type: 'date',
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941134545'
                },
                {
                  type: 'select',
                  icon: 'anx-icon-xialakuang',
                  key: 1591941135242,
                  model: 'province',
                  name: '省',
                  isFormComponent: true,
                  options: {
                    clearable: true,
                    defaultValue: '',
                    disabled: false,
                    filterable: false,
                    multiple: false,
                    options: [
                      { label: 'Option 1', value: 'Option 1' },
                      { label: 'Option 2', value: 'Option 2' },
                      { label: 'Option 3', value: 'Option 3' }
                    ],
                    placeholder: '',
                    props: { label: 'label', value: 'value' },
                    remote: false,
                    remoteFunc: 'func_1591941122766',
                    casModel: '',
                    requestParam: '',
                    remoteURL: '',
                    remoteOptions: [],
                    required: false,
                    errorTips: '',
                    showLabel: false,
                    width: '100%'
                  },
                  remoteFunc: 'func_1591941135242'
                },
                {
                  type: 'grid',
                  name: '栅格布局',
                  icon: 'anx-icon-H-',
                  columns: [
                    {
                      list: [
                        {
                          type: 'input',
                          icon: 'anx-icon-danhangwenben',
                          key: 1591941141834,
                          model: 'input_1591941141834',
                          name: '单行文本',
                          isFormComponent: true,
                          options: {
                            dataType: 'string',
                            defaultValue: '',
                            disabled: false,
                            placeholder: '',
                            remoteFunc: 'func_1591941122766',
                            required: false,
                            errorTips: '',
                            width: '100%'
                          },
                          remoteFunc: 'func_1591941141834'
                        }
                      ],
                      span: 12
                    },
                    {
                      list: [
                        {
                          type: 'date',
                          icon: 'anx-icon-riqi1',
                          key: 1591941146156,
                          model: 'date_1591941146156',
                          name: '日期选择器',
                          isFormComponent: true,
                          options: {
                            clearable: true,
                            defaultValue: '',
                            disabled: false,
                            editable: true,
                            endPlaceholder: '',
                            format: 'yyyy-MM-dd',
                            readonly: false,
                            remoteFunc: 'func_1591941122766',
                            required: false,
                            errorTips: '',
                            startPlaceholder: '',
                            timestamp: false,
                            type: 'date',
                            width: '100%'
                          },
                          remoteFunc: 'func_1591941146156'
                        }
                      ],
                      span: 12
                    }
                  ],
                  options: { gutter: 0, justify: 'start', align: 'top' },
                  key: 1591941138317,
                  model: 'grid_1591941138317',
                  remoteFunc: 'func_1591941138317'
                },
                {
                  type: 'grid',
                  name: '栅格布局',
                  icon: 'anx-icon-H-',
                  columns: [
                    {
                      list: [
                        {
                          type: 'select',
                          icon: 'anx-icon-xialakuang',
                          key: 1592535245117,
                          model: 'select_1592535245117',
                          name: '下拉选择框',
                          isFormComponent: true,
                          options: {
                            clearable: true,
                            defaultValue: '',
                            disabled: false,
                            filterable: false,
                            multiple: false,
                            options: [
                              { label: 'Option 1', value: 'Option 1' },
                              { label: 'Option 2', value: 'Option 2' },
                              { label: 'Option 3', value: 'Option 3' }
                            ],
                            placeholder: '',
                            props: { label: 'text', value: 'id' },
                            remote: true,
                            remoteFunc: 'func_1592535213983',
                            casModel: 'province',
                            requestParam: '',
                            remoteURL: 'http://192.168.198.166:3000/api/data',
                            remoteOptions: [],
                            required: false,
                            errorTips: '',
                            showLabel: false,
                            width: '100%'
                          },
                          remoteFunc: 'func_1592535245117'
                        }
                      ],
                      span: 12
                    },
                    { list: [], span: 12 }
                  ],
                  options: { gutter: 0, justify: 'start', align: 'top' },
                  key: 1592535228516,
                  model: 'grid_1592535228516',
                  remoteFunc: 'func_1592535228516'
                }
              ]
            },
          ]
        }
      ],
      jsCode: 'console.log(123)',
      scriptSrcList: ['https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js'],
      linkHrefList: ['https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css'],
    };
  },
  methods: {
    createJson(row) {
      console.log('createJson', row);
    },
    handleSubmit(row) {
      console.log('formData', row);
    },
    aclick() {
      console.log(this.$refs.anxForm.formSubmit());
    },
    saveCode(code) {
      console.log(code)
    }
  }
};
</script>
```

## AnxFrom

###  Attributes

| 参数          | 说明                                            | 类型    | 默认值 | 必填  |
|---------------|-------------------------------------------------|---------|--------|-------|
| anxFormData   | 生成表单的数据，由AnxFormMaking生成JSON时创建   | object  | —      | true  |
| echoData      | 表单回显的数据，以字段为key以字段值为value      | object  | —      | false |
| width         | 表单宽度百分比或者像素，默认                    | string  | 100%   | false |
| size          | medium、small、mini                             | string  | medium | false |
| labelPosition | 标题位置， left左对齐，right右对齐，top顶端对齐 | string  | right  | false |
| labelWidth    | 标题宽度 字符串如'100' 不要带px                 | string  | '100'  | false |
| disabled      | 表单是否处于disabled状态                        | boolean | false  | false |
| jsCode        | 自定义js代码作为脚本插入浏览器当前页面          | string  | false  | false |
| scriptSrcList | 页面引入的第三方js链接组成数组                  | array   | []     | false |
| linkHrefList  | 页面引入的第三方style链接组成数组               | array   | []     | false |

### Methods
| 方法名       | 说明                                       | 参数       |
|--------------|--------------------------------------------|------------|
| createCusCom | 表单提交事件直接调取，返回值为整个表单数据 |            |
| save-code    | 自定义js代码保存按钮点击事件               | 整个js代码 |
|              |                                            |            |




## AnxFromMaking

### Attributes

| 参数          | 说明                                           | 类型   | 默认值 |  必填  |
| ------------- | ---------------------------------------------- | ------ | ------ | ------------- |
| width         | 表单宽度，百分比或者像素                       | string | 100%   |  false |
| size          | medium、small、mini                            | string | medium |  false |
| labelPosition | 标题位置，left左对齐，right右对齐，top顶端对齐 | string | right  |  false |
| labelWidth    | 标题宽度 字符串如'100' 不要带px                | string | '100'  |  false |
| cusComponents | 自定义组件数据，具体格式见示例                 | array   |  []    |  false |
| showBack | 是否显示头部返回按钮 | boolean | false | false |
### Methods

| 方法名     | 说明                                               | 参数                                                         |
| ---------- | -------------------------------------------------- | ------------------------------------------------------------ |
| formSubmit | 自定组件提交回调方法，返回参数为自定义组件对应数据 |                                                              |
| save-code  | 自定义js代码保存按钮点击事件                       | {<br />jsCode: //编写的js代码,<br />linkHrefList: // css外部链接<br/>scriptSrcList: // script外部链接<br />} |
|            |                                                    |                                                              |
|            |                                                    |                                                              |