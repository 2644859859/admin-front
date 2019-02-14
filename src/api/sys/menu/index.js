import fetch from '@/plugin/axios'

export function fetchTree(query) {
    return fetch({
        url: '/menu/getTree',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function fetchAll() {
    return fetch({
        url: '/menu/all',
        method: 'get'
    });
}
export function addObj(obj) {
    return fetch({
        url: '/menu/save',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function getObj(id) {
    return fetch({
        url: '/menu/queryById/' + id,
        method: 'post',
    })
}

export function delObj(id) {
    return fetch({
        url: '/menu/deleteById/' + id,
        method: 'post'
    })
}

export function updateObj(id, obj) {
    return fetch({
        url: '/menu/' + id,
        method: 'put',
        data: obj
    })
}