import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '../lib/anx-vue.css'
import './style/theme/index.css'
// import './style/element-ui.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
