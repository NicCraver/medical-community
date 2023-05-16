<template>
  <div class="FU-PatientCenter">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>患者中心</template>
      <template #main>
        <header class="header">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="bolck">
                <div class="icon-div user"><i class="el-icon el-icon-user-solid"></i></div>
                <div>服务人数{{ serveNum }}人</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="bolck">
                <div class="icon-div time"><i class="el-icon el-icon-time"></i></div>
                <div>随访中{{ following }}条</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="bolck">
                <div class="icon-div document"><i class="el-icon el-icon-document"></i></div>
                <div>已结束随访{{ followOver }}条</div>
              </div>
            </el-col>
          </el-row>
        </header>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <OrgHosSelect
              ref="orgRef"
              v-model="queryParams.orgId"
              placeholder="集团"
            ></OrgHosSelect>
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
            <el-input placeholder="姓名/手机号" v-model="queryParams.searchValue" clearable />
            <el-select
              placeholder="慢病种类"
              v-model="queryParams.richDiseaseCode"
              clearable
              filterable
            >
              <el-option
                v-for="item in diseaseTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              placeholder="责任医生"
              v-model="queryParams.doctorUserId"
              clearable
              filterable
            >
              <el-option
                v-for="item in doctorList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              placeholder="是否有开启中的随访"
              v-model="queryParams.isStartFollowup"
              clearable
            >
              <el-option
                v-for="item in isStartFollowupList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
            <el-select placeholder="纳入人" v-model="queryParams.followupIncludeUserId" clearable>
              <el-option
                v-for="item in followupIncludeUserList"
                :key="item.userInfoId"
                :label="item.loginName"
                :value="item.userInfoId"
              />
            </el-select>
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="纳入开始日期"
              end-placeholder="纳入结束日期"
              range-separator="至"
              v-model="joinDate"
              clearable
              style="width: 410px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="multiFollowFuc">批量随访</el-button>
            <el-button  @click="onResearchPrestore">批量调研</el-button>
            <el-checkbox class="middle" v-model="isSelectAll" @change="isSelectAllChange"
              >结果全选</el-checkbox
            >
            <div class="alert" v-if="theNumberOfItemsHasBeenSelected !== 0">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选择 {{ theNumberOfItemsHasBeenSelected }}项</div>
              <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px">
                清空
              </el-button>
            </div>
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 75 }"
            height="0"
            ref="singleTable"
            :data="patientList"
            border
            v-loading="loading"
            row-key="patId"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40" :reserve-selection="true" />
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <!-- <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span> -->
                <span>{{ scope.row.cloumnIndex }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="followupModDate" min-width="180" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="性别" prop="sexDesc" />
            <el-table-column label="年龄" prop="age" />
            <el-table-column label="手机号" prop="phoneNo" width="130" />
            <el-table-column label="慢病种类" prop="richDiseaseName" show-overflow-tooltip />
            <el-table-column label="随访病种" prop="followUpDiseaseText" />
            <el-table-column label="是否有开启中的随访" prop="isStartFollowupText" width="150" />
            <el-table-column
              label="纳入人"
              prop="includeUserName"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column label="纳入机构" prop="joinHosName" width="200" />
            <el-table-column label="纳入时间" prop="includeDate" width="180" />
            <el-table-column label="责任医生" prop="doctorUserName" />
            <el-table-column label="操作" fixed="right" width="120">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="pageToPersonFollowUpList(scope.row)"
                  :class="{ grey: scope.row.isExistFollowupPlan === '0' }"
                >
                  查看
                </el-button>
                <el-button type="text" @click="pageToMakePlan(scope.row)"> 制定计划 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg } from 'anx-vue'
import {
  getOrgDiseaseTypes,
  getPatientCenterForPage,
  getFollowUpRate,
  getDoctorUserIdAndName,
  getFollowupIncludeUserList,
  onResearchPrestore,
} from '@/api/modules/PatientCenter/index'
import { isStartFollowupList } from '@/utils/data-map'
import { callbackify } from 'util'
import { mapActions } from "vuex";

