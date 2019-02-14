import layoutHeaderAside from '@/layout/header-aside'

const meta = { auth: true }

export default {
    path: '/uas',
        name: 'uas',
    meta,
    redirect: { name: 'uas-role/list' },
    component: layoutHeaderAside,
        children: (pre => [
    { path: 'role/list', name: `${pre}role-list`, component: () => import('@/pages/uas/user/role/role.vue'), meta: { ...meta, title: '角色管理' } },
    { path: 'user/list', name: `${pre}user-list`, component: () => import('@/pages/uas/user/user/user.vue'), meta: { ...meta, title: '用户管理' } },
    { path: 'menu/list', name: `${pre}menu/list`, component: () => import('@/pages/demo/playground/db/page-public'), meta: { ...meta, title: '菜单管理' } },
    { path: 'action/list', name: `${pre}action/list`, component: () => import('@/pages/demo/playground/db/page-user'), meta: { ...meta, title: '权限管理' } },
    { path: 'db/page-snapshot-public', name: `${pre}group/list`, component: () => import('@/pages/demo/playground/db/page-snapshot-public'), meta: { ...meta, title: '组织管理' } },
    { path: 'group/list', name: `${pre}monitor/zipkin`, component: () => import('@/pages/demo/playground/db/page-snapshot-user'), meta: { ...meta, title: '调用链监控' } },
    { path: 'monitor/zipkin', name: `${pre}monitor/boot`, component: () => import('@/pages/demo/playground/log/log'), meta: { ...meta, title: '监控报警' } },
    { path: 'monitor/swagger', name: `${pre}monitor/swagger`, component: () => import('@/pages/demo/playground/log/error'), meta: { ...meta, title: '接口文档' } },
    { path: 'monitor/druid', name: `${pre}monitor/druid`, component: () => import('@/pages/demo/playground/log/console'), meta: { ...meta, title: '数据库监控' } },
    { path: 'monitor/log', name: `${pre}monitor/log`, component: () => import('@/pages/demo/playground/env'), meta: { ...meta, title: '操作日志监控' } },
    { path: 'monitor/token', name: `${pre}monitor/token`, component: () => import('@/pages/demo/playground/db/page-user'), meta: { ...meta, title: '登录密钥监控' } },
    { path: 'monitor/exception', name: `${pre}monitor/exception`, component: () => import('@/pages/demo/playground/db/page-snapshot-public'), meta: { ...meta, title: '异常日志监控' } },
])('uas-')
}
