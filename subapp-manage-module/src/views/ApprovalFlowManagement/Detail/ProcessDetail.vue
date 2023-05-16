<template>
  <div class="main">
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
    <UserTaskNodeSetting
      :visible.sync="userTaskNodeSettingVisible"
      :node-id="nodeId"
    />
    <ServiceTaskNodeSetting
      :visible.sync="serviceTaskNodeSettingVisible"
      :node-id="nodeId"
      :user-task-list="userTaskList"
    />
    <TimerNodeSetting
      :visible.sync="timerNodeSettingVisible"
      :node-id="nodeId"
    />
  </div>
</template>

<script>
import Bpmn from '@/components/Bpmn'
import StartNodeSetting from './nodeSetting/StartNode';
import EndNodeSetting from './nodeSetting/EndNode';
import GateWayNodeSetting from './nodeSetting/GateWayNode';
import UserTaskNodeSetting from './nodeSetting/UserTaskNode';
import ServiceTaskNodeSetting from './nodeSetting/ServiceTaskNode';
import TimerNodeSetting from './nodeSetting/TimerNode';
import {
  typeOfStartEvent,
  typeofEndEvent,
  typeofUserTask,
  typeofServiceTask,
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
      userTaskNodeSettingVisible: false,
      timerNodeSettingVisible: false,
      endNodeSettingVisible: false,
      serviceTaskNodeSettingVisible: false,
      nodeId: '',
      node: {},
      userTaskList: []
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
          this.userTaskNodeSettingVisible = true;
        break;

        case typeofServiceTask:
          this.nodeId = ele.id;
          const userTaskList = this.$refs.bpmnIns.getAllNodes().filter(item => item.type === typeofUserTask)
          const result = []
          userTaskList.forEach(item => {
            const id = item.id;
            let setting = {};
            if (window.sessionStorage.getItem(id)) {
              setting = JSON.parse(window.sessionStorage.getItem(id))
            }
            result.push({
              id,
              name: item.businessObject.name,
              setting
            })
          })
          this.userTaskList = result;
          this.serviceTaskNodeSettingVisible = true;
        break;

        case typeofExclusiveGateway:
          this.nodeId = ele.id;
          this.node = ele;
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
          console.log('allNodes[i].id', allNodes[i].id)
          settingResult[allNodes[i].id] = JSON.parse(window.sessionStorage.getItem(allNodes[i].id))
          // settingResult.push(
          //   {
          //     [allNodes[i].id]: JSON.parse(window.sessionStorage.getItem(allNodes[i].id))
          //   }
          // )
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
    Bpmn,
    StartNodeSetting,
    GateWayNodeSetting,
    UserTaskNodeSetting,
    ServiceTaskNodeSetting,
    TimerNodeSetting,
    EndNodeSetting
  },
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
}
</style>
