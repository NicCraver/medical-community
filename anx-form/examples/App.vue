<template>
  <div id="app">
    <AnxFormMaking
      @create-json="createJson"
      width="90%"
      size="small"
      :anxFormData="anxFormData000"
      :cusComponents="cusComponents"
      @createCusCom="createCusCom"
      :baseUrl="'http://124.196.7.86:7001/ygt-followup'"
    />
    <!-- <anx-form
      :baseUrl="'http://124.196.7.86:7000/ygt-followup'"
      :anxFormData="anxFormData"
      @form-submit="handleSubmit"
      @on-submit="onMobileSubmit"
      :echoData="echoData"
      :isMobile="true"
      ref="anxForm"
    />
    <div style="text-align: center;margin-bottom: 20px">
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      echoData: {},
      anxFormData: {},
      anxFormData1: {},
      anxFormData000: {},
      cusComponents: [
        {
          category: 'mRS评分',
          classificationId: 'a1e60dad9cca405cb47bed1fa720b347',
          components: [
            {
              name: 'mRS评分',
              id: '68a72ad00195471294c31b655df9f164',
              type: 'cusComponent',
              list: [
                {
                  remoteFunc: 'func_1643010902894',
                  isFormComponent: true,
                  icon: 'anx-icon-danxuankuangxuanzhong',
                  name: '1.目前mRS评分',
                  options: {
                    remoteFunc: 'func_1643010711257',
                    errorTips: '',
                    defaultValue: '',
                    remoteOptions: [],
                    imageOptions: [],
                    remote: false,
                    required: false,
                    showLabel: false,
                    props: { label: 'label', value: 'value' },
                    inline: false,
                    uploadUrl: '',
                    sourceType: 'static',
                    options: [
                      { label: '完全无症状', value: '1' },
                      {
                        label:
                          '尽管有症状，但无明显功能障碍；能完成所有日常工作和生活。',
                        value: '2'
                      },
                      {
                        label:
                          '轻度残疾；不能完成病前所有活动，但不需要帮助能照料自己的日常事务。',
                        value: '3'
                      },
                      {
                        label: '中度残疾；需部分帮助，但能独立行走。',
                        value: '4'
                      },
                      {
                        label: '中重度残疾；不能独立行走，日常生活需别人帮助。',
                        value: '5'
                      },
                      {
                        label:
                          '重度残疾；卧床，二便失禁，日常生活完全依赖他人。',
                        value: '6'
                      },
                      { label: '死亡', value: '7' }
                    ],
                    width: '100%',
                    disabled: false,
                    deleteUrl: ''
                  },
                  mobileType: 'select',
                  model: 'radio_1643010902894',
                  id: 'anx-form-1643010902894',
                  type: 'radio',
                  key: 1643010902894
                }
              ]
            }
          ]
        }
      ]
    };
  },
  mounted() {
    setTimeout(() => {
      this.echoData = {
        BMIModel__1644400443511: '24.9',
        height_1644400443511: '190',
        weight_1644400443511: '90'
      };
    }, 500);
    // this.echoData1 = {
    //   select_1592381140791: 2,
    //   select_1592381161356: 2,
    //   select_1592381173244: 3
    // };
    // this.anxFormData = {};
    this.anxFormData = {};
    this.anxFormData000 = {
      formComponentList: [
        {
          remoteFunc: 'func_1644400387631',
          isFormComponent: false,
          icon: 'anx-icon-H-',
          name: '自动回显测试模板',
          options: {
            remoteFunc: 'func_1644399826127',
            errorTips: '',
            defaultValue: '一级标题',
            dataType: 'string',
            width: '100%',
            align: 'center',
            required: false
          },
          model: 'h1_1644400387631',
          id: 'anx-form-1644400387630',
          type: 'h1',
          key: 1644400387630
        },
        {
          remoteFunc: 'func_1644400404096',
          isFormComponent: true,
          icon: 'anx-icon-danhangwenben',
          name: '1.单行文本',
          options: {
            remoteFunc: 'func_1644399826127',
            errorTips: '',
            defaultValue: '',
            dataType: 'string',
            width: '100%',
            disabled: false,
            placeholder: '',
            required: false
          },
          model: 'input_1',
          id: 'anx-form-1644400404096',
          type: 'input',
          key: 1644400404096
        },
        {
          remoteFunc: 'func_1644400406785',
          isFormComponent: true,
          icon: 'anx-icon-danxuankuangxuanzhong',
          name: '2.单选框组',
          options: {
            remoteFunc: 'func_1644399826127',
            errorTips: '',
            defaultValue: '',
            remoteOptions: [],
            imageOptions: [],
            remote: false,
            required: false,
            showLabel: false,
            props: { label: 'label', value: 'value' },
            inline: false,
            uploadUrl: '',
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            width: '100%',
            disabled: false,
            deleteUrl: ''
          },
          mobileType: 'select',
          model: 'radio_2',
          id: 'anx-form-1644400406785',
          type: 'radio',
          key: 1644400406785
        },
        {
          remoteFunc: 'func_1644400750546',
          isFormComponent: true,
          icon: 'anx-icon-danxuankuangxuanzhong',
          name: '3.单选框组',
          options: {
            remoteFunc: 'func_1644400635694',
            errorTips: '',
            defaultValue: '',
            remoteOptions: [],
            imageOptions: [],
            remote: false,
            required: false,
            showLabel: false,
            props: { label: 'label', value: 'value' },
            inline: false,
            uploadUrl: '',
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            width: '100%',
            disabled: false,
            deleteUrl: ''
          },
          mobileType: 'radio',
          model: 'radio_3',
          id: 'anx-form-1644400750546',
          type: 'radio',
          key: 1644400750546
        },
        {
          remoteFunc: 'func_1644400408848',
          isFormComponent: true,
          icon: 'anx-icon-danxuankuangxuanzhong',
          inputModel: 'whether_4_input',
          name: '4.单选框组(是否)',
          options: {
            remoteFunc: 'func_1644399826127',
            errorTips: '',
            defaultValue: '',
            remoteOptions: [],
            imageOptions: [],
            remote: false,
            required: false,
            showLabel: false,
            props: { label: 'label', value: 'value' },
            inline: false,
            uploadUrl: '',
            sourceType: 'static',
            options: [
              { label: '是', value: '1' },
              { label: '否', value: '2' }
            ],
            width: '100%',
            disabled: false,
            deleteUrl: ''
          },
          model: 'whether_4',
          inputType: '1',
          id: 'anx-form-1644400408848',
          type: 'whether',
          key: 1644400408848,
          inputDefaultValue: ''
        },
        {
          remoteFunc: 'func_1644400752573',
          isFormComponent: true,
          icon: 'anx-icon-duoxuankuang1',
          name: '5.多选框组',
          options: {
            remoteFunc: 'func_1644400635694',
            errorTips: '',
            defaultValue: [],
            remoteOptions: [],
            imageOptions: [],
            remote: false,
            required: false,
            showLabel: false,
            props: { label: 'label', value: 'value' },
            inline: false,
            uploadUrl: '',
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            width: '100%',
            disabled: false,
            deleteUrl: ''
          },
          mobileType: 'checkbox',
          model: 'checkbox_5',
          id: 'anx-form-1644400752573',
          type: 'checkbox',
          key: 1644400752573
        },
        {
          remoteFunc: 'func_1644400410855',
          isFormComponent: true,
          icon: 'anx-icon-duoxuankuang1',
          name: '6.多选框组',
          options: {
            remoteFunc: 'func_1644399826127',
            errorTips: '',
            defaultValue: [],
            remoteOptions: [],
            imageOptions: [],
            remote: false,
            required: false,
            showLabel: false,
            props: { label: 'label', value: 'value' },
            inline: false,
            uploadUrl: '',
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            width: '100%',
            disabled: false,
            deleteUrl: ''
          },
          mobileType: 'select',
          model: 'checkbox_66',
          id: 'anx-form-1644400410855',
          type: 'checkbox',
          key: 1644400410855
        },
        {
          remoteFunc: 'func_1644400413322',
          isFormComponent: true,
          icon: 'anx-icon-duoxuankuang1',
          inputModel: 'checkboxOther_7_input',
          name: '7.多选框组(无/其他)',
          options: {
            remoteFunc: 'func_1644399826127',
            errorTips: '',
            defaultValue: [],
            remoteOptions: [],
            imageOptions: [],
            remote: false,
            required: false,
            showLabel: false,
            props: { label: 'label', value: 'value' },
            inline: false,
            uploadUrl: '',
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' },
              { label: '无', value: '无' },
              { label: '其他', value: '其他' }
            ],
            width: '100%',
            disabled: false,
            deleteUrl: '',
            placeholder: ''
          },
          model: 'checkboxOther_7',
          id: 'anx-form-1644400413322',
          type: 'checkboxOther',
          key: 1644400413322,
          inputDefaultValue: ''
        },
        {
          remoteFunc: 'func_1644400415099',
          isFormComponent: true,
          icon: 'anx-icon-riqi1',
          name: '8.日期选择器',
          options: {
            remoteFunc: 'func_1644399826127',
            clearable: true,
            errorTips: '',
            defaultValue: '',
            editable: true,
            format: 'yyyy-MM-dd',
            type: 'date',
            required: false,
            readonly: false,
            startPlaceholder: '',
            width: '100%',
            disabled: false,
            placeholder: '请输入例：2000-01-01或选择',
            endPlaceholder: '',
            timestamp: false
          },
          model: 'date_8',
          id: 'anx-form-1644400415099',
          type: 'date',
          key: 1644400415099
        },
        {
          remoteFunc: 'func_1644400429972',
          name: '用药（多选）',
          model: 'cusComponent_1644400429972',
          id: 'anx-form-1644400429972',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638250552216',
              isFormComponent: true,
              icon: 'anx-icon-xialakuang',
              name: '9.用药',
              options: {
                remoteFunc: 'func_1638250403719',
                filterable: true,
                clearable: true,
                errorTips: '',
                defaultValue: [],
                remoteOptions: [],
                multiple: true,
                casModel: '',
                remote: true,
                requestParam: '',
                required: false,
                showLabel: false,
                props: { label: 'label', value: 'value' },
                options: [
                  { label: 'Option 1', value: 'Option 1' },
                  { label: 'Option 2', value: 'Option 2' },
                  { label: 'Option 3', value: 'Option 3' }
                ],
                width: '100%',
                disabled: false,
                remoteURL:
                  '/tbMbFollowOrder/getOrdersForSelect?orderDesc=&orderCode=',
                placeholder: '',
                'allow-create': true
              },
              model: 'drug_9',
              id: 'anx-form-1638250552216',
              type: 'drug',
              key: 3282650982188
            }
          ],
          key: 1644400429972
        },
        {
          remoteFunc: 'func_1644400443511',
          type: 'BMI',
          weightValue: '',
          weightModel: 'weight_1644400443511',
          name: 'BMI',
          options: {
            remoteFunc: 'func_1644399826127',
            errorTips: '',
            defaultValue: '',
            dataType: 'string',
            width: '100%',
            disabled: false,
            placeholder: '',
            required: false
          },
          heightModel: 'height_1644400443511',
          heightValue: '',
          model: 'BMI_1644400443511',
          BMIModel: 'BMIModel__1644400443511',
          BMIValue: '',
          id: 'anx-form-1644400443511',
          key: 1644400443511
        },
        {
          remoteFunc: 'func_1644400440394',
          columns: [
            {
              list: [
                {
                  remoteFunc: 'func_1644400447990',
                  isFormComponent: true,
                  icon: 'anx-icon-danhangwenben',
                  name: '10.单行文本',
                  options: {
                    remoteFunc: 'func_1644399826127',
                    errorTips: '',
                    defaultValue: '',
                    dataType: 'string',
                    width: '100%',
                    disabled: false,
                    placeholder: '',
                    required: false
                  },
                  model: 'input_10',
                  id: 'anx-form-1644400447990',
                  type: 'input',
                  key: 1644400447990
                },
                {
                  remoteFunc: 'func_1644400450735',
                  isFormComponent: true,
                  icon: 'anx-icon-danxuankuangxuanzhong',
                  inputModel: 'whether_11_input',
                  name: '11单选框组(是否)',
                  options: {
                    remoteFunc: 'func_1644399826127',
                    errorTips: '',
                    defaultValue: '',
                    remoteOptions: [],
                    imageOptions: [],
                    remote: false,
                    required: false,
                    showLabel: false,
                    props: { label: 'label', value: 'value' },
                    inline: false,
                    uploadUrl: '',
                    sourceType: 'static',
                    options: [
                      { label: '是', value: '1' },
                      { label: '否', value: '2' }
                    ],
                    width: '100%',
                    disabled: false,
                    deleteUrl: ''
                  },
                  model: 'whether_11',
                  inputType: '1',
                  id: 'anx-form-1644400450735',
                  type: 'whether',
                  key: 1644400450735,
                  inputDefaultValue: ''
                }
              ],
              span: 24
            }
          ],
          name: '边框',
          icon: 'anx-icon-grid',
          options: { gutter: 0, justify: 'start', align: 'top' },
          model: 'grid_1644400440394',
          id: 'anx-form-1644400440394',
          type: 'grid',
          key: 1644400440394
        }
      ],
      formConfig: {
        size: 'small',
        labelPosition: 'top',
        width: '90%',
        showNativeSave: false,
        labelWidth: 100
      },
      returnList: [
        { name: '自动回显测试模板', key: 'h1_1644400387631' },
        { name: '1.单行文本', key: 'input_1' },
        { name: '2.单选框组', key: 'radio_2' },
        { name: '3.单选框组', key: 'radio_3' },
        { name: '4.单选框组(是否)', key: 'whether_4' },
        { name: '5.多选框组', key: 'checkbox_5' },
        { name: '6.多选框组', key: 'checkbox_66' },
        { name: '7.多选框组(无/其他)', key: 'checkboxOther_7' },
        { name: '8.日期选择器', key: 'date_8' },
        { name: '9.用药', key: 'drug_9' },
        { name: '身高', key: 'height_1644400443511' },
        { name: '体重', key: 'weight_1644400443511' },
        { name: 'BMI', key: 'BMIModel__1644400443511' },
        { name: '10.单行文本', key: 'input_10' },
        { name: '11单选框组(是否)', key: 'whether_11' }
      ]
    };
    this.anxFormData1 = {
      formComponentList: [
        {
          remoteFunc: 'func_1638342592490',
          isFormComponent: false,
          icon: 'anx-icon-H-',
          name: '高血压随访',
          options: {
            remoteFunc: 'func_1638342550997',
            errorTips: '',
            defaultValue: '一级标题',
            dataType: 'string',
            width: '100%',
            align: 'center',
            required: false
          },
          model: 'h1_1638342592490',
          id: 'anx-form-1638342592490',
          type: 'h1',
          key: 1638342592490
        },
        {
          remoteFunc: 'func_1638342614375',
          name: '吸烟（单选）',
          model: 'cusComponent_1638342614375',
          id: 'anx-form-1638342614375',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638240957492',
              isFormComponent: true,
              icon: 'anx-icon-danxuankuangxuanzhong',
              name: '吸烟',
              options: {
                remoteFunc: 'func_1638240660676',
                errorTips: '',
                defaultValue: '',
                remoteOptions: [],
                imageOptions: [],
                remote: false,
                required: true,
                showLabel: false,
                props: { label: 'label', value: 'value' },
                inline: false,
                uploadUrl: '',
                sourceType: 'static',
                options: [
                  { label: '不吸烟', value: '1' },
                  { label: '年限>=5年', value: '2' },
                  { label: '已戒烟', value: '3' }
                ],
                width: '100%',
                disabled: false,
                deleteUrl: ''
              },
              mobileType: 'select',
              model: 'radio_1638240957492',
              id: 'anx-form-1638240957492',
              type: 'radio',
              key: 3276583571867
            }
          ],
          key: 1638342614375
        },
        {
          remoteFunc: 'func_1638342623328',
          name: '饮酒（单选）',
          model: 'cusComponent_1638342623328',
          id: 'anx-form-1638342623328',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638250850673',
              isFormComponent: true,
              icon: 'anx-icon-danxuankuangxuanzhong',
              name: '饮酒',
              options: {
                remoteFunc: 'func_1638250403719',
                errorTips: '',
                defaultValue: '',
                remoteOptions: [],
                imageOptions: [],
                remote: false,
                required: true,
                showLabel: false,
                props: { label: 'label', value: 'value' },
                inline: false,
                uploadUrl: '',
                sourceType: 'static',
                options: [
                  { label: '不饮酒', value: '1' },
                  { label: '年限>=5年', value: '2' },
                  { label: '已戒酒', value: '3' }
                ],
                width: '100%',
                disabled: false,
                deleteUrl: ''
              },
              mobileType: 'select',
              model: 'radio_1638250850673',
              id: 'anx-form-1638250850673',
              type: 'radio',
              key: 3276593474001
            }
          ],
          key: 1638342623328
        },
        {
          remoteFunc: 'func_1638342632024',
          name: '饮食习惯（复选）',
          model: 'cusComponent_1638342632024',
          id: 'anx-form-1638342632024',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638250922198',
              isFormComponent: true,
              icon: 'anx-icon-duoxuankuang1',
              name: '饮食习惯',
              options: {
                remoteFunc: 'func_1638250403719',
                errorTips: '',
                defaultValue: [],
                remoteOptions: [],
                imageOptions: [],
                remote: false,
                required: true,
                showLabel: false,
                props: { label: 'label', value: 'value' },
                inline: false,
                uploadUrl: '',
                sourceType: 'static',
                options: [
                  { label: '清单饮食', value: '1' },
                  { label: '高盐饮食', value: '2' },
                  { label: '素食', value: '3' },
                  { label: '荤食', value: '4' }
                ],
                width: '100%',
                disabled: false,
                deleteUrl: ''
              },
              mobileType: 'select',
              model: 'checkbox_1638250922198',
              id: 'anx-form-1638250922198',
              type: 'checkbox',
              key: 3276593554222
            }
          ],
          key: 1638342632024
        },
        {
          remoteFunc: 'func_1638342642920',
          name: '平时血压（mmHg）',
          model: 'cusComponent_1638342642920',
          id: 'anx-form-1638342642920',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638250993140',
              isFormComponent: true,
              icon: 'anx-icon-danhangwenben',
              name: '平时血压',
              options: {
                remoteFunc: 'func_1638250403719',
                errorTips: '',
                defaultValue: '',
                dataType: 'string',
                width: '100%',
                disabled: false,
                placeholder: 'mmHg',
                required: true
              },
              model: 'input_1638250993140',
              id: 'anx-form-1638250993140',
              type: 'input',
              key: 3276593636060
            }
          ],
          key: 1638342642920
        },
        {
          remoteFunc: 'func_1638342681676',
          name: '用药（多选）',
          model: 'cusComponent_1638342681676',
          id: 'anx-form-1638342681676',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638250552216',
              isFormComponent: true,
              icon: 'anx-icon-xialakuang',
              name: '用药',
              options: {
                remoteFunc: 'func_1638250403719',
                filterable: true,
                clearable: true,
                errorTips: '',
                defaultValue: [],
                remoteOptions: [],
                multiple: true,
                casModel: '',
                remote: true,
                requestParam: '',
                required: true,
                showLabel: false,
                props: { label: 'label', value: 'value' },
                options: [
                  { label: 'Option 1', value: 'Option 1' },
                  { label: 'Option 2', value: 'Option 2' },
                  { label: 'Option 3', value: 'Option 3' }
                ],
                width: '100%',
                disabled: false,
                remoteURL:
                  'http://124.196.7.86:7000/ygt-followup/tbMbFollowOrder/getOrdersForSelect?orderDesc=&orderCode=',
                placeholder: '',
                'allow-create': true
              },
              model: 'drug_1638250552216',
              id: 'anx-form-1638250552216',
              type: 'drug',
              key: 8191621165270
            }
          ],
          key: 1638342681676
        },
        {
          remoteFunc: 'func_1638342699703',
          name: '高血压（症状）',
          model: 'cusComponent_1638342699703',
          id: 'anx-form-1638342699703',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638258575654',
              isFormComponent: true,
              icon: 'anx-icon-duoxuankuang1',
              inputModel: '其他1638258524018',
              name: '症状',
              options: {
                remoteFunc: 'func_1638258524018',
                errorTips: '',
                defaultValue: [],
                remoteOptions: [],
                imageOptions: [],
                remote: false,
                required: true,
                showLabel: false,
                props: { label: 'label', value: 'value' },
                inline: false,
                uploadUrl: '',
                sourceType: 'static',
                options: [
                  { label: '头疼', value: '1' },
                  { label: '头晕', value: '2' }
                ],
                width: '100%',
                disabled: false,
                deleteUrl: ''
              },
              model: 'checkboxOther_1638258575654',
              id: 'anx-form-1638258575654',
              type: 'checkboxOther',
              key: 3276601275357,
              inputDefaultValue: ''
            }
          ],
          key: 1638342699703
        },
        {
          remoteFunc: 'func_1638342743560',
          name: '就医次数（单选）',
          model: 'cusComponent_1638342743560',
          id: 'anx-form-1638342743560',
          type: 'cusComponent',
          list: [
            {
              remoteFunc: 'func_1638262558895',
              isFormComponent: true,
              icon: 'anx-icon-danxuankuangxuanzhong',
              name: '就医次数',
              options: {
                remoteFunc: 'func_1638260964098',
                errorTips: '',
                defaultValue: '',
                remoteOptions: [],
                imageOptions: [],
                remote: false,
                required: false,
                showLabel: false,
                props: { label: 'label', value: 'value' },
                inline: false,
                uploadUrl: '',
                sourceType: 'static',
                options: [
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                  { label: '3', value: '3' },
                  { label: '4', value: '4' },
                  { label: '5', value: '5' },
                  { label: '6', value: '6' },
                  { label: '7', value: '7' },
                  { label: '8', value: '8' },
                  { label: '9', value: '9' },
                  { label: '10', value: '10' }
                ],
                width: '100%',
                disabled: false,
                deleteUrl: ''
              },
              model: 'radio_1638262558895',
              id: 'anx-form-1638262558895',
              type: 'radio',
              key: 3276605302455,
              mobileType: 'select'
            }
          ],
          key: 1638342743560
        },
        {
          remoteFunc: 'func_1638342755854',
          isFormComponent: true,
          icon: 'anx-icon-duohangwenben',
          name: '健康指导',
          options: {
            remoteFunc: 'func_1638342550997',
            errorTips: '',
            defaultValue:
              '1.了解高血压病的知识，合理安排生活，注意劳逸结合，定期测量血压。\n2.高血压需坚持长期规则治疗和保健护理，保持血压接近正常水平防止对脏器的进一步损害。不要随意添加或停用药物。\n3、提高社会适应能力，维持心理平衡，避免各种不良刺激的影\n4、注意饮食控制与调节，减少钠盐、动物脂肪的摄入，忌烟、酒。\n5、保持大便通畅，必要时服用缓泻剂。\n6、适当参与运动，以不引起心慌、脉搏明显增快为宜。\n7、定期随访，血压持续升高或出现头晕、头痛、恶心等症状时，应及时就医。',
            width: '100%',
            disabled: false,
            placeholder: '',
            required: false
          },
          model: 'textarea_1638342755854',
          id: 'anx-form-1638342755854',
          type: 'textarea',
          key: 1638342755854
        }
      ],
      formConfig: {
        width: '90%',
        size: 'small',
        labelPosition: 'top',
        labelWidth: 100,
        showNativeSave: false
      }
    };
    this.anxFormData12 = {
      formComponentList: [
        {
          type: 'checkboxOther',
          icon: 'anx-icon-duoxuankuang1',
          key: 1640335901177,
          model: 'checkboxOther_症状',
          inputModel: '其他症状',
          inputDefaultValue: '',
          name: '症状',
          isFormComponent: true,
          options: {
            placeholder: '',
            defaultValue: [],
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: '头晕', value: 'Option 11' },
              { label: '头疼', value: 'Option 22' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640335706908',
            remoteOptions: [],
            required: true,
            errorTips: '请选择症状',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640335901177',
          remoteFunc: 'func_1640335901177'
        },
        {
          type: 'whether',
          icon: 'anx-icon-danxuankuangxuanzhong',
          key: 1640509001786,
          model: 'whether_药物不良方式',
          inputModel: '药物不良方式详情',
          inputDefaultValue: '',
          name: '药物不良方式',
          inputType: '2',
          isFormComponent: true,
          options: {
            defaultValue: '',
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: '是', value: '1' },
              { label: '否', value: '2' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640335706908',
            remoteOptions: [],
            required: true,
            errorTips: '',
            showLabel: false,
            width: '100%',
            placeholder: '过敏药名+日期+文字描述'
          },
          id: 'anx-form-1640509001786',
          remoteFunc: 'func_1640509001786'
        },
        {
          type: 'checkbox',
          icon: 'anx-icon-duoxuankuang1',
          key: 1640586968576,
          model: '多选框组',
          name: '多选框组',
          mobileType: 'select',
          isFormComponent: true,
          options: {
            defaultValue: [],
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640586952532',
            remoteOptions: [],
            required: true,
            errorTips: '请选择多选框组',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640586968576',
          remoteFunc: 'func_1640586968576'
        }
      ]
    };
    this.anxFormData11 = {
      formComponentList: [
        {
          type: 'h1',
          icon: 'anx-icon-H-',
          key: 1640335741392,
          name: '一级标题',
          isFormComponent: false,
          options: {
            dataType: 'string',
            defaultValue: '一级标题',
            remoteFunc: 'func_1640335706908',
            required: false,
            errorTips: '',
            width: '100%',
            align: 'center'
          },
          id: 'anx-form-1640335741392',
          model: 'h1_1640335741392',
          remoteFunc: 'func_1640335741392'
        },
        {
          type: 'input',
          icon: 'anx-icon-danhangwenben',
          key: 1640586595745,
          model: '单行文本',
          name: '单行文本',
          isFormComponent: true,
          options: {
            dataType: 'string',
            defaultValue: '',
            disabled: false,
            placeholder: '请输入单行文本',
            remoteFunc: 'func_1640586585435',
            required: false,
            errorTips: '',
            width: '100%'
          },
          id: 'anx-form-1640586595745',
          remoteFunc: 'func_1640586595745'
        },
        {
          type: 'textarea',
          icon: 'anx-icon-duohangwenben',
          key: 1640586022073,
          model: '多行文本',
          name: '多行文本',
          isFormComponent: true,
          options: {
            defaultValue: '',
            disabled: false,
            placeholder: '请输入多行文本',
            remoteFunc: 'func_1640585986599',
            required: true,
            errorTips: '请输入多行文本',
            width: '100%'
          },
          id: 'anx-form-1640586022073',
          remoteFunc: 'func_1640586022073'
        },
        {
          type: 'checkbox',
          icon: 'anx-icon-duoxuankuang1',
          key: 1640586968576,
          model: '多选框组',
          name: '多选框组',
          mobileType: 'checkbox',
          isFormComponent: true,
          options: {
            defaultValue: [],
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640586952532',
            remoteOptions: [],
            required: true,
            errorTips: '请选择多选框组',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640586968576',
          remoteFunc: 'func_1640586968576'
        },
        {
          type: 'radio',
          icon: 'anx-icon-danxuankuangxuanzhong',
          key: 1640586846540,
          model: '单选框组',
          name: '单选框组',
          mobileType: 'radio',
          isFormComponent: true,
          options: {
            defaultValue: '',
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640586671210',
            remoteOptions: [],
            required: true,
            errorTips: '请选择单选框组',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640586846540',
          remoteFunc: 'func_1640586846541'
        },
        {
          type: 'input',
          icon: 'anx-icon-danhangwenben',
          key: 1640335795687,
          model: '收缩压（高压）',
          name: '收缩压（高压）',
          isFormComponent: true,
          options: {
            dataType: 'string',
            defaultValue: '',
            disabled: false,
            placeholder: 'mmHg',
            remoteFunc: 'func_1640335706908',
            required: true,
            errorTips: '',
            width: '100%'
          },
          id: 'anx-form-1640335795687',
          remoteFunc: 'func_1640335795687'
        },
        {
          type: 'input',
          icon: 'anx-icon-danhangwenben',
          key: 1640335818991,
          model: '舒张压（低压）',
          name: '舒张压（低压）',
          isFormComponent: true,
          options: {
            dataType: 'string',
            defaultValue: '',
            disabled: false,
            placeholder: 'mmHg',
            remoteFunc: 'func_1640335706908',
            required: true,
            errorTips: '',
            width: '100%'
          },
          id: 'anx-form-1640335818991',
          remoteFunc: 'func_1640335818991'
        },
        {
          type: 'input',
          icon: 'anx-icon-danhangwenben',
          key: 1640335841803,
          model: '心律',
          name: '心律',
          isFormComponent: true,
          options: {
            dataType: 'string',
            defaultValue: '',
            disabled: false,
            placeholder: '次/分钟',
            remoteFunc: 'func_1640335706908',
            required: true,
            errorTips: '',
            width: '100%'
          },
          id: 'anx-form-1640335841803',
          remoteFunc: 'func_1640335841803'
        },
        {
          type: 'checkboxOther',
          icon: 'anx-icon-duoxuankuang1',
          key: 1640335901177,
          model: 'checkboxOther_症状',
          inputModel: '其他症状',
          inputDefaultValue: '',
          name: '症状',
          isFormComponent: true,
          options: {
            placeholder: '',
            defaultValue: [],
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: '头晕', value: 'Option 11' },
              { label: '头疼', value: 'Option 22' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640335706908',
            remoteOptions: [],
            required: true,
            errorTips: '请选择症状',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640335901177',
          remoteFunc: 'func_1640335901177'
        },
        {
          type: 'radio',
          icon: 'anx-icon-danxuankuangxuanzhong',
          key: 1640336094239,
          model: 'radio_移动端样式测试',
          name: '弹出单选',
          mobileType: 'select',
          isFormComponent: true,
          options: {
            defaultValue: '',
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640335706908',
            remoteOptions: [],
            required: true,
            errorTips: '请选择弹出单选',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640336094239',
          remoteFunc: 'func_1640336094239'
        },
        {
          type: 'checkbox',
          icon: 'anx-icon-duoxuankuang1',
          key: 1640509083072,
          model: 'checkbox_移动端样式测试',
          name: '弹出多选',
          mobileType: 'select',
          isFormComponent: true,
          options: {
            defaultValue: [],
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: 'Option 1', value: 'Option 1' },
              { label: 'Option 2', value: 'Option 2' },
              { label: 'Option 3', value: 'Option 3' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640335706908',
            remoteOptions: [],
            required: true,
            errorTips: '请选择弹出多选',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640509083072',
          remoteFunc: 'func_1640509083072'
        },
        {
          type: 'whether',
          icon: 'anx-icon-danxuankuangxuanzhong',
          key: 1640336113844,
          model: 'whether_颈动脉情况',
          inputModel: '颈动脉情况详情',
          inputDefaultValue: '',
          name: '颈动脉情况',
          inputType: '1',
          isFormComponent: true,
          options: {
            defaultValue: '',
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: '是', value: '1' },
              { label: '否', value: '2' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640335706908',
            remoteOptions: [],
            required: true,
            errorTips: '',
            showLabel: false,
            width: '100%',
            placeholder: '请输入颈动脉情况'
          },
          id: 'anx-form-1640336113844',
          remoteFunc: 'func_1640336113844'
        },
        {
          type: 'whether',
          icon: 'anx-icon-danxuankuangxuanzhong',
          key: 1640509001786,
          model: 'whether_药物不良方式',
          inputModel: '药物不良方式详情',
          inputDefaultValue: '',
          name: '药物不良方式',
          inputType: '2',
          isFormComponent: true,
          options: {
            defaultValue: '',
            disabled: false,
            inline: false,
            sourceType: 'static',
            options: [
              { label: '是', value: '1' },
              { label: '否', value: '2' }
            ],
            props: { label: 'label', value: 'value' },
            uploadUrl: '',
            deleteUrl: '',
            imageOptions: [],
            remote: false,
            remoteFunc: 'func_1640335706908',
            remoteOptions: [],
            required: true,
            errorTips: '',
            showLabel: false,
            width: '100%',
            placeholder: '过敏药名+日期+文字描述'
          },
          id: 'anx-form-1640509001786',
          remoteFunc: 'func_1640509001786'
        },
        {
          type: 'select',
          icon: 'anx-icon-xialakuang',
          key: 1640509129065,
          model: 'select_就诊次数',
          name: '就诊次数',
          isFormComponent: true,
          options: {
            clearable: true,
            defaultValue: '',
            disabled: false,
            filterable: false,
            multiple: false,
            options: [
              { label: '1', value: 'Option 1' },
              { label: '2', value: 'Option 2' },
              { label: '3', value: 'Option 3' }
            ],
            placeholder: '',
            props: { label: 'label', value: 'value' },
            remote: false,
            remoteFunc: 'func_1640335706908',
            casModel: '',
            requestParam: '',
            remoteURL: '',
            remoteOptions: [],
            required: true,
            errorTips: '',
            showLabel: false,
            width: '100%'
          },
          id: 'anx-form-1640509129065',
          remoteFunc: 'func_1640509129065'
        },
        {
          type: 'textarea',
          icon: 'anx-icon-duohangwenben',
          key: 1640509284041,
          model: '健康指导',
          name: '健康指导',
          isFormComponent: true,
          options: {
            defaultValue: '健康指导健康指导健康指导健康指导',
            disabled: false,
            placeholder: '请输入健康指导',
            remoteFunc: 'func_1640335706908',
            required: true,
            errorTips: '请输入健康指导',
            width: '100%'
          },
          id: 'anx-form-1640509284041',
          remoteFunc: 'func_1640509284041'
        }
      ],
      formConfig: {
        width: '90%',
        size: 'small',
        labelPosition: 'top',
        labelWidth: 100,
        showNativeSave: false
      }
    };
  },
  methods: {
    onMobileSubmit(row) {
      console.log(`onMobileSubmit`, JSON.stringify(row));
    },
    onSubmit() {
      console.log('getFormInitData', this.$refs.anxForm.getFormInitData());
      console.log('formSubmit', this.$refs.anxForm.formSubmit());
    },
    createJson(row) {
      console.log('createJson', JSON.stringify(row));
    },
    handleSubmit(row) {
      console.log('formData', row);
    },
    aclick() {
      console.log(this.$refs.anxForm.formSubmit());
    },
    createCusCom(row) {
      console.log('row', row);
    }
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
.anxForm {
  background: #000;
}
</style>
