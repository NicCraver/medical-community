<!--
  @description 患者指标分析-患者全局指标分析-患阅
  @date 
-->
<template>
  <el-drawer class="PatientReachDrawer" size="1000px" :visible.sync="isVisible" :before-close="close">
    <template #title>
      <div class="head">
        <div>患者触达</div>
        <div class="text">患者触达列表可以帮助管理者识别各触达渠道的通畅情况及触达效果。</div>
      </div>
    </template>
    <div class="main">
      <el-table
        stripe
        :data="tableData"
        border
        style="width: 100%"
        @expand-change="expandChange"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-adaptive="{ bottomOffset: 55 }"
        height="0"
      >
        <!-- <el-table :data="tableData" style="width: 100%" border> -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="margin-bottom: 10px">
              <el-radio-group v-model="reachType" @change="reachTypeChange">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">只看已发送</el-radio>
                <el-radio :label="2">只看已读</el-radio>
                <el-radio :label="3">只看未读</el-radio>
                <el-radio :label="4">只看触达来源最多</el-radio>
                <el-radio :label="5">只看触达来源最少</el-radio>
              </el-radio-group>
            </div>
            <el-table
              :data="props.row.details"
              style="width: 100%"
              :default-sort="{ prop: 'date', order: 'descending' }"
              border
              v-adaptive="{ bottomOffset: bottomOffset }"
              height="0"
            >
              <el-table-column prop="planSendDate" label="消息发送/计划发送时间" sortable width="200">
              </el-table-column>
              <el-table-column prop="systemMsg" label="系统消息"> </el-table-column>
              <el-table-column prop="weChatMsg" label="公众号消息"> </el-table-column>
              <el-table-column prop="smsMsg" label="短信消息"> </el-table-column>
              <el-table-column prop="reachResult" label="触达结果"> </el-table-column>
              <el-table-column prop="reachSource" label="触达来源"> </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="提醒类型" prop="remindTypeDesc" width="140"> </el-table-column>
        <el-table-column label="基本设置" prop="basicSet" width="180"> </el-table-column>
        <el-table-column label="执行时间" prop="executorDate" width="210"> </el-table-column>
        <el-table-column label="计划执行数/已发送数/触达数" prop="name" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.planExecutorNum }}/</span>
            <span>{{ scope.row.sendNum }}/</span>
            <span>{{ scope.row.reachNum ? scope.row.reachNum : 0 }}</span>
          </template>
          <!-- planExecutorNum 计划执行数,
            sendNum 已发送数,
            reachNum 触达数, -->
        </el-table-column>
        <el-table-column label="创建人" prop="createUserName"> </el-table-column>
        <el-table-column label="创建时间" prop="createDate" width="180"> </el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[20, 30, 40, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { queryPatReach, queryPatReachDetails } from '@/api/modules/PatientCenter/indicatorAnaysis.js'
export default {
  data() {
    return {
      currentPage: 1,
      bottomOffset: 380,
      expands: [],
      getRowKeys(row) {
        return row.remindId
      },
      total: 0,
      reachType: 0,
      tableData: [],
      isVisible: false,
    }
  },
  mounted() {
    console.log(`this.$route`, this.$route.query.patId)
  },
  methods: {
    async reachTypeChange(val) {
      console.log(`this.reachType`, this.reachType)
      console.log(`val`, val)
      try {
        const res = await queryPatReachDetails({ id: this.expands[0], reachType: this.reachType })
        this.tableData.filter((el) => {
          el.details = res.result
        })
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 展开事件----动态获取内嵌表数据
    async expandChange(row, expandedRows) {
      this.reachType = 0
      console.log(`this.reachType`, this.reachType)
      //只展开一行
      if (expandedRows.length) {
        //说明展开了
        this.expands = []
        if (row) {
          this.expands.push(row.remindId) //只展开当前行id，唯一标识
          try {
            const res = await queryPatReachDetails({ id: row.remindId, reachType: 0 })
            console.log(`queryPatReachDetails`, JSON.parse(JSON.stringify(res)))
            row.details = res.result
            console.log(`res.result.length`, res.result.length)
            console.log(`this.tableData`, this.tableData)
            // this.$message.success('数据加载成功')
          } catch (error) {
            console.log(`error`, error)
          }
        }
      } else {
        //说明收起了
        this.expands = []
      }
    },
    open(data) {
      this.isVisible = true
      this.tableData = []
      this.queryPatReach()
    },
    async queryPatReach() {
      try {
        const res = await queryPatReach({ patId: this.$route.query.patId, pageNum: 1, pageSize: 10 })
        const { records, total } = res.result
        this.total = total
        console.log(`records`, records)
        records.forEach((el, index) => {
          this.tableData.push({
            ...el,
            index: index,
            details: [],
          })
        })
        console.log(`this.tableData`, this.tableData)
      } catch (error) {
        console.log(`error`, error)
      }
    },
    close() {
      this.isVisible = false
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.PatientReachDrawer {
  .head {
    display: flex;
    align-items: center;
    .text {
      padding-left: 10px;
      font-size: 12px;
      color: rgba(145, 145, 145, 1);
    }
  }
  ::v-deep .el-drawer__header {
    height: 50px;
    padding: 5px 5px 5px 10px;
    margin-bottom: 0;
    color: #303133;
    font-size: 16px;
    font-weight: 700;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      background-color: #4469bd;
      width: 3px;
      height: 16px;
      left: 1px;
      top: 17px;
    }
  }
  ::v-deep .el-drawer__body {
    height: calc(100% - 50px);
  }
  header {
    display: flex;
    justify-content: center;
    height: 32px;
    .btn-cont {
      width: 200px;
      height: 32px;
      background-color: #f6f8ff;
      border-radius: 42px;
      display: flex;
      justify-content: center;
      .btn {
        width: 100px;
        height: 100%;
        line-height: 32px;
        border-radius: 42px;
        background-color: transparent;
        color: #7495e6;
        text-align: center;
        cursor: pointer;
      }
      .btn.active {
        background-color: #5381e3;
        color: #fff;
      }
    }
  }
  .main {
    margin-top: 10px;
    height: calc(100% - 42px);
    padding: 0 20px 20px 20px;
  }
}
</style>
