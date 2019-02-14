import fetch from '@/plugin/axios'

export function startProcessInstance(obj) {
    return fetch({
        url: '/wf/bus/startProcessInstance',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function saveCheck(obj) {
    return fetch({
        url: '/wf/bus/completeTask',
        method: 'post',
        data: JSON.stringify(obj)
    });
}


export function testPage(obj) {
    return fetch({
        url: '/user/queryListWithPageTest',
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