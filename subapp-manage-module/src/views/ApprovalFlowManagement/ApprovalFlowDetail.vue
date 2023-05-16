<template>
  <div class="main">
    <!-- <vue-bpmn /> -->
    <Bpmn
      @context-ele-click="handleContextEleClick"
      ref="bpmnIns"
    />
    <StartNodeSetting
      :visible.sync="startNodeSettingVisible"
      :node-id="nodeId"
    />
    <EndNodeSetting
      :visible.sync="endNodeSettingVisible"
      :node-id="nodeId"
    />
    <GateWayNodeSetting
      :visible.sync="getWayNodeSettingVisible"
      :node-id="nodeId"
      @submit="handleSubmit"
      :node="node"
    />
    <TaskNodeSetting
      :visible.sync="taskNodeSettingVisible"
      :node-id="nodeId"
    />
    <TimerNodeSetting
      :visible.sync="timerNodeSettingVisible"
      :node-id="nodeId"
    />
    <el-button @click="saveBpmnInfo">保存</el-button>
  </div>
</template>

<script>
import Bpmn from '@/components/Bpmn'
import VueBpmn from '../../components/VueBpmn/index.vue'
import StartNodeSetting from './nodeSetting/StartNode';
import EndNodeSetting from './nodeSetting/EndNode';
import GateWayNodeSetting from './nodeSetting/GateWayNode';
import TaskNodeSetting from './components/TaskNodeSetting';
import TimerNodeSetting from './nodeSetting/TimerNode';
import {
  typeOfStartEvent,
  typeofEndEvent,
  typeofUserTask,
  typeofExclusiveGateway,
  typeofParallelGateway,
  typeofInclusiveGateway,
  typeofTimerIntermediateEvent
} from '@/components/Bpmn/config/nodeShape';


export default {
  data() {
    return {
      startNodeSettingVisible: false,
      getWayNodeSettingVisible: false,
      taskNodeSettingVisible: false,
      timerNodeSettingVisible: false,
      endNodeSettingVisible: false,
      nodeId: '',
      node: {},
    }
  },
  methods: {
    handleContextEleClick(ele) {
      switch(ele.type) {
        case typeOfStartEvent:
          this.nodeId = ele.id;
          this.startNodeSettingVisible = true;
        break;

        case typeofEndEvent:
          this.nodeId = ele.id;
          this.endNodeSettingVisible = true;
        break;

        case typeofUserTask:
          this.nodeId = ele.id;
          this.taskNodeSettingVisible = true;
        break;

        case typeofExclusiveGateway:
          this.nodeId = ele.id;
          this.node = ele;
          console.log('this.node', this.node)
          this.getWayNodeSettingVisible = true;
        break;

        case typeofParallelGateway:
          this.nodeId = ele.id;
          this.getWayNodeSettingVisible = true;
        break;

        case typeofInclusiveGateway:
          this.nodeId = ele.id;
          this.getWayNodeSettingVisible = true;
        break;

        case typeofTimerIntermediateEvent:
          this.nodeId = ele.id;
          this.timerNodeSettingVisible = true;
        break;
      }
    },
    handleSubmit(nodeSetting) {
      console.log('nodeSetting.gatewayType', `bpmn:${nodeSetting.gatewayType}`)
      this.$refs.bpmnIns.replaceElement({
        type: `bpmn:${nodeSetting.gatewayType}`
      });
      this.getWayNodeSettingVisible = false;
    },
    saveBpmnInfo() {
      const allNodes = this.$refs.bpmnIns.getAllNodes();
      const settingResult = {}
      for(let i = 0; i < allNodes.length; i++) {
        if (window.sessionStorage.getItem(allNodes[i].id)) {
          settingResult[allNodes[i].id] = JSON.parse(window.sessionStorage.getItem(allNodes[i].id))
        }
      }
      const bpmnXmlStr =  this.$refs.bpmnIns.exportBpnm();
      const result = {
        settingResult,
        bpmnXmlStr
      }
      console.log('result', result)
    }
  },
  components: {
    VueBpmn,
    Bpmn,
    StartNodeSetting,
    GateWayNodeSetting,
    TaskNodeSetting,
    TimerNodeSetting,
    EndNodeSetting
  },
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100vh; 
}</style>
