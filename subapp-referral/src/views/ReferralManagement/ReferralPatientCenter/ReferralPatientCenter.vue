<template>
  <div class="ReferralPatientCenter">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>患者中心</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input
              placeholder="患者姓名/联系电话/身份证号"
              v-model="queryParams.patName"
              style="width: 240px"
              clearable
            />
            <el-select placeholder="患者来源" v-model="queryParams.dataSource" clearable>
              <el-option label="同步HIS" value="HIS" />
              <el-option label="自新增" value="MINE" />
            </el-select>
            <el-input
              placeholder="诊断"
              v-model="queryParams.icdName"
              style="width: 240px"
              clearable
            />
            <el-select placeholder="是否有进行中的转诊" v-model="queryParams.hasReferral" clearable>
              <el-option label="是" value="Y" />
              <el-option label="否" value="N" />
            </el-select>
            <el-select placeholder="创建人" v-model="queryParams.createUserId" clearable filterable>
              <el-option
                v-for="(item, index) in createUser"
                :key="item.VALUE + index"
                :label="item.LABEL"
                :value="item.VALUE"
              />
            </el-select>
            <el-select
              placeholder="最近一次操作人"
              v-model="queryParams.optUserId"
              clearable
              filterable
            >
              <el-option
                v-for="(item, index) in nearOptUser"
                :key="item.VALUE + index"
                :label="item.LABEL"
                :value="item.VALUE"
              />
            </el-select>
            <OrgHosSelect
              ref="orgRef"
              v-model="queryParams.orgId"
              placeholder="集团"
            ></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="queryParams.hosId"
              :parentId="queryParams.orgId"
              placeholder="机构"
            ></OrgHosSelect>
            <!-- <ReferralSelect
              placeholder="集团"
              module="publicModule"
              type="ORG"
              status="Y"
              v-model="queryParams.orgId"
            ></ReferralSelect>
            <ReferralSelect
              placeholder="转出机构"
              module="publicModule"
              type="ORG_HOS"
              v-model="queryParams.hosId"
              :orgId="queryParams.orgId"
              :disabled="!queryParams.orgId"
              status="Y"
            ></ReferralSelect> -->
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="更新开始日期"
              end-placeholder="更新结束日期"
              range-separator="至"
              v-model="modDate"
              clearable
              style="width: 350px"
            />
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="创建开始日期"
              end-placeholder="创建结束日期"
              range-separator="至"
              v-model="createDate"
              clearable
              style="width: 350px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="addReferralForm">新增转诊</el-button>
            <el-button icon="el-icon-sort">同步HIS数据</el-button>
          </template>
          <el-table
            ref="singleTable"
            v-adaptive="{ bottomOffset: 60 }"
            height="0"
            :data="userList"
            border
            v-loading="loading"
            row-key="patId"
          >
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template>
            </el-table-column>
            <el-table-column label="更新时间" prop="modDate" width="155" />
            <el-table-column label="患者来源" prop="dataSourceDesc" width="80" />
            <el-table-column label="档案编号" prop="patCode" width="120" />
            <el-table-column label="姓名" prop="patName" width="150" />
            <el-table-column label="性别" prop="sexDesc" width="50" />
            <el-table-column label="年龄" width="70">
              <template slot-scope="scope"> {{ scope.row.age }} 岁 </template>
            </el-table-column>
            <el-table-column label="身份证号" prop="idNo" width="185" />
            <el-table-column label="联系电话" prop="phoneNo" width="180" />
            <el-table-column label="诊断" prop="diagnoseStr" width="240" show-overflow-tooltip />
            <el-table-column label="已转诊次数" prop="referralTot" width="100" />
            <el-table-column label="是否有进行中的转诊" width="150">
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <div>{{ scope.row.hasReferraling }}</div>
                  <el-tooltip placement="top">
                    <div slot="content">
                      门诊/住院号： {{ scope.row.caseNo }}<br />
                      转诊状态： {{ scope.row.referralStatusDesc }}<br />
                      转诊类型： {{ scope.row.referralTypeDesc }}<br />
                      转出科室： {{ scope.row.referralDeptDesc }}<br />
                      转诊医生： {{ scope.row.referralDrName }}<br />
                      申请转诊日期： {{ scope.row.applyReferralDate }}<br />
                    </div>
                    <IconSvg
                      v-if="scope.row.hasReferraling === '是'"
                      iconClass="hint"
                      width="14"
                      style="margin: 0 0 0 5px; cursor: pointer"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最近一次操作人" prop="modUserName" width="150" />
            <el-table-column label="创建日期" prop="createDate" width="180" />
            <el-table-column label="创建人" prop="createUserName" width="180" :resizable="false" />
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="{ row }">
                <el-button type="text" @click="fnExamine(row, 'add')" v-if="row.btnStatus === '/'"
                  >转诊记录</el-button
                >
                <el-button
                  type="text"
                  @click="fnExamine(row, 'disabled', true)"
                  v-if="row.btnStatus === '0'"
                  >转诊记录</el-button
                >
                <el-button
                  type="text"
                  @click="fnReferral(row, 'disabled')"
                  v-if="row.btnStatus === '0'"
                >
                  <div style="color: #919191">转诊</div>
                </el-button>
                <el-button
                  type="text"
                  @click="fnExamine(row, 'temporaryStorage')"
                  v-if="row.btnStatus === '1'"
                  >转诊记录</el-button
                >
                <el-button type="text" @click="fnTheStaging(row)" v-if="row.btnStatus === '1'"
                  >暂存</el-button
                >
                <el-button
                  type="text"
                  @click="fnExamine(row, 'add', true)"
                  v-if="row.btnStatus === '2'"
                  >转诊记录</el-button
                >
                <el-button type="text" @click="fnReferral(row, 'add')" v-if="row.btnStatus === '2'"
                  >转诊</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProList, ProLayout } from 'anx-vue'
