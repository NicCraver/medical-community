<template>
  <div class="NewComClass">
    <ProLayout model="content-footer" mainBgColor="#F5F5F5" padding="0" footer overflow>
      <template #title>发布新闻</template>
      <template #main>
        <div class="new-com-main">
          <el-form
            :model="ruleForm"
            :rules="rules"
            :disabled="status === 'view'"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="标题" prop="newsName">
              <el-input v-model="ruleForm.newsName"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="newsAlias">
              <el-input v-model="ruleForm.newsAlias"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="classifyId">
              <el-select v-model="ruleForm.classifyId" placeholder="请选择活动区域">
                <el-option
                  v-for="(option, index) in typeOptions"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="newsContent">
              <div style="border: 1px solid #c0c4cc; margin-top: 10px">
                <!-- 工具栏 -->
                <Toolbar style="border-bottom: 1px solid #c0c4cc" :editor="editor" :defaultConfig="toolbarConfig" />
                <!-- 编辑器 -->
                <Editor
                  style="height: 400px; overflow-y: hidden"
                  :defaultConfig="editorConfig"
                  v-model="ruleForm.newsContent"
                  :disabled="status === 'view'"
                  @onChange="onChange"
                  @onCreated="onCreated"
                />
              </div>
            </el-form-item>
            <el-form-item label="发布范围" required>
              <el-row>
                <el-col :span="5">
                  <el-radio-group v-model="ruleForm.publishLimit">
                    <el-radio :label="0">全平台用户</el-radio>
                    <el-radio :label="1">部分用户</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :span="19" v-if="ruleForm.publishLimit === 1">
                  <el-row>
                    <el-col :span="4">
                      <el-button style="margin-left: 20px" type="primary" @click="openUserPopup"> 选择用户 </el-button>
                    </el-col>
                    <el-col :span="20" v-if="usersList.length !== 0">
                      <div class="users">
                        <div v-for="v in usersList" class="users-box">{{ v.plabel }}-{{ v.label }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <div style="display: flex; align-items: center"></div>
            </el-form-item>
            <el-form-item label="发布时间" required>
              <div>
                <el-radio-group v-model="ruleForm.publishDateType">
                  <el-radio :label="0">立即发布</el-radio>
                  <el-radio :label="1">自定义</el-radio>
                </el-radio-group>
                <el-date-picker
                  v-if="ruleForm.publishDateType === 1"
                  v-model="ruleForm.publishDate"
                  :picker-options="{
                    disabledDate(time) {
                      return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
                    },
                    selectableRange: `${asyncDate} - 23:59:59`,
                  }"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="margin-left: 20px"
                  type="datetime"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="关闭时间" required>
              <div>
                <el-radio-group v-model="ruleForm.closeType">
                  <el-radio :label="0">永久不关</el-radio>
                  <el-radio :label="1">自定义</el-radio>
                </el-radio-group>
                <el-date-picker
                  v-if="ruleForm.closeType === 1"
                  v-model="ruleForm.closeTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="margin-left: 20px"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00"
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div v-if="status === 'view'" style="color: rgba(145, 145, 145, 1); font-size: 14px; margin-right: 20px">
          如需编辑请先在列表中行“关闭“操作
        </div>
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="status !== 'view'">{{
          publishButtonText
        }}</el-button>
        <el-button type="primary" @click="onSaveNews(0)" v-if="status !== 'view'">{{ temporaryButtonText }}</el-button>
        <el-button type="primary" @click="$router.go(-1)">返回</el-button>
      </template>
    </ProLayout>
    <ProDialog :visible.sync="userPopupFlag" title="选择用户" width="600px" :close-on-click-modal="false" top="20vh">
      <TreeTransfer
        :title="title"
        :from_data="fromData"
        :to_data="toData"
        :defaultProps="{ label: 'label' }"
        @addBtn="add"
        @removeBtn="remove"
        :mode="mode"
        height="400px"
        filter
        openAll
      >
      </TreeTransfer>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm"> 确 定 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { ProLayout, ProDialog } from 'anx-vue'
