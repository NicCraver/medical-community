// import 'utils/v-md-editor';
import 'style/global.scss';
import 'element-ui/lib/theme-chalk/index.css';
import 'vant/lib/index.css';
import 'utils/element-ui';
import 'utils/vant';
import 'style/var.less';
import AnxFormMaking from './AnxFormMaking';
import AnxForm from './AnxForm';

const components = [AnxFormMaking, AnxForm];
const install = function(Vue) {
  // 全局注册所有的组件
  components.forEach(item => {
    Vue.component(item.name, item);
  });
};

// 判断是否是直接引入文件,如果是，就不用调用 Vue.use()
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export { install, AnxFormMaking, AnxForm };

export default {
  install
};
