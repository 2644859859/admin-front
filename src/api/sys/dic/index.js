import fetch from '@/plugin/axios'

export function fetchTree(query) {
    return fetch({
        url: '/dict/getTree',
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function saveObj(obj) {
    return fetch({
        url: '/dict/save',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function getObj(id) {
    return fetch({
        url: '/dict/queryById/' + id,
        method: 'post',
    })
}

export function delObj(id) {
    return fetch({
        url: '/dict/deleteById/' + id,
        method: 'post'
    })
}
