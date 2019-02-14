import fetch from '@/plugin/axios'

export function page(query) {
    return fetch({
        url: '/action/queryListWithPage',
        method: 'post',
        data: JSON.stringify(query)
    });
}

export function saveObj(obj) {
    return fetch({
        url: '/action/save',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function saveObjClass(obj) {
    return fetch({
        url: '/action/saveClass',
        method: 'post',
        data: JSON.stringify(obj)
    });
}

export function getObj(id) {
    return fetch({
        url: '/action/getActionById/' + id,
        method: 'post',
    })
}

export function delObj(id) {
    return fetch({
        url: '/action/deleteActionById/' + id,
        method: 'post'
    })
}
export function delObjBatch(ids) {
    return fetch({
        url: '/action/batchDeleteByIdList',
        method: 'post',
        data: JSON.stringify(ids)
    })
}

export function updateObj(id, obj) {
    return fetch({
        url: '/action/' + id,
        method: 'put',
        data: obj
    })
}
export function findClassAction(obj) {
    return fetch({
        url: '/action/findClassAction',
        method: 'post',
        data: JSON.stringify(obj)
    })
}
