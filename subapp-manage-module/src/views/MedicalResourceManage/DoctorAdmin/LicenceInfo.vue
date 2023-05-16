<template>
  <div class="licence-info">
    <el-form label-width="90px" :model="doctorDetail" :rules="rules" ref="elForm" :disabled="mode === 'check'">
      <div class="licence-item">
        <div class="title"><span class="required">*</span>实名认证</div>
        <el-row>
          <el-col :span="16">
            <el-form-item label="姓名" prop="name">
              <el-input dispbled v-model="doctorDetail.name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="身份证件" prop="identityNum">
              <el-input v-model="doctorDetail.identityNum" placeholder="请输入证件号" clearable maxlength="18" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="有效期限" prop="validateDate">
              <el-date-picker
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="有效期开始"
                end-placeholder="有效期至"
                range-separator="至"
                v-model="doctorDetail.validateDate"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="身份证照片" class="upload-item" prop="identityPic">
          <div class="img-container">
            <span class="upload-img-container" v-show="doctorDetail.identityFrontImageUrl">
              <img :src="doctorDetail.identityFrontImageUrl" alt="" height="68px" />
              <span class="img-actions">
                <i
                  class="el-icon el-icon-delete"
                  @click="deleleOneImage('identityFrontImageId', 'identityFrontImageUrl')"
                ></i>
              </span>
            </span>
            <el-upload
              action="#"
              :http-request="(file) => uploadFiles(file.file, 'identityFrontImageId', 'identityFrontImageUrl', 7)"
              :show-file-list="false"
              style="display: inline-block"
              accept="image/*"
              v-show="!doctorDetail.identityFrontImageUrl"
            >
              <div class="upload-container large">
                <i class="el-icon el-icon-plus"></i>
              </div>
            </el-upload>
            <div class="desc">正面</div>
          </div>

          <div class="img-container">
            <span class="upload-img-container" v-show="doctorDetail.identityBackImageUrl">
              <img :src="doctorDetail.identityBackImageUrl" alt="" height="68px" />
              <span class="img-actions">
                <i
                  class="el-icon el-icon-delete"
                  @click="deleleOneImage('identityBackImageId', 'identityBackImageUrl')"
                ></i>
              </span>
            </span>
            <el-upload
              action="#"
              :http-request="(file) => uploadFiles(file.file, 'identityBackImageId', 'identityBackImageUrl', 8)"
              :show-file-list="false"
              style="display: inline-block"
              accept="image/*"
              v-show="!doctorDetail.identityBackImageUrl"
            >
              <div class="upload-container large">
                <i class="el-icon el-icon-plus"></i>
              </div>
            </el-upload>
            <div class="desc">反面</div>
          </div>
          <span class="tips">（建议大小不超过500kb）</span>
        </el-form-item>
      </div>
      <div class="licence-item">
        <div class="title"><span class="required">*</span>资格证</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="证书编号" prop="certificateNum">
              <el-input v-model="doctorDetail.certificateNum" clearable maxlength="40" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签发日期" prop="certificateLssueDate">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                v-model="doctorDetail.certificateLssueDate"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="资格证照片" class="upload-item" prop="certificateImageId">
          <div class="img-container">
            <span class="upload-img-container" v-show="doctorDetail.certificateImageUrl">
              <img :src="doctorDetail.certificateImageUrl" alt="" height="68px" />
              <span class="img-actions">
                <i
                  class="el-icon el-icon-delete"
                  @click="deleleOneImage('certificateImageId', 'certificateImageUrl')"
                ></i>
              </span>
            </span>
            <el-upload
              action="#"
              :http-request="(file) => uploadFiles(file.file, 'certificateImageId', 'certificateImageUrl', 9)"
              :show-file-list="false"
              style="display: inline-block"
              accept="image/*"
              v-show="!doctorDetail.certificateImageUrl"
            >
              <div class="upload-container large">
                <i class="el-icon el-icon-plus"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </div>
      <div class="licence-item">
        <div class="title"><span class="required">*</span>执业证</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="证书编号" prop="practiceNum">
              <el-input v-model="doctorDetail.practiceNum" clearable maxlength="40" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签发日期" prop="practiceLssueDate">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                v-model="doctorDetail.practiceLssueDate"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="执业证照片" class="upload-item" prop="practiceImageId">
          <div class="img-container">
            <span class="upload-img-container" v-show="doctorDetail.practiceImageUrl">
              <img :src="doctorDetail.practiceImageUrl" alt="" height="68px" />
              <span class="img-actions">
                <i class="el-icon el-icon-delete" @click="deleleOneImage('practiceImageId', 'practiceImageUrl')"></i>
              </span>
            </span>
            <el-upload
              action="#"
              :http-request="(file) => uploadFiles(file.file, 'practiceImageId', 'practiceImageUrl', 10)"
              :show-file-list="false"
              style="display: inline-block"
              accept="image/*"
              v-show="!doctorDetail.practiceImageUrl"
            >
              <div class="upload-container large">
                <i class="el-icon el-icon-plus"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </div>
      <div class="licence-item">
        <div class="title"><span class="required">*</span>职称证</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="职称等级" prop="titleLevelCode">
              <el-select v-model="doctorDetail.titleLevelCode" clearable>
                <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in titleLevelList" :key="item.VALUE" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签发日期" prop="titleLssueDate">
              <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="doctorDetail.titleLssueDate" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="职称证照片" class="upload-item" prop="titleImageId">
          <div class="img-container">
            <span class="upload-img-container" v-show="doctorDetail.titleImageUrl">
              <img :src="doctorDetail.titleImageUrl" alt="" height="68px" />
              <span class="img-actions">
                <i class="el-icon el-icon-delete" @click="deleleOneImage('titleImageId', 'titleImageUrl')"></i>
              </span>
            </span>
            <el-upload
              action="#"
              :http-request="(file) => uploadFiles(file.file, 'titleImageId', 'titleImageUrl', 11)"
              :show-file-list="false"
              style="display: inline-block"
              accept="image/*"
              v-show="!doctorDetail.titleImageUrl"
            >
              <div class="upload-container large">
                <i class="el-icon el-icon-plus"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div class="btn-actions">
      <el-button type="primary" @click="saveDoctorLicenceInfo">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getDictionary, saveDoctorLicenceInfo, uploadFiles } from '@/api/modules/systemAdmin'

