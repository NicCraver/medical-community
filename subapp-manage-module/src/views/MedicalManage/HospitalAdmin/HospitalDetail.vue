<template>
  <div class="hospital-detail">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0" overflow>
      <template #title>医院详情</template>
      <template #tab>
        <el-tabs v-model="activeHospitalName" @tab-click="handleTabChange">
          <el-tab-pane v-for="item in tabDatas" :key="item.name" :name="item.name" :label="item.name"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <div class="hospital-info">
          <el-form :model="hospitalInfo" :rules="rules" label-width="110px" ref="elForm" :disabled="mode === 'check'">
            <el-form-item label="医院Logo" v-if="activeHospital.type === 'main'">
              <span class="upload-img-container" v-show="hospitalInfo.logoUrl" style="margin-top: 0">
                <img :src="hospitalInfo.logoUrl" alt="" height="68px" />
                <span class="img-actions">
                  <i class="el-icon el-icon-delete" @click="deleleOneImage('logoId', 'logoUrl')"></i>
                </span>
              </span>
              <el-upload
                action="#"
                :http-request="(file) => uploadFiles(file.file, 'logoId', 'logoUrl', 0)"
                :show-file-list="false"
                style="display: inline-block"
                v-show="!hospitalInfo.logoUrl"
                accept="image/*"
              >
                <div class="upload-container large" slot="default">
                  <i class="el-icon el-icon-plus"></i>
                </div>
              </el-upload>
            </el-form-item>
            <el-button type="primary" v-else size="small" style="margin-bottom: 15px" @click="branchHosVis = true"
              >添加分院</el-button
            >
            <el-form-item label="机构ID" v-if="activeHospital.type === 'main'">
              <el-input v-model="hospitalInfo.code" disabled />
            </el-form-item>
            <el-form-item :label="activeHospital.type === 'main' ? '医院名称' : '分院名称'" prop="name">
              <el-input v-model="hospitalInfo.name" disabled />
            </el-form-item>

            <el-form-item label="组织机构代码" v-if="activeHospital.type === 'main'" prop="organizationCode">
              <el-input v-model="hospitalInfo.organizationCode" clearable maxlength="100" />
            </el-form-item>
            <el-form-item label="医院类型" prop="orgType">
              <el-select v-model="hospitalInfo.orgType" class="block-select" clearable>
                <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in hospitalLypeList" :key="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="医院等级" prop="hosLevel">
              <el-select v-model="hospitalInfo.hosLevel" class="block-select" clearable>
                <el-option
                  :label="item.LABLE"
                  :value="item.VALUE"
                  v-for="item in hospitalLevelList"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input placeholder="区号+电话号码" v-model="hospitalInfo.telephone" maxlength="20" />
            </el-form-item>
            <el-form-item label="办公时间">
              <el-select v-model="hospitalInfo.officeHours" clearable @change="handleOfficeHoursChange">
                <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in officeHoursList" :key="item.VALUE" />
              </el-select>
              <el-form-item label="" style="display: inline-block" prop="officeTime">
                <el-time-picker
                  is-range
                  v-model="hospitalInfo.officeTime"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="办公时间"
                  style="margin-left: 15px; vertical-align: middle; margin-top: -4px"
                  format="HH:mm"
                  value-format="HH:mm"
                >
                </el-time-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="医院网址">
              <el-input placeholder="请输入医院官网，例如：https://www.baidu.com" v-model="hospitalInfo.hosUrl" />
            </el-form-item>
            <el-form-item label="医院图片">
              <div class="img-container">
                <div class="title">主图<span class="tips">（建议尺寸为800像素*400像素，大小不超过500kb）</span></div>
                <span class="upload-img-container" v-show="hospitalInfo.hosImageUrl" style="margin-top: 0">
                  <img :src="hospitalInfo.hosImageUrl" alt="" height="68px" />
                  <span class="img-actions">
                    <i class="el-icon el-icon-delete" @click="deleleOneImage('hosImageId', 'hosImageUrl')"></i>
                  </span>
                </span>
                <el-upload
                  action="#"
                  :http-request="(file) => uploadFiles(file.file, 'hosImageId', 'hosImageUrl', 1)"
                  :show-file-list="false"
                  style="display: inline-block"
                  v-show="!hospitalInfo.hosImageUrl"
                  accept="image/*"
                >
                  <div class="upload-container large">
                    <i class="el-icon el-icon-plus"></i>
                  </div>
                </el-upload>
              </div>
              <div class="img-container">
                <div class="title">
                  其他图片<span class="tips">（选传，建议尺寸为800像素*400像素，最多5张，大小不超过500kb）</span>
                </div>
                <span
                  class="upload-img-container"
                  v-for="(item, index) in hospitalInfo.otherImages"
                  :key="item.filePath"
                >
                  <span class="img-actions">
                    <i class="el-icon el-icon-delete" @click="deleteOtherImages(item, index)"></i>
                  </span>
                  <img :src="item.filePath" alt="" height="68px" />
                </span>
                <div class="upload-container large inline-block" @click="$refs.fileInput.click()">
                  <i class="el-icon el-icon-plus"></i>
                </div>
                <input
                  type="file"
                  multiple
                  @change="handleChangeFileChange"
                  ref="fileInput"
                  style="display: none"
                  :disabled="mode === 'check'"
                  accept="image/*"
                />
              </div>
            </el-form-item>
            <el-form-item label="医院地址" prop="addressText">
              <div class="map">
                <MapContainer
                  :address="hospitalInfo.address"
                  :center="[hospitalInfo.longitude, hospitalInfo.latitude]"
                  @location-change="handleLocationChange"
                ></MapContainer>
              </div>
              <el-input placeholder="交通路线说明" v-model="hospitalInfo.busLine" />
            </el-form-item>
            <div class="tab-container">
              <span class="required">*</span>
              <el-tabs v-model="activeTab">
                <el-tab-pane name="医院介绍" label="医院介绍"></el-tab-pane>
                <el-tab-pane name="预约须知" label="预约须知"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="editor" id="hos-entroduce-editor" v-show="activeTab === '医院介绍'"></div>
            <div class="editor" id="reservation-notice-editor" v-show="activeTab === '预约须知'"></div>
            <span class="entroduce-tips" v-show="entroduceTipsShowFlag">请输入医院介绍</span>
            <el-form-item label="是否添加分院" v-show="activeHospital.type === 'main'">
              <el-radio-group v-model="isAddBranch">
                <el-radio label="N">否</el-radio>
                <el-radio label="Y">是</el-radio>
              </el-radio-group>
              <el-button
                type="primary"
                size="small"
                style="margin-left: 15px"
                @click="branchHosVis = true"
                v-show="isAddBranch === 'Y'"
                >添加分院</el-button
              >
            </el-form-item>
            <el-form-item :label="activeHospital.type === 'main' ? '医院状态' : '分院状态'" prop="status">
              <el-switch v-model="hospitalInfo.status" active-text="开启" inactive-text="停用" />
              <span class="tips left" v-show="activeHospital.type === 'main'"
                >（开启主院状态，会自动默认开启分院状态，如需关闭分院请前往分院详情页面）</span
              >
            </el-form-item>
          </el-form>
          <div class="btn-actions">
            <el-button type="primary" @click="saveHospitalInfo" v-if="mode !== 'check'">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </div>
        </div>
      </template>
    </ProLayout>
    <AddBranchHos
      :visible="branchHosVis"
      :hospitalLypeList="hospitalLypeList"
      :hospitalLevelList="hospitalLevelList"
      :beforeClose="() => (branchHosVis = false)"
      :parentHosName="parentHosName"
      @add-branch-success="(branch) => tabDatas.push(branch)"
    />
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import AddBranchHos from './AddBranchHos'
import MapContainer from '@/components/MapContainer'
import E from 'wangeditor'
import { getHospitalDetail, uploadFiles, getDictionary, saveHospitalInfo } from '@/api/modules/systemAdmin'

