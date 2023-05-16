<template>
  <el-table
    v-adaptive="{ bottomOffset: 75 }"
    height="0"
    ref="singleTable"
    :data="followUpList"
    border
  >
    <el-table-column label="序号" type="index" width="50">
      <template slot-scope="scope">
        <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
      </template>
    </el-table-column>
    <el-table-column label="姓名" prop="name" />
    <el-table-column label="性别" prop="sexText" />
    <el-table-column label="年龄" prop="age" />
    <el-table-column label="联系电话" prop="phone" />
    <el-table-column label="随访种类" prop="diseaseTypeText" />
    <el-table-column label="随访方式" prop="followUpTypeText" />
    <el-table-column label="随访状态" prop="followUpStatusText" />
    <el-table-column label="随访机构" prop="followupHosName" width="130" />
    <el-table-column label="是否超期">
      <template slot-scope="{ row }">
        <span v-if="row.overdueFlgText === '超期'" style="color: #cf1322">
          {{ row.overdueFlgText }}
        </span>
        <span v-if="row.overdueFlgText === '正常'" style="color: #389e0d">
          {{ row.overdueFlgText }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="任务随访截止时间" prop="nextFollowTime" />
    <el-table-column label="任务实际中止时间" prop="terminationDate" />
    <el-table-column label="中止原因" prop="terminationReason" />
    <el-table-column label="随访频率" prop="frequencyText" />
    <el-table-column label="随访计划起止时间" prop="followStartAndEndTime" width="210" />
    <el-table-column label="随访人员" prop="terminationUserName" />
  </el-table>
</template>

<script>
export default {
  props: {
    pageParams: {
      type: Object,
    },
    followUpList: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>
