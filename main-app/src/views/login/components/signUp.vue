<template>
  <div class="signUp">
    <div class="signUp-title">质量控制中心平台</div>
    <div class="signUp-bg">
      <main class="signUp-main">
        <a-page-header title="返回" @back="goBack" />
        <div class="signUp-main-header">
          <div class="signUp-main-title">在线申请</div>
          <div class="signUp-main-subtitle">
            <span style="color: #7495e6">*</span>
            若选择医院中未有本机构，请输入机构名称并完善机构相关信息
          </div>
        </div>
        <div class="signUp-main-descriptions">
          <table>
            <colgroup>
              <col style="width: 20%" />
              <col style="width: 20%" />
              <col style="width: 20%" />
              <col style="width: 20%" />
              <col style="width: 20%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="bg">医院名称：</td>
                <td>
                  <a-select
                    v-model:value="applicationForm.provinceCode"
                    style="width: 100%"
                    @change="handleProvinceChange"
                    placeholder="请选择省份"
                  >
                    <a-select-option :key="v.value" :value="v.value" v-for="v in options.province">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-select
                    v-model:value="applicationForm.cityCode"
                    style="width: 100%"
                    @change="handleCityChange"
                    placeholder="请选择市"
                    :disabled="applicationForm.provinceCode === undefined"
                  >
                    <a-select-option :key="v.value" :value="v.value" v-for="v in options.city">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-select
                    v-model:value="applicationForm.districtCode"
                    style="width: 100%"
                    @change="handleDistrictChange"
                    placeholder="请选择区"
                    :disabled="applicationForm.cityCode === undefined"
                  >
                    <a-select-option :key="v.value" :value="v.value" v-for="v in options.district">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-auto-complete
                    v-model:value="applicationForm.hosName"
                    :options="options.hos"
                    :disabled="applicationForm.districtCode === undefined"
                    style="width: 100%"
                    placeholder="请选择医院"
                    :filter-option="filterOption"
                  />
                </td>
              </tr>
              <tr>
                <td class="bg">医疗机构执业许可证登记号：</td>
                <td colspan="2">
                  <a-input
                    v-model:value="applicationForm.registrationNumber"
                    placeholder="请输入医疗机构执业许可证登记号"
                  />
                </td>
                <td class="bg">机构类别：</td>
                <td>
                  <a-select v-model:value="applicationForm.hosType" style="width: 100%" placeholder="请选择机构类别">
                    <a-select-option :key="v.value" :value="v.value" v-for="v in options.hosType">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </td>
              </tr>
              <tr>
                <td class="bg">医院级别：</td>
                <td colspan="2">
                  <a-select v-model:value="applicationForm.hosLevel" style="width: 100%" placeholder="请选择医院级别">
                    <a-select-option :key="v.value" :value="v.value" v-for="v in options.hosLevel">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </td>
                <td class="bg">医院等次：</td>
                <td>
                  <a-select v-model:value="applicationForm.hosGrade" style="width: 100%" placeholder="请选择医院等次">
                    <a-select-option :key="v.value" :value="v.value" v-for="v in options.hosGrade">
                      {{ v.label }}
                    </a-select-option>
                  </a-select>
                </td>
              </tr>
              <tr>
                <td class="bg">联系电话：</td>
                <td colspan="2">
                  <a-input v-model:value="applicationForm.telephone" placeholder="请输入联系电话" />
                </td>
                <td class="bg">联系人：</td>
                <td>
                  <a-input v-model:value="applicationForm.contactPersonName" placeholder="请输入联系人" />
                </td>
              </tr>
              <tr>
                <td class="bg">科室：</td>
                <td colspan="2">
                  <a-input v-model:value="applicationForm.deptName" placeholder="请输入科室" />
                </td>
                <td class="bg">职务：</td>
                <td>
                  <a-input v-model:value="applicationForm.jobName" placeholder="请输入职务" />
                </td>
              </tr>
              <tr>
                <td class="bg">实名认证信：</td>
                <td colspan="4">
                  <div style="display: flex; justify-content: space-between">
                    <div class="custom-file-upload">
                      <label for="file-input">
                        <span>
                          <div class="upload-td">
                            <img src="@/assets/riFill-upload-2-fill@1x.png" alt="" />
                            <div v-if="formFiles.realNameAuthFile" class="text">
                              <span>修改</span>
                              <span style="color: rgba(91, 91, 91, 1); font-size: 14px">
                                <a-button type="link" style="color: #000" :loading="loadingFile1">
                                  {{ formFiles.realNameAuthFile.name }}
                                </a-button>
                              </span>
                            </div>
                            <div v-else class="text">请上传图片</div>
                          </div>
                        </span>
                        <input type="file" id="file-input" @change="handleFileUpload" />
                      </label>
                    </div>

                    <div class="download-td" @click="Download">实名认证模版下载</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="bg">邮箱：</td>
                <td colspan="2">
                  <a-input v-model:value="applicationForm.email" placeholder="请输入邮箱" />
                </td>
                <td class="bg">医疗机构执业许可证扫描件：</td>
                <td>
                  <div class="custom-file-upload">
                    <label for="file-input2">
                      <span>
                        <div class="upload-td">
                          <img src="@/assets/riFill-upload-2-fill@1x.png" alt="" />
                          <div v-if="formFiles.permitFile" class="text">
                            <span>修改</span>
                            <span style="color: rgba(91, 91, 91, 1); font-size: 14px">
                              <a-button type="link" style="color: #000" :loading="loadingFile2">
                                {{ formFiles.permitFile.name }}
                              </a-button>
                            </span>
                          </div>
                          <div v-else class="text">请上传图片</div>
                        </div>
                      </span>
                      <input type="file" id="file-input2" @change="handleFileUpload2" />
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="signUp-main-btn">
          <div class="btn">申请</div>
          <div class="text">已有平台账户，请直接</div>
          <div class="login" @click="goBack">登录</div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { getSysAreas, getDictionarys, getHosOptionsByAreaCode, uploadFiles } from '@/api/modules/login/index.js'

