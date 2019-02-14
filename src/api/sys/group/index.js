import fetch from '@/plugin/axios'

export function fetchTree(query) {
    return fetch({
        url: '/group/getTree',
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function saveObj(obj) {
    return fetch({
        url: '/group/save',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function getObj(id) {
    return fetch({
        url: '/group/queryById/' + id,
        method: 'post',
    })
}

export function delObj(id) {
    return fetch({
        url: '/group/deleteById/' + id,
        method: 'post'
    })
}
