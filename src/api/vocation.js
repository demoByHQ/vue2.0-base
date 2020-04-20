import { fetch } from '@/utils/fetch'

/**
 * 假期管理查询列表接口
 * @param {*} bodyParams
 */
export const vocationQuery = (bodyParams) => fetch({
  url: 'api/vocation/query',
  method: 'post',
  data: bodyParams,
})

// /**
//  * 新建休假保存接口
//  * @param {*} bodyParams
//  */
// export const vocationSave = (bodyParams) => fetch({
//   url: 'api/vocation/saveDataVacation',
//   method: 'post',
//   data: bodyParams
// });
//
// /**
//  * 新建休假提交接口
//  * @param {*} bodyParams
//  */
// export const vocationSubmit = (bodyParams) => fetch({
//   url: 'api/vocation/submit',
//   method: 'post',
//   data: bodyParams
// });

/**
 * 获取全部休假类型及其剩余天数接口
 * @param {*} bodyParams
 */
export const getVocationType = (bodyParams) => fetch({
  url: 'api/vocation/query',
  method: 'post',
  data: bodyParams,
})

/**
 * 通过开始时间和结束时间计算申请申请时长
 * @param {*} bodyParams
 */
export const calcApplyTime = (bodyParams) => fetch({
  url: 'api/vocation/CaculateLeaveLength',
  method: 'post',
  data: bodyParams,
})

/**
 * wx附件图片上传接口
 * @param {*} bodyParams
 */
export const wxAttachment = (bodyParams) => fetch({
  url: 'api/upload/wxAttachment',
  method: 'post',
  data: bodyParams,
})

/**
 * 假期记录查询接口
 * @param {*} bodyParams
 */
export const queryVocationRecord = (bodyParams) => fetch({
  url: 'api/myApply/queryVocationDetail',
  method: 'post',
  data: bodyParams,
})

export const myApplyQuery = (bodyParams) => fetch({
  url: 'api/myApply/query',
  method: 'post',
  data: bodyParams,
})

/**
 * 休假保存或提交
 * @param {*} bodyParams
 */
export const saveOrSubmit = (bodyParams) => fetch({
  url: 'api/vocation/saveOrSubmit',
  method: 'post',
  data: bodyParams,
})

/**
 * 审批同意通过 fBillNo 单据编号  fApprovalOpinion 同意意见
 * @param {*} bodyParams
 */
export const passWorkflowVacation = (bodyParams) => fetch({
  url: 'api/vocation/passWorkflowVacation',
  method: 'post',
  data: bodyParams,
})

/**
 * 休假工作流审批驳回   fBillNo 单据编号  fApprovalOpinion 驳回意见   fCurrentStep 驳回结点名称
 * @param {*} bodyParams
 */
export const rejectWorkflowVacation = (bodyParams) => fetch({
  url: 'api/vocation/rejectWorkflowVacation',
  method: 'post',
  data: bodyParams,
})

/**
 * 休假工作流审批召回 fBillNo 单据编号
 * @param {*} bodyParams
 */
export const recallWorkflowVacation = (bodyParams) => fetch({
  url: 'api/vocation/recallWorkflowVacation',
  method: 'post',
  data: bodyParams,
})

/**
 * 休假工作流审批召回 通过单据编号查找休假申请
 * @param {*} bodyParams
 */
export const getItemVacation = (bodyParams) => fetch({
  url: 'api/vocation/getItemVacation',
  method: 'post',
  data: bodyParams,
})
