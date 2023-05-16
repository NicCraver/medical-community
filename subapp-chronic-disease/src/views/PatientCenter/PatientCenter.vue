<template>
  <div class="PatientCenter">
    <ProLayout model="title">
      <template #title>患者中心</template>
      <template #main>
        <ProTable :ColumnLists="ColumnLists" :columnState="columnState">
          <template #header>
            <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="queryParams.hosId"
              :parentId="queryParams.orgId"
              placeholder="机构"
            ></OrgHosSelect>
            <!-- <ReferralSelect placeholder="集团" module="publicModule" type="ORG" status="Y" v-model="queryParams.orgId"></ReferralSelect>
            <ReferralSelect
              placeholder="机构"
              module="publicModule"
              type="ORG_HOS"
              v-model="queryParams.hosId"
              :orgId="queryParams.orgId"
              :disabled="!queryParams.orgId"
              status="Y"
            ></ReferralSelect> -->
            <el-input
              placeholder="姓名/手机/身份证/门诊住院号"
              v-model="queryParams.searchValue"
              style="width: 220px"
              clearable
            />
            <el-select placeholder="状态" v-model="queryParams.recordStatus" clearable>
              <el-option v-for="(val, key) in statusMap" :key="key" :label="val" :value="key" />
            </el-select>
            <el-select v-model="queryParams.followupFlg" clearable placeholder="是否纳入随访">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
            <!-- <el-select placeholder="诊断" v-model="queryParams.diagnoseDesc" clearable filterable>
              <el-option
                v-for="(item, i) in disCategory"
                :key="item.label + i"
                :label="item.label"
                :value="item.label"
              />
            </el-select> -->
            <el-select placeholder="慢病种类" v-model="queryParams.richDiseaseCode" clearable filterable>
              <el-option v-for="item in diseaseTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select placeholder="责任医生" v-model="queryParams.doctorUserId" clearable filterable>
              <el-option v-for="item in doctorList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select placeholder="建档人" v-model="queryParams.archiveUserId" clearable filterable>
              <el-option v-for="item in userList" :key="item.userId" :label="item.label" :value="item.value" />
            </el-select>
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="建档开始日期"
              end-placeholder="建档结束日期"
              range-separator="至"
              v-model="createDateArr"
              clearable
              style="width: 410px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions v-if="!$IS_ORG_ADMIN">
            <el-button @click="joinFollowUp" type="primary"> 批量纳入随访 </el-button>
            <el-button @click="bulkPush" v-permission="2"> 批量推送活动 </el-button>
            <div class="alert" v-if="multipleSelection.length">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
              <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
            </div>
          </template>
          <el-table
            ref="singleTable"
            v-adaptive="{ bottomOffset: 75 }"
            height="0"
            :data="patientList"
            border
            @selection-change="handleSelectionChange"
            :row-key="getRowKey"
            v-loading="loading"
          >
            <el-table-column type="selection" width="40" :reserve-selection="true" />
            <el-table-column v-if="isShowColumn('index')" label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="患者来源" prop="dataSource" width="110" show-overflow-tooltip />
            <el-table-column
              v-if="isShowColumn('patCode')"
              label="档案编号"
              prop="patCode"
              width="110"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="isShowColumn('caseNo')"
              label="门诊/住院号"
              prop="caseNo"
              width="110"
              show-overflow-tooltip
            />
            <el-table-column v-if="isShowColumn('name')" label="姓名" prop="name" show-overflow-tooltip />
            <el-table-column
              v-if="isShowColumn('sexDesc')"
              label="性别"
              prop="sexDesc"
              width="50"
              show-overflow-tooltip
            />
            <el-table-column v-if="isShowColumn('age')" label="年龄" prop="age" width="65" show-overflow-tooltip />
            <el-table-column
              v-if="isShowColumn('phoneNo')"
              label="手机号"
              prop="phoneNo"
              width="140"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="isShowColumn('idNo')"
              label="身份证号"
              prop="idNo"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="isShowColumn('recordStatus')"
              label="状态"
              prop="recordStatus"
              width="110"
            ></el-table-column>
            <el-table-column
              v-if="isShowColumn('diagnosesStr')"
              label="诊断"
              prop="diagnosesStr"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="isShowColumn('richDiseaseName')"
              label="慢病种类"
              prop="richDiseaseName"
              min-width="180"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              v-if="isShowColumn('doctorUserName')"
              label="责任医生"
              prop="doctorUserName"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="isShowColumn('archiveUserName')"
              label="建档人"
              prop="archiveUserName"
              width="140"
              show-overflow-tooltip
            />
            <el-table-column label="建档机构" prop="joinHosName" width="200" show-overflow-tooltip />
            <el-table-column
              v-if="isShowColumn('archiveDate')"
              label="建档时间"
              prop="archiveDate"
              width="110"
              show-overflow-tooltip
            />
            <!-- v-if="isShowColumn('joinRegActivityFlg')" -->
            <el-table-column
              v-if="$isP(2)"
              label="是否参与注册活动"
              prop="joinRegActivityFlg"
              width="110"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div v-show="scope.row.joinRegActivityFlg == 'Y'">
                  <el-popover trigger="hover" placement="top" popper-class="patient-yt-popover">
                    <el-scrollbar class="activityTip" :class="{'activityTipHeight': scope.row.activityMes.length>2 }"> 
                      <div class="itemTip" v-for="(item, index) in scope.row.activityMes" :key="index">
                        <p><span></span> 活动名称: {{ item.activityDesc }}</p>
                        <p>领取时间: {{ item.pickupDate }}</p>
                        <p>推送人: {{ item.pushUserName ? item.pushUserName : '—' }}</p>
                      </div>  
                    </el-scrollbar>                                 
                    <div slot="reference" class="name-wrapper">
                      <!-- scope.row.joinRegActivityFlg == 'Y' ? '是' : '否' -->
                      <span>是</span>                    
                      <IconSvg  iconClass="tip" width="15" height="15" class="pdright"></IconSvg>
                    </div>
                  </el-popover>
                </div>
                <span v-show="scope.row.joinRegActivityFlg == 'N'">
                  <!-- {{ scope.row.joinRegActivityFlg == 'Y' ? '是' : '否' }} -->
                  否
                </span>
              </template>
              <!--
              <template slot-scope="scope">
                <div>
                  {{ scope.row.joinRegActivityFlg == 'Y' ? '是' : '否' }}
                  <IconSvg iconClass="tip" width="15" height="15"></IconSvg>
                </div>            
              </template> 
              -->
            </el-table-column>
            <!-- <el-table-column label="结档时间" prop="finishArchiveDate" width="110" show-overflow-tooltip /> -->
            <el-table-column
              v-if="isShowColumn('modUserName')"
              label="最后修改人"
              prop="modUserName"
              width="140"
              show-overflow-tooltip
            />
            <el-table-column v-if="isShowColumn('modDate')" label="最后修改时间" prop="modDate" width="180" />
            <el-table-column v-if="isShowColumn('operation') && !$IS_ORG_ADMIN" label="操作" width="210" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="onComplete(scope.row, true)">查看</el-button>
                <el-button v-if="scope.row.recordStatus !== '已结档'" type="text" @click="onComplete(scope.row)">
                  完善
                </el-button>
                <el-button type="text" v-else @click="onArchive(scope.row)"> 恢复 </el-button>
                <el-button
                  v-if="scope.row.followupFlg !== '1' && scope.row.recordStatus !== '已结档'"
                  type="text"
                  @click="joinFollowUp(scope.row)"
                  :class="{ grey: scope.row.richDiseaseName === '/' }"
                >
                  纳入随访
                </el-button>
                <el-button
                  v-if="scope.row.followupFlg === '1'"
                  type="text"
                  @click="editJoin(scope.row)"
                  :class="{ grey: scope.row.richDiseaseName === '/' }"
                >
                  已纳入
                </el-button>
                <el-dropdown style="margin-left: 4px" size="medium" @command="handleCommand">
                  <!-- <span class="el-dropdown-link"> -->
                  <el-button type="text">更多</el-button>
                  <!-- </span> -->
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="scope.row.recordStatus !== '已结档'" v-permission="2" :command="{ ...scope.row, type: '推送活动' }">
                      <el-button type="text"> 推送活动 </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.applyType === 'HIS'" :command="{ ...scope.row, type: '360视图' }">
                      <el-button type="text"> 360视图 </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item :divided="$isP(2) || scope.row.applyType === 'HIS'" :command="{ ...scope.row, type: '结档' }">
                      <el-button v-if="scope.row.recordStatus !== '已结档'" type="text">
                        结档
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column v-if="$IS_ORG_ADMIN" label="操作" width="60" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="onComplete(scope.row, true)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 15px"
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
      </template>
    </ProLayout> 
    <!-- 结档弹窗 -->
    <el-dialog title="档案结档" :visible.sync="endFileDialog">
      <div class="no-dialog" v-if="endFileDialog">
        <div class="title">
          <span>{{ endFileDialogTempData.name }}</span>
          <span style="padding: 0 10px">
            {{ endFileDialogTempData.sexDesc }}
          </span>
          <span>{{ endFileDialogTempData.age }}</span>
        </div>
        <el-form :model="endFileForm" :rules="endFileFormRules" ref="endFileFormRef" label-width="120px" class="form">
          <el-form-item label="诊断:">
            {{ endFileDialogTempData.diagnosesStr ? endFileDialogTempData.diagnosesStr : '暂无数据' }}
          </el-form-item>
          <el-form-item label="结档原因:" prop="finishArchiveReasonCode">
            <el-select v-model="endFileForm.finishArchiveReasonCode" clearable placeholder="请选择结档原因">
              <el-option v-for="item in finishArchiveReasons" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结档人:">
            <el-input v-model="endOrser" :disabled="true"> </el-input>
          </el-form-item>
          <el-form-item label="结档日期:">
            <el-input v-model="endDate" :disabled="true"> </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endFileDialog = false">取 消</el-button>
        <el-button type="primary" @click="onEndFileSubmit('endFileFormRef')"> 确 定 </el-button>
      </span>
    </el-dialog>
    <Iframe360 :visible.sync="Test360" :pid="Test360TempId" :idNo="Test360TempIdNo"></Iframe360>
    <JionDialog
      v-if="joinVisible"
      :joinVisible.sync="joinVisible"
      :joinDataList="joinDataList"
      :joinData="joinData"
      :z-index="1000"
      @onInquire="onInquire"
      @clearFun="clearFun"
    ></JionDialog>
    <PushActivityDialog
      v-if="pushVisible"
      :pushVisible.sync="pushVisible"
      :pushData="pushData"
      @onInquire="onInquire"
      @clearFun="clearFun"
    ></PushActivityDialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import JionDialog from './JionDialog.vue'
