import fetch from '@/plugin/axios'


export function fetchTree(query) {
    return fetch({
        url: '/role/getTree',
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function page(query) {
    return fetch({
        url: '/role/queryRoleListWithPage',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function getBindAction(id) {
    return fetch({
        url: '/role/getActionTreeByRoleId/'+id,
        method: 'post'
    })
}
export function getBindMenu(id) {
    return fetch({
        url: '/role/getMenuIdsByRoleId/'+id,
        method: 'post'
    })
}
export function bindAction(data) {
    return fetch({
        url: '/role/bindAction/',
        data: JSON.stringify(data),
        method: 'post'
    })
}
export function bindMenu(data) {
    return fetch({
        url: '/role/bindMenu/',
        data: JSON.stringify(data),
        method: 'post'
    })
}

export function saveObj(obj) {
    return fetch({
        url: '/role/save',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function getObj(query) {
    return fetch({
        url: '/role/query',
        method: 'post',
        data: JSON.stringify(query)
    })
}

export function getObjById(id) {
    return fetch({
        url: '/role/queryById/' + id,
        method: 'post',
    })
}

export function delObj(id) {
    return fetch({
        url: '/role/deleteRoleById/' + id,
        method: 'post'
    })
}

export function delObjBatch(ids) {
    return fetch({
        url: '/role/batchDeleteByIdList',
        method: 'post',
        data: JSON.stringify(ids)
    })
}

export function putObj(obj) {
    return fetch({
        url:  '/role/save',
        method: 'post',
        data: JSON.stringify(obj)
    })
}
