/**
 * Created by admin on 2017/7/19.
 * 我的排班
 */

import {fetch} from '@/utils/fetch'

export const schedulingQuery = (params) => fetch({
  url: 'api/scheduling/query',
  method: 'post',
  data: params,
})

// export const vocationQuery = ()=> fetch({
//   url: 'vocation/query',
//   method: 'post',
// });
