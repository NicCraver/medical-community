<template>
  <div>
    <ProTable :ColumnLists="ColumnLists" :columnState="columnState">
      <template #header>
        <el-input
          placeholder="姓名/手机/身份证/门诊住院号"
          v-model="queryParams.patName"
          style="width: 240px"
          clearable
        />
        <el-select placeholder="申请类型" v-model="queryParams.applyType" clearable>
          <el-option v-for="item in applicationTypes" :key="item.label" :label="item.label" :value="item.value" />
        </el-select>
        <el-select placeholder="诊断" v-model="queryParams.diagnoseId" clearable filterable>
          <el-option v-for="(item, i) in disCategory" :key="item.label + i" :label="item.label" :value="item.label" />
        </el-select>
        <el-select placeholder="慢病种类" v-model="queryParams.diseaseCode" clearable filterable>
          <el-option v-for="item in diseaseTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="queryParams.hosId"
          :parentId="queryParams.orgId"
          placeholder="机构"
        ></OrgHosSelect>
        <!-- <ReferralSelect placeholder="集团" module="publicModule" type="ORG" status="Y" v-model="queryParams.orgId"> </ReferralSelect>
        <ReferralSelect
          placeholder="机构"
          module="publicModule"
          type="ORG_HOS"
          v-model="queryParams.hosId"
          :orgId="queryParams.orgId"
          :disabled="!queryParams.orgId"
          status="Y"
        ></ReferralSelect> -->
        <el-select v-if="joinFlg !== 'N'" placeholder="申请人" v-model="queryParams.applyDrId" clearable filterable>
          <el-option v-for="item in applyDrs" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select
          v-if="joinFlg !== 'N'"
          placeholder="申请科室"
          v-model="queryParams.applyDeptCode"
          clearable
          filterable
        >
          <el-option
            v-for="item in toApplyForTheDepartmentList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-if="joinFlg === 'F'"
          placeholder="是否有异常点"
          v-model="queryParams.outlierFlg"
          clearable
          filterable
        >
          <el-option label="是" value="Y" />
          <el-option label="否" value="N" />
        </el-select>
        <el-date-picker
          v-model="createDateArr"
          type="datetimerange"
          align="right"
          start-placeholder="申请开始日期"
          end-placeholder="申请结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
        <el-select v-if="joinFlg !== 'U'" placeholder="操作人" v-model="queryParams.modUserId" clearable>
          <el-option v-for="item in userList" :key="item.userId" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker
          v-if="joinFlg !== 'U'"
          v-model="modDateArr"
          type="datetimerange"
          align="right"
          start-placeholder="操作开始日期"
          end-placeholder="操作结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire('', 'btn')">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <template #batchActions v-if="(joinFlg === 'U' || joinFlg === 'N') && !$IS_ORG_ADMIN">
        <el-button type="primary" @click="onBatchIncludeManage"> 批量纳入 </el-button>
        <el-button v-if="joinFlg === 'U'" @click="onBatchNotManage"> 批量暂不管理 </el-button>
        <el-button v-if="joinFlg === 'U'" @click="addFun"> 导入 </el-button>
        <div class="alert" v-if="multipleSelection.length">
          <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
          <div style="margin: 0 5px 0 5px">已选中{{ multipleSelection.length }}项</div>
          <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
        </div>
      </template>
      <div v-loading="loading">
        <el-table
          ref="singleTable"
          v-adaptive="{ bottomOffset: 75 }"
          height="0"
          :data="patientList"
          border
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
        >
          <template slot="empty"> {{ emptyText }} </template>
          <el-table-column
            :key="Math.random()"
            v-if="(joinFlg === 'U' || joinFlg === 'N') && !$IS_ORG_ADMIN"
            type="selection"
            width="40"
            :reserve-selection="true"
          />
          <el-table-column v-if="isShowColumn('index')" label="序号" type="index" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="isShowColumn('applyTypeDesc')"
            label="申请类型"
            :key="Math.random()"
            prop="applyTypeDesc"
            width="100"
          />

          <el-table-column
            v-if="isShowColumn('dataSource')"
            label="来源"
            :key="Math.random()"
            prop="dataSource"
            min-width="140"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isShowColumn('caseNo')"
            label="门诊/住院号"
            :key="Math.random()"
            prop="caseNo"
            width="130"
          />
          <el-table-column v-if="isShowColumn('name')" label="姓名" :key="Math.random()" prop="name" width="100">
            <!-- <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <div>{{ scope.row.name }}</div>
                <el-tooltip placement="top">
                  <div slot="content">
                    门诊号： {{ scope.row.caseNo }}<br />
                    诊 断： {{ scope.row.diagnosesStr }}<br />
                    申请科室： {{ scope.row.applyDeptDesc }}<br />
                  </div>
                  <IconSvg v-if="TableMode !== 'all' && scope.row.applyTypeDesc === '医生建档'" iconClass="hint" width="14" style="margin: 0 0 0 5px; cursor: pointer" />
                </el-tooltip>
              </div>
            </template> -->
          </el-table-column>
          <el-table-column v-if="isShowColumn('sexDesc')" label="性别" :key="Math.random()" prop="sexDesc" width="60" />
          <el-table-column v-if="isShowColumn('age')" label="年龄" :key="Math.random()" prop="age" width="60" />
          <el-table-column
            v-if="isShowColumn('phoneNo')"
            label="手机号"
            :key="Math.random()"
            prop="phoneNo"
            width="140"
          />
          <el-table-column v-if="isShowColumn('idNo')" label="身份证号" :key="Math.random()" prop="idNo" width="190" />
          <el-table-column
            v-if="isShowColumn('diagnosesStr')"
            label="诊断"
            :key="Math.random()"
            prop="diagnosesStr"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isShowColumn('richDiseaseName')"
            label="慢病种类"
            :key="Math.random()"
            prop="richDiseaseName"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column v-if="isShowColumn('idNoOutlierTot') && joinFlg === 'F'" label="是否有异常点" width="135">
            <template slot-scope="scope">
              {{ scope.row.idNoOutlierTot > 0 || scope.row.phoneOutlierTot > 0 ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="isShowColumn('applyDrName')"
            label="申请人"
            :key="Math.random()"
            prop="applyDrName"
            width="160"
          />
          <el-table-column label="申请机构" :key="Math.random()" prop="hosDesc" width="200" />
          <el-table-column
            v-if="isShowColumn('applyDeptDesc')"
            label="申请科室"
            :key="Math.random()"
            prop="applyDeptDesc"
            width="110"
          />
          <el-table-column
            v-if="isShowColumn('applyDate')"
            label="申请时间"
            :key="Math.random()"
            prop="applyDate"
            width="180"
          />
          <el-table-column
            v-if="isShowColumn('modUserName') && (joinFlg === 'F' || joinFlg === 'Y' || joinFlg === 'N')"
            label="操作人"
            :key="Math.random()"
            prop="modUserName"
            width="140"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isShowColumn('modDate') && (joinFlg === 'F' || joinFlg === 'Y' || joinFlg === 'N')"
            label="操作时间"
            prop="modDate"
            width="180"
          />
          <el-table-column
            v-if="isShowColumn('reason') && joinFlg === 'N'"
            label="暂不管理原因"
            prop="reason"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="isShowColumn('operation') && joinFlg !== 'Y' && !$IS_ORG_ADMIN"
            label="操作"
            :width="joinFlg === 'F' || joinFlg === 'N' ? 70 : 190"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="onCheck(scope.row)" v-if="joinFlg === 'F'"> 查看 </el-button>
              <el-button type="text" @click="onIncludeManage(scope.row)" v-if="joinFlg === 'U' || joinFlg === 'N'">
                纳入
              </el-button>
              <el-button type="text" @click="onNotManage(scope.row)" v-if="joinFlg === 'U'"> 暂不管理 </el-button>
              <el-button
                type="text"
                @click="onIframe360(scope.row)"
                v-if="joinFlg === 'U' && scope.row.applyTypeDesc === '医生建档'"
              >
                360视图
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNum"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </ProTable>
    <!-- 360视图 -->
    <Iframe360 :visible.sync="Test360" :pid="Test360TempId" :idNo="Test360TempIdNo"></Iframe360>
    <!-- 暂不管理 -->
    <ProDrawer :visible.sync="NotManageDrawer" title="单条暂不管理" :size="520" @close="onNotManageDrawerClose">
      <div class="no-dialog" v-if="NotManageDrawer">
        <div class="title">
          <span>{{ miniDialogTempData.patName }}</span>
          <span style="padding: 0 10px">{{ miniDialogTempData.sexDesc }}</span>
          <span>{{ miniDialogTempData.age }}</span>
        </div>
        <div style="font-size: 14px; color: #303133; padding: 20px 0 0 15px">
          诊断:
          {{ miniDialogTempData.diagnosesStr }}
        </div>
        <el-form :model="noForm" :rules="noFormRules" ref="noFormRef" label-width="120px" class="form">
          <el-form-item label="暂不管理原因:" prop="reason">
            <el-input
              type="textarea"
              v-model="noForm.reason"
              :autosize="{ minRows: 4, maxRows: 8 }"
              show-word-limit
              maxlength="200"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="reason">
          <div>您可以选择以下原因</div>
          <div class="reasons">
            <div v-for="v in notReasons" :key="v.msg" @click="changeReasons(v.msg)">
              {{ v.msg }}
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="NotManageDrawer = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('noFormRef')"> 确 定 </el-button>
      </template>
    </ProDrawer>
    <!-- 纳入失败抽屉 -->
    <ProDrawer :visible.sync="drawer" @close="onDrawerClose" :size="550" no-header>
      <ViewFailedInclusion :checkTempData="checkTempData" :isOne="isOne"> </ViewFailedInclusion>
      <template #footer>
        <el-button @click="drawer = false"> 返 回 </el-button>
      </template>
    </ProDrawer>
    <!-- 导入 -->
    <ProDialog :visible.sync="ImportVisible" no-footer @close="ImportVisibleClose" title="批量导入" width="600px">
      <div class="ImportDialog">
        <div class="box">
          <div>1. 下载导入模板，填写信息</div>
          <div>
            <IconSvg iconClass="download" width="55" height="55" style="margin: 20px 0 10px 0" />
          </div>

          <el-select v-model="templateValue" placeholder="请选择医院模板" style="margin: 0 0 20px 0">
            <el-option v-for="item in templateList" :key="item.hosId" :label="item.hosName" :value="item"> </el-option>
          </el-select>
          <el-button @click="download()"> 下载模板 </el-button>
        </div>
        <div class="line"></div>
        <div class="box">
          <div>2. 上传填好的文件</div>
          <div>
            <IconSvg v-if="!fileName" iconClass="upload1" width="55" height="55" style="margin: 20px 0 10px 0" />
            <IconSvg v-if="fileName" iconClass="upload2" width="55" height="55" style="margin: 20px 0 0 0" />
            <el-select
              v-model="hosId"
              placeholder="请选择上传机构"
              style="margin: 0 0 20px 0"
              v-if="templateList.length > 0"
            >
              <el-option v-for="item in templateList" :key="item.hosId" :label="item.hosName" :value="item.hosId">
              </el-option>
            </el-select>
            <el-tooltip v-if="fileName" effect="dark" :content="fileName" placement="top">
              <div
                style="
                  cursor: pointer;
                  margin-bottom: 5px;
                  font-size: 12px;
                  color: #5a5a5a;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >
                {{ fileName }}
              </div>
            </el-tooltip>
          </div>
          <!-- accept=".csv" -->
          <el-upload
            ref="upload"
            :file-list="fileList"
            :on-change="handleChange"
            name="excelFile"
            :headers="headers"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="onSuccess"
            :on-error="onError"
            :auto-upload="false"
            :limit="1"
            :data="fileData"
          >
            <el-button slot="trigger" v-if="!fileName"> 上传文件 </el-button>
            <div>
              <el-button type="primary" @click.stop="handleSubmit" v-if="fileName" :loading="ImportLoading">
                导入
              </el-button>
            </div>
            <div>
              <el-button type="text" @click.stop="ImportVisibleClose" v-if="fileName"> 重新选择 </el-button>
            </div>
          </el-upload>
        </div>
      </div>
    </ProDialog>
  </div>
</template>

<script>
import { IncludedInTheManagement } from '@/utils/ColumnMap'
import Iframe360 from '@/components/Iframe360/index.vue'
import ProTable from '@/components/ProTable/index.vue'
import ProDialog from '@/components/ProDialog/index.vue'
import ProDrawer from '@/components/ProDrawer/index.vue'
import ViewFailedInclusion from './ViewFailedInclusion.vue'

// import { baseUploadUrl } from '@/api/__http__'
import {
  onQueryJoinDetail,
  onJoin,
  onQueryApplyDepts,
  onImportPatBaseExcelData,
  onQueryDictionaryData,
  getExcelConfigForLoginUserNew,
} from '@/api/modules/iusion'
import { getUserList } from '@/api/modules/PatientCenter/index'
import { getOrgDiseaseTypes } from '@/api/modules/PatientCenter/index'
import { onQueryApplyDoctors, getDiagnosesList, getExcelTemplateDownloadPath } from '@/api/modules/DynamicSelector'
export default {
  props: {
    joinFlg: {
      type: String,
      default: 'U',
    },
    isNot: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProTable,
    ProDialog,
    ProDrawer,
    Iframe360,
    ViewFailedInclusion,
  },
  data() {
    return {
      fileData: {},
      hosId: '',
      templateList: [],
      templateValue: '',
      emptyText: '',
      columnState: '',
      ColumnLists: [],
      headers: {
        token: sessionStorage.getItem('token'),
      },
      // default or all
      TableMode: 'default',
      // 360视图
      Test360: false,
      Test360TempId: '',
      Test360TempIdNo: '',
      loading: true,
      ImportLoading: false,
      isOne: false,
      drawer: false,
      // 抽屉临时数据
      checkTempData: {},
      // 导入
      ImportVisible: false,
      fileList: [],
      fileName: '',
      uploadUrl: '',
      // 慢病种类
      diseaseTypeList: [],
      // 申请医生下拉
      applyDrs: [],
      // 申请科室下拉
      toApplyForTheDepartmentList: [],
      // 操作人
      userList: [],
      applicationTypes: [
        { label: '导入建档', value: 'EXCEL' },
        { label: '医生建档', value: 'HIS' },
        { label: '患者注册', value: 'PAT' },
      ],
      // 诊断
      disCategory: [],
      notReasons: [{ msg: '重复申请纳入' }, { msg: '不符合纳入条件' }, { msg: '患者不同意纳入' }],
      // 暂不纳入管理表单
      noForm: {
        reason: '',
      },
      noFormRules: {
        reason: [{ required: true, message: '请输入暂不管理原因', trigger: 'change' }],
      },
      // 暂不管理弹窗
      NotManageDrawer: false,
      // 弹窗临时数据
      miniDialogTempData: {},
      // 选中表格数据
      multipleSelection: [],
      // 请求时间
      createDateArr: [],
      // 操作时间
      modDateArr: [],
      // 查询请求参数
      queryParams: {},
      // 总数
      total: 0,
      // 分页请求删除
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // table 数据源
      patientList: [],
      APP_DOWNLOAD_URL: '',
    }
  },
  async mounted() {
    this.emptyText = ''
    console.group('IusionTable init')
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    console.groupEnd()
    this.onInquire()
    this.getOrgDiseaseTypes()
    this.onQueryApplyDepts()
    this.ColumnListsChange()
    // 操作人
    this.getUserList()
    // 申请人
    this.DynamicApplyDoctor()
    this.getDiagnosesList(this.joinFlg)
    this.getExcelTemplateDownloadPath()
    // this.onQueryDictionaryData()
  },
  methods: {
    addFun() {
      this.ImportVisible = true
      this.fileData = {}
      if (this.templateList.length > 1) {
        this.hosId = ''
        this.templateValue = ''
      }
    },
    async getExcelTemplateDownloadPath() {
      try {
        const res = await getExcelConfigForLoginUserNew({
          fileBaseUrl: window.g.VUE_APP_FILE_API,
        })
        this.templateList = res.result
        if (res.result.length === 1) {
          this.templateValue = res.result[0].valueData
          this.hosId = res.result[0].orgId
        }
      } catch (error) {
        // console.log('error', error)
      }
    },
    ColumnListsChange() {
      // 待审核
      if (this.joinFlg === 'U') {
        this.ColumnLists = IncludedInTheManagement(1)
        this.columnState = '1'
      }
      // 纳入成功 纳入失败
      if (this.joinFlg === 'Y') {
        this.ColumnLists = IncludedInTheManagement(2)
        this.columnState = '2'
      }
      if (this.joinFlg === 'F') {
        this.ColumnLists = IncludedInTheManagement(3)
        this.columnState = '3'
      }
      if (this.joinFlg === 'N') {
        this.ColumnLists = IncludedInTheManagement(4)
        this.columnState = '4'
      }
      // console.log('this.ColumnLists', this.ColumnLists)
    },
    isShowColumn(val) {
      if (this.ColumnLists.length) {
        let flag = this.ColumnLists.filter((arrItem) => {
          return arrItem.prop === val
        })
        if (flag.length) {
          // console.log('flag[0].ispass', val, flag[0].ispass);
          // if (flag[0].ispass === true) {
          //   this.queryParams.applyDrCode = '';
          // }
          return flag[0].ispass
        } else {
          return true
        }
      }
    },
    async onQueryDictionaryData() {
      try {
        const result = await onQueryDictionaryData()
        console.log('result===', result.result.extra0)
        this.APP_DOWNLOAD_URL = result.result.extra0
      } catch (error) {
        // console.log('error', error)
      }
    },
    // 查询
    async onInquire(flag, btn) {
      this.TableMode = this.queryParams.applyType !== 'HIS' ? 'default' : 'all'
      // this.ColumnListsChange();
      let applyDateS = ''
      let applyDateE = ''
      let modDateS = ''
      let modDateD = ''
      if (this.createDateArr && this.createDateArr.length !== 0) {
        applyDateS = this.createDateArr[0]
        applyDateE = this.createDateArr[1]
      }
      if (this.modDateArr && this.modDateArr.length !== 0) {
        modDateS = this.modDateArr[0]
        modDateD = this.modDateArr[1]
      }
      console.log('this.queryParams', this.queryParams)
      if (
        btn === 'btn' &&
        Object.keys(this.queryParams).length === 0 &&
        applyDateS === '' &&
        applyDateE === '' &&
        modDateS === '' &&
        modDateD === ''
      ) {
        this.$message.warning('请输入查询条件')
        return
      }
      this.loading = true
      try {
        const res = await onQueryJoinDetail({
          joinFlg: this.joinFlg,
          ...this.queryParams,
          ...this.pageParams,
          applyDateS,
          applyDateE,
          modDateS,
          modDateD,
        })
        // console.log(`res`, res.result)
        const { records, total } = res.result
        console.log('flag', flag)
        if (flag !== true && btn === 'btn' && records.length === 0) {
          this.$message.warning('查询结果，暂无数据，请修改查询条件重试')
          setTimeout(() => {
            this.resetQueryParams()
          }, 500)
        } else {
          this.total = total
          records.forEach((el) => {
            for (let key in el) {
              if (!el[key]) {
                el[key] = '/'
              }
            }
          })
          this.patientList = records
          if (this.patientList.length === 0) {
            this.emptyText = '暂无数据'
          }
          setTimeout(() => {
            this.loading = false
          }, 300)
        }
      } catch (error) {
        setTimeout(() => {
          this.loading = false
        }, 300)
        // console.log(`error`, error)
      }
    },
    // 慢病种类查询
    async getOrgDiseaseTypes() {
      try {
        const res = await getOrgDiseaseTypes()
        let diseaseTypeList = []
        res.result.forEach((item) => {
          diseaseTypeList = diseaseTypeList.concat(item.tagList)
        })
        this.diseaseTypeList = diseaseTypeList
      } catch (error) {
        // console.log(`error`, error)
      }
    },
    async onQueryApplyDepts() {
      try {
        const res = await onQueryApplyDepts()
        // console.log(`res---`, res)
        this.toApplyForTheDepartmentList = res.result
      } catch (error) {
        // console.log(`error`, error)
      }
    },
    // 重置
    async resetQueryParams() {
      this.queryParams = {}
      this.createDateArr = []
      this.modDateArr = []
      this.queryParams = {}
      this.pageParams = {
        pageSize: 10,
        pageNum: 1,
      }
      this.addDate = []
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire(true)
    },
    // 封装纳入
    async postManageApiFun(obj) {
      try {
        const res = await onJoin(obj)
        // console.log(`封装纳入 postManageApiFun`, JSON.parse(JSON.stringify(res)))
        if (res.code === 0) {
          if (obj.joinFlg === 'Y') {
            if (res.result.length !== 0) {
              if (res.result.length === 1) {
                // console.log(`单条纳入`, res)
                this.isOne = true
                this.checkTempData = JSON.parse(JSON.stringify(res.result[0]))
                this.drawer = true
              } else {
                // console.log(`批量纳入`, res)
                this.$setMenuPage('/bulkInclusionWarning')
                this.$router.push({
                  name: 'BulkInclusionWarning',
                  params: {
                    row: res.result,
                  },
                })
              }
            } else {
              this.$message.success('纳入成功！')
            }
          } else {
            // console.log(`暂不纳入`)
            this.NotManageDrawer = false
            this.miniDialogTempData = {}
            this.noForm = {
              reason: '',
            }
          }
          this.onInquire(true)
          // 清空选中状态
          this.clearFun()
        }
      } catch (error) {
        // console.log(`error`, error)
      }
    },
    // 查看
    onCheck(row) {
      // console.log(`onCheck`, JSON.parse(JSON.stringify(row)))
      this.checkTempData = JSON.parse(JSON.stringify(row))
      this.drawer = true
    },
    // 关闭抽屉
    onDrawerClose() {
      this.isOne = false
      this.checkTempData = {}
    },
    // 纳入
    onIncludeManage(row) {
      // console.log(`纳入 --- onIncludeManage`, row)
      let joinDetailIds = []
      joinDetailIds.push(row.id)
      this.loading = true
      this.postManageApiFun({
        joinDetailIds,
        joinFlg: 'Y',
      })
    },
    onIframe360(row) {
      // console.log(`row`, row)
      this.Test360TempId = ''
      this.Test360TempIdNo = ''
      // this.Test360 = true;
      // this.Test360TempId = row.patientId;
      // this.Test360TempIdNo = row.idNo;
      window.open(`http://10.10.254.234:8080/share/timeline?patientsn=${row.patientId}`)
    },
    // 暂不管理
    onNotManage(row) {
      // console.log(`暂不管理 --- onNotManage`, row)
      this.noForm = {
        reason: '',
      }
      this.NotManageDrawer = true
      this.miniDialogTempData = row
    },
    // 关闭单条暂不管理
    onNotManageDrawerClose() {
      this.noForm = {
        reason: '',
      }
      this.miniDialogTempData = {}
    },
    // 批量纳入
    onBatchIncludeManage() {
      // console.log(`批量纳入 --- onBatchIncludeManage`, this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择患者！')
        return
      }
      this.loading = true
      let joinDetailIds = []
      this.multipleSelection.forEach((el) => {
        joinDetailIds.push(el.id)
      })
      this.postManageApiFun({
        joinDetailIds,
        joinFlg: 'Y',
      })
    },
    // 批量暂不管理
    onBatchNotManage() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择患者！')
        return
      }
      this.$setMenuPage('/batchNotManage')
      this.$router.push({
        name: 'BatchNotManage',
        params: {
          row: this.multipleSelection,
        },
      })
    },
    // 暂不管理表单提交
    submitForm(formName) {
      if (this.noForm.reason.trim().length > 200) {
        this.$message.error('暂不管理原因须在200字以内')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let joinDetailIds = []
          joinDetailIds.push(this.miniDialogTempData.id)
          this.postManageApiFun({
            joinDetailIds,
            joinFlg: 'N',
            reason: this.noForm.reason,
          })
          this.$message.success('暂不管理成功！')
        } else {
          return false
        }
      })
    },
    // 上传逻辑
    onSuccess(res) {
      console.log('onSuccess :>> ', res)
      if (res.code === -1) {
        this.$message.error(res.desc)
        return
      }
      if (res.result.errorRowsNo === '') {
        this.$message.success('全部导入成功')
      } else {
        this.$message.warning(`成功导入${res.result.successTot}条    excel中第${res.result.errorRowsNo}行导入失败`)
      }
      setTimeout(() => {
        this.ImportVisible = false
        this.ImportVisibleClose()
        this.onInquire()
      }, 300)
    },
    onError(res) {
      // console.log('onError :>> ', res)
      this.$message.error('导入失败')
      this.ImportLoading = false
    },
    handleChange(file, fileList) {
      this.fileName = ''
      this.fileList = []
      this.fileName = file.name
      this.fileList = fileList
      this.fileData = {
        hosId: this.hosId,
      }
    },
    async uploadSectionFile(row) {
      try {
        console.log(`this.hosId`, this.hosId)
        const form = new FormData()
        // 文件对象
        form.append('excelFile', row.file)
        if (this.templateList.length > 0) {
          form.append('hosId', this.hosId)
        }
        const res = await onImportPatBaseExcelData(form)
      } catch (error) {
        // console.log(`error`, error)
      }
    },
    handleSubmit() {
      if (this.hosId === '' && this.templateList.length > 0) {
        this.$message.error('请选择导入机构')
        return
      }
      console.log(`导入------VUE_APP_BASE_API`, window.g.VUE_APP_BASE_API)
      this.uploadUrl =
        window.g.VUE_APP_BASE_API +
        // "http://124.196.7.86:7001" +
        '/ygt-richdiseases/tbMbJoinDetail/onImportPatBaseExcelData'
      this.ImportLoading = true
      console.log('this.uploadUrl', this.uploadUrl)
      // this.uploadUrl = window.g.VUE_APP_FILE_BASE_URL + '/ygt-richdiseases/tbMbJoinDetail/onImportPatBaseExcelData'
      this.$nextTick(() => {
        this.$refs.upload.submit()
      })
    },
    // 上传弹窗比关闭事件
    ImportVisibleClose() {
      this.ImportLoading = false
      this.fileName = ''
      this.fileList = []
    },
    // 更新原因
    changeReasons(msg) {
      // console.log(`msg`, msg)
      this.noForm.reason = this.noForm.reason + msg + ';'
      // console.log(`this.noForm.reason`, this.noForm.reason)
    },
    // 表格选中
    handleSelectionChange(val) {
      // console.log(`val`, val)
      this.multipleSelection = val
      // console.log(`this.multipleSelection`, this.multipleSelection)
    },
    // 清空选中
    clearFun() {
      this.$refs.singleTable.clearSelection()
      // console.log(`this.multipleSelection`, this.multipleSelection)
    },
    getRowKey(row) {
      return row.id
    },
    // 分页 pageNum
    handleCurrentChange(val) {
      this.pageParams.pageNum = val
      this.onInquire()
    },
    // 分页 pageSize
    handleSizeChange(val) {
      this.pageParams.pageNum = 1
      this.pageParams.pageSize = val
      this.onInquire()
    },
    // 诊断
    async getDiagnosesList(joinFlg) {
      try {
        const res = await getDiagnosesList({ joinFlg })
        console.log('getDiagnosesList', res)
        let temp = []
        res.result.forEach((el) => {
          if (el) {
            temp.push(el)
          }
        })
        this.disCategory = temp
      } catch (error) {
        // console.log(`error`, error)
      }
    },
    // 申请医生
    async DynamicApplyDoctor() {
      try {
        const res = await onQueryApplyDoctors()
        let temp = []
        res.result.forEach((el) => {
          if (el) {
            temp.push(el)
          }
        })
        this.applyDrs = temp
        // console.log(`DynamicApplyDoctor`, res)
      } catch (error) {
        // console.log(`error`, error)
      }
    },
    // 操作人
    async getUserList() {
      try {
        const res = await getUserList()
        // console.log('res-----------', res)
        this.userList = res.result
      } catch (err) {
        // console.error(err)
      }
    },
    // 下载
    download() {
      if (this.templateList.length === 0) {
        window.open(this.APP_DOWNLOAD_URL)
      } else {
        if (this.templateValue === '') {
          this.$message.error('请选择医院模板')
        } else {
          window.open(this.templateValue.excelTemplateDownloadUrl)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.ProTable {
  border-radius: 2px;
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;

  .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px !important;
  }
}

.alert {
  margin-left: 10px;
  display: flex;
  align-items: center;
  background-color: #ebf1fd;
  width: 100%;
  height: 32px;
  border: 1px solid #446abd;
}

.no-dialog {
  padding-top: 20px;

  .title {
    padding: 0 10px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    background-color: rgba(245, 245, 245, 100);
    color: #303133;
    font-size: 16px;
  }

  .form {
    padding: 10px 20px 10px 10px;
  }

  .reason {
    margin-left: 20px;

    .reasons {
      display: flex;
      flex-wrap: wrap;

      div {
        cursor: pointer;
        margin: 10px 10px 0 0;
        padding: 0 20px;
        height: 32px;
        line-height: 32px;
        background-color: rgba(245, 245, 245, 100);
        font-size: 14px;
        text-align: center;
      }
    }
  }
}

.ImportDialog {
  padding: 30px 0 10px 0;
  height: 260px;
  display: flex;
  justify-content: center;

  .box {
    width: 33.33%;
    text-align: center;
  }

  .line {
    width: 1px;
    height: 150px;
    background-color: #e9e9e9;
    margin: 0 50px;
  }
}
</style>
