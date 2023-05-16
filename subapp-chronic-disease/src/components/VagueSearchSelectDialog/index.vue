<template>
  <el-dialog
    :title="title"
    :visible.sync="vagueSearchSelectDialogVisible"
    width="530px"
    class="universal-dialog"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="handleClose"
  >
    <template #title>
      <div class="dialog-head">{{ title }}</div>
    </template>
    <div class="dialog-body">
      <div class="combination-form" style="min-width: 290px; width: 100%; max-width: 100; margin-right: 22px">
        <el-select v-model="typeSelected" style="max-width: 110px" @change="typeChange">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <div class="line"></div>
        <el-select
          style="width: 100%"
          v-model="selectedValue"
          filterable
          remote
          reserve-keyword
          :remote-method="handleRemoteMethod"
          :loading="inputKeywordLoading"
          clearable
          placeholder="请输入要添加的检验（检查）项目名称"
          popper-class="VagueSearchSelectClass"
          @clear="handleClearMethod"
          @change="handleChangeMethod"
          suffix-icon="el-icon-date"
        >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item">
            <div class="option-block">
              <div class="option-block-top">
                <div class="option-block-1">患者自管</div>
                <div class="option-block-2">体格检查/一般检查</div>
              </div>
              <div class="option-block-3" v-html="highlight(item.label)">{{ item.label }}</div>
            </div>
          </el-option>
        </el-select>
      </div>
      <div class="recommend-list">
        <div class="title">推荐项目：</div>
        <div
          class="tag"
          :class="{ 'tag-selected': tag.selected }"
          v-for="tag in recommendList"
          :key="tag.value"
          @click="toggleSelected(tag)"
        >
          {{ tag.label }}
        </div>
      </div>
      <div class="selected-list">
        <div class="title">已选择</div>
        <div class="selected-tags">
          <el-tag v-for="tag in selectedList" :key="tag.value" closable @close="handleTagClose(tag)">
            {{ tag.label }}
          </el-tag>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm()">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getItemInfo } from '../../api/modules/SolutionCenter'
export default {
  name: 'RuleDialog',
  props: {
    diagnosticConditions: {
      type: Array,
    },
    vagueSearchSelectDialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '添加检验检查',
    },
  },
  model: {
    prop: 'vagueSearchSelectDialogVisible',
    event: 'close',
  },
  data() {
    return {
      // 选中的列表
      selectedList: [],
      // 选中的诊断
      selectedValue: '',
      // 输入框的值
      inputKeyword: '',
      // 选中的类型
      typeSelected: 'all',
      // 全部 患者自管 来源院内
      typeOptions: [
        { value: 'all', label: '全部' },
        { value: 'self', label: '患者自管' },
        { value: 'hospital', label: '来源院内' },
      ],
      // 选项
      options: [
        { value: 'option1', label: '选项1', type: '患者自管', text: '' },
        { value: 'option2', label: '选项2', type: '来源院内', text: '体格检查/一般检查' },
        { value: 'option3', label: '选项3', type: '来源院内', text: '体格检查/一般检查' },
        { value: 'option4', label: '选项4', type: '患者自管', text: '体格检查/一般检查' },
        { value: 'option5', label: '选项5', type: '患者自管', text: '体格检查/一般检查' },
      ],
      // 远程搜索loading
      inputKeywordLoading: false,
      // 远程搜索loading文案
      loadingText: '加载中...',
      // 推荐列表
      recommendList: [
        { value: 'option1', label: '选项1', selected: false },
        { value: 'option2', label: '选项2', selected: false },
        { value: 'option3', label: '选项3', selected: false },
        { value: 'option4', label: '选项4', selected: false },
        { value: 'option5', label: '选项5', selected: false },
        { value: 'option5', label: '选项5', selected: false },
        { value: 'option5', label: '选项5', selected: false },
        { value: 'option5', label: '选项5', selected: false },
        { value: 'option5', label: '选项5', selected: false },
        { value: 'option5', label: '选项5', selected: false },
        { value: 'option5', label: '选项5', selected: false },
      ],
    }
  },
  created() {
    // const { planId } = this.$route.query
    // this.planId = planId
    this.getItemInfo()
  },
  mounted() {},
  methods: {
    // 获取检验检查列表
    async getItemInfo() {
      try {
        const res = await getItemInfo({
          itemType: '2',
          itemName: '',
          rootDiseaseId: '654d3a1fe87446648feedb65ba3b9b57',
          configId: '7e4a36ed89494be9b321c7ab433aa172',
        })
        console.log(`res`, res)
      } catch (error) {
        console.log(`error`, error)
      }
    },
    toggleSelected(tag) {
      console.log(`tag`, tag)
      tag.selected = !tag.selected
      if (tag.selected) {
        this.selectedList.push(tag)
      } else {
        this.selectedList = this.selectedList.filter((item) => item.value !== tag.value)
      }
    },
    // 高亮
    highlight(text) {
      const keyword = this.inputKeyword
      if (keyword) {
        const reg = new RegExp(keyword, 'g')
        return text.replace(reg, `<span style="color: #409EFF">${keyword}</span>`)
      }
      return text
    },
    // 关闭
    handleClose() {
      this.$emit('close', false)
    },
    // 清空
    handleClearMethod() {
      this.selectedValue = ''
      this.inputKeyword = ''
      this.options = [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
        { value: 'option3', label: '选项3' },
        { value: 'option4', label: '选项4' },
        { value: 'option5', label: '选项5' },
      ]
    },
    // 选中
    handleChangeMethod(e) {
      console.log(`e`, e)
      // 判断是否重复
      const isRepeat = this.selectedList.some((item) => item.value === e.value)
      if (isRepeat) {
        this.$message.warning('已选中')
        // 清空
        this.selectedValue = ''
        return
      }
      this.selectedList.push(this.selectedValue)
      // recommendList 选中
      this.recommendList = this.recommendList.map((item) => {
        if (item.value === e.value) {
          item.selected = true
        }
        return item
      })
      // 清空
      this.selectedValue = ''
    },
    // 类型修改
    typeChange() {
      this.inputKeyword = ''
    },
    // 远程搜索
    handleRemoteMethod(name) {
      if (name !== '') {
        this.inputKeywordLoading = true
        this.inputKeyword = name
        this.queryPageByName()
      } else {
        this.inputKeyword = ''
        this.options = [
          { value: 'option1', label: '选项1' },
          { value: 'option2', label: '选项2' },
          { value: 'option3', label: '选项3' },
          { value: 'option4', label: '选项4' },
          { value: 'option5', label: '选项5' },
        ]
      }
    },
    // 根据名称查询
    async queryPageByName() {
      this.inputKeyword = this.inputKeyword
      this.inputKeywordLoading = true
      setTimeout(() => {
        this.inputKeywordLoading = false
        this.options = this.options.filter((option) => {
          return option.label.toLowerCase().indexOf(this.inputKeyword.toLowerCase()) > -1
        })
      }, 1000)
    },
    // 关闭标签
    handleTagClose(tag) {
      this.selectedList = this.selectedList.filter((item) => {
        return item.value !== tag.value
      })
      // recommendList 选中
      this.recommendList = this.recommendList.map((item) => {
        if (item.value === tag.value) {
          item.selected = false
        }
        return item
      })
    },
    // 提交
    submitForm() {
      // 判断是否有选中
      if (this.selectedList.length === 0) {
        this.$message.warning('请选择检验检查项目')
        return
      }
      console.log(`this.selectedList`, this.selectedList)
      // this.$emit('close', false)
      // this.$emit('submit', this.selectedList)
    },
  },
}
</script>

