import ajax from '@/plugin/axios'

export function httpGet (url, params = {}) {
  return ajax({
    url,
    method: 'get',
    params
  })
}

export function httpPost (url, data = {}) {
  return ajax({
    url,
    method: 'post',
    data
  })
}
