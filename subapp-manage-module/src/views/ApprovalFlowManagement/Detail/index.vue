<template>
	<ProLayout model="tab" mainBgColor="#F5F5F5" padding="0" overflow class="approval-detail">
    <template #title>审批流列表</template>
    <template #main>
      <div class="container">
        <div class="process">
          <div class="step-process">
            <div class="step">
              <span :class="['index', { active: currentStepIndex === 1 }]">1</span>
                基本信息
            </div>
            <div class="step">
              <span :class="['index', { active: currentStepIndex === 2 }]">2</span>
              流程设置
            </div>
            <div class="step">
              <span :class="['index', { active: currentStepIndex === 3 }]">3</span>
              其他设置
            </div>
          </div>
        </div>
        <div class="content">
          <BasicInfo v-show="currentStepIndex === 1"></BasicInfo>
          <ProcessDetail
            v-show="currentStepIndex === 2"
            ref="processDetail"
          ></ProcessDetail>
          <OtherSetting v-show="currentStepIndex === 3"></OtherSetting>
        </div>
      </div>
      
      <div class="actions">
        <el-button>返回</el-button>
        <el-button type="primary" v-show="currentStepIndex > 1" @click="currentStepIndex--">上一步</el-button>
        <el-button @click="handleTempSave">暂存</el-button>
        <el-button
          type="primary" v-show="currentStepIndex < 3"
          @click="currentStepIndex++"
        >下一步</el-button>
        <el-button type="primary" v-show="currentStepIndex === 3" @click="handleSave">保存</el-button>
      </div>
    </template>
  </ProLayout>
</template>

<script>
import { ProLayout } from "anx-vue";
import BasicInfo from './BasicInfo';
import OtherSetting from './OtherSetting';
import ProcessDetail from './ProcessDetail';
export default {
  data() {
    return {
      currentStepIndex: 1,
    }
  },
  mounted() {
    window.addEventListener("beforeunload", (e) => {
      this.clearNodeStorage()
    })
  },
  methods: {
    // 清除bpmn配置缓存
    clearNodeStorage() {
      const allNodes = this.$refs.processDetail.$refs.bpmnIns.getAllNodes();
      for(let i = 0; i < allNodes.length; i++) {
        if (window.sessionStorage.getItem(allNodes[i].id)) {
          window.sessionStorage.removeItem(allNodes[i].id)
        }
      }
    },
    handleTempSave() {
      if (this.currentStepIndex === 2) {
        const allNodes = this.$refs.processDetail.$refs.bpmnIns.getAllNodes();
        this.$refs.processDetail.saveBpmnInfo()
      }
    },
    handleSave() {
      this.$refs.processDetail.saveBpmnInfo();
      this.clearNodeStorage()
    }
  },
  components: {
    ProLayout,
    BasicInfo,
    OtherSetting,
    ProcessDetail
  }
}
</script>

<style lang="scss" scoped>
.approval-detail {
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    .process {
      background-color: #fff;
      padding: 10px;
      margin: 10px 0;
      .step-process {
        width: 70%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .step {
          flex: 1;
          display: flex;
          align-items: center;
          &:after {
            content: ' ';
            display: inline-block;
            height: 1px;
            background-color: #D9D9D9;
            flex: 1;
            margin: 0 5px;
          }
          &:last-child {
            flex: inherit;
            &:after {
              display: none;
            }
          }
          .index {
            display: inline-block;
            width: 24px;
            height: 24px;
            border: 1px solid #D9D9D9;
            color: #D9D9D9;
            text-align: center;
            line-height: 24px;
            border-radius: 50%;
            margin-right: 5px;
            &.active {
              background-color: #446ABD;
              color: #fff;
              border: 0
            }
          }
        }
      }
    }
    .content {
      flex: 1;
    }
  }
  .actions {
    position: fixed;
    bottom: 0;
    left: 208px;
    right: 0;
    background-color: #fff;
    border-top: 1px solid #ccc;
    padding: 10px 0;
    text-align: right;
    padding-right: 10px;
  }
}
</style>