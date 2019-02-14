import request from '@/plugin/axios'

export function ComponentsMarkdownBase (url) {
  return request({
    baseURL: process.env.BASE_URL_R,
    url,
    method: 'get'
  })
}