export default {
  data() {
    // 医院地址校验
    const addressTextValidate = (rule, value, callback) => {
      if (!this.hospitalInfo.address.trim() || !this.hospitalInfo.busLine.trim()) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      mode: '',
      hospitalId: '',
      activeHospital: {},
      activeHospitalName: '',
      tabDatas: [{ name: '基本信息' }],
      parentHosName: '',
      hospitalLypeList: [],
      hospitalLevelList: [],
      officeHoursList: [],
      hospitalInfo: {},
      rules: {
        name: [{ required: true, message: '请输入医院名称', trigger: 'blur' }],
        organizationCode: [{ required: true, message: '请输入组织机构代码', trigger: 'blur' }],
        orgType: [{ required: true, message: '请选择医院类型', trigger: 'blur' }],
        hosLevel: [{ required: true, message: '请选择医院等级', trigger: 'blur' }],
        addressText: [{ required: true, validator: addressTextValidate, message: '请完善医院地址', trigger: 'blur' }],
        status: [{ required: true, message: '', trigger: 'blur' }],
      },
      officeTimeRule: [{ required: true, message: '请填写工作时间', trigger: 'blur' }],
      activeTab: '医院介绍',
      entroduceTipsShowFlag: false,
      branchHosVis: false,
      hosIntroduceEditor: null,
      reservationNoticeEditor: null,
      isAddBranch: 'N',
      acceptImage: ['image/jpeg', 'image/png'],
    }
  },
  async mounted() {
    this.hospitalId = this.$route.query.id
    this.mode = this.$route.query.mode
    this.tabDatas = [{ name: '基本信息', type: 'main', id: this.hospitalId }]
    this.activeHospital = this.tabDatas[0]
    this.activeHospitalName = this.activeHospital.name

    this.initEditor()
    this.getHospitalDetail('firstInitial')
    await this.getDictionary('HOSPITAL_TYPE', 'hospitalLypeList')
    await this.getDictionary('HOSPITAL_LEVEL', 'hospitalLevelList')
    await this.getDictionary('HOSPITAL_OFFICE_HOURS', 'officeHoursList')
  },
  methods: {
    // 获取字典数据
    async getDictionary(code, listType) {
      try {
        const res = await getDictionary({ code: code })
        console.log('getDictionary==', res)
        this[listType] = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 初始化富文本编辑器
    initEditor() {
      this.hosIntroduceEditor = new E('#hos-entroduce-editor')
      this.hosIntroduceEditor.config.height = 196
      this.hosIntroduceEditor.config.zIndex = 100
      this.hosIntroduceEditor.create()

      this.reservationNoticeEditor = new E('#reservation-notice-editor')
      this.reservationNoticeEditor.config.height = 196
      this.reservationNoticeEditor.config.zIndex = 100
      this.reservationNoticeEditor.create()

      if (this.mode === 'check') {
        this.hosIntroduceEditor.disable()
        this.reservationNoticeEditor.disable()
      }
    },

    // 获取医院信息
    async getHospitalDetail(type) {
      try {
        const res = await getHospitalDetail({ hosId: this.hospitalId, fileBaseUrl: window.g.VUE_APP_FILE_API })
        console.log('getHospitalDetail==', res)
        this.hospitalInfo = res.result
        this.hospitalInfo.status = this.hospitalInfo.status === 'Y'
        console.log('this.hospitalInfo.officeTime==', this.hospitalInfo.officeTime)
        // this.hospitalInfo.officeTime = this.hospitalInfo.officeTime.length ? this.hospitalInfo.officeTime : [new Date(2016, 9, 10, 18, 40), new Date(2016, 9, 10, 18, 40)];

        // 设置富文本编辑器内容
        this.hosIntroduceEditor.txt.html(this.hospitalInfo.hosIntroduce)
        this.reservationNoticeEditor.txt.html(this.hospitalInfo.reservationNotice)

        if (type === 'firstInitial') {
          const branchHos = res.result.branchHos
            ? res.result.branchHos.map((item) => ({
                ...item,
                type: 'branch',
              }))
            : []
          this.tabDatas = this.tabDatas.concat(branchHos)
          this.parentHosName = res.result.name
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 自定义文件上传处理
    handleChangeFileChange(e) {
      const files = e.target.files
      if (this.hospitalInfo.otherHosImageIds.length + files.length > 5) {
        this.$message.warning('最多上传5张图片')
        return
      }
      for (let i = 0; i < files.length; i++) {
        console.log(files[i])
        if (files[i].size > 500 * 1024) {
          this.$message.warning('图片大于500kb')
          return
        }
        if (!this.acceptImage.includes(files[i].type)) {
          this.$message.warning('文件格式不正确')
          return
        }
      }
      for (let i = 0; i < files.length; i++) {
        this.uploadFiles(files[i], 'otherHosImageIds', 'otherImages', 2)
      }
      e.target.value = ''
    },

    // 上传图片
    async uploadFiles(file, idField, imgUrlField, useTo) {
      console.log('file==', file)
      if (file.size > 500 * 1024) {
        this.$message.warning('图片大于500kb')
        return
      }
      if (!this.acceptImage.includes(file.type)) {
        this.$message.warning('文件格式不正确')
        return
      }
      try {
        const { hosId } = JSON.parse(sessionStorage.getItem('deptObject'))
        const formData = new FormData()
        formData.append('file', file)
        formData.append('hosId', hosId)
        formData.append('service', 0)
        formData.append('useTo', useTo)
        const res = await uploadFiles(formData)
        console.log('this.hospitalInfo[idField]', idField)
        if (Array.isArray(this.hospitalInfo[idField])) {
          this.hospitalInfo[idField].push(res.result.id)
          this.hospitalInfo[imgUrlField].push({
            filePath: window.g.VUE_APP_FILE_API + res.result.fileId,
            fileId: res.result.id,
          })
        } else {
          this.hospitalInfo[idField] = res.result.id
          this.hospitalInfo[imgUrlField] = window.g.VUE_APP_FILE_API + res.result.fileId
          console.log(this.hospitalInfo.logoUrl)
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 单张图片删除
    deleleOneImage(idField, imgUrlField) {
      this.hospitalInfo[idField] = ''
      this.hospitalInfo[imgUrlField] = ''
    },

    // 多张图片删除
    deleteOtherImages(img, index) {
      const idIndex = this.hospitalInfo.otherHosImageIds.findIndex((item) => item === img.fileId)
      console.log(this.hospitalInfo.otherHosImageIds, img.fileId)
      if (idIndex !== -1) {
        this.hospitalInfo.otherImages.splice(index, 1)
        this.hospitalInfo.otherHosImageIds.splice(index, 1)
      }
    },

    // 医院位置变化
    handleLocationChange(location) {
      console.log('location', location)
      this.hospitalInfo.address = location.address
      this.hospitalInfo.latitude = location.lat
      this.hospitalInfo.longitude = location.lng
    },

    // 保存提交
    async saveHospitalInfo() {
      this.entroduceTipsShowFlag = !this.hosIntroduceEditor.txt.html()
      this.$refs.elForm.validate(async (valid) => {
        if (valid && !this.entroduceTipsShowFlag) {
          const params = {
            ...this.hospitalInfo,
            hosIntroduce: this.hosIntroduceEditor.txt.html(),
            reservationNotice: this.reservationNoticeEditor.txt.html(),
            status: this.hospitalInfo.status ? 'Y' : 'N',
            hosType: this.hospitalInfo.orgType,
            officeTime: this.hospitalInfo.officeTime ? this.hospitalInfo.officeTime : [],
          }
          try {
            const res = await saveHospitalInfo(params)
            console.log('saveHospitalInfo==', res)
            this.$message.success('医院信息修改成功!')
          } catch (err) {
            console.error(err)
          }
        }
      })
    },

    handleTabChange(tab) {
      this.activeHospital = this.tabDatas.find((item) => item.name === this.activeHospitalName)
      this.hospitalId = this.activeHospital.id
      this.getHospitalDetail()
    },
    handleOfficeHoursChange(val) {
      this.$refs.elForm.clearValidate('officeTime')
      if (val) {
        this.hospitalInfo.officeTime = [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)]
        this.rules.officeTime = this.officeTimeRule
      } else {
        this.hospitalInfo.officeTime = []
        delete this.rules.officeTime
        this.$refs.elForm.clearValidate('officeTime')
      }
    },
  },
  components: {
    ProLayout,
    AddBranchHos,
    MapContainer,
  },
}
</script>

<style lang="scss" scoped>
.hospital-detail {
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 !important;
  }
  .el-tabs__nav,
  .el-tabs__nav-scroll {
    background-color: #fff !important;
  }
  .el-tabs__item.is-top.is-active {
    border-bottom: none !important;
  }
  .el-tabs__item.is-active {
    color: #134796 !important;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #949da3 !important;
  }
  .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: #134796 !important;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    border-radius: 4px !important;
  }
  .el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
  }
  .hospital-info {
    padding: 24px;
    background: #fff;
    .upload-container {
      width: 34px;
      height: 34px;
      font-size: 18px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #d9d9d9;
      &.inline-block {
        cursor: pointer;
        display: inline-block;
      }
      &.large {
        width: 68px;
        height: 68px;
        font-size: 36px;
        line-height: 68px;
      }
    }
    .upload-img-container {
      display: inline-block;
      vertical-align: middle;
      margin-top: -20px;
      margin-right: 10px;
      border: 1px solid #ccc;
      height: 68px;
      position: relative;
      .img-actions {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        line-height: 68px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
      }
    }
    .tips {
      font-size: 12px;
      color: #919191;
      &.left {
        margin-left: 10px;
      }
    }
    .img-container {
      &:first-child {
        margin-bottom: 10px;
      }
    }
    .address-input {
      width: 500px;
    }
    .map {
      height: 350px;
      margin-bottom: 10px;
    }
    .editor {
      height: 236px;
      border: 1px solid #ccc;
      margin-bottom: 22px;
      margin-left: 16px;
      ::v-deep > div {
        z-index: 0 !important;
      }
    }
    .btn-actions {
      position: fixed;
      z-index: 100;
      background-color: #fff;
      border-top: 1px solid #f5f5f5;
      left: 208px;
      right: 0;
      bottom: 0;
      padding: 10px 24px;
      text-align: right;
    }
    .block-select {
      width: 100%;
    }
    .tab-container {
      display: flex;
      align-items: center;
      .required {
        display: inline-block;
        height: 40px;
        line-height: 32px;
        margin-right: 6px;
        color: red;
        width: 10px;
      }
      ::v-deep .el-tabs {
        flex: 1;
      }
    }
    .entroduce-tips {
      color: red;
      margin-left: 16px;
      margin-bottom: 22px;
    }
  }
}
</style>
