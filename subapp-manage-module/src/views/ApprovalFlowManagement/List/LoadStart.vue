<template>
  <div>
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <el-input placeholder="流程名称/模板名称" v-model="queryParams.searchValue" clearable />
        <el-select v-model="queryParams.app" placeholder="所属应用" clearable>
          <el-option label="全科门诊" value="1" />
        </el-select>
        <el-select v-model="queryParams.org" placeholder="集团" clearable>
          <el-option label="西红柿集团" value="1" />
        </el-select>
        <el-select v-model="queryParams.status" placeholder="状态" clearable>
          <el-option label="暂存" value="1" />
          <el-option label="完成" value="2" />
        </el-select>
        <el-select v-model="queryParams.creater" placeholder="创建人" clearable>
          <el-option label="暂存" value="1" />
          <el-option label="完成" value="2" />
        </el-select>
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
          range-separator="至"
          v-model="queryParams.createDate"
          clearable
        />
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <template #batchActions>
        <el-button type="primary" @click="pageToApprovalFlowDetail('add')">新增审批流</el-button>
        <el-button @click="batchStart('suspend')">批量开启</el-button>
        <div class="alert" v-if="multipleSelection.length !== 0">
          <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
          <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
          <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
        </div>
      </template>
      <el-table ref="singleTable" v-adaptive="{ bottomOffset: 70 }" height="0" :data="approvalList" border v-loading="loading">
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流程名称" prop="referralTypeDesc" />
        <el-table-column label="所属应用" prop="auditDate" />
        <el-table-column label="集团" prop="outHosName" />
        <el-table-column label="模板名称" prop="outDeptName"/>
        <el-table-column label="流程配置" prop="applyDrName"  />
        <el-table-column label="状态" prop="patName" />
        <el-table-column label="创建人" prop="sexDesc"/>
        <el-table-column label="创建时间" prop="age" />
        <el-table-column label="更新人" prop="idNo" />
        <el-table-column label="更新时间" prop="phoneNo" />
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="{ row }">
            <el-button type="text" @click="pageToApprovalFlowDetail('edit')">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { ProList } from "anx-vue";
import approvalListMixin from './approvalList.mixin';

export default {
  components: { ProList },
  mixins: [approvalListMixin],
  data() {
    return {
      multipleSelection: []
    };
  },

};
</script>

<style lang="scss" scoped>
.ProList {
  border-radius: 2px;
  padding: 10px;
  background-color: #fff;
}
</style>
