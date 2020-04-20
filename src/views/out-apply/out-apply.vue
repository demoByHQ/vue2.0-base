<template>
  <div class="out-apply">

    <div v-if="id == '16' || (fStatus =='1' && id =='4')" class="history-head">
      <img src="../../assets/images/approve-history.png" alt="" width="15px">
      <span>审核历史</span>
    </div>

    <div class="timeline-box" v-if="id == '16' || (fStatus =='1' && id =='4')">
      <ul v-show="showDetailHistory">
        <li v-for="(item, index) in approveHistoryList">
          <img v-if='index == approveHistoryList.length-1' src="../../assets/images/current-circle.png"
               class="process-cicrle-img" alt="process-circle">
          <img v-else src="../../assets/images/process-circle.png" class="process-cicrle-img" alt="process-circle">
          <div class="time-tail-line" :class="{'time-tail-line-end': index == approveHistoryList.length - 1}"></div>
          <div class="main-content">
            <flexbox :gutter="0">
              <flexbox-item :span="6">
                {{item.fStepFlagName}} {{item.fItemName}} {{item.fStatusResult}}
              </flexbox-item>
              <flexbox-item :span="6" align="right">
                <img src="../../assets/images/approved.png" class="approve-img" alt="approve">
                <!-- <img src="../../assets/images/wait-approve.png" class="approve-img" alt="approve"> -->
                <span class="time">{{item.fCreateTime}}</span>
              </flexbox-item>
            </flexbox>
            <p class="desc-content">
              {{item.fComment}}
            </p>
          </div>
        </li>
      </ul>
      <div @click="showDetailHistory = !showDetailHistory">
        <img src="../../assets/logo.png" alt="" width="20px" class="change-down-arrow"
             :class="{'change-up-arrow': !showDetailHistory}"></div>
    </div>

    <group style="margin-top: -21px">

      <selector style="margin-left: -7px" placeholder="申请类型" v-model="params.fApplyType" title="申请类型"
                name="district" :options="list" @on-change="onChange" :readonly="this.status==='1'"></selector>

      <datetime v-model="params.fStartTime" format="YYYY-MM-DD HH:mm" :title="'开始时间'"
                @on-change="changeStart" :readonly="this.status==='1'"></datetime>

      <datetime v-model="params.fEndTime" format="YYYY-MM-DD HH:mm" :title="'结束时间'" @on-change="changeEnd"
                :readonly="this.status==='1'"></datetime>

      <cell :title="'申请时长'" :value="params.applyTime" :readonly="this.status==='1'"></cell>

      <cell readonly :title="'申请原因'"></cell>

      <x-textarea class="text-area" v-model="params.applyReason" autosize :max="200"
                  :readonly="this.status==='1'"></x-textarea>

    </group>

    <foot-button v-if="fStatus ==='4' && id == '2'" left-button="保存" right-button="提交" @leftButtonEvent="save"
                 @rightButtonEvent="submit"></foot-button>

    <group v-if="fStatus ==='1' && id == '4'" style="margin-bottom:55px">
      <cell readonly :title="'审批意见'"></cell>
      <x-textarea class="text-area" :max="200" v-model="params.fApprovalOpinion" autosize></x-textarea>
    </group>

    <foot-button v-if="fStatus ==='1' && id == '4'" left-button="驳回" right-button="同意" @leftButtonEvent="refuse"
                 @rightButtonEvent="agree"></foot-button>

    <!--<group v-if="fStatus ==='4' && id == '4'" style="margin-bottom:55px">-->
    <!--<cell :title="'撤销原因'"></cell>-->
    <!--<x-textarea class="text-area" :max="200" v-model="params.backoutReason" autosize></x-textarea>-->
    <!--</group>-->

    <x-button class="revoke-button" @click.native="revoke" v-if="fStatus ==='4' && id == '4'">撤 销</x-button>

    <divider v-if="saveSuccess" style="margin-bottom: 50px;">信息保存完成!</divider>

  </div>
</template>

<script>

  import WX_CONFIGS from '@/utils/wx-config'
import {DateDiff, formatDateTime} from '@/utils/common'
  import {
    saveOrSubmit,
    passWorkflowGoOut,
    rejectWorkflowGoOut,
    recallWorkflowGoOut,
    getItemGoOut,
  } from '@/api/out-apply'
  import footButton from 'components/out-apply/foot-button.vue'
import {XButton, Selector, Group, XTextarea, Datetime, Toast, Cell, Flexbox, FlexboxItem, Divider} from 'vux'
  import {calcApplyTime} from '@/api/vocation'
