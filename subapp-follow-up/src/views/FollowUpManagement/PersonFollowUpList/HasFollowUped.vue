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
    <el-table-column label="联系电话" prop="phone" width="130" />
    <el-table-column label="随访病种" prop="diseaseTypeText" />
    <el-table-column label="随访方式" prop="followUpTypeText" />
    <el-table-column label="随访状态" prop="followUpStatusText" />
    <el-table-column label="随访机构" prop="followupHosName"  width="130"/>
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
    <!-- <el-table-column label="随访机构" prop="followupHosName" min-width="220" /> -->
    <!-- <el-table-column label="是否超期" prop="overdueFlgText" /> -->
    <el-table-column label="任务随访截止时间" prop="nextFollowTime" min-width="140" />
    <el-table-column label="任务实际随访时间" prop="followupDate" min-width="140" />
    <el-table-column label="随访人员" prop="followupUserName" />
    <el-table-column label="随访频率" prop="frequencyText" />
    <el-table-column label="随访计划起止时间" prop="followStartAndEndTime" min-width="220" />
    <el-table-column label="操作" fixed="right" width="120">
      <template slot-scope="{ row }">
        <el-button type="text" @click="pageToFollowUpDetail(row)"> 查看 </el-button>
        <el-button
          v-if="
            (row.followupType === '2' || row.followupType === '4') &&
            row.feedbackStatus !== '/' &&
            row.followupTypeAssess !== '2'
          "
          type="text"
          @click="pageToFollowUpDetail(row)"
        >
          {{ row.feedbackStatus === '0' ? '待评估' : '已评估' }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import dayjs from 'dayjs'
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
  methods: {
    pageToFollowUpDetail(row, isDisabed) {
      this.$emit('pageToFollowUpDetail')
      this.$router.push({
        name: 'FollowUpDetail',
        query: {
          followupId: row.followupId,
          planId: row.planId,
        },
      })
    },
  },
}
</script>
