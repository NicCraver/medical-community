<template>
  <div class="has-suspend">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <OrgHosSelect ref="orgRef" v-model="pageParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="pageParams.hosId"
          :parentId="pageParams.orgId"
          placeholder="机构"
        ></OrgHosSelect>
        <el-input placeholder="姓名/手机号" v-model="queryParams.searchValue" clearable />
        <el-select placeholder="随访类型" v-model="queryParams.followupTypeAssess" clearable>
          <el-option
            v-for="item in followupTypeAssessList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select placeholder="随访病种" v-model="queryParams.diseaseCode" clearable filterable>
          <el-option v-for="item in diseaseTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select placeholder="中止原因" v-model="queryParams.terminationReasonCode" clearable>
          <el-option v-for="item in suspendReasons" :key="item.value" :value="item.value" :label="item.label" />
        </el-select>
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="随访截止开始日期"
          end-placeholder="随访截止结束日期"
          range-separator="至"
          v-model="queryParams.followupTime"
          clearable
          style="width: auto"
        />
        <el-select placeholder="纳入人" v-model="queryParams.followupIncludeUserId" clearable>
          <el-option
            v-for="item in followupIncludeUserList"
            :key="item.userInfoId"
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
        v-loading="loading"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
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
        <el-table-column label="任务实际中止时间" prop="terminationDate" min-width="180" />
        <el-table-column label="中止原因" prop="terminationReason" />
        <el-table-column label="随访频率" prop="frequencyText" />
        <el-table-column label="随访计划起止时间" prop="followStartAndEndTime" min-width="220" />
        <el-table-column label="随访机构" prop="followupHosName" min-width="220" />
        <el-table-column label="操作人" prop="terminationUserName" />
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg } from 'anx-vue';
import indexMixin from './index.mixin';
import { suspendReasons, planReasonList } from '@/utils/data-map';

export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
  },
  mixins: [indexMixin],
  data() {
    return {
      followupStatus: '3',
      suspendReasons: [],
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
    };
  },
  mounted() {
    this.suspendReasons = suspendReasons.concat(planReasonList);
    this.suspendReasons.splice(2, 1);
    console.log('this.suspendReasons', this.suspendReasons);
  },
};
</script>

<style lang="scss" scoped>
.has-suspend {
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
}
</style>
