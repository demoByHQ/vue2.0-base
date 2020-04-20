import { fetch } from '@/utils/fetch'

/**
 * 我的申请状态查询接口
 * @param {*} bodyInfos eg. {
 *     'fApplyer': '2',
 *     'fMultiCheckStatus': 1
 *   }
 */
// export const myApplyQuery = (bodyInfos) => fetch({
//   url: 'api/fclockinfo/getWFBillsFillClockJson',
//   method: 'post',
//   data: bodyInfos
// });

export const myApplyQuery = (bodyInfos) => fetch({
  url: 'api/myApply/query',
  method: 'post',
  data: bodyInfos,
})

/**
 * 查询所有假期类型
 * @param {*} params
 */
export const vocationAll = (params) => fetch({
  url: 'api/vocation/All',
  method: 'post',
  data: params,
})

/**
 * 判断当前单据审批人 /api/myApply/check
 * @param {*} params
 */
export const check = (params) => fetch({
  url: 'api/myApply/check',
  method: 'post',
  data: params,
})

/**
 * 判断当前是否能撤回  /api/myApply/checkStatus
 * @param {*} params
 */
export const checkStatus = (params) => fetch({
  url: 'api/myApply/checkStatus',
  method: 'post',
  data: params,
})
