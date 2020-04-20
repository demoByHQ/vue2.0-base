import { fetch } from '@/utils/fetch'

/**
 * 翻译接口
 * @param {*} bodyParams
 */
export const translate = (bodyParams) => fetch({
  url: 'trans/vip/translate',
  method: 'POST',
  data: bodyParams,
})
