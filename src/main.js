import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import './assets/fonts/iconfont.css'
import './assets/css/base.less'
import './ip/index.js'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import moment from 'moment'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.filter('dateFormat', date1 => {
  return moment(date1).format('YYYY-MM-DD hh-mm-ss')
})
Vue.use(VueQuillEditor)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
