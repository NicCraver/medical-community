<!--
  @description 健康档案共享调阅-居民中心
  @date 2022/1/11
-->
<template>
  <div class="resident-center">
    <ProLayout mainBgColor="#F5F5F5" padding="0" margin="10">
      <template #title>居民列表</template>
      <template #main>
        <el-card>
          <ProTable>
            <template #header>
              <el-select placeholder="请选择集团" v-model="queryParams.groupId" disabled>
                <el-option
                  v-for="(item, index) in groupList"
                  :key="index"
                  :value="item.id"
                  :label="item.label"
                ></el-option>
              </el-select>
              <el-select
                placeholder="请选择（仅展示您有权访问的医疗机构）"
                multiple
                v-model="queryParams.orgIdList"
                filterable
                collapse-tags
                style="width: 300px"
              >
                <!-- :disabled="isOriAdmin === 'true'" -->
                <el-option
                  v-for="(item, index) in hosList"
                  :key="index"
                  :value="item.id"
                  :label="item.label"
                  v-show="item.parentId === queryParams.groupId"
                ></el-option>
              </el-select>
              <el-input
                placeholder="患者姓名/证件编号"
                v-model="queryParams.keyword"
                @keyup.enter.native="getList"
                clearable
              ></el-input>
              <el-input
                placeholder="健康档案号"
                v-model="queryParams.empi"
                @keyup.enter.native="getList"
                clearable
              ></el-input>
              <el-select
                placeholder="健康标签"
                v-model="queryParams.chronicDiseases"
                clearable
                v-if="proEnv !== 'heilongjiang'"
              >
                <el-option
                  v-for="item in $store.state.base.healthRecordData"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
              <el-date-picker
                v-model="queryTime"
                type="datetimerange"
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
                :default-time="['08:00:00', '20:00:00']"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </template>
            <template #actions>
              <el-button type="primary" @click="searchFuc">搜索</el-button>
              <el-button plain @click="reset">重置</el-button>
            </template>
            <el-table
              ref="table"
              v-adaptive="{ bottomOffset: 67 }"
              height="0"
              :data="residentList"
              v-loading="loading"
              border
            >
              <el-table-column label="序号" prop="indexNum" width="50"></el-table-column>
              <el-table-column label="姓名" width="100">
                <template slot-scope="{ row }">
                  {{ personalNamePrivacy(row.name) }}
                </template>
              </el-table-column>
              <el-table-column label="性别" width="50">
                <template slot-scope="{ row }">
                  {{
                    row.gender == '1'
                      ? '男'
                      : row.gender == '2'
                      ? '女'
                      : row.gender == '9'
                      ? '未说明'
                      : row.gender == '0'
                      ? '未知'
                      : ''
                  }}
                </template>
              </el-table-column>
              <el-table-column label="年龄" prop="age" width="100"></el-table-column>
              <el-table-column label="身份证号" min-width="180">
                <template slot-scope="{ row }">
                  {{ personalIdPrivacy(row.certId) }}
                </template>
              </el-table-column>
              <el-table-column
                label="健康标签"
                prop="chronicDiseasesName"
                min-width="180"
                show-overflow-tooltip
                v-if="proEnv !== 'heilongjiang'"
              ></el-table-column>
              <el-table-column label="民族" prop="nationName" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column label="家庭住址" min-width="180" show-overflow-tooltip>
                <template slot-scope="{ row }">
                  {{
                    personalAddPrivacy(row.liveProvince, row.liveCity, row.liveCounty, row.liveTownship, row.liveAddr)
                  }}
                </template>
              </el-table-column>
              <el-table-column label="健康档案编号" prop="empi" min-width="180" show-overflow-tooltip></el-table-column>
              <el-table-column label="档案状态" prop="archStatus" min-width="80" show-overflow-tooltip>
                <template slot-scope="{ row }">
                  {{ archStatusObj[row.archStatus] || '--' }}
                </template>
              </el-table-column>
              <el-table-column label="建档人" prop="regWorkerName" width="100">
                <template slot-scope="{ row }">
                  {{ doctorNamePrivacy(row.regWorkerName) }}
                </template>
              </el-table-column>
              <el-table-column label="创建日期" prop="regDate" width="160"></el-table-column>
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template slot-scope="{ row }">
                  <el-button type="text" :disabled="row.archStatus === '2'" @click="check(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-sizes="[10, 20, 50, 100, 200]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </ProTable>
        </el-card>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import ProTable from '@/components/ProTable/index.vue'
