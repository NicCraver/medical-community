<template>
  <div class="ReviewInclusion">
    <ProLayout model="title" mainBgColor="#F5F5F5" margin="0" padding="0">
      <template #title>批量暂不管理</template>
      <template #main>
        <div class="main-content">
          <div class="wrapper">
            <header class="header">
              <el-table v-adaptive="{ bottomOffset: 366 }" :height="height" :data="patientList" border>
                <el-table-column label="申请类型" prop="applyTypeDesc" />
                <el-table-column label="来源" prop="dataSource" />
                <el-table-column label="姓名" prop="name" />
                <el-table-column label="性别" prop="sexDesc" />
                <el-table-column label="年龄" prop="age" />
                <el-table-column label="身份证号" prop="idNo" />
                <el-table-column label="慢病种类" prop="richDiseaseName" />
                <el-table-column label="申请人" prop="applyDrName" width="100" />
                <el-table-column label="申请时间" prop="applyDate" width="180" />
              </el-table>
            </header>
            <main class="main">
              <el-form :model="noForm" :rules="noFormRules" ref="noFormRef" label-width="120px" class="form">
                <el-form-item label="暂不管理原因:" prop="reason">
                  <el-input
                    type="textarea"
                    v-model="noForm.reason"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    show-word-limit
                    maxlength="200"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div class="reason">
                <div>您可以选择以下原因</div>
                <div class="reasons">
                  <div v-for="v in notReasons" @click="changeReasons(v.msg)">
                    {{ v.msg }}
                  </div>
                </div>
              </div>
            </main>
          </div>
          <footer class="footer">
            <el-button @click="goBack">取 消</el-button>
            <el-button type="primary" @click="submitForm('noFormRef')"> 确 定 </el-button>
          </footer>
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
      height: window.innerHeight - 140 - 366,
      notReasons: [{ msg: '重复申请纳入' }, { msg: '不符合纳入条件' }, { msg: '患者不同意纳入' }],
      // 暂不纳入管理表单
      noForm: {
        reason: '',
      },
      noFormRules: {
        reason: [{ required: true, message: '请输入暂不管理原因', trigger: 'change' }],
      },
      patientList: [],
      // 当前页数
      currentPage: 1,
    }
  },
  created() {
    console.log(`this.$route.params`, this.$route.params.row)
    this.patientList = this.$route.params.row
  },
  methods: {
    submitForm(formName) {
      if (this.noForm.reason.trim().length > 200) {
        this.$message.error('暂不管理原因须在200字以内')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(`this.patientList`, this.patientList)
          let joinDetailIds = []
          this.patientList.forEach((el) => {
            joinDetailIds.push(el.id)
          })
          this.postManageApiFun({
            joinDetailIds,
            joinFlg: 'N',
            reason: this.noForm.reason,
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async postManageApiFun(obj) {
      try {
        const res = await onJoin(obj)
        console.log(`res`, res)
        if (res.code === 0) {
          this.$message.success('暂不管理成功！')
          this.goBack()
        }
      } catch (error) {
        console.log(`error`, error)
      }
    },
    // 更新原因
    changeReasons(msg) {
      console.log(`msg`, msg)
      this.noForm.reason = this.noForm.reason + msg + ';'
      console.log(`this.noForm.reason`, this.noForm.reason)
    },
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.ReviewInclusion {
  .main-content {
    .wrapper {
      margin: 10px;
      .header {
        padding: 20px;
        background: #fff;
      }
      .main {
        margin: 20px 0;
        padding: 30px 200px;
        background: #fff;
        .reason {
          margin-left: 10px;
          .reasons {
            display: flex;
            flex-wrap: wrap;
            div {
              cursor: pointer;
              margin: 10px 10px 0 0;
              padding: 0 20px;
              height: 32px;
              line-height: 32px;
              background-color: rgba(245, 245, 245, 100);
              font-size: 14px;
              text-align: center;
            }
          }
        }
      }
    }
    .footer {
      padding: 15px 30px 15px 0;
      background: #fff;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