const applicationForm = reactive({
  // 医院id
  hosId: undefined,
  // 医院名称
  hosName: undefined,
  // 省
  provinceCode: undefined,
  // 市
  cityCode: undefined,
  // 区
  districtCode: undefined,
  // 医疗机构执业许可证登记号
  registrationNumber: undefined,
  // 机构类别
  hosType: undefined,
  // 医院级别
  hosLevel: undefined,
  // 医院等次
  hosGrade: undefined,
  // 联系电话
  telephone: undefined,
  // 联系人姓名
  contactPersonName: undefined,
  // 科室名称
  deptName: undefined,
  // 职务
  jobName: undefined,
  // 邮箱
  email: undefined,
  // 实名认证信文件id
  realNameAuthFileId: undefined,
  // 医疗机构执业许可证扫描件id
  permitFileId: undefined,
})

const formFiles = reactive({
  realNameAuthFile: undefined,
  permitFile: undefined,
})

const options = reactive({
  province: [],
  city: [],
  district: [],
  hos: [],
  hosType: [],
  hosLevel: [],
  hosGrade: [],
})

const loadingFile1 = ref(false)
const loadingFile2 = ref(false)

const filterOption = (input, option) => {
  console.log(`input`, input)
  console.log(`option`, option)
  return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
}

onMounted(() => {
  getDict()
  getProvince()
})

// 获取省份
async function getProvince() {
  const res = await getSysAreas()
  console.log(`res`, res)
  options.province = res.result
}

async function handleProvinceChange() {
  const res = await getSysAreas({
    areaCode: applicationForm.provinceCode,
  })
  console.log(`res`, res)
  options.city = res.result
}
async function handleCityChange() {
  const res = await getSysAreas({
    areaCode: applicationForm.cityCode,
  })
  console.log(`res`, res)
  options.district = res.result
}
async function handleDistrictChange() {
  const res = await getHosOptionsByAreaCode({
    districtCode: applicationForm.districtCode,
  })
  console.log(`res`, res)
  options.hos = res.result
  options.hos = [
    {
      label: '111',
      value: '111',
    },
  ]
}
function handleHosChange() {}

// 获取其他数据字典
async function getDict() {
  const res = await getDictionarys([
    {
      key: 'hosType', //机构类别
      groupId: 'df04913fa4744302b327ee11f723a4a0',
    },
    {
      key: 'hosLevel', //医院等级
      groupId: '653a2212b372475c9a1f6f04bf273b86',
    },
    {
      key: 'hosGrade', //医院等次
      groupId: '7e1e0948b86f467e926a14c11df17748',
    },
  ])
  console.log(`res`, res)
  options.hosType = res.result.hosType
  options.hosLevel = res.result.hosLevel
  options.hosGrade = res.result.hosGrade
}
function onSelect() {
  console.log(`1111`, 1111)
}
function onSearch(searchText) {
  console.log(`searchText`, searchText)
  options.hos.unshift({
    value: searchText,
    label: searchText,
  })
}

function handleSearch(value) {
  handleChange(value)
}

function handleChange(value) {
  console.log(`value`, value)
  applicationForm.hosName = value != null && value != '' ? value : undefined
  console.log(`applicationForm.hosName`, applicationForm.hosName)
}

function handleBlur(value) {
  console.log(`1111111value`, value)
  // applicationForm.hosName = value
}

