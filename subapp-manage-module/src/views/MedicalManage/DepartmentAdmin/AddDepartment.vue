<template>
  <div class="department-detail">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0" overflow>
      <template #title>{{ pageTitle }}</template>
      <template #main>
        <div class="department-info">
          <el-form :model="departmentInfo" :rules="rules" label-width="110px" ref="elForm" :disabled="mode === 'check'">
            <el-form-item label="科室ID" v-if="mode !== 'add'">
              <el-input disabled v-model="departmentInfo.code" />
            </el-form-item>
            <el-form-item label="所属集团" prop="orgId">
              <GroupSelect v-model="departmentInfo.orgId" class="block-select"></GroupSelect>
            </el-form-item>
            <el-form-item label="机构名称" prop="hosId">
              <HospitalSelect
                branchFlg
                v-model="departmentInfo.hosId"
                :groupId="departmentInfo.orgId"
                class="block-select"
                :disabled="mode === 'edit'"
              ></HospitalSelect>
            </el-form-item>
            <el-form-item label="科室类型" prop="deptType">
              <el-select
                v-model="departmentInfo.deptType"
                @change="handleDeptTypeChange"
                :disabled="mode === 'edit'"
                clearable
                class="block-select"
              >
                <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in deptTypeList" :key="item.VALUE" />
              </el-select>
            </el-form-item>
            <el-form-item label="关联平台科室" prop="dicIds">
              <el-cascader v-model="departmentInfo.dicIds" :options="deptDicCascaderOptions" ref="deptDicCascader" />
              <el-button type="primary" @click="syncDept" :disabled="mode === 'edit'" style="margin-left: 20px"
                >同步至科室名称
              </el-button>
            </el-form-item>
            <el-form-item label="科室名称" prop="deptName">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-input
                    placeholder="建议同步平台科室名称"
                    v-model="departmentInfo.parent1Name"
                    v-if="deptLevel === 1"
                  />
                  <el-select
                    v-model="departmentInfo.parent1Id"
                    :allow-create="mode === 'add'"
                    filterable
                    placeholder="建议同步平台科室名称"
                    @change="handleDeptChange('levelTwo')"
                    v-else
                    class="block-select"
                  >
                    <el-option
                      v-for="item in levelOneDeptList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-input
                    placeholder="建议同步平台科室名称"
                    v-model="departmentInfo.parent2Name"
                    v-if="deptLevel === 2"
                  />
                  <el-select
                    v-model="departmentInfo.parent2Id"
                    :allow-create="mode === 'add'"
                    filterable
                    placeholder="建议同步平台科室名称"
                    @change="handleDeptChange('levelThree')"
                    v-else
                    :disabled="deptLevel === 1 || !departmentInfo.parent1Id"
                    class="block-select"
                  >
                    <el-option
                      v-for="item in levelTwoDeptList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-input
                    placeholder="建议同步平台科室名称"
                    v-model="departmentInfo.name"
                    :disabled="deptLevel !== 3 || !departmentInfo.parent2Id"
                  />
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" @click="openDeptList">科室列表</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input placeholder="区号+电话号码" v-model="departmentInfo.telephone" />
            </el-form-item>
            <el-form-item label="办公时间">
              <el-select v-model="departmentInfo.officeHours" clearable @change="handleOfficeHoursChange">
                <el-option :label="item.LABLE" :value="item.VALUE" v-for="item in officeHoursList" :key="item.VALUE" />
              </el-select>
              <el-form-item label="" style="display: inline-block" prop="officeTime">
                <el-time-picker
                  is-range
                  v-model="departmentInfo.officeTime"
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
            <el-form-item label="科室图片">
              <div class="img-container">
                <div class="title">主图<span class="tips">（建议尺寸为800像素*400像素，大小不超过500kb）</span></div>
                <span class="upload-img-container" v-show="departmentInfo.deptImageUrl">
                  <img :src="departmentInfo.deptImageUrl" alt="" height="68px" />
                </span>
                <el-upload
                  action="#"
                  :http-request="(file) => uploadFiles(file.file, 'deptImageId', 'deptImageUrl', 3)"
                  :show-file-list="false"
                  style="display: inline-block"
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
                  v-for="(item, index) in departmentInfo.otherImages"
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
            <el-form-item label="科室位置">
              <el-input v-model="departmentInfo.location" />
            </el-form-item>
            <div class="tab-container">
              <span class="required">*</span>
              <el-tabs v-model="activeTab">
                <el-tab-pane name="科室介绍" label="科室介绍"></el-tab-pane>
                <el-tab-pane name="预约须知" label="预约须知"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="editor" id="hos-entroduce-editor" v-show="activeTab === '科室介绍'"></div>
            <div class="editor" id="reservation-notice-editor" v-show="activeTab === '预约须知'"></div>
            <span class="entroduce-tips" v-show="entroduceTipsShowFlag">请输入科室介绍</span>
            <el-form-item label="科室状态" prop="status">
              <el-switch v-model="departmentInfo.status" active-text="开启" inactive-text="停用" />
            </el-form-item>
          </el-form>
          <div class="btn-actions">
            <el-button type="primary" @click="saveDeptInfo" v-if="mode !== 'check'">保存</el-button>
            <el-button @click="$router.go(-1)">返回</el-button>
          </div>
        </div>
      </template>
    </ProLayout>
    <DepartmentTree
      v-if="departmentTreeVis"
      :visible="departmentTreeVis"
      :hosId="departmentInfo.hosId || ''"
      :closeDialog="closeDepartmentTreeDialog"
      @update-success="handleDeptUpdateSuccess"
    />
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue'
import {
  getHosOptions,
  getDictionary,
  getDeptOptions,
  uploadFiles,
  saveDeptInfo,
  getDeptDetail,
  getDeptDicCascaderOptions,
} from '@/api/modules/systemAdmin'
import E from 'wangeditor'
import DepartmentTree from './DepartmentTree'
import GroupSelect from '@/components/GroupAndHospital/GroupSelect'
import HospitalSelect from '@/components/GroupAndHospital/HospitalSelect'

