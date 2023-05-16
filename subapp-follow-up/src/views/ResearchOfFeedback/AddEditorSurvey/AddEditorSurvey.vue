<template>
  <div class="survey-detail">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>{{ typeMap[pageType] }}调研</template>
      <template #main>
        <div class="main-content">
          <div class="wrapper">
            <header class="header">
              <el-table height="400" v-adaptive="{ bottomOffset: 630 }" :data="patientList" border>
                <el-table-column label="序号" type="index" width="50" />
                <el-table-column label="姓名" prop="name" width="70" />
                <el-table-column label="性别" prop="sexText" width="50" />
                <el-table-column label="年龄" prop="age" width="70" />
                <el-table-column label="手机号" prop="phoneNo" width="120" />
                <el-table-column label="慢病种类" prop="richDiseaseName" show-overflow-tooltip />
                <el-table-column
                  label="随访病种"
                  prop="followUpDiseaseText"
                  show-overflow-tooltip
                />
                <el-table-column label="纳入人" prop="includeUserName" width="100" />
                <el-table-column label="纳入机构" prop="includeHosName" width="100" />
                <el-table-column label="纳入时间" prop="includeDate" width="180" />
                <el-table-column label="责任医生" prop="doctorUserName" width="100" />
                <el-table-column
                  label="是否删除"
                  key="actions"
                  width="300"
                  v-if="pageType === 'update'"
                >
                  <template slot-scope="{ row }">
                    <el-radio-group v-model="row.deleteStatus" @change="handleDeleteChange(row)">
                      <el-radio label="0">否</el-radio>
                      <el-radio label="1">是</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="margin-top: 15px"
                @size-change="handleSizeChange"
                @current-change="getPatientList"
                :current-page="pageParams.pageNum"
                :page-sizes="[10, 20, 50, 100, 200]"
                :page-size="pageParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </header>
            <main class="main">
              <el-form
                :model="surveyDetail"
                :rules="surveyDetailRules"
                ref="surveyDetail"
                label-width="85px"
                class="form"
                :disabled="pageType === 'check'"
              >
                <el-form-item label="调研名称" prop="researchName">
                  <el-input
                    v-model="surveyDetail.researchName"
                    placeholder="请控制在20字以内"
                    clearable
                    maxlength="20"
                  />
                </el-form-item>
                <el-form-item label="调研机构" prop="researchHosId">
                  <OrgHosSelect
                    ref="hosRef"
                    v-model="surveyDetail.researchHosId"
                    :parentId="orgId"
                    placeholder="调研机构"
                  ></OrgHosSelect>
                </el-form-item>
                <el-form-item label="开启时间" prop="startDate">
                  <el-date-picker
                    v-model="surveyDetail.startDate"
                    clearable
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-date-picker
                    v-model="surveyDetail.endDate"
                    clearable
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions2"
                  />
                  <el-tooltip
                    effect="dark"
                    content="将在设定日期，关闭调研入口"
                    placement="top-start"
                  >
                    <i class="el-icon el-icon-question"></i>>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="调研表单" prop="templateId">
                  <el-select
                    v-model="surveyDetail.researchType"
                    disabled
                    class="my-select my-select1"
                  >
                    <el-option label="计划模板" value="FOLLOW"> </el-option>
                    <el-option label="评估模板" value="EVALUATION"> </el-option>
                    <el-option label="调研模板" value="RESEARCH"> </el-option>
                  </el-select>
                  <el-select v-model="surveyDetail.templateId" class="my-select">
                    <el-option
                      v-for="item in followUpForms"
                      :disabled="item.disabled"
                      :label="item.label"
                      :value="item.value"
                      :key="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="患者提醒" prop="msgToRemind">
                  <el-checkbox-group v-model="surveyDetail.msgToRemind">
                    <el-checkbox label="1" disabled>系统消息</el-checkbox>
                    <el-checkbox label="2">短信消息</el-checkbox>
                    <el-checkbox label="3">首页强提示</el-checkbox>
                    <el-popover placement="top-start" trigger="hover">
                      <img src="@/assets/Survey1.png" alt="" srcset="" />
                      <i slot="reference" class="el-icon el-icon-question"></i>
                    </el-popover>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="展示位置">
                  <el-checkbox-group v-model="surveyDetail.bannerStatus">
                    <el-checkbox label="0">首页banner</el-checkbox>
                    <el-popover placement="top-start" trigger="hover">
                      <img src="@/assets/Survey2.png" alt="" srcset="" />
                      <i slot="reference" class="el-icon el-icon-question"></i>
                    </el-popover>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
            </main>
          </div>
          <footer class="footer">
            <el-button @click="$router.go(-1)" v-if="pageType === 'check'">返回</el-button>
            <el-button @click="handleCancel" v-if="pageType !== 'check'">取 消</el-button>
            <el-button type="primary" @click="submit" v-if="pageType !== 'check'">
              确 定
            </el-button>
          </footer>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import {
  getPatientInfoOnResearch,
  getPatientInfoOnEdit,
  saveResearch,
  updateResearch,
  getFollowUpForms,
  getResearchInfo,
  deletePatientInResearch,
  getOrgDiseaseTypes,
  deleteResearch,
} from '@/api/modules/PatientCenter/index'
import {
  onQueryTemplates,
  onQueryTemplateById,
  onChangeTemplateStatus,
} from '@/api/modules/FormDesign'
import { sexList } from '@/utils/data-map'

