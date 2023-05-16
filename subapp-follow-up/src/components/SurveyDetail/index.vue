<template>
  <div class="survey-detail">
    <Layout model="title" mainBgColor="#F5F5F5" margin="0" padding="0" overflow>
      <template #title>新增调研</template>
      <template #main>
        <div class="main-content">
          <div class="wrapper">
            <header class="header">
              <el-table v-adaptive="{ bottomOffset: 366 }" :height="height" :data="patientList" border>
                <el-table-column label="序号" type="index" />
                <el-table-column label="姓名" prop="name" />
                <el-table-column label="性别" prop="sexDesc" />
                <el-table-column label="年龄" prop="age" />
                <el-table-column label="手机号" prop="phone" />
                <el-table-column label="慢病种类" prop="richDiseaseName" />
                <el-table-column label="随访病种" prop="richDiseaseName" />
                <el-table-column label="纳入人" prop="applyDrName" width="100" />
                <el-table-column label="纳入时间" prop="applyDate" width="180" />
                <el-table-column label="责任医生" prop="applyDate" width="180" />
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
    </Layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: window.innerHeight - 140 - 366,
      patientList: [],
    }
  },
}
</script>
