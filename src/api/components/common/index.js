import fetch from '@/plugin/axios'


export function fetchTree(url,query) {
    return fetch({
        url: url,
        method: 'post',
        data: JSON.stringify(query)
    });
}
export function page(url, query) {
    return fetch({
        url: url,
        method: 'post',
        data: JSON.stringify(query)
    });
}