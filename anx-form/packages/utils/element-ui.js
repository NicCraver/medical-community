import Vue from 'vue';
import {
  Button,
  Input,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Divider,
  RadioGroup,
  Radio,
  RadioButton,
  CheckboxGroup,
  Checkbox,
  DatePicker,
  Select,
  Option,
  Switch,
  Dialog,
  Message,
  InputNumber,
  Row,
  Col,
  Rate,
  Transfer,
  PageHeader,
  Upload,
  Collapse,
  CollapseItem,
  Table,
  TableColumn,
  Drawer,
  Pagination,
  MessageBox
} from 'element-ui';
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Divider);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Switch);
Vue.use(Dialog);
Vue.use(InputNumber);
Vue.use(Row);
Vue.use(Col);
Vue.use(Rate);
Vue.use(Transfer);
Vue.use(PageHeader);
Vue.use(Upload);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Drawer);
Vue.use(Pagination);

const $message = options => {
  return Message({
    ...options,
    offset: 60
  });
};

['success', 'warning', 'info', 'error', 'confirm'].forEach(type => {
  $message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        offset: 60
      };
    }
    options.type = type;
    return Message(options);
  };
});

Vue.prototype.$message = $message;
Vue.prototype.$messageBox = MessageBox;
