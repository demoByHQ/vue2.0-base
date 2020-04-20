/**
 * Created by admin on 2017/7/19.
 * 异常管理
 */

import {fetch} from '@/utils/fetch'

/**
 * 异常列表查询接口
 * @param {*} params
 */
export const exceptionsQuery = (params) => fetch({
  url: 'api/exceptions/query',
  method: 'post',
  data: params,
})

// /**
//  * 补卡申请 保存接口
//  * @param {*} params
//  */
// export const reissueCardSave = (params) => fetch({
//   url: 'api/fclockinfo/saveDataFillClock',
//   method: 'post',
//   data: params
// });

/**
 * 补卡申请 保存 or 提交接口 固定值 save 或者submit
 * @param {*} params
 */
export const saveOrSubmit = (params) => fetch({
  url: 'api/fclockinfo/saveOrSubmit',
  method: 'post',
  data: params,
})

/**
 * 补卡申请流程 审批同意通过
 * @param {*} params
 */
export const clockAgree = (params) => fetch({
  url: 'api/fclockinfo/clockAgree',
  method: 'post',
  data: params,
})

/**
 * 补卡申请流程 驳回
 * @param {*} params
 */
export const clockReject = (params) => fetch({
  url: 'api/fclockinfo/clockReject',
  method: 'post',
  data: params,
})

/**
 * 补卡申请流程 审批召回
 * @param {*} params
 */
export const clockRecall = (params) => fetch({
  url: 'api/fclockinfo/clockRecall',
  method: 'post',
  data: params,
})

/**
 * 外出申请 通过单据编号查找补卡申请
 * @param {*} params
 */
export const getItemFillClock = (params) => fetch({
  url: 'api/fclockinfo/getItemFillClock',
  method: 'post',
  data: params,
})

