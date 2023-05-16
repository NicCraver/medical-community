export const defaultFormConfig = {
  width: '100%',
  size: 'medium',
  labelPosition: 'top',
  labelWidth: '100',
  showNativeSave: false
};

export const basicComponents = [
  {
    type: 'h1',
    icon: 'anx-icon-H-',
    key: new Date().getTime(),
    name: '一级标题',
    isFormComponent: false,
    isShow: false,
    options: {
      ifConfig: [],
      dataType: 'string',
      defaultValue: '一级标题',
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      width: '100%',
      align: 'center'
    }
  },
  {
    type: 'h2',
    icon: 'anx-icon-H-1',
    key: new Date().getTime(),
    name: '二级标题',
    isFormComponent: false,
    isShow: true,
    options: {
      dataType: 'string',
      defaultValue: '二级标题',
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      width: '100%',
      align: 'left'
    }
  },
  {
    type: 'h3',
    icon: 'anx-icon-h',
    key: new Date().getTime(),
    name: '三级标题',
    isFormComponent: false,
    isShow: true,
    options: {
      dataType: 'string',
      defaultValue: '三级标题',
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      width: '100%',
      align: 'left'
    }
  },
  {
    type: 'text',
    icon: 'anx-icon-wenzishezhi-',
    key: new Date().getTime(),
    name: '文字',
    isFormComponent: false,
    isShow: true,
    options: {
      dataType: 'string',
      defaultValue: '',
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      width: '100%',
      showTitle: true
    }
  },
  {
    type: 'input',
    icon: 'anx-icon-danhangwenben',
    key: new Date().getTime(),
    model: 'input_' + new Date().getTime(),
    name: '单行文本',
    isFormComponent: true,
    isShow: true,
    options: {
      dataType: 'string',
      defaultValue: '',
      disabled: false,
      placeholder: '',
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      width: '100%'
    }
  },
  {
    type: 'textarea',
    icon: 'anx-icon-duohangwenben',
    key: new Date().getTime(),
    model: 'textarea_' + new Date().getTime(),
    name: '多行文本',
    isFormComponent: true,
    isShow: true,
    options: {
      defaultValue: '',
      disabled: false,
      showWordLimit: false,
      minlength: '0',
      maxlength: '200',
      placeholder: '',
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      width: '100%'
    }
  },
  {
    type: 'radio',
    icon: 'anx-icon-danxuankuangxuanzhong',
    key: new Date().getTime(),
    model: 'radio_' + new Date().getTime(),
    name: '单选框组',
    mobileType: 'radio',
    isFormComponent: true,
    isShow: true,
    options: {
      defaultValue: '',
      disabled: false,
      inline: false,
      sourceType: 'static',
      options: [
        {
          label: 'Option 1',
          value: 'Option 1'
        },
        {
          label: 'Option 2',
          value: 'Option 2'
        },
        {
          label: 'Option 3',
          value: 'Option 3'
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      uploadUrl: '',
      deleteUrl: '',
      imageOptions: [],
      remote: false,
      remoteFunc: 'func_' + new Date().getTime(),
      remoteOptions: Array(0),
      required: false,
      errorTips: '',
      showLabel: false,
      width: '100%'
    }
  },
  {
    type: 'whether',
    icon: 'anx-icon-danxuankuangxuanzhong',
    key: new Date().getTime(),
    model: 'radio_' + new Date().getTime(),
    inputModel: 'input_' + new Date().getTime(),
    inputDefaultValue: '',
    name: '单选框组(是否)',
    inputType: '1',
    isFormComponent: true,
    isShow: true,
    options: {
      defaultValue: '',
      disabled: false,
      inline: false,
      sourceType: 'static',
      options: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '2'
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      uploadUrl: '',
      deleteUrl: '',
      imageOptions: [],
      remote: false,
      remoteFunc: 'func_' + new Date().getTime(),
      remoteOptions: Array(0),
      required: false,
      errorTips: '',
      showLabel: false,
      width: '100%'
    }
  },
  {
    type: 'checkbox',
    icon: 'anx-icon-duoxuankuang1',
    key: new Date().getTime(),
    model: 'checkbox_' + new Date().getTime(),
    name: '多选框组',
    mobileType: 'checkbox',
    isFormComponent: true,
    isShow: true,
    options: {
      defaultValue: [],
      disabled: false,
      inline: false,
      sourceType: 'static',
      options: [
        {
          label: 'Option 1',
          value: 'Option 1'
        },
        {
          label: 'Option 2',
          value: 'Option 2'
        },
        {
          label: 'Option 3',
          value: 'Option 3'
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      uploadUrl: '',
      deleteUrl: '',
      imageOptions: [],
      remote: false,
      remoteFunc: 'func_' + new Date().getTime(),
      remoteOptions: Array(0),
      required: false,
      errorTips: '',
      showLabel: false,
      width: '100%'
    }
  },
  {
    type: 'checkboxOther',
    icon: 'anx-icon-duoxuankuang1',
    key: new Date().getTime(),
    model: 'checkbox_' + new Date().getTime(),
    inputModel: '其他' + new Date().getTime(),
    inputDefaultValue: '',
    name: '多选框组(无/其他)',
    isFormComponent: true,
    isShow: true,
    options: {
      placeholder: '',
      defaultValue: [],
      disabled: false,
      inline: false,
      sourceType: 'static',
      options: [
        {
          label: 'Option 1',
          value: 'Option 1'
        },
        {
          label: 'Option 2',
          value: 'Option 2'
        },
        {
          label: 'Option 3',
          value: 'Option 3'
        },
        {
          label: '无',
          value: '无'
        },
        {
          label: '其他',
          value: '其他'
        }
      ],
      props: {
        label: 'label',
        value: 'value'
      },
      uploadUrl: '',
      deleteUrl: '',
      imageOptions: [],
      remote: false,
      remoteFunc: 'func_' + new Date().getTime(),
      remoteOptions: Array(0),
      required: false,
      errorTips: '',
      showLabel: false,
      width: '100%'
    }
  },
  {
    type: 'date',
    icon: 'anx-icon-riqi1',
    key: new Date().getTime(),
    model: 'date_' + new Date().getTime(),
    name: '日期选择器',
    isFormComponent: true,
    isShow: true,
    options: {
      placeholder: '请输入例：2000-01-01或选择',
      clearable: true,
      defaultValue: '',
      disabled: false,
      editable: true,
      endPlaceholder: '',
      format: 'yyyy-MM-dd',
      readonly: false,
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      startPlaceholder: '',
      timestamp: false,
      type: 'date',
      width: '100%'
    }
  },
  {
    type: 'select',
    icon: 'anx-icon-xialakuang',
    key: new Date().getTime(),
    model: 'select_' + new Date().getTime(),
    name: '下拉选择框',
    isFormComponent: true,
    isShow: true,
    options: {
      clearable: true,
      defaultValue: '',
      disabled: false,
      filterable: false,
      multiple: false,
      options: [
        {
          label: 'Option 1',
          value: 'Option 1'
        },
        {
          label: 'Option 2',
          value: 'Option 2'
        },
        {
          label: 'Option 3',
          value: 'Option 3'
        }
      ],
      placeholder: '',
      props: {
        label: 'label',
        value: 'value'
      },
      remote: false,
      remoteFunc: 'func_' + new Date().getTime(),
      casModel: '',
      requestParam: '',
      remoteURL: '',
      remoteOptions: [],
      required: false,
      errorTips: '',
      showLabel: false,
      width: '100%'
    }
  },
  {
    type: 'drug',
    icon: 'anx-icon-xialakuang',
    key: new Date().getTime(),
    model: 'select_' + new Date().getTime(),
    name: '药品选择器',
    isFormComponent: true,
    isShow: true,
    options: {
      'allow-create': true,
      clearable: true,
      defaultValue: '',
      disabled: false,
      filterable: true,
      multiple: true,
      options: [
        {
          label: 'Option 1',
          value: 'Option 1'
        },
        {
          label: 'Option 2',
          value: 'Option 2'
        },
        {
          label: 'Option 3',
          value: 'Option 3'
        }
      ],
      placeholder: '',
      props: {
        label: 'label',
        value: 'value'
      },
      remote: false,
      remoteFunc: 'func_' + new Date().getTime(),
      casModel: '',
      requestParam: '',
      remoteURL: '',
      remoteOptions: [],
      required: false,
      errorTips: '',
      showLabel: false,
      width: '100%'
    }
  },
  {
    type: 'rate',
    icon: 'anx-icon-xingxing',
    key: new Date().getTime(),
    model: 'rate_' + new Date().getTime(),
    name: '星级评分',
    isFormComponent: true,
    isShow: true,
    options: {
      texts: ['极差', '失望', '一般', '满意', '很满意'],
      'show-Text': true,
      defaultValue: 0,
      max: 5,
      disabled: false,
      'allow-half': false
    }
  }
  // ,{
  //   type: 'transfer',
  //   icon: 'anx-icon-chuansuokuang',
  //   key: new Date().getTime(),
  //   model: 'transfer_' + new Date().getTime(),
  //   name: '穿梭框',
  //   isFormComponent: true,
  //   options: {
  //     defaultValue: [],
  //     titles: ['列表1', '列表2'],
  //     props: {
  //       key: 'value',
  //       label: 'label'
  //     },
  //     options: [
  //       {
  //         value: 'Option 1',
  //         label: 'Option 1'
  //       },
  //       {
  //         value: 'Option 2',
  //         label: 'Option 2'
  //       },
  //       {
  //         value: 'Option 3',
  //         label: 'Option 3'
  //       }
  //     ]
  //   }
  // },
  // {
  //   type: 'upload',
  //   icon: 'anx-icon-tupianshangchuan',
  //   key: new Date().getTime(),
  //   model: 'upload_' + new Date().getTime(),
  //   name: '上传组件',
  //   isFormComponent: true,
  //   options: {
  //     defaultValue: [],
  //     disabled: false,
  //     accept: 'image/*',
  //     fileTypeList: [
  //       // {
  //       //   text: '全部',
  //       //   accept: '*',
  //       //   'list-type': 'text'
  //       // },
  //       {
  //         text: '图片',
  //         accept: 'image/*',
  //         'list-type': 'picture-card'
  //       }
  //     ],
  //     'show-file-list': true,
  //     'file-list': [],
  //     'list-type': 'picture-card',
  //     uploadUrl: '',
  //     deleteUrl: ''
  //   }
  // }
];

export const layoutComponents = [
  {
    type: 'grid',
    name: '边框',
    icon: 'anx-icon-grid',
    columns: [
      {
        list: [],
        span: 24
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top'
    }
  },
  {
    type: 'BMI',
    name: 'BMI',
    key: new Date().getTime(),
    heightModel: 'height_' + new Date().getTime(),
    weightModel: 'weight_' + new Date().getTime(),
    BMIModel: 'BMIModel_' + new Date().getTime(),
    heightValue: '',
    weightValue: '',
    BMIValue: '',
    options: {
      dataType: 'string',
      defaultValue: '',
      disabled: false,
      placeholder: '',
      remoteFunc: 'func_' + new Date().getTime(),
      required: false,
      errorTips: '',
      width: '100%'
    }
  }
];

const componentType = {
  basic: 'basicComponent',
  layout: 'layoutComponent',
  customer: 'cusComponent'
};

Object.freeze(componentType);

export const comTypeMap = componentType;
