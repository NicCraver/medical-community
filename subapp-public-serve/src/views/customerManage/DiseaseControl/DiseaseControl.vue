<!--
 * @Author: Nic
 * @Date: 2023-01-04 14:40:26
 * @LastEditTime: 2023-03-09 15:38:23
 * @LastEditors: Nic
 * @Description: 病种对照
 * @FilePath: /medical-community/subapp-public-serve/src/views/customerManage/DiseaseControl/DiseaseControl.vue
-->
<template>
  <div class="DiseaseTag">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>病种对照</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-select placeholder="编码分类" v-model="queryParams.icdType" clearable filterable>
              <el-option v-for="(item, index) in icdTypeList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <el-input placeholder="编码/名称" v-model="queryParams.icdId" clearable />
            <el-select placeholder="请选择标签状态" v-model="queryParams.tagStatus" clearable filterable>
              <el-option v-for="(item, index) in tagStatusList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="创建开始日期"
              end-placeholder="创建结束日期"
              range-separator="至"
              v-model="addDate"
              clearable
            />
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="showTagDetail('add')">新增</el-button>
            <el-button @click="batchStart">批量关闭</el-button>
            <div class="alert" v-if="multipleSelection.length !== 0">
              <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
              <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
              <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
            </div>
          </template>
          <!-- 表格嵌套 -->
          <el-table
            :data="tableData"
            v-adaptive="{ bottomOffset: 60 }"
            height="100px"
            ref="singleTable"
            border
            v-loading="loading"
            @selection-change="handleSelectionChange"           
          >
            <!-- :reserve-selection="true" -->
            <el-table-column type="selection" width="40" :selectable="(row) => row.status === 0" />
            <el-table-column type="expand">         
              <template slot-scope="props">              
                <el-table                                   
                  :data="props.row.children"                
                  border
                  style="width: 88%; margin-left:88px"    
                  tooltip-effect="dark" 
                >
                  <el-table-column
                    v-for="(item, index) in sonColumns"
                    :label="item.name"
                    :prop="item.propName"
                    :width="item.width"
                    :key="index"
                    :show-overflow-tooltip="true"
                  >
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <!-- 对外层的表格表头进行了遍历循环  :prop="item.propName"-->
            <el-table-column v-for="item in parentsCloums" :label="item.name" :width="item.width" :key="item.propName">
              <template slot-scope="scope">
                <div v-if="item.propName == 'status'">
                  <el-switch
                    :value="scope.row[item.propName]"
                    :active-value="0"
                    :inactive-value="1"
                    @click.native="handleSwitchChange(scope.row)"
                  ></el-switch>
                  <span :class="['status', scope.row[item.propName] === 0 ? 'active' : 'inactive']">{{
                    scope.row[item.propName] === 0 ? '开启' : '关闭'
                  }}</span>
                </div>
                <div v-else>
                  {{ scope.row[item.propName] }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
              <template slot-scope="{ row }">
                <el-button type="text" @click="showTagDetail('check', row)">查看</el-button>
                <el-button type="text" @click="showTagDetail('edit', row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(row)" v-if="row.status !== 0">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--
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
            <el-table-column type="selection" width="40" :reserve-selection="true" :selectable="(row) => row.status === 1" />
            <el-table-column label="序号" type="seq" width="50">
              <template slot-scope="scope">
                <span>{{ scope.row.seq }}</span>
              </template>
            </el-table-column>
            <el-table-column label="展示名称" prop="tagShowDesc" />
            <el-table-column label="标签名称" prop="tagDesc" />
            <el-table-column label="所属科室" prop="allDeptName" />
            <el-table-column label="创建人" prop="createUserName" />
            <el-table-column label="创建时间" prop="createDate" min-width="250" />
            <el-table-column label="更新时间" prop="modDate" />
            <el-table-column label="更新人" prop="modUserName" />
            <el-table-column label="状态" width="120">
              <template slot-scope="{ row }">
                <el-switch
                  :value="row.status"
                  :active-value="0"
                  :inactive-value="1"
                  @click.native="handleSwitchChange(row)"
                ></el-switch>
                <span
                  :class="['status', row.status === 0 ? 'active' : 'inactive']"
                >{{ row.status === 0 ? '开启' : '关闭' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="220">
              <template slot-scope="{ row }">
                <el-button type="text" @click="showTagDetail('check', row)">查看</el-button>
                <el-button type="text" @click="showTagDetail('edit', row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table> 
          -->
        </ProList>
      </template>
    </ProLayout>
    <ProDrawer
      :visible.sync="drawerVisible"
      title="新增病种标签对照"
      direction="rtl"
      :size="600"
      show-close
      class="tag-drawer"
    >
      <ReferenceForm
        :mode="tagDetailMode"
        :tagDetail="tagDetail"
        :icdTypeList="icdTypeList"
        ref="drawerTagDetail"
      ></ReferenceForm>
      <template slot="footer">
        <el-button type="default" @click="cancelChange">取消</el-button>
        <el-button type="primary" @click="handleSubmitTagDetail('drawerTagDetail')">确认</el-button>
      </template>
    </ProDrawer>
    <ProDialog
      :visible.sync="dialogVisible"
      :title="tagDetailMode === 'edit' ? '编辑病种标签对照' : '查看病种标签对照'"
      width="700px"
      :close-on-click-modal="false"
    >
      <ReferenceForm
        :mode="tagDetailMode"
        :tagDetail="tagDetail"
        :icdTypeList="icdTypeList"
        ref="dialogTagDetail"
      ></ReferenceForm>
      <template #footer>
        <el-button @click="dialogVisible = false" v-if="tagDetailMode === 'edit'">取 消</el-button>
        <el-button type="primary" @click="handleSubmitTagDetail('dialogTagDetail')" v-if="tagDetailMode === 'edit'">
          保存
        </el-button>
        <el-button @click="dialogVisible = false" v-if="tagDetailMode === 'check'">返回</el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProList, ProLayout, ProDrawer, ProDialog, IconSvg } from 'anx-vue'
import ReferenceForm from './ReferenceForm'
import {
  getDiseaseIcdList,
  saveDiseaseIcd,
  getIcdTypes,
  onChangeStatus,
  onDelIcdDiseaseTagMain,
} from '@/api/modules/diseaseControl'
export default {
  components: {
    ProList,
    ProLayout,
    ProDrawer,
    ProDialog,
    IconSvg,
    ReferenceForm,
  },
  data() {
    return {
      icdTypeList: [],
      tagStatusList: [
        { label: '开启', value: 0 },
        { label: '关闭', value: 1 },
      ],
      addDate: [],
      multipleSelection: [],
      loading: false,
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      drawerVisible: false,
      tagDetailMode: 'add',
      tagDetail: {},
      dialogVisible: false,
      parentsCloums: [
        //外层table的表头
        {
          name: '序号',
          propName: 'seq',
          width: '50',
        },
        {
          name: '对照标签',
          propName: 'tagShowDesc',
          //width:"450"
        },
        {
          name: '关联病种数',
          propName: 'diseaseTot',
        },
        {
          name: '总状态',
          propName: 'status',
        },
        {
          name: '创建人',
          propName: 'createUserName',
        },
        {
          name: '创建时间',
          propName: 'createDate',
          //width:"160"
        },
      ],
      tableData: [
        //外层table的数据
      ],
      sonColumns: [
        //内层table的表头
        {
          name: '序号',
          propName: 'seq',
          width: '50',
        },
        {
          name: '目录类型',
          propName: 'icdTypeDesc',
        },
        {
          name: '主要编码',
          propName: 'icdCode',
        },
        {
          name: "诊断名称",        
          propName: "icdName",
          width:"200"
        },
        {
          name: '纳入状态',
          propName: 'statusDesc',
        },
        {
          name: '更新人',
          propName: 'modUserName',
        },
        {
          name: '更新时间',
          propName: 'modDate',
          width: '175',
        },
      ],
    }
  },
  mounted() {
    this.getIcdTypes()
    this.onInquire()
  },
  methods: {
    async getIcdTypes() {
      try {
        const res = await getIcdTypes()
        console.log('getIcdTypes', res)
        if (res.code == 0) {
          this.icdTypeList = res.result
        } else {
          this.icdTypeList = []
        }
      } catch (err) {
        console.error(err)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('this.multipleSelection', this.multipleSelection.length)
    },
    // 查询
    async onInquire() {
      try {
        const res = await getDiseaseIcdList({
          ...this.queryParams,
          createDateS: this.addDate ? (this.addDate[0] ? this.addDate[0] + ' 00:00:00' : '') : '',
          createDateE: this.addDate ? (this.addDate[1] ? this.addDate[1] + ' 23:59:59' : '') : '',
          ...this.pageParams,
        })
        console.log('getDiseaseIcdList', res)
        this.tableData = res.result.records
        this.tableData.forEach((el) => {
          for (let key in el) {
            if (key == 'children' && el['children'].length) {
              let listx = ['icdTypeDesc', 'icdCode', 'icdName', 'statusDesc', 'modUserName', 'modDate']
              el['children'].forEach((item) => {
                listx.forEach((cont) => {
                  if (item[cont] === '') item[cont] = '/'
                })
              })
            } else {
              if (el[key] === '') {
                el[key] = '/'
              }
            }
          }
        })
        this.total = res.result.total
      } catch (err) {
        console.error('error', err)
      }
    },
    handleDelete(row) {
      this.$confirm('您确定要删除关联标签及标签下全部纳入病种吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteAllTip(row)
        })
        .catch(() => {})
    },
    //删除方法
    async deleteAllTip(row) {
      try {
        const res = await onDelIcdDiseaseTagMain({
          id: row.id,
        })
        if (res.code == 0) {
          this.$message.success('删除成功')
          this.onInquire()
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    showTagDetail(mode, row) {
      this.tagDetailMode = mode
      if (mode === 'add') {
        this.tagDetail = {
          icdIds: [
            {
              seq: 1,
              diseasesType: '',
              label: '',
              id: '',
              status: 0,
            },
          ],
          deptId: [],
          tagDiseaseDeptId: '',
          status: 0, //默认启用
        }
        this.drawerVisible = true
      } else {
        this.dialogVisible = true
        let newIcd = []
        let childList = row.children
        childList.forEach((item) => {
          let params = new Object()
          params.seq = item.seq
          params.status = item.status
          params.diseasesType = item.icdType
          params.label = item.icdName
          params.id = item.icdId
          newIcd.push(params)
        })
        this.tagDetail = {
          icdIds: newIcd,
          id: row.id,
          deptId: row.deptIds,
          beforeDeptId: row.deptIds, //修改之前的值
          tagDiseaseDeptId: row.tagDiseaseDeptId,
          beforeTagDiseaseDeptId: row.tagDiseaseDeptId, //修改之前的值
          status: row.status,
        }
        let val = this.tagDetail.deptId[this.tagDetail.deptId.length - 1]
        this.$nextTick(() => {
          this.$refs.dialogTagDetail.getTagDiseaseByDeptId(val)
        })
        console.log(this.tagDetail)
      }
    },
    batchStart() {
      if (this.multipleSelection.length) {
        let ids = []
        this.multipleSelection.forEach((item) => {
          ids.push(item.id)
        })
        const params = {
          ids: ids,
          status: 1,
        }
        this.changeStatus(params)
        this.clearFun()
      } else {
        this.$message.warning('请先选择需要批量关闭的列表')
      }
    },
    async changeStatus(params) {
      try {
        const res = await onChangeStatus(params)
        this.$message.success('状态更新完成')
        this.onInquire()
      } catch (error) {
        console.log('error', error)
      }
    },
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
    clearFun() {
      this.$refs.singleTable.clearSelection()
    },
    cancelChange() {
      console.log(this.tagDetail)
      let warnTxt = []
      this.tagDetail.icdIds.forEach((item, index) => {
        if (item.diseasesType || item.id) warnTxt.push(index)
      })
      if (this.tagDetail.deptId.length || this.tagDetail.relationDeptId) warnTxt.push(Math.round(Math.random() * 15))
      if (warnTxt.length) {
        this.$confirm('您有未保存的记录，确认要离开吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.drawerVisible = false
          })
          .catch(() => {})
      } else {
        this.drawerVisible = false
        return this.$message.success('取消成功')
      }
    },
    async handleSubmitTagDetail(formRefName) {
      let warnTxt = []
      this.tagDetail.icdIds.forEach((item, index) => {
        if (!item.diseasesType || !item.id) warnTxt.push(index)
      })
      if ((this.tagDetail.deptId && !this.tagDetail.deptId.length) || !this.tagDetail.tagDiseaseDeptId)
        warnTxt.push(Math.random() * 10)
      if (warnTxt.length) return this.$message.warning('请校验当前页面信息是否配置完整')

      //校验是否存在相同的疾病编码
      let icdList = this.tagDetail.icdIds
      let arr = icdList.map((item) => item.id)
      let new_arr = Array.from(new Set(arr))
      if (new_arr.length !== arr.length) {
        return this.$message.warning('不能选择相同的疾病编码')
      }

      try {
        let visibleFlag = ''
        let msg = ''
        let params = {
          ...this.tagDetail,
        }
        if (formRefName === 'drawerTagDetail') {
          msg = '新增对照成功'
          visibleFlag = 'drawerVisible'
        } else {
          visibleFlag = 'dialogVisible'
          msg = '编辑保存成功'
        }
        const res = await saveDiseaseIcd(params)
        console.log('saveDiseaseIcd', res)
        if (res.code === 0) {
          this.$message.success(msg)
          this[visibleFlag] = false
          this.queryParams = {}
          this.pageParams = {
            pageSize: 10,
            pageNum: 1,
          }
        } else {
          this.$message.error(res.data.desc)
        }
        this.onInquire()
      } catch (err) {
        console.error(err)
      }
    },
    async handleSwitchChange(row) {
      try {
        let ids = [row.id]
        const params = {
          ids: ids,
          status: row.status === 0 ? 1 : 0,
        }
        const res = await onChangeStatus(params)
        if (res.code == 0) {
          this.$message.success('状态更新完成')
          this.onInquire()
        }
      } catch (error) {
        console.log('error', error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.DiseaseTag {
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
  .status {
    margin-left: 5px;
    // &.active {
    //   color: #446ABD;
    // }
    // &.inactive {
    //   color: #dcdfe6;
    // }
  }
  .tag-drawer {
    .title {
      background-color: #f5f5f5;
      line-height: 40px;
      padding-left: 15px;
      font-size: 14px;
      color: #101010;
    }
  }
}
</style>
