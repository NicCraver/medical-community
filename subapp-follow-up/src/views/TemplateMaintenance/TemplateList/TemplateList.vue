<template>
  <div class="TemplateList">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>模板列表</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input placeholder="模板名称" v-model="queryParams.templateDesc" clearable />
            <el-select v-model="queryParams.type" clearable placeholder="模板类型">
              <el-option label="计划模板" value="FOLLOW"> </el-option>
              <el-option label="评估模板" value="EVALUATION"> </el-option>
              <el-option label="调研模板" value="RESEARCH"> </el-option>
              <el-option label="活动模板" value="ACTIVITY"> </el-option>
              <el-option label="会诊模板" value="MDT"> </el-option>
            </el-select>
            <el-select v-model="queryParams.status" clearable placeholder="状态">
              <el-option label="启用" value="Y"> </el-option>
              <el-option label="停用" value="N"> </el-option>
            </el-select>
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" @click="goTemplate('add')"> 新建模板 </el-button>
            <!-- <el-button type="primary" @click="BusinessComponent()">
              业务组件
            </el-button> -->
          </template>
          <el-table
            v-adaptive="{ bottomOffset: 75 }"
            height="0"
            ref="singleTable"
            :data="tableList"
            border
            v-loading="loading"
            row-key="id"
            :tree-props="{ children: 'children' }"
          >
            <el-table-column label="序号" prop="seq" width="55" align="right">
              <!-- <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
              </template> -->
            </el-table-column>
            <el-table-column label="模板类型" prop="typeDesc" />
            <el-table-column label="模板名称" prop="templateDesc" />
            <el-table-column label="版本号" prop="version" />
            <el-table-column label="版本创建时间" prop="createDate" />
            <!-- <el-table-column label="修改时间" prop="modDate" /> -->
            <el-table-column label="启用/停用修改时间" prop="startEndDate" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-switch
                  :disabled="scope.row.defaultFlg === 'N'"
                  v-model="scope.row.status"
                  active-value="Y"
                  inactive-value="N"
                  @click.native="switchChange(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onAction1(scope.row)"> 查看 </el-button>
                <!-- :disabled="scope.row.modifyFlg === 'N'" -->
                <el-button
                  type="text"
                  @click="goTemplate('edit', scope.row)"
                  v-if="scope.row.defaultFlg === 'Y'"
                >
                  编辑
                </el-button>
                <el-button type="text" @click="goTemplate('copy', scope.row)"> 复制 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </ProList>
      </template>
    </ProLayout>
    <!-- 查看 -->
    <el-dialog :title="tempFormDesc" :visible.sync="dialogFormVisible" width="800px">
      <div class="anxForm">
        <anx-form
          ref="anxForm"
          :anxFormData="tempFormData"
          :baseUrl="'http://124.196.7.86:7001/ygt-followup'"
          @form-submit="handleSubmit"
          :disabled="true"
        />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAction3"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog title="业务组件维护" :visible.sync="BusinessComponentVisible" width="800px">
      <BusinessComponent />
      <div slot="footer" class="dialog-footer">
        <el-button @click="BusinessComponentVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAction3"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ProList, ProLayout, IconSvg } from 'anx-vue'
import BusinessComponent from './components/BusinessComponent.vue'
import {
  onQueryTemplates,
  onQueryTemplateById,
  onChangeTemplateStatus,
} from '@/api/modules/FormDesign'
export default {
  components: {
    ProList,
    ProLayout,
    IconSvg,
    BusinessComponent,
  },
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      BusinessComponentVisible: false,
      tempFormDesc: '',
      tempFormData: {},
      // table
      tableList: [],
      // 查询请求参数
      queryParams: {},
      // 总数
      total: 0,
      // 分页请求删除
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  created() {
    this.onInquire()
  },
  methods: {
    async onInquire() {
      try {
        this.loading = true
        const res = await onQueryTemplates({
          ...this.queryParams,
          ...this.pageParams,
        })
        console.log(`res`, res.result)
        const { records, total } = res.result
        records.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.tableList = records
        this.total = total
        console.log(`records2222222`, records)
        this.loading = false
      } catch (err) {
        this.loading = false
        console.error('err', err)
      }
    },
    async onAction1(row) {
      try {
        const res = await onQueryTemplateById({
          id: row.id,
        })
        console.log(`res`, res.result)
        const { templateData, templateDesc } = res.result
        this.dialogFormVisible = true
        console.log(`typeof templateData`, typeof templateData)
        this.tempFormData = JSON.parse(templateData)
        this.tempFormDesc = templateDesc
      } catch (err) {
        console.error('err', err)
      }
    },
    onAction2(row) {
      console.log(`row`, row)
    },
    onAction3(row) {
      console.log(`row`, row)
      console.log(this.$refs.anxForm.formSubmit())
    },
    handleSubmit(row) {
      console.log(`handleSubmit`, row)
    },
    async goTemplate(state, row) {
      if (state === 'add') {
        this.$router.push('/FormD')
      } else {
        try {
          const res = await onQueryTemplateById({
            id: row.id,
          })
          console.log(`res`, res.result)
          const { templateData, templateDesc, returnData } = res.result
          let id = ''
          if (state === 'edit') {
            id = row.id
          }
          this.$router.push({
            name: `FormD`,
            params: {
              ...JSON.parse(templateData),
              templateId: id,
              templateName: templateDesc,
              type: row.type,
              returnData: returnData,
              state: state,
            },
          })
        } catch (err) {
          console.error('err', err)
        }
      }
    },
    resetQueryParams() {
      this.queryParams = {}
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.onInquire()
    },
    BusinessComponent() {
      this.BusinessComponentVisible = true
    },
    async switchChange(row) {
      if (row.defaultFlg === 'N') {
        this.$message.warning('该模板不能被开启，如需使用请复制')
        return
      }
      console.log(`row`, row)
      try {
        const res = await onChangeTemplateStatus({ id: row.id })
        this.$message.success('修改状态成功！')
        this.onInquire()
      } catch (error) {
        console.log(`error`, error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.TemplateList {
  .header {
    .bolck {
      border-radius: 2px;
      font-size: 16px;
      color: #101010;
      text-align: center;
      background-color: #fff;
      height: 75px;
      line-height: 75px;
    }
  }
  .ProList {
    border-radius: 2px;
    margin-top: 10px;
    padding: 10px;
    background-color: #fff;
  }
  ::v-deep.el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    /** 这 0.5px加或者减都可以 */
    transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
    // transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  ::v-deep.el-dialog__body {
    overflow: auto;
  }
  ::v-deep.el-dialog__body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::v-deep.el-dialog__body::-webkit-scrollbar-thumb {
    background-color: #dddee0;
    border-radius: 8px;
  }
}
</style>
