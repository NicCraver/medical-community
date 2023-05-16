<template>
  <div class="bulk-push">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>批量推送活动</template>
      <template #main>
        <div class="main-content">
          <div class="wrapper">
            <header class="header">
              <el-table height="240" v-adaptive="{ bottomOffset: 600 }" :data="patientList" border>
                <el-table-column label="序号" type="index" width="50">
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="来源" prop="dataSource" show-overflow-tooltip />
                <el-table-column label="姓名" prop="name" show-overflow-tooltip />
                <el-table-column label="性别" prop="sexDesc" width="50" show-overflow-tooltip />
                <el-table-column label="年龄" prop="age" width="65" show-overflow-tooltip />
                <el-table-column label="手机号" prop="phoneNo" width="140" show-overflow-tooltip />
                <el-table-column
                  label="慢病种类"
                  prop="richDiseaseName"
                  min-width="180"
                  show-overflow-tooltip
                />
                <el-table-column label="责任医生" prop="doctorUserName" show-overflow-tooltip />
                <el-table-column
                  label="建档人"
                  prop="archiveUserName"
                  width="140"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="建档机构"
                  prop="archiveHosName"
                  width="200"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="建档时间"
                  prop="archiveDate"
                  width="110"
                  show-overflow-tooltip
                />
                <!-- <el-table-column label="结档时间" prop="finishArchiveDate" width="110" show-overflow-tooltip /> -->
                <el-table-column label="是否参与推广活动" width="140" show-overflow-tooltip>
                  <template slot-scope="row">
                    {{ row.row.isStartActivity === 0 ? '否' : '是' }}
                  </template>
                </el-table-column>
                <!-- 0 否 1 是 -->
              </el-table>
            </header>
            <main class="main">
              <el-form
                class="form"
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
              >
                <el-form-item label="活动推送模式">
                  <el-select v-model="ruleForm.pushType" disabled>
                    <el-option label="手动推送" value="HAND" />
                    <el-option label="自动推送" value="AUTO" />
                  </el-select>
                </el-form-item>
                <el-form-item label="活动名称" prop="activityId">
                  <UniversalSelect
                    v-model="ruleForm.activityId"
                    ref="couponUserIdRef"
                    placeholder="活动名称"
                    url="/ygt-marketing/tbAActivityPush/queryActivityDownInfo"
                    :params="{
                      pushType: ruleForm.pushType,
                    }"
                  />
                </el-form-item>
                <div style="color: rgba(90, 90, 90, 100); font-size: 12px">
                  <i class="el-icon-warning-outline"></i>
                  仅支持满足活动“适用人群"要求的患者参与活动。
                </div>
              </el-form>
            </main>
          </div>
          <footer class="footer">
            <el-button @click="$router.go(-1)">返回</el-button>
            <el-button type="primary" @click="submitForm"> 确 定 </el-button>
          </footer>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import {
  onInitFollowup,
  joinFollowUp,
  getPatIsExistFollowupPlanOver,
  batchPushActivity,
} from '../../api/modules/PatientCenter'
export default {
  data() {
    return {
      patientList: [],
      ruleForm: {
        pushType: 'HAND',
        patIds: [],
      },
      rules: {
        activityId: [{ required: true, message: '请选择', trigger: 'blur' }],
      },
    }
  },
  created() {},
  async mounted() {
    console.log(`this.$route.param`, this.$route)
    this.$route.params.list.forEach((el) => {
      for (let key in el) {
        if (!el[key]) {
          el[key] = '/'
        }
      }
    })
    this.patientList = this.$route.params.list
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(`this.ruleForm`, this.ruleForm)
          this.ruleForm.patIds = this.patientList.map((el) => el.patId)
          this.batchPushActivity()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    async batchPushActivity() {
      try {
        const res = await batchPushActivity(this.ruleForm)
        this.$message.success('保存成功')
        this.$router.go(-1)
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
.bulk-push {
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
          width: 400px;
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
