/**
 * Created by admin on 2017/7/27.
 */
import {fetch} from '@/utils/fetch'

/**
 * 我的审批列表查询接口
 * @param {*} params
 */
export const myExamineQuery = (params) => fetch({
  url: 'api/myApply/query',
  method: 'post',
  data: params,
})

/**
 * 审批历史接口 /api/vocation/GetWFApprove
 * @param {*} params
 */
export const GetWFApprove = (params) => fetch({
  url: 'api/vocation/GetWFApprove',
  method: 'post',
  data: params,
})