export default {
  data() {
    // 科室名称校验
    const deptNameValidate = (rule, value, callback) => {
      if (this.mode === 'add') {
        if (!this.departmentInfo.parent1Id || !this.departmentInfo.parent1Id.trim()) {
          callback(new Error())
        } else {
          callback()
        }
      } else if (this.mode === 'edit') {
        if (this.deptLevel === 3 && !this.departmentInfo.name.trim()) {
          callback(new Error())
        } else if (this.deptLevel === 2 && !this.departmentInfo.parent2Name.trim()) {
          callback(new Error())
        } else if (this.deptLevel === 1 && !this.departmentInfo.parent1Name.trim()) {
          callback(new Error())
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      mode: 'add',
      deptId: '',
      deptLevel: 3,
      hospitalList: [],
      deptTypeList: [],
      deptDicCascaderOptions: [],
      levelOneDeptList: [],
      levelTwoDeptList: [],
      levelThreeDeptList: [],
      officeHoursList: [],
      departmentInfo: {
        deptImageUrl: '',
        otherImages: [],
        otherDeptImageIds: [],
        status: true,
        officeTime: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 18, 0)],
      },
      rules: {
        orgId: [{ required: true, message: '', trigger: 'blur' }],
        hosId: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        deptType: [{ required: true, message: '请选择科室类型', trigger: 'blur' }],
        dicIds: [{ required: true, message: '请选择关联平台科室', trigger: 'blur' }],
        deptName: [
          {
            required: true,
            validator: deptNameValidate,
            message: '请完善科室名称',
            trigger: 'blur',
          },
        ],
      },
      officeTimeRule: [{ required: true, message: '请填写工作时间', trigger: 'blur' }],
      activeTab: '科室介绍',
      entroduceTipsShowFlag: false,
      departmentTreeVis: false,
      editOriginDeptInfo: {},
      acceptImage: ['image/jpeg', 'image/png'],
    }
  },
  computed: {
    pageTitle() {
      if (this.mode === 'add') {
        return '新增科室'
      } else if (this.mode === 'check') {
        return '科室详情'
      } else {
        return '编辑科室'
      }
    },
  },
  async mounted() {
    this.mode = this.$route.query.mode
    this.deptId = this.$route.query.deptId

    this.initEditor()
    await this.getHosOptions()
    await this.getDictionary('DEPT_CLASSIFY', 'deptTypeList')
    await this.getDictionary('HOSPITAL_OFFICE_HOURS', 'officeHoursList')

    if (this.mode !== 'add') {
      await this.getDeptDetail()
      if (this.departmentInfo.id) {
        this.deptLevel = 3
      } else if (this.departmentInfo.parent2Id) {
        this.deptLevel = 2
      } else {
        this.deptLevel = 1
      }

      // 获取级联科室
      await this.getDeptDicCascaderOptions()
      // 获取1，2，3级科室下拉
      this.getDeptOptions('levelOne')
      this.getDeptOptions('levelTwo')
      this.getDeptOptions('levelThree')
    }
  },
  methods: {
    openDeptList() {
      console.log(`this.departmentInfo.hosId`, this.departmentInfo.hosId)
      if (this.departmentInfo.hosId === undefined || this.departmentInfo.hosId === '') {
        this.$message.error('请先选择机构')
        return
      }
      this.departmentTreeVis = true
    },
    // 获取所有医院/机构
    async getHosOptions() {
      try {
        const res = await getHosOptions()
        console.log('getHosOptions==', res)
        this.hospitalList = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 获取科室类型
    async getDictionary(code, listType) {
      try {
        const res = await getDictionary({ code })
        console.log('getDictionary==', res)
        this[listType] = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 获取关联平台科室级联
    async getDeptDicCascaderOptions() {
      try {
        const res = await getDeptDicCascaderOptions({
          deptClassifys: [this.departmentInfo.deptType],
        })
        console.log('getDeptDicCascaderOptions==', res)
        this.deptDicCascaderOptions = res.result
        this.filterDicCascaderOptions(this.deptDicCascaderOptions)
      } catch (err) {
        console.error(err)
      }
    },

    // 关联平台科室级联数据去掉children
    filterDicCascaderOptions(dicCascaderOptions) {
      dicCascaderOptions.forEach((item) => {
        if (!item.children.length) {
          item.children = null
        } else {
          this.filterDicCascaderOptions(item.children)
        }
      })
    },

    // 获取科室列表下拉
    async getDeptOptions(level) {
      if (!this.departmentInfo.hosId || !this.departmentInfo.deptType) {
        return
      }
      let parentId
      let listType
      if (level === 'levelOne') {
        parentId = ''
        listType = 'levelOneDeptList'
      } else if (level === 'levelTwo') {
        parentId = this.departmentInfo.parent1Id
        listType = 'levelTwoDeptList'
      } else if (level === 'levelThree') {
        parentId = this.departmentInfo.parent2Id
        listType = 'levelThreeDeptList'
      }
      try {
        const res = await getDeptOptions({
          hosId: this.departmentInfo.hosId,
          deptClassify: this.departmentInfo.deptType,
          parentId,
        })
        console.log('getDeptOptions==', res)
        this[listType] = res.result
      } catch (err) {
        console.error(err)
      }
    },

    // 初始化富文本编辑器
    initEditor() {
      this.deptIntroduceEditor = new E('#hos-entroduce-editor')
      this.deptIntroduceEditor.config.height = 196
      this.deptIntroduceEditor.config.zIndex = 100
      this.deptIntroduceEditor.create()

      this.reservationNoticeEditor = new E('#reservation-notice-editor')
      this.reservationNoticeEditor.config.height = 196
      this.reservationNoticeEditor.config.zIndex = 100
      this.reservationNoticeEditor.create()

      if (this.mode === 'check') {
        this.deptIntroduceEditor.disable()
        this.reservationNoticeEditor.disable()
      }
    },

    // 获取科室详情
    async getDeptDetail() {
      try {
        const res = await getDeptDetail({ deptId: this.deptId, fileBaseUrl: window.g.VUE_APP_FILE_API })
        console.log('getDeptDetail==', res)
        this.departmentInfo = res.result
        this.departmentInfo.officeTime = this.departmentInfo.officeTime.length
          ? this.departmentInfo.officeTime
          : [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 18, 0)]
        // 设置富文本编辑器内容
        this.deptIntroduceEditor.txt.html(this.departmentInfo.deptIntroduce)
        this.reservationNoticeEditor.txt.html(this.departmentInfo.reservationNotice)
        // 是否启用
        this.departmentInfo.status = res.result.status === 'Y'
        this.editOriginDeptInfo = {
          parent1Id: this.departmentInfo.parent1Id || '', //一级科室ID,
          parent1Name: this.departmentInfo.parent1Name || '', // 一级科室名称,
          parent2Id: this.departmentInfo.parent2Id || '', // 二级科室ID,
          parent2Name: this.departmentInfo.parent2Name || '', // 二级科室名称,
          id: this.departmentInfo.id || '', // 三级科室ID,
          name: this.departmentInfo.name || '', // 三级科室名称,
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 科室类型发生改变重新请求关联平台科室以及下拉科室
    async handleDeptTypeChange(newVal) {
      this.getDeptDicCascaderOptions()
      this.getDeptOptions('levelOne')
    },

    // 点击同步至科室名称
    async syncDept() {
      const nodes = this.$refs.deptDicCascader.getCheckedNodes()[0]
      console.log('nodes', nodes)
      if (nodes) {
        // 获取关联平台科室三级label
        const levelOneDictDeptLabel = nodes.pathLabels[0] || ''
        const levelTowDictDeptLabel = nodes.pathLabels[1] || ''
        const levelThreeDictDeptLabel = nodes.pathLabels[2] || ''

        // 如果关联科室对应的科室有id，则设置id，否则设置label
        const levelOneDept = this.levelOneDeptList.find((item) => item.label === levelOneDictDeptLabel)
        if (levelOneDept) {
          this.$set(this.departmentInfo, 'parent1Id', levelOneDept.value)
          await this.getDeptOptions('levelTwo')
        } else {
          this.$set(this.departmentInfo, 'parent1Id', levelOneDictDeptLabel)
        }

        const levelTowDept = this.levelTwoDeptList.find((item) => item.label === levelTowDictDeptLabel)
        if (levelTowDept) {
          this.$set(this.departmentInfo, 'parent2Id', levelTowDept.value)
          await this.getDeptOptions('levelThree')
        } else {
          this.$set(this.departmentInfo, 'parent2Id', levelTowDictDeptLabel)
        }

        console.log('this.levelThreeDeptList==', this.levelThreeDeptList)

        this.$set(this.departmentInfo, 'name', levelThreeDictDeptLabel)
      }
    },

    // 科室名称改变获取下一级科室
    handleDeptChange(level, field) {
      // 下一级只有是select才清空
      if (level === 'levelTwo') {
        this.$set(this.departmentInfo, 'parent2Id', '')
      }
      this.$set(this.departmentInfo, 'name', '')
      this.getDeptOptions(level)
    },

    // 自定义文件上传处理
    handleChangeFileChange(e) {
      const files = e.target.files
      if (this.departmentInfo.otherDeptImageIds.length + files.length > 5) {
        this.$message.warning('最多上传5张图片')
        return
      }
      for (let i = 0; i < files.length; i++) {
        console.log(i)
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
        this.uploadFiles(files[i], 'otherDeptImageIds', 'otherImages', 4)
      }
      e.target.value = ''
    },

    // 上传图片
    async uploadFiles(file, idField, imgUrlField, useTo) {
      if (file.size > 500 * 1024) {
        this.$message.warning('图片大于500kb')
        return
      }
      if (!this.acceptImage.includes(file.type)) {
        this.$message.warning('文件格式不正确')
        return
      }
      if (this.departmentInfo.hosId === '') {
        this.$message.warning('请先选择机构')
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
        console.log('uploadFiles', res)
        if (Array.isArray(this.departmentInfo[idField])) {
          this.departmentInfo[idField].push(res.result.id)
          this.departmentInfo[imgUrlField].push({
            filePath: window.g.VUE_APP_FILE_API + res.result.fileId,
            id: res.result.id,
          })
        } else {
          this.departmentInfo[idField] = res.result.id
          this.departmentInfo[imgUrlField] = window.g.VUE_APP_FILE_API + res.result.fileId
          console.log('this.departmentInfo==', this.departmentInfo)
        }
      } catch (err) {
        console.error(err)
      }
    },

    // 图片删除
    deleteOtherImages(img, index) {
      const idIndex = this.departmentInfo.otherDeptImageIds.findIndex((item) => item === img.fileId)
      console.log(this.departmentInfo.otherDeptImageIds, img.fileId)
      if (idIndex !== -1) {
        this.departmentInfo.otherImages.splice(index, 1)
        this.departmentInfo.otherDeptImageIds.splice(index, 1)
      }
    },

    // 保存提交
    async saveDeptInfo() {
      // 校验科室是否已存在
      if (this.checkDeptHasExist()) {
        return
      }

      // 校验科室上级是否填全
      if (this.mode === 'edit' && !this.checkDeptPrevIsCompleted()) {
        this.$message.warning('需完善科室上级')
        return
      }

      this.$refs.elForm.validate(async (valid) => {
        this.entroduceTipsShowFlag = !this.deptIntroduceEditor.txt.html()
        if (valid && !this.entroduceTipsShowFlag) {
          console.log('this.getDeptIdAndNameResult==', this.getDeptIdAndNameResult())
          let params = {
            ...this.departmentInfo,
            deptIntroduce: this.deptIntroduceEditor.txt.html(),
            reservationNotice: this.reservationNoticeEditor.txt.html(),
            status: this.departmentInfo.status ? 'Y' : 'N',
          }
          // if (this.mode === 'add') {
          params = {
            ...params,
            ...this.getDeptIdAndNameResult(),
          }
          // }
          console.log('params==', params)
          try {
            const res = await saveDeptInfo(params)
            console.log('saveDeptInfo==', res)
            const msg = this.mode === 'add' ? '新增科室成功' : '更新科室成功'
            this.$message.success(msg)
            this.$router.go(-1)
          } catch (err) {
            console.error(err)
          }
        }
      })
    },

    // 校验科室是否存在
    checkDeptHasExist() {
      // 编辑科室状态下，如果科室名字与刚进入页面一模一样，则不做校验
      if (this.mode === 'edit') {
        let isSame = true
        for (const key in this.editOriginDeptInfo) {
          isSame = isSame && this.editOriginDeptInfo[key] === this.departmentInfo[key]
        }

        console.log('isSame===', isSame)

        if (isSame) {
          return false
        }
      }
      if (this.deptLevel === 3) {
        let level1DeptHasExit = false
        let level2DeptHasExit = false
        let level3DeptHasExit = false

        if (this.levelOneDeptList.find((item) => item.value === this.departmentInfo.parent1Id)) {
          level1DeptHasExit = true
        }

        if (this.levelTwoDeptList.find((item) => item.value === this.departmentInfo.parent2Id)) {
          level2DeptHasExit = true
        }

        if (this.levelThreeDeptList.find((item) => item.label === this.departmentInfo.name)) {
          level3DeptHasExit = true
        }

        if (this.departmentInfo.parent1Id && this.departmentInfo.parent2Id && this.departmentInfo.name) {
          if (level3DeptHasExit && level2DeptHasExit && level1DeptHasExit) {
            this.$message.warning('科室已存在')
            return true
          }
        } else if (this.departmentInfo.parent1Id && this.departmentInfo.parent2Id) {
          if (level1DeptHasExit && level2DeptHasExit) {
            this.$message.warning('科室已存在')
            return true
          }
        } else if (this.departmentInfo.parent1Id) {
          if (level1DeptHasExit) {
            this.$message.warning('科室已存在')
            return true
          }
        }
      } else if (this.deptLevel === 2) {
        let level2DeptHasExit = false
        let level1DeptHasExit = false
        if (this.levelOneDeptList.find((item) => item.value === this.departmentInfo.parent1Id)) {
          level1DeptHasExit = true
        }
        if (this.levelTwoDeptList.find((item) => item.label === this.departmentInfo.parent2Name)) {
          level2DeptHasExit = true
        }
        if (level1DeptHasExit && level2DeptHasExit) {
          this.$message.warning('科室已存在')
          return true
        }
      } else {
        let level1DeptHasExit = false
        if (this.levelOneDeptList.find((item) => item.label === this.departmentInfo.parent1Name)) {
          level1DeptHasExit = true
        }
        if (level1DeptHasExit) {
          this.$message.warning('科室已存在')
          return true
        }
      }

      return false
    },

    // 编辑时校验科室上级是否填全
    checkDeptPrevIsCompleted() {
      if (this.deptLevel === 3) {
        return this.departmentInfo.parent2Id && this.departmentInfo.parent1Id
      } else if (this.deptLevel === 2) {
        return !!this.departmentInfo.parent1Id
      }
      return true
    },

    // 转换科室Id与名称
    getDeptIdAndNameResult() {
      const result = {
        parent1Id: this.departmentInfo.parent1Id, //一级科室ID,
        parent1Name: this.departmentInfo.parent1Name, // 一级科室名称,
        parent2Id: this.departmentInfo.parent2Id, // 二级科室ID,
        parent2Name: this.departmentInfo.parent2Name, // 二级科室名称,
      }
      if (this.departmentInfo.parent1Id) {
        const dept = this.levelOneDeptList.find((item) => item.value === this.departmentInfo.parent1Id)
        if (dept) {
          result.parent1Id = dept.value
          result.parent1Name = dept.label
        } else {
          result.parent1Id = ''
          result.parent1Name = this.departmentInfo.parent1Id
        }
      }

      if (this.departmentInfo.parent2Id) {
        const dept = this.levelTwoDeptList.find((item) => item.value === this.departmentInfo.parent2Id)
        if (dept) {
          result.parent2Id = dept.value
          result.parent2Name = dept.label
        } else {
          result.parent2Id = ''
          result.parent2Name = this.departmentInfo.parent2Id
        }
      }
      return result
    },
    closeDepartmentTreeDialog(relaod) {
      this.departmentTreeVis = false
      if (relaod) {
      }
    },
    handleDeptUpdateSuccess() {
      // 重新查询一二级科室
      this.getDeptOptions('levelOne')
      this.getDeptOptions('levelTwo')
    },
    handleOfficeHoursChange(val) {
      this.$refs.elForm.clearValidate('officeTime')
      if (val) {
        this.departmentInfo.officeTime = [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 17, 0)]
        this.rules.officeTime = this.officeTimeRule
      } else {
        this.departmentInfo.officeTime = []
        delete this.rules.officeTime
      }
    },
  },
  components: {
    ProLayout,
    DepartmentTree,
    GroupSelect,
    HospitalSelect,
  },
}
</script>

<style lang="scss" scoped>
.department-detail {
  .department-info {
    background: #fff;
    padding: 24px;
  }

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

  ::v-deep.el-form-item {
    display: flex;

    .el-form-item__content {
      flex: 1;
      margin: 0 !important;
    }
  }
}
</style>
