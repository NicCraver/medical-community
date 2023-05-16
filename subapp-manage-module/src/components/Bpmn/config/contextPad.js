import createAppendShape, {
  typeOfStartEvent,
  typeofEndEvent,
  typeofUserTask,
  typeofServiceTask,
  typeofGatewayNone,
  typeofExclusiveGateway,
  typeofParallelGateway,
  typeofInclusiveGateway,
  typeofTimerIntermediateEvent,
  typeofSequenceFlow,
  typeofSetting,
  typeofDelete
} from './nodeShape';


export default (nodeType, { appendAction, startConnect, removeElement, clickElement }) => {
  const contextPadConfig = {
    'append.split-exclusive-gateway': {
      ...createAppendShape(typeofGatewayNone, { className: `${createAppendShape(typeofGatewayNone).className} split` }),
      action: {
        dragstart: appendAction(typeofExclusiveGateway, null).appendStart,
        click: appendAction(typeofExclusiveGateway, null, { gatewayType: 'split' } ).append
      }
    },
    'append.join-exclusive-gateway': {
      ...createAppendShape(typeofGatewayNone, { className: `${createAppendShape(typeofGatewayNone).className} join` }),
      action: {
        dragstart: appendAction(typeofExclusiveGateway, null).appendStart,
        click: appendAction(typeofExclusiveGateway, null, { gatewayType: 'join' }).append
      }
    },
    'append.timer-intermediate-event': {
      ...createAppendShape(typeofTimerIntermediateEvent),
      action: {
        dragstart: appendAction(
          typeofTimerIntermediateEvent,
          createAppendShape(typeofTimerIntermediateEvent).options
        ).appendStart,
        click: appendAction(
          typeofTimerIntermediateEvent,
          createAppendShape(typeofTimerIntermediateEvent).options
        ).append
      }
    },
    'append.user-task': {
      ...createAppendShape(typeofUserTask),
      action: {
        dragstart: appendAction('bpmn:UserTask', null).appendStart,
        click: appendAction('bpmn:UserTask', null).append
      }
    },
    'append.service-task': {
      ...createAppendShape(typeofServiceTask),
      action: {
        dragstart: appendAction('bpmn:ServiceTask', null).appendStart,
        click: appendAction('bpmn:ServiceTask', null).append
      }
    },
    'append.end-event': {
      ...createAppendShape(typeofEndEvent),
      action: {
        dragstart: appendAction(typeofEndEvent, null).appendStart,
        click: appendAction(typeofEndEvent, null).append
      }
    },
    'typeofSequenceFlow': {
      ...createAppendShape(typeofSequenceFlow),
      action: {
        click: startConnect,
        dragstart: startConnect
      }
    },
    'setting': {
      ...createAppendShape(typeofSetting),
      action: {
        click: clickElement
      } 
    },
    'delete': {
      ...createAppendShape(typeofDelete),
      action: {
        click: removeElement
      }
    }
  }

  // 全局可使用的节点
  const commonContextPad = Object.keys(contextPadConfig);

  const map = {
    [typeOfStartEvent]: commonContextPad,
    [typeofEndEvent]: ['setting', 'delete'],
    [typeofSequenceFlow]: ['delete'],
    [typeofTimerIntermediateEvent]: commonContextPad,
    [typeofUserTask]: commonContextPad,
    [typeofServiceTask]: commonContextPad,
    [typeofExclusiveGateway]: commonContextPad,
    [typeofParallelGateway]: commonContextPad,
    [typeofInclusiveGateway]: commonContextPad,
  }
  const result = {}
  for(const key in contextPadConfig) {
    if (map[nodeType] && map[nodeType].includes(key)) {
      result[key] = contextPadConfig[key]
    }
  }
  return result;
}