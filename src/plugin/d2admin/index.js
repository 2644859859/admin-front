// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// flex 布局库
import 'flex.css'
// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'

import '@/assets/iconfont/iconfont.css'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

// 功能插件
import pluginError from '@/plugin/error'
import pluginExport from '@/plugin/export'
import pluginImport from '@/plugin/import'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'
import ELTreeSelect from 'el-tree-select';

import ajax from '@/plugin/axios'
import vueWaves from '@/directive/waves';// 水波纹指令
/*import VueAreaLinkage from 'vue-area-linkage';
import 'vue-area-linkage/dist/index.css';
import vRegion from 'v-region';*/
import '@/assets/iconfont/iconfont.js'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示。https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL

    Vue.prototype.$http = ajax
    // Element
    Vue.use(ElementUI)
    // 插件
    Vue.use(pluginError)
    Vue.use(pluginExport)
    Vue.use(pluginImport)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)

    Vue.use(vueWaves);
    Vue.use(VueAreaLinkage)
    Vue.use(vRegion)
  }
}
