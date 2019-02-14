import playground from './modules/playground'
import frame from './modules/frame'
import d2Crud from './modules/d2-crud'
import plugins from './modules/plugins'
import charts from './modules/charts'
import components from './modules/components'
import element from './modules/element'
import business from './modules/business'

import layoutHeaderAside from '@/layout/header-aside'

const meta = {auth: true, cache: true}

/**
 * 在主框架内显示
 */
const frameIn = [
    {
        path: '/',
        redirect: {name: 'index'},
        component: layoutHeaderAside,
        children: [
            // 首页 必须 name:index
            {
                path: 'index',
                name: 'index',
                meta,
                component: () => import('@/pages/index')
            },
            // 刷新页面 必须保留
            {
                path: 'refresh',
                name: 'refresh',
                hidden: true,
                component: {
                    beforeRouteEnter(to, from, next) {
                        next(vm => vm.$router.replace(from.fullPath))
                    },
                    render: h => h()
                }
            },
            // 页面重定向 必须保留
            {
                path: 'redirect/:route*',
                name: 'redirect',
                hidden: true,
                component: {
                    beforeRouteEnter(to, from, next) {
                        next(vm => vm.$router.replace(JSON.parse(from.params.route)))
                    },
                    render: h => h()
                }
            }
        ]
    },
    {
        path: '/uas',
        name: 'uas',
        meta,
        redirect: {name: 'uas-role/list'},
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'role/list',
                name: `${pre}role-list`,
                component: () => import('@/pages/sys/role/index'),
                meta: {...meta, title: '角色管理'}
            },
            {
                path: 'user/list',
                name: `${pre}user-list`,
                component: () => import('@/pages/sys/user/index'),
                meta: {...meta, title: '用户管理'}
            },
            {
                path: 'menu/list',
                name: `${pre}menu/list`,
                component: () => import('@/pages/sys/menu/index'),
                meta: {...meta, title: '菜单管理'}
            },
            {
                path: 'action/list',
                name: `${pre}action/list`,
                component: () => import('@/pages/sys/action/index'),
                meta: {...meta, title: '权限管理'}
            },
            {
                path: 'group/list',
                name: `${pre}group/list`,
                component: () => import('@/pages/sys/group/index'),
                meta: {...meta, title: '组织管理'}
            },
            {
                path: 'group/list',
                name: `${pre}monitor/zipkin`,
                component: () => import('@/pages/demo/playground/db/page-snapshot-user'),
                meta: {...meta, title: '调用链监控'}
            },
            {
                path: 'monitor/zipkin',
                name: `${pre}monitor/boot`,
                component: () => import('@/pages/demo/playground/log/log'),
                meta: {...meta, title: '监控报警'}
            },
            {
                path: 'monitor/swagger',
                name: `${pre}monitor/swagger`,
                component: () => import('@/pages/demo/playground/log/error'),
                meta: {...meta, title: '接口文档'}
            },
            {
                path: 'monitor/druid',
                name: `${pre}monitor/druid`,
                component: () => import('@/pages/demo/playground/log/console'),
                meta: {...meta, title: '数据库监控'}
            },
            {
                path: 'monitor/log',
                name: `${pre}monitor/log`,
                component: () => import('@/pages/demo/playground/env'),
                meta: {...meta, title: '操作日志监控'}
            },
            {
                path: 'monitor/token',
                name: `${pre}monitor/token`,
                component: () => import('@/pages/demo/playground/db/page-user'),
                meta: {...meta, title: '登录密钥监控'}
            },
            {
                path: 'monitor/exception',
                name: `${pre}monitor/exception`,
                component: () => import('@/pages/demo/playground/db/page-snapshot-public'),
                meta: {...meta, title: '异常日志监控'}
            },
        ])('uas-')
    },
    {
        path: '/wf',
        name: 'wf',
        meta,
        redirect: {name: 'uas-role/list'},
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'acModel/list',
                name: `${pre}acModel/list`,
                component: () => import('@/pages/sys/activiti/model/index'),
                meta: {...meta, title: '模型配置'}
            },
            {
                path: 'business/list',
                name: `${pre}business/list`,
                component: () => import('@/pages/sys/activiti/business/index'),
                meta: {...meta, title: '流程业务'}
            },
            {
                path: 'test/list',
                name: `${pre}test/list`,
                component: () => import('@/pages/sys/activiti/test/index'),
                meta: {...meta, notCache: true, title: '审批过程'}
            },
            {
                path: 'test2/list',
                name: `${pre}test2/list`,
                component: () => import('@/pages/sys/activiti/test/index2'),
                meta: {...meta, notCache: true, title: '测试任务2'}
            },
            {
                path: 'task/list',
                name: `${pre}task/list`,
                component: () => import('@/pages/sys/activiti/task/index'),
                meta: {...meta, notCache: true, title: '任务列表'}
            },
            {
                path: 'shipping/list',
                name: `${pre}shipping/list`,
                component: () => import('@/pages/demo/playground/page-cache/off.vue'),
                meta: {...meta, notCache: true, title: '审批过程'}
            },
        ])('oms-')
    },
    {
        path: '/oms',
        name: 'oms',
        meta,
        redirect: {name: 'oms-product/list'},
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'product/list',
                name: `${pre}product/list`,
                component: () => import('@/pages/demo/playground/index'),
                meta: {...meta, title: '商品管理'}
            },
            {
                path: 'order/list',
                name: `${pre}order/list`,
                component: () => import('@/pages/demo/playground/page-cache/on.vue'),
                meta: {...meta, title: '订单管理'}
            },
            {
                path: 'shipping/list',
                name: `${pre}shipping/list`,
                component: () => import('@/pages/demo/playground/page-cache/off.vue'),
                meta: {...meta, notCache: true, title: '收货地址'}
            },
            {
                path: 'category/list',
                name: `${pre}category/list`,
                component: () => import('@/pages/demo/playground/page-argu/send.vue'),
                meta: {...meta, title: '商品分类'}
            },
            {
                path: 'cart/list',
                name: `${pre}cart/list`,
                component: () => import('@/pages/demo/playground/page-argu/get.vue'),
                meta: {...meta, title: '购物车管理'}
            },
        ])('oms-')
    },
    {
        path: '/mds',
        name: 'mds',
        meta,
        redirect: {name: 'mds-dict/list'},
        component: layoutHeaderAside,
        children: (pre => [
            {
                path: 'dict/list',
                name: `${pre}dict/list`,
                component: () => import('@/pages/sys/dic/index'),
                meta: {...meta, title: '数据字典'}
            },
            {
                path: 'topic/list',
                name: `${pre}topic/list`,
                component: () => import('@/pages/demo/playground/page-cache/on.vue'),
                meta: {...meta, title: 'Topic管理'}
            },
            {
                path: 'producer/list',
                name: `${pre}producer/list`,
                component: () => import('@/pages/demo/playground/page-cache/off.vue'),
                meta: {...meta, notCache: true, title: '生产者管理'}
            },
            {
                path: 'consumer/list',
                name: `${pre}consumer/list`,
                component: () => import('@/pages/demo/playground/page-argu/send.vue'),
                meta: {...meta, title: '消费者管理'}
            },
            {
                path: 'publish/list',
                name: `${pre}publish/list`,
                component: () => import('@/pages/demo/playground/index'),
                meta: {...meta, title: '发布管理'}
            },
            {
                path: 'subscribe/list',
                name: `${pre}subscribe/list`,
                component: () => import('@/pages/demo/playground/page-cache/on.vue'),
                meta: {...meta, title: '订阅管理'}
            },
            {
                path: 'message/reliable',
                name: `${pre}message/reliable`,
                component: () => import('@/pages/demo/playground/page-cache/off.vue'),
                meta: {...meta, notCache: true, title: '可靠消息'}
            },
            {
                path: 'message/record',
                name: `${pre}message/record`,
                component: () => import('@/pages/demo/playground/page-argu/send.vue'),
                meta: {...meta, title: '消息记录'}
            }
        ])('mds-')
    },
    playground,
    frame,
    d2Crud,
    plugins,
    charts,
    components,
    element,
    business
]

/**
 * 在主框架之外显示
 */
const frameOut = [
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/login')
    }
]

/**
 * 错误页面
 */
const errorPage = [
    // 404
    {
        path: '*',
        name: '404',
        component: () => import('@/pages/error-page-404')
    }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
    ...frameIn,
    ...frameOut,
    ...errorPage
]
