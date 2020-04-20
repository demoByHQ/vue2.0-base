/**
 * Created by admin on 2017/7/19.
 * 打卡
 */

import {fetch} from '@/utils/fetch'

/**
 * 获取打卡记录列表接口
 * @param {*} params
 */
export const fclockinfoQuery = (params) => fetch({
  url: 'api/fclockinfo/query',
  method: 'POST',
  data: params,
})

/**
 * 打卡提交接口
 * @param {*} params
 */
export const checkClockByPlace = (params) => fetch({
  url: 'api/fclockinfo/checkClockByPlace',
  method: 'POST',
  data: params,
})

/**
 * 获取打卡次数接口
 * @param {*} params
 */
export const clockTime = (params) => fetch({
  url: 'api/fclockinfo/clockTime',
  method: 'POST',
  data: params,
})
