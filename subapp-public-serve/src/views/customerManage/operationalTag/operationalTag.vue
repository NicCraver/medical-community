<template>
  <div class="OperationalTag">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>运营标签</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="名称" v-model="queryParams.activityDesc" clearable />
            <el-select placeholder="活动类型" v-model="queryParams.type" clearable filterable>
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select placeholder="状态" v-model="queryParams.status" clearable filterable>
              <el-option
                v-for="(item, index) in statusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="创建开始日期"
              end-placeholder="创建结束日期"
              range-separator="至"
              v-model="addDate"
              @change="searchTimeChange"
              :clearable="true"
              :default-time="defaultTime"
              @focus="setDefaultTime"
              style="width: 420px"
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="handleAdd()">新增</el-button>
            <el-button type="primary" @click="handleDetail()">详情</el-button>
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 60 }"
            height="100px"
            ref="singleTable"
            row-key="id"
            :data="tableData"
            border
            v-loading="loading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40" :reserve-selection="true" />
            <!-- {{ scope.row.seq + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }} -->
            <el-table-column label="序号" type="seq" width="50">
              <template slot-scope="scope">
                <span>{{ scope.row.seq }}</span>
              </template>
            </el-table-column>
            <el-table-column label="活动ID" prop="activityCode" />
            <el-table-column label="活动类型" prop="typeDesc" />
            <el-table-column label="活动状态" prop="statusDesc" />
            <el-table-column label="活动名称" prop="activityDesc" />
            <el-table-column label="活动详情" prop="activityDetail" min-width="250" />
            <el-table-column label="活动产品" min-width="150">
              <template slot-scope="scope">
                <!-- 礼包 -->
                <span v-if="scope.row.productType == '645064ff90374668b3799ee428125536'">
                  <span @mouseover="changeEnter(scope.row, $event)" @mouseleave="changeLeave"
                    >礼包 <IconSvg iconClass="info" width="15" height="15"
                  /></span>
                </span>
                <!-- 礼券 -->
                <span v-else>
                  <span v-if="scope.row.productDescs && scope.row.productDescs.length > 0">
                    <span v-for="(item, index) in scope.row.productDescs" :key="index">
                      {{ item }}
                    </span>
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="总数" prop="maxNum" />
            <el-table-column label="活动起止时间" min-width="150">
              <template slot-scope="scope">
                {{ scope.row.startDate }}至{{ scope.row.endDate }}
              </template>
            </el-table-column>
            <el-table-column label="创建人" prop="createUserName" />
            <el-table-column label="创建机构" prop="orgDesc" />
            <el-table-column label="创建时间" prop="createDate" />
            <el-table-column label="操作" fixed="right" width="220">
              <template slot-scope="{ row }">
                <el-button type="text" @click="handleDetail(row)">详情</el-button>
                <el-button
                  type="text"
                  @click="handleEdit(row)"
                  v-if="row.statusDesc == '进行中' || row.statusDesc == '待开始'"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="handleData(row)"
                  v-if="
                    row.statusDesc == '进行中' ||
                    row.statusDesc == '已结束' ||
                    row.statusDesc == '已关闭'
                  "
                  >数据</el-button
                >
                <el-button
                  type="text"
                  @click="handleClose(row)"
                  v-if="row.statusDesc == '进行中' || row.statusDesc == '待开始'"
                  >关闭</el-button
                >
                <!-- <el-button type="text" @click="handleCopy(row)">复制</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
    <ProDialog
      :visible.sync="dialogReasonClose"
      title="关闭活动原因"
      width="520px"
      :before-close="handleResetClose"
      :close-on-click-modal="false"
      top="20vh"
    >
      <div class="mainbox">
        <el-form label-width="75px" class="demo-ruleForm">
          <el-form-item label="劵有效期">
            <el-radio-group v-model="actiCloseParams.reasonCode">
              <el-radio label="1">活动取消</el-radio>
              <el-radio label="2">原因二</el-radio>
              <el-radio label="3">其它</el-radio>
            </el-radio-group>
            <el-input
              v-model="actiCloseParams.reason"
              type="text"
              v-if="actiCloseParams.reasonCode == '3'"
              style="width: 120px; margin-left: 12px"
            ></el-input>
            <p class="warin">
              <IconSvg iconClass="tip" width="15" height="15" />
              活动关闭后，活动将不再展示。活动产品在有效期内仍可使用。
            </p>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogReasonClose = false">取消</el-button>
        <el-button @click="sumbitClose">确认</el-button>
      </template>
    </ProDialog>
    <div class="serviceStyle" v-if="isShowHidden" :style="stylePosition">
      <ul v-if="serviceList && serviceList.length > 0">
        <li v-for="(item, index) in serviceList" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ProList, ProLayout, ProDrawer, ProDialog, IconSvg } from 'anx-vue'
// import { showList, activityTypeList, activityClose } from '@/api/modules/activityManageList'

