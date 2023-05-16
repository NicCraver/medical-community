<template>
  <div class="ProDialog longContent">
    <el-dialog
      :visible.sync="visible"
      v-if="visible"
      title="预览"
      center
      :width="isMobile ? '400px' : '800px'"
    >
      <el-radio-group v-model="isMobile" style="margin-bottom: 30px;">
        <el-radio-button :label="false">PC端</el-radio-button>
        <el-radio-button :label="true">移动端</el-radio-button>
      </el-radio-group>

      <anx-form
        :style="isMobile ? 'background:#F7F7F7' : 'background:#fff'"
        :anxFormData="anxFormData"
        @data-submit="data => {}"
        ref="anxForm"
        fullscreen
        :jsCode="jsCode"
        :scriptSrcList="scriptSrcList"
        :linkHrefList="linkHrefList"
        :apiFunSrc="apiFunSrc"
        :baseUrl="baseUrl"
        :isMobile="isMobile"
      />
      <el-button
        v-if="!isMobile"
        type="primary"
        @click="handleSave"
        style="display: block; margin: 0 auto;"
      >
        保存
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import axios from 'axios';
import eventBus from 'utils/event-bus';
export default {
  inject: ['httpDomain', 'baseUrl'],
  props: {
    anxFormData: Object
  },
  data() {
    return {
      isMobile: false,
      visible: false,
      jsCode: '',
      scriptSrcList: [],
      linkHrefList: [],
      apiFunSrc: ''
    };
  },
  mounted() {
    eventBus.$on(
      '[formView/dptCodeInfo]',
      ({ jsCode, scriptSrcList, linkHrefList }) => {
        this.jsCode = jsCode;
        this.scriptSrcList = scriptSrcList;
        this.linkHrefList = linkHrefList;
      }
    );
    eventBus.$on('[global/showPriview]', async () => {
      // axios.get(`${this.httpDomain}/templateMethod/getJsFileUrl`).then(res => {
      //   this.apiFunSrc = res.data.data.url;
      this.visible = true;
      console.log('anxFormData', this.anxFormData);
      // });
    });
  },
  beforeDestroy() {
    eventBus.$off('[formView/dptCodeInfo]');
    eventBus.$off('[global/showPriview]');
  },
  methods: {
    handleSave() {
      console.log('PC端表单内容', this.$refs.anxForm.formSubmit());
    },
    handleMobile() {
      console.log(`移动端表单内容`, this.$refs.anxForm.onSubmit());
    }
  }
};
</script>
<style lang="scss" scoped>
.ProDialog {
  ::v-deep.el-dialog__body {
    overflow: auto;
  }
  ::v-deep.el-dialog__body::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::v-deep.el-dialog__body::-webkit-scrollbar-thumb {
    background-color: #dddee0;
    border-radius: 8px;
  }
}
.longContent {
  ::v-deep.el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    /** 这 0.5px加或者减都可以 */
    transform: translate(calc(-50% + 0.5px), calc(-50% + 0.5px));
    // transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }
}
</style>
