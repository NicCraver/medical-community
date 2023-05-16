<template>
  <div class="FormD">
    <AnxFormMaking
      @create-json="createJson"
      width="90%"
      size="small"
      :anxFormData="anxFormData"
      :cusComponents="cusComponents"
      @createCusCom="createCusCom"
      :baseUrl="'http://124.196.7.86:7001/ygt-followup'"
      :showBack="true"
    />
    <el-dialog :visible.sync="dialogfVis" title="保存模板">
      <el-form ref="elForm" :rules="rules" :model="templateModel" label-position="top">
        <el-form-item label="模板名称" prop="saveTemplateName">
          <el-input v-model="templateModel.saveTemplateName" :disabled="state === 'edit'" />
        </el-form-item>
        <el-form-item label="模板类型" prop="templateType">
          <el-select
            v-model="templateModel.templateType"
            :disabled="state === 'edit'"
            style="width: 100%"
          >
            <el-option label="计划模板" value="FOLLOW" />
            <el-option label="评估模板" value="EVALUATION" />
            <el-option label="调研模板" value="RESEARCH" />
            <el-option label="活动模板" value="ACTIVITY" />
            <el-option label="会诊模板" value="MDT" />
          </el-select>
        </el-form-item>
        <el-form-item label="自动带入">
          <el-checkbox-group v-model="checkList">
            <template v-for="v in returnList">
              <el-checkbox
                v-if="v.name !== '身高' && v.name !== '体重'"
                :key="v.key"
                :label="v.key"
                @change="checkboxChange(v)"
                >{{ v.name }}</el-checkbox
              >
            </template>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogfVis = false">取消</el-button>
        <el-button type="primary" @click="submitTemplate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { onSaveTemplate, onSaveComponent, onQueryComponent } from '@/api/modules/FormDesign'
export default {
  name: 'App',
  components: {},
  data() {
    return {
      state: '',
      flag: false,
      TemplateId: '',
      templateName: '',
      anxFormData: null,
      cusComponents: [],
      baseUrl: '',
      dialogfVis: false,
      templateModel: {
        saveTemplateName: '',
        templateType: '',
      },
      rules: {
        saveTemplateName: [{ required: true, message: '请输入模板名称', trigger: 'change' }],
        templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
      },
      templateData: null,
      returnList: [],
      checkList: [],
    }
  },
  mounted() {
    this.baseUrl = window.g.VUE_APP_BASE_API + '/ygt-followup'
    console.log(`this.baseUrl`, this.baseUrl)
    console.log('this.$route.params', this.$route.params)
    const { ...formData } = this.$route.params
    if (Object.keys(formData).length === 0) {
      this.flag = false
    } else {
      if (formData.templateId === '') {
        this.flag = false
      } else {
        this.flag = true
      }

      this.TemplateId = formData.templateId || ''
      this.templateName = formData.templateName || ''
      this.anxFormData = formData || null
      this.state = formData.state
      if (formData.returnList && formData.returnList.length) {
        this.checkList = formData.returnData
        console.log('this.checkList', this.checkList)
      }
      this.templateModel.templateType = formData.type || ''
      this.templateModel.saveTemplateName = formData.templateName || ''
      console.log('this.state', this.state)
      if (this.state === 'copy') {
        this.templateModel.saveTemplateName = ''
      }
    }
    this.onQueryComponent()
  },
  methods: {
    // 保存模板接口
    async onSaveTemplate(value, row, checkList) {
      console.log('onSaveTemplate - checkList', checkList)
      try {
        const res = await onSaveTemplate({
          id: this.TemplateId,
          templateDesc: value,
          templateData: row,
          returnData: checkList,
          type: this.templateModel.templateType,
        })
        this.$message.success('保存模板成功！')
        this.$router.go(-1)
        console.log('res', res)
      } catch (err) {
        console.error('err', err)
      }
    },
    // 查询业务组件
    async onQueryComponent() {
      try {
        const res = await onQueryComponent({})
        this.cusComponents = res.result
        console.log('res', res)
      } catch (err) {
        console.error('err', err)
      }
    },
    // 保存模板
    async createJson(row) {
      console.log(`row`, row)
      this.returnList = row.returnList
      if (row.formComponentList.length === 0) {
        this.$message.error('请填写模板内容')
        return
      }
      this.templateData = row
      this.dialogfVis = true
    },
    submitTemplate() {
      this.$refs.elForm.validate((validate) => {
        if (validate) {
          // console.log('this.checkList', this.checkList);
          this.onSaveTemplate(
            this.templateModel.saveTemplateName,
            this.templateData,
            this.checkList,
          )
        }
      })
    },
    // 保存业务组件
    async createCusCom(row) {
      console.log('保存业务组件', row)
      // return
      try {
        const res = await onSaveComponent(row)
        console.log('res', res)
        this.$message.success('业务组件保存成功！')
        this.onQueryComponent()
      } catch (err) {
        console.error('err', err)
      }
    },
    checkboxChange(val) {
      console.log('val', val)
      let tempList = JSON.parse(JSON.stringify(this.checkList))
      let height = this.returnList.find((_) => _.name === '身高').key
      let weight = this.returnList.find((_) => _.name === '体重').key
      if (val.name === 'BMI') {
        let temp = this.checkList.find((_) => _ === val.key)
        if (temp) {
          tempList.push(val.key)
          tempList.push(height)
          tempList.push(weight)
          tempList = new Set(tempList)
          this.checkList = [...tempList]
        } else {
          for (let i = 0; i < this.checkList.length; i += 1) {
            if (this.checkList[i] === height || this.checkList[i] === weight) {
              this.checkList.splice(i, 1)
              i -= 1 // 必须对i减去1，否则后面的一个元素会被跳过去
            }
          }
        }
      }
    },
  },
}
</script>

<style lang="scss">
.anx-form-container {
  height: calc(100vh - 58px) !important;
}
.config-container::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}
.config-container::-webkit-scrollbar-thumb {
  background-color: #dddee0 !important;
  border-radius: 8px !important;
}
.form-component-list::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}
.form-component-list::-webkit-scrollbar-thumb {
  background-color: #dddee0 !important;
  border-radius: 8px !important;
}
.el-collapse::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}
.el-collapse::-webkit-scrollbar-thumb {
  background-color: #dddee0 !important;
  border-radius: 8px !important;
}
.btnFalses {
  color: #fff !important;
}
</style>
<style lang="scss" scoped>
.FormD {
  height: 100%;
  overflow: auto;
}
</style>