// 上传
async function handleFileUpload(e) {
  console.log(`e`, e)
  const file = e.target.files[0]
  if (!file) {
    return
  }
  loadingFile1.value = true
  console.log(`file`, file)
  // const { hosId } = JSON.parse(sessionStorage.getItem('deptObject'))
  const formData = new FormData()
  formData.append('file', file)
  formData.append('hosId', '51177dd37e2b4c39a5664ff3d13581fe')
  formData.append('service', 0)
  formData.append('useTo', 19)
  const res = await uploadFiles(formData)
  formFiles.realNameAuthFile = file
  loadingFile1.value = false
  applicationForm.realNameAuthFileId = res.result.fileId
  console.log(`window.g.VUE_APP_FILE_API + res.result.fileId`, window.g.VUE_APP_FILE_API + res.result.fileId)
}

async function handleFileUpload2(e) {
  console.log(`e`, e)
  const file = e.target.files[0]
  if (!file) {
    return
  }
  loadingFile1.value = true
  console.log(`file`, file)
  // const { hosId } = JSON.parse(sessionStorage.getItem('deptObject'))
  const formData = new FormData()
  formData.append('file', file)
  formData.append('hosId', '51177dd37e2b4c39a5664ff3d13581fe')
  formData.append('service', 0)
  formData.append('useTo', 20)
  const res = await uploadFiles(formData)
  formFiles.permitFile = file
  loadingFile1.value = false
  applicationForm.permitFileId = res.result.fileId
  console.log(`window.g.VUE_APP_FILE_API + res.result.fileId`, window.g.VUE_APP_FILE_API + res.result.fileId)
}

// 下载
function Download() {
  console.log(`Download`)
}

// 返回逻辑
const emit = defineEmits(['changePageStatus'])

function goBack() {
  emit('changePageStatus', 'login')
}
</script>

<style lang="scss" scoped>
.signUp {
  background-color: #f7f7f7;
  height: 100vh;
  :deep(.ant-select-selector) {
    width: 100%;
    border: none;
    box-shadow: 0 0 0 2px rgba(68, 106, 189, 0) !important;
  }
  :deep(.ant-descriptions-item-content) {
    padding: 0 10px;
  }
  :deep(.ant-input) {
    width: 100%;
    border: none;
    box-shadow: 0 0 0 2px rgba(68, 106, 189, 0) !important;
  }

  .ant-page-header {
    box-sizing: border-box;
    margin: 10px 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    padding: 6px 24px;
    background-color: #fff;
  }
  .signUp-title {
    background-color: #4468bd;
    height: 150px;
    width: 100%;
    position: relative;
    color: rgba(255, 255, 255, 1);
    font-size: 24px;
    text-align: left;
    padding: 20px;
  }
  .signUp-bg {
    background-color: #fff;
    position: absolute;
    top: 100px;
    width: calc(100% - 40px);
    border-radius: 4px;
    margin: 0 20px;
    .signUp-main {
      background-color: #fff;
      .signUp-main-header {
        position: relative;
        margin-bottom: 30px;
        .signUp-main-title {
          color: rgba(51, 51, 51, 1);
          font-size: 20px;
          text-align: center;
        }
        .signUp-main-subtitle {
          color: #919191;
          font-size: 12px;
          right: 20px;
          top: 30px;
          position: absolute;
        }
      }
      .signUp-main-descriptions {
        margin: 0 20px;
      }
      .signUp-main-btn {
        margin: 20px 0;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .btn {
          width: 160px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 3px;
          background-color: rgba(68, 104, 189, 1);
          color: rgba(255, 255, 255, 1);
          font-size: 14px;
          cursor: pointer;
        }
        .text {
          color: rgba(51, 51, 51, 1);
          font-size: 14px;
          margin-left: 20px;
        }
        .login {
          color: rgba(68, 104, 189, 1);
          font-size: 16px;
          cursor: pointer;
          margin-left: 10px;
        }
      }
    }
  }
  table,
  tbody {
    width: 100%;
  }
  td {
    border: 1px solid #dbdbdb;
    height: 60px;
    line-height: 60px;
  }
  .bg {
    background-color: #f7f7f7;
    color: #333;
    padding-left: 15px;
    font-size: 14px;
  }
  .custom-file-upload input[type='file'] {
    display: none;
  }

  // .custom-file-upload label {
  //   display: inline-block;
  //   cursor: pointer;
  //   border-radius: 4px;
  // }

  .upload-td {
    padding-left: 15px;
    display: flex;
    align-items: center;
    cursor: pointer;
    .text {
      color: rgba(145, 145, 145, 1);
      font-size: 14px;
      padding-left: 10px;
    }
  }
  .download-td {
    color: rgba(68, 104, 189, 1);
    font-size: 14px;
    // 下划线
    text-decoration: underline;
    cursor: pointer;
    padding-right: 24px;
  }
}
</style>