import { onQueryPatients, onInitPatQueryParam } from '../../../api/modules/patientCenter'
import virtualList from 'vue-virtual-scroll-list'
import ElOptionNode from '../../../components/SelectVirtualList/ElOptionNode.vue'
import SelectVirtualList from '../../../components/SelectVirtualList/SelectVirtualList.vue'
export default {
  components: { ProLayout, ProList, VirtualList: virtualList, SelectVirtualList },
  data() {
    return {
      itemComponent: ElOptionNode,
      loading: false,
      userList: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      modDate: [],
      createDate: [],
      createUser: [],
      diagnoses: [],
      nearOptUser: [],
    }
  },
  async mounted() {
    await this.onInitPatQueryParam()
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    let ReferralPatientCenterQueryParams = window.sessionStorage.getItem(
      'ReferralPatientCenterQueryParams',
    )
    if (ReferralPatientCenterQueryParams) {
      this.queryParams = JSON.parse(ReferralPatientCenterQueryParams).queryParams
      this.modDate = JSON.parse(ReferralPatientCenterQueryParams).modDate
      this.createDate = JSON.parse(ReferralPatientCenterQueryParams).createDate
      this.$set(
        this.pageParams,
        'pageNum',
        JSON.parse(ReferralPatientCenterQueryParams).pageParams.pageNum,
      )
      this.$set(
        this.pageParams,
        'pageSize',
        JSON.parse(ReferralPatientCenterQueryParams).pageParams.pageSize,
      )
    }
    this.onInquire()
  },
  methods: {
    blurTest() {
      this.$refs.virtualListRef.reset()
    },
    async onInquire() {
      try {
        this.loading = true
        // console.log('this.queryParams', this.queryParams)
        const res = await onQueryPatients({
          ...this.queryParams,
          ...this.pageParams,
          modDateS: this.modDate ? (this.modDate[0] ? this.modDate[0] + ' 00:00:00' : '') : '',
          modDateE: this.modDate ? (this.modDate[1] ? this.modDate[1] + ' 23:59:59' : '') : '',
          createDateS: this.createDate
            ? this.createDate[0]
              ? this.createDate[0] + ' 00:00:00'
              : ''
            : '',
          createDateE: this.createDate
            ? this.createDate[1]
              ? this.createDate[1] + ' 23:59:59'
              : ''
            : '',
        })
        window.sessionStorage.setItem(
          'ReferralPatientCenterQueryParams',
          JSON.stringify({
            queryParams: this.queryParams,
            pageParams: this.pageParams,
            modDate: this.modDate,
            createDate: this.createDate,
          }),
        )
        const { total, records } = res.result
        if (records.length === 0 && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum = 1
          this.onInquire()
          return
        }
        this.total = total
        records.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.userList = records
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error', error)
      }
    },
    // 查看
    fnExamine(row, status, hasData) {
      console.log('fnExamine', row)
      if (hasData) {
        this.$router.push({
          name: 'ReferralPatientCenterDetail',
          query: {
            status: status,
            referralId: row.referralId,
            activeComponent: 'ReferralRecords',
            patId: row.patId,
            hasData: hasData,
          },
        })
      } else {
        this.$router.push({
          name: 'ReferralPatientCenterDetail',
          query: {
            status: status,
            referralId: row.referralId,
            activeComponent: 'ReferralRecords',
            patId: row.patId,
          },
        })
      }
    },
    fnReferral(row, status) {
      console.log('row', row)
      this.$router.push({
        name: 'ReferralPatientCenterDetail',
        query: {
          status: status,
          referralId: row.referralId,
          patId: row.patId,
          btnStatus: row.btnStatus,
        },
      })
    },
    fnTheStaging(row) {
      console.log('row', row)
      if (row.modUserName === sessionStorage.getItem('loginName')) {
        this.$router.push({
          name: 'ReferralPatientCenterDetail',
          query: {
            status: 'temporaryStorage',
            referralId: row.referralId,
            patId: row.patId,
          },
        })
      } else {
        this.$message.error('没有权限进行修改!')
      }
    },
    async onInitPatQueryParam() {
      try {
        const res = await onInitPatQueryParam()
        this.createUser = res.result.createUser
        // this.diagnoses = []
        // res.result.diagnoses.forEach((_) => {
        //   if (_) {
        //     this.diagnoses.push(_)
        //   }
        // })
        // console.log('res.result.nearOptUser', res.result.nearOptUser)
        this.nearOptUser = res.result.nearOptUser
        if (res.result.nearOptUser.find((_) => _.VALUE === sessionStorage.getItem('userId'))) {
          this.$set(this.queryParams, 'optUserId', sessionStorage.getItem('userId'))
        } else {
          this.$set(this.queryParams, 'optUserId', '')
        }
      } catch (error) {
        // console.error('error', error)
      }
    },
    // 新增转诊单
    addReferralForm() {  
      if(window.sessionStorage.getItem('saveFlagParamsData')){      
        window.sessionStorage.removeItem('saveFlagParamsData');
      }      
      this.$router.push({
        name: 'ReferralPatientCenterDetail',
        query: {
          status: 'add',
        },
      })
    },
    // 重置
    resetQueryParams() {
      // console.log('this.$IS_ORI_ADMIN', this.$IS_ORI_ADMIN)
      const resetArr = [
        'patName',
        'hasReferral',
        'dataSource',
        'diagnoses',
        'optUserId',
        'createUserId',
        'icdName',
      ]
      if (this.$IS_ORI_ADMIN) {
        for (let i = 0; i < resetArr.length; i++) {
          this.$set(this.queryParams, resetArr[i], '')
        }
      } else if (this.$IS_ORG_ADMIN) {
        for (let i = 0; i < resetArr.length; i++) {
          this.$set(this.queryParams, resetArr[i], '')
        }
        this.$set(this.queryParams, 'hosId', '')
      } else {
        this.queryParams = {}
      }
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.modDate = []
      this.createDate = []
      this.onInquire()
    },
  },
}
</script>
<style>
.virtualSelect .el-scrollbar .el-scrollbar__bar.is-vertical {
  width: 0;
}
</style>
<style lang="scss" scoped>
.ReferralPatientCenter {
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px !important;
  }
  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }
  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
  .ProList {
    border-radius: 2px;
    padding: 10px;
    background-color: #fff;
  }
  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
}
</style>
