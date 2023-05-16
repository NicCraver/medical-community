<template>
  <div class="BulkInclusionWarning">
    <ProLayout model="title" mainBgColor="#F5F5F5" margin="0" padding="0">
      <template #title>
        <div style="display: flex; align-items: center">
          <div>批量纳入</div>
          <div style="display: flex; align-items: center; font-size: 14px; font-weight: 400">
            <div style="margin-top: 5px; margin-left: 15px">
              <IconSvg iconClass="hint-r" width="14" style="margin-right: 5px" />
            </div>
            <div class="text" style="color: #fc6d64">
              已建档患者，将不予进行2次纳入，以下患者纳入失败（判定标准为手机号/身份证号为唯一性）
            </div>
          </div>
        </div>
      </template>
      <template #main>
        <el-table
          ref="table"
          :data="tableData"
          v-adaptive="{ bottomOffset: 56 }"
          :height="height"
          style="width: 100%"
          stripe
          border
          :row-key="getRowKeys"
          :expand-row-keys="expands"
        >
          <el-table-column label="序号" type="index" width="50"> </el-table-column>
          <el-table-column label="是否有对照异常点" width="135">
            <template slot-scope="scope">
              {{ scope.row.idNoOutlierTot === 0 && scope.row.phoneOutlierTot === 0 ? '否' : '是' }}
            </template>
          </el-table-column>
          <el-table-column label="申请类型" prop="applyTypeDesc" width="100"> </el-table-column>
          <el-table-column v-if="isShow" label="来源" prop="dataSource" min-width="100"> </el-table-column>
          <el-table-column v-if="isShow" label="姓名" prop="name" width="80"> </el-table-column>
          <el-table-column v-if="isShow" label="性别" prop="sexDesc" width="60" />
          <el-table-column v-if="isShow" label="年龄" prop="age" width="60" />
          <el-table-column v-if="!isShow" label="门诊/住院号" prop="caseNo" width="120" />
          <el-table-column label="手机号" prop="phoneNo" width="120" />
          <el-table-column v-if="isShow" label="身份证号" prop="idNo" width="190" />
          <el-table-column v-if="!isShow" label="诊断" prop="diagnosesStr" width="190" />
          <el-table-column label="慢病种类" prop="richDiseaseName" min-width="180"> </el-table-column>
          <el-table-column label="申请人" prop="applyDrName" width="100"> </el-table-column>
          <el-table-column 
            label="申请机构"
            prop="hosDesc"
            width="200"
          />
          <el-table-column label="申请时间" prop="applyDate" width="180"> </el-table-column>
        </el-table>
        <div class="actions-fixed">
          <div class="left"></div>
          <div class="right">
            <el-button @click="goBack">返回</el-button>
          </div>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import { onJoin } from '@/api/modules/iusion'
export default {
  name: 'BatchNotManage',
  components: {
    ProLayout,
  },
  data() {
    return {
      getRowKeys(row) {
        return row.id
      },
      height: window.innerHeight - 48 - 52 - 57,
      loading: false,
      tableData: [],
      expands: [],
      isShow: window.g.APP_HOSPITAL === '齐齐哈尔',
    }
  },
  mounted() {
    this.tableData = this.$route.params.row
    console.log('this.tableData', JSON.parse(JSON.stringify(this.tableData)))
    this.$route.params.row.forEach((el) => {
      if (el.outlierTot !== 0) {
        this.expands.push(el.id)
      }
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.BulkInclusionWarning {
  ::v-deep.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #919191 !important;
    line-height: 40px;
    padding: 0 5px 0 0;
    box-sizing: border-box;
  }
  ::v-deep.el-form-item {
    margin-bottom: 0px;
  }
  ::v-deep.el-table__expanded-cell[class*='cell'] {
    padding: 10px 20px !important;
  }
  .actions-fixed {
    position: fixed;
    left: 208px;
    bottom: 0;
    right: 0;
    background-color: #fff;
    overflow: hidden;
    border-top: 1px solid rgb(245, 245, 245);
    z-index: 100;
    padding: 8px 10px;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
}
</style>