import {GetWFApprove} from '@/api/my-approve'
  import axios from 'axios'
  import router from '@/router'
  import {check, checkStatus} from '@/api/my-apply'

export default {
    name: 'outApply',
    components: {
      DateDiff,
    formatDateTime,
    footButton,
    XButton,
      Selector,
    Group,
    XTextarea,
    Datetime,
    Toast,
    Cell,
    Flexbox,
    FlexboxItem,
    Divider,
    },
    data () {
      return {
        isMessage: false, // 是否是消息推送
        saveSuccess: false,
        showDetailHistory: true,
        id: '2',
        status: '0',
        fStatus: '4',
        params: {
          saveSuccess: false,
          fBillNo: Date.parse(new Date()),
          fApplyDate: '',
          applyTime: '',
          fStartTime: '',
          fEndTime: '',
          fApplyType: '',
          applyReason: '',
          fid: '',                         // (决定保存还是提交) 固定值 save 或者submit
          backoutReason: '',               // 撤回原因
          fApprovalOpinion: '',            // 同意驳回意见
          fBiller: '',                     // 驳回人
          fClassTypeId: '',                // 单据类别
          Node: '',                        // 驳回结点名称
        },
        list: [{key: 'CN-出差', value: '出差申请'}, {key: 'CN-外出', value: '外出申请'}],
        approveHistoryList: [],
      }
    },
    created () {
      // 权限数据状态(0我参与的, 1我待批的，2已审批的，4 我的申请)
      // 审批状态（2：初始  4：进行中 16：结束  32：中止）// status  0 可编辑; 1 不可编辑;
      console.log(JSON.stringify(this.$route.params.outApply))
      if (this.$route.params.outApply) { // 外出信息修改
      if (this.$route.params.fStatus === '4') { // 4 我的申请
          this.fStatus = '4'
        if (this.$route.params.id === '2') { // 待提交  保存 提交
            this.id = '2'
          this.status = '0'
        } else if (this.$route.params.id === '4') { // 审批中 撤回
            this.status = '1'
          this.isCheckStatus(this.$route.params.outApply.fBillNo, this.$route.params.outApply.fClassTypeId)
          } else if (this.$route.params.id === '16') { // 已审批 查看历史
          this.status = '1'
          this.id = '16'
          this.getHistory(this.$route.params.outApply.fBillNo, this.$route.params.outApply.fClassTypeId)
        }
        } else if (this.$route.params.fStatus === '2') { // 2已审批的
          this.fStatus = '2'
        this.status = '1'
        this.id = '16'
        this.getHistory(this.$route.params.outApply.fBillNo, this.$route.params.outApply.fClassTypeId)
        } else if (this.$route.params.fStatus === '1') { // 1我待批的
        this.getHistory(this.$route.params.outApply.fBillNo, this.$route.params.outApply.fClassTypeId)
        if (this.$route.params.id === '4') { // 审批
          this.fStatus = '1'
          this.status = '1'
          this.id = '4'
        }
        this.getHistory(this.$route.params.outApply.fBillNo, this.$route.params.outApply.fClassTypeId)
      }

      let outApplyItem = this.$route.params.outApply
      this.params.fBillNo = outApplyItem.fBillNo
      this.params.fApplyType = outApplyItem.fApplyType
      this.params.fStartTime = outApplyItem.fStartTime.substring(0, outApplyItem.fStartTime.length - 3)
      this.params.fEndTime = outApplyItem.fEndTime.substring(0, outApplyItem.fStartTime.length - 3)
      this.params.applyTime = outApplyItem.applyTime
      this.params.applyReason = outApplyItem.applyReason
      this.params.fBiller = outApplyItem.fBiller
      this.params.fClassTypeId = outApplyItem.fClassTypeId
    }
    },
    mounted () {
      if (window.location.hostname === 'localhost') {
        return
      } else {
        let WxUrlObj = {}
        let urlParamsArrays = window.location.href.split('?')
        let urlParamsArray = urlParamsArrays[1].substring(1).split('&')
        urlParamsArray.forEach((item, index, array) => {
        let pos = item.indexOf('=')
        if (pos == '-1') {
        } else {
          WxUrlObj[item.split('=')[0]] = item.split('=')[1]
        }
      })
        let that = this
        if (WxUrlObj.fBillNo && WxUrlObj.fClassTypeId) {
        that.isMessage = true
        let loginUrl = 'http://60.191.94.124:8092/core/oauth/token?client_id=client' +
            '&client_secret=secret&grant_type=password&username=' + WxUrlObj.code + '&password=' + WxUrlObj.code
        let instance = axios.create({
          timeout: 30000,
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        instance.post(loginUrl).then(function (response) {
            // success callback
          if (response && response.data && typeof response.data === 'object' && response.data.access_token) {
              window.localStorage.setItem('ACCESS_TOKEN', response.data.access_token)
              getItemGoOut({'fBillNo': WxUrlObj.fBillNo }).then(response => {
              console.log(JSON.stringify(response))
              if (response.data.success) {
                that.$vux.loading.hide()
                that.$vux.toast.text(response.data.message, 'middle')
                that.params.fBillNo = response.data.rows[0].fBillNo
                that.params.fApplyType = response.data.rows[0].fApplyType
                that.params.fStartTime = response.data.rows[0].fStartTime.substring(0, response.data.rows[0].fStartTime.length - 3)
                that.params.fEndTime = response.data.rows[0].fEndTime.substring(0, response.data.rows[0].fStartTime.length - 3)
                that.params.applyTime = response.data.rows[0].applyTime
                that.params.applyReason = response.data.rows[0].applyReason
                that.params.fBiller = response.data.rows[0].fBiller
                that.params.fClassTypeId = response.data.rows[0].fClassTypeId

                if (WxUrlObj.fStatus === '4') { // 4 我的申请
                  that.fStatus = '4'
                  if (response.data.rows[0].fMultiCheckStatus === '2') { // 待提交  保存 提交
                      that.status = '0'
                    that.id = '2'
                  } else if (response.data.rows[0].fMultiCheckStatus === '4') { // 审批中 撤回
                      that.status = '1'
                    that.isCheckStatus(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId)
                    } else if (response.data.rows[0].fMultiCheckStatus === '16') { // 已审批 查看历史
                    that.status = '1'
                    that.id = '16'
                    that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId)
                  }
                } else if (WxUrlObj.fStatus === '2') { // 2已审批的
                    that.fStatus = '2'
                  that.status = '1'
                  that.id = '16'
                  that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId)
                  } else if (WxUrlObj.fStatus === '1') { // 1我待批的
                  if (response.data.rows[0].fMultiCheckStatus === '4') { // 审批
                      that.status = '1'
                    that.checkApprover(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId)
                    } else if (response.data.rows[0].fMultiCheckStatus === '16') { // 已审批 查看历史
                    that.status = '1'
                    that.id = '16'
                  }
                  that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId)
                }
              } else {
                that.$vux.loading.hide()
              }
            }).catch(error => {
                console.log(error.response)
              })
            }
        }, function (error) {
            // error callback
        }).catch(function (error) {
          })
      }
      }
    },
    methods: {
      onChange (val) {
        this.params.fApplyType = val
        if (this.params.fStartTime === '' || this.params.fEndTime === '') {

      } else {
        this.calcTime()
      }
      },
      changeStart (time) {
        if (this.params.fEndTime !== '') {
          if (this.params.fStartTime > this.params.fEndTime) {
            this.params.fStartTime = ''
          this.$vux.toast.text('开始时间不能大于结束时间', 'middle')
          }
          if (this.params.fApplyType === '') {

          } else {
            this.calcTime()
          }
        }
      },
      changeEnd (time) {
        if (this.params.fStartTime !== '') {
          if (this.params.fEndTime < this.params.fStartTime) {
            this.params.fEndTime = ''
          this.$vux.toast.text('结束时间不能大于开始时间', 'middle')
          }
          if (this.params.fApplyType === '') {

          } else {
            this.calcTime()
          }
        }
      },
      // 计算请假时长
      calcTime () {
        if (this.$route.params.outApply) {
          if (this.$route.params.id === '2') {
            calcApplyTime({
              emplNbr: this.params.emplNbr,
              startTime: this.params.fStartTime + ':00',
              endTime: this.params.fEndTime + ':00',
              vocationType: this.params.fApplyType,
            }).then(response => {
              if (response.data.success) {
                this.params.applyTime = String(response.data.rows[0])
              } else {
                this.$vux.toast.text(response.data.message, 'middle')
                this.params.applyTime = ''
            }
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          let WxUrlObj = {}
          let urlParamsArrays = window.location.href.split('?')
          if (urlParamsArrays[1]) {
          let urlParamsArray = urlParamsArrays[1].substring(1).split('&')
          urlParamsArray.forEach((item, index, array) => {
            let pos = item.indexOf('=')
            if (pos == '-1') {
            } else {
              WxUrlObj[item.split('=')[0]] = item.split('=')[1]
            }
          })
          if (WxUrlObj.fBillNo && WxUrlObj.fClassTypeId) {
            this.isMessage = true
            return
          } else {
            calcApplyTime({
                emplNbr: this.params.emplNbr,
                startTime: this.params.fStartTime + ':00',
                endTime: this.params.fEndTime + ':00',
                vocationType: this.params.fApplyType,
              }).then(response => {
                if (response.data.success) {
                  this.params.applyTime = String(response.data.rows[0])
                } else {
                  this.$vux.toast.text(response.data.message, 'middle')
                  this.params.applyTime = ''
              }
              }).catch(error => {
                console.log(error)
              })
          }
        } else {
          calcApplyTime({
              emplNbr: this.params.emplNbr,
              startTime: this.params.fStartTime + ':00',
              endTime: this.params.fEndTime + ':00',
              vocationType: this.params.fApplyType,
            }).then(response => {
              if (response.data.success) {
                this.params.applyTime = String(response.data.rows[0])
              } else {
                this.$vux.toast.text(response.data.message, 'middle')
                this.params.applyTime = ''
            }
            }).catch(error => {
              console.log(error)
            })
        }
        }
      },
      // 保存
      save: function () {
        if (this.params.applyTime === '') {
          this.$vux.toast.text('保存失败，无有效时长', 'middle')
        } else {
          this.applySubmit('save')
        }
      },
      // 提交
      submit: function () {
        if (this.params.applyTime === '') {
          this.$vux.toast.text('提交失败，无有效时长', 'middle')
        } else {
          this.applySubmit('submit')
        }
      },
      // 同意
      agree () {
        this.$vux.loading.show({text: '同意'})
        passWorkflowGoOut({
        'fBillNo': this.params.fBillNo,
        'fBiller': this.params.fBiller,
        'fClassTypeID': this.params.fClassTypeId,
        'fApprovalOpinion': this.params.fApprovalOpinion,
      }).then(response => {
          console.log(JSON.stringify(response))
          if (response.data.success) {
          this.$vux.loading.hide()
          this.$vux.toast.text(response.data.message, 'middle')
          this.goBack()
        } else {
          this.$vux.toast.text('同意失败', 'middle')
          this.$vux.loading.hide()
        }
        }).catch(error => {
          console.log(error.response)
        })
      },
      // 驳回
      refuse () {
        if (this.params.fApprovalOpinion === '') {
          this.$vux.toast.text('请输入驳回原因', 'middle')
          return
      } else {
          this.$vux.loading.show({text: '驳回'})
          rejectWorkflowGoOut({
          'fBillNo': this.params.fBillNo,
          'fBiller': this.params.fBiller,
          'fClassTypeID': this.params.fClassTypeId,
          'fApprovalOpinion': this.params.fApprovalOpinion,
          'Node': '',
        }).then(response => {
            console.log(JSON.stringify(response))
            if (response.data.success) {
            this.$vux.loading.hide()
            this.$vux.toast.text(response.data.message, 'middle')
            this.goBack()
          } else {
            this.$vux.toast.text('驳回失败', 'middle')
            this.$vux.loading.hide()
          }
          }).catch(error => {
            console.log(error.response)
          })
        }
      },
      // 召回
      revoke () {
        this.$vux.loading.show({text: '撤销中'})
        recallWorkflowGoOut({
        'fBillNo': this.params.fBillNo,
      }).then(response => {
          console.log(JSON.stringify(response))
          if (response.data.success) {
          this.$vux.loading.hide()
          this.$vux.toast.text(response.data.message, 'middle')
          this.goBack()
        } else {
          this.$vux.toast.text('撤销失败', 'middle')
          this.$vux.loading.hide()
        }
        }).catch(error => {
          console.log(error.response)
        })
      },
      // 保存提交数据
      applySubmit (status) {
        // this.params.status = status;
        if (this.params.fApplyType === '') {
          this.$vux.toast.text('请选择类型', 'middle')
        } else if (this.params.fStartTime === '') {
        this.$vux.toast.text('请输入开始时间', 'middle')
      } else if (this.params.fEndTime === '') {
        this.$vux.toast.text('请输入结束时间', 'middle')
      } else {
        if (status === 'save') {
            this.$vux.loading.show({text: '保存中'})
          } else {
            this.$vux.loading.show({text: '提交中'})
          }
        this.params.fStartTime = this.params.fStartTime
        this.params.fEndTime = this.params.fEndTime
        this.params.fApplyDate = formatDateTime(new Date(), 'dateTime')
        this.params.fid = status // 决定保存还是提交
        console.log('保存成功: ', JSON.stringify(this.params))
        saveOrSubmit(this.params).then(response => {
          if (response.data.success) {
              if (status === 'save') {
                this.$vux.loading.hide()
                this.saveSuccess = true
                this.$vux.toast.text('保存成功', 'middle')
                this.goBack()
              } else {
                this.$vux.loading.hide()
                this.$vux.toast.text('提交成功', 'middle')
                this.goBack()
              }
            } else {
              if (status === 'save') {
                this.saveSuccess = false
                this.$vux.loading.hide()
                this.$vux.toast.text('保存失败', 'middle')
              } else {
                this.$vux.loading.hide()
                this.$vux.toast.text('提交失败', 'middle')
              }
            }
        }).catch(error => {
            this.$vux.loading.hide()
            console.log(error.response)
          })
      }
      },
      // 获取历史
      getHistory (fBillNo, fClassTypeId) {
        GetWFApprove({
          'fBillNo': fBillNo,
          'fClassTypeID': fClassTypeId,
        }).then(response => {
          if (response.data.success) {
            this.approveHistoryList = response.data.rows
          } else {

          }
        })
      },
      // 判断是否为审批人
      checkApprover (fBillNo, fClassTypeId) {
        check({'fBillNo': fBillNo, 'fClassTypeId': fClassTypeId}).then(response => {
          if (response.data.success) {
            this.id = '4'
          this.fStatus = '1'
        } else {
            this.id = '16'
          this.fStatus = '1'
        }
        })
      },
      // 是否被审批
      isCheckStatus (fBillNo, fClassTypeId) {
        checkStatus({'fBillNo': fBillNo, 'fClassTypeId': fClassTypeId}).then(response => {
          if (response.data.success) {
            this.id = '4'
        } else {
            this.id = '16'
          this.getHistory(fBillNo, fClassTypeId)
          }
        })
      },
      goBack () {
        if (this.isMessage) {
          router.replace({ // 跳转到登录页面
            path: '/',
          })
        } else {
          let _this = this
          setTimeout(function () {
          _this.$router.go(-1)
        }, 1600)
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" lang="scss" rel="stylesheet/scss">

  .out-apply {
    .history-head {
      background: #239cda;
      height: 30px;
      line-height: 30px;
      text-align: left;
      color: white;
      font-size: 0.875rem;
      img {
        vertical-align: sub;
        padding-left: 12px;
        padding-right: 5px;
      }
    }
    .timeline-box {
      padding: 0.5rem;
      background: white;
      color: #666666;
      font-size: 0.875em;
      position: relative;

      ul {
        -webkit-padding-start: 26px;
      }

      ul > li {
        list-style: none;
        position: relative;
      }

      .process-cicrle-img {
        width: 15px;
        position: absolute;
        z-index: 10;
        left: -22px;
      }

      .time-tail-line {
        position: absolute;
        z-index: 9;
        height: 100%;
        width: 1px;
        transform: scaleX(0.5) scaleY(1);
        -webkit-transform: scaleX(0.5) scaleY(1);
        background: #ececec;
        left: -15px;
        top: 12px;
      }

      .time-tail-line-end {
        display: none;
      }

      .main-content {
        margin-bottom: 10px;

        .approve-img {
          width: 10px;
        }

        .time {
          padding-left: 5px;
        }

      }
      .desc-content {
        font-size: xx-small;
        text-align: left;
        color: #b0b0b0;
        /*margin-top: 5px;*/
      }

      .change-down-arrow {
        transform: rotate(180deg);
      }

      .change-up-arrow {
        transform: rotate(0deg);
      }

    }
  }

  .vux-label {
    display: block;
    word-wrap: break-word;
    word-break: break-all;
    text-align: left;
  }

  .out-apply .weui-select {
    float: right;
    width: auto;
  }

  .weui-label {
    font-size: 16px;
  }

  .out-apply .vux-selector.weui-cell_select-after {
    padding-left: 2px;

  }

  .weui-cell_select .weui-select {
    padding-right: 30px;
    color: #999999;
  }

  .out-apply .weui-cell {
    text-decoration: none;
  }

  .out-apply p {
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    font-size: 16px;
    color: #4c4c4c;
  }

  .out-apply .title {
    padding: 10px 15px;
  }

  .text-area {
    font-size: 15px;
    padding-top: 0px;
    &.weui-cell:before {
      border-top: none;
    }
  }

  .out-apply .revoke-button {
    background: #1793d7;
    color: white;
    position: fixed;
    z-index: 11;
    bottom: -2px;
    border-radius: 0;
  }

</style>
