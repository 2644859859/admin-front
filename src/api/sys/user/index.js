import fetch from '@/plugin/axios'

export function page(query) {
    return fetch({
        url: '/user/queryListWithPage',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function addObj(obj) {
    return fetch({
        url: '/user/save',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function getBindRole(id) {
    return fetch({
        url: '/user/getBindRole/'+id,
        method: 'post'
    })
}

export function getBindAction(id) {
    return fetch({
        url: '/user/getBindAction/'+id,
        method: 'post'
    })
}
export function getBindMenu(id) {
    return fetch({
        url: '/user/getBindMenu/'+id,
        method: 'post'
    })
}

export function bindRole(data) {
    return fetch({
        url: '/user/bindRole/',
        data: JSON.stringify(data),
        method: 'post'
    })
}
export function bindAction(data) {
    return fetch({
        url: '/user/bindAction/',
        data: JSON.stringify(data),
        method: 'post'
    })
}
export function bindMenu(data) {
    return fetch({
        url: '/user/bindMenu/',
        data: JSON.stringify(data),
        method: 'post'
    })
}

export function getObj(id) {
    return fetch({
        url: '/user/getUacUserById/'+id,
        method: 'post'
    })
}

export function delObj(id) {
    return fetch({
        url: '/user/deleteUserById/' + id,
        method: 'post'
    })
}

export function delObjBatch(ids) {
    return fetch({
        url: '/user/batchDeleteByIdList',
        method: 'post',
        data: JSON.stringify(ids)
    })
}

export function putObj(obj) {
    return fetch({
        url:  '/user/save',
        method: 'post',
        data: JSON.stringify(obj)
    })
}
