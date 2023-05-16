import { assign } from "min-dash";
import createContextPadConfig from '../config/contextPad';

export default function ContextPadProvider(
  config,
  injector,
  eventBus,
  contextPad,
  modeling,
  elementFactory,
  connect,
  create,
  popupMenu,
  canvas,
  rules,
  translate,
  bpmnReplace
) {
  this.modeling = modeling;
  this.elementFactory = elementFactory;
  this.connect = connect;
  this.create = create;
  this.translate = translate;
  this.bpmnReplace = bpmnReplace;
  config = config || {};

  if (config.autoPlace !== false) {
    this.autoPlace = injector.get("autoPlace", false);
  }

  contextPad.registerProvider(this);
}

ContextPadProvider.$inject = [
  "config.contextPad",
  "injector",
  "eventBus",
  "contextPad",
  "modeling",
  "elementFactory",
  "connect",
  "create",
  "popupMenu",
  "canvas",
  "rules",
  "translate",
  "bpmnReplace"
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  const {
    autoPlace,
    create,
    elementFactory,
    translate,
    modeling,
    connect,
    bpmnReplace
  } = this;

  function appendAction(type, options, selfConfig) {
    console.log()
    function appendStart(event, element) {
      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, {
        source: element
      });
      console.log('selfConfig', shape.businessObject.selfConfig)
      if (selfConfig) {
        shape.businessObject.selfConfig = selfConfig;
      }
    }
    return {
      appendStart: appendStart,
      append: autoPlace ? function (event, element) {
        var shape = elementFactory.createShape(assign({ type: type }, options));
        if (selfConfig) {
          shape.businessObject.selfConfig = selfConfig;
        }
        autoPlace.append(element, shape);
      }
      : appendStart
    }
  }

  function startConnect(event, element) {
    connect.start(event, element);
  }

  function removeElement(e) {
    modeling.removeElements([element]);
  }

  function clickElement(e) {
    const myEvent = new CustomEvent('bpmn-element-click', {
      detail: element
    })
    //确保主线程执行完毕后执行此代码，确保监听的注册完成后才来执行
    setTimeout(() => {
      document.dispatchEvent(myEvent)
    }, 0)
  }
  return createContextPadConfig(element.type, { appendAction, startConnect, removeElement, clickElement });
};