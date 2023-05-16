<template>
  <el-dialog
    :visible.sync="visible"
    fullscreen
    title="代码编辑"
    center
    :close-on-press-escape="false"
  >
    <el-button
      type="primary"
      @click="toggle = !toggle"
      style="margin-bottom: 20px"
      >{{ toggle ? '收起' : '高级' }}</el-button
    >
    <el-button
      type="primary"
      @click="showApiFun($event)"
      style="margin-bottom: 20px;float: right;padding: 12px"
      ><i class="el-icon-arrow-left"></i>api列表</el-button
    >
    <transition name="stretch">
      <div class="advance" v-show="toggle">
        <el-row class="dependencies" :gutter="50">
          <el-col :span="12">
            <div class="dependence-title">外部javascript链接</div>
            <ul class="dependence-list">
              <li
                class="dependence-item"
                v-for="(item, index) in scriptSrcList"
                :key="index"
              >
                <el-input
                  v-model.trim="scriptSrcList[index]"
                  placeholder="请输入外部javascript链接"
                  size="small"
                />
                <el-button
                  @click="scriptSrcList.splice(index, 1)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  circle
                ></el-button>
              </li>
              <el-button type="text" @click="scriptSrcList.push('')"
                >添加项</el-button
              >
            </ul>
          </el-col>
          <el-col :span="12">
            <div class="dependence-title">外部style链接</div>
            <ul class="dependence-list">
              <li
                class="dependence-item"
                v-for="(item, index) in linkHrefList"
                :key="index"
              >
                <el-input
                  v-model.trim="linkHrefList[index]"
                  placeholder="请输入外部style链接"
                  size="small"
                />
                <el-button
                  @click="linkHrefList.splice(index, 1)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  circle
                ></el-button>
              </li>
              <el-button type="text" @click="linkHrefList.push('')"
                >添加项</el-button
              >
            </ul>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="code-title">代码片段</div>
            <ul>
              <li
                v-for="(item, index) in codeExampleList"
                :key="index"
                :class="['code-item', { active: index === activeIndex }]"
                @click="activeIndex = index"
              >
                {{ item.text }}
              </li>
            </ul>
          </el-col>
          <el-col :span="18">
            <p style="color: red">{{ codeExampleList[activeIndex].tips }}</p>
            <el-input
              type="textarea"
              v-model="codeExampleList[activeIndex].code"
              :rows="12"
              readonly
              style="margin-bottom: 20px;"
            />
          </el-col>
        </el-row>
      </div>
    </transition>
    <el-input type="textarea" v-model="jsCode" v-if="!editor" :rows="10" />
    <div id="editor" style="height: 500px" v-show="editor"></div>
    <el-button
      class="save-code-btn"
      type="primary"
      style="display: block; margin: 30px auto;"
      @click="saveJSCode"
      :data-clipboard-text="jsCode"
      >代码保存</el-button
    >
  </el-dialog>
</template>

<script>
import Clipboard from 'clipboard';
import eventBus from 'utils/event-bus';

export default {
  data() {
    return {
      visible: false,
      toggle: false,
      editor: null,
      activeIndex: 0,
      codeExampleList: [
        {
          text: '自定义校验函数',
          tips:
            '自定义校验规则(将此函数粘贴到书写代码的区域，注意函数名不能改变，函数返回值需要跟result格式相同)',
          code: `
function extraFormValidate() {
  var result = {
    msg: '',
    validate: true
  }
  var sex = document.querySelector('#anx-form-1593412724989 .el-radio__original').value;
  var age = document.getElementById('anx-form-1593412726416').value;
  if (sex === 'Option 1' && age > 100) {
    return {
      msg: 'age 不能大于100',
      validate: false
    }
  }
  return result
}`
        }
      ],
      jsCode: '',
      scriptSrcList: [],
      linkHrefList: []
    };
  },
  mounted() {
    eventBus.$on('[global/showJsCode]', data => {
      this.visible = true;
      this.jsCode = data.jsCode;
      this.scriptSrcList = data.scriptSrcList;
      this.linkHrefList = data.linkHrefList;
    });
  },
  beforeDestroy() {
    eventBus.$off('[global/showJsCode]');
  },
  methods: {
    saveJSCode() {
      if (this.editor) {
        this.jsCode = this.editor.getValue();
      }
      this.codeClipboard && this.codeClipboard.destroy();
      this.codeClipboard = new Clipboard('.save-code-btn', {
        text: () => this.jsCode
      });
      this.codeClipboard.on('success', () => {
        this.$message.success('代码复制保存成功');
      });
      this.$emit('save-code', {
        jsCode: this.jsCode,
        scriptSrcList: this.scriptSrcList,
        linkHrefList: this.linkHrefList
      });
      eventBus.$emit('[formView/dptCodeInfo]', {
        jsCode: this.jsCode,
        scriptSrcList: this.scriptSrcList,
        linkHrefList: this.linkHrefList
      });
      this.visible = false;
    },
    showApiFun(e) {
      e.stopPropagation();
      eventBus.$emit('[global/showApiFun]');
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (window.ace && !this.editor) {
            this.editor = window.ace.edit('editor'); // 这个地方就是id是editor的div
            this.editor.session.setMode('ace/mode/javascript');
            this.editor.setTheme('ace/theme/xcode');
            this.editor.setOptions({
              fontSize: 16,
              enableBasicAutocompletion: true, // 启用基本自动完成
              enableSnippets: true, // 启用代码段
              enableLiveAutocompletion: true, // 启用实时自动完成
              enableEmmet: true // 启用Emmet
            });
            this.editor.setValue(this.jsCode);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.advance {
  height: 350px;
  overflow: hidden;
  margin-bottom: 10px;
  .dependencies {
    .dependence-title {
      font-size: 18px;
    }
    .dependence-list {
      .dependence-item {
        display: flex;
        align-items: center;
        margin-top: 10px;
        button {
          width: 28px;
          height: 28px;
          margin-left: 10px;
        }
      }
    }
  }
}
.code-title {
  font-size: 18px;
  margin-bottom: 10px;
}
.code-item {
  margin-bottom: 5px;
  cursor: pointer;
  &.active {
    color: #409eff;
  }
}
.stretch-enter,
.stretch-leave-to {
  height: 0;
}
.stretch-enter-active,
.stretch-leave-active {
  transition: all 1s ease;
}
</style>
