import Vue from 'vue';
import { RadioGroup, Radio, Cell, CellGroup } from 'vant';

import { Form } from 'vant';
import { Field } from 'vant';
import { Button } from 'vant';
import { Checkbox, CheckboxGroup } from 'vant';
import { Popup } from 'vant';
import { Picker } from 'vant';
import {
  IndexBar,
  IndexAnchor,
  Collapse,
  CollapseItem,
  Search,
  Empty,
  DatetimePicker
} from 'vant';

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(IndexBar);
Vue.use(IndexAnchor);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Button);
Vue.use(Form);
Vue.use(Field);
Vue.use(Radio);
Vue.use(RadioGroup);

Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Search);
Vue.use(Empty);
Vue.use(DatetimePicker);