import TreeTransfer from 'el-tree-transfer'
import { DomEditor } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
  getUsersForQcNews,
  getDictionarys,
  onSaveNews,
  uploadFiles,
  getNewsDetailForQc,
} from '@/api/modules/NewsManage'
export default {
  components: {
    ProLayout,
    Editor,
    Toolbar,
    ProDialog,
    TreeTransfer,
  },
  data() {
    return {
      status: '',
      newID: '',
      dayjs: dayjs,
      title: ['待选', '已选'], //标题 类型：Array 必填：false 默认：["源列表", "目标列表"]
      mode: 'transfer', //设置模式，字段可选值为transfer|addressList 类型：String 必填：false 补充：mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人
      fromData: [],
      toData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        },
        // selectableRange 当前时间 - 23:59:59
        selectableRange: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        },
      },
      userPopupFlag: false,
      editor: null,
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        excludeKeys: [
          'fullScreen',
          /* 隐藏哪些菜单 */
        ],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          uploadImage: {
            async customUpload(file, insertImgFn) {
              const newFile = new FormData()
              newFile.append('file', file)
              //   if (file.size > 500 * 1024) {
              //     this.$message.warning('图片大于500kb')
              //     return
              //   }
              //   if (!this.acceptImage.includes(file.type)) {
              //     this.$message.warning('文件格式不正确')
              //     return
              //   }
              const { hosId } = JSON.parse(sessionStorage.getItem('deptObject'))
              const formData = new FormData()
              formData.append('file', file)
              formData.append('hosId', hosId)
              formData.append('service', 7)
              formData.append('useTo', 18)
              const res = await uploadFiles(formData)
              //   console.log('this.hospitalInfo[idField]', idField)
              //   if (Array.isArray(this.hospitalInfo[idField])) {
              //     this.hospitalInfo[idField].push(res.result.id)
              //     this.hospitalInfo[imgUrlField].push({
              //       filePath: window.g.VUE_APP_FILE_API + res.result.fileId,
              //       fileId: res.result.id,
              //     })
              //   } else {
              //     this.hospitalInfo[idField] = res.result.id
              //     this.hospitalInfo[imgUrlField] = window.g.VUE_APP_FILE_API + res.result.fileId
              //     console.log(this.hospitalInfo.logoUrl)
              //   }
              insertImgFn(window.g.VUE_APP_FILE_API + res.result.fileId)
              //   insertImgFn(' http://10.16.140.27:7001/' + res.result.fileId)
            },
          },
        },
      },
      typeOptions: [],
      status: '',
      ruleForm: {
        newsName: '',
        newsAlias: '',
        classifyId: '',
        newsContent: '',
        publishLimit: 0,
        publishDateType: 0,
        closeType: 0,
        publishDate: '',
        closeTime: '',
        userIds: [],
      },
      rules: {
        newsName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        newsAlias: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        classifyId: [{ required: true, message: '请选择类型', trigger: 'change' }],
        newsContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        publishLimit: [{ required: true, message: '请选择发布范围', trigger: 'change' }],
        publishDateType: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        closeType: [{ required: true, message: '请选择关闭时间', trigger: 'change' }],
        publishDate: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        closeTime: [{ required: true, message: '请选择关闭时间', trigger: 'change' }],
      },
      rightIds: [],
    }
  },
  computed: {
    asyncDate() {
      return dayjs().format('HH:mm:ss')
    },
    publishButtonText() {
      let text = '发布'
      if (this.$route.query.from === 'Published' && this.status === 'edit') {
        text = '开启即发布'
      }
      return text
    },
    temporaryButtonText() {
      let text = '暂存'
      if (this.$route.query.from === 'Published' && this.status === 'edit') {
        text = '仅保存'
      }
      return text
    },
    usersList() {
      return this.toData
        .map((item) => {
          return item.children.map((child) => {
            return {
              ...child,
              plabel: item.label,
            }
          })
        })
        .flat()
    },
  },
  async created() {
    this.status = this.$route.query.status
    console.log(`this.status`, this.status)
    this.getDictionarys()
    await this.getUsersForQcNews()
    if (this.status !== 'add') {
      this.newID = this.$route.query.newID
      this.getNewsDetailForQc()
    }
  },
  mounted() {
    // setTimeout(() => {
    //   const toolbar = DomEditor.getToolbar(this.editor)
    //   console.log(`toolbar`, toolbar.getConfig().toolbarKeys)
    // }, 1000)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.newsContent === '<p><br></p>') {
            this.$message.error('请输入内容')
            return
          }
          this.onSaveNews(1)
          console.log(`this.ruleForm`, this.ruleForm)
        } else {
          console.log('error submit!!')
          if (this.ruleForm.newsContent === '<p><br></p>') {
            this.$message.error('请输入内容')
          }
          console.log(`ruleForm.newsContent`, this.ruleForm.newsContent === '<p><br></p>')
          return false
        }
      })
    },
    async onSaveNews(isPublish) {
      try {
        console.log(`isPublish`, isPublish)
        if (isPublish === 0) {
          if (
            this.ruleForm.newsName === '' &&
            this.ruleForm.newsAlias === '' &&
            this.ruleForm.classifyId === '' &&
            this.ruleForm.newsContent === '<p><br></p>'
          ) {
            this.$message.error('请输入内容')
            return
          }
        }
        let userIds = []
        if (this.ruleForm.publishLimit === 1) {
          userIds = this.toData.map((item) => item.children.map((child) => child.id)).flat()
        }
        if (this.ruleForm.publishDateType === 0) {
          this.ruleForm.publishDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        const res = await onSaveNews({
          ...this.ruleForm,
          isPublish: isPublish,
          userIds: userIds,
        })
        if (isPublish === 0) {
          this.$message.success('暂存成功')
        } else {
          // 提示保存成功 并返回
          this.$message.success('发布成功')
          this.$router.go(-1)
        }
      } catch (error) {
        console.error(`error`, error)
      }
    },
    // 获取新闻信息
    async getNewsDetailForQc() {
      try {
        const res = await getNewsDetailForQc({
          nlId: this.newID,
        })
        if (this.status != 'add') {
          this.ruleForm.nlId = res.result.nlId
        }
        this.ruleForm.newsName = res.result.newsName
        this.ruleForm.newsAlias = res.result.newsAlias
        this.ruleForm.classifyId = res.result.classifyId
        this.ruleForm.newsContent = res.result.newsContent
        this.ruleForm.publishLimit = res.result.publishLimit
        this.ruleForm.publishDateType = res.result.publishDateType
        this.ruleForm.closeType = res.result.closeTime === '' ? 0 : 1
        this.ruleForm.publishDate = res.result.publishDate
        this.ruleForm.closeTime = res.result.closeTime
        this.ruleForm.userIds = res.result.userIds

        if (res.result?.userIds.length > 0) {
          console.log(`this.fromData`, this.fromData)
          this.toData = this.arrToTreeArr(this.fromData, res.result.userIds)

          this.getFilterLeftData()
        }
      } catch (error) {
        console.error(`error`, error)
      }
    },
    openUserPopup() {
      this.userPopupFlag = true
    },
    confirm() {
      // 如果this.toData 为空 则提示请选择用户
      if (this.toData.length === 0) {
        this.$message.error('请选择用户')
        return
      }
      console.log(`this.toData`, JSON.stringify(this.toData))
      // // 取出所有children的id
      // let ids = this.toData.map((item) => item.children.map((child) => child.id)).flat()
      // console.log(`ids`, ids)
      this.userPopupFlag = false
    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode == 'transfer') {
        this.mode = 'addressList'
      } else {
        this.mode = 'transfer'
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
    },
    // 字典
    async getDictionarys() {
      try {
        const res = await getDictionarys([
          {
            key: 'typeOptions',
            groupId: '67cc917a8e44482cb30a6f34636cedeb',
          },
        ])
        this.typeOptions = res.result.typeOptions
      } catch (error) {
        console.error(`error`, error)
      }
    },
    async getUsersForQcNews() {
      try {
        const res = await getUsersForQcNews()
        console.log(`res.result`, res.result)
        this.fromData = res.result
      } catch (error) {
        console.error(`error`, error)
      }
    },
    arrToTreeArr(toData, arr) {
      let res = []
      function traverse(node) {
        if (node.children && node.children.length > 0) {
          // 有子节点
          let childrenArr = []
          for (let i = 0; i < node.children.length; i++) {
            if (arr.includes(node.children[i].id)) {
              // 包含在 arr 中
              childrenArr.push(node.children[i])
            } else {
              traverse(node.children[i]) // 继续递归遍历其子节点
            }
          }
          if (childrenArr.length > 0) {
            // 子节点中有匹配的元素
            let parent = Object.assign({}, node)
            parent.children = childrenArr
            res.push(parent)
          }
        }
      }
      console.log(`toData`, toData)
      toData.forEach((el) => {
        traverse(el)
      })

      return res
    },
    // 取消选择
    closeDialog() {
      this.userPopupFlag = false
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
      if (this.status === 'view') {
        this.$nextTick(() => {
          this.editor.disable()
        })
      }
    },
    onChange(editor) {
      console.log('onChange', editor.getHtml()) // onChange 时获取编辑器最新内容
    },
    getEditorText() {
      const editor = this.editor
      if (editor == null) return

      console.log(editor.getText()) // 执行 editor API
    },
    printEditorHtml() {
      const editor = this.editor
      if (editor == null) return

      console.log(editor.getHtml()) // 执行 editor API
    },
    // 获取右侧数据 id
    getRightDataIds(list, rightIds) {
      for (let rightItem of list) {
        rightIds.push(rightItem.id)
        if (rightItem.children && rightItem.children.length) {
          this.getRightDataIds(rightItem.children, rightIds)
        }
      }
      return rightIds
    },
    // 处理过滤数据
    getFilterLeftData() {
      let rightIds = this.getRightDataIds(this.toData, [])
      this.fromData = this.filterLeftData(this.fromData, rightIds, [])
    },
    filterLeftData(list, rightIds, newList) {
      for (let leftItem of list) {
        if (rightIds.includes(leftItem.id)) {
          if (leftItem.children && leftItem.children.length) {
            let insetBool = false
            for (let child of leftItem.children) {
              if (!rightIds.includes(child.id)) insetBool = true
            }
            if (insetBool) {
              let jsonItem = JSON.parse(JSON.stringify(leftItem))
              jsonItem.children = []
              newList.push(jsonItem)
              this.filterLeftData(leftItem.children, rightIds, jsonItem.children)
            }
          }
        } else {
          let jsonItem = JSON.parse(JSON.stringify(leftItem))
          console.log(`jsonItem`, jsonItem)
          // jsonItem.children = []
          newList.push(jsonItem)
        }
      }
      return newList
    },
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy()
    // 组件销毁时，及时销毁编辑器
  },
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style lang="scss" scoped>
.NewComClass {
  .new-com-main {
    background-color: #fff;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
    .users {
      margin-left: 15px;
      background-color: rgba(247, 247, 247, 1);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 4px;
      .users-box {
        margin: 5px 4px;
        border-radius: 2px;
        background-color: #f7f7f7;
        text-align: center;
        border: 1px solid rgba(217, 217, 217, 1);
        padding: 0 8px;
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
      }
      // 计算宽度
      // width: calc(100vw - 400px);
    }
  }
  ::v-deep .w-e-text-placeholder {
    font-style: italic;
    left: 10px;
    top: 7px;
    width: 90%;
  }
  ::v-deep .ProDialog .title:before {
    content: '';
    position: absolute;
    left: 0px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
  ::v-deep .ProDialog .title {
    color: #303133;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    position: relative;
    padding-left: 10px;
  }
  ::v-deep.el-icon-arrow-right:before {
    content: '\e6e0';
    font-size: 16px;
    color: #fff !important;
  }
}
</style>
