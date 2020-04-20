<template>
  <div class="exception-apply">

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
             :class="{'change-up-arrow': !showDetailHistory}">
      </div>
    </div>

    <group style="margin-top: -21px">

      <selector style="margin-left: -7px" placeholder="补卡类型" v-model="params.reissueCardType" title="申请类型"
                name="district" :options="list" @on-change="onChange"
                :readonly="this.status==='1' || this.selectType"></selector>

      <datetime :readonly="this.status ==='1'" :title="'补卡时间'" format="YYYY-MM-DD HH:mm"
                v-model="params.fReissueCardDate"></datetime>

      <cell readonly :title="'补卡原因'"></cell>

      <x-textarea :readonly="this.status ==='1'" class="text-area" autosize :max="200"
                  v-model="params.reissueCardReason"></x-textarea>

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

<script type="text/ecmascript-6">

  import WX_CONFIGS from '@/utils/wx-config';
  import {XButton, Selector, Group, Datetime, XTextarea, Cell, Flexbox, FlexboxItem, Divider} from 'vux'
  import footButton from 'components/out-apply/foot-button.vue';
  import {saveOrSubmit, clockAgree, clockReject, clockRecall, getItemFillClock} from '@/api/exception'
  import {GetWFApprove} from '@/api/my-approve'
  import {formatDateTime} from '@/utils/common'
  import axios from 'axios'
  import router from '@/router'
  import {check, checkStatus} from '@/api/my-apply';

  export default {
    name: 'exceptionApply',
    components: {
      XButton, Selector, Group, Datetime, XTextarea, footButton, Cell, Flexbox, FlexboxItem, Divider
    },
    data () {
      return {
        isMessage: false, //是否是消息推送
        saveSuccess: false,
        showDetailHistory: true,
        selectType: false,
        id: "2",
        status: "0",
        fStatus: "4",
        exception: "",
        params: {
          fBillNo: Date.parse(new Date()), //单据编号
          fApplyDate: "",                  //申请时间
          fReissueCardDate: "",            //补卡时间 值列表：上班补卡，下班补卡
          reissueCardType: "",             //补卡类型
          reissueCardReason: "",           //补卡原因
          fid: "",                         //(决定保存还是提交) 固定值 save 或者submit
          backoutReason: "",               //撤回原因
          fApprovalOpinion: "",            //同意驳回意见
          fBiller: "",                     //驳回人
          fClassTypeId: "",                //单据类别
          Node: "",                        //驳回结点名称
        },
        list: [{key: 'startWork', value: '上班卡'}, {key: 'offWork', value: '下班卡'}],
        approveHistoryList: [],
      }
    },
    created() {
      // 审批状态id （2：初始  4：进行中 16：结束  32：中止）
      // status  0 可编辑; 1 不可编辑;
      if (this.$route.params.item) {//异常补卡
        if (this.$route.params.item.reason === "缺下班卡") {
          this.params.reissueCardType = "offWork";
          this.selectType = true;
        } else if (this.$route.params.item.reason === "缺卡") {
          this.params.reissueCardType = "startWork";
          this.selectType = true;
        }
      } else if (this.$route.params.exceptionApply) {//异常信息修改
//        if (this.$route.params.fStatus === "4") {
//          this.fStatus = "4";
//        } else if (this.$route.params.fStatus === "1") {
//          this.fStatus = "1";
//        }
//        if (this.$route.params.id === "2") {
//          this.id = "2";
//        } else if (this.$route.params.id === "4") {
//          this.id = "4";
//          this.status = "1";
//        } else if (this.$route.params.id === "16") {
//          this.id = "16";
//          this.status = "1";
//          GetWFApprove({
//            "fBillNo": this.$route.params.exceptionApply.fBillNo,
//            "fClassTypeID": this.$route.params.exceptionApply.fClassTypeId
//          }).then(response => {
//            console.log(JSON.stringify(response));
//            if (response.data.success) {
//              this.approveHistoryList = response.data.rows;
//            } else {
//            }
//          });
//        }

        if (this.$route.params.fStatus === "4") {//4 我的申请
          this.fStatus = "4";
          if (this.$route.params.id === "2") { //待提交  保存 提交
            this.status = "0";
            this.id = "2";
          } else if (this.$route.params.id === "4") { //审批中 撤回
            this.status = "1";
            this.isCheckStatus(this.$route.params.exceptionApply.fBillNo, this.$route.params.exceptionApply.fClassTypeId);
          } else if (this.$route.params.id === "16") { //已审批 查看历史
            this.status = "1";
            this.id = "16";
            this.getHistory(this.$route.params.exceptionApply.fBillNo, this.$route.params.exceptionApply.fClassTypeId);
          }
        } else if (this.$route.params.fStatus === "2") { //2已审批的
          this.fStatus = "2";
          this.status = "1";
          this.id = "16";
          this.getHistory(this.$route.params.exceptionApply.fBillNo, this.$route.params.exceptionApply.fClassTypeId);
        } else if (this.$route.params.fStatus === "1") { //1我待批的
          this.getHistory(this.$route.params.exceptionApply.fBillNo, this.$route.params.exceptionApply.fClassTypeId);
          if (this.$route.params.id === "4") { //审批
            this.fStatus = "1";
            this.status = "1";
            this.id = "4";
          }
          this.getHistory(this.$route.params.exceptionApply.fBillNo, this.$route.params.exceptionApply.fClassTypeId);
        }

        let exceptionItem = this.$route.params.exceptionApply;
        this.params.fBillNo = exceptionItem.fBillNo;
        this.params.fApplyDate = exceptionItem.fApplyDate;
        this.params.fReissueCardDate = exceptionItem.fReissueCardDate;
        this.params.reissueCardType = exceptionItem.fApplyType;
        this.params.reissueCardReason = exceptionItem.reissueCardReason;
        this.params.fBiller = exceptionItem.fBiller;
        this.params.fClassTypeId = exceptionItem.fClassTypeId;
      }
    },
    mounted(){
      if (window.location.hostname === 'localhost') {
        return;
      } else {
        let WxUrlObj = {};
        let urlParamsArrays = window.location.href.split('?');
        let urlParamsArray = urlParamsArrays[1].substring(1).split('&');
        urlParamsArray.forEach((item, index, array) => {
          let pos = item.indexOf('=');
          if (pos == '-1') {
          } else {
            WxUrlObj[item.split('=')[0]] = item.split('=')[1];
          }
        });
        let that = this;
        if (WxUrlObj.fBillNo && WxUrlObj.fClassTypeId) {
          that.isMessage = true;
          let loginUrl = 'http://60.191.94.124:8092/core/oauth/token?client_id=client' +
            '&client_secret=secret&grant_type=password&username=' + WxUrlObj.code + '&password=' + WxUrlObj.code;
          let instance = axios.create({
            timeout: 30000,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });
          instance.post(loginUrl).then(function (response) {
            // success callback
            if (response && response.data && typeof response.data === 'object' && response.data.access_token) {
              window.localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
              getItemFillClock({"fBillNo": WxUrlObj.fBillNo,}).then(response => {
                if (response.data.success) {
                  that.$vux.loading.hide();
                  that.$vux.toast.text(response.data.message, 'middle');
                  that.params.fBillNo = response.data.rows[0].fBillNo;
                  that.params.fApplyDate = response.data.rows[0].fApplyDate;
                  that.params.fReissueCardDate = response.data.rows[0].fReissueCardDate;
                  that.params.reissueCardType = response.data.rows[0].fApplyType;
                  that.params.reissueCardReason = response.data.rows[0].reissueCardReason;
                  that.params.fBiller = response.data.rows[0].fBiller;
                  that.params.fClassTypeId = response.data.rows[0].fClassTypeId;

                  if (WxUrlObj.fStatus === "4") {//4 我的申请
                    that.fStatus = "4";
                    if (response.data.rows[0].fMultiCheckStatus === "2") { //待提交  保存 提交
                      that.status = "0";
                      that.id = "2";
                    } else if (response.data.rows[0].fMultiCheckStatus === "4") { //审批中 撤回
                      that.status = "1";
                      that.isCheckStatus(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                    } else if (response.data.rows[0].fMultiCheckStatus === "16") { //已审批 查看历史
                      that.status = "1";
                      that.id = "16";
                      that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                    }
                  } else if (WxUrlObj.fStatus === "2") { //2已审批的
                    that.fStatus = "2";
                    that.status = "1";
                    that.id = "16";
                    that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                  } else if (WxUrlObj.fStatus === "1") { //1我待批的
                    if (response.data.rows[0].fMultiCheckStatus === "4") { //审批
                      that.status = "1";
                      that.checkApprover(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                    } else if (response.data.rows[0].fMultiCheckStatus === "16") { //已审批 查看历史
                      that.status = "1";
                      that.id = "16";
                    }
                    that.getHistory(WxUrlObj.fBillNo, WxUrlObj.fClassTypeId);
                  }

                } else {
                  that.$vux.loading.hide();
                }
              }).catch(error => {
                console.log(error.response);
              });
            }
          }, function (error) {
            //error callback
          }).catch(function (error) {
          })
        }
      }
    },
    methods: {
      onChange (val) {
        console.log(val)
      },
      //异常补卡保存
      save: function () {
        if (this.params.reissueCardType === "") {
          this.$vux.toast.text('请输入补卡类型', 'middle');
        } else if (this.params.fReissueCardDate === "") {
          this.$vux.toast.text('请输入补卡时间', 'middle');
        } else {
          this.$vux.loading.show({text: '保存中'});
          this.applySubmit("save");
        }
      },
      //异常补卡提交
      submit: function () {
        if (this.params.reissueCardType === "") {
          this.$vux.toast.text('请输入补卡类型', 'middle');
        } else if (this.params.fReissueCardDate === "") {
          this.$vux.toast.text('请输入补卡时间', 'middle');
        } else {
          this.$vux.loading.show({text: '提交中'});
          this.applySubmit("submit");
        }
      },
      //同意
      agree() {
        this.$vux.loading.show({text: '同意'});
        clockAgree({
          "fBillNo": this.params.fBillNo,
          "fBiller": this.params.fBiller,
          "fClassTypeID": this.params.fClassTypeId,
          "fApprovalOpinion": this.params.fApprovalOpinion,
        }).then(response => {
          console.log(JSON.stringify(response));
          if (response.data.success) {
            this.$vux.loading.hide();
            this.$vux.toast.text(response.data.message, 'middle');
            this.goBack();
          } else {
            this.$vux.toast.text("同意失败", 'middle');
            this.$vux.loading.hide();
          }
        }).catch(error => {
          console.log(error.response);
        });
      },
      //驳回
      refuse() {
        if (this.params.fApprovalOpinion === "") {
          this.$vux.toast.text('请输入驳回原因', 'middle');
          return;
        } else {
          this.$vux.loading.show({text: '驳回'});
          clockReject({
            "fBillNo": this.params.fBillNo,
            "fBiller": this.params.fBiller,
            "fClassTypeID": this.params.fClassTypeId,
            "fApprovalOpinion": this.params.fApprovalOpinion,
            "Node": "",
          }).then(response => {
            console.log(JSON.stringify(response));
            if (response.data.success) {
              this.$vux.loading.hide();
              this.$vux.toast.text(response.data.message, 'middle');
              this.goBack();
            } else {
              this.$vux.toast.text("驳回失败", 'middle');
              this.$vux.loading.hide();
            }
          }).catch(error => {
            console.log(error.response);
          });
        }
      },
      //召回
      revoke(){
        this.$vux.loading.show({text: '撤销中'});
        clockRecall({
          "fBillNo": this.params.fBillNo
        }).then(response => {
          console.log(JSON.stringify(response));
          if (response.data.success) {
            this.$vux.loading.hide();
            this.$vux.toast.text(response.data.message, 'middle');
            this.goBack();
          } else {
            this.$vux.toast.text("撤销失败", 'middle');
            this.$vux.loading.hide();
          }
        }).catch(error => {
          console.log(error.response);
        });
      },
      //保存提交数据
      applySubmit (status) {
        this.params.fApplyDate = formatDateTime(new Date(), "dateTime");
        this.params.fid = status;
        console.log("保存成功: ", JSON.stringify(this.params));
        saveOrSubmit(this.params).then(response => {
          console.log(JSON.stringify(response));
          if (response.data.success) {
            if (status === 'save') {
              this.$vux.loading.hide();
              this.$vux.toast.text('保存成功', 'middle');
              this.saveSuccess = true;
              this.goBack();
            } else {
              this.$vux.loading.hide();
              this.$vux.toast.text('提交成功', 'middle');
              this.goBack();
            }
          } else {
            if (status === 'save') {
              this.$vux.loading.hide();
              this.$vux.toast.text('保存失败', 'middle');
              this.saveSuccess = false;
            } else {
              this.$vux.loading.hide();
              this.$vux.toast.text('提交失败', 'middle');
              let _this = this;
            }
          }
        }).catch(error => {
          this.$vux.loading.hide();
          console.log(error.response);
        });
      },
      //获取历史
      getHistory(fBillNo, fClassTypeId){
        GetWFApprove({
          "fBillNo": fBillNo,
          "fClassTypeID": fClassTypeId
        }).then(response => {
          if (response.data.success) {
            this.approveHistoryList = response.data.rows;
          } else {

          }
        });
      },
      //判断是否为审批人
      checkApprover(fBillNo, fClassTypeId){
        check({"fBillNo": fBillNo, "fClassTypeId": fClassTypeId}).then(response => {
          if (response.data.success) {
            this.id = "4";
            this.fStatus = "1";
          } else {
            this.id = "16";
            this.fStatus = "1";
          }
        });
      },
      //是否被审批
      isCheckStatus(fBillNo, fClassTypeId){
        checkStatus({"fBillNo": fBillNo, "fClassTypeId": fClassTypeId}).then(response => {
          if (response.data.success) {
            this.id = "4";
          } else {
            this.id = "16";
            this.getHistory(fBillNo, fClassTypeId);
          }
        });
      },
      goBack(){
        if (this.isMessage) {
          router.replace({ //跳转到登录页面
            path: '/',
          });
        } else {
          let _this = this;
          setTimeout(function () {
            _this.$router.go(-1);
          }, 1600);
        }
      }
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" lang="scss" rel="stylesheet/scss">

  .exception-apply {
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

  .exception-apply .weui-select {
    float: right;
    width: auto;
    color: #999999;
  }

  .vux-label {
    display: block;
    word-wrap: break-word;
    word-break: break-all;
    text-align: left;
  }

  .weui-label {
    font-size: 16px;
    color: #4c4c4c;
  }

  .exception-apply .vux-selector.weui-cell_select-after {
    padding-left: 2px;
  }

  .exception-apply .weui-cell {
    text-decoration: none;
  }

  .exception-apply p {
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    font-size: 16px;
    color: #4c4c4c;
  }

  .exception-apply .title {
    padding: 10px 15px;
  }

  .text-area {
    font-size: 15px;
    padding-top: 0px;
    &.weui-cell:before {
      border-top: none;
    }
  }

  .exception-apply .revoke-button {
    background: #1793d7;
    color: white;
    position: fixed;
    z-index: 11;
    bottom: -2px;
    border-radius: 0;
  }

</style>
