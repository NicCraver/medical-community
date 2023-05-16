<template>
  <div class="PatientsWithFeedback">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0">
      <template #title>
        <span>调研反馈</span>
        <span class="research-brief">
          <i class="el-icon el-icon-warning-outline"></i>
          <span>调研名称：{{ researchDetail.researchName }}</span>
          <span>表单名称：{{ researchDetail.templateName }}</span>
          <span>完成度：{{ researchDetail.finishCount }}/{{ researchDetail.totalCount }}（完成人数/总人数）</span>
          <div class="status">状态：{{ researchStatusText }}</div>
        </span>
      </template>
      <template #tab>
        <el-tabs v-model="activeResearchStatus" @tab-click="resetQueryParams">
          <el-tab-pane
            v-for="item in tabDatas"
            :key="item.researchStatus"
            :name="item.researchStatus"
            :label="item.label"
          ></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="姓名/手机号" v-model="queryParams.searchValue" clearable />
            <el-select placeholder="慢病种类" v-model="queryParams.diseaseCode" clearable filterable>
              <el-option v-for="item in diseaseTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- <el-select placeholder="责任医生" v-model="queryParams.doctorUserId" clearable filterable>
              <el-option v-for="item in doctorList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-select placeholder="纳入人" v-model="queryParams.includeUserId" clearable>
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
              end-placeholder="纳入结束时间"
              range-separator="至"
              v-model="includeDate"
              clearable
              style="width: 410px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
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
            v-adaptive="{ bottomOffset: 68 }"
            height="0"
            ref="singleTable"
            :data="dataList"
            border
            v-loading="loading"
            row-key="patResId"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="50"
              v-if="activeResearchStatus === '1'"
              key="selection"
              :reserve-selection="true"
            />
            <el-table-column label="序号" type="index" width="50" key="index">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="完成时间" prop="finishDate" v-if="activeResearchStatus === '2'" />
            <el-table-column label="姓名" prop="name" />
            <el-table-column label="性别" prop="sex" />
            <el-table-column label="年龄" prop="age" />
            <el-table-column label="手机号" prop="phoneNo" min-width="120" />
            <el-table-column label="慢病种类" prop="richDiseaseName" min-width="120" />
            <el-table-column label="随访病种" prop="followUpDiseaseText" />
            <el-table-column label="纳入人" prop="includeUserName" />
            <el-table-column label="纳入时间" prop="includeDate" min-width="180" />
            <el-table-column label="操作人" prop="terminationUserName" v-if="activeResearchStatus === '3'" />
            <!-- <el-table-column label="责任医生" prop="doctorUserName" /> -->
            <el-table-column
              label="操作"
              fixed="right"
              width="120"
              v-if="activeResearchStatus !== '3'"
              key="actions"
            >
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  v-if="activeResearchStatus === '2'"
                  @click="pageToResearchDetail(row)"
                >查看</el-button>
                <el-button
                  type="text"
                  v-if="activeResearchStatus === '1'"
                  @click="downResearch(row)"
                >关闭</el-button>
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout, ProList } from "anx-vue";
import {
  getResearchFeedbackInfo,
  getResearchFormHeaderInfo,
  getOrgDiseaseTypes,
  downResearch,
  getFollowupIncludeUserList,
  getDoctorUserIdAndNameForRes
} from '@/api/modules/PatientCenter';
import { researchStatusList } from '@/utils/data-map';

