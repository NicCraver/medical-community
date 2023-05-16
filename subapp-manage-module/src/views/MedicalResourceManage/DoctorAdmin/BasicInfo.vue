<template>
  <div class="basic-info">
    <el-form :model="doctorDetail" :rules="rules" label-width="100px" ref="elForm" :disabled="mode === 'check'">
      <el-form-item label="医生ID" v-if="mode !== 'add'">
        <el-input disabled v-model="doctorDetail.doctorCode" />
      </el-form-item>
      <el-form-item label="所属集团" prop="orgCode">
        <GroupSelect v-model="doctorDetail.orgCode" class="block-select"></GroupSelect>
      </el-form-item>
      <el-form-item label="在职医院" prop="hosCode">
        <HospitalSelect
          branchFlg
          v-model="doctorDetail.hosCode"
          :groupId="doctorDetail.orgCode"
          class="block-select"
          @change="resetDeptTree"
        ></HospitalSelect>
      </el-form-item>
      <el-form-item label="在职科室" prop="departMent">
        <el-select v-model="doctorDetail.departMentType" placeholder="科室类型" @change="resetDeptTree" clearable>
          <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in deptTypeList" :key="item.VALUE" />
        </el-select>
        <el-cascader
          placeholder="一级科室/二级科室/三级科室"
          v-model="doctorDetail.deptIds"
          :options="deptTreeData"
          style="margin-left: 15px"
          clearable
        />
      </el-form-item>
      <el-form-item label="类型-职称" prop="professional">
        <el-select v-model="doctorDetail.titleType" placeholder="类型" @change="handleProfessionalTypeChange">
          <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in professionalTypeList" :key="item.VALUE" />
        </el-select>
        <el-select v-model="doctorDetail.titleCode" placeholder="职称" style="margin-left: 15px">
          <el-option :label="item.titleDetailName" :value="item.id" v-for="item in professionalList" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="请输入姓名" v-model="doctorDetail.name" clearable />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="doctorDetail.sex" placeholder="请选择性别" class="block-select" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input placeholder="请输入年龄" v-model="doctorDetail.age" clearable />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input placeholder="请输入身份证号" v-model="doctorDetail.identityNum" clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input placeholder="请输入手机号" maxlength="11" v-model="doctorDetail.phone" @input="onCheckSamePhone"/>
      </el-form-item>
      <el-form-item label="照片">
        <div class="img-container">
          <div class="title">主图<span class="tips">（建议尺寸为800像素*400像素，大小不超过500kb）</span></div>
          <span class="upload-img-container" v-show="doctorDetail.mainImageUrl">
            <img :src="doctorDetail.mainImageUrl" alt="" height="68px" />
            <span class="img-actions">
              <i class="el-icon el-icon-delete" @click="deleleOneImage('mainImageId', 'mainImageUrl')"></i>
            </span>
          </span>
          <el-upload
            action="#"
            :http-request="(file) => uploadFiles(file.file, 'mainImageId', 'mainImageUrl', 5)"
            :show-file-list="false"
            style="display: inline-block"
            accept="image/*"
            v-show="!doctorDetail.mainImageUrl"
          >
            <div class="upload-container large">
              <i class="el-icon el-icon-plus"></i>
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="擅长">
        <el-input
          placeholder="请输入"
          v-model="doctorDetail.hobby"
          type="textarea"
          :rows="3"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input
          placeholder="请输入"
          v-model="doctorDetail.personalProfile"
          type="textarea"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="电子签名">
        <div class="img-container">
          <span class="upload-img-container" v-show="doctorDetail.eSignatureImageUrl">
            <img :src="doctorDetail.eSignatureImageUrl" alt="" height="68px" />
            <span class="img-actions">
              <i class="el-icon el-icon-delete" @click="deleleOneImage('eSignatureImageId', 'eSignatureImageUrl')"></i>
            </span>
          </span>
          <el-upload
            action="#"
            :http-request="(file) => uploadFiles(file.file, 'eSignatureImageId', 'eSignatureImageUrl', 6)"
            :show-file-list="false"
            style="display: inline-block"
            accept="image/*"
            v-show="!doctorDetail.eSignatureImageUrl"
          >
            <div class="upload-container large">
              <i class="el-icon el-icon-plus"></i>
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="医生状态" prop="status">
        <el-switch v-model="doctorDetail.status" active-text="开启" inactive-text="停用" />
      </el-form-item>
    </el-form>
    <div class="btn-actions">
      <el-button type="primary" @click="saveMedicalPersonBasicInfo">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getOrgOrHosOptions,
  getDeptTree,
  getDictionary,
  uploadFiles,
  getTitleInfoByCode,
  addMedicalPersonBasicInfo,
  updateMedicalPersonBasicInfo,
  checkSamePhone
} from '@/api/modules/systemAdmin'
import GroupSelect from '@/components/GroupAndHospital/GroupSelect'
import HospitalSelect from '@/components/GroupAndHospital/HospitalSelect'
import { phoneRegValidate } from '@/utils/reg-validate'