<style lang="scss" scoped>
.universal-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
    border-top: none !important;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 10px 15px;
    color: rgba(48, 49, 51, 1);
    font-size: 16px;
    padding: 10px 15px 10px 25px !important;
  }
  ::v-deep .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    // padding: 10px 15px;
  }
  ::v-deep .el-dialog__body {
    padding: 20px 20px 20px 0px;
  }

  .dialog-head {
    position: relative;
    font-weight: 700;

    &::before {
      content: '';
      position: absolute;
      left: -15px;
      width: 3px;
      height: 19px;
      margin-top: 4px;
      background-color: #134796;
    }
  }
  .dialog-body {
    padding: 0 0 0 20px;
    .combination-form {
      border: 1px solid rgba(217, 217, 217, 1);
      display: flex;
      align-items: center;
      border-radius: 3px;

      ::v-deep .el-input__inner {
        border: 0 !important;
        height: 30px;
      }
      .line {
        background: #d9d9d9;
        height: 20px;
        width: 1px;
      }

      .combination-form:hover {
        border-color: #446bbd;
      }
    }
    .recommend-list {
      margin: 4px 0 10px 0;
      display: flex;
      flex-wrap: wrap;
      .title {
        color: rgba(184, 185, 188, 1);
        font-size: 14px;
      }
      .tag {
        line-height: 22px;
        width: 82px;
        border-radius: 4px;
        background-color: rgba(245, 245, 245, 1);
        text-align: center;
        display: inline-block;
        // padding: 4px 8px;
        background-color: #ffffff;
        color: rgba(104, 104, 104, 1);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        margin-right: 6px;
        border: 1px solid rgba(217, 217, 217, 1);
        margin-bottom: 4px;
      }
      .tag-selected {
        background-color: #f5f5f5;
        color: #b8b9bc;
      }
    }
    .selected-list {
      display: flex;
      .title {
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        display: flex;
        line-height: 20px;
        margin-right: 20px;
        min-width: 60px;
      }
      .title::after {
        content: '';
        display: block;
        height: 18px;
        margin-top: 1px;
        width: 2px;
        margin-left: 10px;
        background-color: #446abd;
      }
      .selected-tags {
        display: flex;
        flex-wrap: wrap;

        ::v-deep .el-tag {
          background-color: #ecf0f8;
          border-color: #dae1f2;
          display: inline-block;
          height: 22px;
          padding: 0 10px;
          line-height: 20px;
          font-size: 12px;
          color: #446bbd;
          border-width: 1px;
          border-style: solid;
          border-radius: 4px;
          box-sizing: border-box;
          white-space: nowrap;
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.VagueSearchSelectClass {
  .el-select-dropdown__item {
    font-size: 14px;
    padding: 0;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 50px !important;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
    margin-bottom: 4px;
  }
  .el-select-dropdown__item.hover {
    background-color: #fff;
  }

  // 块
  .option-block {
    font-size: 12px;
    .option-block-top {
      padding: 10px;
      display: flex;
      align-items: center;
      height: 20px;
      line-height: 20px;
      margin-bottom: 4px;
    }
    .option-block-1 {
      background-color: rgba(230, 255, 251, 1);
      color: rgba(29, 197, 196, 1);
      width: 60px;
      text-align: center;
      margin-right: 6px;
      border-radius: 4px;
    }
    .option-block-2 {
      flex: 1;
      background-color: rgba(245, 245, 245, 1);
      color: rgba(153, 153, 153, 1);
      padding-left: 10px;
    }
    .option-block-3 {
      background-color: #fff;
      color: rgba(90, 94, 102, 1);
      // padding-left: 10px;
      padding: 10px 0 10px 24px;
      display: flex;
      align-items: center;
      text-align: center;
      height: 26px;
      line-height: 26px;
    }
    .option-block-3:hover {
      background-color: #f4f6f9;
    }
  }
}
</style>
