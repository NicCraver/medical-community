import { assign } from 'min-dash';
import paletteConfig from '../config/palette';


export default function PaletteProvider(
  palette,
  create,
  elementFactory,
  handTool,
  lassoTool,
  spaceTool,
  globalConnect,
  translate
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.handTool = handTool;
  this.lassoTool = lassoTool;
  this.spaceTool = spaceTool;
  this.globalConnect = globalConnect;
  this.translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'handTool',
  'lassoTool',
  'spaceTool',
  'globalConnect',
  'translate'
];

PaletteProvider.prototype.getPaletteEntries = function (element) {
  const {
    create,
    elementFactory,
    handTool,
    lassoTool,
    spaceTool,
    globalConnect,
    translate
  } = this;

  function createAction(type, group, className, title, options, selfConfig) {
    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      if (selfConfig) {
        shape.businessObject.selfConfig = selfConfig;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }
  const selfPalette = {};
  for(const key in paletteConfig) {
    const { type, group, className, title, options, selfConfig } = paletteConfig[key];
    selfPalette[key] = createAction(type, group, className, title, options, selfConfig)
  }
  console.log('selfPalette', selfPalette)
  return {
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: '框选',
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: '连线',
      action: {
        click: function (event) {
          globalConnect.toggle(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    ...selfPalette
  };
};
