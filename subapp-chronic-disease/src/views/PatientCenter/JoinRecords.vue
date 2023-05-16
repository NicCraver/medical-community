<template>
  <div class="join-records">
    <PatientInfoCard />
    <!-- <div style="background: #fff"> -->
    <div>
      <el-table
        :data="joinRecordList"
        border
        v-adaptive="{ bottomOffset: 70 }"
        height="0"
      >
        <el-table-column label="申请时间" prop="applyDate" width="180" />
        <el-table-column label="纳入时间" prop="joinDate" width="180" />
        <el-table-column label="来源" prop="admTypeDesc" />
        <el-table-column label="门诊/住院号" prop="caseNo" width="140" />
        <el-table-column
          label="诊断"
          prop="diagnosesStr"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column
          label="慢病种类"
          prop="richDiseaseName"
          min-width="180"
          show-overflow-tooltip
        />
        <el-table-column label="申请科室" prop="applyDeptDesc" width="110" />
        <el-table-column label="申请医生" prop="applyDrName" />
        <el-table-column label="操作人" prop="joinDrName" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNum"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { onQueryJoinDetail } from "@/api/modules/iusion";
import PatientInfoCard from "./PatientInfoCard";
export default {
  data() {
    return {
      // 总数
      total: 0,
      // 分页请求删除
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      joinRecordList: [],
    };
  },
  components: {
    PatientInfoCard,
  },
  created() {
    this.onInquire();
  },
  methods: {
    // 查询
    async onInquire() {
      this.loading = true;
      try {
        const res = await onQueryJoinDetail({
          joinFlg: "Y",
          ...this.pageParams,
          patId: this.$route.query.patId
        });
        console.log(`onQueryJoinDetail`, res.result);
        const { records, total } = res.result;
        this.total = total;
        this.joinRecordList = records;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(`error`, error);
      }
    },
    // 分页 pageNum
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.onInquire();
    },
    // 分页 pageSize
    handleSizeChange(val) {
      this.pageParams.pageNum = 1;
      this.pageParams.pageSize = val;
      this.onInquire();
    },
  },
};
</script>

<style lang="scss" scoped>
.join-records {
  padding: 20px 20px 0 20px;
  overflow-x: hidden;
}
</style>