import PushActivityDialog from './PushActivityDialog.vue'
import { ChronicDiseaseCenter } from '../../utils/ColumnMap'
import { ProLayout } from 'anx-vue'
import ProTable from '../../components/ProTable/index.vue'
import Iframe360 from '@/components/Iframe360/index.vue'

import { getDiagnosesList } from '@/api/modules/DynamicSelector'
import {
  getOrgDiseaseTypes,
  getPatientCenterForPage,
  finishArchive,
  restoreArchive,
  onInitFollowup,
  joinFollowUp,
  onQueryArchiveUsers,
  getDoctorUserIdAndName,
  queryPushPatientInfo,
  // test
} from '../../api/modules/PatientCenter/index'

export default {
  data() {
    return {
      joinData: {},
      joinDataList: [],
      joinVisible: false,
      pushData: {},
      pushVisible: false,
      columnState: '',
      ColumnLists: [],
      // 诊断
      disCategory: [],
      endOrser: '',
      endDate: '',
      endFileForm: {
        reason: '',
      },
      endFileFormRules: {
        finishArchiveReasonCode: [{ required: true, message: '请输入结档原因', trigger: 'change' }],
      },
      endFileDialogTempData: {},
      endFileDialog: false,
      finishArchiveReasons: [
        { value: '1', label: '死亡' },
        { value: '2', label: '迁出' },
        { value: '3', label: '失访' },
        { value: '4', label: '拒绝' },
        { value: '5', label: '其他' },
      ],
      total: 0,
      loading: false,
      multipleSelection: [],
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParams: {},
      createDateArr: [],
      dateChangedArr: [],
      diseaseTypeList: [],
      statusMap: {
        1: '待完善',
        2: '管理中',
        4: '已结档',
      },
      doctorList: [],
      originList: [{ label: '门诊' }, { label: '住院' }, { label: '小程序' }],
      patientList: [],
      userList: [],
      // 360视图
      Test360: false,
      Test360TempId: '',
      Test360TempIdNo: ''
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
    this.ColumnLists = ChronicDiseaseCenter()
    this.columnState = '1'
    this.loading = true
    this.getDiagnosesList('Y')
    this.getDoctorUserIdAndName()
    this.getOrgDiseaseTypes()
    this.onQueryArchiveUsers()
  },
  methods: {   
    handleCommand(row) {
      if (row.type==='推送活动') {
        this.pushActivity(row)
      }
      if (row.type==='360视图') {
        this.onIframe360(row)
      }
      if (row.type==='结档') {
        this.onEndFile(row)
      }
    },
    isShowColumn(val) {
      if (this.ColumnLists.length) {
        let flag = this.ColumnLists.filter((arrItem) => {
          return arrItem.prop === val
        })
        if (flag.length) {
          return flag[0].ispass
        } else {
          return true
        }
      }
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
    async getDoctorUserIdAndName() {
      try {
        const res = await getDoctorUserIdAndName()
        console.log('getDoctorUserIdAndName====', res)
        this.doctorList = res.result.map((item) => ({
          label: item.doctorUserName,
          value: item.doctorUserId,
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async getOrgDiseaseTypes() {
      try {
        const res = await getOrgDiseaseTypes()
        console.log(`res`, res)
        let diseaseTypeList = []
        res.result.forEach((item) => {
          diseaseTypeList = diseaseTypeList.concat(item.tagList)
        })
        this.diseaseTypeList = diseaseTypeList
      } catch (error) {
        console.log(`error`, error)
      }
    },
    async onQueryArchiveUsers() {
      try {
        const res = await onQueryArchiveUsers()
        this.userList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    // 查询
    async onInquire() {
      this.loading = true
      console.log(`this.createDateArr`, this.createDateArr)
      if (!this.joinFlg && this.createDateArr && this.createDateArr.length !== 0) {
        this.queryParams.archiveDateS = this.createDateArr[0] + ' 00:00:00'
        this.queryParams.archiveDateE = this.createDateArr[1] + ' 23:59:59'
      } else {
        this.queryParams.archiveDateS = ''
        this.queryParams.archiveDateE = ''
      }
      if (!this.joinFlg && this.dateChangedArr && this.dateChangedArr.length !== 0) {
        this.queryParams.modDateS = this.dateChangedArr[0] + ' 00:00:00'
        this.queryParams.modDateE = this.dateChangedArr[1] + ' 23:59:59'
      } else {
        this.queryParams.modDateS = ''
        this.queryParams.modDateE = ''
      }
      try {
        const res = await getPatientCenterForPage({
          ...this.queryParams,
          ...this.pageParams,
          findType: '0',
        })
        const { records, total } = res.result
        this.total = total
        records.forEach((el) => {                     
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })      
        this.patientList = records
        console.log(this.patientList)
        setTimeout(() => {
          this.loading = false
        }, 300)
      } catch (error) {
        setTimeout(() => {
          this.loading = false
        }, 300)
        console.error(`error`, error)
      }
    },
    // 操作 完善
    onComplete(row, isDisabled) {
      console.log(`完善 --- onComplete`, JSON.parse(JSON.stringify(row)))
      this.$setMenuPage('/patientArchives')
      this.$router.push({
        name: 'PatientArchives',
        query: {
          patId: row.patId,
          isDisabled,
          hisPatientId: row.patientId,
        },
      })
    },
    // 操作 结档
    onEndFile(row) {
      if (row.isStartFollowup === '1') {
        this.$message.warning('该患者存在随访计划，不能结档!')
        return
      }
      this.endOrser = window.sessionStorage.getItem('loginName')
      this.endDate = dayjs().format('YYYY-MM-DD')
      this.endFileDialog = true
      this.endFileDialogTempData = row
    },
    // 操作 恢复
    async onArchive(row) {
      console.log(`row`, row)
      const res = await restoreArchive({
        patId: row.patId,
      })
      this.$message.success('恢复成功！')
      this.onInquire()
    },
    // 结档保存
    onEndFileSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await finishArchive({
            finishArchiveReasonCode: this.endFileForm.finishArchiveReasonCode,
            patId: this.endFileDialogTempData.patId,
          })
          console.log(`res`, res)
          this.endFileDialogTempData = {}
          this.endFileForm.finishArchiveReasonCode = ''
          this.endOrser = ''
          this.endDate = ''
          this.endFileDialog = false
          this.onInquire()
        } else {
          return false
        }
      })
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageSize: 10,
        pageNum: 1,
      }
      this.createDateArr = []
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    // 表格选中
    handleSelectionChange(val) {
      console.log(`val`, val)
      this.multipleSelection = val
    },
    // 清空选中
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    getRowKey(row) {
      return row.patId
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
    editJoin(row) {
      console.log(`row`, row)
      if (row.followupFlg === '1') {
        this.$confirm('该患者已被纳入随访，您是否需要编辑随访机构？', '提示', {
          confirmButtonText: '编辑机构',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.joinFollowUp(row)
          })
          .catch(() => {})
      }
    },
    async joinFollowUp(row) {
      if (row.patId) {
        if (row.richDiseaseName === '/') {
          this.$message.warning('请完善慢病种类后再纳入随访')
          return
        }
        // 单个纳入随访
        this.joinDataList = []
        this.joinData = JSON.parse(JSON.stringify(row))
        this.joinDataList.push(row.patId)
        console.log(`11111111`, 1111111)
        this.onInitFollowup(this.joinDataList)
      } else {
        console.log(`2222222`, 2222222)
        // 批量纳入随访
        if (this.multipleSelection.length === 0) {
          this.$message.error('请选择患者！')
          return
        }
        // :selectable="
        //   (row, index) =>
        //     row.recordStatus !== '已结档' &&
        //     row.richDiseaseName !== '/' &&
        //     row.followupFlg !== '1'
        // "
        this.joinDataList = []
        this.joinDataList = this.multipleSelection.map((item) => {
          if (item.recordStatus !== '已结档' && item.richDiseaseName !== '/' && item.followupFlg !== '1') {
            return item.patId
          }
          return
        })
        this.joinDataList = [...new Set(this.joinDataList.map((_) => _))].filter(Boolean)
        console.log(`this.joinDataList`, this.joinDataList)
        if (this.joinDataList.length === 0) {
          this.$message.error('没有能够纳入的患者')
          return
        }
        this.onInitFollowup(this.joinDataList)
        this.$message.warning('只有' + this.joinDataList.length + '项，可以纳入随访')
      }
    },
    async onInitFollowup(data) {
      try {
        const res = await onInitFollowup(data)
        console.log(`res`, res)
        if (res.result.allIds.length > 1) {
          this.joinVisible = true
        } else {
          this.onejoinFollowUp(data, res.result.allIds)
        }
      } catch (error) {
        console.log(`error`, error)
      }
    },
    async onejoinFollowUp(patIds, orgIds) {
      console.log(`orgIds`, orgIds)
      try {
        await joinFollowUp({
          patIds: patIds,
          orgIds: orgIds,
          followupIncludeUserId: window.sessionStorage.getItem('userId'),
          followupIncludeUserName: window.sessionStorage.getItem('loginName'),
        })
        this.$message.success('纳入成功！')
        this.onInquire()
        this.clearFun()
        this.joinVisible = false
      } catch (err) {
        console.error(err)
      }
    },
    onIframe360(row) {
      console.log(`row`, row)
      this.Test360TempId = ''
      this.Test360TempIdNo = ''
      // this.Test360 = true;
      // this.Test360TempId = row.patientId;
      // this.Test360TempIdNo = row.idNo;
      window.open(`http://10.10.254.234:8080/share/timeline?patientsn=${row.patientId}`)
    },
    pushActivity(row) {
      this.pushVisible = true
      console.log(`pushActivity`, row)
      this.pushData = JSON.parse(JSON.stringify(row))
    },
    async bulkPush() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择患者')
        return
      }
      try {
        if (!this.joinFlg && this.createDateArr.length !== 0) {
          this.queryParams.archiveDateS = this.createDateArr[0]
          this.queryParams.archiveDateE = this.createDateArr[1]
        }
        if (!this.joinFlg && this.dateChangedArr.length !== 0) {
          this.queryParams.modDateS = this.dateChangedArr[0]
          this.queryParams.modDateE = this.dateChangedArr[1]
        }
        const res = await queryPushPatientInfo({
          ...this.queryParams,
          ...this.pageParams,
          patIds: this.multipleSelection.map((el) => el.patId),
        })
        console.log(`res.result`, res.result)
        this.$router.push({
          name: 'BulkPush',
          params: {
            list: res.result,
          },
        })
      } catch (error) {}
    },
  },
  components: {
    ProLayout,
    ProTable,
    Iframe360,
    JionDialog,
    PushActivityDialog,
  },
}
</script>

<style lang="scss">
.patient-yt-popover{
  background: rgba(245, 245, 245, 0.9) !important;
}
.patient-yt-popover .popper__arrow{
  left:110px !important;
}
</style>
<style lang="scss" scoped>
.PatientCenter {
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px;
  }
  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
  .grey {
    color: #919191;
  }
}

.activityTipHeight{
  height: 180px;
  overflow: hidden;
}
.activityTip{
  .itemTip{ 
    margin-bottom: 5px; 
    p{
      position: relative;
      line-height: 30px;
      padding: 0 20px 0 10px;
      font-size: 14px;
      color: #606266;
      span{
        position: absolute;
        left:0;
        top:7px;
        display: inline-block;
        width: 3px;
        height: 16px;
        border-radius: 3px;
        background: #446ABD;
      }
    }
  }
}
.pdright{
  margin-left: 10px;
}
.no-dialog {
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
    padding: 10px 20px 10px 0;
  }
  .el-input {
    width: 228px;
  }
}
</style>
