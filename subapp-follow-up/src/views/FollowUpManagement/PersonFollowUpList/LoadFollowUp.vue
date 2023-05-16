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
    <el-table-column label="联系电话" prop="phone" min-width="120" />
    <el-table-column
      label="随访病种"
      prop="diseaseTypeText"
      show-overflow-tooltip
    />
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
    <el-table-column
      label="任务随访截止时间"
      prop="nextFollowTime"
      width="150"
    />
    <el-table-column label="随访频率" prop="frequencyText" />
    <el-table-column
      label="随访计划起止时间"
      prop="followStartAndEndTime"
      min-width="220"
    />
    <el-table-column label="操作" fixed="right" width="100">
      <template slot-scope="{ row }">
        <span v-if="row.followUpTypeText === '网络'">
          <el-button
            type="text"
            @click="pageToFollowUpDetail(row)"
            v-if="row.isEntry === '1'"
          >查看</el-button>
          <el-button
            type="text"
            v-else
            @click="pageToFollowUpDetail(row)"
            class="grey"
          >录入</el-button>
        </span>
        <span v-else>
          <el-button
            type="text"
            v-if="row.entryStatus === '3'"
            @click="pageToFollowUpDetail(row)"
            >暂存</el-button
          >
          <el-button
            type="text"
            v-if="row.entryStatus === '2'"
            @click="pageToFollowUpDetail(row)"
            >补录</el-button
          >
          <el-button
            type="text"
            v-if="row.entryStatus === '1'"
            @click="pageToFollowUpDetail(row)"
            :class="{ grey: row.isEntry === '0' }"
            >录入</el-button
          >
        </span>
        <el-button type="text" @click="endFollowUp(row)" style="margin-left: 10px;" v-if="row.followupTypeAssess === '1'">中止</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import dayjs from "dayjs";
export default {
  props: ["followUpList",'pageParams'],
  mounted () {
    console.log('this.followUpList', this.followUpList);
  },
  methods: {
    pageToFollowUpDetail(row, isDisabed) {
      if (row.isEntry === "0") {
        this.$message.warning(`${row.canEntryTime}可录入`);
        return;
      }
      this.$emit("pageToFollowUpDetail");
      // 录入的话时间为当前时间，补录的的话是任务截止时间
      this.$router.push({
        name: "FollowUpDetail",
        query: {
          followupId: row.followupId,
          planId: row.planId,
        },
      });
    },
    endFollowUp(row) {
      this.$emit("showSuspendFollowUp", row);
    },
  },
};
</script>

<style scoped>
.grey {
  color: #919191 !important;
}
</style>
