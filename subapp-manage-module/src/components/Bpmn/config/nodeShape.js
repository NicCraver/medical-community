export const typeOfStartEvent = 'bpmn:StartEvent';
export const typeofEndEvent = 'bpmn:EndEvent';
export const typeofUserTask = 'bpmn:UserTask';
export const typeofServiceTask = 'bpmn:ServiceTask';
export const typeofGatewayNone = 'bpmn:GatewayNone';
export const typeofExclusiveGateway = 'bpmn:ExclusiveGateway';
export const typeofParallelGateway = 'bpmn:ParallelGateway';
export const typeofInclusiveGateway = 'bpmn:InclusiveGateway';
export const typeofTimerIntermediateEvent = 'bpmn:IntermediateCatchEvent';
export const typeofSequenceFlow = 'bpmn:SequenceFlow';
export const typeofSetting = 'setting';
export const typeofDelete = 'delete';

const nodeShapeMaps = {
	[typeOfStartEvent]: {
		type: 'bpmn:StartEvent',
    group: 'event',
    className: 'bpmn-icon-start-event-none',
    title: '开始'
	},
	[typeofEndEvent]: {
		type: 'bpmn:EndEvent',
    group: 'event',
    className: 'bpmn-icon-end-event-none',
    title: '结束',
	},
	[typeofUserTask]: {
		type: 'bpmn:UserTask',
    group: 'activity',
    className: 'bpmn-icon-user-task',
    title: '用户任务',
	},
	[typeofServiceTask]: {
		type: 'bpmn:ServiceTask',
    group: 'activity',
    className: 'bpmn-icon-service-task',
    title: '服务任务',
	},
	[typeofGatewayNone]: {
		type: 'bpmn:ExclusiveGateway',
    group: 'gateway',
    className: 'bpmn-icon-gateway-none',
    title: '网关',
	},
	[typeofExclusiveGateway]: {
		type: 'bpmn:ExclusiveGateway',
    group: 'gateway',
    className: 'bpmn-icon-gateway-xor',
    title: '互斥网关',
	},
	[typeofParallelGateway]: {
		type: 'bpmn:ParallelGateway',
    group: 'gateway',
    className: 'bpmn-icon-gateway-parallel',
    title: '并行网关',
	},
	[typeofTimerIntermediateEvent]: {
		type: 'bpmn:IntermediateCatchEvent',
    group: 'event',
    className: 'bpmn-icon-intermediate-event-catch-timer',
    title: '定时',
    options: { eventDefinitionType: 'bpmn:TimerEventDefinition' }
	},
	[typeofSequenceFlow]: {
		group: 'edit',
    className: 'bpmn-icon-connection-multi',
    title: '连线',
	},
	[typeofSetting]: {
		group: 'edit',
    className: 'bpmn-icon-business-rule',
    title: '属性',
	},
	[typeofDelete]: {
		group: 'edit',
    className: 'bpmn-icon-trash',
    title: 'remove',
	},
}


const createAppendShape = (type, setting = {}) => {
  const nodeShape = JSON.parse(JSON.stringify(nodeShapeMaps[type]));
  for(const key in setting) {
    if (setting[key]) {
      nodeShape[key] = setting[key];
    }
  }
	return nodeShape;
}

export default createAppendShape