export default {
  components: {
    ProList,
    ProLayout,
    ProDialog,
    IconSvg,
  },
  data() {
    return {
      statusList: [
        { label: '待开始', value: 'WAIT' },
        { label: '进行中', value: 'IN_PROGRESS' },
        { label: '已结束', value: 'END' },
        { label: '已关闭', value: 'CLOSE' },
      ],
      typeList: [],
      addDate: [],
      loading: false,
      tableData: [],
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      defaultTime: [],
      total: 0,
      multipleSelection: [],
      dialogReasonClose: false,
      actiCloseParams: {
        reasonCode: '1',
      },
      activiCloseId: '',
      serviceList: [],
      isShowHidden: false,
      stylePosition: {
        position: 'fixed',
        zIndex: 999,
        left: '0',
        top: '0',
      },
    }
  },
  created() {
    this.selectData()
  },
  mounted() {
    this.onInquire()
  },
  methods: {
    setDefaultTime() {
      //此处待补充。。。
      //1.选择当日，默认时间为系统时间， 不是当日，默认系统时间是00:00:00
      //let startTime = getnNewTime(); //当前时分秒
      this.defaultTime = ['00:00:00', '23:59:59']
      //console.log(this.defaultTime)
    },
    changeEnter(row, event) {
      this.isShowHidden = true
      this.serviceList = row.productDescs
      this.$nextTick(() => {
        this.stylePosition.left = event.pageX + 20 + 'px'
        this.stylePosition.top = event.pageY - 10 + 'px'
        this.$forceUpdate()
      })
    },
    changeLeave() {
      this.isShowHidden = false
    },
    handleResetClose() {
      this.dialogReasonClose = false
    },
    searchTimeChange(date) {
      console.log('***', date)
      if (!date) {
        this.addDate = []
        this.queryParams.createDateS = ''
        this.queryParams.createDateE = ''
      } else {
        if (date[0] && date[1]) {
          this.queryParams.createDateS = date[0]
          this.queryParams.createDateE = date[1]
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('this.multipleSelection', this.multipleSelection.length)
      // console.log('this.pageNumList', this.pageNumList);
    },
    //活动类型列表
    async selectData() {
      // try {
      //   const res = await activityTypeList({
      //     type: 'ACTIVITY_TYPE',
      //   })
      //   this.typeList = res.result
      // } catch (error) {
      //   console.error(`error`, error)
      // }
    },
    // 查询
    async onInquire() {
      // this.loading = true
      // try {
      //   const res = await showList({
      //     ...this.queryParams,
      //     ...this.pageParams,
      //   })
      //   const { total, records } = res.result
      //   this.total = total
      //   if (records.length > 0) {
      //     records.forEach((el) => {
      //       for (let key in el) {
      //         if (el['statusDesc'] == '待开始') {
      //           if (!el[key]) {
      //             if (key == 'maxNum') el[key] = '不限'
      //             else if (key == 'pickupPeopleTot' || key == 'usePeopleTot') el[key] = '-'
      //             else el[key] = '/'
      //           }
      //         } else {
      //           if (!el[key]) {
      //             if (key == 'maxNum') el[key] = '不限'
      //             else if (key == 'pickupPeopleTot' || key == 'usePeopleTot') el[key] = '0'
      //             else el[key] = '/'
      //           }
      //         }
      //       }
      //     })
      //     this.tableData = records
      //   } else {
      //     this.tableData = records
      //   }
      //   console.log(this.tableData)
      //   this.loading = false
      // } catch (error) {
      //   this.loading = false
      //   console.error(`error`, error)
      // }
    },
    // 跳转新增
    handleAdd() {
      this.$router.push({
        name: 'operateAdd',
        query: {
          status: 'add',
        },
      })
    },
    // 跳转详情
    handleDetail() {
      this.$router.push({
        name: 'operateDetails',
        query: {
          status: 'etails',
          // activityId: row.id,
          // activityPro: row.statusDesc,
        },
      })
    },
    // 操作编辑
    handleEdit(row) {
      this.$router.push({
        name: 'ActivityAdd',
        query: {
          status: 'edit',
          activityId: row.id,
          activityPro: row.statusDesc,
        },
      })
    },
    // 操作数据
    handleData(row) {
      this.$router.push({
        name: 'ActivityAdd',
        query: {
          status: 'dataInfo',
          activityId: row.id,
          activityPro: row.statusDesc,
        },
      })
    },
    // 操作关闭
    handleClose(row) {
      this.activiCloseId = row.id
      this.dialogReasonClose = true
    },
    // 关闭
    async sumbitClose() {
      // this.actiCloseParams.id = this.activiCloseId
      // console.log(this.actiCloseParams)
      // const res = await activityClose(this.actiCloseParams)
      // if (res.code == 0) {
      //   this.$message.success('关闭成功')
      //   this.dialogReasonClose = false
      //   this.onInquire()
      //   console.log(res)
      //   console.log('-----')
      // }
    },
    // 操作复制 本期不做
    handleCopy(row) {},
    // 重置
    resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageSize: 10,
        pageNum: 1,
      }
      this.addDate = []
      this.onInquire()
    },
  },
  filters: {},
}
</script>

<style lang="scss" scoped>
.OperationalTag {
  .serviceStyle {
    font-size: 14px;
    color: #ffffff;
    background-color: rgba(17, 17, 17, 0.6);
    padding: 10px 80px 10px 10px;
    border-radius: 5px;
  }
  .warin {
    color: #919191;
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
