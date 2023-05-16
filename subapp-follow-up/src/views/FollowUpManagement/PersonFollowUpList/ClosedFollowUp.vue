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
    <el-table-column label="随访病种" prop="diseaseTypeText" />
    <el-table-column label="随访方式" prop="followUpTypeText" />
    <el-table-column label="随访状态" prop="followUpStatusText" />
    <el-table-column label="随访机构" prop="followupHosName" min-width="220" />
    <el-table-column label="任务随访关闭（截止）时间" prop="nextFollowTime" width="210" />
    <el-table-column label="随访频率" prop="frequencyText" />
    <el-table-column label="随访计划起止时间" prop="followStartAndEndTime" width="210" />
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
