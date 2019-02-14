import fetch from '@/plugin/axios'

export function fetchTree(query) {
    return fetch({
        url: '/wf/bus/getTree',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function addObj(obj) {
    return fetch({
        url: '/wf/bus/save',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function getObj(id) {
    return fetch({
        url: '/wf/bus/queryById/' + id,
        method: 'post',
    })
}

export function delObj(id) {
    return fetch({
        url: '/wf/bus/deleteById/' + id,
        method: 'post'
    })
}

export function deploy(modelId) {
    return fetch({
        url: '/wf/bus/deployByMId',
        method: 'post',
        data: JSON.stringify({modelId:modelId})
    })
}