import { getResidentList, getOrgNames } from 'api/infomationPlatform/healthRecord.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    ProTable,
    ProLayout,
  },
  data() {
    return {
      currentRole: {},
      isOriAdmin: '', //是否是机构用户
      groupList: [],
      hosList: [],
      queryParams: {
        groupId: '',
        orgIdList: [],
      }, // 查询请求参数
      queryTime: [], //创建日期
      residentList: [], //居民列表
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      total: 0, //总条数
      archStatusObj: {
        1: '正常',
        2: '注销',
      },
    }
  },
  computed: {
    ...mapGetters({
      personalNamePrivacy: 'base/personalNamePrivacy',
      personalIdPrivacy: 'base/personalIdPrivacy',
      personalAddPrivacy: 'base/personalAddPrivacy',
      doctorNamePrivacy: 'base/doctorNamePrivacy',
    }),
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT
    },
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 1)
  },
  methods: {
    init() {
      this.currentRole = JSON.parse(sessionStorage.getItem('currentRole'))
      this.isOriAdmin = sessionStorage.getItem('isOriAdmin')
      this.getOrgNamesFuc()
      this.getList()
    },
    // 查询机构
    getOrgNamesFuc() {
      getOrgNames().then(({ code, result }) => {
        if (code === 0) {
          if (this.isOriAdmin) {
            // 集团账户
            this.groupList = [
              {
                id: this.currentRole.orgId,
                label: this.currentRole.orgName,
              },
            ]
            this.hosList = result.treeData.map((item) => {
              return {
                parentId: this.currentRole.orgId,
                id: item.id,
                label: item.label,
              }
            })
            setTimeout(() => {
              this.queryParams.groupId = this.currentRole.orgId
              if (this.isOriAdmin) {
                // 机构
                this.queryParams.orgIdList = [this.currentRole.hosId]
              }
            }, 300)
          } else {
            this.handleOrgData(result.treeData)
          }
        }
      })
    },
    handleOrgData(list) {
      let hosList = []
      let groupList = list.map((item) => {
        let children = item.children.map((vv) => {
          return {
            parentId: item.id,
            id: vv.id,
            label: vv.label,
          }
        })
        hosList = hosList.concat(children)
        return {
          id: item.id,
          label: item.label,
        }
      })
      console.log('groupList:', groupList)
      console.log('hosList:', hosList)
      this.groupList = groupList
      this.hosList = hosList
      setTimeout(() => {
        this.queryParams.groupId = this.currentRole.orgId
        if (this.isOriAdmin) {
          // 机构
          this.queryParams.orgIdList = [this.currentRole.hosId]
        }
      }, 300)
    },
    // 查询居民列表
    getList() {
      this.queryParams.startTime = ''
      this.queryParams.endTime = ''
      if (this.queryTime && this.queryTime.length > 0) {
        this.queryParams.startTime = this.queryTime[0]
        this.queryParams.endTime = this.queryTime[1]
      }
      this.queryParams.pageNum = this.pageNum
      this.queryParams.pageSize = this.pageSize
      let queryParams = {
        ...this.queryParams,
        orgIdList: this.queryParams.orgIdList?.length ? this.queryParams.orgIdList.join(',') : '',
      }
      delete queryParams.groupId
      this.loading = true
      getResidentList(queryParams)
        .then((res) => {
          console.log('居民列表：', res.result)
          let records = res.result
          for (let i in records) {
            records[i].indexNum = Number(i) + 1 + (Number(this.pageNum) - 1) * Number(this.pageSize)
          }
          this.residentList = records
          this.total = res.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFuc() {
      this.pageNum = 1
      this.getList()
    },
    // 重置
    reset() {
      this.queryParams = {}
      this.queryTime = null
      this.pageNum = 1
      this.pageSize = 10
      this.getList()
    },
    // 查看
    check(row) {
      let pAId = row.pAId || ''
      if (!pAId) {
        return
      }
      if (this.proEnv === 'heilongjiang') {
        this.$router.push({ path: `/Home/${pAId}`, query: { pAId } })
        return
      }
      let routeUrl = this.$router.resolve({
        path: `/Home/${pAId}`,
        query: { pAId },
      })
      window.open(routeUrl.href, '_blank')
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
  },
}
</script>

<style src="@/assets/css/infomationPlatform.css" scoped></style>
<style lang="scss" scoped>
.resident-center {
  height: 100%;
}
.el-card {
  height: 100%;
  padding: 10px;
  ::v-deep .batch-actions {
    margin: 0;
  }
  .el-date-editor {
    width: auto !important;
  }
}
::v-deep .layout-main {
  height: 100%;
  .model-title .layout-main-content {
    height: calc(100% - 50px) !important;
  }
}
</style>
