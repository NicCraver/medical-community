<template>
  <div class="container grid">
    <div class="bpmn-canvas" ref="canvas"></div>
  </div>
</template>

<script>
import { xmlStr } from './mock';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { CustomModeler } from "./customModeler";
import {
  typeofExclusiveGateway,
  typeofParallelGateway,
  typeofInclusiveGateway
} from './config/nodeShape'
// import BpmnModeler from "bpmn-js/lib/Modeler";

export default {
  data() {
    return {
      bpmnModeler: null,
      container: null,
      canvas: null,
      scale: 1,
      node: {},
      oldElement: null
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const canvas = this.$refs.canvas;
      this.bpmnModeler = new CustomModeler({
        container: canvas,
        keyboard: {
          bindTo: window
        },
        // 如果你想修改或禁用bpmn-js的某些默认功能，例如你不想要左侧的工具栏Palette，则可以通过additionalModules选项来实现，additionalModules允许你使用自定义模块来修改或替换现有功能
        additionalModules: [
          // {
          //   // 禁用滚轮滚动
          //   zoomScroll: ["value", ""],
          //   // 禁止拖动线
          //   bendpoints: ["value", ""],
          //   // 禁用左侧面板
          //   paletteProvider: ["value", ""],
          //   // 禁止点击节点出现contextPad
          //   contextPadProvider: ["value", ""],
          //   // 禁止双击节点出现label编辑框
          //   labelEditingProvider: ["value", ""]
          // }
        ]
      })
      this.createNewDiagram()
    },
    createNewDiagram() {
      const result = this.bpmnModeler.importXML(xmlStr, error => {
        if (error) {
          console.error(error)
        } else {
          document.querySelector('.bjs-powered-by').remove(); // 移除自带的logo
          this.adjustPalette();
          // 监听点击元素的点击事件
          document.addEventListener('bpmn-element-click', e => {
            this.node = e.detail
            this.$emit('context-ele-click', e.detail)    
          })
          const canvas = this.bpmnModeler.get('canvas');
          const allNodes = this.getAllNodes();
          allNodes.forEach(node => {
            if ([typeofExclusiveGateway, typeofParallelGateway, typeofInclusiveGateway].includes(node.type)) {
              const gatewayType = node.businessObject.$attrs.gatewayType;
              canvas.addMarker(node.businessObject.id, gatewayType);
            }
          })
          this.addEventBusListener();
        }
      });
    },
    adjustPalette() {
      try {
        const djsPalette = document.querySelector(`.bpmn-canvas .djs-container .djs-palette`);
        const paletteGroups = document.querySelectorAll(`.bpmn-canvas .djs-container .djs-palette .djs-palette-entries .group`);
        const djsPalStyle = {
          width: 'min-content',
          padding: '5px',
          background: 'white',
          left: '20px',
          borderRadius: 0,
          whiteSpace: 'nowrap'
        }
        for (const key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key]
        }
        // 修改控件样式
        for (const gKey in paletteGroups) {
          const group = paletteGroups[gKey];
          console.log('group.children===', group.children)
          for (const cKey in group.children) {
            const control = group.children[cKey]
            const controlStyle = {
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: '5px',
              lineHeight: 1
            }
            if (control.className) {
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${control.getAttribute('title') || ''}</div>`
              for (const csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey]
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    },

    // 撤销
    handlerUndo() {
      this.bpmnModeler.get('commandStack').redo();
    },
    
    // 恢复
    handlerRedo() {
      this.bpmnModeler.get('commandStack').undo();
    },
    
    // 缩放
    handlerZoom(radio) {
      const newScale = !radio ? 1.0 : this.scale + radio;
      this.bpmnModeler.get('canvas').zoom(newScale);
      this.scale = newScale;
    },

    // 事件监听 具体有哪些可监听的方法百度
    addEventBusListener() {
      const eventBus = this.bpmnModeler.get('eventBus');
      const canvas = this.bpmnModeler.get('canvas');
      eventBus.on('shape.added', e => {
        this.node = e.element;
        if ([typeofExclusiveGateway, typeofParallelGateway, typeofInclusiveGateway].includes(this.node.type)) {
          let gatewayType;
          if (this.oldElement) {
            gatewayType = this.oldElement.businessObject.selfConfig ? this.oldElement.businessObject.selfConfig.gatewayType : this.oldElement.businessObject.$attrs.gatewayType;
            this.node.businessObject.selfConfig = this.oldElement.businessObject.selfConfig;
          } else {
            gatewayType = this.node.businessObject.selfConfig ? this.node.businessObject.selfConfig.gatewayType : this.node.businessObject.$attrs.gatewayType;
          }
          this.$nextTick(() => {
            this.updateNode({ gatewayType });
            canvas.addMarker(this.node.businessObject.id, gatewayType);
            this.oldElement && (this.oldElement = null)
          });
        }
      });
    },

    // 获取全部节点
    getAllNodes() {
      return this.bpmnModeler.get('elementRegistry').getAll()
    },

    // 获取指定ID节点
    getNodeById(id) {
      this.bpmnModeler.get('elementRegistry').get(id)
    },

    // 修改节点, 通过modeling的updateProperties方法可以修改节点属性，例如这里修改节点name为ops-coffee.cn
    updateNode(newProperties) {
      const modeling = this.bpmnModeler.get('modeling');
      const element = this.bpmnModeler.get('elementRegistry').get(this.node.id);
      modeling.updateProperties(element, newProperties);
    },
    
    // 节点替换
    replaceElement(newElement) {
      const modeling = this.bpmnModeler.get('replace');
      const element = this.bpmnModeler.get('elementRegistry').get(this.node.id);
      this.oldElement = element;
      modeling.replaceElement(element, newElement)
    },
    // 导出bpmn
    exportBpnm() {
      let bpmnXml
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        bpmnXml = xml;
      });
      return bpmnXml;
    }
  }
}
</script>

<style>
.container.grid {
  background: white;
  overflow: auto;
  background-image: linear-gradient(90deg,rgba(220, 220, 220, 0.5) 6%,transparent 0), linear-gradient(rgba(192, 192, 192, 0.5) 6%, transparent 0);
  background-size: 12px 12px;
  width: 100%;
  height: 100%;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
.bpmn-canvas {
  width: 100%;
  height: 100%
}
.bpmn-icon-gateway-none.join:before {
  color: orange;
}
.bpmn-icon-gateway-none.split:before {
  color: blue;
}
.djs-element.join .djs-visual polygon {
  stroke:  orange !important;
}

.djs-element.join .djs-visual path {
  stroke:  orange !important;
  fill:  orange !important;
}

.djs-element.join .djs-visual circle {
  stroke:  orange !important;
}

.djs-element.split .djs-visual polygon {
  stroke:  blue !important;
}

.djs-element.split .djs-visual path {
  stroke:  blue !important;
  fill:  blue !important;
}

.djs-element.split .djs-visual circle {
  stroke:  blue !important;
}
</style>