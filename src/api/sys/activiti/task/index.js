import fetch from '@/plugin/axios'

export function getTaskList(query) {
    return fetch({
        url: '/wf/bus/getTaskListByModelId',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function nodeBindRole(query) {
    return fetch({
        url: '/wf/bus/nodeBindRole',
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function nodeBindUser(query) {
    return fetch({
        url: '/wf/bus/nodeBindUser',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function getNodeBindUser(query) {
    return fetch({
        url: '/wf/bus/getNodeBindUser',
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function getNodeBindRole(query) {
    return fetch({
        url: '/wf/bus/getNodeBindRole',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function findHisByBusId(query) {
    return fetch({
        url: '/wf/audiHis/findHisByBusId',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function viewProcessInstanceImage(query) {
    return fetch({
        url: '/wf/bus/viewProcessInstanceImage',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function findComming(query) {
    return fetch({
        url: '/wf/bus/myUpcoming',
        method: 'post',
        data: JSON.stringify(query)
    });
}




