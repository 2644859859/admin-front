import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'
//import store from 'src/store.js'


Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes
})

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start()
  // 关闭搜索面板
  store.commit('d2admin/search/set', false)
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some(r => r.meta.auth)) {
    // 这里暂时将cookie里是否存有token作为验证是否登录的条件
    // 请根据自身业务需要修改
      store.dispatch('d2admin/rights/get_access_token', (res) => {
          if (!!res) {
              const hasLoad = store.getters["d2admin/account/getHasLoad"];
              if(!hasLoad){
                  store.dispatch('d2admin/account/load')
              }
              next();
          } else {
              util.cookies.set('redirect', to.fullPath)
              next({
                  name: 'login'
              })
              NProgress.done()
          }
      });
  } else {
    // 不需要身份校验 直接通过
    next()
  }
})

router.afterEach(to => {
  // 进度条
  NProgress.done()
  // 需要的信息
  const app = router.app
  const { name, params, query, fullPath } = to
  // 多页控制 打开新的页面
  app.$store.dispatch('d2admin/page/open', { name, params, query, fullPath })
  // 更改标题
  util.title(to.meta.title)
})

export default router