export default {
  props: {
    doctorDetail: Object,
    mode: String,
    acceptImage: Array,
  },
  data() {
    // 在职科室组合校验
    const departMentValidate = (rule, value, callback) => {
      if (!this.doctorDetail.departMentType || !this.doctorDetail.deptIds || !this.doctorDetail.deptIds.length) {
        callback(new Error('请完善在职科室'))
      } else {
        callback()
      }
    }
    // 职称组合校验
    const professionalValidate = (rule, value, callback) => {
      if (!this.doctorDetail.titleType || !this.doctorDetail.titleCode) {
        callback(new Error('请完善类型-职称'))
      } else {
        callback()
      }
    }
    return {
      orgOptionsList: [],
      hospitalList: [],
      deptTypeList: [],
      professionalTypeList: [],
      professionalList: [],
      rules: {
        orgCode: [{ required: true, message: '请选择所属集团', trigger: 'blur' }],
        hosCode: [{ required: true, message: '请选择在职医院', trigger: 'blur' }],
        departMent: [{ required: true, validator: departMentValidate, trigger: 'blur' }],
        professional: [{ required: true, validator: professionalValidate, trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: phoneRegValidate,
            message: '请输入正确的手机号',
            trigger: 'blur',
          },
        ],
        status: [{ required: true, message: '', trigger: 'blur' }],
      },
      deptTreeData: []
    }
  },
  async mounted() {
    this.getDictionary('DEPT_CLASSIFY', 'deptTypeList')
    this.getDictionary('TITLE_TYPE', 'professionalTypeList')
    if (this.mode !== 'add') {
      this.getDeptTree()
      this.getTitleInfoByCode()
    }
  },
  methods: {
    // 字典
    async getDictionary(code, listType) {
      try {
        const res = await getDictionary({ code })
        console.log('getDictionary==', res)
        this[listType] = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 科室级联树
    async getDeptTree() {
      if (!this.doctorDetail.hosCode || !this.doctorDetail.departMentType) {
        return
      }
      try {
        const res = await getDeptTree({
          hosId: this.doctorDetail.hosCode,
          deptType: this.doctorDetail.departMentType,
          status: this.mode === 'add' ? 'Y' : '',
        })
        console.log('getDeptTree==', res)
        this.deptTreeData = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 医院或者科室类型发生改变重置科室下拉内容
    resetDeptTree() {
      this.$set(this.doctorDetail, 'deptIds', [])
      this.getDeptTree()
    },

    // 根据职称类型获取职称
    async getTitleInfoByCode() {
      try {
        const res = await getTitleInfoByCode({
          parentId: this.doctorDetail.titleType,
        })
        console.log('getTitleInfoByCode==', res)
        this.professionalList = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 职称类型改变
    handleProfessionalTypeChange() {
      this.$set(this.doctorDetail, 'titleCode', '')
      this.getTitleInfoByCode()
    },
    async uploadFiles(file, idField, imgUrlField, useTo) {
      console.log(`imgUrlField`, imgUrlField)
      console.log(` this.doctorDetail[imgUrlField]`, this.doctorDetail[imgUrlField])
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
        if (Array.isArray(this.doctorDetail[idField])) {
          this.doctorDetail[idField].push(res.result.id)
          this.doctorDetail[imgUrlField].push({
            filePath: window.g.VUE_APP_FILE_API + res.result.fileId,
            id: res.result.id,
          })
        } else {
          this.doctorDetail[idField] = res.result.id
          this.doctorDetail[imgUrlField] = window.g.VUE_APP_FILE_API + res.result.fileId
        }
      } catch (err) {
        console.error(err)
      }
    },
    saveMedicalPersonBasicInfo() {
      this.$refs.elForm.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.doctorDetail,
            departMentCode: this.doctorDetail.deptIds[this.doctorDetail.deptIds.length - 1],
            status: this.doctorDetail.status ? '1' : '0',
          }
          try {
            const res =
              this.mode === 'add' ? await addMedicalPersonBasicInfo(params) : await updateMedicalPersonBasicInfo(params)
            const message = this.mode === 'add' ? '添加医务人员基本信息成功' : '更新医务人员基本信息成功'
            console.log('saveMedicalPersonBasicInfo==', res)
            if (res.code === 0) {
              this.$message.success(message)
              if (this.mode === 'add') {
                this.$emit('saveBasicInfoSuccess', res.result)
              }
            }
          } catch (err) {
            console.error(err)
          }
        }
      })
    },
    // 单张图片删除
    deleleOneImage(idField, imgUrlField) {
      this.doctorDetail[idField] = ''
      this.doctorDetail[imgUrlField] = ''
    },
    async onCheckSamePhone(){
      console.log(this.doctorDetail.phone)
      if(this.mode == 'add' && this.doctorDetail.phone.length == 11){
        try {
          const res = await checkSamePhone({
            orgId: this.doctorDetail.orgCode,
            phoneNo: this.doctorDetail.phone,
          })
          console.log('checkSamePhone==', res)
          if(res.result.haveSameUserFlg){
            // 有相同的手机号
            if(res.result.needBind){
              // 需要绑定
              this.$confirm(res.result.message, '提示', {
                confirmButtonText: '绑定',
                cancelButtonText: '返回',
                type: 'warning'
              }).then(() => {
                // this.mode = 'edit';
                this.$emit('bindUserId', res.result.userId)
                this.doctorDetail.userId = res.result.userId
                console.log(res.result.userId)
              }).catch(() => {
                         
              });
            }else{
              this.$message.error(res.result.message)
            }
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
  },
  components: {
    GroupSelect,
    HospitalSelect,
  },
}
</script>

<style lang="scss" scoped>
.basic-info {
  padding: 24px;
  background: #fff;
  .upload-container {
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
    height: 200px;
    background: red;
    margin: 10px 0;
  }
  .editor {
    height: 236px;
    border: 1px solid #ccc;
    margin-bottom: 22px;
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
}
</style>