export default {
  components: {
    ProLayout,
    ProList
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
        {
          label: '已关闭',
          researchStatus: '3',
        }
      ],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dataList: [],
      diseaseTypeList: [],
      doctorList: [],
      followupIncludeUserList: [],
      includeDate: [],
      multipleSelection: [],
      researchDetail: {},
    };
  },
  computed: {
    researchStatusText() {
      const researchStatusItem = researchStatusList.find(item => item.value === this.researchDetail.researchStatus)
      return researchStatusItem ? researchStatusItem.label : ''
    }
  },
  async created() {
    this.researchId = this.$route.query.researchId;
    this.loading = true;
    this.getResearchFormHeaderInfo();
    await this.getFollowupIncludeUserList();
    await this.getOrgDiseaseTypes();
    await this.getDoctorUserIdAndNameForRes();
    this.onInquire();
  },
  methods: {
    async getOrgDiseaseTypes() {
      try {
        const res = await getOrgDiseaseTypes();
        let diseaseTypeList = [];
        res.result.forEach((item) => {
          diseaseTypeList = diseaseTypeList.concat(item.tagList);
        });
        this.diseaseTypeList = diseaseTypeList;
        console.log('diseaseTypeList====', diseaseTypeList);
      } catch (err) {
        console.error(err);
      }
    },
    async getFollowupIncludeUserList() {
      try {
        const res = await getFollowupIncludeUserList();
        console.log('getFollowupIncludeUserList====', res);
        this.followupIncludeUserList = res.result;
      } catch (err) {
        console.error(err);
      }
    },
    async getDoctorUserIdAndNameForRes() {
      try {
        const res = await getDoctorUserIdAndNameForRes({ researchId: this.researchId,  });
        console.log('getDoctorUserIdAndNameForRes====', res);
        this.doctorList = res.result.map((item) => ({
          label: item.doctorUserName,
          value: item.doctorUserId,
        }));
      } catch (err) {
        console.error(err);
      }
    },
    async getResearchFormHeaderInfo() {
      try {
        const res = await getResearchFormHeaderInfo({ researchId: this.researchId });
        console.log('getResearchFormHeaderInfo', res);
        this.researchDetail = res.result;
      } catch(err) {
        console.error(err);
      }
    },
    async onInquire() {
      try {
        const res = await getResearchFeedbackInfo({
          ...this.queryParams,
          ...this.pageParams,
          researchId: this.researchId,
          recordStatus: this.activeResearchStatus,
          includeSDate: this.includeDate ? this.includeDate[0] ? `${this.includeDate[0]} 00:00:00` : '' : '',
          includeEDate: this.includeDate ? this.includeDate[1] ? `${this.includeDate[1]} 23:59:59` : '' : '',
        });
        const { result, total } = res;
        this.clearFun();
        if (result.length === 0 && Object.keys(this.queryParams).length !== 0) {
          this.$message.warning('查询结果，暂无数据，请修改查询条件重试');
          setTimeout(() => {
            this.resetQueryParams();
          }, 500);
          return;
        }
        this.total = total;
        this.dataList = result.map(item => ({
          ...item,
          followUpDiseaseText: item.followUpDiseaseCodes
            .map((code) => this.diseaseTypeList.find((diseaseType) => diseaseType.value === code).label)
            .join(','),
        }));
        this.dataList.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/';
            }
          }
        });
        console.log('getResearchFeedbackInfo', res)
      } catch(err) {
        console.log(err)
      }
      this.loading = false;
    },
    async downResearch(row) {
      this.$confirm('确定关闭此调研？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          let patResIds;
          if (row.patResId) {
            patResIds = [row.patResId];
          } else {
            patResIds = this.multipleSelection.map(item => item.patResId);
            if (!patResIds.length) {
              this.$message.error('请选择患者');
              return;
            }
          }
          const res = await downResearch({
            patResIds: patResIds,
            terminationUserId: sessionStorage.getItem("userId"),
            terminationUserName: sessionStorage.getItem("loginName")
          });
          console.log('downResearch', res);
          this.clearFun();
          this.onInquire();
        } catch(error) {
          console.error(error);
        }
      }).catch(() => {});
    },
    resetQueryParams() {
      this.queryParams = {};
      this.includeDate = [];
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.onInquire();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    clearFun() {
      this.$refs.singleTable.clearSelection();
    },
    pageToResearchDetail(row) {
      this.$router.push({
        name: 'ResearchDetail',
        query: {
          patId: row.patId,
          researchId: row.researchId
        }
      });
    }
  }
};
</script>

<style lang="scss">
.PatientsWithFeedback {
  .research-brief {
    display: inline-block;
    font-weight: normal;
    background-color: #F2F2F2;
    color: #101010;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    position: absolute;
    left: 100px;
    right: 10px;
    padding-left: 10px;
    .el-icon-warning-outline {
      margin-right: 16px;
    }
    > span {
      padding: 0 16px;
      border-right: 1px solid #bbbbbb;
      &:nth-child(4) {
        border: 0;
      }
    }
    .status {
      font-weight: bold;
      color: #4468BD;
      float: right;
      margin-right: 5px;
    }
  }
  .ProList {
    border-radius: 2px;
    padding: 10px;
    background-color: #fff;
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
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 !important;
  }
  .el-tabs__nav,
  .el-tabs__nav-scroll {
    background-color: #fff !important;
  }
  .el-tabs__item.is-top.is-active {
    border-bottom: none !important;
  }
  .el-tabs__item.is-active {
    color: #134796 !important;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #949da3 !important;
  }
  .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: #134796 !important;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    border-radius: 4px !important;
  }
  .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
  }
}
</style>
<style lang="scss" scoped></style>
