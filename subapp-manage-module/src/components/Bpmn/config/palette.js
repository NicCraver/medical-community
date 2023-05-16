/*
  关于Shape总共有哪些类型，以及各自对应的属性都是什么
  这个官方没有具体的文档给列出，我在使用的时候通常直接
  查看源码bpmn-js/lib/features/palette/PaletteProvider.js
  和bpmn-js/lib/features/context-pad/ContextPadProvider.js
  文件获取，对于部分类型，需要添加options选项
  key为shape名称，value为这个shape定义的一些属性
  value {
    group: 定义这个shape属于哪个组，主要有tools、event、gateway和activity可以选择
    className: 定义这个shape的class名称，可以通过这个class给shape指定具体的样式
    title: 定义这个shape的title，也就是鼠标移动到shape上的提示
    action: 用户操作时触发的事件
    options: 自定义自定义配置
  }
*/

import createAppendShape, {
  typeOfStartEvent,
  typeofEndEvent,
  typeofUserTask,
  typeofServiceTask,
  typeofGatewayNone,
  typeofTimerIntermediateEvent,
} from './nodeShape';

const paletteConfig = {
  'create.start-event': createAppendShape(typeOfStartEvent),
  'create.end-event': createAppendShape(typeofEndEvent),
  'create.user-task': createAppendShape(typeofUserTask),
  'create.service-task': createAppendShape(typeofServiceTask),
  'create.intermediate-event': createAppendShape(typeofTimerIntermediateEvent),
  'create.split-exclusive-gateway': createAppendShape(typeofGatewayNone, { title: '分支', className: `${createAppendShape(typeofGatewayNone).className} split`, selfConfig: { gatewayType: 'split'} }),
  'create.join-exclusive-gateway': createAppendShape(typeofGatewayNone, { title: '汇聚', className: `${createAppendShape(typeofGatewayNone).className} join`, selfConfig: { gatewayType: 'join' } }),
}

export default paletteConfig;