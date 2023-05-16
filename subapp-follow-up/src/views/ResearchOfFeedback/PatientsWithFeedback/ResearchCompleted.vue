<template>
  <div class="RoleAdmin">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <el-input placeholder="调研名称" v-model="queryParams.researchName" clearable />
        <el-input placeholder="姓名/手机号" v-model="queryParams.searchValue" clearable />
        <el-select placeholder="慢病种类" v-model="queryParams.diseaseCode" clearable filterable>
          <el-option
            v-for="item in diseaseTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- <el-select placeholder="责任医生" v-model="queryParams.doctorUserId" clearable filterable>
              <el-option v-for="item in doctorList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
        <el-select placeholder="纳入人" v-model="queryParams.IncludeUserId" clearable>
          <el-option
            v-for="item in followupIncludeUserList"
            :key="item.userInfoId"
            :label="item.loginName"
            :value="item.userInfoId"
          />
        </el-select>
        <el-select placeholder="发起人" v-model="queryParams.researchUserId" clearable filterable>
          <el-option
            v-for="item in researchUserList"
            :key="item.researchUserId"
            :label="item.researchUserName"
            :value="item.researchUserId"
          />
        </el-select>
        <OrgHosSelect ref="orgRef" v-model="pageParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="pageParams.hosId"
          :parentId="pageParams.orgId"
          placeholder="调研机构"
        ></OrgHosSelect>
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="纳入开始日期"
          end-placeholder="纳入结束日期"
          range-separator="至"
          v-model="includeDate"
          clearable
          style="width: 410px"
        />
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="完成开始日期"
          end-placeholder="完成结束日期"
          range-separator="至"
          v-model="finishDate"
          clearable
          style="width: 410px"
          v-if="activeResearchStatus === '2'"
        />
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire()">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <template #batchActions v-if="activeResearchStatus === '1'">
        <el-button type="primary" @click="downResearch">批量关闭</el-button>
        <div class="alert" v-if="multipleSelection.length">
          <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
          <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
          <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
        </div>
      </template>
      <el-table
        v-adaptive="{ bottomOffset: 50 }"
        height="0"
        ref="singleTable"
        :data="dataList"
        border
        v-loading="loading"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" :reserve-selection="true" />
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="finishDate" />
        <el-table-column label="调研名称" prop="researchName" />
        <el-table-column label="开启时间" prop="startDate" width="140"  show-overflow-tooltip/>
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="性别" prop="sex" />
        <el-table-column label="年龄" prop="age" />
        <el-table-column label="手机号" prop="phoneNo" min-width="120" />
        <el-table-column label="慢病种类" prop="richDiseaseName" min-width="120" />
        <el-table-column label="随访病种" prop="richDiseaseName" />
        <el-table-column label="纳入人" prop="includeUserName" min-width="180" />
        <el-table-column label="纳入机构" prop="includeHosName" min-width="180" />
        <el-table-column label="纳入时间" prop="includeDate" min-width="180" />
        <!-- <el-table-column label="责任医生" prop="includeDate" min-width="140" /> -->
        <el-table-column label="发起人" prop="researchUserName" min-width="140"  show-overflow-tooltip/>
        <el-table-column label="调研机构" prop="researchHosName" min-width="140" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              v-if="activeResearchStatus === '2'"
              @click="pageToResearchDetail(row)"
              >查看</el-button
            >
            <el-button type="text" v-else @click="downResearch(row)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { ProList } from 'anx-vue'
