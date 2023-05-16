<template>
  <div>
    <ProLayout>
      <template #title>患者中心</template>
      <template #main>
        <ProList>
          <template #header>
            <el-input placeholder="患者姓名/手机号" v-model="queryParams.patName" clearable />
            <el-input placeholder="患者姓名/手机号" v-model="queryParams.patName" clearable />
            <el-input placeholder="患者姓名/手机号" v-model="queryParams.patName" clearable />
            <el-input placeholder="患者姓名/手机号" v-model="queryParams.patName" clearable />
            <el-input placeholder="患者姓名/手机号" v-model="queryParams.patName" clearable />
            <el-input placeholder="患者姓名/手机号" v-model="queryParams.patName" clearable />
          </template>
          <template #actions>
            <el-button type="primary">搜索</el-button>
            <el-button>重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary">批量纳入</el-button>
            <el-button> 批量暂不管理 </el-button>
            <div class="alert" v-if="multipleSelection.length">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选中{{ multipleSelection.length }}项</div>
              <el-button type="text" style="margin: 0 5px 0 5px"> 清空 </el-button>
            </div>
          </template>
          <ProTable select :table-list="tableData" :header="header" height="500"></ProTable>
          <!-- <el-table ref="singleTable" :data="patientList" border>
            <el-table-column
              type="selection"
              width="40"
              :reserve-selection="true"
            />
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column label="来源" prop="admTypeDesc" width="50" />
            <el-table-column label="申请时间" prop="applyDate" width="180" />
            <el-table-column label="上次处理时间" prop="moddate" width="180" />
            <el-table-column label="暂不管理原因" prop="reason" width="180" />
            <el-table-column label="门诊/住院号" prop="caseNo" width="130" />
            <el-table-column label="姓名" prop="patName" width="100" />
            <el-table-column label="性别" prop="sexDesc" width="50" />
            <el-table-column label="年龄" prop="age" width="60" />
            <el-table-column label="联系电话" prop="phoneNo" width="120" />
            <el-table-column
              label="诊断"
              prop="diagnosesStr"
              min-width="180"
              show-overflow-tooltip
            />
            <el-table-column
              label="慢病种类"
              min-width="180"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.richDiseaseName">{{
                  scope.row.richDiseaseName
                }}</span>
                <span v-else>/</span>
              </template>
            </el-table-column>
            <el-table-column label="申请时间" prop="applyDate" width="180" />
            <el-table-column
              label="申请科室"
              prop="applyDeptDesc"
              width="110"
            />
            <el-table-column label="申请医生" prop="applyDrName" width="100" />
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="onIncludeManage(scope.row)">
                  纳入
                </el-button>
                <el-button type="text" @click="onNotManage(scope.row)">
                  暂不管理
                </el-button>
              </template>
            </el-table-column>
          </el-table> -->
        </ProList>
      </template>
    </ProLayout>
    <!-- <PatientInfoCard :patientInfo="{}"></PatientInfoCard> -->
    <!-- <FollowUpDetail
      followUpName="高血压随访"
      :activities="[
        { timestamp: '2021-10-09', type: '', person: '' },
        { timestamp: '2021-07-09', type: '电话随访', person: '李树' },
      ]"
      :formTabDatas="[{ label: '高血压随访服务表单1', name: '高血压随访服务表单1' }]"
      :activeTabForm="'高血压随访服务表单1'"
      :anxFormData="anxFormData"
      @form-submit="handleSubmit"
      showBottomActions
      isDisabed
      followUpTime=""
    ></FollowUpDetail> -->
  </div>
</template>

<script>
import { ProList, ProLayout, ProTable, PatientInfoCard } from '../../packages/index'
export default {
  components: {
    ProList,
    ProLayout,
    ProTable,
    PatientInfoCard,
  },
  data() {
    return {
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
              width: '100%',
            },
            remoteFunc: 'func_1591941129225',
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
              width: '100%',
            },
            remoteFunc: 'func_1591941129693',
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
                { label: 'Option 3', value: 'Option 3' },
              ],
              props: { label: 'label', value: 'value' },
              remote: false,
              remoteFunc: 'func_1591941122766',
              remoteOptions: [],
              required: false,
              errorTips: '',
              showLabel: false,
              width: '100%',
            },
            remoteFunc: 'func_1591941132531',
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
              width: '100%',
            },
            remoteFunc: 'func_1591941134545',
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
                { label: 'Option 3', value: 'Option 3' },
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
              width: '100%',
            },
            remoteFunc: 'func_1591941135242',
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
                      width: '100%',
                    },
                    remoteFunc: 'func_1591941141834',
                  },
                ],
                span: 12,
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
                      width: '100%',
                    },
                    remoteFunc: 'func_1591941146156',
                  },
                ],
                span: 12,
              },
            ],
            options: { gutter: 0, justify: 'start', align: 'top' },
            key: 1591941138317,
            model: 'grid_1591941138317',
            remoteFunc: 'func_1591941138317',
          },
          {
            type: 'grid',
            name: '栅格布局',
            icon: 'anx-icon-H-',
            columns: [
              {
                list: [
                  {
                    type: 'date',
                    icon: 'anx-icon-riqi1',
                    key: 1592467684843,
                    model: 'date_1592467684843',
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
                      remoteFunc: 'func_1592467664618',
                      required: false,
                      errorTips: '',
                      startPlaceholder: '',
                      timestamp: false,
                      type: 'date',
                      width: '100%',
                    },
                    remoteFunc: 'func_1592467684843',
                  },
                ],
                span: 12,
              },
              { list: [], span: 12 },
            ],
            options: { gutter: 0, justify: 'start', align: 'top' },
            key: 1592467683189,
            model: 'grid_1592467683189',
            remoteFunc: 'func_1592467683189',
          },
        ],
        formConfig: {
          width: '90%',
          size: 'small',
          labelPosition: 'right',
          labelWidth: 100,
          showNativeSave: false,
        },
      },
      queryParams: {},
      multipleSelection: [],
      patientList: [],
      header: [
        { prop: 'w', label: 'w' },
        {
          prop: 'x',
          label: 'x',
          formatter: (row) => {
            return row.x.toFixed(3)
          },
        },
        {
          prop: 'd',
          label: 'd',
          formatter: (row) => {
            if (row.d) {
              return row.d.toFixed(2)
            } else {
              return '/'
            }
          },
        },
        {
          label: '操作',
          render: (h, data) => {
            return (
              <el-button
                type="primary"
                onClick={() => {
                  this.handleClick(data.row)
                }}
              >
                点我获取行数据
              </el-button>
            )
          },
        },
      ],
      tableData: [
        { w: 1, x: 99.25123, d: '' },
        { w: 1, x: 255.6666, d: 0.99134 },
      ],
    }
  },
  methods: {
    handleClick(row) {
      // console.log(row)
    },
    handleSubmit(data) {},
  },
}
</script>

<style lang="scss" scoped></style>
