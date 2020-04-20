/**
 * Created by admin on 2017/7/18.
 * 外出申请
 */

import {fetch} from '@/utils/fetch'

// /**
//  * 外出申请 保存接口
//  * @param {*} params
//  */
// export const SaveData = (params) => fetch({
//   url: 'api/evection/saveDataGoOut',
//   method: 'post',
//   data: params
// });

/**
 * 外出申请 保存提交接口
 * @param {*} params
 */
export const saveOrSubmit = (params) => fetch({
  url: 'api/evection/saveOrSubmit',
  method: 'post',
  data: params,
})

/**
 * 外出申请 同意
 * @param {*} params
 */
export const passWorkflowGoOut = (params) => fetch({
  url: 'api/evection/passWorkflowGoOut',
  method: 'post',
  data: params,
})

/**
 * 外出申请 驳回
 * @param {*} params
 */
export const rejectWorkflowGoOut = (params) => fetch({
  url: 'api/evection/rejectWorkflowGoOut',
  method: 'post',
  data: params,
})

/**
 * 外出申请 召回
 * @param {*} params
 */
export const recallWorkflowGoOut = (params) => fetch({
  url: 'api/evection/recallWorkflowGoOut',
  method: 'post',
  data: params,
})

/**
 * 外出申请 通过单据编号查找详情
 * @param {*} params
 */
export const getItemGoOut = (params) => fetch({
  url: 'api/evection/getItemGoOut',
  method: 'post',
  data: params,
})