export default {
  props: {
    doctorDetail: Object,
    mode: String,
    acceptImage: Array,
  },
  data() {
    // 校验必填
    const requiredValidate = (rule, value, callback) => {
      if (!value || (value.trim && !value.trim())) {
        callback(new Error())
      } else {
        callback()
      }
    }
    // 校验身份证
    const identityPicValidate = (rule, value, callback) => {
      if (!this.doctorDetail.identityFrontImageId || !this.doctorDetail.identityBackImageId) {
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      titleLevelList: [],
      rules: {
        name: [{ validator: requiredValidate, message: '请输入姓名', trigger: 'blur' }],
        identityNum: [{ validator: requiredValidate, message: '请输入证件号', trigger: 'blur' }],
        validateDate: [{ validator: requiredValidate, message: '请选择证件有效期', trigger: 'blur' }],
        identityPic: [{ validator: identityPicValidate, message: '请完善身份证照片', trigger: 'change' }],
        certificateNum: [{ validator: requiredValidate, message: '请输入证书编号', trigger: 'blur' }],
        certificateLssueDate: [{ validator: requiredValidate, message: '请选择签发日期', trigger: 'blur' }],
        certificateImageId: [{ validator: requiredValidate, message: '请上传资格证照片', trigger: 'change' }],
        practiceNum: [{ validator: requiredValidate, message: '请输入证书编号', trigger: 'blur' }],
        practiceLssueDate: [{ validator: requiredValidate, message: '请选择签发日期', trigger: 'blur' }],
        practiceImageId: [{ validator: requiredValidate, message: '请上传职业证照片', trigger: 'change' }],
        titleLevelCode: [{ validator: requiredValidate, message: '请输入证书编号', trigger: 'change' }],
        titleLssueDate: [{ validator: requiredValidate, message: '请选择签发日期', trigger: 'blur' }],
        titleImageId: [{ validator: requiredValidate, message: '请上传职称证照片', trigger: 'change' }],
      },
    }
  },
  mounted() {
    this.$set(this.doctorDetail, 'validateDate', [
      this.doctorDetail.identityStart || '',
      this.doctorDetail.identityEnd || '',
    ])
    this.getDictionary()
  },
  methods: {
    async getDictionary() {
      try {
        const res = await getDictionary({ code: 'TITLE_LEVEL' })
        console.log('getTitleLevelList==', res)
        this.titleLevelList = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async saveDoctorLicenceInfo() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          try {
            const res = await saveDoctorLicenceInfo({
              ...this.doctorDetail,
              identityStart: this.doctorDetail.validateDate ? this.doctorDetail.validateDate[0] || '' : '',
              identityEnd: this.doctorDetail.validateDate ? this.doctorDetail.validateDate[1] || '' : '',
            })
            this.$message.success('资质信息保存成功')
            console.log('saveDoctorLicenceInfo==', res)
          } catch (err) {
            console.error(err)
          }
        }
      })
    },
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
        console.log('uploadFiles==', res)
        if (Array.isArray(this.doctorDetail[idField])) {
          this.doctorDetail[idField].push(res.result.id)
          this.doctorDetail[imgUrlField].push({ filePath: window.g.VUE_APP_FILE_API + res.result.fileId, })
        } else {
          this.$set(this.doctorDetail, idField, res.result.id)
          this.$set(this.doctorDetail, imgUrlField, window.g.VUE_APP_FILE_API + res.result.fileId,)
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 单张图片删除
    deleleOneImage(idField, imgUrlField) {
      this.doctorDetail[idField] = ''
      this.doctorDetail[imgUrlField] = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.licence-info {
  background: #fff;
  padding-bottom: 30px;
  .licence-item {
    .upload-img-container {
      display: inline-block;
      vertical-align: middle;
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
    .desc {
      text-align: center;
    }
    .title {
      font-size: 16px;
      line-height: 16px;
      position: relative;
      padding: 18px 15px;
      &:before {
        content: ' ';
        display: inline-block;
        position: absolute;
        width: 3px;
        height: 16px;
        background: #134796;
        left: 0;
      }
      .required {
        color: red;
        font-size: 14px;
      }
    }
    .upload-item {
      ::v-deep.el-form-item__content {
        display: flex;
      }
      .upload-container {
        margin-right: 20px;
        width: 34px;
        height: 34px;
        font-size: 18px;
        line-height: 34px;
        text-align: center;
        border: 1px solid #d9d9d9;
        &.large {
          width: 68px;
          height: 68px;
          font-size: 36px;
          line-height: 68px;
        }
      }
      .tips {
        fon-size: 12px;
        color: #919191;
      }
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
  ::v-deep {
    .el-date-editor {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