import {
  getResearchUserInfo,
  getPatientFeedbackInfo,
  getOrgDiseaseTypes,
  downResearch,
  getFollowupIncludeUserList,
  getDoctorUserIdAndNameForRes,
} from '@/api/modules/PatientCenter'
export default {
  components: {
    ProList,
  },
  data() {
    return {
      loading: false,
      activeResearchStatus: '2',
      tabDatas: [
        {
          label: '已完成',
          researchStatus: '2',
        },
        {
          label: '未完成',
          researchStatus: '1',
        },
      ],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      dataList: [],
      diseaseTypeList: [],
      doctorList: [],
      followupIncludeUserList: [],
      includeDate: [],
      finishDate: [],
      multipleSelection: [],
      researchUserList: [],
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    //this.loading = true
    await this.getResearchUserInfo()
    await this.getOrgDiseaseTypes()
    await this.getFollowupIncludeUserList()
    await this.getDoctorUserIdAndNameForRes()
    this.onInquire()
  },
  methods: {
    async getResearchUserInfo() {
      try {
        const res = await getResearchUserInfo()
        console.log('getResearchUserInfo===', res)
        this.researchUserList = res.result
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
        console.log('getFollowupIncludeUserList====', res)
        this.followupIncludeUserList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async getDoctorUserIdAndNameForRes() {
      try {
        const res = await getDoctorUserIdAndNameForRes({ followupFlg: '1' })
        console.log('getDoctorUserIdAndNameForRes====', res)
        this.doctorList = res.result.map((item) => ({
          label: item.doctorUserName,
          value: item.doctorUserId,
        }))
      } catch (err) {
        console.error(err)
      }
    },
    async onInquire() {
      try {
        this.loading = true;
        const res = await getPatientFeedbackInfo({
          ...this.queryParams,
          ...this.pageParams,
          recordStatus: this.activeResearchStatus,
          includeSDate: this.includeDate
            ? this.includeDate[0]
              ? `${this.includeDate[0]} 00:00:00`
              : ''
            : '',
          includeEDate: this.includeDate
            ? this.includeDate[1]
              ? `${this.includeDate[1]} 23:59:59`
              : ''
            : '',
          finishSDate: this.finishDate
            ? this.finishDate[0]
              ? `${this.finishDate[0]} 00:00:00`
              : ''
            : '',
          finishEDate: this.finishDate
            ? this.finishDate[1]
              ? `${this.finishDate[1]} 23:59:59`
              : ''
            : '',
        })        
        console.log('getPatientFeedbackInfo==', res)       
        if(res.code == 0) {
          this.total = res.total;
          if (res.result && res.result.length) {
            this.dataList = res.result.map((item) => ({
              ...item,
              followUpDiseaseText: item.followUpDiseaseCodes
                .map(
                  (code) =>
                    this.diseaseTypeList.find((diseaseType) => diseaseType.value === code).label,
                )
                .join(','),
            }))
          }else{
            this.dataList = [];
          }                         
        } 
        setTimeout(() => {
          this.loading = false;    
        }, 500);      
        // if (!res.result || !res.result.length) {         
        //   if (this.pageParams.pageNum === 1) {
        //     this.followUpList = []
        //   } else {
        //     this.pageParams.pageNum = 1
        //     this.onInquire()
        //   }
        //   return
        // }      
      } catch (err) {      
        this.loading = false;
        console.error(err)
      }
    },
    async downResearch(row) {
      this.$confirm('确定关闭此调研？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          try {
            let patResIds
            if (row.patResId) {
              patResIds = [row.patResId]
            } else {
              patResIds = this.multipleSelection.map((item) => item.patResId)
              if (!patResIds.length) {
                this.$message.error('请选择患者')
                return
              }
            }
            const res = await downResearch({
              patResIds: patResIds,
              terminationUserId: sessionStorage.getItem('userId'),
              terminationUserName: sessionStorage.getItem('loginName'),
            })
            console.log('downResearch', res)
            this.clearFun()
            this.onInquire()
          } catch (error) {
            console.error(error)
          }
        })
        .catch(() => {})
    },
    async resetQueryParams() {
      this.queryParams = {}
      this.includeDate = []
      this.finishDate = []
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.onInquire()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    pageToResearchDetail(row) {
      this.$router.push({
        name: 'ResearchDetail',
        query: {
          patId: row.patId,
          researchId: row.researchId,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.RoleAdmin {
  .link {
    color: #446abd;
    text-decoration: underline;
    text-decoration-color: #446abd;
    cursor: pointer;
  }
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px !important;
  }

  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }

  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }

  .ProList {
    border-radius: 2px;
    // margin-top: 10px !important;
    // padding: 10px;
    background-color: #fff;
  }

  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
}
</style>