export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
  },
  data() {
    return {
      loading: false,
      followOver: '',
      following: '',
      serveNum: '',
      diseaseTypeList: [],
      isStartFollowupList: isStartFollowupList,
      patientList: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      doctorList: [],
      followupIncludeUserList: [],
      isSelectAll: false,
      allSelectRows: [],
      selectedRows: [],
      multipleSelection: [],
      pageNumList: [],
      delList: [],
      tempSelectionList: [],
      joinDate: [],
    }
  },
  computed: {
    theNumberOfItemsHasBeenSelected() {
      let tempTotal = 0
      let temp = this.multipleSelection.map((el) => el.patId)
      let tempList = temp
        .concat(this.tempSelectionList)
        .filter((item, i, arr) => arr.indexOf(item) === arr.lastIndexOf(item))
      console.log('1', 1)
      if (this.isSelectAll) {
        if (tempList.length) {
          tempTotal = this.total - tempList.length
        } else {
          tempTotal = this.total
        }
      } else {
        tempTotal = this.multipleSelection.length
      }
      return tempTotal
    },
  },
  async mounted() {
    let followupPatientCenterQueryParams = window.sessionStorage.getItem(
      'followupPatientCenterQueryParams',
    )
    if (followupPatientCenterQueryParams) {
      this.queryParams = JSON.parse(followupPatientCenterQueryParams).queryParams
      this.pageParams = JSON.parse(followupPatientCenterQueryParams).pageParams
    }
    this.loading = true
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    await this.getDoctorUserIdAndName()
    await this.getOrgDiseaseTypes()
    await this.getFollowupIncludeUserList()

    this.onInquire()
    this.getFollowUpRate()
  },
  methods: {
    ...mapActions({
      setPatientList: "base/setPatientList"
    }),
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('this.multipleSelection', this.multipleSelection.length)
      // console.log('this.pageNumList', this.pageNumList);
    },
    async getDoctorUserIdAndName() {
      try {
        const res = await getDoctorUserIdAndName({ followupFlg: '1' })
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
        let diseaseTypeList = []
        res.result.forEach((item) => {
          diseaseTypeList = diseaseTypeList.concat(item.tagList)
        })
        this.diseaseTypeList = diseaseTypeList
        console.log('diseaseTypeList====', diseaseTypeList)
      } catch (err) {
        console.error(err)
      }
    },
    async getFollowupIncludeUserList() {
      try {
        const res = await getFollowupIncludeUserList()
        this.followupIncludeUserList = res.result
        console.log(`this.followupIncludeUserList`, this.followupIncludeUserList)
        if (
          this.followupIncludeUserList.some(
            (_) => _.userInfoId === window.sessionStorage.getItem('userId'),
          )
        ) {
          this.$set(
            this.queryParams,
            'followupIncludeUserId',
            window.sessionStorage.getItem('userId'),
          )
        } else {
          this.$set(this.queryParams, 'followupIncludeUserId', '')
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getFollowUpRate() {
      try {
        const res = await getFollowUpRate()
        this.followOver = res.result.followOver
        this.following = res.result.following
        this.serveNum = res.result.serveNum
      } catch (err) {
        console.error(err)
      }
    },
    // 查询
    async onInquire(type) {
      if (type === 'btn-search') {
        this.pageParams.pageNum = 1
      }
      this.loading = true
      console.log(this.$route)
      try {
        const res = await getPatientCenterForPage({
          ...this.queryParams,
          ...this.pageParams,
          followupFlg: '1',
          findType: '1',
          includeSDate: this.joinDate
            ? this.joinDate[0]
              ? `${this.joinDate[0]} 00:00:00`
              : ''
            : '',
          includeEDate: this.joinDate
            ? this.joinDate[1]
              ? `${this.joinDate[1]} 23:59:59`
              : ''
            : '',
        })
        window.sessionStorage.setItem(
          'followupPatientCenterQueryParams',
          JSON.stringify({ queryParams: this.queryParams, pageParams: this.pageParams }),
        )
        console.log(`res`, res)
        // this.clearFun();
        const { records, total } = res.result
        // if (records.length === 0 && Object.keys(this.queryParams).length !== 0) {
        //   this.$message.warning('查询结果，暂无数据，请修改查询条件重试')
        //   setTimeout(() => {
        //     this.resetQueryParams()
        //   }, 500)
        //   return
        // }
        this.total = total      
        this.patientList = records.map((item, index) => ({
          ...item,
          isStartFollowupText: isStartFollowupList.find(
            (isStartFollowup) => isStartFollowup.value === item.isStartFollowup,
          )?.label,
          followUpDiseaseText: item.followUpDiseaseCodes
            .map(
              (code) =>
                this.diseaseTypeList.find((diseaseType) => diseaseType.value === code)?.label,
            )
            .join(','),
          cloumnIndex: index + 1 + (this.pageParams.pageNum - 1) * this.pageParams.pageSize,
        }))
        this.patientList.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })

        this.loading = false
        console.log('this.pageParams.pageNum', this.pageParams.pageNum)

        if (this.isSelectAll) {
          let temp = [...new Set(this.pageNumList)]
          console.log('temp', temp)
          console.log('1111111111111', this.pageNumList.includes(this.pageParams.pageNum))
          if (!this.pageNumList.includes(this.pageParams.pageNum)) {
            this.patientList.forEach((item) => {
              this.$refs.singleTable.toggleRowSelection(item, true)
              this.tempSelectionList.push(item.patId)
            })
          }
          this.pageNumList.push(this.pageParams.pageNum)
          console.log('this.tempSelectionList', this.tempSelectionList)
          console.log('this.pageNumList', this.pageNumList)
        }
      } catch (error) {
        this.loading = false
        console.log(`error`, error)
      }
    },
    pageToPersonFollowUpList(row) {
      if (row.isExistFollowupPlan === '0') {
        this.$message.warning('该患者还未制定随访计划')
        return
      }
      this.$router.push({
        name: 'PersonFollowUpList',
        query: {
          patId: row.patId,
        },
      })
    },
    pageToMakePlan(row) {
      this.$router.push({
        name: 'MakePlan',
        query: {
          patId: row.patId,
          hisPatientId: row.patientId,
        },
      })
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.joinDate = []
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.isSelectAll = false
      this.pageNumList = []
      this.multipleSelection = []
      this.tempSelectionList = []
      this.$refs.singleTable.clearSelection()
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    // 结果全选方法  将本页数据全部勾选
    toggleAllSelection(flag) {
      console.log('toggleAllSelection', flag)
      this.pageNumList.push(this.pageParams.pageNum)
      this.patientList.forEach((item) => {
        this.$refs.singleTable.toggleRowSelection(item, flag)
        this.tempSelectionList.push(item.patId)
        this.tempSelectionList = [...new Set(this.tempSelectionList)]
      })
    },
    clearFun() {
      if (this.isSelectAll) {
        this.isSelectAll = false
      } else {
        this.$refs.singleTable.clearSelection()
      }
    },
    isSelectAllChange() {
      console.log('this.isSelectAll', this.isSelectAll)
      if (this.isSelectAll) {
        this.pageNumList = []
        this.multipleSelection = []
        this.tempSelectionList = []
        this.toggleAllSelection(this.isSelectAll)
      } else {
        this.patientList.forEach((item) => {
          this.$refs.singleTable.toggleRowSelection(item, false)
        })
      }
    },
    async onResearchPrestore() {
      try {
        console.log('onResearchPrestore', this.isSelectAll)
        let patIds = []
        if (this.isSelectAll) {
          // console.log('this.multipleSelection', this.multipleSelection);
          // console.log('this.tempSelectionList', this.tempSelectionList);
          let temp = this.multipleSelection.map((el) => el.patId)
          console.log('temp', temp)
          patIds = temp
            .concat(this.tempSelectionList)
            .filter((item, i, arr) => arr.indexOf(item) === arr.lastIndexOf(item))
          console.log('patIds', patIds)
          if (patIds.length === this.total) {
            this.$message.error('请选择患者!')
            return
          }
        } else {
          console.log('this.multipleSelection', this.multipleSelection)
          patIds = this.multipleSelection.map((item) => item.patId)
          if (!patIds.length) {
            this.$message.error('请选择患者!')
            return
          }
        }

        let params = {
          checkStatus: this.isSelectAll ? '1' : '0',
          patIds: patIds,
        }
        if (this.isSelectAll) {
          params = {
            ...params,
            ...this.queryParams,
            includeSDate: this.joinDate
              ? this.joinDate[0]
                ? `${this.joinDate[0]} 00:00:00`
                : ''
              : '',
            includeEDate: this.joinDate
              ? this.joinDate[1]
                ? `${this.joinDate[1]} 23:59:59`
                : ''
              : '',
            diseaseCode: this.queryParams.richDiseaseCode,
          }
        }
        console.log('params===', params)
        const res = await onResearchPrestore(params)
        console.log('onResearchPrestore', res)
        this.$router.push({
          name: 'AddEditorSurvey',
          query: {
            researchId: res.result,
            type: 'add',
          },
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 批量随访
    multiFollowFuc() {
      /* // if (!this.multipleSelection?.length) {
      //   return;
      // } */
      console.log("this.multipleSelection:", this.multipleSelection)
      // this.multipleSelection =  [{"activityMes":[],"address":"/","addressText":"/","age":"37岁","applyType":"EXCEL","archiveDate":"2023-03-10","archiveOrgId":"/","archiveUserId":"/","archiveUserName":"王护士","birthday":"1985-12-01","bloodType":"/","careerCode":"/","caseNo":"/","caseNos":[],"clinicDiag":"/","contactName":"/","contactPhone":"/","createdate":"/","dataSource":"公司体检","diagnosesStr":"高钾血症,高血压,精神障碍","diseaseCode":"/","doctorUserId":"/","doctorUserName":"/","drinkFlg":"/","drinkYears":"/","drugAllergy":"/","eduLevel":"/","exposureHistory":"/","finishArchiveDate":"/","finishArchiveReasonCode":"/","finishArchiveUserId":"/","finishArchiveUserName":"/","followUpDiseaseCodes":["b700715409c94eb8a9ea5aaf8b56cf57","e9c998f4db504309b1f9c5f22fcacb17","f34bda4ff0cc4b8db9edbb77c56a35f8"],"followupFlg":"1","followupModDate":"2023-04-03 10:00:54","height":"/","idNo":"120110198512011111","idType":"1","includeDate":"2023-03-21 14:24:55","includeOrgId":"/","includeUserId":"de017713bd414bcf814d5bf438bc33db","includeUserName":"王护士","isExistFollowupPlan":"1","isStartFollowup":"1","joinHosId":"b963cca8d19c4ec4a7f920152d57201b","joinHosName":"开发慢病医院","joinRegActivityFlg":"N","maritalStatus":"/","modDate":"2023-03-21 14:24:55","modUserId":"/","modUserName":"/","name":"萧六","namePy":"/","nation":"汉","nationId":"/","openId":"/","orgId":"/","patCode":"00001993","patId":"0dd0fd6fc13c46ddb46d1341e6e2762d","patSerialNumber":"/","patType":"/","patientId":"/","patientRichDiseaseList":[],"payType":"/","phoneNo":"18500000006","planNames":[],"recordStatus":"管理中","registerDate":"/","registerFlg":"/","richDiseaseName":"骨质疏松,糖尿病","richDiseases":[{"disabled":false,"label":"骨质疏松","value":"f34bda4ff0cc4b8db9edbb77c56a35f8"},{"disabled":false,"label":"糖尿病","value":"b700715409c94eb8a9ea5aaf8b56cf57"}],"sex":"1","sexDesc":"男","smokeFlg":"/","smokeQty":"/","smokeYears":"/","sportFlg":"/","sportHours":"/","stopDrinkYears":"/","stopSmokeYears":"/","street":"/","userInfoId":"/","weight":"/","workUnits":"/","isStartFollowupText":"是","followUpDiseaseText":",,","cloumnIndex":2},{"activityMes":[],"address":"/","addressText":"/","age":"42岁","applyType":"EXCEL","archiveDate":"2023-03-03","archiveOrgId":"/","archiveUserId":"/","archiveUserName":"李医生","birthday":"1980-12-01","bloodType":"/","careerCode":"/","caseNo":"/","caseNos":[],"clinicDiag":"/","contactName":"/","contactPhone":"/","createdate":"/","dataSource":"公司体检","diagnosesStr":"/","diseaseCode":"/","doctorUserId":"/","doctorUserName":"/","drinkFlg":"/","drinkYears":"/","drugAllergy":"/","eduLevel":"/","exposureHistory":"/","finishArchiveDate":"/","finishArchiveReasonCode":"/","finishArchiveUserId":"/","finishArchiveUserName":"/","followUpDiseaseCodes":["b700715409c94eb8a9ea5aaf8b56cf57","e9c998f4db504309b1f9c5f22fcacb17"],"followupFlg":"1","followupModDate":"2023-03-22 10:55:51","height":"/","idNo":"120110198012011111","idType":"1","includeDate":"2023-03-07 15:30:34","includeOrgId":"/","includeUserId":"de017713bd414bcf814d5bf438bc33db","includeUserName":"王护士","isExistFollowupPlan":"1","isStartFollowup":"1","joinHosId":"b963cca8d19c4ec4a7f920152d57201b","joinHosName":"开发慢病医院","joinRegActivityFlg":"N","maritalStatus":"/","modDate":"2023-03-07 15:30:34","modUserId":"/","modUserName":"/","name":"萧一","namePy":"/","nation":"汉","nationId":"/","openId":"/","orgId":"/","patCode":"00001989","patId":"c316a97a69fc4e3cb7668cc428c5644c","patSerialNumber":"/","patType":"/","patientId":"/","patientRichDiseaseList":[],"payType":"/","phoneNo":"18500000001","planNames":[],"recordStatus":"管理中","registerDate":"/","registerFlg":"/","richDiseaseName":"高血压,糖尿病","richDiseases":[{"disabled":false,"label":"糖尿病","value":"b700715409c94eb8a9ea5aaf8b56cf57"},{"disabled":false,"label":"高血压","value":"e9c998f4db504309b1f9c5f22fcacb17"}],"sex":"1","sexDesc":"男","smokeFlg":"/","smokeQty":"/","smokeYears":"/","sportFlg":"/","sportHours":"/","stopDrinkYears":"/","stopSmokeYears":"/","street":"/","userInfoId":"/","weight":"/","workUnits":"/","isStartFollowupText":"是","followUpDiseaseText":",","cloumnIndex":5},{"activityMes":[],"address":"/","addressText":"/","age":"34岁","applyType":"PAT","archiveDate":"2023-03-10","archiveOrgId":"/","archiveUserId":"/","archiveUserName":"王护士","birthday":"1988-12-12","bloodType":"/","careerCode":"/","caseNo":"/","caseNos":[],"clinicDiag":"/","contactName":"/","contactPhone":"/","createdate":"/","dataSource":"公众号","diagnosesStr":"/","diseaseCode":"/","doctorUserId":"/","doctorUserName":"/","drinkFlg":"/","drinkYears":"/","drugAllergy":"/","eduLevel":"/","exposureHistory":"/","finishArchiveDate":"/","finishArchiveReasonCode":"/","finishArchiveUserId":"/","finishArchiveUserName":"/","followUpDiseaseCodes":[],"followupFlg":"1","followupModDate":"2023-03-21 10:58:16","height":"/","idNo":"120110198812121111","idType":"/","includeDate":"2023-03-21 10:47:59","includeOrgId":"/","includeUserId":"de017713bd414bcf814d5bf438bc33db","includeUserName":"王护士","isExistFollowupPlan":"0","isStartFollowup":"0","joinHosId":"b963cca8d19c4ec4a7f920152d57201b","joinHosName":"开发慢病医院","joinRegActivityFlg":"N","maritalStatus":"/","modDate":"2023-03-21 10:47:59","modUserId":"/","modUserName":"/","name":"萧五","namePy":"/","nation":"回族","nationId":"/","openId":"/","orgId":"/","patCode":"00001992","patId":"8e828cda0d734375a90d4bceee635420","patSerialNumber":"/","patType":"/","patientId":"/","patientRichDiseaseList":[],"payType":"/","phoneNo":"18500000004","planNames":[],"recordStatus":"管理中","registerDate":"/","registerFlg":"/","richDiseaseName":"骨质疏松,高血压","richDiseases":[{"disabled":false,"label":"骨质疏松","value":"f34bda4ff0cc4b8db9edbb77c56a35f8"},{"disabled":false,"label":"高血压","value":"e9c998f4db504309b1f9c5f22fcacb17"}],"sex":"1","sexDesc":"男","smokeFlg":"/","smokeQty":"/","smokeYears":"/","sportFlg":"/","sportHours":"/","stopDrinkYears":"/","stopSmokeYears":"/","street":"/","userInfoId":"/","weight":"/","workUnits":"/","isStartFollowupText":"否","followUpDiseaseText":"/","cloumnIndex":7}]
      let oneItem = this.multipleSelection[0].richDiseases;
      if (!oneItem?.length) {
        return;
      }
      let diseaseTypeList = [];
      let obj = {};
      oneItem.map(item => {
        this.multipleSelection.map(vv => {
          let codes = vv.richDiseases.map(vv => {return vv.value});
          let index = codes.indexOf(item.value)
          if (index > -1 && (vv.joinHosName === this.multipleSelection[0].joinHosName)) {
            obj[item.value] = (obj[item.value] || 0) + 1;
          }
        })
      })
      let flag = false;
      for(let i in obj) {
        if(obj[i] == this.multipleSelection.length) {
          flag = true;
          let items = oneItem.find(item => item.value == i)
          diseaseTypeList.push(items)
        }
      }
      console.log("objobjobjobjobj:", obj, diseaseTypeList)
      let patientList = this.multipleSelection.map(item => {
        return {
          ...item,
          commonList: diseaseTypeList
        }
      })
      if (flag) {
        this.setPatientList(patientList);
        this.$router.push({
          name: "multiFollow"
        })
      }
    }
  },
  watch: {
    isSelectAll(newVal) {
      console.log('newVal', newVal)
      if (!newVal) {
        this.pageNumList = []
        this.multipleSelection = []
        this.$refs.singleTable.clearSelection()
      } else {
        this.$refs.singleTable.clearSelection()
        this.multipleSelection = []
        this.toggleAllSelection(this.isSelectAll)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.FU-PatientCenter {
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px;
  }
  .header {
    .bolck {
      border-radius: 2px;
      font-size: 16px;
      color: #101010;
      text-align: center;
      background-color: #fff;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon-div {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        line-height: 24px;
        margin-right: 5px;
        &.user {
          background-color: rgba(106, 140, 215, 0.3);
          color: #6a8cd7;
        }
        &.time {
          background-color: rgba(244, 199, 89, 0.3);
          color: #f4c759;
        }
        &.document {
          background-color: rgba(146, 206, 117, 0.3);
          color: #92ce75;
        }
      }
    }
  }
  .middle {
    margin-left: 20px;
    margin-right: 10px;
    ::v-deep.el-checkbox__label {
      padding-left: 3px;
      font-size: 14px;
    }
  }
  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
  .ProList {
    border-radius: 2px;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
  }
  .grey {
    color: #919191;
  }
}
</style>
