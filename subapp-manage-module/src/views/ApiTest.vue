<template>
  <ProLayout mainBgColor="#F5F5F5" padding="0" overflow>
    <template #title>ApiTest</template>
    <template #main>
      <el-row style="background: #fff; padding: 10px; height: calc(100vh - 118px); min-height: calc(100vh - 118px)">
        <el-col :span="6">
          <el-scrollbar style="height: calc(100vh - 130px)">
            <div v-for="(v, index) in apiList" style="margin-right: 10px">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
                <div @click="change(v)" style="width: 100%; border: 1px solid #dddfe5; cursor: pointer; padding: 3px; padding-left: 10px">
                  {{ v.url }}
                </div>
                <div>
                  <el-button icon="el-icon-delete" type="danger" @click="onDelete(index)"></el-button>
                </div>
              </div>
            </div>
            <div style="background: #fff; color: #fff">12412421</div>
          </el-scrollbar>
        </el-col>
        <el-col :span="18">
          <div class="post">
            <div style="flex: 1">
              <el-input v-model="url" placeholder="例如：/ygt-user/user/login"></el-input>
            </div>
            <div style="width: 125px; margin: 0 10px">
              <el-radio-group v-model="type">
                <el-radio-button label="get">GET</el-radio-button>
                <el-radio-button label="post">POST</el-radio-button>
              </el-radio-group>
            </div>
            <!-- 174px -->
            <!-- 155px -->
            <div :style="{ width: width }">
              <el-button type="primary" @click="onSubmit" :loading="loading">发送</el-button>
              <el-button @click="onSave">保存接口</el-button>
            </div>
          </div>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="24">
              <el-input type="textarea" placeholder="请输入参数" v-model="body" :autosize="{ minRows: 10, maxRows: 20 }"> </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="24">
              <el-input type="textarea" v-model="result" :autosize="{ minRows: 10, maxRows: 10 }"> </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="24">
              <el-scrollbar style="height: 300px; border: 1px solid #dddfe5">
                <pre>
                  {{ result2 }}
                </pre>
              </el-scrollbar>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- <pre></pre> -->
    </template>
  </ProLayout>
</template>

<script>
import { ProLayout } from 'anx-vue'
import http from '../api/index'

export default {
  components: {
    ProLayout,
  },
  data() {
    return {
      loading: false,
      url: '',
      type: 'get',
      body: '',
      result: '',
      result2: '',
      apiList: [
        {
          url: '/ygt-user/user/onQueryAccountList',
          type: 'post',
          body: '{"pageNum":1,"pageSize":10,"createDateS":"","createDateE":""}',
          result: '',
          result2: '',
        },
      ],
    }
  },
  mounted() {
    console.log('JSON.parse(localStorage.getItem)', JSON.parse(localStorage.getItem('apiList')))
    this.apiList = JSON.parse(localStorage.getItem('apiList'))
    if (this.apiList === null) {
      this.apiList = []
      this.apiList.push(
        {
          url: '/ygt-user/user/onQueryAccountList',
          type: 'post',
          body: '{"pageNum":1,"pageSize":10,"createDateS":"","createDateE":""}',
          result: '',
          result2: '',
        },
        {
          url: '/ygt-user/tbDictionaryGroup/getDictionary',
          type: 'get',
          body: '{code:"DEPT_CLASSIFY"}',
          result: '',
          result2: '',
        }
      )
      localStorage.setItem('apiList', JSON.stringify(this.apiList))
    }
  },
  methods: {
    change(row) {
      this.url = row.url
      this.type = row.type
      this.body = row.body
      this.result = row.result
      this.result2 = row.result2
    },
    onSave() {
      this.apiList.push({
        url: this.url,
        type: this.type,
        body: this.body,
        result: this.result,
        result2: this.result2,
      })
      localStorage.setItem('apiList', JSON.stringify(this.apiList))
    },
    onDelete(index) {
      this.apiList.splice(index, 1)
      localStorage.setItem('apiList', JSON.stringify(this.apiList))
    },
    onSubmit() {
      if (this.url === '') {
        this.$message.error('请输入Url')
        return
      }
      this.loading = true
      this.result = ''
      this.result2 = ''
      if (this.type === 'get') {
        let temp = {}
        if (this.body !== '') {
          temp = {
            url: this.url,
            params: JSON.parse(this.body),
          }
        } else {
          temp = {
            url: this.url,
          }
        }
        http
          .get(temp)
          .then((res) => {
            console.log('res', res)
            this.result = JSON.stringify(res)
            this.result2 = res
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            console.log('err', err)
          })
      } else {
        http
          .post({
            url: this.url,
            data: JSON.parse(this.body),
          })
          .then((res) => {
            console.log('res', res)
            this.result = JSON.stringify(res)
            this.result2 = res
            this.loading = false
          })
          .catch((err) => {
            console.log('err', err)
            this.loading = false
          })
      }
    },
  },
  computed: {
    width() {
      return this.loading ? '174px' : '155px'
    },
  },
}
</script>

<style lang="scss" scoped>
.post {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
