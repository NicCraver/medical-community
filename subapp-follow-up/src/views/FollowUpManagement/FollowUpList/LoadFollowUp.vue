<template>
  <div class="load-followup">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <OrgHosSelect ref="orgRef" v-model="pageParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="pageParams.hosId"
          :parentId="pageParams.orgId"
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
        <el-select placeholder="随访病种" v-model="queryParams.diseaseCode" clearable filterable>
          <el-option
            v-for="item in diseaseTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select placeholder="是否超期" v-model="queryParams.overdueFlg" clearable>
          <el-option
            v-for="item in overdueFlgList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select placeholder="是否暂存" v-model="queryParams.isTemporary" clearable>
          <el-option
            v-for="item in isTemporaryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select placeholder="生成时间" v-model="queryParams.initCode" clearable>
          <el-option
            v-for="item in dateSelectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select placeholder="随访类型" v-model="queryParams.followupTypeAssess" clearable>
          <el-option
            v-for="item in followupTypeAssessList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select placeholder="随访方式" v-model="queryParams.followupType" clearable>
          <el-option
            v-for="item in followUpTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>      
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="随访截止开始日期"
          end-placeholder="随访截止结束日期"
          range-separator="至"
          v-model="queryParams.followupTime"
          clearable
          style="width: 410px"
        />
        <el-select placeholder="是否可录入" v-model="queryParams.isEntry" clearable>
          <el-option
            v-for="item in isEntryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select placeholder="纳入人" v-model="queryParams.followupIncludeUserId" clearable>
          <el-option
            v-for="item in followupIncludeUserList"
            :key="item.index"
            :label="item.loginName"
            :value="item.userInfoId"
          />
        </el-select>
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <el-table
        v-adaptive="{ bottomOffset: 68 }"
        height="0"
        ref="singleTable"
        :data="followUpList"
        border
        empty-text="做的很好，现无可录入任务"
        v-loading="loading"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生成时间" prop="initDate" width="110" />
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="性别" prop="sexText" />

        <el-table-column label="年龄" prop="age" />
        <el-table-column label="联系电话" prop="phone" min-width="120" />
        <el-table-column label="随访病种" prop="diseaseTypeText" min-width="120" />
        <el-table-column label="随访类型" prop="followupTypeAssess">
          <template slot-scope="scope">
            <span>{{ scope.row.followupTypeAssess=='1'?'计划':'评估' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="随访方式" prop="followUpTypeText" />
        <el-table-column label="是否超期" prop="overdueFlgText" />
        <el-table-column label="任务随访截止时间" prop="nextFollowTime" min-width="180" />
        <el-table-column label="随访频率" prop="frequencyText" />
        <el-table-column label="随访计划起止时间" prop="followStartAndEndTime" min-width="220" />
        <el-table-column label="随访机构" prop="followupHosName" min-width="220" />
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="{ row }">
            <!-- 所有随访方式未到可录入时间显示录入置灰点击提示 -->
            <!-- 到可录入时间网络随访方式显示查看，点击进去查看表单置灰 -->
            <span v-if="row.followUpTypeText === '网络'">
              <el-button type="text" @click="pageToFollowUpDetail(row)" v-if="row.isEntry === '1'"
                >查看</el-button
              >
              <el-button type="text" v-else @click="pageToFollowUpDetail(row)" class="grey"
                >录入</el-button
              >
            </span>

            <span v-else>
              <el-button
                type="text"
                v-if="row.entryStatus === '1'"
                @click="pageToFollowUpDetail(row)"
                :class="{ grey: row.isEntry === '0' }"
                >录入</el-button
              >

              <el-button
                type="text"
                v-if="row.entryStatus === '2'"
                @click="pageToFollowUpDetail(row)"
                >补录</el-button
              >

              <el-button
                type="text"
                v-if="row.entryStatus === '3'"
                @click="pageToFollowUpDetail(row)"
                >暂存</el-button
              >
            </span>
            <el-button
              type="text"
              @click="showsuspendFollowUp(row)"
              style="margin-left: 10px"
              v-if="row.followupTypeAssess === '1'"
              >中止</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </ProList>
    <SuspendFollowUp
      :visible="suspendFollowUpVisible"
      :suspendFollowParams="suspendFollowParams"
      :closeDialog="
        () => {
          suspendFollowUpVisible = false
        }
      "
      @terminationFollowUpSuccess="onInquire"
    />
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg } from 'anx-vue'
import SuspendFollowUp from '@/components/SuspendFollowUp/SuspendFollowUp'
import indexMixin from './index.mixin'
import { isEntryList, followUpTypeList, isTemporaryList } from '@/utils/data-map'

export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
    SuspendFollowUp,
  },
  mixins: [indexMixin],
  data() {
    return {
      followupStatus: '1',
      suspendFollowUpVisible: false,
      suspendFollowParams: {},
      isEntryList: isEntryList,
      isTemporaryList: isTemporaryList,
      followUpTypeList: followUpTypeList,
      followupTypeAssessList:[
        {
          label:'计划',
          value:'1'
        },
        {
          label:'评估',
          value:'2'
        }
      ]
    }
  },
  created() {
    let query = this.$route?.query || {};
    this.queryParams.overdueFlg = (query?.overdueFlg || "").toString();
  },
  methods: {
    showsuspendFollowUp(row) {
      this.suspendFollowUpVisible = true
      this.suspendFollowParams = row
    },
  },
}
</script>

<style lang="scss" scoped>
.load-followup {
  .header {
    .bolck {
      border-radius: 2px;
      font-size: 16px;
      color: #101010;
      text-align: center;
      background-color: #fff;
      height: 75px;
      line-height: 75px;
    }
  }
  .ProList {
    border-radius: 2px;
    padding: 10px;
    background-color: #fff;
  }
  .grey {
    color: #919191;
  }
}
</style>