export default {
  data() {
    return {
      orgId: '',
      typeMap: {
        add: '新增',
        check: '查看',
        update: '编辑',
      },
      researchId: '',
      pageType: 'add',
      patientList: [],
      surveyDetail: {
        researchName: '',
        startDate: '',
        endDate: '',
        templateId: '',
        researchType: 'RESEARCH',
        msgToRemind: ['1'],
        researchHosId: '',
        bannerStatus: [],
      },
      surveyDetailRules: {
        researchName: [{ required: true, message: '请输入调研名称', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择开启时间', trigger: 'blur' }],
        templateId: [{ required: true, message: '请选择调研表单', trigger: 'change' }],
        msgToRemind: [{ required: true, message: '请选择患者提醒', trigger: 'change' }],
        researchHosId: [{ required: true, message: '请选择调研机构', trigger: 'change' }],
      },
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      followUpForms: [],
      pickerOptions: {
        disabledDate: (time) => {
          if (this.surveyDetail.endDate) {
            return (
              time.getTime() < Date.now() - 8.64e7 ||
              new Date(this.surveyDetail.endDate).getTime() < time.getTime()
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          if (this.surveyDetail.startDate) {
            return (
              new Date(this.surveyDetail.startDate).getTime() > time.getTime() + 24 * 3600 * 1000
            )
          } else {
            return time.getTime() < Date.now()
          }
        },
      },
      diseaseTypeList: [],
      flagDiogle: false,
    }
  },
  created() {
    this.orgId = window.sessionStorage.getItem('orgId')
  },
  async mounted() {
    console.log(`this.orgId`, this.orgId)
    await this.$refs.hosRef.init()
    this.pageType = this.$route.query.type
    this.researchId = this.$route.query.researchId
    this.getFollowUpForms()
    await this.getOrgDiseaseTypes()
    // 不是新增的话需要先调取后台获取调研详情接口，重置页面上面的患者是否删除字段
    // 如果是新增的话直接获取列表，不需获取详情
    if (this.pageType !== 'add') {
      await this.getResearchInfo()
      this.getPatientList(1)
    } else {
      this.getPatientList(1)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.pageType === 'add' && !this.flagDiogle) {
      this.$confirm('您有未保存的记录，确认要离开吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteResearchAxios('2', next)
        })
        .catch(() => {
          next(false)
        })
    } else {
      next()
    }
  },
  methods: {
    async getOrgDiseaseTypes() {
      try {
        const res = await getOrgDiseaseTypes()
        let diseaseTypeList = []
        res.result.forEach((item) => {
          diseaseTypeList = diseaseTypeList.concat(item.tagList)
        })
        this.diseaseTypeList = diseaseTypeList
        console.log('diseaseTypeList====', diseaseTypeList)
      } catch (err) {
        console.error(err)
      }
    },
    // 获取表单模板
    async getFollowUpForms() {
      try {
        const res = await getFollowUpForms({ type: 'RESEARCH' })
        console.log('getFollowUpForms====', res)
        this.followUpForms = res.result
      } catch (err) {
        console.log(err)
      }
    },

    // 获取上部患者列表
    async getPatientList(currentPage) {
      try {
        this.pageParams.pageNum = currentPage
        const queryParams = {
          researchId: this.researchId,
          ...this.pageParams,
        }
        const res =
          this.pageType === 'update'
            ? await getPatientInfoOnEdit(queryParams)
            : await getPatientInfoOnResearch(queryParams)
        console.log('getPatientList===', res)
        this.patientList = res.result.map((item) => ({
          ...item,
          followUpDiseaseText: item.followUpDiseaseCodes
            .map((code) =>
              this.diseaseTypeList.find((diseaseType) => diseaseType.value === code)?.label
                ? this.diseaseTypeList.find((diseaseType) => diseaseType.value === code)?.label
                : '',
            )
            .join(','),
          sexText: sexList.find((sex) => sex.value === item.sex)
            ? sexList.find((sex) => sex.value === item.sex)?.label
            : '',
        }))
        this.patientList.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.total = res.total
      } catch (err) {
        console.log('err', err)
      }
    },

    // 切换是否删除
    async handleDeleteChange(row) {
      try {
        const res = await deletePatientInResearch({
          patIds: [row.patId],
          researchId: this.researchId,
          deleteCode: row.deleteStatus,
        })
        console.log('deletePatientInResearch', res)
      } catch (err) {
        console.error(err)
      }
    },

    // 获取调研详情
    async getResearchInfo() {
      try {
        const res = await getResearchInfo({ researchId: this.researchId })
        console.log('getResearchInfo', res)
        for (const key in this.surveyDetail) {
          if (key === 'msgToRemind') {
            this.surveyDetail[key] = res.result[key].split(',')
          } else {
            this.surveyDetail[key] = res.result[key]
          }
          console.log(`this.surveyDetail`, this.surveyDetail)
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 调研提交
    submit() {
      this.$refs.surveyDetail.validate(async (validate) => {
        if (validate) {
          const submitParams = {
            researchId: this.researchId,
            ...this.surveyDetail,
            templateName: this.followUpForms.find(
              (item) => this.surveyDetail.templateId === item.value,
            )?.label,
            msgToRemind: this.surveyDetail.msgToRemind.join(','),
            bannerStatus: this.surveyDetail.bannerStatus.join(','),
            researchUserId: sessionStorage.getItem('userId'),
            researchUserName: sessionStorage.getItem('loginName'),
            researchHosId: this.surveyDetail.researchHosId,
            researchHosName: this.$refs.hosRef.getHosName(),
          }
          try {
            const res =
              this.pageType === 'add'
                ? await saveResearch(submitParams)
                : await updateResearch(submitParams)
            console.log('调研提交submit', res)
            if (res.code === 0) {
              this.flagDiogle = true
              this.$router.go(-1)
            }
          } catch (err) {
            console.error(err)
          }
        }
      })
    },
    handleSizeChange(val) {
      this.pageParams.pageNum = 1
      this.pageParams.pageSize = val
      this.getPatientList(1)
    },
    async deleteResearchAxios(type, next) {
      try {
        const res = await deleteResearch({ researchId: this.researchId })
        console.log('deleteResearch', res)
        if (res.code == 0) {
          if (type == '1') this.$router.go(-1)
          else next()
        }
      } catch (err) {
        console.error(err)
      }
    },
    handleCancel() {
      try {
        if (this.pageType === 'add') {
          this.$confirm('您有未保存的记录，确认要离开吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              this.flagDiogle = true
              this.deleteResearchAxios('1')
            })
            .catch(() => {})
        } else {
          this.$router.go(-1)
        }
      } catch (err) {
        console.error(err)
      }
    },
  },
  components: {
    ProLayout,
  },
}
</script>

<style lang="scss" scoped>
.survey-detail {
  .main-content {
    .wrapper {
      margin: 10px;
      .header {
        padding: 20px;
        background: #fff;
      }
      .main {
        margin: 20px 0;
        background: #fff;
        overflow: hidden;
        .form {
          width: 430px;
          margin: 10px auto;
          .my-select {
            width: 150px;
            &.my-select1 {
              margin-right: 10px;
            }
          }
        }
        .el-icon-question {
          margin-left: 3px;
          font-size: 18px;
          color: #446abd;
        }
      }
    }
    .footer {
      padding: 10px 30px 10px 0;
      background: #fff;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
